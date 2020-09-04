String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` };

const Vec3 = require('tera-vec3'),
    mapID = [3026, 3126, 3027, 3103, 3203, 3102, 3202], //[CSNM, CSHM, Hagufna, Undying Warlord, Nightmare Undying Warlord, DANM, DAHM]
    HuntingZn = [3026, 3126, 3027, 3103, 3203, 3102, 3202], //[CSNM, CSHM, Hagufna, Undying Warlord, Nightmare Undying Warlord, DANM, DAHM]
    config = require('./config.json'),
    MarkerItem = 553,
    BossID = [1000, 2000, 3000],
    KelsaikAction = {
        //101: {msg: 'Claw Attack'},
        102: { msg: 'Front Ice Blast (Get Awaay)' },
        103: { msg: 'Tail Whip (KNOCK-UP)' },
        104: { msg: 'Ice Puddle (Beware / Get Away)' },
        105: { msg: 'Fire Bombs (Large)' },
        //107: {msg: 'Elemental Stomp'},
        108: { msg: 'Pushback Spin (Right)' },
        109: { msg: 'Pushback Spin (Left)' },
        110: { msg: 'Fire Puddle (Beware / Get Away)' },
        112: { msg: 'Front Ice Blast (Get Away)' },
        118: { msg: 'Jumping (KNOCK-UP)' },
        120: { msg: 'Opening Roar (Gather + Shield/Kaias +  Heal)' },
        //131: {msg: 'Feel My Rage'},
        137: { msg: 'Elemental Empowerment (Gather)' },
        139: { msg: 'Temperature now 60 (Take Ice)' },
        140: { msg: 'Temperature now 40 (Take Fire)' },
        //141: {msg: 'Feel the Fear Attack'},
        //143: {msg: 'Feel My Rage Attack'},
        //144: {msg: 'Feel My Rage Attack'},
        145: { msg: 'Elemental Smash *Changes Debuff (Stun)' },
        //151: {msg: 'Claw Attack'},
        152: { msg: 'Front Ice Blast (Get Away)' },
        153: { msg: 'Tail Whip (KNOCK-UP)' },
        154: { msg: 'Ice Wave (Heal)' },
        155: { msg: 'Fire Bombs (Small)' },
        //157: {msg: 'Elemental Stomp'},
        158: { msg: 'Pushback Spin (Right)' },
        159: { msg: 'Pushback Spin (Left)' },
        168: { msg: 'Elemental Release (Shield/Kaias + Heal)' },
        205: { msg: 'Range Check Jump (Jumping)' },
        212: { msg: 'Inner FIRE', mark_interval: 10, mark_distance: 400 },
        213: { msg: 'Inner ICE', mark_interval: 10, mark_distance: 400 },
        214: { msg: 'Inner ICE', mark_interval: 10, mark_distance: 400 },
        215: { msg: 'Inner FIRE', mark_interval: 10, mark_distance: 400 },
    }, HagufnaAction = {
        108: { msg: 'Overhand Strike(Slow)' },
        109: { msg: 'Forward Jump → Overhand Strike' },
        111: { msg: 'Dizziness' },
        112: { msg: 'Backwards Jump → Overhand Strike' },
        116: { msg: 'Perfect Block' },
        117: { msg: 'Flash (Rolling)' },
        134: { msg: 'Turn Around' },
        135: { msg: 'Overhand Strike(Slow)' },
        136: { msg: 'Whirlwind x2 → Overhand Strike' },
        141: { msg: 'Turn Around' },
        140: { msg: 'Perfect Block' },
        143: { msg: 'Overhand Strike' },
        145: { msg: 'Whirlwind x3 → Overhand Strike' },
        151: { msg: '3 Strike' },
        335: { msg: 'Savage Strike' },
        350: { msg: 'Red → Donut (OUT → IN)' },
        351: { msg: 'Break Shield' },
        356: { msg: 'Flash(Rolling)' },
        357: { msg: 'Purple → Wave (Get Away)' },
        401: { msg: 'Boss HP 30% → AOE (Iframe / Warp Barrier)' }
    }, UndyingWarlordAction = {
        // 101: { msg: 'Right Hook' },
        // 102: { msg: 'Spin Left Hook' },
        // 107: { msg: 'Uppercut'},
        // 108: { msg: 'Jump Right Hook' },
        110: { msg: 'Spin' },
        // 111: {msg: 'Straight Punch'},
        // 113: { msg: 'Roundhouse Kick' },
        114: { msg: 'Uppercut + Slam (Knock-Down)' },
        115: { msg: 'One-Inch Punch(Get Away)' },
        116: { msg: 'One-Inch Punch(Get Away)' },
        117: { msg: 'Normal: OUT > IN (SAFE)' },
        118: { msg: 'Enraged: IN > OUT (SAFE)' },
        121: { msg: 'Flip Kick' },
        124: { msg: 'Target Kick(IFRAME)' },
        125: { msg: 'Target Kick(IFRAME)' },
        128: { msg: 'Pheonix(WIPE)' },
        129: { msg: 'Wave Punch(Get Away)' },
        131: { msg: 'Rhytmic Blows' },
        // 142:{msg:'Low Punch'},
        143: { msg: 'Jump(Stun)' },
        146: { msg: 'Back Kick (Get Away)' },
        148: { msg: 'Stomp(Stun)' },
        // 153: { msg: 'Right Hook' },
        // 154: { msg: 'Roundhouse Kick' },
        155: { msg: 'Ground Stomp (Knock-Up / Iframe)' },
        302: { msg: 'Boss Charging' },
        303: { msg: 'DONUT Incoming(TAKE NOTE)', mark_interval: 10, mark_distance: 300 },
        304: { msg: 'DONUT Incoming (TAKE NOTE)', mark_interval: 10, mark_distance: 300 },
        305: { msg: 'Target Lock(Jumping)' },
        307: { msg: 'Charge Complete > Jumping to Target' },
        309: { msg: 'Boss Grab' },
        310: { msg: 'Jump Backwards' },
        313: { msg: 'Jump > Slam' },
        314: { msg: 'AOE(Explosion)' },
    }, DraakonAction = {
        101: { msg: 'Double Slash (Block)' },
        103: { msg: 'Cross Slash (Block/ Get Away-Stack)' },
        104: { msg: 'Double Upper Slash' },
        105: { msg: 'Upper Slash(Block) + Overhand Strike (Stun, Iframe)' },
        //106: { msg: 'Stun (AOE)'}, 105> 106
        107: { msg: 'Blade Throw (Evade)' },
        109: { msg: 'Stomp(Block) + Spin(Iframe)' },
        110: { msg: 'IN > OUT (Wave)' },
        111: { msg: 'Jump (Get Away)' },
        112: { msg: 'Knee Kick (Front > Back)' },
        113: { msg: 'Two Double Slash (Block)' },
        114: { msg: 'Stomp(Block) + Spin(Iframe)' },
        115: { msg: 'Die, all of you (GATHER, stand Together)' },
        118: { msg: 'Double Upper Slash + Stab Ground (Block)' },
        //119: { msg: 'Medium-Size AOE' }, 109 > 119
        120: { msg: 'Traverse Cut > Stab (Stun, Iframe)' },
        121: { msg: 'Right Foot', sign_degrees: 110, sign_distance: 400, sign2_degrees: 250, sign2_distance: 400 },
        122: { msg: 'BOSS FRONT, BACK SAFE' },
        123: { msg: 'BOSS FRONT SAFE' },
        124: { msg: 'Left Foot', sign_degrees: 110, sign_distance: 400, sign2_degrees: 250, sign2_distance: 400 },
        125: { msg: 'BOSS FRONT, BACK SAFE' },
        126: { msg: 'BOSS FRONT SAFE' },
        127: { msg: 'OUT > IN (Wave)' }, //Hard Mode
        128: { msg: 'IN > OUT (Wave)' }, //Hard Mode
        302: { msg: 'Die in a Fire (Stay Near Boss)' },
        304: { msg: 'Shield Phase (Plague/Regression)' }
    };

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
        uid2 = 799999999,
        uid3 = 699999999,
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
                    if (config.itemhelper && KelsaikAction[skill].mark_interval !== undefined) {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnitemCircle(MarkerItem, KelsaikAction[skill].mark_interval, KelsaikAction[skill].mark_distance, 9000);
                    }
                }

                if (whichmode == 2 && whichboss == 1 && KelsaikAction[skillid]) {
                    sendMessage(KelsaikAction[skillid].msg);
                    if (config.itemhelper && KelsaikAction[skill].mark_interval !== undefined) {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnitemCircle(MarkerItem, KelsaikAction[skill].mark_interval, KelsaikAction[skill].mark_distance, 9000);
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
                    if (itemhelper && typeof DraakonAction[skill].sign_degrees !== "undefined" && typeof DraakonAction[skill].sign2_degrees !== "undefined") {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnThing(DraakonAction[skill].sign_degrees, DraakonAction[skill].sign_distance)
                        SpawnThing2(DraakonAction[skill].sign2_degrees, DraakonAction[skill].sign2_distance)
                    }
                }

                if (whichmode == 7 && whichboss == 1 && DraakonAction[skillid]) {
                    sendMessage(DraakonAction[skillid].msg);
                    if (itemhelper && typeof DraakonAction[skill].sign_degrees !== "undefined" && typeof DraakonAction[skill].sign2_degrees !== "undefined") {
                        bossCurLocation = event.loc;
                        bossCurAngle = event.w;
                        SpawnThing(DraakonAction[skill].sign_degrees, DraakonAction[skill].sign_distance)
                        SpawnThing2(DraakonAction[skill].sign2_degrees, DraakonAction[skill].sign2_distance)
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

    function SpawnThing2(degrees, radius) {
        let r = null, rads = null, finalrad = null, pos = null;
        r = bossCurAngle - Math.PI;
        rads = (degrees * Math.PI / 180);
        finalrad = r - rads;
        bossCurLocation.x = bossCurLocation.x + radius * Math.cos(finalrad);
        bossCurLocation.y = bossCurLocation.y + radius * Math.sin(finalrad);

        mod.toClient('S_SPAWN_BUILD_OBJECT', 2, {
            gameId: uid2,
            itemId: 1,
            loc: bossCurLocation,
            w: r,
            unk: 0,
            ownerName: 'SAFE SPOT',
            message: 'SAFE'
        });

        setTimeout(DespawnThing2, 5000, uid2, uid3);
        uid2--;
        //bossCurLocation.z = bossCurLocation.z - 100;
        mod.toClient('S_SPAWN_DROPITEM', 8, {
            gameId: uid3,
            loc: bossCurLocation,
            item: 88850,
            amount: 1,
            expiry: 6000,
            owners: [{ playerId: uid3 }],
            ownerName: "DG-GUIDE"
        });
        uid3++;
    }

    function DespawnThing2(uid1_arg, uid1_arg2) {
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