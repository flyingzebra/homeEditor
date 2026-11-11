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

    check('Unrestricted introduction, 300px scrolling editor and no drawing version footer', function()
    {
        restart_all();
        var oConfiguration = document.getElementById('configsection');
        assert(getComputedStyle(oConfiguration).height !== '300px', 'Introduction is incorrectly restricted to 300px');
        assert(getComputedStyle(oConfiguration).overflowY === 'visible', 'Introduction should use its natural height');
        assert(getComputedStyle(document.querySelector('.slider_overlay')).overflowY === 'auto',
            'Long introduction cannot scroll within the page');

        reset_all();
        var oEditor = document.getElementById('left_col_inner');
        assert(getComputedStyle(oEditor).height === '300px', 'Editor area is not 300px high');
        assert(getComputedStyle(oEditor).overflowY === 'auto', 'Editor is not vertically scrollable');
        assert(getComputedStyle(oConfiguration).height !== '300px', 'Empty configuration area did not collapse');
        assert(document.getElementById('right_col_inner').textContent.indexOf(CONF_builddate) < 0,
            'Build/version footer remains beneath the diagram');
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

    check('Every electrical item and circuit has a text field', function()
    {
        var aTypes = ['Bord', 'Kring', 'Splitsing', 'Meerdere verbruikers',
            'Leeg', 'Vrije tekst', 'Stopcontact', 'Lichtcircuit', 'Boiler',
            'Diepvriezer', 'Droogkast', 'Elektrische oven', 'Koelkast',
            'Kookfornuis', 'Microgolfoven', 'Wasmachine', 'Ventilator',
            'Verwarmingstoestel', 'Vaatwasmachine', 'Transformator'];
        aTypes.forEach(function(sType)
        {
            var oItem = new ElectroItem();
            oItem.id = 42;
            oItem.setKey('type', sType);
            assert(oItem.getKey('text') === '', 'Text missing on ' + sType);
            assert(oItem.toHTML().indexOf('HL_edit_42_text') >= 0,
                'Text input missing on ' + sType);
        });
    });

    check('Labels reserve spacing and escape XML', function()
    {
        var oItem = new ElectroItem();
        oItem.setKey('type', 'Koelkast');
        var oBefore = oItem.toSVG(false);
        oItem.setKey('text', 'Kitchen & storage <north>');
        var oAfter = oItem.toSVG(false);
        assert(oAfter.data.indexOf('onewire-element-text') >= 0, 'Element label missing');
        assert(oAfter.data.indexOf('Kitchen &amp; storage &lt;north&gt;') >= 0, 'Unsafe SVG text');
        assert(oAfter.yup > oBefore.yup, 'No vertical spacing');
        assert(oAfter.xleft + oAfter.xright > oBefore.xleft + oBefore.xright,
            'No horizontal spacing for long text');
    });

    check('Circuit labels rotate 90 degrees CCW and persist in EDS', function()
    {
        reset_all();
        var oCircuit = oHierarchicalList.data.find(function(oItem)
        {
            return oItem.getKey('type') === 'Kring';
        });
        assert(!!oCircuit, 'Default diagram has no circuit');
        oCircuit.setKey('text', 'Office lights & sockets');
        var sSVG = oHierarchicalList.toSVG(0, 'horizontal').data;
        assert(sSVG.indexOf('onewire-circuit-text') >= 0, 'Circuit text missing');
        assert(sSVG.indexOf('rotate(-90') >= 0, 'Text not rotated CCW');
        assert(sSVG.indexOf('Office lights &amp; sockets') >= 0, 'Circuit text not escaped');
        var sEDS = JSON.stringify(oHierarchicalList);
        import_to_structure(sEDS);
        assert(JSON.stringify(oHierarchicalList) === sEDS, 'EDS round-trip lost text');
        var oOld = JSON.parse(sEDS);
        oOld.data.forEach(function(oItem)
        {
            oItem.keys = oItem.keys.filter(function(aKey) { return aKey[0] !== 'text'; });
        });
        import_to_structure(JSON.stringify(oOld));
        assert(oHierarchicalList.data.every(function(oItem)
        {
            return oItem.getKey('text') === '';
        }), 'Legacy EDS documents should have blank labels');
    });

    check('Multiple-load groups render their text above the group', function()
    {
        var oCircuit = new ElectroItem();
        oCircuit.setKey('type', 'Kring');
        var oTree = new HierarchicalList();
        oTree.addItem(oCircuit);
        var oGroup = new ElectroItem(oCircuit);
        oGroup.setKey('type', 'Meerdere verbruikers');
        oTree.insertChildAfterId(oGroup, oCircuit.id);
        oGroup.setKey('text', 'Kitchen group');
        var sSVG = oTree.toSVG(0, 'horizontal').data;
        assert(sSVG.indexOf('Kitchen group') >= 0 &&
            sSVG.indexOf('onewire-element-text') >= 0, 'Group label missing');
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
