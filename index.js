String.prototype.clr = function (hexColor) { return `<font color="#${hexColor}">${this}</font>` };

let { DungeonInfo, KelsaikAction, HagufnaAction, UndyingWarlordAction, DraakonAction, HellgrammiteAction, GossamerRegentAction, NedraAction, PtakumAction, KylosAction, AkalathTravanAction, AkalathKashirAction, BahaarAction } = require('./skillsList');
const Vec3 = require('tera-vec3'),
    config = require('./config.json'),
    MarkerItem = 553,
    MarkerItem1 = 2,
    MarkerItem2 = 88850,
    MarkerItem3 = 912,
    BossID = [1000, 2000, 3000];

module.exports = function TeraDungeonGuides(mod) {
    let isTank = true,
        enabled = config.enabled,
        sendToParty = config.sendToParty,
        streamenabled = config.streamenabled,
        itemhelper = config.itemhelper,
        msgcolour = config.msgcolour,
        sendToAlert = config.sendToAlert,
        hooks = [],bossCurLocation,bossCurAngle,bossId = 0n,uid0 = 999999999n,uid1 = 899999999n,uid2 = 799999999n,skillid = 0,whichzone = null,whichmode = null,whichboss = 0,timeOut = 0,
        //GLSH
        notice = true,
        power = false,
        Level = 0,
        powerMsg = '',
        //AQ
        myColor = null,
        TipMsg = '',
        //Bahaar
        shining = false,
        //CSN
        timer1,
        timer2,
        timer3,
        timer4;

    mod.command.add('dginfo', () => {
        mod.command.message(`enabled: ${enabled ? 'true'.clr('56B4E9') : 'false'.clr('E69F00')}.
        whichzone: ${whichzone}.
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
                whichzone: ${whichzone}.
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

    mod.hook('S_LOGIN', mod.majorPatchVersion >= 86 ? 14 : 13, sLogin)

    function sLogin(event) {
        let job = (event.templateId - 10101) % 100;
        if (job === 1 || job === 10) {
            isTank = true;
        } else isTank = false;
    }

    mod.game.me.on('change_zone', (zone, quick) => {
        whichzone = zone;
        whichmode = zone % 9000;

        if (mod.game.me.inDungeon && DungeonInfo.find(obj => obj.zone == zone)) {
            mod.command.message(DungeonInfo.find(obj => obj.zone == zone).string);
            if (whichmode < 100) whichmode = whichmode + 400;
            load();
        } else {
            whichmode = null;
            unload();
        }
    });

    function load() {
        if (!hooks.length) {
            hook('S_BOSS_GAGE_INFO', 3, sBossGageInfo);
            hook('S_ABNORMALITY_BEGIN', 4, sAbnormalityBegin);
            hook('S_ABNORMALITY_END', 1, sAbnormalityEnd);
            hook('S_ACTION_STAGE', 9, sActionStage);
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

    function reset() {
        notice = true;
        power = false;
        Level = 0;
        powerMsg = '';
        myColor = null;
        shining = false;
        TipMsg = '';
        timeOut = 0;
        whichboss = 0;
        mod.clearAllTimeouts();
    }

    function sBossGageInfo(event) {
        let bosshp = (Number(event.curHp) / Number(event.maxHp));

        if (bosshp <= 0) whichboss = 0;

        if (Number(event.curHp) == Number(event.maxHp)) {
            notice = true;
            power = false;
            Level = 0;
            powerMsg = '';
        }

        if (event.templateId == BossID[0]) whichboss = 1;
        else if (event.templateId == BossID[1]) whichboss = 2;
        else if (event.templateId == BossID[2]) whichboss = 3;
        else whichboss = 0;
    }

    function sAbnormalityBegin(event) {
        if (!enabled || !whichmode) return;

        if (!mod.game.me.is(event.target)) return;

        // == CSNM / CSHM ==
        //Doomfire debuff
        if (event.id == 30260001){
            sendMessage("You now have Fire Debuff");
            timer1 = mod.setTimeout(() =>{
                alertMessage(" !! Warning !! Debuff ending in 50s")
            }, 40000);

            timer2 = mod.setTimeout(() =>{
                alertMessage(" !! Warning !! Debuff ending in 30s")
            }, 60000);

            timer3 = mod.setTimeout(() =>{
                alertMessage(" !! Warning !! Debuff ending in 15s")
            }, 75000);

            timer4 = mod.setTimeout(() =>{
                alertMessage(" !! Warning !! Debuff ending in 5s")
            }, 85000);
        }

        //Doomchill debuff
        if (event.id == 30260002){
            sendMessage("You now have Ice Debuff");
            timer1 = mod.setTimeout(() =>{
                alertMessage(" !! Warning !! Debuff ending in 50s")
            }, 40000);

            timer2 = mod.setTimeout(() =>{
                alertMessage(" !! Warning !! Debuff ending in 30s")
            }, 60000);

            timer3 = mod.setTimeout(() =>{
                alertMessage(" !! Warning !! Debuff ending in 15s")
            }, 75000);

            timer4 = mod.setTimeout(() =>{
                alertMessage(" !! Warning !! Debuff ending in 5s")
            }, 85000);
        }

        // == AQ ==
        if (event.id == 30231000 || event.id == 30231001) {
            myColor = event.id;
        }

        // == Bahaar ==
        if (event.id == 90442303) alertMessage('Healer should use [Regress] skill');
        if (event.id == 90442304) alertMessage('Stop the Boss using [Stun] skill');

        if (event.id == 90442000) shining = true;
        if (event.id == 90442001) shining = false;

        if (event.id == 90444001 && skillid == 104) setTimeout(() => { if (shining) sendMessage('back hammer (next)'); }, 500);
        if (event.id == 90442000 && skillid == 134) setTimeout(() => { if (shining) sendMessage('back hammer (next)'); }, 300);
        if (event.id == 90444001 && skillid == 118) setTimeout(() => { if (shining) sendMessage('back hammer (next)'); }, 50);
    }

    function sAbnormalityEnd(event) {
        if (!enabled || !whichmode) return;

        if (!mod.game.me.is(event.target)) return;

        // == CSN / CSHM ==
        if(event.id == 30260001 || event.id == 30260002){
            mod.clearAllTimeouts();
        }

        // == AQ ==
        if (event.id == 30231000 || event.id == 30231001) {
            myColor = null;
        }
    }

    function sActionStage(event) {
        if (!enabled || !whichmode || whichboss == 0) return;
        if (event.templateId != BossID[0] && event.templateId != BossID[1] && event.templateId != BossID[2]) return;
        skillid = event.skill.id % 1000;
        bossCurLocation = event.loc;
        bossCurAngle = event.w;
        var bossSkillID = null;

        //Corrupted Skynest Normal, Corrupted Skynest Hard
        if ([3026, 3126].includes(whichmode) && whichboss == 1) {
            if (event.stage != 0 || !(bossSkillID = KelsaikAction.find(obj => obj.id == skillid))) return;
            sendMessage(bossSkillID.msg);
            if ([212, 213, 214, 215].includes(skillid)) {
                bossCurLocation = event.loc;
                bossCurAngle = event.w;
                SpawnitemCircle(MarkerItem, 10, 400, 9000);
            }
        }

        //Hagufna
        if (whichmode == 3027 && whichboss == 1) {
            if (event.stage != 0 || !(bossSkillID = HagufnaAction.find(obj => obj.id == skillid))) return;
            sendMessage(bossSkillID.msg);
        }

        //UndyingWarlord , Nightmare Undying Warlord
        if ([3103, 3203].includes(whichmode) && whichboss == 1) {
            if (event.stage != 0 || !(bossSkillID = UndyingWarlordAction.find(obj => obj.id == skillid))) return;
            sendMessage(bossSkillID.msg);
            if ([303, 304].includes(skillid)) {
                bossCurLocation = event.loc;
                bossCurAngle = event.w;
                SpawnitemCircle(MarkerItem, 10, 250, 9000);
                SpawnitemCircle(MarkerItem, 10, 600, 9000);
            }
        }

        //Draakon Arena, Draakon Arena Hard Mode
        if ([3102, 3202].includes(whichmode) && whichboss == 1) {
            if (event.stage != 0 || !(bossSkillID = DraakonAction.find(obj => obj.id == skillid))) return;
            sendMessage(bossSkillID.msg);
            if ([121, 1244].includes(skillid)) {
                bossCurLocation = event.loc;
                bossCurAngle = event.w;
                Spawnitem(MarkerItem, 110, 400, 9000);
                Spawnitem(MarkerItem, 250, 400, 9000);
                Spawnitem(MarkerItem, 110, 400, 9000);
                Spawnitem(MarkerItem, 250, 400, 9000);
            }
        }

        //Goosmer Vault Hard Mode , Hellgramite
        if (whichmode == 3201 && whichboss == 1) {
            if (event.stage != 0 || !(bossSkillID = HellgrammiteAction.find(obj => obj.id == skillid))) return;
            sendMessage(bossSkillID.msg);
            if ([313, 314].includes(skillid)) {
                bossCurLocation = event.loc;
                bossCurAngle = event.w;
                SpawnitemCircle(MarkerItem, 10, 300, 4000, 75);
            }
        }

        //Goosmer Vault Hard Mode , GossamerRegent
        if (whichmode == 3201 && whichboss == 2) {
            if (event.stage != 0 || !(bossSkillID = GossamerRegentAction.find(obj => obj.id == skillid))) return;
            sendMessage(bossSkillID.msg);
            if ([231, 232].includes(skillid)) {
                bossCurLocation = event.loc;
                bossCurAngle = event.w;
                SpawnitemCircle(MarkerItem, 10, 300, 3000);
            }
        }

        //Grotto Of Lost Soul, Nedra
        if (whichmode == 982 && whichboss == 1) {
            if (event.stage != 0 || !(bossSkillID = NedraAction.find(obj => obj.id == skillid))) return;
            sendMessage(bossSkillID.msg);
        }

        //Grotto Of Lost Soul, Ptakum
        if (whichmode == 982 && whichboss == 2) {
            if (event.stage != 0 || !(bossSkillID = PtakumAction.find(obj => obj.id == skillid))) return;
            sendMessage(bossSkillID.msg);
            if ([114, 301, 302].includes(skillid)) {
                Spawnitem(MarkerItem, 20, 260, 5000);
                Spawnitem(MarkerItem, 40, 260, 5000);
                Spawnitem(MarkerItem, 60, 260, 5000);
                Spawnitem(MarkerItem, 80, 260, 5000);
                Spawnitem(MarkerItem, 100, 260, 5000);
                Spawnitem(MarkerItem, 120, 260, 5000);
                Spawnitem(MarkerItem, 140, 260, 5000);
                Spawnitem(MarkerItem, 160, 260, 5000);
                Spawnitem(MarkerItem, 180, 260, 5000);
                Spawnitem(MarkerItem, 200, 260, 5000);
                Spawnitem(MarkerItem, 220, 260, 5000);
                Spawnitem(MarkerItem, 240, 260, 5000);
                Spawnitem(MarkerItem, 260, 260, 5000);
                Spawnitem(MarkerItem, 280, 260, 5000);
                Spawnitem(MarkerItem, 300, 260, 5000);
                Spawnitem(MarkerItem, 320, 260, 5000);
                Spawnitem(MarkerItem, 340, 260, 5000);
                Spawnitem(MarkerItem, 360, 260, 5000);
            }
            if (skillid === 116) {
                Spawnitem(MarkerItem, 90, 25, 5000);
                Spawnitem(MarkerItem, 90, 50, 5000);
                Spawnitem(MarkerItem, 90, 75, 5000);
                Spawnitem(MarkerItem, 90, 100, 5000);
                Spawnitem(MarkerItem, 90, 125, 5000);
                Spawnitem(MarkerItem, 90, 150, 5000);
                Spawnitem(MarkerItem, 90, 175, 5000);
                Spawnitem(MarkerItem, 90, 200, 5000);
                Spawnitem(MarkerItem, 90, 225, 5000);
                Spawnitem(MarkerItem, 90, 250, 5000);
                Spawnitem(MarkerItem, 90, 275, 5000);
                Spawnitem(MarkerItem, 90, 300, 5000);
                Spawnitem(MarkerItem, 90, 325, 5000);
                Spawnitem(MarkerItem, 90, 350, 5000);
                Spawnitem(MarkerItem, 90, 375, 5000);
                Spawnitem(MarkerItem, 90, 400, 5000);
                Spawnitem(MarkerItem, 90, 425, 5000);
                Spawnitem(MarkerItem, 90, 450, 5000);
                Spawnitem(MarkerItem, 90, 475, 5000);
                Spawnitem(MarkerItem, 90, 500, 5000);
                Spawnitem(MarkerItem, 270, 25, 5000);
                Spawnitem(MarkerItem, 270, 50, 5000);
                Spawnitem(MarkerItem, 270, 75, 5000);
                Spawnitem(MarkerItem, 270, 100, 5000);
                Spawnitem(MarkerItem, 270, 125, 5000);
                Spawnitem(MarkerItem, 270, 150, 5000);
                Spawnitem(MarkerItem, 270, 175, 5000);
                Spawnitem(MarkerItem, 270, 200, 5000);
                Spawnitem(MarkerItem, 270, 225, 5000);
                Spawnitem(MarkerItem, 270, 250, 5000);
                Spawnitem(MarkerItem, 270, 275, 5000);
                Spawnitem(MarkerItem, 270, 300, 5000);
                Spawnitem(MarkerItem, 270, 325, 5000);
                Spawnitem(MarkerItem, 270, 350, 5000);
                Spawnitem(MarkerItem, 270, 375, 5000);
                Spawnitem(MarkerItem, 270, 400, 5000);
                Spawnitem(MarkerItem, 270, 425, 5000);
                Spawnitem(MarkerItem, 270, 450, 5000);
                Spawnitem(MarkerItem, 270, 475, 5000);
                Spawnitem(MarkerItem, 270, 500, 5000);
            }
        }

        //Grotto Of Lost Soul, Kylos
        if (whichmode == 982 && whichboss == 3) {
            if (event.stage != 0 || !(bossSkillID = KylosAction.find(obj => obj.id == skillid))) return;
            if (!notice) return;
            if (notice && [118, 139, 141, 150, 152].includes(skillid)) {
                notice = false;
                setTimeout(() => notice = true, 4000);
            }
            if (skillid === 300) power = true, Level = 0, powerMsg = '';
            if (skillid === 360 || skillid === 399) Level = 0;

            if (power && [118, 143, 145, 146, 144, 147, 148, 154, 155, 161, 162, 213, 215].includes(skillid)) {
                Level++;
                powerMsg = `{` + Level + `} `;
            }

            if ([146, 154].includes(skillid)) {
                SpawnThing(false, 330, 320, 8000);
            }

            if ([148, 155].includes(skillid)) {
                SpawnThing(false, 30, 120, 8000);
            }

            if ([139, 141, 150, 152].includes(skillid)) {
                Spawnitem(MarkerItem, 0, 25, 5000);
                Spawnitem(MarkerItem, 0, 75, 5000);
                Spawnitem(MarkerItem, 0, 125, 5000);
                Spawnitem(MarkerItem, 0, 175, 5000);
                Spawnitem(MarkerItem, 0, 225, 5000);
                Spawnitem(MarkerItem, 0, 275, 5000);
                Spawnitem(MarkerItem, 0, 325, 5000);
                Spawnitem(MarkerItem, 0, 375, 5000);
                Spawnitem(MarkerItem, 0, 425, 5000);
                Spawnitem(MarkerItem, 0, 475, 5000);
                Spawnitem(MarkerItem, 180, 25, 5000);
                Spawnitem(MarkerItem, 180, 75, 5000);
                Spawnitem(MarkerItem, 180, 125, 5000);
                Spawnitem(MarkerItem, 180, 175, 5000);
                Spawnitem(MarkerItem, 180, 225, 5000);
                Spawnitem(MarkerItem, 180, 275, 5000);
                Spawnitem(MarkerItem, 180, 325, 5000);
                Spawnitem(MarkerItem, 180, 375, 5000);
                Spawnitem(MarkerItem, 180, 425, 5000);
                Spawnitem(MarkerItem, 180, 475, 5000);
                SpawnThing(false, bossSkillID.sign_degrees, bossSkillID.sign_distance, 5000);
            }

            if ([139, 150].includes(skillid)) {
                SpawnThing(false, 270, 200, 5000);
            }

            if ([141, 152].includes(skillid)) {
                SpawnThing(false, 90, 200, 5000);
            }
            sendMessage(powerMsg + bossSkillID.msg);
        }

        //Akalath Quarantine, AkalathTravan
        if (whichmode == 3023 && whichboss == 1) {
            if (event.stage != 0 || !(bossSkillID = AkalathTravanAction.find(obj => obj.id == event.skill.id))) return;
            if (myColor && (event.skill.id == 3119 || event.skill.id == 3220)) {
                TipMsg = bossSkillID.TIP[myColor % 30231000];
            } else {
                TipMsg = "";
            }
            sendMessage(bossSkillID.msg + TipMsg);
        }

        //Akalath Quarantine, AkalathKashira
        if (whichmode == 3023 && whichboss == 2) {
            if (event.stage != 0 || !(bossSkillID = AkalathKashirAction.find(obj => obj.id == skillid))) return;
            sendMessage(bossSkillID.msg);
        }

        //Bahaar
        if (whichmode == 444 && [1, 2].includes(whichboss)) {
            if (event.stage != 0 || !(bossSkillID = BahaarAction.find(obj => obj.id == skillid))) return;
            sendMessage(bossSkillID.msg);

            bossCurLocation = event.loc;
            bossCurAngle = event.w;

            if (event.templateId == 2500) {
                bossCurLocation = event.loc;
                bossCurAngle = event.w;
                skill = event.skill.id % 1000;
                if (skill == 305) {
                    sendMessage('<font color="#FF0000">LASER firing</font>');
                    if (itemhelper) {
                        Spawnitem1(MarkerItem3, 180, 3000, 3000);
                    }
                    return;
                }
            }

            skillid = event.skill.id % 1000;
            switch (skillid) {
                case 121:
                case 122:
                case 123:
                case 140:
                case 141:
                case 142:
                    timeOut = setTimeout(() => {
                        alertMessage('Waves soon...');
                    }, 60000);
                    break;
            }

            switch (skillid) {
                case 103:
                case 125:
                    SpawnThing(true, 184, 400, 100);
                    SpawnitemCircle(MarkerItem, 8, 350, 3000);
                    break;

                case 131:
                    SpawnThing(true, 182, 340, 100);
                    SpawnitemCircle(MarkerItem, 8, 660, 4000);
                    break;

                case 126:
                case 132:
                    Spawnitem1(MarkerItem, 180, 500, 2000);
                    Spawnitem1(MarkerItem, 0, 500, 2000);
                    if (skillid === 126) {
                        SpawnThing(true, 90, 100, 100);
                    }
                    if (skillid === 132) {
                        SpawnThing(true, 180, 100, 100);
                    }
                    Spawnitem1(MarkerItem, 180, 500, 2000);
                    Spawnitem1(MarkerItem, 0, 500, 2000);
                    break;

                case 112:
                case 135:
                    SpawnThing(true, 184, 220, 100);
                    SpawnitemCircle(MarkerItem, 12, 210, 4000);
                    break;

                case 114:
                    SpawnThing(true, 184, 260, 100);
                    SpawnitemCircle(MarkerItem, 10, 320, 4000);
                    break;

                case 116:
                    SpawnitemCircle(MarkerItem, 8, 290, 6000);
                    break;

                case 111:
                case 137:
                    SpawnThing(true, 0, 500, 100);
                    SpawnitemCircle(MarkerItem, 8, 480, 2000);
                    break;

                case 121:
                case 122:
                case 123:
                case 140:
                case 141:
                case 142:
                    SpawnThing(true, 90, 50, 100);
                    Spawnitem1(MarkerItem, 180, 500, 6000);
                    Spawnitem1(MarkerItem, 0, 500, 6000);

                    SpawnThing(true, 70, 100, 100);
                    Spawnitem1(MarkerItem, 180, 500, 6000);
                    Spawnitem1(MarkerItem, 0, 500, 6000);
                    break;

                case 101:
                    Spawnitem1(MarkerItem, 345, 500, 3000);
                    Spawnitem1(MarkerItem, 270, 500, 3000);
                    break;

                case 311:
                case 312:
                    Spawnitem1(MarkerItem, 180, 500, 6000);
                    Spawnitem1(MarkerItem, 0, 500, 6000);
                    break;

                case 119:
                    SpawnThing(false, 270, 300, 2000);
                    break;
                case 120:
                    SpawnThing(false, 90, 300, 2000);
                    break;

                default:
                    break;
            }

        }
        //End Bahaar
    }

    function alertMessage(msg) {
        if (sendToAlert) {
            mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
                type: 43,
                chat: 0,
                channel: 0,
                message: msg
            });
        }
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

    function SpawnThing(hide, degrees, radius, times) {
        let r = null, rads = null, finalrad = null;

        r = bossCurAngle - Math.PI;
        rads = (degrees * Math.PI / 180);
        finalrad = r - rads;
        bossCurLocation.x = bossCurLocation.x + radius * Math.cos(finalrad);
        bossCurLocation.y = bossCurLocation.y + radius * Math.sin(finalrad);

        if (!hide) {
            mod.send('S_SPAWN_BUILD_OBJECT', 2, {
                gameId: uid1,
                itemId: MarkerItem1,
                loc: curLocation,
                w: r,
                unk: 0,
                ownerName: 'SAFE',
                message: 'SAFE'
            });

            //if (hide) { curLocation.z = curLocation.z - 1000; }
            mod.send('S_SPAWN_DROPITEM', 8, {
                gameId: uid2,
                item: MarkerItem2,
                loc: curLocation,
                amount: 1,
                expiry: 600000,
                owners: [{
                    id: 0
                }],
                ownerName: "TDN"
            });
            //if (hide) { curLocation.z = curLocation.z + 1000; }

            setTimeout(DespawnThing, times, uid1, uid2);
            uid1--;
            uid2--;
        }
    }

    function DespawnThing(uid_arg1, uid_arg2) {
        mod.send('S_DESPAWN_BUILD_OBJECT', 2, {
            gameId: uid_arg1

        });
        mod.send('S_DESPAWN_DROPITEM', 4, {
            gameId: uid_arg2
        });
    }

    function Spawnitem(item, degrees, radius, times) {
        let r = null, rads = null, finalrad = null, pos = {};

        r = bossCurAngle - Math.PI;
        rads = (degrees * Math.PI / 180);
        finalrad = r - rads;
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

        setTimeout(Despawn, times, uid0);
        uid0--;
    }

    function Despawn(uid_arg0) {
        mod.send('S_DESPAWN_COLLECTION', 2, {
            gameId: uid_arg0
        });
    }

    function Spawnitem1(item, degrees, maxRadius, times) {
        for (var radius = 50; radius <= maxRadius; radius += 50) {
            Spawnitem(item, degrees, radius, times);
        }
    }

    function SpawnitemCircle(item, intervalDegrees, radius, times, shift_distance, shift_angle) {
        if (shift_angle) {
            bossCurAngle = (bossCurAngle - Math.PI) - (shift_angle * (Math.PI / 180));
        }
        if (shift_distance) {
            bossCurLocation.x = bossCurLocation.x + shift_distance * Math.cos(bossCurAngle);
            bossCurLocation.y = bossCurLocation.y + shift_distance * Math.sin(bossCurAngle);
        }
        for (var degrees = 0; degrees < 360; degrees += intervalDegrees) {
            Spawnitem(item, degrees, radius, times);
        }
    }
}
