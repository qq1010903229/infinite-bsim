
// ------------------------------------------------------------ Data


let tierNames = [
    "Multi",
    "Resets",
    "Prestige",
    "Power",
    "Ascension",
    "Rebirths",
    "Transcension",
    "Divinity",
    "Supremity",
    "Hyperity",
]

let tierColors = [
    "#f56",
    "#4b5",
    "#68f",
    "#aa3",
    "#4ac",
    "#aaa",
    "#c4c",
    "#f94",
    "#777",
    "#a7c",
]

let unlocks = {
    "btn1": {
        desc: () => "Gain 1 Money per second",
        condition: () => D.gte(game.money, 10),
        conDisplay: () => "−" + format(10) + " Money",
        execute: () => game.money = D.sub(game.money, 10),
    },
    "btn2": {
        requires: ["btn1"],
        desc: () => "Unlock Multi",
        condition: () => D.gte(game.money, 10),
        conDisplay: () => "−" + format(10) + " Money",
        execute: () => { game.money = D.sub(game.money, 10); makeRow(-1); },
    },
    "btn3": {
        requires: ["btn2"],
        desc: () => "Unlock Resets",
        condition: () => D.gte(game.money, 1e5),
        conDisplay: () => "−" + format(1e5) + " Money",
        execute: () => { game.money = D.sub(game.money, 1e5); makeRow(0); },
    },
    "btn4": {
        requires: ["btn3"],
        desc: () => "Unlock X-axis expansion",
        condition: () => D.gte(getRowAmount(0), 1e9),
        conDisplay: () => "−" + format(1e9) + " Multi",
        execute: () => { let r = game.ladder.find(x => D.eq(x.tier, 0)); r.amount = D.sub(r.amount, 1e9); makeRow(1); },
    },
    "btn5": {
        requires: ["btn3"],
        desc: () => "Unlock Y-axis expansion",
        condition: () => D.gte(game.money, 1e12),
        conDisplay: () => "−" + format(1e12) + " Money",
        execute: () => { game.money = D.sub(game.money, 1e12); },
    },
    "btn6": {
        requires: ["btn5"],
        desc: () => "Mark button numbers",
        condition: () => D.gte(game.money, 1e25),
        conDisplay: () => "−" + format(1e25) + " Money",
        execute: () => { game.money = D.sub(game.money, 1e25); allDirty = true; },
    },
    "rne1": {
        requires: ["btn4"],
        desc: () => "Unlock Runes",
        condition: () => D.gte(getRowAmount(2), 1),
        conDisplay: () => "−" + format(1) + " Prestige",
        execute: () => { let r = game.ladder.find(x => D.eq(x.tier, 2)); r.amount = D.sub(r.amount, 1); updateTabVisibility(); },
    },
    "rne2": {
        requires: ["rne1"],
        desc: () => "Unlock Rune merging",
        condition: () => D.gte(game.gems, 2500),
        conDisplay: () => "−" + format(2500) + " Gems",
        execute: () => { game.gems = D.sub(game.gems, 2500); },
    },
    "rne3": {
        requires: ["rne2"],
        desc: () => "Unlock Bulk scraping",
        condition: () => D.gte(game.scraps, 250),
        conDisplay: () => "−" + format(250) + " Glyphs",
        execute: () => { game.scraps = D.sub(game.scraps, 250); },
    },
    "mle1": {
        requires: ["rne1"],
        desc: () => "Unlock Milestones",
        condition: () => D.gte(getRowAmount(3), 1),
        conDisplay: () => "−" + format(1) + " Power",
        execute: () => { let r = game.ladder.find(x => D.eq(x.tier, 3)); r.amount = D.sub(r.amount, 1); updateTabVisibility(); },
    },
    "tok1": {
        requires: ["mle1"],
        desc: () => "Unlock Tokens",
        condition: () => D.gte(getRowAmount(4), 1),
        conDisplay: () => "−" + format(1) + " Ascension",
        execute: () => { let r = game.ladder.find(x => D.eq(x.tier, 4)); r.amount = D.sub(r.amount, 1); updateTabVisibility(); },
    },
    "tok2": {
        requires: ["tok1"],
        desc: () => "Unlock Rune upgrades",
        condition: () => D.gte(game.tokens, 2000),
        conDisplay: () => "−" + format(2000) + " Tokens",
        execute: () => { game.tokens = D.sub(game.tokens, 2000); },
    },
    "tok3": {
        requires: ["tok2"],
        desc: () => "Unlock Rune effect shop",
        condition: () => D.gte(game.tokens, 10000),
        conDisplay: () => "−" + format(10000) + " Tokens",
        execute: () => { game.tokens = D.sub(game.tokens, 10000); },
    },
    "atm1": {
        requires: ["btn6"],
        desc: () => "Unlock Automation",
        condition: () => D.gte(game.money, 1e100),
        conDisplay: () => "−" + format(1e100) + " Money",
        execute: () => { game.money = D.sub(game.money, 1e100); updateTabVisibility(); },
    },
    "atm1a": {
        requires: ["atm1"],
        desc: () => "Unlock Reset Automator",
        condition: () => D.gte(game.money, 1e200),
        conDisplay: () => "−" + format(1e200) + " Money",
        execute: () => { game.money = D.sub(game.money, 1e200); },
    },
    "atm2a": {
        requires: ["atm1a"],
        desc: () => "Unlock Automator configs",
        condition: () => D.gte(game.money, 1e250),
        conDisplay: () => "−" + format(1e250) + " Money",
        execute: () => { game.money = D.sub(game.money, 1e250); },
    },
    "atm3a": {
        requires: ["atm2a"],
        desc: () => "Unlock Automator controller",
        condition: () => D.gte(game.money, 1e300),
        conDisplay: () => "−" + format(1e300) + " Money",
        execute: () => { game.money = D.sub(game.money, 1e300); },
    },
    "atm4a": {
        requires: ["atm3a"],
        desc: () => "Unlock Charger odometer",
        condition: () => D.gte(game.money, Number.MAX_VALUE),
        conDisplay: () => "−" + format(Number.MAX_VALUE) + " Money",
        execute: () => { game.money = D.sub(game.money, Number.MAX_VALUE); },
    },
    "atm5a": {
        requires: ["atm4a", "sig1"],
        desc: () => "Unlock Sigil Automator",
        condition: () => D.gte(temp.sigilPoints, 1250),
        conDisplay: () => "≥" + format(1250) + " Sigil Points",
        execute: () => {  },
    },
    "atm2": {
        requires: ["atm1"],
        desc: () => "Unlock Big Charges",
        condition: () => D.gte(game.charge, 500),
        conDisplay: () => "−" + format(500) + " Charge",
        execute: () => { game.charge = D.sub(game.charge, 500); },
    },
    "atm3": {
        requires: ["atm2"],
        desc: () => "Unlock Wide Charges",
        condition: () => D.gte(game.charge, 10000),
        conDisplay: () => "−" + format(10000) + " Charge",
        execute: () => { game.charge = D.sub(game.charge, 10000); },
    },
    "atm4": {
        requires: ["atm3", "tok1"],
        desc: () => "Charges give Tokens",
        condition: () => D.gte(game.charge, 62500),
        conDisplay: () => "−" + format(62500) + " Charge",
        execute: () => { game.charge = D.sub(game.charge, 62500); },
    },
    "sig1": {
        requires: ["tok1"],
        desc: () => "Unlock Sigils",
        condition: () => D.gte(temp.skillLevel,100),
        conDisplay: () => "Skill level ≥" + format(100) + "",
        execute: () => { updateTabVisibility(); },
    },
    "col1": {
        requires: ["sig1", "atm4", "atm4a", "tok3", "rne3"],
        desc: () => "Unlock Collapse",
        condition: () => D.gte(temp.skillLevel,200),
        conDisplay: () => "Skill level ≥" + format(200) + "",
        execute: () => { updateTabVisibility(); },
    },
    "rne4": {
        requires: ["col1"],
        desc: () => "Unlock Rune Buy Max",
        condition: () => D.gte(game.money, '1e600'),
        conDisplay: () => "≥" + format('1e600') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "rne5": {
        requires: ["rne4"],
        desc: () => "Unlock Filtered Scrap",
        condition: () => D.gte(game.money, '1e750'),
        conDisplay: () => "≥" + format('1e750') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "tok4": {
        requires: ["col1"],
        desc: () => "Auto-click can gain Tokens",
        condition: () => D.gte(game.money, '1e700'),
        conDisplay: () => "≥" + format('1e700') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "atm6": {
        requires: ["col1"],
        desc: () => "Unlock Rune Buy-Scrap Automator",
        condition: () => D.gte(game.money, '1e800'),
        conDisplay: () => "≥" + format('1e800') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "rne6": {
        requires: ["rne5"],
        desc: () => "Runes Boost All Buttons",
        condition: () => D.gte(game.money, '1e1000'),
        conDisplay: () => "≥" + format('1e1000') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "mle2": {
        requires: ["col1"],
        desc: () => "Improved Milestone",
        condition: () => D.gte(game.money, '1e1500'),
        conDisplay: () => "≥" + format('1e1500') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "atm7": {
        requires: ["mle2","atm6"],
        desc: () => "Unlock Milestone Automator",
        condition: () => D.gte(game.money, '1e2000'),
        conDisplay: () => "≥" + format('1e2000') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "sig2": {
        requires: ["col1"],
        desc: () => "Sigil-Shift I",
        condition: () => D.gte(game.money, '1e2500'),
        conDisplay: () => "≥" + format('1e2500') + " Money",
        execute: () => { while (game.sigils.length <= 9) game.sigils.push(D(0)); },
    },
    "atm8": {
        requires: ["rne5","atm7"],
        desc: () => "Unlock Autoscrapper",
        condition: () => D.gte(game.money, '1e3000'),
        conDisplay: () => "≥" + format('1e3000') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "col2": {
        requires: ["tok4", "sig2", "atm8", "mle2", "rne6"],
        desc: () => "Unlock Collapse Boost",
        condition: () => D.gte(game.collapsed,50),
        conDisplay: () => "≥" + format(50) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "rne7": {
        requires: ["col2"],
        desc: () => "Unlock Rune Tier Expansion",
        condition: () => D.gte(game.gems, 1e15),
        conDisplay: () => "−" + format(1e15) + " Gems",
        execute: () => { game.gems = D.sub(game.gems, 1e15); },
    },
    "sig3": {
        requires: ["col2"],
        desc: () => "Sigil-Shift II",
        condition: () => D.gte(game.money, '1e5000'),
        conDisplay: () => "≥" + format('1e5000') + " Money",
        execute: () => { while (game.sigils.length <= 9) game.sigils.push(D(0)); },
    },
    "atm9": {
        requires: ["col2"],
        desc: () => "Unlock Autocharger",
        condition: () => D.gte(game.money, '1e7500'),
        conDisplay: () => "≥" + format('1e7500') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "col3": {
        requires: ["sig3", "atm9", "rne7"],
        desc: () => "Improve Collapse I",
        condition: () => D.gte(game.collapsed,100),
        conDisplay: () => "≥" + format(100) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig4": {
        requires: ["col3"],
        desc: () => "Sigil-Shift III",
        condition: () => D.gte(game.money, '1e10000'),
        conDisplay: () => "≥" + format('1e10000') + " Money",
        execute: () => { while (game.sigils.length <= 9) game.sigils.push(D(0)); },
    },
    "atm10": {
        requires: ["col3"],
        desc: () => "Unlock Automerger",
        condition: () => D.gte(game.money, '1e15000'),
        conDisplay: () => "≥" + format('1e15000') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "col4": {
        requires: ["sig4", "atm10"],
        desc: () => "Unlock Another Collapse Boost",
        condition: () => D.gte(game.collapsed,150),
        conDisplay: () => "≥" + format(150) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig5": {
        requires: ["col4"],
        desc: () => "Sigil-Shift IV",
        condition: () => D.gte(game.money, '1e20000'),
        conDisplay: () => "≥" + format('1e20000') + " Money",
        execute: () => { while (game.sigils.length <= 9) game.sigils.push(D(0)); },
    },
    "col5": {
        requires: ["sig5"],
        desc: () => "Unlock Another Collapse Boost",
        condition: () => D.gte(game.collapsed,250),
        conDisplay: () => "≥" + format(250) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig6": {
        requires: ["col5"],
        desc: () => "Sigil-Shift V",
        condition: () => D.gte(game.money, '1e40000'),
        conDisplay: () => "≥" + format('1e40000') + " Money",
        execute: () => { while (game.sigils.length <= 9) game.sigils.push(D(0)); },
    },
    "rne8": {
        requires: ["col5"],
        desc: () => "Improved Rune Effect I",
        condition: () => D.gte(game.gems, 1e40),
        conDisplay: () => "−" + format(1e40) + " Gems",
        execute: () => { game.gems = D.sub(game.gems, 1e40); },
    },
    "atm11": {
        requires: ["col5"],
        desc: () => "Unlock Rune Autobuyer",
        condition: () => D.gte(game.money, '1e50000'),
        conDisplay: () => "≥" + format('1e50000') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "col6": {
        requires: ["sig6", "rne8", "atm11"],
        desc: () => "Unlock Another Collapse Boost",
        condition: () => D.gte(game.collapsed,350),
        conDisplay: () => "≥" + format(350) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig7": {
        requires: ["col6"],
        desc: () => "Sigil-Shift VI",
        condition: () => D.gte(game.money, '1e80000'),
        conDisplay: () => "≥" + format('1e80000') + " Money",
        execute: () => { while (game.sigils.length <= 9) game.sigils.push(D(0)); },
    },
    "atm12": {
        requires: ["col6"],
        desc: () => "Improve Rune Buy-Scrap Automator",
        condition: () => D.gte(game.charge, 1e50),
        conDisplay: () => "−" + format(1e50) + " Charge",
        execute: () => { game.charge = D.sub(game.charge, 1e50); },
    },
    "tok5": {
        requires: ["col6"],
        desc: () => "Improved Multi Button Tokens",
        condition: () => D.gte(game.money, '1e60000'),
        conDisplay: () => "≥" + format('1e60000') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "atm13": {
        requires: ["atm12"],
        desc: () => "Improve Sigil Automator",
        condition: () => D.gte(game.charge, 1e60),
        conDisplay: () => "−" + format(1e60) + " Charge",
        execute: () => { game.charge = D.sub(game.charge, 1e60); },
    },
    "col7": {
        requires: ["sig7", "tok5", "atm12"],
        desc: () => "Unlock Another Collapse Boost",
        condition: () => D.gte(game.collapsed,500),
        conDisplay: () => "≥" + format(500) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "btn7": {
        requires: ["col7"],
        desc: () => "Reduce Button Requirements",
        condition: () => D.gte(game.money, '1e111111'),
        conDisplay: () => "−" + format('1e111111') + " Money",
        execute: () => { game.money = D.sub(game.money,  '1e111111'); allDirty = true; },
    },
    "col8": {
        requires: ["btn7"],
        desc: () => "Unlock Another Collapse Boost",
        condition: () => D.gte(game.collapsed,600),
        conDisplay: () => "≥" + format(600) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); makeSuperRow(-1); },
    },
    "btn8": {
        requires: ["col8"],
        desc: () => "Buttons resets nothing",
        condition: () => D.gte(game.money, '1e150000'),
        conDisplay: () => "≥" + format('1e150000') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "sig8": {
        requires: ["col8"],
        desc: () => "Sigil-Shift VII",
        condition: () => D.gte(game.money, '1e160000'),
        conDisplay: () => "≥" + format('1e160000') + " Money",
        execute: () => { while (game.sigils.length <= 9) game.sigils.push(D(0)); },
    },
    "col9": {
        requires: ["btn8","sig8"],
        desc: () => "Improve Collapse II",
        condition: () => D.gte(game.collapsed,750),
        conDisplay: () => "≥" + format(750) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); makeSuperRow(-1); },
    },
    "rne9": {
        requires: ["col9"],
        desc: () => "Improved Rune Effect II",
        condition: () => D.gte(game.gems, 1e85),
        conDisplay: () => "−" + format(1e85) + " Gems",
        execute: () => { game.gems = D.sub(game.gems, 1e85); },
    },
    "rne10": {
        requires: ["col9"],
        desc: () => "Improved Gem Generator Upgrader",
        condition: () => D.gte(game.money, '1e222222'),
        conDisplay: () => "≥" + format('1e222222') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "col10": {
        requires: ["rne9","rne10","atm13"],
        desc: () => "Unlock Another Collapse Boost",
        condition: () => D.gte(game.collapsed,900),
        conDisplay: () => "≥" + format(900) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig9": {
        requires: ["col10"],
        desc: () => "Sigil-Shift VIII",
        condition: () => D.gte(game.money, '1e320000'),
        conDisplay: () => "≥" + format('1e320000') + " Money",
        execute: () => { while (game.sigils.length <= 9) game.sigils.push(D(0)); },
    },
    "sig10": {
        requires: ["sig9"],
        desc: () => "Sigil-Shift All",
        condition: () => D.gte(game.money, '1e333333'),
        conDisplay: () => "≥" + format('1e333333') + " Money",
        execute: () => { while (game.sigils.length <= 9) game.sigils.push(D(0)); },
    },
    "col11": {
        requires: ["col10"],
        desc: () => "Unlock Another Collapse Boost",
        condition: () => D.gte(game.collapsed,1000),
        conDisplay: () => "≥" + format(1000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col12": {
        requires: ["col11","sig10"],
        desc: () => "Unlock Another Collapse Boost",
        condition: () => D.gte(game.collapsed,1111),
        conDisplay: () => "≥" + format(1111) + " Collapsed Layers",
        execute: () => { game.ladder.pop();game.ladder.pop();game.ladder.pop(); game.automators.reset.depth=6;loadTab('buttons');updateTabVisibility(); },
    },
    "sbtn1": {
        requires: ["col12"],
        desc: () => "Reduce Super-Multi Requirements",
        condition: () => D.gte(getSuperAmount(0), 1e60),
        conDisplay: () => "≥" + format(1e60) + " Super-Multi",
        execute: () => { updateTabVisibility(); },
    },
    "rne11": {
        requires: ["sbtn1"],
        desc: () => "Unlock Gem Generator Automator",
        condition: () => D.gte(game.money, '1e1000000'),
        conDisplay: () => "≥" + format('1e1000000') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "rne12": {
        requires: ["sbtn1"],
        desc: () => "Improve Rune Rarity",
        condition: () => D.gte(game.gems, '1e111'),
        conDisplay: () => "≥" + format('1e111') + " Gems",
        execute: () => { updateTabVisibility(); },
    },
    "col13": {
        requires: ["rne11","rne12"],
        desc: () => "Improve Collapse III",
        condition: () => D.gte(game.collapsed,2000),
        conDisplay: () => "≥" + format(2000) + " Collapsed Layers",
        execute: () => { game.ladder.pop();game.ladder.pop(); game.automators.reset.depth=4;loadTab('buttons');updateTabVisibility(); },
    },
    "tok6": {
        requires: ["col13"],
        desc: () => "Unlock More Token Upgrades",
        condition: () => D.gte(game.money, '1e1600000'),
        conDisplay: () => "≥" + format('1e1600000') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "tok7": {
        requires: ["tok6"],
        desc: () => "Money token doubler affects all buttons",
        condition: () => D.gte(game.money, '1e2000000'),
        conDisplay: () => "≥" + format('1e2000000') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "rne13": {
        requires: ["sbtn1"],
        desc: () => "Improved Rune Effect III",
        condition: () => D.gte(game.collapsed,2500),
        conDisplay: () => "≥" + format(2500) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col14": {
        requires: ["tok7","rne13"],
        desc: () => "Improve Collapse IV",
        condition: () => D.gte(game.collapsed,3000),
        conDisplay: () => "≥" + format(3000) + " Collapsed Layers",
        execute: () => { game.ladder.pop(); game.automators.reset.depth=3;loadTab('buttons');updateTabVisibility(); },
    },
    "btn9": {
        requires: ["col14"],
        desc: () => "Show Ordinal Button Numbers",
        condition: () => D.gte(game.money, '1e5000000'),
        conDisplay: () => "≥" + format('1e5000000') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "sig11": {
        requires: ["col14"],
        desc: () => "Sigil boost Tokens",
        condition: () => D.gte(game.money, '1e6900000'),
        conDisplay: () => "≥" + format('1e6900000') + " Money",
        execute: () => { updateTabVisibility(); },
    },
    "rne14": {
        requires: ["col14"],
        desc: () => "Improved Rune Effect IV",
        condition: () => D.gte(game.collapsed,5000),
        conDisplay: () => "≥" + format(5000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig12": {
        requires: ["sig11"],
        desc: () => "Glyphs generate All-Above sigil",
        condition: () => D.gte(game.collapsed,7500),
        conDisplay: () => "≥" + format(7500) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig13": {
        requires: ["sig12"],
        desc: () => "All-Above sigil generate Hypothetical sigil",
        condition: () => D.gte(game.collapsed,8000),
        conDisplay: () => "≥" + format(8000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig14": {
        requires: ["sig13"],
        desc: () => "Hypothetical sigil generate Supreme sigil",
        condition: () => D.gte(game.collapsed,8500),
        conDisplay: () => "≥" + format(8500) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig15": {
        requires: ["sig14"],
        desc: () => "Supreme sigil generate Mythical sigil ",
        condition: () => D.gte(game.collapsed,9000),
        conDisplay: () => "≥" + format(9000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig16": {
        requires: ["sig15"],
        desc: () => "Mythical sigil generate Unique sigil",
        condition: () => D.gte(game.collapsed,9500),
        conDisplay: () => "≥" + format(9500) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "rne15": {
        requires: ["rne14"],
        desc: () => "Runes boost Super Button gain",
        condition: () => D.gte(game.collapsed,10000),
        conDisplay: () => "≥" + format(10000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); for(var i in game.runes)game.runes[i].stats.push('super');for(var i in game.runeEquip)game.runeEquip[i].stats.push('super');},
    },
    "sig17": {
        requires: ["sig16"],
        desc: () => "Unique sigil generate Legendary sigil",
        condition: () => D.gte(game.collapsed,10000),
        conDisplay: () => "≥" + format(10000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig18": {
        requires: ["sig17"],
        desc: () => "Legendary sigil generate Epic sigil",
        condition: () => D.gte(game.collapsed,11000),
        conDisplay: () => "≥" + format(11000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig19": {
        requires: ["sig18"],
        desc: () => "Epic sigil generate Rare sigil",
        condition: () => D.gte(game.collapsed,12000),
        conDisplay: () => "≥" + format(12000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig20": {
        requires: ["sig19"],
        desc: () => "Rare sigil generate Uncommon Sigil",
        condition: () => D.gte(game.collapsed,13500),
        conDisplay: () => "≥" + format(13500) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig21": {
        requires: ["sig20"],
        desc: () => "Uncommon Sigil generate Common Sigil",
        condition: () => D.gte(game.collapsed,15000),
        conDisplay: () => "≥" + format(15000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "rne16": {
        requires: ["rne15"],
        desc: () => "Improved Rune Effect V",
        condition: () => D.gte(game.collapsed,16666),
        conDisplay: () => "≥" + format(16666) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col15": {
        requires: ["sig21","rne16"],
        desc: () => "Super Buttons won't reset anything",
        condition: () => D.gte(game.collapsed,25000),
        conDisplay: () => "≥" + format(25000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col16": {
        requires: ["col15"],
        desc: () => "Unlock Another Collapse Boost",
        condition: () => D.gte(game.collapsed,27000),
        conDisplay: () => "≥" + format(27000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col17": {
        requires: ["col16"],
        desc: () => "Unlock Super Collapse",
        condition: () => D.gte(game.collapsed,30000),
        conDisplay: () => "≥" + format(30000) + " Collapsed Layers",
        execute: () => { updateTabVisibility();loadTab('buttons'); },
    },
    "sig22": {
        requires: ["col17"],
        desc: () => "Sigil boost Super Buttons",
        condition: () => D.gte(game.collapsed,60000),
        conDisplay: () => "≥" + format(60000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col18": {
        requires: ["sig22"],
        desc: () => "Improve Collapse V",
        condition: () => D.gte(game.collapsed,100000),
        conDisplay: () => "≥" + format(100000) + " Collapsed Layers",
        execute: () => { game.ladder.pop();game.ladder.pop();game.ladder.pop();updateTabVisibility();loadTab('buttons'); },
    },
    "rne17": {
        requires: ["col18"],
        desc: () => "Improved Rune Effect VI",
        condition: () => D.gte(game.collapsed,150000),
        conDisplay: () => "≥" + format(150000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col19": {
        requires: ["col18"],
        desc: () => "Unlock Super Collapse Boost",
        condition: () => D.gte(game.collapsed,200000),
        conDisplay: () => "≥" + format(200000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col20": {
        requires: ["col19"],
        desc: () => "Unlock Another Collapse Boost",
        condition: () => D.gte(game.collapsed,250000),
        conDisplay: () => "≥" + format(250000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig23": {
        requires: ["col20"],
        desc: () => "Improve Sigil I",
        condition: () => D.gte(game.collapsed,270000),
        conDisplay: () => "≥" + format(270000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "tok8": {
        requires: ["sig23"],
        desc: () => "Unlock More Token Upgrades",
        condition: () => D.gte(game.collapsed,300000),
        conDisplay: () => "≥" + format(300000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "atm14": {
        requires: ["tok8"],
        desc: () => "Unlock Rune Autoequipper",
        condition: () => D.gte(game.collapsed,400000),
        conDisplay: () => "≥" + format(400000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col21": {
        requires: ["col19"],
        desc: () => "Unlock Another Super Collapse Boost",
        condition: () => D.gte(game.scollapsed,60),
        conDisplay: () => "≥" + format(60) + " Collapsed Super Layers",
        execute: () => { updateTabVisibility(); },
    },
    "mle3": {
        requires: ["atm14"],
        desc: () => "Improved Milestone II",
        condition: () => D.gte(game.collapsed,500000),
        conDisplay: () => "≥" + format(500000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig24": {
        requires: ["mle3"],
        desc: () => "Improve Sigil II",
        condition: () => D.gte(game.collapsed,600000),
        conDisplay: () => "≥" + format(600000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "rne18": {
        requires: ["sig24"],
        desc: () => "Improved Rune Effect VII",
        condition: () => D.gte(game.collapsed,700000),
        conDisplay: () => "≥" + format(700000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col22": {
        requires: ["col21"],
        desc: () => "Unlock Another Super Collapse Boost",
        condition: () => D.gte(game.scollapsed,80),
        conDisplay: () => "≥" + format(80) + " Collapsed Super Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig25": {
        requires: ["rne18"],
        desc: () => "Improve Sigil III",
        condition: () => D.gte(game.collapsed,1000000),
        conDisplay: () => "≥" + format(1000000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "tok9": {
        requires: ["sig25"],
        desc: () => "Cheaper Token Upgrades I",
        condition: () => D.gte(game.collapsed,1111111),
        conDisplay: () => "≥" + format(1111111) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig26": {
        requires: ["tok9"],
        desc: () => "Improve Sigil IV",
        condition: () => D.gte(game.collapsed,1400000),
        conDisplay: () => "≥" + format(1400000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "btn10": {
        requires: ["sig26"],
        desc: () => "Reduce Button Requirements",
        condition: () => D.gte(game.collapsed,1530000),
        conDisplay: () => "≥" + format(1530000) + " Collapsed Layers",
        execute: () => { allDirty = true; },
    },
    "col23": {
        requires: ["btn10"],
        desc: () => "Improved Collapse Boost I",
        condition: () => D.gte(game.collapsed,4000000),
        conDisplay: () => "≥" + format(4000000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sbtn2": {
        requires: ["col22"],
        desc: () => "Reduce Super Button Requirements I",
        condition: () => D.gte(game.scollapsed,100),
        conDisplay: () => "≥" + format(100) + " Collapsed Super Layers",
        execute: () => { updateTabVisibility(); },
    },
    "rne19": {
        requires: ["col23"],
        desc: () => "Cheaper Runes",
        condition: () => D.gte(game.collapsed,5000000),
        conDisplay: () => "≥" + format(5000000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "rne20": {
        requires: ["rne19"],
        desc: () => "Improved Rune Effect VIII",
        condition: () => D.gte(game.collapsed,6000000),
        conDisplay: () => "≥" + format(6000000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col24": {
        requires: ["rne20"],
        desc: () => "Improved Collapse Boost II",
        condition: () => D.gte(game.collapsed,12345678),
        conDisplay: () => "≥" + format(12345678) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sbtn3": {
        requires: ["sbtn2"],
        desc: () => "Reduce Button/Super Button Requirements",
        condition: () => D.gte(game.scollapsed,125),
        conDisplay: () => "≥" + format(125) + " Collapsed Super Layers",
        execute: () => { updateTabVisibility(); },
    },
    "atm15": {
        requires: ["col24"],
        desc: () => "Unlock Token Upgrade Automator",
        condition: () => D.gte(game.collapsed,15000000),
        conDisplay: () => "≥" + format(15000000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "atm16": {
        requires: ["atm15"],
        desc: () => "Unlock Automator Automator",
        condition: () => D.gte(game.collapsed,20000000),
        conDisplay: () => "≥" + format(20000000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "atm18": {
        requires: ["atm16"],
        desc: () => "Cheaper Charger Upgrades",
        condition: () => D.gte(game.collapsed,22500000),
        conDisplay: () => "≥" + format(22500000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "tok10": {
        requires: ["atm18"],
        desc: () => "Token Upgrades don't cost Tokens",
        condition: () => D.gte(game.collapsed,25000000),
        conDisplay: () => "≥" + format(25000000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "atm17": {
        requires: ["tok10"],
        desc: () => "Automator Upgrades don't cost Charge",
        condition: () => D.gte(game.collapsed,27500000),
        conDisplay: () => "≥" + format(27500000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig27": {
        requires: ["atm17"],
        desc: () => "Improve Sigil V",
        condition: () => D.gte(game.collapsed,30000000),
        conDisplay: () => "≥" + format(30000000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col25": {
        requires: ["sbtn3"],
        desc: () => "Unlock Another Super Collapse Boost",
        condition: () => D.gte(game.scollapsed,150),
        conDisplay: () => "≥" + format(150) + " Collapsed Super Layers",
        execute: () => { updateTabVisibility(); },
    },
    "rne21": {
        requires: ["sig27"],
        desc: () => "Improved Rune Effect IX",
        condition: () => D.gte(game.collapsed,35000000),
        conDisplay: () => "≥" + format(35000000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col26": {
        requires: ["col25"],
        desc: () => "Unlock Another Super Collapse Boost",
        condition: () => D.gte(game.scollapsed,175),
        conDisplay: () => "≥" + format(175) + " Collapsed Super Layers",
        execute: () => { game.super_ladder.pop();game.super_ladder.pop();game.super_ladder.pop();updateTabVisibility();loadTab('buttons'); },
    },
    "rne22": {
        requires: ["rne21"],
        desc: () => "Improved Rune Effect X",
        condition: () => D.gte(game.collapsed,40000000),
        conDisplay: () => "≥" + format(40000000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); for(var i in game.runes)game.runes[i].stats = ['money','gem1','scrap1','token1','charge1','super1'];for(var i in game.runeEquip)game.runeEquip[i].stats = ['money','gem1','scrap1','token1','charge1','super1'];},
    },
    "col27": {
        requires: ["col26"],
        desc: () => "Unlock Another Super Collapse Boost",
        condition: () => D.gte(game.scollapsed,200),
        conDisplay: () => "≥" + format(200) + " Collapsed Super Layers",
        execute: () => { updateTabVisibility();makeSuperRow2(0,-1);loadTab('buttons'); },
    },
    "rne23": {
        requires: ["rne22"],
        desc: () => "Improved Rune Effect XI",
        condition: () => D.gte(game.collapsed,80000000),
        conDisplay: () => "≥" + format(80000000) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig28": {
        requires: ["rne23"],
        desc: () => "Improve Sigil VI",
        condition: () => D.gte(game.collapsed,4e8),
        conDisplay: () => "≥" + format(4e8) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col28": {
        requires: ["col27"],
        desc: () => "Unlock Super^2-Button Automator",
        condition: () => D.gte(game.scollapsed,500),
        conDisplay: () => "≥" + format(500) + " Collapsed Super Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col29": {
        requires: ["col28"],
        desc: () => "Improve Super Collapse Boost",
        condition: () => D.gte(game.scollapsed,600),
        conDisplay: () => "≥" + format(600) + " Collapsed Super Layers",
        execute: () => { game.super_ladder.pop();game.super_ladder.pop();updateTabVisibility();loadTab('buttons'); },
    },
    "tok11": {
        requires: ["sig28"],
        desc: () => "Cheaper Token Upgrades II",
        condition: () => D.gte(game.collapsed,7e8),
        conDisplay: () => "≥" + format(7e8) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col30": {
        requires: ["col29"],
        desc: () => "Unlock Super^2-Collapse",
        condition: () => D.gte(game.scollapsed,1200),
        conDisplay: () => "≥" + format(1200) + " Collapsed Super Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig29": {
        requires: ["tok11"],
        desc: () => "Improve Sigil VII",
        condition: () => D.gte(game.collapsed,14e8),
        conDisplay: () => "≥" + format(14e8) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "rne24": {
        requires: ["sig29"],
        desc: () => "Improved Rune Effect XII",
        condition: () => D.gte(game.collapsed,2e9),
        conDisplay: () => "≥" + format(2e9) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "tok12": {
        requires: ["rne24"],
        desc: () => "Unlock more Token Upgrades",
        condition: () => D.gte(game.collapsed,25e8),
        conDisplay: () => "≥" + format(25e8) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig30": {
        requires: ["tok12"],
        desc: () => "Improve Sigil VIII",
        condition: () => D.gte(game.collapsed,3e9),
        conDisplay: () => "≥" + format(3e9) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "rne25": {
        requires: ["col30"],
        desc: () => "Rune cost nothing, improved rune autobuyer",
        condition: () => D.gte(game.scollapsed,2500),
        conDisplay: () => "≥" + format(2500) + " Collapsed Super Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sbtn4": {
        requires: ["sig30"],
        desc: () => "Reduce Super^2 Button Requirements",
        condition: () => D.gte(game.collapsed,4e9),
        conDisplay: () => "≥" + format(4e9) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "rne26": {
        requires: ["sbtn4"],
        desc: () => "Improved Rune Effect XIII",
        condition: () => D.gte(game.collapsed,1e10),
        conDisplay: () => "≥" + format(1e10) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "col31": {
        requires: ["rne26","rne25"],
        desc: () => "Improved Super Collapse",
        condition: () => D.gte(game.collapsed,5e10),
        conDisplay: () => "≥" + format(5e10) + " Collapsed Layers",
        execute: () => { game.super_ladder.pop();game.super_ladder.pop();game.super_ladder.pop();game.super_ladder.pop();updateTabVisibility();loadTab('buttons'); },
    },
    "rne27": {
        requires: ["col31"],
        desc: () => "Improved Rune Effect XIV",
        condition: () => D.gte(game.collapsed,2e11),
        conDisplay: () => "≥" + format(2e11) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sbtn5": {
        requires: ["col31"],
        desc: () => "Improved Super Button Tokens",
        condition: () => D.gte(game.scollapsed,16000),
        conDisplay: () => "≥" + format(16000) + " Collapsed Super Layers",
        execute: () => { updateTabVisibility(); },
    },
    "sig31": {
        requires: ["rne27"],
        desc: () => "Improve Sigil IX",
        condition: () => D.gte(game.collapsed,2e12),
        conDisplay: () => "≥" + format(2e12) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
    "rne28": {
        requires: ["sig31"],
        desc: () => "Improved Rune Effect XV",
        condition: () => D.gte(game.collapsed,3.6e12),
        conDisplay: () => "≥" + format(3.6e12) + " Collapsed Layers",
        execute: () => { updateTabVisibility(); },
    },
}
let visibleUnlocks = [];


// ------------------------------------------------------------ Functions


function getButtonGain(row, tier) {
    let base = D.eq(row, 0) ? 8 : 4;
    let mult = D.eq(row, 0) ? 1 : D.add(row, 1);
    return D.pow(base, D.pow(1.05, tier).sub(1).mul(20)).mul(mult);
}
function getSuperButtonGain(row, tier) {
    let base = 4;
    let mult = D.eq(row, 0) ? 100 : D.add(row, 1);
    return D.pow(base, D.pow(1.05, tier).sub(1).mul(20)).mul(mult);
}
function getSuperButtonGain2(y, row, tier) {
    let base = D.pow(0.9,y).mul(2).add(1);
    let mult = D.add(row, 1);
    return D.pow(base, D.pow(1.05, tier).sub(1).mul(20)).mul(mult);
}
function getRowMulti(row, index) {
    index ??= game.ladder.findIndex(x => D.eq(x.tier, row));
	if(index < 0)return D.add(getRowAmount(D.add(row, 1)), 1).mul(getAllMult())
	if(index == 0)return D.add(getRowAmount(D.add(row, 1)), 1).mul(temp.milestoneMultis[index] ?? 1).mul(temp.sigilEffects[index] ?? 1).mul(game.unlocks.rne6?(temp.runeStats.money ?? 1):1).mul(getCollapseMult()).mul(getAllMult());
    return D.add(getRowAmount(D.add(row, 1)), 1).mul(temp.milestoneMultis[index] ?? 1).mul(game.unlocks.rne6?(temp.runeStats.money ?? 1):1).mul(temp.sigilEffects[index] ?? 1).mul(getAllMult());
}
function getSuperMulti(row, index) {
    index ??= game.super_ladder.findIndex(x => D.eq(x.tier, row));
	if(index < 0)return D.add(getSuperAmount(D.add(row, 1)), 1).mul(getSuperAllMult());
	if(index == 0)return D.add(getSuperAmount(D.add(row, 1)), 1).mul(getSuperAllMult()).mul(getSuperCollapseMult());
	return D.add(getSuperAmount(D.add(row, 1)), 1).mul(getSuperAllMult());
}
function getSuperMulti2(y, row, index) {
    index ??= game.super_ladder2[y].findIndex(x => D.eq(x.tier, row));
	if(index == 0)return D.add(getSuperAmount2(y, D.add(row, 1)), 1).mul(getSuperAllMult2(y)).mul(D(getSuperAmount2(D.add(y, 1), 0)).add(1), 1).mul(getSuperCollapseMult2(y));
	return D.add(getSuperAmount2(y, D.add(row, 1)), 1).mul(getSuperAllMult2(y)).mul(D(getSuperAmount2(D.add(y, 1), 0)).add(1), 1);
}
function getButtonCost(row, tier) {
    let base = D.eq(row, 0) ? 5 : D.eq(row, 1) ? 1e5 : D.pow(2, row).mul(250);
	if(game.unlocks.btn7)base = D.pow(2, row);
	if(game.unlocks.btn10)return D.add(row, 1).sqrt().mul(10).pow(D.pow(getBtnScale(), tier).sub(1).mul(10)).mul(base);
	if(game.unlocks.btn7)return D.add(row, 1).sqrt().mul(10).pow(D.pow(1.09, tier).sub(1).mul(10)).mul(base);
    return D.add(row, 1).mul(10).pow(D.pow(1.1, tier).sub(1).mul(10)).mul(base);
}
function getHighestButton(row, amount) {
    let base = D.eq(row, 0) ? 5 : D.eq(row, 1) ? 1e5 : D.pow(2, row).mul(250);
	if(game.unlocks.btn7)base = D.pow(2, row);
	if(game.unlocks.btn10)return D.div(amount, base).logBase(D.add(row, 1).sqrt().mul(10)).div(10).add(1).logBase(getBtnScale()).floor().max(-1);
	if(game.unlocks.btn7)return D.div(amount, base).logBase(D.add(row, 1).sqrt().mul(10)).div(10).add(1).logBase(1.09).floor().max(-1);
    return D.div(amount, base).logBase(D.add(row, 1).mul(10)).div(10).add(1).logBase(1.1).floor().max(-1);
}

function getRowAmount(row) {
    return D(game.ladder.find(x => D.eq(x.tier, row))?.amount ?? 0);
}

function getSuperAmount(row) {
    return D(game.super_ladder.find(x => D.eq(x.tier, row))?.amount ?? 0);
}

function getSuperAmount2(y, row) {
	if(!game.super_ladder2[y])return 0;
    return D(game.super_ladder2[y].find(x => D.eq(x.tier, row))?.amount ?? 0);
}

function clickButton(row, tier, auto = false) {
    let index = game.ladder.findIndex(x => D.eq(x.tier, row));
    let data = game.ladder[index];
    let cost = getButtonCost(row, tier);
    if (index <= 0) {
        if (D.gte(game.money, cost)) {
            if(!game.unlocks.btn8)game.money = D.sub(game.money, cost);
            data.amount = getButtonGain(row, tier).mul(getRowMulti(row, index)).add(data.amount);
            data.presses = D.add(data.presses, 1);
			if (game.unlocks.tok5)game.tokens = D(game.collapsed).add(1).pow(temp.tokenUpgEffects.tokens.normalTierFactor).mul(getTokenMulti()).add(game.tokens);
            else if ((!auto || game.unlocks.tok4) && game.unlocks.tok1 && Math.random() * 100 <= temp.tokenUpgEffects.tokens.normalChance)
                game.tokens = D.add(row, 1).pow(temp.tokenUpgEffects.tokens.normalTierFactor).mul(getTokenMulti()).add(game.tokens);
            if (!auto) game.stats.presses++;
        }
    } else {
        let prevData = game.ladder[index - 1];
        if (D.gte(prevData.amount, cost)) {
            if(!game.unlocks.btn8)game.money = 0;
            if(!game.unlocks.btn8)for (let a = 0; a < index; a++) game.ladder[a].amount = game.ladder[a].level = D(0);
            data.amount = getButtonGain(row, tier).mul(getRowMulti(row)).add(data.amount);
            data.level = D(0);
            data.presses = D.add(data.presses, 1);
            if ((!auto || game.unlocks.tok4) && game.unlocks.tok1 && Math.random() * 100 <= temp.tokenUpgEffects.tokens.normalChance)
                game.tokens = D.add(row, 1).pow(temp.tokenUpgEffects.tokens.normalTierFactor).mul(getTokenMulti()).add(game.tokens);
            if (!auto) game.stats.presses++;
            if (game.unlocks.btn5) makeRow(row);
        }
    }
	if (game.unlocks.col9) makeRow((getAllMult().mul(game.unlocks.rne6?(temp.runeStats.money ?? 1):1).mul(temp.sigilEffects[9] ?? 1).logBase(2).floor()));
}

function clickSuperButton(row, tier, auto = false) {
    let index = game.super_ladder.findIndex(x => D.eq(x.tier, row));
    let data = game.super_ladder[index];
	let cost = getSuperButtonCost(row, tier);
    if (index <= 0) {
        if (D.gte(game.collapsed, cost)) {
            game.money = 0;
            data.amount = getSuperButtonGain(row, tier).mul(getSuperMulti(row, index)).add(data.amount);
            data.presses = D.add(data.presses, 1);
			if(game.unlocks.sbtn5)game.tokens = D(game.collapsed).add(1).pow(temp.tokenUpgEffects.tokens.normalTierFactor).mul(getTokenMulti()).mul(10000).mul(D(game.scollapsed).add(1).pow(temp.tokenUpgEffects.ext1?.superTierFactor ?? 1)).mul(temp.tokenUpgEffects.tokens?.gainFromSuper ?? 1).add(game.tokens);
			else game.tokens = D(game.collapsed).add(1).pow(temp.tokenUpgEffects.tokens.normalTierFactor).mul(getTokenMulti()).mul(10000).mul(temp.tokenUpgEffects.tokens?.gainFromSuper ?? 1).add(game.tokens);
			if(!game.unlocks.col10)game.collapsed = D(0);
            if(!game.unlocks.col10)for (let a = 0; a < game.ladder.length; a++) game.ladder[a] = {
				tier: D(a), 
				amount: D(0), 
				level: D(0),
				presses: D(0),
			};
            if (!auto) game.stats.presses++;
			makeSuperRow(0);
        }
    } else {
        let prevData = game.super_ladder[index - 1];
        if (D.gte(prevData.amount, cost)) {
            game.money = 0;
            data.amount = getSuperButtonGain(row, tier).mul(getSuperMulti(row)).add(data.amount);
            data.level = D(0);
            data.presses = D.add(data.presses, 1);
			game.tokens = D(game.collapsed).add(1).pow(temp.tokenUpgEffects.tokens.normalTierFactor).mul(getTokenMulti()).mul(10000).mul(D(row).add(1).pow(temp.tokenUpgEffects.ext1?.superTierFactor ?? 1)).mul(temp.tokenUpgEffects.tokens?.gainFromSuper ?? 1).add(game.tokens);
            if(!game.unlocks.col15)game.collapsed = D(0);
            if(!game.unlocks.col15)for (let a = 0; a < game.ladder.length; a++) game.ladder[a] = {
				tier: D(a), 
				amount: D(0), 
				level: D(0),
				presses: D(0),
			};
			if(!game.unlocks.col15)for (let a = 0; a < index; a++) game.super_ladder[a].amount = game.super_ladder[a].level = D(0);
            if (!auto) game.stats.presses++;
			makeSuperRow(row);
        }
    }
}

function clickSuperButton2(y, row, tier, auto = false) {
    let index = game.super_ladder2[y].findIndex(x => D.eq(x.tier, row));
    let data = game.super_ladder2[y][index];
	let cost = getSuperButtonCost2(y, row, tier);
    if (index <= 0) {
        if (D.gte(y==0?game.scollapsed:game.scollapsed2[y], cost)) {
            data.amount = getSuperButtonGain2(y, row, tier).mul(getSuperMulti2(y, row)).add(data.amount ?? 0);
            data.presses = D.add(data.presses, 1);
			game.tokens = D(game.collapsed).add(1).pow(temp.tokenUpgEffects.tokens.normalTierFactor)
			.mul(D(game.scollapsed).add(1).pow(temp.tokenUpgEffects.ext1?.superTierFactor ?? 1))
			.mul(getTokenMulti()).mul(1e14).add(game.tokens);
            if (!auto) game.stats.presses++;
			makeSuperRow2(y, 0);
			makeSuperRow2(D.add(y,1), -1);
        }
    } else {
        let prevData = game.super_ladder2[y][index - 1];
        if (D.gte(prevData.amount, cost)) {
            data.amount = getSuperButtonGain2(y, row, tier).mul(getSuperMulti2(y, row)).add(data.amount ?? 0);
            data.presses = D.add(data.presses, 1);
			game.tokens = D(game.collapsed).add(1).pow(temp.tokenUpgEffects.tokens.normalTierFactor)
			.mul(D(game.scollapsed).add(1).pow(temp.tokenUpgEffects.ext1?.superTierFactor ?? 1))
			.mul(getTokenMulti()).mul(1e14).add(game.tokens);
            if (!auto) game.stats.presses++;
			makeSuperRow2(y, row);
        }
    }
}

function makeRow(row) {
	if(game.unlocks.col18)return;
	row = D.min(row, 100002);
    let highest = game.ladder[game.ladder.length - 1] ?? {tier: -1};
    while (D.lte(highest.tier, row) && game.ladder.length < (game.unlocks.col14?4:game.unlocks.col13?5:game.unlocks.col12?7:10)) {
        highest = {
            tier: D.add(highest.tier, 1), 
            amount: D(0), 
            level: D(0),
            presses: D(0),
        };
        game.ladder.push(highest);
    }
	if(D.lte(highest.tier, row) && game.ladder.length == 10 && game.unlocks.col1 && !game.unlocks.col9){
		if(game.collapsed.gte(100) && !game.unlocks.col3)return;
		game.collapsed = D(game.collapsed).add(1);
		for(let i = 2;i < 10; i++){
			game.ladder[i-1]=game.ladder[i];
		}
		highest = {
            tier: D.add(highest.tier, 1), 
            amount: D(0), 
            level: D(0),
            presses: D(0),
        };
		game.ladder[9]=highest;
		updateRuneStats();
		updateMilestoneStats();
		updateAllChargerUpgEffects();
		updateAutomationStats();
		updateTokenStats();
		updateSigilEffects();
		allDirty = true;
	}
	if(D.lte(highest.tier, row) && game.ladder.length == (game.unlocks.col14?4:game.unlocks.col13?5:game.unlocks.col12?7:10) && game.unlocks.col9){
		let s = D.sub(row,highest.tier).add(1).floor();
		for(let i = 1;i < (game.unlocks.col14?4:game.unlocks.col13?5:game.unlocks.col12?7:10); i++){
			game.ladder[i]=game.ladder[D.add(i,s).toNumber()] ?? {
				tier: D.add(game.ladder[i].tier, s), 
				amount: D(0), 
				level: D(0),
				presses: D(0),
			};
		}
		updateRuneStats();
		updateMilestoneStats();
		updateAllChargerUpgEffects();
		updateAutomationStats();
		updateTokenStats();
		updateSigilEffects();
		allDirty = true;
		game.collapsed = D(game.ladder[1].tier).sub(1);
	}
}

function makeSuperRow(row) {
	if(game.unlocks.col31)return;
	row = D.min(row, 10003);
    let highest = game.super_ladder[game.super_ladder.length - 1] ?? {tier: -1};
    while (D.lte(highest.tier, row) && game.super_ladder.length < (game.unlocks.col29?5:game.unlocks.col26?7:10)) {
        highest = {
            tier: D.add(highest.tier, 1), 
            amount: D(0), 
            level: D(0),
            presses: D(0),
        };
        game.super_ladder.push(highest);
    }
	if(D.lte(highest.tier, row) && game.super_ladder.length == (game.unlocks.col29?5:game.unlocks.col26?7:10) && game.unlocks.col17){
		if(game.scollapsed.gte(100) && !game.unlocks.col3)return;
		game.scollapsed = D(game.scollapsed).add(1);
		for(let i = 2;i < (game.unlocks.col29?5:game.unlocks.col26?7:10); i++){
			game.super_ladder[i-1]=game.super_ladder[i];
		}
		highest = {
            tier: D.add(highest.tier, 1), 
            amount: D(0), 
            level: D(0),
            presses: D(0),
        };
		game.super_ladder[(game.unlocks.col29?4:game.unlocks.col26?6:9)]=highest;
		updateRuneStats();
		updateMilestoneStats();
		updateAllChargerUpgEffects();
		updateAutomationStats();
		updateTokenStats();
		updateSigilEffects();
		allDirty = true;
	}
}

function makeSuperRow2(y,row) {
	y=D(y).toNumber();
	if(game.super_ladder2[y]=== undefined)game.super_ladder2[y]=[];
    let highest = game.super_ladder2[y][game.super_ladder2[y].length - 1] ?? {tier: -1};
    while (D.lte(highest.tier, row) && game.super_ladder2[y].length < 4) {
        highest = {
            tier: D.add(highest.tier, 1), 
            amount: D(0), 
            level: D(0),
            presses: D(0),
        };
        game.super_ladder2[y].push(highest);
    }
	if(D.lte(highest.tier, row) && game.super_ladder2[y].length == 4 && game.unlocks.col30){
		game.scollapsed2[y] = D(game.scollapsed2[y] ?? 0).add(1);
		for(let i = 2;i < 4; i++){
			game.super_ladder2[y][i-1]=game.super_ladder2[y][i];
		}
		highest = {
            tier: D.add(highest.tier, 1), 
            amount: D(0), 
            level: D(0),
            presses: D(0),
        };
		game.super_ladder2[y][3]=highest;
		updateRuneStats();
		updateMilestoneStats();
		updateAllChargerUpgEffects();
		updateAutomationStats();
		updateTokenStats();
		updateSigilEffects();
		allDirty = true;
	}
}

function updateVisibleUnlocks() {
    visibleUnlocks = [];
    unlLoop: for (let unl in unlocks) {
        if (game.unlocks[unl]) continue;
        for (let prev of unlocks[unl].requires ?? []) if (!game.unlocks[prev]) continue unlLoop;
        visibleUnlocks.push(unl);
    }
}
function performUnlock(unl) {
    let data = unlocks[unl];
    if (data.condition()) {
        game.unlocks[unl] = true;
        data.execute();
        checkEndgame();
    }
}

function checkEndgame() {
    for (let unl in unlocks) if (!game.unlocks[unl]) return;

    let desc = document.createElement("div");
    desc.innerHTML = `
        You've purchased all the available unlocks currently in the game!<br/>
        However, it is not the end of the journey...<br/>
        There are more Token upgrades, make sure to stay tuned for future game updates!<br/>
        <br/>
        Time played: <b>${format.time(game.stats.timePlayed)}</b><br/>
    `
    showOverlay("popup", "Congratulations!", desc, ["Ok"]);
}

function doMultiAuto(times) {
    if (game.ladder.length <= 0) return;
	if(game.unlocks.btn8){
		let row = game.ladder[0]
		let pos = getHighestButton(row.tier, game.money);
		if(D.lt(pos, 0))return;
		let gain = getButtonGain(row.tier, pos);
		row.amount = D.add(row.amount, D.mul(gain, times).mul(getRowMulti(row.tier)));
		row.presses = D.add(row.presses, times);
		game.tokens = D(game.collapsed).add(1).pow(temp.tokenUpgEffects.tokens.normalTierFactor).mul(getTokenMulti()).mul(times).add(game.tokens);
		game.ladder[0] = row;
		return;
	}
    let row = game.ladder[0]
    let pos = getHighestButton(row.tier, game.money);
    while (D.gt(times, 0) && D.gte(pos, 0) && D.gt(game.money, 0)) {
        let cost = getButtonCost(row.tier, pos);
        let gain = getButtonGain(row.tier, pos);
        let presses = D.div(game.money, cost).floor().min(times);
        game.money = D.sub(game.money, D.mul(cost, presses));
        row.amount = D.add(row.amount, D.mul(gain, presses).mul(getRowMulti(row.tier)));
        row.presses = D.add(row.presses, presses);
		if (game.unlocks.tok5)game.tokens = D(game.collapsed).add(1).pow(temp.tokenUpgEffects.tokens.normalTierFactor).mul(getTokenMulti()).mul(presses).add(game.tokens);
	    else if (game.unlocks.tok4)game.tokens = getTokenMulti().mul(presses).mul(temp.tokenUpgEffects.tokens.normalChance/100).add(game.tokens);
        times = D.sub(times, presses);
        pos = D.sub(pos, 1);
    }
    game.ladder[0] = row;
}

function doSuperMultiAuto(times) {
    if (game.super_ladder.length <= 0) return;
    let row = game.super_ladder[0]
    let pos = getHighestSuperButton(row.tier, game.collapsed);
	if(D.lt(pos, 0))return;
    let gain = getSuperButtonGain(row.tier, pos);
    row.amount = D.add(row.amount, D.mul(gain, times).mul(getSuperMulti(row.tier)));
    row.presses = D.add(row.presses, times);
	if(game.unlocks.sbtn5)game.tokens = D(game.collapsed).add(1).pow(temp.tokenUpgEffects.tokens.normalTierFactor).mul(getTokenMulti()).mul(10000).mul(D(game.scollapsed).add(1).pow(temp.tokenUpgEffects.ext1?.superTierFactor ?? 1)).mul(temp.tokenUpgEffects.tokens?.gainFromSuper ?? 1).mul(times).add(game.tokens);
	else game.tokens = D(game.collapsed).add(1).pow(temp.tokenUpgEffects.tokens.normalTierFactor).mul(getTokenMulti()).mul(10000).mul(temp.tokenUpgEffects.tokens?.gainFromSuper ?? 1).mul(times).add(game.tokens);
    game.super_ladder[0] = row;
	updateRuneStats();
	updateMilestoneStats();
	updateAllChargerUpgEffects();
	updateAutomationStats();
	updateTokenStats();
	updateSigilEffects();
}

function doResetAuto(times) {
    if (game.ladder.length <= 0 || game.unlocks.col18) return;
	if(game.unlocks.btn8){
		for (let a = (game.automators.reset?.depth ?? 1); a >= 1; a--) {
            let row = game.ladder[a];
            let pos = getHighestButton(row.tier, game.ladder[a - 1].amount);
            if (D.lt(pos, 0)) continue;
            let gain = getButtonGain(row.tier, pos).mul(getRowMulti(row.tier));
			row.amount = gain.mul(times).add(row.amount);
            row.presses = D.add(row.presses, times);
            game.tokens = D.add(row.tier, 1).pow(temp.tokenUpgEffects.tokens.normalTierFactor).mul(getTokenMulti()).mul(times).mul(temp.tokenUpgEffects.tokens.normalChance/100).add(game.tokens);
            if (game.unlocks.btn5) makeRow(row.tier);
        }
		if (game.unlocks.col9) makeRow((getAllMult().mul(game.unlocks.rne6?(temp.runeStats.money ?? 1):1).mul(temp.sigilEffects[9] ?? 1).logBase(2).floor()));
		return;
	}
    whileloop: while (D.gt(times, 0)) {
        for (let a = (game.automators.reset?.depth ?? 1); a >= 1; a--) {
            let row = game.ladder[a];
            let pos = getHighestButton(row.tier, game.ladder[a - 1].amount);
            if (D.lt(pos, 0)) continue;
            let gain = getButtonGain(row.tier, pos).mul(getRowMulti(row.tier));
            if (D.div(gain, row.amount).gt(game.automators.reset?.factor ?? 0)) {
                clickButton(row.tier, pos, true);
                times = D.sub(times, 1);
                row.level = D.max(row.level, pos);
                continue whileloop;
            }
        }
        break;
    }
}

function doSuperResetAuto(times) {
    if (game.super_ladder.length <= 0) return;
	for (let a = game.super_ladder.length - 1; a >= 1; a--) {
		let row = game.super_ladder[a];
		let pos = getHighestSuperButton(row.tier, game.super_ladder[a - 1].amount);
		if (D.lt(pos, 0)) continue;
		let gain = getSuperButtonGain(row.tier, pos);
		row.amount = D.add(row.amount, D.mul(gain, times).mul(getSuperMulti(row.tier)));
		row.presses = D.add(row.presses, times);
		game.tokens = D(game.collapsed).add(1).pow(temp.tokenUpgEffects.tokens.normalTierFactor).mul(getTokenMulti()).mul(10000).mul(D(row.tier).add(1).pow(temp.tokenUpgEffects.ext1?.superTierFactor ?? 1)).mul(temp.tokenUpgEffects.tokens?.gainFromSuper ?? 1).mul(times).add(game.tokens);
		makeSuperRow(row.tier);
	}
}

function doSuperResetAuto2(y, times) {
	if (!game.super_ladder2[y])return;
    if (game.super_ladder2[y].length <= 0) return;
	for (let a = game.super_ladder2[y].length - 1; a >= 0; a--) {
		let row = game.super_ladder2[y][a];
		let pos = getHighestSuperButton2(y, row.tier, a == 0 ? (y==0?game.scollapsed : game.scollapsed2[y-1]) : game.super_ladder2[y][a - 1].amount);
		if (D.lt(pos, 0)) continue;
		let gain = getSuperButtonGain2(y, row.tier, pos);
		row.amount = D.add(row.amount, D.mul(gain, times).mul(getSuperMulti2(y, row.tier)));
		row.presses = D.add(row.presses, times);
			game.tokens = D(game.collapsed).add(1).pow(temp.tokenUpgEffects.tokens.normalTierFactor)
			.mul(D(game.scollapsed).add(1).pow(temp.tokenUpgEffects.ext1?.superTierFactor ?? 1))
			.mul(getTokenMulti()).mul(1e14).add(game.tokens);
		makeSuperRow2(y, row.tier);
		makeSuperRow2(D.add(y,1), -1);
	}
}

function getHighestButtonForCollapse(row, amount){
    let base = D.eq(row, 0) ? 5 : D.eq(row, 1) ? 1e5 : D.pow(2, row).mul(250);
    return D.div(D(amount).max(0), base).add(1).logBase(D.add(row, 1).mul(10)).div(10).add(1).logBase(1.1);
}

/* function getMultiReqForCollapse(row, amount, orig){
	if(game.unlocks.col2)return orig;
	amount = amount.div(getRowMulti(row)).div(temp.sigilEffects[0]);
    let tier = getButtonTierForCollapse(row, amount);
	if(D(row).gte(2))return getMultiReqForCollapse(D(row).sub(1), getButtonCostForCollapse(row, tier), orig);
    return getButtonCostForCollapse(row, tier).max(orig);
} */

function getButtonTierForCollapse(row, amount) {
    let base = D.eq(row, 0) ? 8 : 4;
    let mult = D.eq(row, 0) ? 1 : D.add(row, 1);
	return amount.div(mult).logBase(base).div(20).max(-1).add(1).logBase(1.05);
}

function getButtonCostForCollapse(row, tier) {
    let base = D.eq(row, 0) ? 5 : D.eq(row, 1) ? 1e5 : D.pow(2, row).mul(250);
    return D.add(row, 1).mul(10).pow(D.pow(1.1, tier).sub(1).mul(10)).mul(base);
}

function getCollapseMult() {
	if(game.unlocks.col3)return getImCollapseMult();
	let m = game.ladder[0].amount, mult = D(1);
    if(game.collapsed.gte(1)){
		for(let i = 1;i <= game.collapsed.toNumber();i++){
			m = getButtonGain(i, getHighestButtonForCollapse(i, m)).mul(getRowMulti(i)).mul(temp.sigilEffects[0]).mul(getAllMult()).mul(game.unlocks.rne6?(temp.runeStats.money ?? 1):1);
			mult = mult.mul(m);
		}
	}
	return mult;
}

function getAllMult() {
	mult = D(game.super_ladder[0]?.amount ?? 0).add(1);
	if(game.unlocks.tok7)mult = mult.mul(temp.tokenUpgEffects.double.money);
	return mult;
}

function getSuperAllMult() {
	mult = D(temp.runeStats?.super ?? 0).add(1);
	mult = mult.mul(temp.addSigilEffect2 ?? 1);
	if(game.unlocks.tok8)mult = mult.mul(temp.tokenUpgEffects.double?.super ?? 1);
	if(game.unlocks.col27)mult = mult.mul(getSuperAmount2(0, 0) ?? 0).add(1);
	return mult;
}

function getSuperAllMult2(y) {
	mult = D(1);
	if(game.unlocks.tok12 && D(y).eq(0))mult = mult.mul(temp.tokenUpgEffects.double?.super2 ?? 1);
	return mult;
}

function getHighestButtonForImCollapse(amount){
    return D(amount).max(0).add(1).logBase(10).div(10).add(1).logBase(game.unlocks.btn10?getBtnScale():game.unlocks.btn7?1.09:1.1);
}

function getButtonGainForImCollapse(tier) {
    return D.pow(4, D.pow(1.05, tier).sub(1).mul(20)).mul(D(game.collapsed).add(100));
}

function getImCollapsePoint() {
	return getButtonGainForImCollapse(getHighestButtonForImCollapse(game.ladder[0].amount)).mul(temp.sigilEffects[0]).mul(getAllMult()).mul(game.unlocks.rne6?(temp.runeStats.money ?? 1):1);
}

function getImCollapsePoint2() {
	return getButtonGainForImCollapse(getHighestButtonForImCollapse(getImCollapsePoint())).mul(temp.sigilEffects[0]).mul(getAllMult()).mul(game.unlocks.rne6?(temp.runeStats.money ?? 1):1);
}

function getImCollapseLayers() {
	return getImCollapsePoint2().add(3).logBase(2).mul(getImCollapsePoint2().add(3).logBase(2).add(3).logBase(2).pow(2).div(934).min(1)).max(100000);//.max(getImCollapsePoint().add(3).logBase(2).pow(getImCollapsePoint().add(3).logBase(2).add(3).logBase(2).div(45).min(1)));
}

function getImCollapseMult() {
	if(game.unlocks.col18)return D(getImCollapsePoint()).add(1).pow(D(game.collapsed).add(1));
	if(D(game.collapsed).gte(100000))return D(game.ladder[1].amount).add(1).mul(temp.sigilEffects[0]).mul(getAllMult()).mul(game.unlocks.rne6?(temp.runeStats.money ?? 1):1).pow(D(game.collapsed).add(1));
	let m = game.ladder[0].amount, mult = D(1);
    if(game.collapsed.lt(100)){
		for(let i = 1;i <= game.collapsed.toNumber();i++){
			m = getButtonGainForImCollapse(getHighestButtonForImCollapse(m)).max(game.unlocks.col13?D(game.ladder[1].amount).add(1).pow(D.div(game.collapsed,1e5).min(1)):1).mul(temp.sigilEffects[0]).mul(getAllMult()).mul(game.unlocks.rne6?(temp.runeStats.money ?? 1):1);
			mult = mult.mul(m);
		}
		return mult;
	}
	for(let i = 1;i <= 100;i++){
		m = getButtonGainForImCollapse(getHighestButtonForImCollapse(m)).max(game.unlocks.col13?D(game.ladder[1].amount).add(1).pow(D.div(game.collapsed,1e5).min(1)):1).mul(temp.sigilEffects[0]).mul(getAllMult()).mul(game.unlocks.rne6?(temp.runeStats.money ?? 1):1);
		mult = mult.mul(m);
	}
	return mult.mul(m.pow(D(game.collapsed).sub(100))).mul(D(game.ladder[1].amount).add(1));
}

function getSuperCollapseMult() {
	if(game.unlocks.col31)return D(getImSCollapsePoint()).add(1).pow(D(game.scollapsed).add(1));
	if(game.scollapsed.lte(0))return D(1);
	return D(game.super_ladder[1].amount).add(1).mul(getSuperAllMult()).pow(D(game.scollapsed).add(1));
}
function getSuperCollapseMult2(y) {
	if((game.scollapsed2[y] ?? 0).lte(0))return D(1);
	return D(game.super_ladder2[y][1]?.amount).add(1).mul(getSuperAllMult2(y)).pow(D(game.scollapsed2[y]).add(1));
}
function getSuperButtonCost(row, tier) {
	if(D(row).eq(0) && game.unlocks.sbtn3)return D.pow(getBtnScale(), tier).sub(1);
	if(D(row).eq(0) && game.unlocks.sbtn1)return D.pow(game.unlocks.sbtn2?1.09:1.1, tier).sub(1).mul(10);
    let base = D.eq(row, 0) ? 5 : D.eq(row, 1) ? 1e5 : D.pow(2, row).mul(250);
	if(game.unlocks.sbtn2)base = D.pow(2, row);
	if(D(row).eq(0))return D.pow(1.1, tier).sub(1).mul(10).mul(base).add(600);
	if(game.unlocks.sbtn3)return D.add(row, 1).sqrt().mul(10).pow(D.pow(getBtnScale(), tier).sub(1).mul(10)).mul(base);
    return D.add(row, 1).mul(10).pow(D.pow(game.unlocks.sbtn2?1.09:1.1, tier).sub(1).mul(10)).mul(base);
}

function getHighestSuperButton(row, amount) {
	if(D(row).eq(0) && game.unlocks.sbtn3)return D(amount).add(1).max(1).logBase(getBtnScale()).floor().max(-1);
	if(D(row).eq(0) && game.unlocks.sbtn1)return D.div(amount, 10).add(1).max(1).logBase(game.unlocks.sbtn2?1.09:1.1).floor().max(-1);
    let base = D.eq(row, 0) ? 5 : D.eq(row, 1) ? 1e5 : D.pow(2, row).mul(250);
	if(game.unlocks.sbtn2)base = D.pow(2, row);
	if(D(row).eq(0))return D.sub(amount, 600).div(base).div(10).add(1).max(1).logBase(1.1).floor().max(-1);
    if(game.unlocks.sbtn3)return D.div(amount, base).logBase(D.add(row, 1).sqrt().mul(10)).div(10).add(1).logBase(getBtnScale()).floor().max(-1);
    return D.div(amount, base).logBase(D.add(row, 1).mul(10)).div(10).add(1).logBase(game.unlocks.sbtn2?1.09:1.1).floor().max(-1);
}

function getButtonGainForImSCollapse(tier) {
    return D.pow(4, D.pow(1.05, tier).sub(1).mul(20)).mul(D(game.scollapsed).add(100));
}

function getSuperButtonCost2(y, row, tier) {
    let base = D.eq(row, 0) ? 5 : D.eq(row, 1) ? 1e5 : D.gte(row, 4) ? D.pow(10, D.pow(row, game.unlocks.sbtn4?1.35:1.5)).mul(5e5) : D.pow(2, row).mul(250);
	if(D(row).eq(0))return D.pow(getBtnScale(), tier).sub(1).mul(10).mul(base).add(200);
    return D.add(row, 1).mul(10).pow(D.pow(getBtnScale(), tier).sub(1).mul(10)).mul(base);
}

function getHighestSuperButton2(y, row, amount) {
    let base = D.eq(row, 0) ? 5 : D.eq(row, 1) ? 1e5 : D.gte(row, 4) ? D.pow(10, D.pow(row, game.unlocks.sbtn4?1.35:1.5)).mul(5e5) : D.pow(2, row).mul(250);
	if(D(row).eq(0))return D.sub(amount, 200).div(base).div(10).add(1).max(1).logBase(getBtnScale()).floor().max(-1);
    return D.div(amount, base).logBase(D.add(row, 1).mul(10)).div(10).add(1).logBase(getBtnScale()).floor().max(-1);
}

function getBtnScale(){
	if(game.unlocks.sbtn3)return 1+8/90;
	return 1.089;
}


function getImSCollapsePoint() {
	return getButtonGainForImSCollapse(getHighestButtonForImCollapse(game.super_ladder[0].amount)).mul(getSuperAllMult());
}

function getImSCollapsePoint2() {
	return getButtonGainForImSCollapse(getHighestButtonForImCollapse(getImSCollapsePoint())).mul(getSuperAllMult());
}

function getImSCollapseLayers() {
	return getImSCollapsePoint2().add(3).logBase(2).mul(getImSCollapsePoint2().add(3).logBase(2).add(3).logBase(2).pow(3).div(30000).min(1)).max(10000);//.max(getImCollapsePoint().add(3).logBase(2).pow(getImCollapsePoint().add(3).logBase(2).add(3).logBase(2).div(45).min(1)));
}
