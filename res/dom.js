// Shared DOM operations;
// Accept actual DOM elements rather than selector strings.
function setElementVisible(element, visible)
{
    if (!element) return;
    if (!visible)
    {
        element.style.display = 'none';
        return;
    }
    element.style.display = '';
    if (window.getComputedStyle(element).display === 'none')
    {
        element.style.display = element instanceof SVGElement ? 'inline' : 'block';
    }
}

function toggleElementVisible(element)
{
    if (!element) return;
    setElementVisible(element, window.getComputedStyle(element).display === 'none');
}

function setSVGAttributes(element, attributes)
{
    for (var key in attributes)
    {
        if (Object.prototype.hasOwnProperty.call(attributes, key) && attributes[key] != null)
        {
            element.setAttribute(key, attributes[key]);
        }
    }
}

// Native modal handling for the welcome and text editor dialogs.
// Kept separate from editor actions so the DOM helpers have no framework dependency.
function EditorModalController()
{
    this.activeModal = null;
    this.backdrop = null;
    this.previousFocus = null;

    this.show = function(id)
    {
        var modal = document.getElementById(id);
        if (!modal || this.activeModal === modal)
        {
            return;
        }
        if (this.activeModal)
        {
            this.hide();
        }

        this.previousFocus = document.activeElement;
        this.activeModal = modal;
        modal.style.display = 'block';
        modal.classList.add('show');
        modal.removeAttribute('aria-hidden');
        modal.setAttribute('aria-modal', 'true');
        document.body.classList.add('modal-open');

        this.backdrop = document.createElement('div');
        this.backdrop.className = 'modal-backdrop';
        document.body.append(this.backdrop);

        var firstFocus = modal.querySelector('button:not(:disabled), input:not(:disabled), [tabindex="0"]');
        if (firstFocus)
        {
            firstFocus.focus();
        }
        else
        {
            modal.focus();
        }
        modal.dispatchEvent(new Event('editor-modal-shown'));
    };

    this.hide = function(id)
    {
        var modal = this.activeModal;
        if (!modal || (id && modal.id !== id))
        {
            return;
        }

        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        document.body.classList.remove('modal-open');

        if (this.backdrop)
        {
            this.backdrop.remove();
        }
        this.backdrop = null;
        this.activeModal = null;
        if (this.previousFocus && typeof this.previousFocus.focus === 'function')
        {
            this.previousFocus.focus();
        }
        this.previousFocus = null;
        modal.dispatchEvent(new Event('editor-modal-hidden'));
    };

    this.bind = function()
    {
        var controller = this;
        document.addEventListener('click', function(event)
        {
            var dismiss = event.target.closest('[data-editor-dismiss="modal"]');
            if (dismiss && controller.activeModal && controller.activeModal.contains(dismiss))
            {
                controller.hide();
                return;
            }
            if (controller.activeModal && (event.target === controller.activeModal || event.target === controller.backdrop))
            {
                controller.hide();
            }
        });

        document.addEventListener('keydown', function(event)
        {
            if (!controller.activeModal)
            {
                return;
            }
            if (event.key === 'Escape')
            {
                event.preventDefault();
                controller.hide();
            }
            else if (event.key === 'Tab')
            {
                var focusable = controller.activeModal.querySelectorAll(
                    'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]');
                if (!focusable.length)
                {
                    return;
                }
                var first = focusable[0];
                var last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first)
                {
                    event.preventDefault();
                    last.focus();
                }
                else if (!event.shiftKey && document.activeElement === last)
                {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
    };
}

var editorModalController = new EditorModalController();
editorModalController.bind();

function showEditorModal(id) { editorModalController.show(id); }
function hideEditorModal(id) { editorModalController.hide(id); }
