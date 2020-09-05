String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` };

const Vec3 = require('tera-vec3'),
    mapID = [3026, 3126, 3027, 3103, 3203, 3102, 3202, 3201, 9982], //[CSNM, CSHM, Hagufna, Undying Warlord, Nightmare Undying Warlord, DANM, DAHM, GVHM, GLSHM]
    HuntingZn = [3026, 3126, 3027, 3103, 3203, 3102, 3202, 3201, 982], //[CSNM, CSHM, Hagufna, Undying Warlord, Nightmare Undying Warlord, DANM, DAHM, GVHM, GLSHM]
    { KelsaikAction, HagufnaAction, UndyingWarlordAction, DraakonAction, HellgrammiteAction, GossamerRegentAction, NedraAction, PtakumAction, KylosAction } = require('./skillsList'),
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
        uid1 = 999999999,
        uid2 = 899999999,
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
        else if (event.zone === mapID[7]) {
            insidemap = true;
            mod.command.message('Welcome to ' + 'Goosmer Vault '.clr('56B4E9') + '[Hard Mode]'.clr('00FFFF'));
            load();
        }
        else if (event.zone === mapID[8]) {
            insidemap = true;
            mod.command.message('Welcome to ' + 'Grotto Of Lost Souls '.clr('56B4E9') + '[Hard Mode]'.clr('00FFFF'));
            load();
        }
        else unload();
    }

    function SpawnThing(degrees, radius) {
        let r = null, rads = null, finalrad = null, pos = null;
        r = bossCurAngle - Math.PI;
        rads = (degrees * Math.PI / 180);
        finalrad = r - rads;
        bossCurLocation.x = bossCurLocation.x + radius * Math.cos(finalrad);
        bossCurLocation.y = bossCurLocation.y + radius * Math.sin(finalrad);

        mod.toClient('S_SPAWN_BUILD_OBJECT', 2, {
            gameId: uid1,
            itemId: 1,
            loc: bossCurLocation,
            w: r,
            unk: 0,
            ownerName: 'SAFE SPOT',
            message: 'SAFE'
        });

        setTimeout(DespawnThing, 5000, uid1, uid2);
        uid1--;
        //bossCurLocation.z = bossCurLocation.z - 100;
        mod.toClient('S_SPAWN_DROPITEM', 8, {
            gameId: uid2,
            loc: bossCurLocation,
            item: 88850,
            amount: 1,
            expiry: 6000,
            owners: [{ playerId: uid2 }],
            ownerName: "DG-GUIDE"
        });
        uid2++;
    }

    function DespawnThing(uid1_arg, uid1_arg2) {
        mod.toClient('S_DESPAWN_BUILD_OBJECT', 2, {
            gameId: uid1_arg,
            //unk : 0
        });
        mod.toClient('S_DESPAWN_DROPITEM', 4, {
            gameId: uid1_arg2
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
            gameId: uid1,
            id: item,
            amount: 1,
            loc: pos,
            w: r,
            unk1: 0,
            unk2: 0
        });

        setTimeout(Despawn, lifetime, uid1);
        uid1--;
    }

    function Despawn(uid1_arg) {
        mod.send('S_DESPAWN_COLLECTION', 2, {
            gameId: uid1_arg
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
                else if (event.huntingZoneId == HuntingZn[7]) {
                    insidezone = true;
                    whichmode = 8;
                }
                else if (event.huntingZoneId == HuntingZn[8]) {
                    insidezone = true;
                    whichmode = 9;
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
                    if (KelsaikAction[skillid].mark_interval !== undefined) {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnitemCircle(MarkerItem, KelsaikAction[skillid].mark_interval, KelsaikAction[skillid].mark_distance, 9000);
                    }
                }

                if (whichmode == 2 && whichboss == 1 && KelsaikAction[skillid]) {
                    sendMessage(KelsaikAction[skillid].msg);
                    if (KelsaikAction[skillid].mark_interval !== undefined) {
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
                    if (UndyingWarlordAction[skillid].mark_interval !== undefined && UndyingWarlordAction[skillid].mark2_interval !== undefined) {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnitemCircle(MarkerItem, UndyingWarlordAction[skillid].mark_interval, UndyingWarlordAction[skillid].mark_distance, 9000);
                        SpawnitemCircle(MarkerItem, UndyingWarlordAction[skillid].mark2_interval, UndyingWarlordAction[skillid].mark2_distance, 9000);
                    }
                }

                if (whichmode == 5 && whichboss == 1 && UndyingWarlordAction[skillid]) {
                    sendMessage(UndyingWarlordAction[skillid].msg);
                    if (UndyingWarlordAction[skillid].mark_interval !== undefined && UndyingWarlordAction[skillid].mark2_interval !== undefined) {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnitemCircle(MarkerItem, UndyingWarlordAction[skillid].mark_interval, UndyingWarlordAction[skillid].mark_distance, 9000);
                        SpawnitemCircle(MarkerItem, UndyingWarlordAction[skillid].mark2_interval, UndyingWarlordAction[skillid].mark2_distance, 9000);
                    }
                }

                if (whichmode == 6 && whichboss == 1 && DraakonAction[skillid]) {
                    sendMessage(DraakonAction[skillid].msg);
                    if (DraakonAction[skillid].sign_degrees !== undefined && DraakonAction[skillid].sign2_degrees !== undefined) {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnThing(DraakonAction[skillid].sign_degrees, DraakonAction[skillid].sign_distance)
                        SpawnThing(DraakonAction[skillid].sign2_degrees, DraakonAction[skillid].sign2_distance)
                    }
                }

                if (whichmode == 7 && whichboss == 1 && DraakonAction[skillid]) {
                    sendMessage(DraakonAction[skillid].msg);
                    if (DraakonAction[skillid].sign_degrees !== undefined && DraakonAction[skillid].sign2_degrees !== undefined) {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnThing(DraakonAction[skillid].sign_degrees, DraakonAction[skillid].sign_distance)
                        SpawnThing(DraakonAction[skillid].sign2_degrees, DraakonAction[skillid].sign2_distance)
                    }
                }

                if (whichmode == 8 && whichboss == 1 && HellgrammiteAction[skillid]) {
                    sendMessage(HellgrammiteAction[skillid].msg);
                    if (HellgrammiteAction[skillid].mark_interval !== undefined) {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnitemCircle(MarkerItem, HellgrammiteAction[skillid].mark_interval, HellgrammiteAction[skillid].mark_distance, 4000, HellgrammiteAction[skillid].mark_shift_distance)
                    }
                }

                if (whichmode == 8 && whichboss == 2 && GossamerRegentAction[skillid]) {
                    sendMessage(GossamerRegentAction[skillid].msg);
                    if (GossamerRegentAction[skillid].mark_interval !== undefined) {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnitemCircle(MarkerItem, GossamerRegentAction[skillid].mark_interval, GossamerRegentAction[skillid].mark_distance, 3000)
                    }
                }

                if (whichmode == 9 && whichboss == 1 && NedraAction[skillid]) {
                    sendMessage(NedraAction[skillid].msg);
                }

                if (whichmode == 9 && whichboss == 2 && PtakumAction[skillid]) {
                    sendMessage(PtakumAction[skillid].msg);
                    if ([114, 301, 302].includes(skillid)) {
                        Spawnitem(553, 20, 260);
                        Spawnitem(553, 40, 260);
                        Spawnitem(553, 60, 260);
                        Spawnitem(553, 80, 260);
                        Spawnitem(553, 100, 260);
                        Spawnitem(553, 120, 260);
                        Spawnitem(553, 140, 260);
                        Spawnitem(553, 160, 260);
                        Spawnitem(553, 180, 260);
                        Spawnitem(553, 200, 260);
                        Spawnitem(553, 220, 260);
                        Spawnitem(553, 240, 260);
                        Spawnitem(553, 260, 260);
                        Spawnitem(553, 280, 260);
                        Spawnitem(553, 300, 260);
                        Spawnitem(553, 320, 260);
                        Spawnitem(553, 340, 260);
                        Spawnitem(553, 360, 260);
                    }
                    if (skillid === 116) {
                        Spawnitem(553, 90, 25);
                        Spawnitem(553, 90, 50);
                        Spawnitem(553, 90, 75);
                        Spawnitem(553, 90, 100);
                        Spawnitem(553, 90, 125);
                        Spawnitem(553, 90, 150);
                        Spawnitem(553, 90, 175);
                        Spawnitem(553, 90, 200);
                        Spawnitem(553, 90, 225);
                        Spawnitem(553, 90, 250);
                        Spawnitem(553, 90, 275);
                        Spawnitem(553, 90, 300);
                        Spawnitem(553, 90, 325);
                        Spawnitem(553, 90, 350);
                        Spawnitem(553, 90, 375);
                        Spawnitem(553, 90, 400);
                        Spawnitem(553, 90, 425);
                        Spawnitem(553, 90, 450);
                        Spawnitem(553, 90, 475);
                        Spawnitem(553, 90, 500);
                        Spawnitem(553, 270, 25);
                        Spawnitem(553, 270, 50);
                        Spawnitem(553, 270, 75);
                        Spawnitem(553, 270, 100);
                        Spawnitem(553, 270, 125);
                        Spawnitem(553, 270, 150);
                        Spawnitem(553, 270, 175);
                        Spawnitem(553, 270, 200);
                        Spawnitem(553, 270, 225);
                        Spawnitem(553, 270, 250);
                        Spawnitem(553, 270, 275);
                        Spawnitem(553, 270, 300);
                        Spawnitem(553, 270, 325);
                        Spawnitem(553, 270, 350);
                        Spawnitem(553, 270, 375);
                        Spawnitem(553, 270, 400);
                        Spawnitem(553, 270, 425);
                        Spawnitem(553, 270, 450);
                        Spawnitem(553, 270, 475);
                        Spawnitem(553, 270, 500);
                    }
                }

                if (whichmode == 9 && whichboss == 3 && KylosAction[skillid]) {
                    if (!notice) return;
                    if (notice && [118, 139, 141, 150, 152].includes(skillid)) {
                        notice = false;
                        setTimeout(() => notice = true, 4000);
                    }
                    if (whichmode == 9) {
                        if (skillid === 300) power = true, Level = 0, powerMsg = '';
                        if (skillid === 360 || skillid === 399) Level = 0;
                    }
                    if (power && [118, 143, 145, 146, 144, 147, 148, 154, 155, 161, 162, 213, 215].includes(skillid)) {
                        Level++;
                        //powerMsg = '<font color="#FF0000">(' + Level + ') </font> ';
                        powerMsg = `{` + Level + `} `;
                    }
                    if ([146, 148, 154, 155].includes(skillid)) SpawnThing(KylosAction[skillid].sign_degrees, KylosAction[skillid].sign_distance, 8000);
                    if ([139, 141, 150, 152].includes(skillid)) {
                        Spawnitem(537, 0, 25);
                        //Spawnitem(537, 0, 50);
                        Spawnitem(537, 0, 75);
                        //Spawnitem(537, 0, 100);
                        Spawnitem(537, 0, 125);
                        //Spawnitem(537, 0, 150);
                        Spawnitem(537, 0, 175);
                        //Spawnitem(537, 0, 200);
                        Spawnitem(537, 0, 225);
                        //Spawnitem(537, 0, 250);
                        Spawnitem(537, 0, 275);
                        //Spawnitem(537, 0, 300);
                        Spawnitem(537, 0, 325);
                        //Spawnitem(537, 0, 350);
                        Spawnitem(537, 0, 375);
                        //Spawnitem(537, 0, 400);
                        Spawnitem(537, 0, 425);
                        //Spawnitem(537, 0, 450);
                        Spawnitem(537, 0, 475);
                        //Spawnitem(537, 0, 500);
                        Spawnitem(537, 180, 25);
                        //Spawnitem(537, 180, 50);
                        Spawnitem(537, 180, 75);
                        //Spawnitem(537, 180, 100);
                        Spawnitem(537, 180, 125);
                        //Spawnitem(537, 180, 150);
                        Spawnitem(537, 180, 175);
                        //Spawnitem(537, 180, 200);
                        Spawnitem(537, 180, 225);
                        //Spawnitem(537, 180, 250);
                        Spawnitem(537, 180, 275);
                        //Spawnitem(537, 180, 300);
                        Spawnitem(537, 180, 325);
                        //Spawnitem(537, 180, 350);
                        Spawnitem(537, 180, 375);
                        //Spawnitem(537, 180, 400);
                        Spawnitem(537, 180, 425);
                        //Spawnitem(537, 180, 450);
                        Spawnitem(537, 180, 475);
                        //Spawnitem(537, 180, 500);
                        SpawnThing(KylosAction[skillid].sign_degrees, KylosAction[skillid].sign_distance, 5000);
                    }
                    sendMessage(powerMsg + KylosAction[skillid].msg);
                }
            }
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