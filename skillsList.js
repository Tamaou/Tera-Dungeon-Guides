module.exports = {
    KelsaikAction: {
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
        215: { msg: 'Inner FIRE', mark_interval: 10, mark_distance: 400 }
    }, HagufnaAction: {
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
    }, UndyingWarlordAction: {
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
        303: { msg: 'DONUT Incoming(TAKE NOTE)', mark_interval: 10, mark_distance: 250, mark2_interval: 10, mark2_distance: 600 },
        304: { msg: 'DONUT Incoming (TAKE NOTE)', mark_interval: 10, mark_distance: 250, mark2_interval: 10, mark2_distance: 600 },
        305: { msg: 'Target Lock(Jumping)' },
        307: { msg: 'Charge Complete > Jumping to Target' },
        309: { msg: 'Boss Grab' },
        310: { msg: 'Jump Backwards' },
        313: { msg: 'Jump > Slam' },
        314: { msg: 'AOE(Explosion)' },
    }, DraakonAction: {
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
    }
}