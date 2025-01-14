
let tokenUpgrades = {
    tokens: {
        gain: {
            effectAmount: (x) => D.pow(2, x),
            effectText: ["×{0}", "all Token gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(4, x).mul(game.unlocks.tok9?1:100),
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
            maxAmount: 50,
            costAmount: (x) => D.add(7, x).pow(x).mul(1250),
        },
        gainFromCharge: {
            requires: ["atm4"],
            effectAmount: (x) => D.add(1, x),
            effectText: ["×{0}", "Token gain from charges"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(3, x).mul(game.unlocks.tok9?1:300),
        },
        gainFromSuper: {
            requires: ["tok8"],
            effectAmount: (x) => D.add(1, D(x).div(5)).pow(4),
            effectText: ["×{0}", "Token gain from super buttons"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(4, x).mul(game.unlocks.tok11?1:1e100),
        },
    },
    double: {
        money: {
            effectAmount: (x) => D.pow(2, D(x).mul(D.mul(0.2, game.tokenUpg.ext1?.money_effective ?? 0).add(1))),
            effectText: ["×{0}", "all Money gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(3, x).mul(game.unlocks.tok9?1:50),
        },
        gems: {
            effectAmount: (x) => D.pow(2, D(x).mul(D.mul(0.1, game.tokenUpg.rune?.upgEff ?? 0).add(1))),
            effectText: ["×{0}", "all Gems gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(5, x).mul(game.unlocks.tok9?1:250),
        },
        scrap: {
            effectAmount: (x) => D.pow(2, D(x).mul(D.mul(0.1, game.tokenUpg.rune?.upgEff3 ?? 0).add(1))),
            effectText: ["×{0}", "all Glyph gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(8, x).mul(game.unlocks.tok9?1:500),
        },
        charge: {
            requires: ["atm1"],
            effectAmount: (x) => D.pow(2, x),
            effectText: ["×{0}", "all Charge gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(4, x).mul(game.unlocks.tok9?1:350),
        },
        super: {
            requires: ["tok6"],
            effectAmount: (x) => D.pow(2, D(x).mul(D.mul(0.1, game.tokenUpg.ext2?.super_effective ?? 0).add(1))),
            effectText: ["×{0}", "all Super Button gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(4, D.max(x,D.max(game.unlocks.tok9?1:D.pow(x,3).div(200),game.unlocks.tok11?1:D.pow(x,2).div(10)))).mul(1e100),
        },
        super2: {
            requires: ["tok12"],
            effectAmount: (x) => D.pow(2, x),
            effectText: ["×{0}", "all Super^2 Button gains"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(2, D.mul(x, 10).add(1024)),
        },
    },
    rune: {
        genEff: {
            effectAmount: (x) => D.mul(0.1, x).add(1),
            effectText: ["^{0}", "effective gem generators"],
            maxAmount: 1490,
            effectPrecision: 1,
            costAmount: (x) => D.pow(3, x).mul(game.unlocks.tok9?1:1000),
        },
        upgEff: {
            effectAmount: (x) => D.mul(0.1, x).add(1),
            effectText: ["×{0}", "stronger gem token doubler"],
            maxAmount: 70,
            effectPrecision: 1,
            costAmount: (x) => D.pow(D(x).gte(60)?2e7:D(x).gte(40)?600:3, x).mul(game.unlocks.tok9?1:1000),
        },
        upgEff1: {
            requires: ["tok6"],
            effectAmount: (x) => D.mul(0.1, x).add(1),
            effectText: ["×{0}", "effective generator upgrades"],
            maxAmount: 70,
            effectPrecision: 1,
            costAmount: (x) => D.pow(D(x).gte(60)?2e7:D(x).gte(40)?100:3, x).mul(1e40),
        },
        upgEff2: {
            requires: ["tok6"],
            effectAmount(x){
				x = D(x).toNumber();
				y = Math.floor(x/99);
				return D.pow(100, y).mul(x-y*99+1);
			},
            effectText: ["×{0}", "stronger runes"],
            maxAmount: 693,
            effectPrecision: 0,
            costAmount: (x) => D.pow(5, x).mul(game.unlocks.tok9?1e40:1e50),
        },
        upgEff3: {
            effectAmount: (x) => D.mul(0.1, x).add(1),
            effectText: ["×{0}", "stronger glyph token doubler"],
            maxAmount: 25,
            effectPrecision: 1,
            costAmount: (x) => D.pow(D(x).gte(20)?1e19:D(x).gte(15)?10:3, x).mul(1e100),
        },
        rarity: {
            requires: ["tok12"],
            effectAmount: (x) => D.mul(0.1, x),
            effectText: ["+{0}", "additional rune rarity"],
            maxAmount: 30,
            effectPrecision: 1,
            costAmount: (x) => D.pow(2, D.pow(x, 2).add(1024)),
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
        effect: {
            requires: ["tok6"],
            effectAmount(x){
				x = D(x).toNumber();
				y = Math.floor(x/99);
				return D.pow(100, y).mul(x-y*99+1);
			},
            effectText: ["×{0}", "stronger above effects"],
            maxAmount: 594,
            effectPrecision: 0,
            costAmount: (x) => D.pow(5, x).mul(game.unlocks.tok11?1e80:game.unlocks.tok9?1e100:1e110),
        },
    },
    ext1: {
        superTierFactor: {
            effectAmount: (x) => D.mul(0.05, x).add(1),
            effectText: ["^{0}", "super button tier to Token multi"],
            maxAmount: 80,
            effectPrecision: 2,
            costAmount: (x) => D.add(7, x).pow(x).mul(1e40),
        },
        sigil: {
            effectAmount: (x) => D.pow(0.95, x).mul(100).min(D.sub(50, x).mul(2)).max(0),
            effectText: ["{0}%", "sigil effect softcap effect"],
            effectPrecision: 2,
            maxAmount: 50,
            costAmount: (x) => D.pow(2.5, x).mul(1e40),
        },
        money_effective: {
            effectAmount: (x) => D.mul(0.2, x).add(1),
            effectText: ["×{0}", "stronger money token doubler"],
            effectPrecision: 1,
            costAmount: (x) => D.pow(3, x).mul(game.unlocks.tok9?1:1e50),
        },
        sigil_gen: {
            requires: ["sig12"],
            effectAmount: (x) => D.pow(3, x),
            effectText: ["×{0}", "sigil generating speed"],
            effectPrecision: 0,
            costAmount: (x) => D.pow(2, x).mul(game.unlocks.tok11?1:1e60),
        },
        sigil_gen2: {
            requires: ["tok6"],
            effectAmount: (x) => D.mul(0.01, x).add(1),
            effectText: ["^{0}", "better sigil generator"],
            maxAmount: 400,
            effectPrecision: 2,
            costAmount: (x) => D.pow(10, x).mul(1e120),
        },
        multi: {
            requires: ["tok12"],
            effectAmount: (x) => D.mul(0.1, x).add(1),
            effectText: ["^{0}", "multi effect"],
            effectPrecision: 1,
            costAmount: (x) => D.pow(10, x).mul('1e450'),
        },
    },
    ext2: {
        autoSpeed: {
            effectAmount(x){
				x = D(x).toNumber();
				y = Math.floor(x/99);
				return D.pow(100, y).mul(x-y*99+1);
			},
            effectText: ["×{0}", "automation speed"],
            maxAmount: 396,
            effectPrecision: 0,
            costAmount: (x) => D.pow(10, x).mul(1e300),
        },
        sigil: {
            effectAmount: (x) => D.mul(0.01, x).add(1),
            effectText: ["^{0}", "all sigil effects"],
            effectPrecision: 2,
            maxAmount: 200,
            costAmount: (x) => D.pow(2, D(x).pow(1.25)).mul('1e330'),
        },
        super_effective: {
            effectAmount: (x) => D.mul(0.1, x).add(1),
            effectText: ["×{0}", "stronger super button token doubler"],
            effectPrecision: 1,
            costAmount: (x) => D.pow(10, x).mul('1e330'),
        },
    },
}

function getTokenMulti() {
    let mult=D.add(temp.runeStats.token ?? 0, 1).mul(temp.tokenUpgEffects.tokens.gain);
	if(game.unlocks.col3)mult=mult.mul(D(game.collapsed).div(game.unlocks.col24?1:75).add(game.unlocks.col24?1:0).pow(2).add(game.unlocks.col24?0:1));
	if(game.unlocks.col21)mult=mult.mul(D(game.scollapsed).add(game.unlocks.col29?1:0).pow(3).div(game.unlocks.col29?1:game.unlocks.col26?1e3:1e4).add(game.unlocks.col29?0:1));
	if (game.unlocks.sig11)mult=mult.mul(temp.addSigilEffect1);
	return mult;
}

function buyTokenUpgrade(cat, id) {
	if(cat=="ext2" && !game.unlocks.tok12)return;
    let data = tokenUpgrades[cat][id];
    let level = game.tokenUpg[cat]?.[id] ?? 0;
	if(D(level).gte(data.maxAmount))return;
    let cost = data.costAmount(level);
    if (D.gte(game.tokens, cost)) {
        if(!game.unlocks.tok10)game.tokens = D.sub(game.tokens, cost);
        if (!game.tokenUpg[cat]) game.tokenUpg[cat] = {};
        game.tokenUpg[cat][id] = D.add(level, 1);
        temp.tokenUpgEffects[cat][id] = data.effectAmount(game.tokenUpg[cat][id]);
    }
}

function getAvailableTokenUpgrades(cat) {
    return Object.keys(tokenUpgrades[cat]).filter(x => (tokenUpgrades[cat][x].requires ?? []).reduce((x, y) => x && game.unlocks[y], true));
}