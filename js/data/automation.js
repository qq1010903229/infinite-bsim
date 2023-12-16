
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
        maxAmount: 7,
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
        speed: (x) => D.add(x, 1).mul(getAutoSpeed()),
        speedPrecision: 0,
        consumption: (x) => D.add(x, 1).pow(D.div(x, 10).add(0.9)).add(1),
        fire: (x) => doMultiAuto(x),
    },
    reset: {
        title: "Reset Automator",
        requires: "atm1a",
        depthTable: [0, 1, 1.1, 1.2, 1.3, 1.5, 1.7, 2, 2.4, 3],
        levelCost: (x) => D.pow(x, D.div(x, 8).add(0.9).pow(2)).add(1).mul(D.pow(3, x)).mul(5000),
        speed: (x) => D.add(x, 1).mul(0.1).mul(getAutoSpeed()),
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
        speed: (x) => D.add(x, 1).mul(game.unlocks.atm13?D.add(x, 1).pow(1.5):1).mul(getAutoSpeed()).mul(game.unlocks.col4?D(game.collapsed).div(10).pow(game.unlocks.col7?5:game.unlocks.col6?4:game.unlocks.col5?3:2).add(1):1),
        speedPrecision: 0,
        consumption: (x) => D.add(x, 1).pow(D.div(x, 10).add(0.9)).add(1),
        fire: (x) => forgeSigil(0, x),
    },
    scrap: {
        title: "Rune Buy-Scrap Automator",
        requires: "atm6",
        levelCost: (x) => D.pow(x, D.div(x, 10).add(0.9).pow(2)).add(1).mul(D.pow(10, x)).mul(1e10),
        speed: (x) => D.add(x, 1).mul(100).mul(game.unlocks.atm12?D.add(x, 1).pow(1.5):1).mul(getAutoSpeed()),
        speedPrecision: 0,
        consumption: (x) => D.add(x, 1).pow(D.div(x, 10).add(0.9)).add(1)
            .mul(game.automators.scrap.tier ?? 1),
        fire: function(x){
			let gain = D(5).mul(temp.tokenUpgEffects.double.scrap).mul(D.add(temp.runeStats.scrap ?? 0, 1)).mul(D.pow(3, D(game.automators.scrap.tier ?? 1).sub(1))).mul(game.unlocks.col5?D(game.collapsed).div(10):1)
			let cost = getRuneCost(D(game.automators.scrap.tier ?? 1).sub(1));
			let count = game.gems.div(cost).floor().min(x)
			game.scraps = D.add(game.scraps,count.mul(gain))
			game.gems = D.sub(game.gems,count.mul(cost))
		},
        configs: {
            tierCost(x){
				x = D(x);
				if(x.gte(20))x = x.div(5).pow(2).mul(1.25);
				if(x.gte(15))x = x.div(3).add(10);
				if(x.gte(2))x = x.mul(2).sqrt();
				return D.pow(100, D.pow(x, 1.5)).mul(1e12);
			},
            upgradeTier() {
                let data = automators.scrap;
                let level = game.automators.scrap?.maxTier ?? 0;
                let cost = this.tierCost(level);
                if (D.gte(game.charge, cost)) {
                    game.charge = D.sub(game.charge, cost);
                    if (!game.automators.scrap) game.automators.scrap = {};
                    game.automators.scrap.maxTier = (game.automators.scrap.maxTier ?? 0) + 1;
                    if (game.automators.scrap.tier ?? 1 >= level) {
                        game.automators.scrap.tier = (game.automators.scrap.tier ?? 1) + 1;
                        updateAutomationStats();
                    }
                }
            },
            start(parent) {
                if(!game.unlocks.atm12){
                    let container = document.createElement("div");
                    container.classList.add("sub-item");
                    parent.append(container);
                    parent.tier = container;

                    let info = document.createElement("div");
                    container.append(info);
                    container.infoBox = info;

                    let title = document.createElement("b");
                    title.textContent = "Selected rune tier";
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
                        let data = game.automators.scrap;
                        if (!data) data = game.automators.scrap = {};
                        data.tier = Math.max(Math.min(slider.value, (data.maxTier ?? 0) + 1), 1);
                        updateAutomationStats();
                    }
                    info.append(slider);
                    container.slider = slider;
                    
                    let upgBtn = document.createElement("button");
                    upgBtn.classList.add("pushy-button");
                    upgBtn.tabIndex = -1;
                    upgBtn.onclick = ev => {
                        this.upgradeTier();
                        let level = game.automators.scrap?.maxTier ?? 0;
                        upgBtn.disabled = D.lt(game.charge, this.tierCost(level));
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
                    title.textContent = "This automator will buy Common rune of selected tier with 1 effect and immediately scrap it.";
                    container.append(title);
                    container.nameBox = title;
                }
                if(game.unlocks.atm12){
                    let container = document.createElement("div");
                    container.classList.add("config-item");
                    parent.append(container);
                    parent.factor = container;

                    let title = document.createElement("div");
                    title.textContent = "Tier: ";
                    container.append(title);
                    container.nameBox = title;
                        
                    let input = document.createElement("input");
                    input.value = D(game.automators.scrap?.tier ?? 1).toString();
                    input.oninput = () => {
                        let num = D.fromString(input.value || "1").floor().max(1);
                        if (num.array[0] == num.array[0]) {
                            game.automators.scrap.tier = num;
                        }
                    }
                    input.onchange = () => {
                        input.value = D(game.automators.scrap?.tier ?? 1).toString();
                    }
					delete game.automators.scrap.maxTier;
                    container.append(input);
                    container.input = input;
                }
                if(game.unlocks.atm12){
                    let container = document.createElement("div");
                    container.classList.add("config-item");
                    parent.append(container);
                    parent.factor = container;
					
                    let title = document.createElement("div");
                    container.append(title);
                    container.nameBox = title;
					this.details = title;
                }
            },
            update(parent) {
				if(!game.unlocks.atm12){
					let tier = game.automators.scrap?.tier ?? 1;
					let maxtier = game.automators.scrap?.maxTier ?? 0;
					
					let tierCost = this.tierCost(maxtier);

					parent.tier.speed.textContent = "Tier " + format.comma(tier);
					parent.tier.consumption.textContent = "×" + format.comma(tier) + " consumption";

					parent.tier.slider.max = maxtier + 1;
					parent.tier.slider.value = tier;
					
					parent.tier.button.disabled = maxtier >= 29 || D.lt(game.charge, tierCost);
					parent.tier.cost.textContent = maxtier >= 29 ? "Maxed out" : "−" + format(tierCost) + " Charge";
				}else{
					let gain = D(5).mul(temp.tokenUpgEffects.double.scrap).mul(D.add(temp.runeStats.scrap ?? 0, 1)).mul(D.pow(3, D(game.automators.scrap.tier ?? 1).sub(1))).mul(game.unlocks.col5?D(game.collapsed).div(10):1).mul(automators.scrap.speed(game.automators.scrap.active));
					let cost = getRuneCost(D(game.automators.scrap.tier ?? 1).sub(1)).mul(automators.scrap.speed(game.automators.scrap.active));
					this.details.textContent = "-"+format(cost)+" Gems/s, +"+format(gain)+" Glyphs/s, ×" + format(D(game.automators.scrap.tier ?? 1)) + " consumption";
				}
            },
        }
    },
    milestone: {
        title: "Milestone Automator",
        requires: "atm7",
        levelCost: (x) => D.pow(x, D.div(x, 10).add(0.9).pow(2)).add(1).mul(D.pow(10, x)).mul(1e15),
        speed: (x) => D.add(x, 1).mul(getAutoSpeed()),
        speedPrecision: 0,
        consumption: (x) => D.add(x, 1).pow(D.div(x, 10).add(0.9)).add(1),
        fire: function(x){
			x = x.toNumber();
			for(let i=0;i<x;i++){
				for(let j in milestones.global)clickGlobalMilestone(j);
			}
			for(let i=0;i<x;i++){
				for(let j in milestones.rows)for(let k in game.ladder)clickRowMilestone(k,j);
			}
		},
    },
    scrap_r: {
        title: "Rune Autoscrapper",
        requires: "atm8",
        levelCost: (x) => D.pow(x, D.div(x, 10).add(0.9).pow(2)).add(1).mul(D.pow(10, x)).mul(1e18),
        speed: (x) => D.add(x, 1).mul(getAutoSpeed()),
        speedPrecision: 0,
        consumption: (x) => D.add(x, 1).pow(D.div(x, 10).add(0.9)).add(1),
        fire: function(x){
			let b=0;
			for(let i=0;i<game.runes.length;i++){
				if(D(game.runes[i].rarity).lte((game.automators.scrap_r?.tier ?? 0))){
					game.scraps = D.add(game.scraps, getRuneScraps(game.runes[i]));
                    game.runes.splice(i, 1);
					i--;
					b=1;
				}
			}
			if(currentTab=='runes'&&b)updateRuneStats();
            if(currentTab=='runes'&&b)tabs.runes.targets=[],tabs.runes.updateData(),tabs.runes.focusRune();
		},
        configs: {
            start(parent) {
                {
                    let container = document.createElement("div");
                    container.classList.add("sub-item");
                    parent.append(container);
                    parent.tier = container;

                    let info = document.createElement("div");
                    container.append(info);
                    container.infoBox = info;

                    let title = document.createElement("b");
                    title.textContent = "Selected max rarity";
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
                    slider.min = 0;
                    slider.max = 9;
                    slider.oninput = ev => {
                        let data = game.automators.scrap_r;
                        if (!data) data = game.automators.scrap_r = {};
                        data.tier = Math.max(Math.min(slider.value, 9), 0);
                        updateAutomationStats();
                    }
                    info.append(slider);
                    container.slider = slider;
                }
                {
                    let container = document.createElement("div");
                    container.classList.add("config-item");
                    parent.append(container);
                    parent.factor = container;
					
                    let title = document.createElement("div");
                    title.textContent = "This automator will scrap runes which rarity is less or equal to selected rarity.";
                    container.append(title);
                    container.nameBox = title;
                }
            },
            update(parent) {
                let tier = game.automators.scrap_r?.tier ?? 0;
				
                parent.tier.speed.textContent = rarityNames[tier];
                parent.tier.consumption.textContent = "×1 consumption";

                parent.tier.slider.max = 9;
                parent.tier.slider.value = tier;
            },
        }
    },
    charge: {
        title: "Autocharger",
        requires: "atm9",
        levelCost: (x) => D.pow(10, D(x).div(5).add(5).pow(2)),
        speed: (x) => D.add(x, 1).mul(0.01).mul(getAutoSpeed()),
        speedPrecision: 2,
        consumption: (x) => D.add(x, 10).pow(D(x).div(2)).add(1),
        fire(x){
			game.charge = D.add(game.charge, getChargeValue({}).mul(x));
			if (game.unlocks.atm4)
				game.tokens = D.mul(getTokenMulti(), temp.tokenUpgEffects.tokens.gainFromCharge).mul(x).add(game.tokens);
		},
        configs: {
            start(parent) {
                {
                    let container = document.createElement("div");
                    container.classList.add("config-item");
                    parent.append(container);
                    parent.factor = container;
					
                    let title = document.createElement("div");
                    title.textContent = "This automator will generate and collect a normal charge block when it fires.";
                    container.append(title);
                    container.nameBox = title;
                }
            },
            update(parent) {
            },
        }
    },
    merge: {
        title: "Rune Automerger",
        requires: "atm10",
        levelCost: (x) => D.pow(x, D.div(x, 10).add(0.9).pow(2)).add(1).mul(D.pow(10, x)).mul(1e30),
        speed: (x) => D.add(x, 1).mul(getAutoSpeed()).div(50),
        speedPrecision: 2,
        consumption: (x) => D.add(x, 1).pow(D.div(x, 10).add(0.9)).add(1),
        fire: function(x){
			let c=0;
			x = x.toNumber();
			while(x){
				let b=0;
				for(let i=0;i<game.runes.length;i++){
					let k=0;
					for(let j=i;j<game.runes.length;j++){
						if(D.eq(game.runes[i].rarity,game.runes[j].rarity)&&D.eq(game.runes[i].level,game.runes[j].level)&&D.eq(game.runes[i].tier,game.runes[j].tier)){
							k++;
						}
					}
					if(k>=5){
						b=1;
						k=0;
						for(let j=i+1;j<game.runes.length&&k<4;j++){
							if(D.eq(game.runes[i].rarity,game.runes[j].rarity)&&D.eq(game.runes[i].level,game.runes[j].level)&&D.eq(game.runes[i].tier,game.runes[j].tier)){
								k++;
								game.runes.splice(j, 1);
								j--;
							}
						}
						game.runes[i].level=D.add(game.runes[i].level,1);
						game.runes[i].stats=generateRune(game.runes[i].tier).stats;
						break;
					}
				}
				if(b)x--,c=1;else break;
			}
			if(currentTab=='runes'&&c)updateRuneStats();
			if(currentTab=='runes'&&c)tabs.runes.targets=[],tabs.runes.updateData(),tabs.runes.focusRune();
		},
    },
    rune: {
        title: "Rune Autobuyer",
        requires: "atm11",
        levelCost: (x) => D.pow(x, D.div(x, 8).add(0.9).pow(2)).add(1).mul(D.pow(3, x)).mul(1e40),
        speed: (x) => D.add(x, 1).mul(0.05).mul(getAutoSpeed()),
        speedPrecision: 1,
        consumption: (x) => D.add(x, 1).pow(D.div(x, 10).add(0.9)).add(1),
        fire(x){
			let tier = D(game.automators.rune?.tier ?? 1).sub(1);
			let cost = getRuneCost(tier);
			let b=1;
			x = x.toNumber();
			while (D.gte(game.gems, cost) && game.runes.length + game.runeEquip.length < temp.maxRunes && x > 0) {
				game.gems = D.sub(game.gems, cost);
				let rune = generateRune(tier);
				game.runes.push(rune);
				game.stats.runeBought++;
				b=1;
				x--;
			}
			if(currentTab=='runes'&&b)updateRuneStats();
			if(currentTab=='runes'&&b)tabs.runes.targets=[],tabs.runes.updateData(),tabs.runes.focusRune();
		},
        configs: {
            start(parent) {
                {
                    let container = document.createElement("div");
                    container.classList.add("config-item");
                    parent.append(container);
                    parent.factor = container;

                    let title = document.createElement("div");
                    title.textContent = "Tier: ";
                    container.append(title);
                    container.nameBox = title;
                        
                    let input = document.createElement("input");
                    input.value = D(game.automators.rune?.tier ?? 1).toString();
                    input.oninput = () => {
                        let num = D.fromString(input.value || "1").floor().max(1);
                        if (num.array[0] == num.array[0]) {
                            game.automators.rune.tier = num;
                        }
                    }
                    input.onchange = () => {
                        input.value = D(game.automators.rune?.tier ?? 1).toString();
                    }
                    container.append(input);
                    container.input = input;
                }
            },
            update(parent) {
            },
        }
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
	if(game.unlocks.col6)gain = gain.mul(D(game.collapsed).div(100).add(1));
         if (item.type == "big") gain = D.mul(gain, 5);
    else if (item.type == "wide") gain = D.mul(gain, 15);
    return gain;
}

function buyChargerUpgrade(id) {
    let data = chargerUpgrades[id];
    let level = game.chargerUpg[id] ?? 0;
	if(D(level).gte(data.maxAmount))return;
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

function getAutoSpeed(){
	let gain = D(1);
	if(game.unlocks.col2)gain = gain.mul(D(game.collapsed).pow(0.75).add(1).min(100));
		return gain;
}