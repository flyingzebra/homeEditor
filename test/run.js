function runSmokeTests()
{
    var results = [];
    var firstEditor = new Editor();
    var secondEditor = new Editor();
    results.push(recordSmokeTest('Editor uses independent method instances', firstEditor.wall !== secondEditor.wall));
    results.push(recordSmokeTest('Existing editor singleton remains available', editor instanceof Editor));

    var a = new firstEditor.wall({ x: 1, y: 2 }, { x: 4, y: 6 }, 'normal', 20);
    var b = new firstEditor.wall({ x: 0, y: 0 }, { x: 5, y: 5 }, 'normal', 8);
    a.coords.push({ x: 10, y: 10 });
    results.push(recordSmokeTest('Wall instances have independent mutable state',
        b.coords.length === 0 && a.thick === 20 && b.thick === 8));

    var firstSVG = new QSVG();
    var secondSVG = new QSVG();
    results.push(recordSmokeTest('QSVG uses independent method instances', firstSVG.measure !== secondSVG.measure));
    results.push(recordSmokeTest('Existing qSVG singleton remains available', qSVG instanceof QSVG));
    results.push(recordSmokeTest('QSVG equation calculation works', qSVG.createEquation(0, 0, 10, 10).A === 1));
    results.push(recordSmokeTest('QSVG point distance works',
        qSVG.pDistance({ x: 5, y: 4 }, { x: 0, y: 0 }, { x: 10, y: 0 }).distance === 4));

    document.getElementById('test-plan').click();
    results.push(recordSmokeTest('HTML data-action reaches original application callback',
        smokePlanRequests.length === 1 && smokePlanRequests[0] === 'newSquare'));

    var input = document.getElementById('test-focus');
    input.focus();
    results.push(recordSmokeTest('Focus action clears input as before', input.textContent === ''));

    results.push(recordSmokeTest('No jQuery global is required',
        typeof window.jQuery === 'undefined' && typeof window.$ === 'undefined'));

    var svgGroup = qSVG.create('none', 'g');
    var svgLine = qSVG.create('none', 'line', { x1: 10, y1: 15 });
    svgGroup.append(svgLine);
    results.push(recordSmokeTest('qSVG.create returns a native SVG element',
        svgGroup instanceof SVGElement && svgLine instanceof SVGElement));
    results.push(recordSmokeTest('Native SVG append moves the child into the group',
        svgGroup.firstElementChild === svgLine));

    setSVGAttributes(svgLine, { x2: 42, 'stroke-width': 2 });
    results.push(recordSmokeTest('SVG attributes use native setAttribute',
        svgLine.getAttribute('x2') === '42' && svgLine.getAttribute('stroke-width') === '2'));

    var hidden = document.createElement('div');
    hidden.style.display = 'none';
    document.body.append(hidden);
    setElementVisible(hidden, true);
    results.push(recordSmokeTest('Native show works for previously hidden elements',
        getComputedStyle(hidden).display !== 'none'));
    toggleElementVisible(hidden);
    results.push(recordSmokeTest('Native toggle hides visible elements',
        getComputedStyle(hidden).display === 'none'));
    hidden.remove();

    results.push(recordSmokeTest('Native DOM helpers accept absent optional elements',
        setElementVisible(null, false) === undefined && toggleElementVisible(null) === undefined));

    var modal = document.getElementById('testModal');
    var hiddenEvents = 0;
    modal.addEventListener('editor-modal-hidden', function() { hiddenEvents++; });
    showEditorModal('testModal');
    results.push(recordSmokeTest('Native modal shows with an accessible backdrop',
        modal.style.display === 'block' && modal.getAttribute('aria-modal') === 'true' &&
        document.querySelectorAll('.modal-backdrop').length === 1));

    document.getElementById('test-dismiss').click();
    results.push(recordSmokeTest('Modal dismiss button hides the dialog',
        modal.style.display === 'none' && !document.querySelector('.modal-backdrop')));
    results.push(recordSmokeTest('Modal dismissal emits the editor hidden event', hiddenEvents === 1));

    showEditorModal('testModal');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    results.push(recordSmokeTest('Escape closes a native modal',
        modal.style.display === 'none' && hiddenEvents === 2));

    showEditorModal('testModal');
    hideEditorModal('testModal');
    results.push(recordSmokeTest('Programmatic modal close is idempotent',
        modal.style.display === 'none' && hiddenEvents === 3 &&
        !document.body.classList.contains('modal-open')));

    // IEC 60364 review is a checklist, not a French room-count evaluator.
    var iecReview = new IEC60364Review();
    var rooms = [{ name: 'Kitchen' }, { name: 'Bathroom' }, { name: '' }];
    var inventory = [
        { switch: 1, plug: 0, plug20: 0, plug32: 0, light: 1 },
        { switch: 0, plug: 1, light: 1 },
        { switch: 0, plug: 0, light: 0 }
    ];
    var assessment = iecReview.evaluate(rooms, inventory);
    var reviewHTML = iecReview.render(assessment);
    results.push(recordSmokeTest('IEC review does not issue a compliance verdict',
        assessment.compliant === null && assessment.status === 'Not verified'));
    results.push(recordSmokeTest('IEC review preserves room device inventory',
        assessment.observations[0].socketOutlets === 0 &&
        assessment.observations[1].socketOutlets === 1));
    results.push(recordSmokeTest('IEC review does not require French socket counts',
        !/at least <b>[0-9]/.test(reviewHTML) && !/NF C 15-100/.test(reviewHTML)));
    results.push(recordSmokeTest('Bathroom invokes IEC 60364-7-701 review',
        assessment.checks.some(function(item) { return item.part === 'IEC 60364-7-701'; })));
    results.push(recordSmokeTest('Ordinary rooms do not invoke bath/shower clauses',
        !iecReview.evaluate([{ name: 'Toilet' }], [{ plug: 0 }]).checks.some(function(item)
        {
            return item.part === 'IEC 60364-7-701';
        })));
    results.push(recordSmokeTest('Unlabelled room is explicitly unresolved',
        assessment.observations[2].notes.some(function(note)
        {
            return note.indexOf('Room use is unspecified') >= 0;
        })));
    results.push(recordSmokeTest('IEC review escapes room names in HTML',
        iecReview.render(iecReview.evaluate([{ name: '<img src=x onerror=alert(1)>' }], [{}]))
            .indexOf('&lt;img') >= 0));
    results.push(recordSmokeTest('Old French bathroom abbreviation triggers review',
        iecReview.evaluate([{ name: 'SdB' }], [{}]).checks.some(function(item)
        {
            return item.part === 'IEC 60364-7-701';
        })));

    var passed = results.filter(function(item) { return item; }).length;
    document.getElementById('test-summary').textContent = passed + ' / ' + results.length + ' tests passed';
    document.getElementById('test-summary').dataset.passed = String(passed === results.length);
}

runSmokeTests();
