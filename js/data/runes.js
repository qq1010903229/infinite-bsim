
// ------------------------------------------------------------ Data


let rarityNames = [
    "Common",
    "Uncommon",
    "Rare",
    "Epic",
    "Legendary",
    "Unique",
    "Mythical",
    "Supreme",
    "Hypothetical",
    "All-Above",
]

let rarityColors = [
    "#999",
    "#f56",
    "#4b5",
    "#68f",
    "#aa3",
    "#4ac",
    "#aaa",
    "#c4c",
]

let runeLevelNames = [
    "Plus",
    "Big",
    "Huge",
    "Great",
]

let runeStats = {
    money: {
        display: "×{0} Money gain",
        get(q){
			if(D(q).gte(500) && !game.unlocks.rne16)q = D(q).div(5).log10().pow(2).mul(125);
			else if(D(q).gte(1000) && !game.unlocks.rne17)q = D(q).div(10).log10().pow(3).mul(125);
			else if(D(q).gte(4000) && !game.unlocks.rne18)q = D(q).div(40).log10().pow(5).mul(125);
			else if(D(q).gte(8000) && !game.unlocks.rne20)q = D(q).div(80).log10().pow(6).mul(125);
			if(D(q).gte(2000) && !game.unlocks.rne23)q = D(q).div(20).log10().pow(4).mul(125);
			else if(D(q).gte(4000) && !game.unlocks.rne24)q = D(q).div(40).log10().pow(5).mul(125);
			else if(D(q).gte(8000))q = D(q).div(80).log10().pow(5).mul(250);
			return D.pow(1.01, q);
		},
        precision: 2,
        stack: "mul",
    },
    gem: {
        display: "+{0} base Gem gain",
        get: (q) => (game.unlocks.rne13?D(q).mul(temp.tokenUpgEffects.runeEff?.effect ?? 1).mul(game.unlocks.rne21?30:game.unlocks.rne20?10:game.unlocks.rne18?3:1):D.mul(game.unlocks.rne9?0.05:game.unlocks.rne8?0.02:0.01, q)),
        precision: 2,
        stack: "add",
    },
    scrap: {
        display: "+{0} base Glyph gain",
        get: (q) => (game.unlocks.rne13?D(q).mul(temp.tokenUpgEffects.runeEff?.effect ?? 1).mul(game.unlocks.rne21?30:game.unlocks.rne20?10:game.unlocks.rne18?3:1):D.mul(game.unlocks.rne9?0.05:game.unlocks.rne8?0.02:0.007, q)),
        precision: 2,
        stack: "add",
    },
    token: {
        display: "+{0} base Token gain",
        get: (q) => (game.unlocks.rne13?D(q).mul(temp.tokenUpgEffects.runeEff?.effect ?? 1).mul(game.unlocks.rne21?30:game.unlocks.rne20?10:game.unlocks.rne18?3:1):D.mul(game.unlocks.rne9?0.05:0.004, q).pow(game.unlocks.rne8?1:0.8)),
        precision: 2,
        stack: "add",
    },
    charge: {
        display: "+{0} base Charge gain",
        get: (q) => (game.unlocks.rne13?D(q).mul(temp.tokenUpgEffects.runeEff?.effect ?? 1).mul(game.unlocks.rne21?30:game.unlocks.rne20?10:game.unlocks.rne18?3:1):D.mul(game.unlocks.rne9?0.02:0.006, q).pow(1.2).min(q)),
        precision: 2,
        stack: "add",
    },
    super: {
        display: "+{0} base Super Button gain",
        get(q){
			if(game.unlocks.rne21)return q.pow(0.75);
			if(game.unlocks.rne20)return q.sqrt();
			if(game.unlocks.rne18)return q.div(10).add(1).sqrt();
			if(game.unlocks.rne17)return q.sqrt().div(100).max(q.add(10).log10());
			if(game.unlocks.rne16)return q.add(10).log10();
			return q.add(10).log10().div(10);
		},
        precision: 2,
        stack: "add",
    },
    gem1: {
        display: "×{0} Gem gain",
        get: (q) => (D(q).mul(temp.tokenUpgEffects.runeEff?.effect ?? 1).pow(game.unlocks.rne23?0.03:0.025)),
        precision: 2,
        stack: "mul",
    },
    scrap1: {
        display: "×{0} Glyph gain",
        get: (q) => (D(q).mul(temp.tokenUpgEffects.runeEff?.effect ?? 1).pow(game.unlocks.rne23?0.03:0.025)),
        precision: 2,
        stack: "mul",
    },
    token1: {
        display: "×{0} Token gain",
        get: (q) => (D(q).mul(temp.tokenUpgEffects.runeEff?.effect ?? 1).pow(game.unlocks.rne23?0.03:0.025)),
        precision: 2,
        stack: "mul",
    },
    charge1: {
        display: "×{0} Charge gain",
        get: (q) => (D(q).mul(temp.tokenUpgEffects.runeEff?.effect ?? 1).pow(game.unlocks.rne23?0.03:0.025)),
        precision: 2,
        stack: "mul",
    },
    super1: {
        display: "×{0} Super Button gain",
        get(q){
			if(game.unlocks.rne24)return D.pow(q, 0.1);
			return D(q).mul(game.unlocks.rne23?(temp.tokenUpgEffects.runeEff?.effect ?? 1):1).pow(game.unlocks.rne23?0.03:0.025);
		},
        precision: 2,
        stack: "mul",
    },
}




// ------------------------------------------------------------ Functions


function getGemGenCost(tier) {
    return D.pow(100, D.pow(tier, 2).add(1));
}
function getGemUpgCost(tier) {
    tier = D.add(tier, 1);
    return D.pow(2, D.pow(tier, 2).add(tier).div(2).add(1)).mul(25);
}
function getEqUpgCost(tier) {
    tier = D(tier ?? 0).add(2);
	if(tier.gte(50))tier = D.pow(1.02,tier.sub(50)).mul(tier);
	if(tier.gte(45))tier = tier.pow(3).div(2025);
	if(tier.gte(40))tier = tier.pow(3).div(1600);
    return D.pow(1e5, tier);
}
function getInvUpgCost(tier) {
    tier = D(tier ?? 0).pow(2).add(1);
	if(tier.gte(25))tier = D.pow(10, tier);
    return D.pow(1e30, tier);
}

function getRuneCost(tier) {
	if(game.unlocks.rne19)return D.pow(10, tier);
    return D.pow(16, tier).mul(60).add(40);
}

function getHighestRuneTier() {
	if(game.unlocks.rne19)return game.gems.max(1).logBase(10).floor().max(0);
    return game.gems.sub(40).div(60).max(1).logBase(16).floor().max(0);
}

function buyGemGen() {
    let cost = getGemGenCost(game.gemGens);
    if (D.gte(game.money, cost)) {
        game.money = D.sub(game.money, cost);
        game.gemGens = D.add(game.gemGens, 1);
    }
}
function buyGemUpg() {
    let cost = getGemUpgCost(game.gemUpgs);
    if (D.gte(game.scraps, cost)) {
        game.scraps = D.sub(game.scraps, cost);
        game.gemUpgs = D.add(game.gemUpgs, 1);
    }
}

function buyEqUpg() {
    let cost = getEqUpgCost(game.eqUpgs);
    if (D.gte(game.scraps, cost)) {
        game.scraps = D.sub(game.scraps, cost);
        game.eqUpgs = D.add(game.eqUpgs ?? 0, 1);
		temp.maxRunes = 50 + D(game.invUpgs ?? 0).toNumber() * 50
		temp.maxRuneEquip = 3 + D(game.eqUpgs ?? 0).toNumber()
        tabs.runes.focusRune();
        tabs.runes.updateData();
    }
}

function buyInvUpg() {
    let cost = getInvUpgCost(game.invUpgs);
    if (D.gte(game.gems, cost)) {
        game.gems = D.sub(game.gems, cost);
        game.invUpgs = D.add(game.invUpgs ?? 0, 1);
		temp.maxRunes = 50 + D(game.invUpgs ?? 0).toNumber() * 50
		temp.maxRuneEquip = 3 + D(game.eqUpgs ?? 0).toNumber()
        tabs.runes.focusRune();
        tabs.runes.updateData();
    }
}


function buyRune(tier) {
    let cost = getRuneCost(tier);
    if (D.gte(game.gems, cost) && game.runes.length + game.runeEquip.length < temp.maxRunes) {
        game.gems = D.sub(game.gems, cost);
        let rune = generateRune(tier);
        game.runes.push(rune);
        game.stats.runeBought++;
		if(tabs.runes.mode == 'buymax')buyRune(tier);
    }
}

function generateRune(tier) {
    let stats = ["money"];
    if (Math.random() * 100 < temp.tokenUpgEffects.runeEff.gem) stats.push("gem");
    if (Math.random() * 100 < temp.tokenUpgEffects.runeEff.scrap) stats.push("scrap");
    if (Math.random() * 100 < temp.tokenUpgEffects.runeEff.token) stats.push("token");
    if (Math.random() * 100 < temp.tokenUpgEffects.runeEff.charge) stats.push("charge");
    if (game.unlocks.rne15) stats.push("super");
	if (game.unlocks.rne22) stats = ['money','gem1','scrap1','token1','charge1','super1'];
    return {
        tier,
        rarity: D.div(1, 1 - Math.random()).ln().floor(),
        level: D(0),
        stats,
    }
}

function getRuneQuality(rune) {
	if(D(rune.tier).gte(1999))return D(rune.tier).add(1).pow(5).div(10000000-D(rune.tier).mul(1000).min(9999000).toNumber()).mul(D(rune.rarity).add(1).mul(D.pow(1.015,D.add(rune.rarity, 1).pow(1.5)).min(100)).floor()).mul(D.add(rune.level, 1).mul(D.pow(1.08,D.add(rune.level, 1).pow(1.3)).min(100)).add(1).floor()).mul(temp.tokenUpgEffects.rune?.upgEff2 ?? 1);
	if(D(rune.tier).gte(799))return D(rune.tier).add(1).pow(4).div(10000).mul(D(rune.rarity).add(1).mul(D.pow(1.015,D.add(rune.rarity, 1).pow(1.5)).min(100)).floor()).mul(D.add(rune.level, 1).mul(D.pow(1.08,D.add(rune.level, 1).pow(1.3)).min(100)).add(1).floor()).mul(temp.tokenUpgEffects.rune?.upgEff2 ?? 1);
	if(D(rune.tier).gte(599))return D(rune.tier).add(1).pow(4).div(50000).mul(D(rune.rarity).add(2).add(D(rune.rarity).pow(2).div(10))).mul(D.add(rune.level, 1).mul(D.pow(1.08,D.add(rune.level, 1).pow(1.3)).min(100)).add(1).floor()).mul(temp.tokenUpgEffects.rune?.upgEff2 ?? 1);
	if(D(rune.tier).gte(399))return D(rune.tier).add(1).pow(4).div(80000).mul(D(rune.rarity).add(2).add(D(rune.rarity).pow(2).div(10))).mul(D.add(rune.level, 1)).mul(temp.tokenUpgEffects.rune?.upgEff2 ?? 1);
	if(game.unlocks.rne14)return D.add(rune.tier, rune.rarity).add(10).pow(2).max(D(rune.tier).add(1).pow(2).mul(D(rune.rarity).add(1))).mul(D.add(rune.level, 1)).mul(temp.tokenUpgEffects.rune?.upgEff2 ?? 1);
	if(game.unlocks.rne13)return D.add(rune.tier, rune.rarity).add(10).pow(2).max(D(rune.tier).add(1).pow(2).mul(D(rune.rarity).add(1))).mul(D.add(rune.level, 2)).div(2).mul(temp.tokenUpgEffects.rune?.upgEff2 ?? 1);
	if(game.unlocks.rne12)return D.add(rune.tier, rune.rarity).add(10).pow(2).max(D(rune.tier).add(1).pow(2).mul(D(rune.rarity).add(1))).mul(D.add(rune.level, 1).sqrt()).mul(temp.tokenUpgEffects.rune?.upgEff2 ?? 1);
	if(game.unlocks.rne8)return D.add(rune.tier, rune.rarity).add(10).pow(2).mul(D.add(rune.level, 1).sqrt()).mul(temp.tokenUpgEffects.rune?.upgEff2 ?? 1);
    return D.add(10, rune.tier).mul(D.add(rune.tier, rune.rarity).add(1)).mul(D.add(rune.level, 1).sqrt()).mul(temp.tokenUpgEffects.rune?.upgEff2 ?? 1);
}
function getRuneScraps(rune) {
    return D.mul(D.pow(3, rune.tier), D.pow(2, rune.rarity)).mul(D.mul(3, rune.level).add(1)).mul(rune.stats.length).mul(5)
        .mul(temp.tokenUpgEffects.double.scrap).mul(D.add(temp.runeStats.scrap ?? 0, 1)).mul(game.unlocks.col5?D(game.collapsed).div(game.unlocks.col23?1:10).add(1).pow(game.unlocks.col23?2:1):1).mul(game.unlocks.col25?D(game.scollapsed).add(game.unlocks.col29?1:0).pow(3).div(game.unlocks.col29?1:game.unlocks.col26?1e3:1e4).add(game.unlocks.col29?0:1):1)
		  .mul(game.unlocks.sig24?(temp.addSigilEffect1 ?? 1):1);
}

