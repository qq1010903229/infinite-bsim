tabs.buttons = {
    name: "Buttons",
    condition: () => game.unlocks["rne1"],

    data: null,

    onStart() {
        this.data = {};
        this.data.rows = [];

        let moneyRow = createRow();
        moneyRow.name.textContent = "Money";
        this.data.money = moneyRow;
        container.append(moneyRow);
        this.data.money.append(extraButtons);

        updateVisibleUnlocks();
        this.onTick();
    },
    onTick() {
        this.data.money.amount.textContent = format(game.money);
        this.data.money.rate.textContent = "+" + format(temp.moneySpeed) + "/s";

        while (this.data.money.items.length < visibleUnlocks.length) {
            let button = document.createElement("button");
            button.classList.add("pushy-button");
            button.tabIndex = -1;
            button.onclick = ev => {
                performUnlock(button.target);
                if (game.unlocks[button.target]) {
                    button.remove();
                    this.data.money.items.splice(this.data.money.items.indexOf(button), 1);
                    updateVisibleUnlocks();
                } else {
                    button.blur();
                }
            }
            this.data.money.append(button);
            this.data.money.items.push(button);

            let gain = document.createElement("div");
            button.append(gain);
            button.gain = gain;

            let cost = document.createElement("div");
            button.append(cost);
            button.cost = cost;
            
            this.data.money.append(extraButtons);
        }
        for (let a = 0; a < visibleUnlocks.length; a++) {
            let button = this.data.money.items[a];
            let target = visibleUnlocks[a];
            let data = unlocks[target];
            button.target = target;
            button.gain.textContent = data.desc();
            button.cost.textContent = data.conDisplay();
            button.disabled = !data.condition();
        }
		if(game.unlocks.col17){
			if(!this.data.normalRow)this.data.normalRow = createRow(), container.append(this.data.normalRow);
			let row = this.data.normalRow;
			let name = "Multi";
			let prevName = "Money";
			row.amount.textContent = format(game.ladder[0].amount);
            row.name.textContent = name;
			row.rate.textContent = format(game.collapsed) + " Collapsed Layers";
			this.data.normalRow = row;
			let b = 0;
			if(!game.unlocks.col18)for (let a = 0; a < game.ladder.length; a++) {
				let data = game.ladder[a];
				name = D.lt(data.tier, tierNames.length) ? tierNames[D(data.tier).toNumber()] : "Reset "+format(data.tier);
				while (row.items.length <= b) {
					let button = document.createElement("button");
					button.classList.add("pushy-button");
					button.row = data.tier;
					button.tabIndex = -1;
					button.onclick = ev => {
						clickButton(button.row, button.tier);
						let cost = getButtonCost(data.tier, button.tier);
						button.disabled = D.lt(a == 0 ? game.money : game.ladder[a - 1].amount, cost);
						button.blur();
					}
					row.append(button);
					row.items.push(button);

					let gain = document.createElement("div");
					button.append(gain);
					button.gain = gain;

					let cost = document.createElement("div");
					button.append(cost);
					button.cost = cost;
				}
				let button = row.items[b];
                button.row = data.tier;
                button.tier = getHighestButton(data.tier, a == 0 ? game.money : game.ladder[a - 1].amount).max(0);
                let cost = getButtonCost(data.tier, button.tier);
                button.gain.textContent = "+" + format(getButtonGain(data.tier, button.tier).mul(getRowMulti(data.tier))) + " " + name;
                button.cost.textContent = (a == 0 ? "−" : "≥") + format(cost) + " " + prevName;
                if (game.unlocks.btn9 && D(button.row).gt(0)) button.setAttribute("mark", "#(ω×" + format(button.row) + "+" + format(button.tier.add(1))+")");
                else if (game.unlocks.btn6) button.setAttribute("mark", "#" + format(button.tier.add(1)));
				button.style.setProperty("background", tierColors[D(data.tier).toNumber()%tierColors.length]);
				button.style.setProperty("--background", tierColors[D(data.tier).toNumber()%tierColors.length]);
                button.disabled = D.lt(a == 0 ? game.money : game.ladder[a - 1].amount, cost);
				b++;
				while (row.items.length <= b) {
					let button = document.createElement("button");
					button.classList.add("pushy-button");
					button.row = data.tier;
					button.tabIndex = -1;
					button.onclick = ev => {
						clickButton(button.row, button.tier);
						let cost = getButtonCost(data.tier, button.tier);
						button.disabled = D.lt(a == 0 ? game.money : game.ladder[a - 1].amount, cost);
						button.blur();
					}
					row.append(button);
					row.items.push(button);

					let gain = document.createElement("div");
					button.append(gain);
					button.gain = gain;

					let cost = document.createElement("div");
					button.append(cost);
					button.cost = cost;
				}
				button = row.items[b];
                button.row = data.tier;
                button.tier = getHighestButton(data.tier, a == 0 ? game.money : game.ladder[a - 1].amount).max(0).add(1);
                cost = getButtonCost(data.tier, button.tier);
                button.gain.textContent = "+" + format(getButtonGain(data.tier, button.tier).mul(getRowMulti(data.tier))) + " " + name;
                button.cost.textContent = (a == 0 ? "−" : "≥") + format(cost) + " " + prevName;
                if (game.unlocks.btn9 && D(button.row).gt(0)) button.setAttribute("mark", "#(ω×" + format(button.row) + "+" + format(button.tier.add(1))+")");
                else if (game.unlocks.btn6) button.setAttribute("mark", "#" + format(button.tier.add(1)));
				prevName = name;
				button.style.setProperty("background", tierColors[D(data.tier).toNumber()%tierColors.length]);
				button.style.setProperty("--background", tierColors[D(data.tier).toNumber()%tierColors.length]);
                button.disabled = D.lt(a == 0 ? game.money : game.ladder[a - 1].amount, cost);
				b++;
			}else{
				let data = game.ladder[0];
				row.style.setProperty("--background", tierColors[D(data.tier).toNumber()%tierColors.length]);
				row.amount.textContent = format(data.amount);
				row.name.textContent = name;

					while (row.items.length < 8) {
						let button = document.createElement("button");
						button.classList.add("pushy-button");
						button.row = data.tier;
						button.tabIndex = -1;
						button.onclick = ev => {
							clickButton(button.row, button.tier);
							let cost = getButtonCost(data.tier, button.tier);
							button.blur();
						}
						row.append(button);
						row.items.push(button);

						let gain = document.createElement("div");
						button.append(gain);
						button.gain = gain;

						let cost = document.createElement("div");
						button.append(cost);
						button.cost = cost;
					}

					if (game.unlocks.btn5) data.level = getHighestButton(data.tier, game.money).max(data.level);
					let offset = D.sub(data.level, 6).max(0);
					let multi = getRowMulti(data.tier);
					let needsUpdate = allDirty || D.neq(multi, row.multi) || D.neq(row.items[0]?.tier ?? -1, offset);
					row.multi = multi;

					for (let b = 0; b < 8; b++) {
						let button = row.items[b];
						button.row = data.tier;
						button.tier = D.add(offset, b);
						let cost = getButtonCost(data.tier, button.tier);
						if (needsUpdate) {
							button.gain.textContent = "+" + format(getButtonGain(data.tier, button.tier).mul(row.multi)) + " " + name;
							button.cost.textContent = "−" + format(cost) + " " + prevName;
							if (game.unlocks.btn9 && D(button.row).gt(0)) button.setAttribute("mark", "#(ω×" + format(button.row) + "+" + format(button.tier.add(1))+")");
							else if (game.unlocks.btn6) button.setAttribute("mark", "#" + format(button.tier.add(1)));
						}
						button.disabled = D.lt(game.money, cost);
					}

					prevName = name;
			}
			
			while (this.data.rows.length < game.super_ladder.length) {
				let row = createRow();
				container.append(row);
				this.data.rows.push(row);
			}
			prevName = "Collapsed Layers";
			for (let a = 0; a < game.super_ladder.length; a++) {
				let data = game.super_ladder[a];
				let row = this.data.rows[a];
				let name = D.lt(data.tier, tierNames.length) ? "Super-"+tierNames[D(data.tier).toNumber()] : "Super-Reset "+D(data.tier).toNumber();
				row.style.setProperty("--background", tierColors[D(data.tier).toNumber()%tierColors.length]);
				row.amount.textContent = format(data.amount);
				row.name.textContent = name;

				while (row.items.length < 8) {
					let button = document.createElement("button");
					button.classList.add("pushy-button");
					button.row = data.tier;
					button.tabIndex = -1;
					button.onclick = ev => {
						clickSuperButton(button.row, button.tier);
						let cost = getSuperButtonCost(data.tier, button.tier);
						button.disabled = D.lt(a == 0 ? game.collapsed : game.super_ladder[a - 1].amount, cost);
						button.blur();
					}
					row.append(button);
					row.items.push(button);

					let gain = document.createElement("div");
					button.append(gain);
					button.gain = gain;

					let cost = document.createElement("div");
					button.append(cost);
					button.cost = cost;
				}

				if (game.unlocks.btn5) data.level = getHighestSuperButton(data.tier, a == 0 ? game.collapsed : game.super_ladder[a - 1].amount).max(data.level);
				let offset = D.sub(data.level, 6).max(0);
				let multi = getSuperMulti(data.tier);
				row.multi = multi;
				row.rate.textContent = "×" + format(row.multi);

				for (let b = 0; b < 8; b++) {
					let button = row.items[b];
                button.row = data.tier;
					button.tier = D.add(offset, b);
					let cost = getSuperButtonCost(data.tier, button.tier);
						button.gain.textContent = "+" + format(getSuperButtonGain(data.tier, button.tier).mul(row.multi)) + " " + name;
						button.cost.textContent = "≥" + format(cost) + " " + prevName;
						if (game.unlocks.btn9 && D(button.row).gt(0)) button.setAttribute("mark", "#(ω^2+ω×" + format(button.row) + "+" + format(button.tier.add(1))+")");
						else if (game.unlocks.btn9) button.setAttribute("mark", "#(ω^2+" + format(button.tier.add(1))+")");
						else if (game.unlocks.btn6) button.setAttribute("mark", "#" + format(button.tier.add(1)));
					button.disabled = D.lt(a == 0 ? game.collapsed : game.super_ladder[a - 1].amount, cost);
				}

				prevName = name;
			}
			
			return;
		}
		
		
		
        while (this.data.rows.length < game.ladder.length) {
            let row = createRow();
            container.append(row);
            this.data.rows.push(row);
        }
        let prevName = "Money";
        for (let a = 0; a < game.ladder.length; a++) {
            let data = game.ladder[a];
            let row = this.data.rows[a];
            let name = D.lt(data.tier, tierNames.length) ? tierNames[D(data.tier).toNumber()] : "Reset "+format(data.tier);
            row.style.setProperty("--background", tierColors[D(data.tier).toNumber()%tierColors.length]);
            row.amount.textContent = format(data.amount);
            row.name.textContent = name;

            while (row.items.length < 8) {
                let button = document.createElement("button");
                button.classList.add("pushy-button");
                button.row = data.tier;
                button.tabIndex = -1;
                button.onclick = ev => {
                    clickButton(button.row, button.tier);
                    let cost = getButtonCost(data.tier, button.tier);
                    button.disabled = D.lt(a == 0 ? game.money : game.ladder[a - 1].amount, cost);
                    button.blur();
                }
                row.append(button);
                row.items.push(button);

                let gain = document.createElement("div");
                button.append(gain);
                button.gain = gain;

                let cost = document.createElement("div");
                button.append(cost);
                button.cost = cost;
            }

            if (game.unlocks.btn5) data.level = getHighestButton(data.tier, a == 0 ? game.money : game.ladder[a - 1].amount).max(data.level);
            let offset = D.sub(data.level, 6).max(0);
            let multi = getRowMulti(data.tier);
            let needsUpdate = allDirty || D.neq(multi, row.multi) || D.neq(row.items[0]?.tier ?? -1, offset);
            row.multi = multi;
            row.rate.textContent = "×" + format(row.multi);

            for (let b = 0; b < 8; b++) {
                let button = row.items[b];
                button.row = data.tier;
                button.tier = D.add(offset, b);
                let cost = getButtonCost(data.tier, button.tier);
				if (needsUpdate) {
                    button.gain.textContent = "+" + format(getButtonGain(data.tier, button.tier).mul(row.multi)) + " " + name;
                    button.cost.textContent = (a == 0 ? "−" : "≥") + format(cost) + " " + prevName;
                    if (game.unlocks.btn9 && D(button.row).gt(0)) button.setAttribute("mark", "#(ω×" + format(button.row) + "+" + format(button.tier.add(1))+")");
                    else if (game.unlocks.btn6) button.setAttribute("mark", "#" + format(button.tier.add(1)));
                }
                button.disabled = D.lt(a == 0 ? game.money : game.ladder[a - 1].amount, cost);
            }

            prevName = name;
        }
    },
    onEnd() {
        this.data = null;
    }
}