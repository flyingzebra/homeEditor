// Phase 4: browser-only tests. Open test/OneWireDiagram_tests.html to run both suites.
// To run this suite manually from tools/OneWireDiagram.html:
// var s = document.createElement('script'); s.src = '../test/OneWirePhase4RegressionTest.js'; document.head.appendChild(s);
// Tests require no Node.js, test framework, server, or network connection.
function runOneWirePhase4RegressionTests()
{
    var results = [];

    function assert(value, message)
    {
        if (!value)
        {
            throw new Error(message);
        }
    }

    function check(name, callback)
    {
        try
        {
            callback();
            results.push({ test: name, status: 'PASS' });
        }
        catch (error)
        {
            results.push({ test: name, status: 'FAIL', error: String(error) });
        }
    }

    check('English translations and locale', function()
    {
        assert(_T('menu_new') === 'New', 'New menu is not English');
        assert(_T('title1') === 'Example 1', 'Example title is not English');
        assert(_T('add_first_object').indexOf('Add the first') === 0, 'Add-item caption is not English');
        assert(oTranslation.t._language === 'EN', 'Locale is not EN');
        assert(_T('', 'inv').New === 'menu_new', 'Reverse translation changed');
    });

    check('Legacy EDS enum contract', function()
    {
        var oItem = new ElectroItem();
        assert(oItem.getKey('lichtkring_poligheid') === 'enkelpolig', 'Stored switch type was translated');
        assert(oItem.getKey('zekering') === 'automatisch', 'Stored fuse type was translated');
        assert(oItem.keys.some(function(row) { return row[0] === 'naam'; }), 'Original EDS keys were translated');
        assert(_T('single_pole') === 'enkelpolig', 'Legacy switch lookup changed');
        assert(Electro_Item === ElectroItem, 'Legacy constructor alias changed');
    });

    check('English options preserve Dutch values', function()
    {
        var oHost = document.createElement('div');
        oHost.innerHTML = '<select><option value="Bord">Bord</option>' +
            '<option value="Kring">Kring</option><option value="automatisch">automatisch</option>' +
            '<option value="enkelpolig">enkelpolig</option></select>';
        oOneWireEnglish.translateNode(oHost);
        var aOptions = oHost.getElementsByTagName('option');
        assert(aOptions[0].value === 'Bord' && aOptions[0].textContent === 'Distribution board', 'Board value/label mismatch');
        assert(aOptions[1].value === 'Kring' && aOptions[1].textContent === 'Circuit', 'Circuit value/label mismatch');
        assert(aOptions[2].value === 'automatisch' && aOptions[2].textContent === 'Automatic', 'Fuse value/label mismatch');
        assert(aOptions[3].value === 'enkelpolig' && aOptions[3].textContent === 'Single-pole', 'Switch value/label mismatch');
    });

    check('English form captions', function()
    {
        var oHost = document.createElement('div');
        oHost.innerHTML = '<span>Geaard: </span><span> Kinderveiligheid: </span><span>Aantal lichtpunten:</span>';
        oOneWireEnglish.translateNode(oHost);
        assert(oHost.textContent.indexOf('Earthed:') >= 0, 'Earthed caption missing');
        assert(oHost.textContent.indexOf('Child safety:') >= 0, 'Child safety caption missing');
        assert(oHost.textContent.indexOf('Number of light points:') >= 0, 'Light points caption missing');
    });

    check('Default diagram, SVG and EDS round trip', function()
    {
        reset_all();
        assert(oHierarchicalList === structure, 'Primary and legacy references differ');
        assert(oHierarchicalList.data.length > 0, 'Default diagram is empty');
        var before = JSON.stringify(oHierarchicalList);
        var svg = oHierarchicalList.toSVG(0, 'horizontal').data;
        assert(svg.indexOf('<svg') >= 0, 'SVG rendering failed');
        import_to_structure(before);
        var after = JSON.stringify(oHierarchicalList);
        assert(after === before, 'EDS round-trip changed serialized data');
        assert(oHierarchicalList === structure, 'Legacy structure reference lost after import');
    });

    check('Add, delete and redraw', function()
    {
        reset_all();
        var initial = oHierarchicalList.length;
        HLAdd();
        assert(oHierarchicalList.length === initial + 1, 'Add-item operation failed');
        var added = oHierarchicalList.data[oHierarchicalList.length - 1].id;
        HLDelete(added);
        assert(oHierarchicalList.active[oHierarchicalList.length - 1] === false, 'Delete-item operation failed');
        assert(document.getElementById('right_col_inner').innerHTML.indexOf('<svg') >= 0, 'Redraw failed');
    });

    check('Top-menu downloads, action tooltips and no drawing legend', function()
    {
        var oMenu = document.getElementById('minitabs');
        var aLinks = Array.prototype.slice.call(oMenu.querySelectorAll('a'));
        var oExport = document.getElementById('export-eds');
        var oHTML = document.getElementById('download-html');
        var oSVG = document.getElementById('download-svg');
        assert(oExport && oHTML && oSVG, 'Top-menu download actions are missing');
        assert(aLinks.indexOf(oHTML) === aLinks.indexOf(oExport) + 1 &&
            aLinks.indexOf(oSVG) === aLinks.indexOf(oHTML) + 1, 'Download links are not next to Export');
        assert(oHTML.getAttribute('href') === "javascript:download('html')", 'HTML download handler changed');
        assert(oSVG.getAttribute('href') === "javascript:download('svg')", 'SVG download handler changed');
        aLinks.forEach(function(oLink)
        {
            assert(oLink.title.length > 0, 'Missing top-menu tooltip');
        });

        reset_all();
        var oDrawing = document.getElementById('right_col_inner');
        assert(oDrawing.querySelector('svg'), 'Electrical diagram no longer renders');
        assert(!oDrawing.querySelector('button'), 'Download buttons or legend remain in drawing');
        assert(!oDrawing.querySelector('h2'), 'Bottom legend heading remains');

        var aButtons = document.querySelectorAll('#left_col_inner button');
        assert(aButtons.length >= 4, 'Electrical item action buttons are missing');
        for (var i = 0; i < aButtons.length; i++)
        {
            assert(aButtons[i].title.length > 0, 'Missing electrical item button tooltip');
            assert(aButtons[i].getAttribute('aria-label') === aButtons[i].title,
                'Electrical item action button accessibility label differs from tooltip');
        }
    });

    check('Standalone dependencies and controller API', function()
    {
        assert(typeof pako !== 'undefined' && typeof pako.inflateRaw === 'function', 'Local Pako unavailable');
        assert(typeof oOneWireController.importToStructure === 'function', 'Controller import method missing');
        assert(typeof oOneWireController.exportJSON === 'function', 'Controller export method missing');
        var aScripts = document.getElementsByTagName('script');
        for (var i = 0; i < aScripts.length; i++)
        {
            assert(!/^https?:\/\//i.test(aScripts[i].src), 'External script dependency: ' + aScripts[i].src);
        }
    });

    check('English start screen', function()
    {
        restart_all();
        var html = document.getElementById('configsection').innerHTML;
        assert(html.indexOf('Design a single-line') >= 0, 'Start-screen instructions not translated');
        assert(html.indexOf('Example 1') >= 0, 'Example choice not translated');
    });

    if (console.table)
    {
        console.table(results);
    }
    else
    {
        console.log(results);
    }
    console.log('OneWire Phase 4:', results.filter(function(item) { return item.status === 'PASS'; }).length,
        '/', results.length, 'tests passed');
    return results;
}

window.oneWirePhase4Results = runOneWirePhase4RegressionTests();
