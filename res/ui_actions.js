// Browser-only UI actions for index.html. All handlers are registered after
// the existing editor scripts load, without bundlers or external JSON files.
function HomeEditorUI()
{
    this.closeReport = function()
    {
        setElementVisible(document.getElementById('reportTools'), false);
        setElementVisible(document.getElementById('panel'), true);
        mode = 'select_mode';
    };

    this.splitWall = function() { editor.splitWall(); };
    this.hideWall = function() { editor.invisibleWall(); };
    this.showWall = function() { editor.visibleWall(); };

    this.closeWallTools = function()
    {
        setModeButton('select_mode');
        document.getElementById('boxinfo').innerHTML = ('Selection mode');
        setElementVisible(document.getElementById('wallTools'), false);
        setElementVisible(document.getElementById('panel'), true);
    };

    this.closeBoundingBox = function()
    {
        setModeButton('select_mode');
        document.getElementById('boxinfo').innerHTML = ('Selection mode');
        setElementVisible(document.getElementById('objBoundingBox'), false);
        setElementVisible(document.getElementById('panel'), true);
        binder.graph.remove();
        delete binder;
    };

    this.closeObjectTools = function()
    {
        setModeButton('select_mode');
        document.getElementById('boxinfo').innerHTML = ('Selection mode');
        setElementVisible(document.getElementById('objTools'), false);
        setElementVisible(document.getElementById('panel'), true);
        binder.graph.remove();
        delete binder;
        rib();
    };

    function toggleSubMenu(targetId)
    {
        var target = document.getElementById(targetId);
        if (!target) return;
        var shouldShow = window.getComputedStyle(target).display === 'none';
        document.querySelectorAll('.sub').forEach(function(element)
        {
            setElementVisible(element, false);
        });
        setElementVisible(target, shouldShow);
    }

    this.toggleDoors = function() { toggleSubMenu('door_list'); };
    this.toggleWindows = function() { toggleSubMenu('window_list'); };
    this.toggleEnergy = function() { toggleSubMenu('energy_list'); };
    this.toggleFurniture = function() { toggleSubMenu('object_list'); };
    this.toggleLayers = function() { toggleSubMenu('layer_list'); };

    this.hideDoors = function()
    {
        document.querySelectorAll('.sub').forEach(function(element)
        {
            setElementVisible(element, false);
        });
    };

    this.enterFullscreen = function()
    {
        fullscreen();
        this.style.display = 'none';
        setElementVisible(document.getElementById('nofull_mode'), true);
    };

    this.exitFullscreen = function()
    {
        outFullscreen();
        this.style.display = 'none';
        setElementVisible(document.getElementById('full_mode'), true);
    };

    this.recoverHistory = function() { initHistory('recovery'); };
    this.newEmptyPlan = function() { initHistory(); };
    this.newSquarePlan = function() { initHistory('newSquare'); };
    this.newLPlan = function() { initHistory('newL'); };
    this.closeTextEditor = function()
    {
        hideEditorModal('textToLayer');
    };
    this.openProjectPage = function() { document.location = 'https://github.com/ekymoz/homeRoughEditor'; };

    this.bind = function()
    {
        // Bind editor actions directly before delegated modal-dismiss handlers run.
        var ui = this;
        var buttons = document.querySelectorAll('[data-editor-action]');
        for (var i = 0; i < buttons.length; i++)
        {
            buttons[i].addEventListener('click', function(event)
            {
                var actionName = this.getAttribute('data-editor-action');
                if (typeof ui[actionName] === 'function')
                {
                    ui[actionName].call(this, event);
                }
            });
        }

        var textField = document.querySelector('[data-editor-focus="clearText"]');
        if (textField)
        {
            textField.addEventListener('focus', function()
            {
                this.innerHTML = '';
            });
        }
    };
}

var homeEditorUI = new HomeEditorUI();
homeEditorUI.bind();
