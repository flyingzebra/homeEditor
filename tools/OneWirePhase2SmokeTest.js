// homeEditor OneWireDiagram Phase 2 smoke tests.
// After opening tools/OneWireDiagram.html directly in a browser, inject this
// optional script through the developer console:
// var s = document.createElement('script'); s.src = 'OneWirePhase2SmokeTest.js'; document.head.appendChild(s);
// No server, third-party test runner, or network connection is required.

function runOneWirePhase2SmokeTests()
{
    var results = [];

    function check(name, operation)
    {
        try
        {
            operation();
            results.push({ test: name, status: 'PASS' });
        }
        catch (error)
        {
            results.push({ test: name, status: 'FAIL', error: String(error) });
        }
    }

    function assert(condition, message)
    {
        if (!condition)
        {
            throw new Error(message);
        }
    }

    check('Translation API and instance state', function()
    {
        var a = new Translation();
        var b = new Translation();
        assert(a.t !== b.t, 'Translation instances share mutable state');
        assert(_T('menu_new') === 'Nieuw', 'Translation lookup has changed');
        assert(_T('menu_new', 'cap') === 'Nieuw', 'Capitalization has changed');
        var inverse = _T('', 'inv');
        assert(inverse.Nieuw === 'menu_new', 'Inverse translation lookup failed');
    });

    check('Constructors and independent instances', function()
    {
        var a = new HierarchicalList();
        var b = new HierarchicalList();
        assert(a.data !== b.data, 'HierarchicalList data arrays are shared');
        assert(a.active !== b.active, 'HierarchicalList active arrays are shared');
        assert(a.id !== b.id, 'HierarchicalList ID arrays are shared');
        var first = new ElectroItem();
        var second = new ElectroItem();
        assert(first.keys !== second.keys, 'ElectroItem keys are shared');
        assert(List_Item === ListItem, 'Legacy ListItem alias is broken');
        assert(Electro_Item === ElectroItem, 'Legacy ElectroItem alias is broken');
        assert(Hierarchical_List === HierarchicalList, 'Legacy HierarchicalList alias is broken');
    });

    check('SVG object ownership and compatibility', function()
    {
        var a = new HierarchicalList();
        assert(Object.prototype.hasOwnProperty.call(a, 'outputSVGDefs'), 'SVG method is missing from the instance');
        assert(!Object.prototype.hasOwnProperty.call(HierarchicalList.prototype, 'outputSVGDefs'), 'Legacy prototype patch remains');
        assert(typeof oDiagramSVGAssets.outputSVGDefs === 'function', 'SVG assets API unavailable');
        assert(a.outputSVGDefs().indexOf('<defs>') >= 0, 'SVG definitions unavailable');
        assert(SVGelement === DiagramSVG, 'Legacy SVG constructor alias is broken');
        assert(new DiagramSVG().data === '', 'SVG data default changed');
    });

    check('Controller methods and legacy global entry points', function()
    {
        var aliases = {
            'quotesvg':'quoteSVG', 'restart_all':'restartAll', 'importclicked':'importClicked',
            'importjson':'importJSON', 'exportjson':'exportJSON', 'popUp':'popUp',
            'load_schema':'loadSchema', 'download':'download', 'import_to_structure':'importToStructure',
            'HLCollapseExpand':'collapseExpand', 'HLDelete':'deleteItem', 'HLAdd':'addItem',
            'HLInsertBefore':'insertBefore', 'HLInsertAfter':'insertAfter',
            'HLInsertChild':'insertChild', 'HLUpdate':'updateItem', 'HLRedrawTree':'redrawTree',
            'HLRedrawTreeHTML':'redrawTreeHTML', 'HLRedrawTreeSVG':'redrawTreeSVG',
            'reset_all':'resetAll'
        };
        Object.keys(aliases).forEach(function(name)
        {
            assert(typeof window[name] === 'function', 'Missing global entry point: ' + name);
            assert(typeof oOneWireController[aliases[name]] === 'function', 'Missing controller method: ' + name);
        });
    });

    check('Diagram creation, SVG and EDS round trip', function()
    {
        reset_all();
        assert(oHierarchicalList instanceof HierarchicalList, 'No primary diagram instance');
        assert(oHierarchicalList === structure, 'Legacy structure alias not synchronized');
        assert(oHierarchicalList.data.length > 0, 'Default diagram empty');
        var before = oHierarchicalList.data.length;
        var svg = oHierarchicalList.toSVG(0, 'horizontal').data;
        assert(svg.indexOf('<svg') >= 0, 'SVG rendering failed');
        var eds = JSON.stringify(oHierarchicalList);
        import_to_structure(eds);
        assert(oHierarchicalList.data.length === before, 'EDS round-trip changed item count');
        assert(oHierarchicalList === structure, 'EDS import alias not synchronized');
    });

    if (console.table)
    {
        console.table(results);
    }
    else
    {
        console.log(results);
    }
    console.log('OneWire Phase 2:', results.filter(function(item) { return item.status === 'PASS'; }).length,
                '/', results.length, 'checks passed');
    return results;
}

runOneWirePhase2SmokeTests();
