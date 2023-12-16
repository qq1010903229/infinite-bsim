tabs.tokens = {
    name: "Tokens",
    condition: () => game.unlocks["tok1"],

    data: null,

    updateTokenRow(row, id) {
        let upgList = getAvailableTokenUpgrades(id);
        while (row.items.length < upgList.length) {
            let button = document.createElement("button");
            button.classList.add("pushy-button", "upgrade");
            button.tabIndex = -1;
            button.onclick = ev => {
                buyTokenUpgrade(button.row, button.target);
                let upgrade = tokenUpgrades[button.row][button.target];
                let level = game.chargerUpg[button.target] ?? 0;
                button.disabled = D.lt(game.charge, upgrade.costAmount(level));
                button.blur();
            }
            row.append(button);
            row.container?.append(button);
            row.items.push(button);

            let effect = document.createElement("div");
            button.append(effect);
            button.effect = effect;

            let cost = document.createElement("div");
            cost.style.marginTop = "4px";
            button.append(cost);
            button.cost = cost;
        }

        for (let b = 0; b < upgList.length; b++) {
            let button = row.items[b];
            button.row = id;
            button.target = upgList[b];
            let upgrade = tokenUpgrades[id][button.target];
            let level = game.tokenUpg[id]?.[button.target] ?? 0;
            let cost = upgrade.costAmount(level);
			if(D(level).gte(upgrade.maxAmount)){
				button.disabled = true;
				button.effect.textContent = "";
				button.effect.append(
					upgrade.effectText[0].replace("{0}", format(upgrade.effectAmount(level), upgrade.effectPrecision)),
					document.createElement("br"),
					upgrade.effectText[1],
				);
				button.cost.textContent = "";
			}else{
				button.disabled = D.lt(game.tokens, cost);
				button.effect.textContent = "";
				button.effect.append(
					upgrade.effectText[0].replace("{0}", format(upgrade.effectAmount(level), upgrade.effectPrecision)) + 
						" → " + upgrade.effectText[0].replace("{0}", format(upgrade.effectAmount(D.add(1, level)), upgrade.effectPrecision)),
					document.createElement("br"),
					upgrade.effectText[1],
				);
				button.cost.textContent = "−" + format(cost) + " Tokens";
			}
        }
    },
    onStart() {
        this.data = {};
        this.data.rows = [];
        let tokensRow = createRow();
        tokensRow.name.textContent = "Tokens";
        this.data.tokens = tokensRow;
        container.append(tokensRow);

        let tokenUpgs = document.createElement("div");
        tokenUpgs.style.width = "100%";
        tokenUpgs.style.display = tokenUpgs.style.flexDirection = tokenUpgs.style.gap = "inherit";
        tokensRow.append(tokenUpgs);
        tokensRow.container = tokenUpgs;

        tokensRow.append(extraButtons);

        let doubleRow = createRow();
        doubleRow.amount.textContent = "Token Doublers";
        this.data.double = doubleRow;
        container.append(doubleRow);
        
        if (game.unlocks.tok2) {
            let row = createRow();
            row.amount.textContent = "Rune Upgrades";
            this.data.runeUpg = row;
            container.append(row);
        }
        
        if (game.unlocks.tok3) {
            let row = createRow();
            row.amount.textContent = "Rune Effects";
            this.data.runeEff = row;
            container.append(row);
        }

        this.onTick();
    },
    onTick() {
        this.data.tokens.amount.textContent = format(game.tokens);

        this.updateTokenRow(this.data.tokens, "tokens");
        this.updateTokenRow(this.data.double, "double");
        if (this.data.runeUpg) this.updateTokenRow(this.data.runeUpg, "rune");
        if (this.data.runeEff) this.updateTokenRow(this.data.runeEff, "runeEff");
    },
    onEnd() {
        this.data = null;
    }
}