/*
 * HomeEditorScript.js - Offline command interface to HomeEditor's live canvas data.
 * No eval, remote services or third-party dependencies. Commands call the same
 * Editor/QSVG object containers and save/redraw routines used by the GUI.
 */
function HomeEditorScript()
{
    var self = this;
    var term = null;
    var energyTypes = [
        'gtl','switch','doubleSwitch','dimmer','plug','plug20','plug32',
        'roofLight','wallLight','www','rj45','tv','heater','radiator'
    ];

    function number(value, label)
    {
        if (value === undefined || value === '' || !Number.isFinite(Number(value)))
        {
            throw new Error(label + ' must be a finite number.');
        }
        return Number(value);
    }

    function positive(value, label)
    {
        var n = number(value, label);
        if (n <= 0) throw new Error(label + ' must be greater than zero.');
        return n;
    }

    function index(value, length, type)
    {
        var n = Number(value);
        if (value === undefined || !Number.isInteger(n) || n < 0 || n >= length)
        {
            throw new Error('Invalid ' + type + ' index. Use ' + type + 's to list indices.');
        }
        return n;
    }

    function describe(wall)
    {
        return {
            start: { x: wall.start.x, y: wall.start.y },
            end: { x: wall.end.x, y: wall.end.y },
            thick: wall.thick,
            height: wall.height === undefined ? 250 : wall.height,
            type: wall.type
        };
    }

    function describeObject(obj)
    {
        return {
            class: obj.class, type: obj.type, family: obj.family,
            x: obj.x, y: obj.y, angle: obj.angle, size: obj.size
        };
    }

    function commitWalls(mutate)
    {
        // Keep a state snapshot so a geometry failure does not corrupt the plan.
        var original = WALLS.slice();
        var snapshot = WALLS.map(function(wall)
        {
            return {
                wall: wall, start: { x: wall.start.x, y: wall.start.y },
                end: { x: wall.end.x, y: wall.end.y },
                thick: wall.thick, height: wall.height, type: wall.type,
                parent: wall.parent, child: wall.child, backUp: wall.backUp
            };
        });
        try
        {
            var result = mutate();
            editor.architect(WALLS);
            rib();
            save();
            return result;
        }
        catch (error)
        {
            WALLS.splice(0, WALLS.length);
            original.forEach(function(wall) { WALLS.push(wall); });
            snapshot.forEach(function(row)
            {
                row.wall.start = row.start;
                row.wall.end = row.end;
                row.wall.thick = row.thick;
                row.wall.height = row.height;
                row.wall.type = row.type;
                row.wall.parent = row.parent;
                row.wall.child = row.child;
                row.wall.backUp = row.backUp;
            });
            try { editor.architect(WALLS); rib(); } catch (_) {}
            throw error;
        }
    }

    function getObjectBox(obj)
    {
        if (obj.class === 'energy') return 'boxEnergy';
        if (obj.class === 'furniture') return 'boxFurniture';
        return 'boxcarpentry';
    }

    function commandArguments(line)
    {
        // Quoted strings are supported for text values; never execute JavaScript.
        var result = [];
        var current = '';
        var quote = '';
        var escaped = false;
        for (var i = 0; i < line.length; i++)
        {
            var ch = line[i];
            if (escaped)
            {
                current += ch;
                escaped = false;
            }
            else if (ch === '\\' && quote)
            {
                escaped = true;
            }
            else if (quote)
            {
                if (ch === quote) quote = '';
                else current += ch;
            }
            else if (ch === '"' || ch === "'")
            {
                quote = ch;
            }
            else if (/\s/.test(ch))
            {
                if (current) { result.push(current); current = ''; }
            }
            else current += ch;
        }
        if (quote) throw new Error('Unclosed quote.');
        if (current) result.push(current);
        return result;
    }

    function methodHelp(container, prefix, method)
    {
        var fn = container && container[method];
        if (!fn || typeof fn !== 'function' || !fn.help)
        {
            throw new Error('No documented method: ' + prefix + '.' + method);
        }
        return fn.help;
    }

    function listedHelp(container)
    {
        return Object.keys(container).filter(function(name)
        {
            return typeof container[name] === 'function' && !!container[name].help;
        }).sort();
    }

    function formatHelp(item)
    {
        var lines = [item.syntax || '', item.summary || ''];
        (item.parameters || []).forEach(function(param)
        {
            lines.push('  ' + param.name + ': ' + param.description);
        });
        (item.remarks || []).forEach(function(remark) { lines.push('  Note: ' + remark); });
        (item.examples || []).forEach(function(example) { lines.push('  Example: ' + example); });
        return lines.filter(Boolean).join('\n');
    }

    this.help = function(topic)
    {
        if (!topic)
        {
            return [
                'HomeEditor Script - commands (indices are zero-based; coordinates are SVG units)',
                '  help [topic]     - command and live object-container documentation',
                '  status | walls | objects | rooms',
                '  wall add X1 Y1 X2 Y2 [thickness] [height]',
                '  wall set ID FIELD VALUE     - FIELD: thick, height, x1, y1, x2, y2',
                '  wall move ID DX DY | wall delete ID',
                '  object add TYPE X Y [angle]  - ENERGY symbols or simpleStair',
                '  object set ID FIELD VALUE     - FIELD: x, y, angle',
                '  object move ID X Y | object delete ID',
                '  undo | redo | clear',
                '  help wall | help object | help editor | help qsvg',
                '  help editor.wall | help qsvg.create | help script.addWall',
                '  No JavaScript eval; changes are recorded in HomeEditor history.'
            ].join('\n');
        }
        var term = String(topic).toLowerCase();
        var aliases = {
            wall: ['addWall','setWall','moveWall','deleteWall','listWalls'],
            walls: ['addWall','setWall','moveWall','deleteWall','listWalls'],
            object: ['addObject','setObject','moveObject','deleteObject','listObjects'],
            objects: ['addObject','setObject','moveObject','deleteObject','listObjects']
        };
        if (aliases[term])
        {
            return aliases[term].map(function(key) { return formatHelp(self[key].help); }).join('\n\n');
        }
        if (term === 'editor') return 'Editor: ' + listedHelp(editor).join(', ');
        if (term === 'qsvg') return 'QSVG: ' + listedHelp(qSVG).join(', ');
        if (term === 'script') return 'HomeEditorScript: ' + listedHelp(self).join(', ');
        var segments = term.split('.');
        if (segments.length === 2)
        {
            var scope = segments[0];
            var target = scope === 'editor' ? editor : scope === 'qsvg' ? qSVG : scope === 'script' ? self : null;
            if (!target) throw new Error('Unknown help scope: ' + scope);
            var name = Object.keys(target).find(function(key) { return key.toLowerCase() === segments[1]; });
            return formatHelp(methodHelp(target, scope, name || segments[1]));
        }
        throw new Error('Unknown topic. Try help, help wall, help editor or help qsvg.');
    };

    this.status = function()
    {
        return { walls: WALLS.length, objects: OBJDATA.length, rooms: ROOM.length,
            meterScale: meter, editorMode: mode };
    };

    this.listWalls = function()
    {
        return WALLS.map(function(wall, i)
        {
            return Object.assign({ index: i }, describe(wall));
        });
    };

    this.addWall = function(x1, y1, x2, y2, thick, height)
    {
        x1 = number(x1,'x1'); y1 = number(y1,'y1');
        x2 = number(x2,'x2'); y2 = number(y2,'y2');
        var thickness = positive(thick === undefined ? wallSize : thick, 'thickness');
        var wallHeight = positive(height === undefined ? 250 : height, 'height');
        if (Math.hypot(x2 - x1, y2 - y1) < meter * 0.3)
        {
            throw new Error('Wall must be at least 0.3 m long.');
        }
        return commitWalls(function()
        {
            var wall = new editor.wall({ x: x1, y: y1 }, { x: x2, y: y2 }, 'normal', thickness);
            wall.height = wallHeight;
            WALLS.push(wall);
            return { index: WALLS.length - 1, wall: describe(wall) };
        });
    };

    this.setWall = function(id, field, value)
    {
        var wall = WALLS[index(id, WALLS.length, 'wall')];
        field = String(field || '').toLowerCase();
        var allowed = ['thick','height','x1','y1','x2','y2'];
        if (allowed.indexOf(field) < 0) throw new Error('Wall field must be: ' + allowed.join(', '));
        var n = field === 'thick' || field === 'height' ? positive(value, field) : number(value, field);
        if (['x1','y1','x2','y2'].indexOf(field) >= 0 && editor.objFromWall(wall).length)
        {
            throw new Error('Cannot change endpoints of a wall containing doors or windows.');
        }
        return commitWalls(function()
        {
            if (field === 'x1') wall.start = { x: n, y: wall.start.y };
            else if (field === 'y1') wall.start = { x: wall.start.x, y: n };
            else if (field === 'x2') wall.end = { x: n, y: wall.end.y };
            else if (field === 'y2') wall.end = { x: wall.end.x, y: n };
            else wall[field] = n;
            if (Math.hypot(wall.end.x-wall.start.x, wall.end.y-wall.start.y) < meter*0.3)
            {
                throw new Error('Wall must be at least 0.3 m long.');
            }
            return describe(wall);
        });
    };

    this.moveWall = function(id, dx, dy)
    {
        var wall = WALLS[index(id, WALLS.length, 'wall')];
        var offsetX = number(dx,'dx');
        var offsetY = number(dy,'dy');
        return commitWalls(function()
        {
            wall.start = { x: wall.start.x + offsetX, y: wall.start.y + offsetY };
            wall.end = { x: wall.end.x + offsetX, y: wall.end.y + offsetY };
            return describe(wall);
        });
    };

    this.deleteWall = function(id)
    {
        var target = WALLS[index(id, WALLS.length, 'wall')];
        if (editor.objFromWall(target).length)
        {
            throw new Error('Remove doors and windows before deleting their wall.');
        }
        return commitWalls(function()
        {
            WALLS.forEach(function(wall)
            {
                if (wall.parent === target) wall.parent = null;
                if (wall.child === target) wall.child = null;
            });
            WALLS.splice(WALLS.indexOf(target), 1);
            return 'Wall deleted.';
        });
    };

    this.listObjects = function()
    {
        return OBJDATA.map(function(obj, i)
        {
            return Object.assign({ index: i }, describeObject(obj));
        });
    };

    this.addObject = function(type, x, y, angle)
    {
        var objType = String(type || '');
        if (energyTypes.indexOf(objType) < 0 && objType !== 'simpleStair')
        {
            throw new Error('Unsupported object type. Use: ' + energyTypes.join(', ') + ', simpleStair.');
        }
        var nx = number(x, 'x');
        var ny = number(y, 'y');
        var rotation = angle === undefined ? 0 : number(angle, 'angle');
        var classe = objType === 'simpleStair' ? 'stair' : 'energy';
        var obj = new editor.obj2D('free', classe, objType, { x: nx, y: ny },
            rotation, 0, 0, 'normal', 0, classe === 'stair' ? 15 : undefined);
        try
        {
            var box = document.getElementById(getObjectBox(obj));
            if (!box) throw new Error('Missing SVG object layer.');
            box.append(obj.graph);
            obj.update();
            OBJDATA.push(obj);
            save();
            return { index: OBJDATA.length - 1, object: describeObject(obj) };
        }
        catch (error)
        {
            var pos = OBJDATA.indexOf(obj);
            if (pos >= 0) OBJDATA.splice(pos, 1);
            obj.graph.remove();
            throw error;
        }
    };

    this.setObject = function(id, field, value)
    {
        var obj = OBJDATA[index(id, OBJDATA.length, 'object')];
        field = String(field || '').toLowerCase();
        if (['x','y','angle'].indexOf(field) < 0)
        {
            throw new Error('Object field must be x, y or angle.');
        }
        var n = number(value, field);
        var previous = obj[field];
        try
        {
            obj[field] = n;
            obj.update();
            save();
            return describeObject(obj);
        }
        catch (error)
        {
            obj[field] = previous;
            obj.update();
            throw error;
        }
    };

    this.moveObject = function(id, x, y)
    {
        var obj = OBJDATA[index(id, OBJDATA.length, 'object')];
        var nx = number(x,'x');
        var ny = number(y,'y');
        var oldX = obj.x;
        var oldY = obj.y;
        try
        {
            obj.x = nx;
            obj.y = ny;
            obj.update();
            save();
            return describeObject(obj);
        }
        catch (error)
        {
            obj.x = oldX;
            obj.y = oldY;
            obj.update();
            throw error;
        }
    };

    this.deleteObject = function(id)
    {
        var at = index(id, OBJDATA.length, 'object');
        var obj = OBJDATA[at];
        obj.graph.remove();
        OBJDATA.splice(at, 1);
        save();
        return 'Object deleted.';
    };

    this.listRooms = function()
    {
        return ROOM.map(function(room, i)
        {
            return { index: i, name: room.name, areaSqMeters: Number(room.area) / (meter * meter) };
        });
    };

    this.execute = function(line)
    {
        var args = commandArguments(String(line || ''));
        var command = (args.shift() || '').toLowerCase();
        var action;
        if (!command) return '';
        if (command === 'help') return this.help(args[0]);
        if (command === 'status') return this.status();
        if (command === 'walls') return this.listWalls();
        if (command === 'objects') return this.listObjects();
        if (command === 'rooms') return this.listRooms();
        if (command === 'clear') { if (term) term.clear(); return ''; }
        if (command === 'undo' || command === 'redo')
        {
            document.getElementById(command).click();
            return 'Requested ' + command + '.';
        }
        if (command === 'wall')
        {
            action = (args.shift() || '').toLowerCase();
            if (action === 'add') return this.addWall.apply(this, args);
            if (action === 'set') return this.setWall.apply(this, args);
            if (action === 'move') return this.moveWall.apply(this, args);
            if (action === 'delete') return this.deleteWall.apply(this, args);
            if (action === 'list') return this.listWalls();
            throw new Error('Expected wall add|set|move|delete|list. Try help wall.');
        }
        if (command === 'object' || command === 'obj')
        {
            action = (args.shift() || '').toLowerCase();
            if (action === 'add') return this.addObject.apply(this, args);
            if (action === 'set') return this.setObject.apply(this, args);
            if (action === 'move') return this.moveObject.apply(this, args);
            if (action === 'delete') return this.deleteObject.apply(this, args);
            if (action === 'list') return this.listObjects();
            throw new Error('Expected object add|set|move|delete|list. Try help object.');
        }
        throw new Error('Unknown command: ' + command + '. Type help.');
    };

    this.toggle = function()
    {
        var popup = document.getElementById('homeScriptPanel');
        if (!popup) return false;
        if (!popup.hidden) { popup.hidden = true; return false; }
        if (!term)
        {
            term = new TERMINAL({ container: 'homeScriptTerminal', welcome: '',
                prompt: 'homeEditor', storageKey: 'HomeEditorScriptHistory' });
            term.onInput(function(command, params, line)
            {
                try
                {
                    var value = self.execute(line);
                    if (value !== undefined && value !== '')
                    {
                        term.write((typeof value === 'string' ? value : JSON.stringify(value, null, 2)) + '\n');
                    }
                }
                catch (error) { term.write('[ERROR] ' + error.message + '\n'); }
                return true;
            });
            term.write(self.help() + '\n');
        }
        popup.hidden = false;
        term._o.DOM.input.focus();
        return true;
    };

    // Attach self-documentation to the callable API, following COM_TERM's .help convention.
    this.help.help = { syntax: 'help [topic]', summary: 'Discover commands and documented Editor/QSVG container methods.',
        examples: ['help wall','help editor','help editor.obj2D','help qsvg.create'] };
    this.status.help = { syntax: 'status', summary: 'Count canvas walls, objects and rooms, and report scale/mode.' };
    this.listWalls.help = { syntax: 'walls', summary: 'List all wall records with indices and geometry.' };
    this.addWall.help = { syntax: 'wall add X1 Y1 X2 Y2 [thickness] [height]', summary: 'Draw and save a new wall.',
        remarks: ['Coordinates are SVG units; thickness and height use centimetres. Minimum wall length 0.3 m.'],
        examples: ['wall add 100 100 300 100 20 250'] };
    this.setWall.help = { syntax: 'wall set ID FIELD VALUE', summary: 'Edit one wall and redraw the plan.',
        remarks: ['FIELD is thick, height, x1, y1, x2 or y2.'], examples: ['wall set 0 thick 25','wall set 0 height 280'] };
    this.moveWall.help = { syntax: 'wall move ID DX DY', summary: 'Translate a wall in SVG coordinates.',
        remarks: ['Moves only the selected wall; adjacent walls may disconnect.'], examples: ['wall move 0 20 0'] };
    this.deleteWall.help = { syntax: 'wall delete ID', summary: 'Remove a wall, rebuild rooms and save history.',
        examples: ['wall delete 2'] };
    this.listObjects.help = { syntax: 'objects', summary: 'List all canvas objects and their indices.' };
    this.addObject.help = { syntax: 'object add TYPE X Y [angle]', summary: 'Add a supported energy symbol or a stair to the canvas.',
        remarks: ['Types: ' + energyTypes.join(', ') + ', simpleStair.'],
        examples: ['object add gtl 250 300','object add plug 300 350 90'] };
    this.setObject.help = { syntax: 'object set ID FIELD VALUE', summary: 'Edit one object position or rotation.',
        remarks: ['FIELD is x, y or angle.'], examples: ['object set 0 angle 90'] };
    this.moveObject.help = { syntax: 'object move ID X Y', summary: 'Move an object to an absolute SVG point.',
        examples: ['object move 0 300 350'] };
    this.deleteObject.help = { syntax: 'object delete ID', summary: 'Remove an object and save history.',
        examples: ['object delete 0'] };
    this.listRooms.help = { syntax: 'rooms', summary: 'List computed room names and areas.' };
}

var homeEditorScript = new HomeEditorScript();
