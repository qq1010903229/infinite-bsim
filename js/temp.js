let temp = {
    moneySpeed: D(0),
    totalMilestones: D(0),
    milestoneMultis: {},
    
    gemSpeed: D(0),

    maxRunes: 50,
    maxRuneEquip: 3,
    runeStats: {},
	runeTierShift: D(0),
	
    tokenUpgEffects: {},
    
    chargerUpgEffects: {},
    chargeConsumption: D(0),
    automatorSpeeds: {},
    totalAutomatorUpgs: D(0),

    sigilPoints: D(0),
    sigilEffects: {},

    skillLevel: D(0),
}

function updateTemp() {
    temp.moneySpeed = D.add(getRowAmount(0), game.unlocks["btn1"] ? 1 : 0).pow(temp.tokenUpgEffects.ext1?.multi ?? 1)
        .mul(temp.runeStats.money ?? 1)
        .mul(temp.milestoneMultis.money ?? 1)
        .mul(temp.tokenUpgEffects.double.money);
			
    temp.gemSpeed = D.add(game.unlocks.rne10?D.pow(3,D.mul(game.gemUpgs,temp.tokenUpgEffects.rune?.upgEff1 ?? 1)):D.mul(game.gemUpgs,temp.tokenUpgEffects.rune?.upgEff1 ?? 1), 1).mul(D.add(temp.runeStats.gem ?? 0, 1))
    .mul(D.pow(game.gemGens, temp.tokenUpgEffects.rune.genEff))
      .mul(temp.tokenUpgEffects.double.gems)
		  .mul(game.unlocks.col7?D(game.collapsed).div(game.unlocks.col23?1:300).add(1).pow(3):1)
		  .mul(game.unlocks.col22?D(game.scollapsed).add(game.unlocks.col29?1:0).pow(5).div(game.unlocks.col29?1:game.unlocks.col26?1e3:1e5).add(game.unlocks.col29?0:1):1)
		  .mul(game.unlocks.sig24?(temp.addSigilEffect1 ?? 1):1);

    temp.skillLevel = game.ladder.reduce((a, b) => D.add(a, b.level), 0);
	 
		temp.maxRunes = 50 + D(game.invUpgs ?? 0).toNumber() * 50
		temp.maxRuneEquip = 3 + D(game.eqUpgs ?? 0).toNumber()
	if(game.unlocks.rne7)temp.runeTierShift = getHighestRuneTier().sub(6).max(temp.runeTierShift);
}

function updateRuneStats() {
    temp.runeStats = {}
    for (let rune of game.runeEquip) {
        let quality = getRuneQuality(rune);
        for (let stat of rune.stats) {
            let sdata = runeStats[stat];
            temp.runeStats[stat] = D[sdata.stack](temp.runeStats[stat] ?? (sdata.stack == "add" ? 0 : 1), sdata.get(quality));
        }
    }
	if(temp.runeStats.gem1)temp.runeStats.gem = temp.runeStats.gem1;
	if(temp.runeStats.scrap1)temp.runeStats.scrap = temp.runeStats.scrap1;
	if(temp.runeStats.token1)temp.runeStats.token = temp.runeStats.token1;
	if(temp.runeStats.charge1)temp.runeStats.charge = temp.runeStats.charge1;
	if(temp.runeStats.super1)temp.runeStats.super = temp.runeStats.super1;
}

function updateMilestoneStats() {
    temp.totalMilestones = D.add(Object.values(game.milestones).reduce((a, b) => D.add(a, b), 0), 
        game.ladder.reduce((a, b) => D.add(a, b.milestones ? Object.values(b.milestones).reduce((x, y) => D.add(x, y), 0) : 0), 0))

    temp.milestoneMultis = {};
    function multiply(target, amount) {
        temp.milestoneMultis[target] = D.mul(temp.milestoneMultis[target] ?? 1, amount);
    } 

    let glevels = game.milestones;
    if (glevels.presses) multiply("money", milestones.global.presses.rewardAmount(glevels.presses));
    if (glevels.playtime) multiply("money", milestones.global.playtime.rewardAmount(glevels.playtime));

    for (let row in game.ladder) {
        let mlevels = game.ladder[row].milestones;
        if (mlevels) {
            if (mlevels.presses) multiply(row, milestones.rows.presses.rewardAmount(mlevels.presses, row));
        }
    }
}

function updateAllChargerUpgEffects() {
    for (let upg in chargerUpgrades) {
        temp.chargerUpgEffects[upg] = chargerUpgrades[upg].effectAmount(game.chargerUpg[upg] ?? 0);
    }
}

function updateAutomationStats() {
    temp.chargeConsumption = D(1);
    temp.totalAutomatorUpgs = D(0);
    temp.automatorSpeeds = {};
    for (let id in automators) {
        let data = game.automators[id] ?? {};
        temp.totalAutomatorUpgs = D.add(temp.totalAutomatorUpgs, data.level ?? 0);
        if (game.autoActive) if (D.gte(data.active ?? -1, 0)) {
            temp.chargeConsumption = D.mul(temp.chargeConsumption, automators[id].consumption(data.active));
            temp.automatorSpeeds[id] = automators[id].speed(data.active);
        }
    }
    temp.chargeConsumption = D.sub(temp.chargeConsumption, 1);
    temp.totalAutomatorUpgs = D.add(temp.totalAutomatorUpgs, game.automators.reset?.maxDepth ?? 0);
}

function updateTokenStats() {
    temp.tokenUpgEffects = {};
    for (let cat in tokenUpgrades) {
        temp.tokenUpgEffects[cat] = {};
        for (let id in tokenUpgrades[cat]) {
            let level = game.tokenUpg[cat]?.[id] ?? 0;
            temp.tokenUpgEffects[cat][id] = tokenUpgrades[cat][id].effectAmount(level);
        }
    }
}

function updateSigilEffects() {
    let multi = D(1);
    temp.sigilPoints = D(0);
    temp.sigilEffects = {};
    for (let a = game.sigils.length - 1; a >= 0; a--) {
		if (game.unlocks.sig31)temp.sigilEffects[a] = multi = D(game.sigils[a]).mul(a * a).add(1).pow(10).pow(temp.tokenUpgEffects?.ext2?.sigil ?? 1).mul(multi);
        else if (game.unlocks.sig30)temp.sigilEffects[a] = multi = D(game.sigils[a]).mul(a * a).add(1).pow(7.5).pow(temp.tokenUpgEffects?.ext2?.sigil ?? 1).mul(multi);
        else if (game.unlocks.sig29)temp.sigilEffects[a] = multi = D(game.sigils[a]).mul(a * a).add(1).pow(5).pow(temp.tokenUpgEffects?.ext2?.sigil ?? 1).mul(multi);
        else if (game.unlocks.sig25)temp.sigilEffects[a] = multi = D(game.sigils[a]).mul(a * a).add(1).pow(3).mul(multi);
        else if (game.unlocks.sig24)temp.sigilEffects[a] = multi = D(game.sigils[a]).mul(a * a).add(1).pow(2.5).mul(multi);
        else if (game.unlocks.sig23)temp.sigilEffects[a] = multi = D(game.sigils[a]).mul(a * a).add(1).pow(2).mul(multi);
        else temp.sigilEffects[a] = multi = D.mul(game.sigils[a], 0.05).mul(a + 1).add(1).mul(multi);
		if(temp.sigilEffects[a].gte(1e36) && !game.unlocks.sig23)temp.sigilEffects[a]=D.pow(10,temp.sigilEffects[a].log10().div(36).pow(D(0.5).pow(D.mul(0.01,temp.tokenUpgEffects.ext1?.sigil ?? 100))).mul(36));
        temp.sigilPoints = D.pow(2, a).mul(game.sigils[a]).add(temp.sigilPoints);
    }
	
	temp.addSigilEffect1 = D(1);
	temp.addSigilEffect2 = D(1);
	if (game.unlocks.sig27)temp.addSigilEffect1 = temp.sigilEffects[0].add(10).log10().pow(2);
	else if (game.unlocks.sig26)temp.addSigilEffect1 = temp.sigilEffects[0].add(10).log10().pow(1.5);
	else if (game.unlocks.sig25)temp.addSigilEffect1 = temp.sigilEffects[0].add(10).log10().pow(1.25);
	else if (game.unlocks.sig24)temp.addSigilEffect1 = temp.sigilEffects[0].add(10).log10();
	else if (game.unlocks.sig23)temp.addSigilEffect1 = temp.sigilEffects[0].add(10).log10().pow(0.75);
	else if (game.unlocks.sig11)temp.addSigilEffect1 = temp.sigilEffects[0].add(10).log10().sqrt();
	if (game.unlocks.sig31)temp.addSigilEffect2 = D.pow(10,temp.sigilEffects[0].add(10).log10().pow(0.25));
	else if (game.unlocks.sig29)temp.addSigilEffect2 = D.pow(10,temp.sigilEffects[0].add(10).log10().pow(0.2));
	else if (game.unlocks.sig28)temp.addSigilEffect2 = temp.sigilEffects[0].add(10).log10().pow(2);
	else if (game.unlocks.sig27)temp.addSigilEffect2 = temp.sigilEffects[0].add(10).log10();
	else if (game.unlocks.sig26)temp.addSigilEffect2 = temp.sigilEffects[0].add(10).log10().pow(0.8);
	else if (game.unlocks.sig25)temp.addSigilEffect2 = temp.sigilEffects[0].add(10).log10().pow(0.75);
	else if (game.unlocks.sig24)temp.addSigilEffect2 = temp.sigilEffects[0].add(10).log10().pow(0.6);
	else if (game.unlocks.sig23)temp.addSigilEffect2 = temp.sigilEffects[0].add(10).log10().sqrt();
	else if (game.unlocks.sig22)temp.addSigilEffect2 = temp.sigilEffects[0].add(10).log10().add(10).log10().pow(2);
		
	temp.addSigilEffect1 = temp.addSigilEffect1.pow(temp.tokenUpgEffects?.ext2?.sigil ?? 1);
	temp.addSigilEffect2 = temp.addSigilEffect2.pow(temp.tokenUpgEffects?.ext2?.sigil ?? 1);
	
	if (game.unlocks.sig10) {
		for (let a = game.sigils.length - 1; a >= 1; a--) {
			temp.sigilEffects[a] = temp.sigilEffects[0];
		}
	}else if (game.unlocks.sig9) {
		for (let a = game.sigils.length - 1; a >= 1; a--) {
			temp.sigilEffects[a] = temp.sigilEffects[Math.max(a - 8,0)];
		}
	}else if (game.unlocks.sig8) {
		for (let a = game.sigils.length - 1; a >= 1; a--) {
			temp.sigilEffects[a] = temp.sigilEffects[Math.max(a - 7,0)];
		}
	}else if (game.unlocks.sig7) {
		for (let a = game.sigils.length - 1; a >= 1; a--) {
			temp.sigilEffects[a] = temp.sigilEffects[Math.max(a - 6,0)];
		}
	}else if (game.unlocks.sig6) {
		for (let a = game.sigils.length - 1; a >= 1; a--) {
			temp.sigilEffects[a] = temp.sigilEffects[Math.max(a - 5,0)];
		}
	}else if (game.unlocks.sig5) {
		for (let a = game.sigils.length - 1; a >= 1; a--) {
			temp.sigilEffects[a] = temp.sigilEffects[Math.max(a - 4,0)];
		}
	}else if (game.unlocks.sig4) {
		for (let a = game.sigils.length - 1; a >= 1; a--) {
			temp.sigilEffects[a] = temp.sigilEffects[Math.max(a - 3,0)];
		}
	}else if (game.unlocks.sig3) {
		for (let a = game.sigils.length - 1; a >= 1; a--) {
			temp.sigilEffects[a] = temp.sigilEffects[Math.max(a - 2,0)];
		}
	}else if (game.unlocks.sig2) {
		for (let a = game.sigils.length - 1; a >= 1; a--) {
			temp.sigilEffects[a] = temp.sigilEffects[Math.max(a - 1,0)];
		}
	}
}