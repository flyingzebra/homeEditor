// IEC 60364 preliminary review. This project does not model enough electrical
// data to determine conformity with an IEC installation standard.
function IEC60364Review()
{
    // References identify IEC 60364 subjects, not automatic pass/fail rules.
    this.checklist = [
        {
            part: 'IEC 60364-4-41',
            title: 'Protection against electric shock',
            evidence: 'Earthing-system type, fault protection, automatic disconnection conditions and applicable additional protection.'
        },
        {
            part: 'IEC 60364-4-42',
            title: 'Protection against thermal effects',
            evidence: 'Fire and thermal risks, equipment selection and installation conditions.'
        },
        {
            part: 'IEC 60364-4-43',
            title: 'Protection against overcurrent',
            evidence: 'Circuit currents, overcurrent protective devices, ratings and coordination.'
        },
        {
            part: 'IEC 60364-5-52',
            title: 'Wiring systems',
            evidence: 'Cable types, conductor sizes, routing, installation methods, current-carrying capacity and voltage drop.'
        },
        {
            part: 'IEC 60364-5-53',
            title: 'Protection, isolation and switching devices',
            evidence: 'Device types, protective-device selection, RCD arrangements where applicable, and isolation.'
        },
        {
            part: 'IEC 60364-5-54',
            title: 'Earthing and protective conductors',
            evidence: 'Protective conductors, earthing electrodes, and protective bonding where required.'
        },
        {
            part: 'IEC 60364-6',
            title: 'Installation verification',
            evidence: 'Inspection, test measurements and verification records from a competent person.'
        }
    ];

    function escapeHTML(value)
    {
        return String(value).replace(/[&<>"']/g, function(character)
        {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[character];
        });
    }

    function count(value)
    {
        return Math.max(0, Math.trunc(Number(value) || 0));
    }

    function isBathOrShowerLocation(name)
    {
        // The name is a hint only; confirmation of permanent fixtures is needed.
        return /^(bathroom(?:\s+\d+)?|bath\s*\d+|shower(?:\s+room)?|sdb|salle de bains?)$/i.test(name);
    }

    this.evaluate = function(rooms, roomEnergy)
    {
        rooms = Array.isArray(rooms) ? rooms : [];
        roomEnergy = Array.isArray(roomEnergy) ? roomEnergy : [];
        var observations = [];
        var bathOrShowerDetected = false;

        for (var index = 0; index < rooms.length; index++)
        {
            var room = rooms[index] || {};
            var devices = roomEnergy[index] || {};
            var label = String(room.name || '').trim();
            if (typeof translateRoomName === 'function')
            {
                label = translateRoomName(label);
            }
            var potentialBathOrShower = isBathOrShowerLocation(label);
            bathOrShowerDetected = bathOrShowerDetected || potentialBathOrShower;
            var switches = count(devices.switch);
            var socketOutlets = count(devices.plug);
            var lights = count(devices.light);
            var notes = [];

            if (!label)
            {
                notes.push('Room use is unspecified; identify the location before selecting applicable requirements.');
            }
            if (switches === 0 && socketOutlets === 0 && lights === 0)
            {
                notes.push('No electrical points are shown; confirm whether the drawing is complete. This is not an IEC failure.');
            }
            if (potentialBathOrShower)
            {
                notes.push('If a fixed bath or shower is present, review zones, equipment location and protective measures under IEC 60364-7-701.');
            }
            notes.push('Circuit protection, wiring, earthing and verification results are not recorded in this plan.');

            observations.push({
                name: label || ('Room ' + (index + 1) + ' (unnamed)'),
                switches: switches,
                socketOutlets: socketOutlets,
                lights: lights,
                potentialBathOrShower: potentialBathOrShower,
                notes: notes,
                status: 'Evidence required'
            });
        }

        var checks = this.checklist.map(function(item)
        {
            return {
                part: item.part,
                title: item.title,
                evidence: item.evidence,
                status: 'Not verifiable from the drawing'
            };
        });
        if (bathOrShowerDetected)
        {
            checks.push({
                part: 'IEC 60364-7-701',
                title: 'Locations containing a bath or shower',
                evidence: 'Confirm fixtures, zone boundaries, equipment suitability and relevant protective measures.',
                status: 'Not verifiable from the drawing'
            });
        }

        return {
            observations: observations,
            checks: checks,
            compliant: null,
            status: 'Not verified'
        };
    };

    this.render = function(result)
    {
        var html = '<hr/><h2>IEC 60364 — preliminary electrical design review</h2>\n';
        html += '<p><strong>Status: Not verified.</strong> The editor shows electrical symbols and their locations, but lacks the circuit, protective-device, wiring and test data needed to establish IEC 60364 conformity. No automatic compliance decision is made.</p>\n';
        html += '<p><small>IEC 60364 is an international series. Confirm the applicable national adoption and local legal requirements before using the installation design.</small></p>\n';
        html += '<h3>Observations from the plan (not compliance results)</h3>\n';

        if (result.observations.length === 0)
        {
            html += '<p>No rooms are present in this plan.</p>\n';
        }
        for (var i = 0; i < result.observations.length; i++)
        {
            var room = result.observations[i];
            html += '<div class="row"><div class="col-md-4"><strong>' + escapeHTML(room.name) + '</strong></div>';
            html += '<div class="col-md-8"><p>Drawn devices: ' + room.switches + ' switch(es), ' + room.socketOutlets + ' socket outlet(s), ' + room.lights + ' lighting point(s).</p><ul>';
            for (var j = 0; j < room.notes.length; j++)
            {
                html += '<li>' + escapeHTML(room.notes[j]) + '</li>';
            }
            html += '</ul></div></div>\n';
        }

        html += '<h3>IEC 60364 checks requiring supporting evidence</h3>\n';
        html += '<p>Each item below remains <strong>not verified</strong>; these are subjects for a qualified designer or inspector, not pass/fail tests based on socket counts.</p>\n';
        html += '<ul>\n';
        for (var k = 0; k < result.checks.length; k++)
        {
            var check = result.checks[k];
            html += '<li><strong>' + escapeHTML(check.part) + ' — ' + escapeHTML(check.title) + '</strong>: ' + escapeHTML(check.evidence) + ' <em>(' + escapeHTML(check.status) + ')</em></li>\n';
        }
        html += '</ul>\n';
        return html;
    };
}

var oIEC60364Review = new IEC60364Review();
var iec60364Review = oIEC60364Review; // Compatibility with existing report generation.
