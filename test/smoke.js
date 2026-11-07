// Provides the single application callback needed by the UI binding test.
var smokePlanRequests = [];
function initHistory(plan)
{
    smokePlanRequests.push(plan);
}

function recordSmokeTest(label, passed)
{
    var list = document.getElementById('test-results');
    var item = document.createElement('li');
    item.className = passed ? 'pass' : 'fail';
    item.textContent = (passed ? 'PASS: ' : 'FAIL: ') + label;
    list.appendChild(item);
    return passed;
}
