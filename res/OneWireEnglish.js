// English user interface for the legacy single-line electrical diagram.
// The Dutch values stored in .eds files are deliberately not rewritten.
function OneWireEnglish()
{
    // Exact value-to-caption mapping; the HTML option value remains in Dutch.
    this.optionCaptions = {
        "Bord": "Distribution board", "Kring": "Circuit", "Splitsing": "Branch",
        "Meerdere verbruikers": "Multiple loads", "Leeg": "Empty", "Vrije tekst": "Free text",
        "Stopcontact": "Socket outlet", "Lichtcircuit": "Lighting circuit", "Boiler": "Water heater",
        "Diepvriezer": "Freezer", "Droogkast": "Tumble dryer", "Elektrische oven": "Electric oven",
        "Koelkast": "Refrigerator", "Kookfornuis": "Cooker", "Microgolfoven": "Microwave oven",
        "Transformator": "Transformer", "Vaatwasmachine": "Dishwasher", "Ventilator": "Fan",
        "Verwarmingstoestel": "Space heater", "Wasmachine": "Washing machine",
        "automatisch": "Automatic", "differentieel": "Differential", "smelt": "Fuse link", "geen": "None",
        "enkelpolig": "Single-pole", "dubbelpolig": "Double-pole", "teleruptor": "Impulse relay",
        "dimmer": "Dimmer", "relais": "Relay", "bewegingsschakelaar": "Motion sensor switch",
        "knop & bel": "Push button and bell"
    };

    this.formCaptions = {
        "Geaard:": "Earthed:", "Kinderveiligheid:": "Child safety:",
        "Aantal:": "Quantity:", "Accumulatie:": "Storage heater:",
        "Ventilator:": "Fan:", "Zekering:": "Fuse:",
        "Transfo:": "Transformer:", "Aantal lichtpunten:": "Number of light points:",
        "Aantal belpunten:": "Number of bell points:",
        "Aantal schakelaars:": "Number of switches:"
    };

    this.translateText = function(text)
    {
        // Labels are separated by punctuation and spaces in generated HTML.
        var translated = text;
        var labels = this.formCaptions;
        Object.keys(labels).forEach(function(key)
        {
            translated = translated.split(key).join(labels[key]);
        });
        return translated;
    };

    this.translateNode = function(root)
    {
        if (!root)
        {
            return;
        }
        var options = root.getElementsByTagName("option");
        for (var i = 0; i < options.length; i++)
        {
            var text = options[i].textContent;
            if (Object.prototype.hasOwnProperty.call(this.optionCaptions, text))
            {
                // Do not assign to options[i].value, which is part of the .eds contract.
                options[i].textContent = this.optionCaptions[text];
            }
        }
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        var node;
        while ((node = walker.nextNode()))
        {
            if (node.parentNode && node.parentNode.tagName === "OPTION")
            {
                continue;
            }
            var translated = this.translateText(node.nodeValue);
            if (translated !== node.nodeValue)
            {
                node.nodeValue = translated;
            }
        }
    };

    this.translateInterface = function()
    {
        this.translateNode(document.getElementById("configsection"));
        this.translateNode(document.getElementById("left_col_inner"));
    };

    this.install = function()
    {
        var self = this;
        Object.defineProperty(oTranslation.t, "_language", {
            configurable: true,
            get: function() { return "EN"; }
        });

        // Redrawing uses innerHTML; observe replacements so new labels are translated too.
        var observer = new MutationObserver(function()
        {
            self.translateInterface();
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        this.observer = observer;
        this.translateInterface();
    };
}

var oOneWireEnglish = new OneWireEnglish();
oOneWireEnglish.install();
