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

    allDirty = false;

    if (+game.options.tickRate) setTimeout(tick, 1000 / game.options.tickRate);
    else requestAnimationFrame(tick);
}

function updateStyles() {
    document.body.className = "";
    if (game.options.pixelText) document.body.className += " pixel-text";
}