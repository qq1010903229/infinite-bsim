
let chargeNotes = [];
let chargeDir = 0;

let chargerUpgrades = {
    value: {
        effectAmount: (x) => D.pow(2, x),
        effectText: ["×{0}", "all Charge gains"],
        effectPrecision: 0,
        costAmount: (x) => D.pow(3, x).mul(10),
    },
    distance: {
        effectAmount: (x) => 38000 / (19 + D(x).toNumber()),
        effectText: ["{0}px", "average charge distance"],
        effectPrecision: 0,
        costAmount: (x) => D.add(9, x).pow(x).mul(100),
    },
    maxHeight: {
        effectAmount: (x) => D.add(x, 5).toNumber(),
        effectText: ["{0}", "max charge block height"],
        effectPrecision: 0,
        costAmount: (x) => D.pow(100, D.pow(x, 2).add(x).div(2)).mul(100000),
    },
    fillBonus: {
        effectAmount: (x) => D.mul(0.05, x),
        effectText: ["+{0}×", "Charge/charge in charger"],
        effectPrecision: 2,
        costAmount: (x) => D.add(9, x).pow(x).mul(25000),
    },
    upgBonus: {
        effectAmount: (x) => D.mul(0.02, x),
        effectText: ["+{0}×", "Charge/automator upgrades"],
        effectPrecision: 2,
        costAmount: (x) => D.add(9, x).mul(2).pow(x).mul(5e8),
    },
}

let automators = {
    multi: {
        title: "Multiplier Automator",
        levelCost: (x) => D.pow(x, D.div(x, 10).add(0.9).pow(2)).add(1).mul(D.pow(2, x)).mul(500),
        speed: (x) => D.add(x, 1),
        speedPrecision: 0,
        consumption: (x) => D.add(x, 1).pow(D.div(x, 10).add(0.9)).add(1),
        fire: (x) => doMultiAuto(x),
    },
    reset: {
        title: "Reset Automator",
        requires: "atm1a",
        depthTable: [0, 1, 1.1, 1.2, 1.3, 1.5, 1.7, 2, 2.4, 3],
        levelCost: (x) => D.pow(x, D.div(x, 8).add(0.9).pow(2)).add(1).mul(D.pow(3, x)).mul(5000),
        speed: (x) => D.add(x, 1).mul(0.1),
        speedPrecision: 1,
        consumption: (x) => D.add(x, 1).pow(D.div(x, 8).add(0.9)).add(1)
            .pow(automators.reset.depthTable[game.automators.reset?.depth ?? 1]),
        fire: (x) => doResetAuto(x),
        configs: {
            depthCost: (x) => D.pow(100, D.pow(x, 2).add(x).div(2)).mul(10000),
            upgradeDepth() {
                let data = automators.reset;
                let level = game.automators.reset?.maxDepth ?? 0;
                let cost = this.depthCost(level);
                if (D.gte(game.charge, cost)) {
                    game.charge = D.sub(game.charge, cost);
                    if (!game.automators.reset) game.automators.reset = {};
                    game.automators.reset.maxDepth = (game.automators.reset.maxDepth ?? 0) + 1;
                    if (game.automators.reset.depth ?? 1 >= level) {
                        game.automators.reset.depth = (game.automators.reset.depth ?? 1) + 1;
                        updateAutomationStats();
                    }
                }
            },
            start(parent) {
                {
                    let container = document.createElement("div");
                    container.classList.add("sub-item");
                    parent.append(container);
                    parent.depth = container;

                    let info = document.createElement("div");
                    container.append(info);
                    container.infoBox = info;

                    let title = document.createElement("b");
                    title.textContent = "Maximum button row depth";
                    info.append(title);
                    container.titleBox = title;

                    let rateBox = document.createElement("div");
                    rateBox.classList.add("rate-box");
                    info.append(rateBox);
                    container.rateBox = rateBox;

                    let speed = document.createElement("div");
                    rateBox.append(speed);
                    container.speed = speed;

                    let consumption = document.createElement("div");
                    rateBox.append(consumption);
                    container.consumption = consumption;

                    let slider = document.createElement("input");
                    slider.type = "range";
                    slider.min = 1;
                    slider.oninput = ev => {
                        let data = game.automators.reset;
                        if (!data) data = game.automators.reset = {};
                        data.depth = Math.max(Math.min(slider.value, (data.maxDepth ?? 0) + 5), 1);
                        updateAutomationStats();
                    }
                    info.append(slider);
                    container.slider = slider;
                    
                    let upgBtn = document.createElement("button");
                    upgBtn.classList.add("pushy-button");
                    upgBtn.tabIndex = -1;
                    upgBtn.onclick = ev => {
                        this.upgradeDepth();
                        let level = game.automators.reset?.maxDepth ?? 0;
                        upgBtn.disabled = D.lt(game.charge, this.depthCost(level));
                        upgBtn.blur();
                    }
                    container.append(upgBtn);
                    container.button = upgBtn;

                    let effect = document.createElement("div");
                    effect.textContent = "Upgrade";
                    upgBtn.append(effect);
                    container.effect = effect;

                    let cost = document.createElement("div");
                    upgBtn.append(cost);
                    container.cost = cost;
                }
                {
                    let container = document.createElement("div");
                    container.classList.add("config-item");
                    parent.append(container);
                    parent.factor = container;

                    let title = document.createElement("div");
                    title.textContent = "Choose the row where the gain is X times current amount:";
                    container.append(title);
                    container.nameBox = title;
                        
                    let input = document.createElement("input");
                    input.value = D(game.automators.reset?.factor ?? 0).toString();
                    input.oninput = () => {
                        let num = D.fromString(input.value || "0");
                        if (num.array[0] == num.array[0]) {
                            game.automators.reset.factor = num;
                        }
                    }
                    input.onchange = () => {
                        input.value = D(game.automators.reset?.factor ?? 0).toString();
                    }
                    container.append(input);
                    container.input = input;
                }
            },
            update(parent) {
                let depth = game.automators.reset?.depth ?? 1;
                let maxDepth = game.automators.reset?.maxDepth ?? 0;
                
                let depthCost = this.depthCost(maxDepth);

                parent.depth.speed.textContent = format.comma(depth) + " button rows";
                parent.depth.consumption.textContent = "^" + format.comma(automators.reset.depthTable[depth], 1) + " consumption";

                parent.depth.slider.max = maxDepth + 5;
                parent.depth.slider.value = depth;
                
                parent.depth.button.disabled = maxDepth >= 4 || D.lt(game.charge, depthCost);
                parent.depth.cost.textContent = maxDepth >= 4 ? "Maxed out" : "−" + format(depthCost) + " Charge";
            },
        }
    },
    sigil: {
        title: "Sigil Automator",
        requires: "atm5a",
        levelCost: (x) => D.pow(x, D.div(x, 10).add(0.9).pow(2)).add(1).mul(D.pow(10, x)).mul(100000),
        speed: (x) => D.add(x, 1),
        speedPrecision: 0,
        consumption: (x) => D.add(x, 1).pow(D.div(x, 10).add(0.9)).add(1),
        fire: (x) => forgeSigil(0, x),
    },
}

function doChargerDrag(delta, dTime) {
    let chargerHeight = 370;

    if (!delta) return;

    let items = [...game.charges].sort((a, b) => (b.y - a.y) * delta);

    let posCap = [-27, -27, -27, -27];
    let posHeight = [0, 0, 0, 0];

    for (let item of items) {
        if (delta > 0) item.y = chargerHeight - 30 - item.y;
        if (item.type == "wide") {
            let max = Math.max(...posCap)
            posCap[0] = posCap[1] = posCap[2] = posCap[3] = item.y = Math.max(item.y - Math.abs(delta), max + 27);
            posHeight[0] = posHeight[1] = posHeight[2] = posHeight[3] = Math.max(...posHeight) + 1;
        } else if (item.type == "big") {
            if (delta < 0) item.y += 27;
            let max = Math.max(posCap[item.x], posCap[item.x + 1])
            posCap[item.x] = posCap[item.x + 1] = item.y = Math.max(item.y - Math.abs(delta), max + 54);
            if (delta < 0) item.y -= 27;
            posHeight[item.x] = posHeight[item.x + 1] = Math.max(posHeight[item.x], posHeight[item.x + 1]) + 2;
        } else {
            posCap[item.x] = item.y = Math.max(item.y - Math.abs(delta), posCap[item.x] + 27);
            posHeight[item.x] = posHeight[item.x] + 1;
        }
        if (delta > 0) item.y = chargerHeight - 30 - item.y;
    }

    let posProgress = Math.min(Math.abs(delta), 2500 * dTime);

    chargeNotes[0] -= posProgress / 500;

    if (Math.max(...posHeight) > temp.chargerUpgEffects.maxHeight) {
        chargeNotes[2] = Math.min(chargeNotes[2] + posProgress / 500, 1);
        posProgress = 0;
    } else chargeNotes[2] = Math.max(chargeNotes[2] - posProgress / 500, -5);

    if (delta > 0) chargeDir *= -1;
    chargeDir = Math.min(chargeDir + posProgress / 500, 1);
    let shakePenalty = Math.max((1 - chargeDir) * 500, 0);
    if (shakePenalty) chargeNotes[1] = Math.min(chargeNotes[1] + posProgress / 500, 1);
    else chargeNotes[1] = Math.max(chargeNotes[1] - posProgress / 500, -5);
    posProgress = Math.max(posProgress - shakePenalty, 0);
    if (delta > 0) chargeDir *= -1;

    game.nextCharge -= posProgress / temp.chargerUpgEffects.distance;

    while (game.nextCharge <= 0) {
        if (game.unlocks.atm2 && Math.random() < .1) {
            game.charges.push({
                x: Math.floor(Math.random() * 3),
                y: delta > 0 ? -50 : chargerHeight + 10,
                type: "big",
            });
        } else if (game.unlocks.atm3 && Math.random() < .1) {
            game.charges.push({
                x: 0,
                y: delta > 0 ? -50 : chargerHeight + 10,
                type: "wide",
            });
        } else {
            game.charges.push({
                x: Math.floor(Math.random() * 4),
                y: delta > 0 ? -50 : chargerHeight + 10,
            });
        }
        game.nextCharge += Math.log2(1 / (1 - Math.random()));
    }

    game.stats.chargerDist += posProgress;
}

function clickCharge(id) {
    let item = game.charges.splice(id, 1);
    game.charge = D.add(game.charge, getChargeValue(item[0]));
    if (game.unlocks.atm4)
        game.tokens = D.mul(getTokenMulti(), temp.tokenUpgEffects.tokens.gainFromCharge).add(game.tokens);
    game.stats.chargeClick++;
}

function getChargeValue(item) {
    let gain = D.mul(temp.chargerUpgEffects.value, temp.tokenUpgEffects.double.charge)
        .mul(D.mul(temp.chargerUpgEffects.fillBonus, game.charges.length).add(1))
        .mul(D.mul(temp.chargerUpgEffects.upgBonus, temp.totalAutomatorUpgs).add(1))
        .mul(D.add(temp.runeStats.charge ?? 0, 1));
         if (item.type == "big") gain = D.mul(gain, 5);
    else if (item.type == "wide") gain = D.mul(gain, 15);
    return gain;
}

function buyChargerUpgrade(id) {
    let data = chargerUpgrades[id];
    let level = game.chargerUpg[id] ?? 0;
    let cost = data.costAmount(level);
    if (D.gte(game.charge, cost)) {
        game.charge = D.sub(game.charge, cost);
        game.chargerUpg[id] = D.add(level, 1);
        temp.chargerUpgEffects[id] = data.effectAmount(game.chargerUpg[id]);
    }
}

function upgradeAutomator(id) {
    let data = automators[id];
    let level = game.automators[id]?.level ?? 0;
    let cost = data.levelCost(level);
    if (D.gte(game.charge, cost)) {
        game.charge = D.sub(game.charge, cost);
        if (!game.automators[id]) game.automators[id] = {};
        game.automators[id].level = D.add(level, 1);
        if (D.gte(game.automators[id].active ?? -1, level)) {
            game.automators[id].active = D.add(game.automators[id].active, 1);
        }
        updateAutomationStats();
    }
}