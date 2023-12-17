
let tokenUpgrades = {
    tokens: {
        gain: {
            effectAmount: (x) => D.pow(2, x),
            effectText: ["×{0}", "all Token gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(4, x).mul(100),
        },
        normalChance: {
            effectAmount: (x) => D.mul(5, x).toNumber() + 10,
            effectText: ["{0}%", "button Token chance"],
            effectPrecision: 0,
            maxAmount: 18,
            costAmount: (x) => D.add(4, x).pow(x).mul(250),
        },
        normalTierFactor: {
            effectAmount: (x) => D.mul(0.05, x).add(0.5),
            effectText: ["^{0}", "button tier to Token multi"],
            effectPrecision: 2,
            costAmount: (x) => D.add(7, x).pow(x).mul(1250),
        },
        gainFromCharge: {
            requires: ["atm4"],
            effectAmount: (x) => D.add(1, x),
            effectText: ["×{0}", "Token gain from charges"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(3, x).mul(300),
        },
    },
    double: {
        money: {
            effectAmount: (x) => D.pow(2, x),
            effectText: ["×{0}", "all Money gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(3, x).mul(50),
        },
        gems: {
            effectAmount: (x) => D.pow(2, x),
            effectText: ["×{0}", "all Gems gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(5, x).mul(250),
        },
        scrap: {
            effectAmount: (x) => D.pow(2, x),
            effectText: ["×{0}", "all Glyph gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(8, x).mul(500),
        },
        charge: {
            requires: ["atm1"],
            effectAmount: (x) => D.pow(2, x),
            effectText: ["×{0}", "all Charge gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(4, x).mul(350),
        },
    },
    rune: {
        genEff: {
            effectAmount: (x) => D.mul(0.1, x).add(1),
            effectText: ["^{0}", "effective gem generators"],
            maxAmount: 90,
            effectPrecision: 1,
            costAmount: (x) => D.pow(3, x).mul(1000),
        },
        upgEff: {
            effectAmount: (x) => D.mul(0.1, x).add(1),
            effectText: ["×{0}", "effective gem token doublers"],
            maxAmount: 40,
            effectPrecision: 1,
            costAmount: (x) => D.pow(3, x).mul(1000),
        },
        upgEff1: {
            requires: ["tok6"],
            effectAmount: (x) => D.mul(0.1, x).add(1),
            effectText: ["×{0}", "effective generator upgrades"],
            maxAmount: 40,
            effectPrecision: 1,
            costAmount: (x) => D.pow(3, x).mul(1e40),
        },
    },
    runeEff: {
        gem: {
            effectAmount: (x) => D.eq(x, 0) ? 0 : D.mul(5, x).toNumber() + 20,
            effectText: ["{0}% chance", "+ base Gem gain"],
            effectPrecision: 0,
            maxAmount: 16,
            costAmount: (x) => D.pow(3, x).mul(2000),
        },
        scrap: {
            effectAmount: (x) => D.eq(x, 0) ? 0 : D.mul(5, x).toNumber() + 15,
            effectText: ["{0}% chance", "+ base Glyph gain"],
            effectPrecision: 0,
            maxAmount: 17,
            costAmount: (x) => D.pow(4, x).mul(2000),
        },
        token: {
            effectAmount: (x) => D.eq(x, 0) ? 0 : D.mul(5, x).toNumber() + 10,
            effectText: ["{0}% chance", "+ base Token gain"],
            effectPrecision: 0,
            maxAmount: 18,
            costAmount: (x) => D.pow(5, x).mul(2000),
        },
        charge: {
            effectAmount: (x) => D.eq(x, 0) ? 0 : D.mul(5, x).toNumber() + 25,
            effectText: ["{0}% chance", "+ base Charge gain"],
            effectPrecision: 0,
            maxAmount: 15,
            costAmount: (x) => D.pow(2.5, x).mul(2000),
        },
    },
    ext1: {
        superTierFactor: {
            effectAmount: (x) => D.mul(0.05, x).add(1),
            effectText: ["^{0}", "super button tier to Token multi"],
            effectPrecision: 2,
            costAmount: (x) => D.add(7, x).pow(x).mul(1e40),
        },
        sigil: {
            effectAmount: (x) => D.pow(0.95, x).mul(100),
            effectText: ["{0}%", "sigil effect softcap effect"],
            effectPrecision: 2,
            costAmount: (x) => D.pow(2.5, x).mul(1e40),
        },
    },
}

function getTokenMulti() {
    let mult=D.add(temp.runeStats.token ?? 0, 1).mul(temp.tokenUpgEffects.tokens.gain);
	if(game.unlocks.col3)mult=mult.mul(D(game.collapsed).div(75).pow(2).add(1));
	return mult;
}

function buyTokenUpgrade(cat, id) {
    let data = tokenUpgrades[cat][id];
    let level = game.tokenUpg[cat]?.[id] ?? 0;
	if(D(level).gte(data.maxAmount))return;
    let cost = data.costAmount(level);
    if (D.gte(game.tokens, cost)) {
        game.tokens = D.sub(game.tokens, cost);
        if (!game.tokenUpg[cat]) game.tokenUpg[cat] = {};
        game.tokenUpg[cat][id] = D.add(level, 1);
        temp.tokenUpgEffects[cat][id] = data.effectAmount(game.tokenUpg[cat][id]);
    }
}

function getAvailableTokenUpgrades(cat) {
    return Object.keys(tokenUpgrades[cat]).filter(x => (tokenUpgrades[cat][x].requires ?? []).reduce((x, y) => x && game.unlocks[y], true));
}