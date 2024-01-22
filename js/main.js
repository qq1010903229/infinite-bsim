let VERSION = "1.0";

let tabContainer, container;
let allDirty = false;

function init() {
    load();

    tabContainer = document.getElementById("tabs");
    container = document.getElementById("container");

    updateRuneStats();
    updateMilestoneStats();
    updateAllChargerUpgEffects();
    updateAutomationStats();
    updateTokenStats();
    updateSigilEffects();
    updateStyles();

    updateRuneStats();
    updateMilestoneStats();
    updateAllChargerUpgEffects();
    updateAutomationStats();
    updateTokenStats();
    updateSigilEffects();
    updateStyles();
	
	updateRuneStats();
    updateMilestoneStats();
    updateAllChargerUpgEffects();
    updateAutomationStats();
    updateTokenStats();
    updateSigilEffects();
    updateStyles();
	
    initTabs();

    window.onbeforeunload = () => {
        if (game.options.autoSave) {  
            save();
            saveTimer = 0;
        }
    }

    tick();
}

let delta = 0;
let time = performance.now();
let saveTimer = 0;

function tick() {
    delta = performance.now() - time;
    time += delta;
    delta /= 1000;

    game.stats.timePlayed += delta;

    updateTemp();
	
    game.money = D.mul(temp.moneySpeed, delta).add(game.money);
    game.gems = D.mul(temp.gemSpeed, delta).add(game.gems);

    tabs[currentTab]?.onTick?.();

    saveTimer += delta;
    if (saveTimer >= 10 && game.options.autoSave) {  
        save();
        saveTimer = 0;
    }

    if (D.gt(temp.chargeConsumption, 0)) {
        let effDelta = D.div(game.charge, temp.chargeConsumption).min(delta);
        if (D.gt(effDelta, 0)) {
            game.charge = D.sub(game.charge, D.mul(temp.chargeConsumption, effDelta));
            for (let id in game.automators) {
                let data = game.automators[id];
                if (D.lt(data.active, 0)) continue;
                data.progress = D.add(data.progress ?? 0, D.mul(temp.automatorSpeeds[id], effDelta));
                if (D.gte(data.progress, 1)) {
                    let times = D.floor(data.progress);
                    automators[id].fire(times);
                    data.progress = D.sub(data.progress, times);
                }
            }
        }
    }

	if (game.unlocks.col18) {
		game.collapsed = game.collapsed.max(getImCollapseLayers());
	}
	if (game.unlocks.col31) {
		game.scollapsed = game.scollapsed.max(getImSCollapseLayers());
	}
	if (game.unlocks.sig21) {
		game.sigils[0] = D(game.sigils[0]).add(D.mul(D.pow(game.sigils[1], (temp.tokenUpgEffects.ext1?.sigil_gen2 ?? 1)), delta).mul(getSigilMult()));
	}
	if (game.unlocks.sig20) {
		game.sigils[1] = D(game.sigils[1]).add(D.mul(D.pow(game.sigils[2], (temp.tokenUpgEffects.ext1?.sigil_gen2 ?? 1)), delta).mul(getSigilMult()));
	}
	if (game.unlocks.sig19) {
		game.sigils[2] = D(game.sigils[2]).add(D.mul(D.pow(game.sigils[3], (temp.tokenUpgEffects.ext1?.sigil_gen2 ?? 1)), delta).mul(getSigilMult()));
	}
	if (game.unlocks.sig18) {
		game.sigils[3] = D(game.sigils[3]).add(D.mul(D.pow(game.sigils[4], (temp.tokenUpgEffects.ext1?.sigil_gen2 ?? 1)), delta).mul(getSigilMult()));
	}
	if (game.unlocks.sig17) {
		game.sigils[4] = D(game.sigils[4]).add(D.mul(D.pow(game.sigils[5], (temp.tokenUpgEffects.ext1?.sigil_gen2 ?? 1)), delta).mul(getSigilMult()));
	}
	if (game.unlocks.sig16) {
		game.sigils[5] = D(game.sigils[5]).add(D.mul(D.pow(game.sigils[6], (temp.tokenUpgEffects.ext1?.sigil_gen2 ?? 1)), delta).mul(getSigilMult()));
	}
	if (game.unlocks.sig15) {
		game.sigils[6] = D(game.sigils[6]).add(D.mul(D.pow(game.sigils[7], (temp.tokenUpgEffects.ext1?.sigil_gen2 ?? 1)), delta).mul(getSigilMult()));
	}
	if (game.unlocks.sig14) {
		game.sigils[7] = D(game.sigils[7]).add(D.mul(D.pow(game.sigils[8], (temp.tokenUpgEffects.ext1?.sigil_gen2 ?? 1)), delta).mul(getSigilMult()));
	}
	if (game.unlocks.sig13) {
		game.sigils[8] = D(game.sigils[8]).add(D.mul(D.pow(game.sigils[9], (temp.tokenUpgEffects.ext1?.sigil_gen2 ?? 1)), delta).mul(getSigilMult()));
	}
	if (game.unlocks.sig12) {
		game.sigils[9] = D(game.sigils[9]).add(D.mul(D.pow(game.scraps, (temp.tokenUpgEffects.ext1?.sigil_gen2 ?? 1)), delta).mul(getSigilMult()));
        updateSigilEffects();
	}
    allDirty = false;

    if (+game.options.tickRate) setTimeout(tick, 1000 / game.options.tickRate);
    else requestAnimationFrame(tick);
}

function updateStyles() {
    document.body.className = "";
    if (game.options.pixelText) document.body.className += " pixel-text";
}