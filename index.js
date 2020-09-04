String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` };

const Vec3 = require('tera-vec3'),
    mapID = [3026, 3126, 3027, 3103, 3203, 3102, 3202], //[CSNM, CSHM, Hagufna, Undying Warlord, Nightmare Undying Warlord, DANM, DAHM]
    HuntingZn = [3026, 3126, 3027, 3103, 3203, 3102, 3202], //[CSNM, CSHM, Hagufna, Undying Warlord, Nightmare Undying Warlord, DANM, DAHM]
    {KelsaikAction, HagufnaAction, UndyingWarlordAction, DraakonAction} = require('./skillsList'),
    config = require('./config.json'),
    MarkerItem = 553,
    BossID = [1000, 2000, 3000];
    
module.exports = function TeraDungeonGuides(mod) {
    let enabled = config.enabled,
        sendToParty = config.sendToParty,
        streamenabled = config.streamenabled,
        itemhelper = config.itemhelper,
        msgcolour = config.msgcolour,
        insidemap = false,
        insidezone = false,
        whichmode = 0,
        whichboss = 0,
        hooks = [],
        bossCurLocation,
        bossCurAngle,
        uid0 = 999999999,
        uid1 = 899999999,
        notice = true,
        power = false,
        Level = 0,
        powerMsg = '';

    mod.command.add('dginfo', () => {
        mod.command.message(`enabled: ${enabled ? 'true'.clr('56B4E9') : 'false'.clr('E69F00')}.
            insidemap: ${insidemap}.
            insidezone: ${insidezone}.
            whichmode: ${whichmode}.
            whichboss: ${whichboss}.
            itemhelper: ${enabled ? 'true'.clr('56B4E9') : 'false'.clr('E69F00')}.
            sendToParty: ${sendToParty ? 'true'.clr('56B4E9') : 'false'.clr('E69F00')}.`);
        sendMessage('test');
    })

    mod.command.add('guides', (arg) => {
        if (!arg) {
            enabled = !enabled;
            mod.command.message('enabled: ' + (enabled ? 'true'.clr('56B4E9') : 'false'.clr('E69F00')));
            return;
        }
        arg = arg.toLowerCase();
        switch (arg) {
            case "on":
                enabled = true;
                mod.command.message('enabled: ' + (enabled ? 'true'.clr('56B4E9') : 'false'.clr('E69F00')));
                break;
            case "off":
                enabled = false;
                mod.command.message('enabled: ' + (enabled ? 'true'.clr('56B4E9') : 'false'.clr('E69F00')));
                break;
            case "party":
                sendToParty = !sendToParty;
                mod.command.message('sendToParty ' + (sendToParty ? 'true'.clr('56B4E9') : 'false'.clr('E69F00')));
                break;
            case "proxy":
            case "self":
            case "stream":
                streamenabled = !streamenabled;
                mod.command.message('streamenabled ' + (streamenabled ? 'true'.clr('56B4E9') : 'false'.clr('E69F00')));
                break;
            case "itemhelper":
                itemhelper = !itemhelper;
                mod.command.message('itemhelper ' + (itemhelper ? 'true'.clr('56B4E9') : 'false'.clr('E69F00')));
                break;
            case "info":
                mod.command.message(`enabled: ${enabled ? 'true'.clr('56B4E9') : 'false'.clr('E69F00')}.
		insidemap: ${insidemap}.
		insidezone: ${insidezone}.
		whichmode: ${whichmode}.
        whichboss: ${whichboss}.
        itemhelper: ${enabled ? 'true'.clr('56B4E9') : 'false'.clr('E69F00')}.
		sendToParty: ${sendToParty ? 'true'.clr('56B4E9') : 'false'.clr('E69F00')}.`);
                sendMessage('test');
                break;
            default:
                enabled = !enabled;
                mod.command.message('enabled: ' + (enabled ? 'true'.clr('56B4E9') : 'false'.clr('E69F00')));
                break;
        }
    });

    mod.hook('S_LOAD_TOPO', 3, sLoadTopo);

    function sLoadTopo(event) {
        if (event.zone === mapID[0]) {
            insidemap = true;
            mod.command.message('Welcome to ' + 'Corrupted Skynest '.clr('56B4E9') + '[Normal Mode]'.clr('E69F00'));
            load();
        }
        else if (event.zone === mapID[1]) {
            insidemap = true;
            mod.command.message('Welcome to ' + 'Corrupted Skynest '.clr('56B4E9') + '[Hard Mode]'.clr('E69F00'));
            load();
        }
        else if (event.zone === mapID[2]) {
            insidemap = true;
            mod.command.message('Welcome to ' + 'Forbidden Arena '.clr('56B4E9') + '[Hagufna]'.clr('E69F00'));
            load();
        }
        else if (event.zone === mapID[3]) {
            insidemap = true;
            mod.command.message('Welcome to ' + 'Forbidden Arena '.clr('56B4E9') + '[Undying Warlord]'.clr('00FFFF'));
            load();
        }
        else if (event.zone === mapID[4]) {
            insidemap = true;
            mod.command.message('Welcome to ' + 'Forbidden Arena '.clr('56B4E9') + '[Nightmare Undying Warlord]'.clr('00FFFF'));
            load();
        }
        else if (event.zone === mapID[5]) {
            insidemap = true;
            mod.command.message('Welcome to ' + 'Draakon Arena '.clr('56B4E9') + '[Normal Mode]'.clr('00FFFF'));
            load();
        }
        else if (event.zone === mapID[6]) {
            insidemap = true;
            mod.command.message('Welcome to ' + 'Draakon Arena '.clr('56B4E9') + '[Hard Mode]'.clr('00FFFF'));
            load();
        }
        else unload();
    }

    function load() {
        if (!hooks.length) {
            hook('S_BOSS_GAGE_INFO', 3, sBossGageInfo);
            hook('S_ACTION_STAGE', 9, sActionStage);

            function sBossGageInfo(event) {
                if (!insidemap) return;

                let bosshp = (Number(event.curHp) / Number(event.maxHp));

                if (bosshp <= 0) whichboss = 0;

                if (Number(event.curHp) == Number(event.maxHp)) {
                    notice = true;
                    power = false;
                    Level = 0;
                    powerMsg = '';
                }

                if (event.huntingZoneId == HuntingZn[0]) {
                    insidezone = true;
                    whichmode = 1;
                }
                else if (event.huntingZoneId == HuntingZn[1]) {
                    insidezone = true;
                    whichmode = 2;
                }
                else if (event.huntingZoneId == HuntingZn[2]) {
                    insidezone = true;
                    whichmode = 3;
                }
                else if (event.huntingZoneId == HuntingZn[3]) {
                    insidezone = true;
                    whichmode = 4;
                }
                else if (event.huntingZoneId == HuntingZn[4]) {
                    insidezone = true;
                    whichmode = 5;
                }
                else if (event.huntingZoneId == HuntingZn[5]) {
                    insidezone = true;
                    whichmode = 6;
                }
                else if (event.huntingZoneId == HuntingZn[6]) {
                    insidezone = true;
                    whichmode = 7;
                }
                else {
                    insidezone = false;
                    whichmode = 0;
                }
                if (event.templateId == BossID[0]) whichboss = 1;
                else if (event.templateId == BossID[1]) whichboss = 2;
                else if (event.templateId == BossID[2]) whichboss = 3;
                else whichboss = 0;
            }

            function sActionStage(event) {
                if (!enabled || !insidezone || whichboss == 0) return;
                if (event.templateId != BossID[0]) return;
                let skillid = event.skill.id % 1000;
                bossCurLocation = event.loc;
                bossCurAngle = event.w;

                if (whichmode == 1 && whichboss == 1 && KelsaikAction[skillid]) {
                    sendMessage(KelsaikAction[skillid].msg);
                    if (itemhelper && KelsaikAction[skillid].mark_interval !== undefined) {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnitemCircle(MarkerItem, KelsaikAction[skillid].mark_interval, KelsaikAction[skillid].mark_distance, 9000);
                    }
                }

                if (whichmode == 2 && whichboss == 1 && KelsaikAction[skillid]) {
                    sendMessage(KelsaikAction[skillid].msg);
                    if (itemhelper && KelsaikAction[skillid].mark_interval !== undefined) {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnitemCircle(MarkerItem, KelsaikAction[skillid].mark_interval, KelsaikAction[skillid].mark_distance, 9000);
                    }
                }

                if (whichmode == 3 && whichboss == 1 && HagufnaAction[skillid]) {
                    sendMessage(HagufnaAction[skillid].msg);
                }

                if (whichmode == 4 && whichboss == 1 && UndyingWarlordAction[skillid]) {
                    sendMessage(UndyingWarlordAction[skillid].msg);
                    if (UndyingWarlordAction[skillid].mark_interval !== undefined) {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnitemCircle(MarkerItem, UndyingWarlordAction[skillid].mark_interval, UndyingWarlordAction[skillid].mark_distance, 9000);
                    }
                }

                if (whichmode == 5 && whichboss == 1 && UndyingWarlordAction[skillid]) {
                    sendMessage(UndyingWarlordAction[skillid].msg);
                    if (UndyingWarlordAction[skillid].mark_interval !== undefined) {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnitemCircle(MarkerItem, UndyingWarlordAction[skillid].mark_interval, UndyingWarlordAction[skillid].mark_distance, 9000);
                    }
                }

                if (whichmode == 6 && whichboss == 1 && DraakonAction[skillid]) {
                    sendMessage(DraakonAction[skillid].msg);
                    if (itemhelper && typeof DraakonAction[skillid].sign_degrees !== "undefined" && typeof DraakonAction[skillid].sign2_degrees !== "undefined") {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnThing(DraakonAction[skillid].sign_degrees, DraakonAction[skillid].sign_distance)
                        SpawnThing(DraakonAction[skillid].sign2_degrees, DraakonAction[skillid].sign2_distance)
                    }
                }

                if (whichmode == 7 && whichboss == 1 && DraakonAction[skillid]) {
                    sendMessage(DraakonAction[skillid].msg);
                    if (itemhelper && typeof DraakonAction[skillid].sign_degrees !== "undefined" && typeof DraakonAction[skillid].sign2_degrees !== "undefined") {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnThing(DraakonAction[skillid].sign_degrees, DraakonAction[skillid].sign_distance)
                        SpawnThing(DraakonAction[skillid].sign2_degrees, DraakonAction[skillid].sign2_distance)
                    }
                }
            }
        }
    }

    function SpawnThing(degrees, radius) {
        let r = null, rads = null, finalrad = null, pos = null;
        r = bossCurAngle - Math.PI;
        rads = (degrees * Math.PI / 180);
        finalrad = r - rads;
        bossCurLocation.x = bossCurLocation.x + radius * Math.cos(finalrad);
        bossCurLocation.y = bossCurLocation.y + radius * Math.sin(finalrad);

        mod.toClient('S_SPAWN_BUILD_OBJECT', 2, {
            gameId: uid0,
            itemId: 1,
            loc: bossCurLocation,
            w: r,
            unk: 0,
            ownerName: 'SAFE SPOT',
            message: 'SAFE'
        });

        setTimeout(DespawnThing, 5000, uid0, uid1);
        uid0--;
        //bossCurLocation.z = bossCurLocation.z - 100;
        mod.toClient('S_SPAWN_DROPITEM', 8, {
            gameId: uid1,
            loc: bossCurLocation,
            item: 88850,
            amount: 1,
            expiry: 6000,
            owners: [{ playerId: uid1 }],
            ownerName: "DG-GUIDE"
        });
        uid1++;
    }

    function DespawnThing(uid0_arg, uid0_arg2) {
        mod.toClient('S_DESPAWN_BUILD_OBJECT', 2, {
            gameId: uid0_arg,
            //unk : 0
        });
        mod.toClient('S_DESPAWN_DROPITEM', 4, {
            gameId: uid0_arg2
        });
    }

    function Spawnitem(item, angle, radius, lifetime) {
        let r = null, rads = null, finalrad = null, pos = {};

        r = bossCurAngle - Math.PI;
        finalrad = r - angle;
        pos.x = bossCurLocation.x + radius * Math.cos(finalrad);
        pos.y = bossCurLocation.y + radius * Math.sin(finalrad);
        pos.z = bossCurLocation.z;

        mod.send('S_SPAWN_COLLECTION', 4, {
            gameId: uid0,
            id: item,
            amount: 1,
            loc: pos,
            w: r,
            unk1: 0,
            unk2: 0
        });

        setTimeout(Despawn, lifetime, uid0);
        uid0--;
    }

    function Despawn(uid_arg0) {
        mod.send('S_DESPAWN_COLLECTION', 2, {
            gameId: uid_arg0
        });
    }

    function SpawnitemCircle(item, intervalDegrees, radius, lifetime, shift_distance, shift_angle) {
        if (shift_angle) {
            bossCurAngle = (bossCurAngle - Math.PI) - (shift_angle * (Math.PI / 180));
        }
        if (shift_distance) {
            bossCurLocation.x = bossCurLocation.x + shift_distance * Math.cos(bossCurAngle);
            bossCurLocation.y = bossCurLocation.y + shift_distance * Math.sin(bossCurAngle);
        }
        for (var angle = -Math.PI; angle <= Math.PI; angle += Math.PI * intervalDegrees / 180) {
            Spawnitem(item, angle, radius, lifetime);
        }
    }

    function reset() {
        insidemap = false;
        insidezone = false;
        whichmode = 0;
        whichboss = 0;
        notice = true;
        power = false;
        Level = 0;
        powerMsg = '';
    }

    function sendMessage(msg) {
        if (msgcolour) msg = `${msg}`.clr(msgcolour);

        if (sendToParty) {
            mod.send('C_CHAT', 1, {
                channel: 21, //21 = p-notice, 1 = party, 2 = guild
                message: msg
            });
        } else if (streamenabled) {
            mod.command.message(msg);
        } else {
            mod.send('S_CHAT', 3, {
                channel: 21, //21 = p-notice, 1 = party
                name: 'DG-Guide',
                message: msg
            });
        }
    }
    function unload() {
        if (hooks.length) {
            for (let h of hooks) mod.unhook(h);
            hooks = []
        }
        reset();
    }

    function hook() {
        hooks.push(mod.hook(...arguments));
    }
}