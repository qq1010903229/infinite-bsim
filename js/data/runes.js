
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
        get: (q) => D.pow(1.01, q),
        precision: 2,
        stack: "mul",
    },
    gem: {
        display: "+{0} base Gem gain",
        get: (q) => D.mul(0.01, q),
        precision: 2,
        stack: "add",
    },
    scrap: {
        display: "+{0} base Glyph gain",
        get: (q) => D.mul(0.007, q),
        precision: 2,
        stack: "add",
    },
    token: {
        display: "+{0} base Token gain",
        get: (q) => D.mul(0.004, q).pow(0.8),
        precision: 2,
        stack: "add",
    },
    charge: {
        display: "+{0} base Charge gain",
        get: (q) => D.mul(0.006, q).pow(1.2),
        precision: 2,
        stack: "add",
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

function getRuneCost(tier) {
    return D.pow(16, tier).mul(60).add(40);
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


function buyRune(tier) {
    let cost = getRuneCost(tier);
    if (D.gte(game.gems, cost) && game.runes.length + game.runeEquip.length < 50) {
        game.gems = D.sub(game.gems, cost);
        let rune = generateRune(tier);
        game.runes.push(rune);
        game.stats.runeBought++;
    }
}

function generateRune(tier) {
    let stats = ["money"];
    if (Math.random() * 100 < temp.tokenUpgEffects.runeEff.gem) stats.push("gem");
    if (Math.random() * 100 < temp.tokenUpgEffects.runeEff.scrap) stats.push("scrap");
    if (Math.random() * 100 < temp.tokenUpgEffects.runeEff.token) stats.push("token");
    if (Math.random() * 100 < temp.tokenUpgEffects.runeEff.charge) stats.push("charge");
    return {
        tier,
        rarity: D.div(1, 1 - Math.random()).ln().floor(),
        level: D(0),
        stats,
    }
}

function getRuneQuality(rune) {
    return D.add(10, rune.tier).mul(D.add(rune.tier, rune.rarity).add(1)).mul(D.add(rune.level, 1).sqrt());
}
function getRuneScraps(rune) {
    return D.mul(D.pow(3, rune.tier), D.pow(2, rune.rarity)).mul(D.mul(3, rune.level).add(1)).mul(rune.stats.length).mul(5)
        .mul(temp.tokenUpgEffects.double.scrap).mul(D.add(temp.runeStats.scrap ?? 0, 1));
}

