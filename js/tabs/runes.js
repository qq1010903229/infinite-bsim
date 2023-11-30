tabs.runes = {
    name: "Runes",
    condition: () => game.unlocks["rne1"],

    data: null,

    mode: "",
    targets: [],
    onStart() {
        this.data = {};

        let moneyRow = createRow();
        moneyRow.name.textContent = "Money";
        this.data.money = moneyRow;
        container.append(moneyRow);


        let gemGensDiv = document.createElement("div");
        gemGensDiv.style.marginBottom = "8px";
        moneyRow.append(gemGensDiv);

        gemGensDiv.append("You have");
        let gemGensAmt = document.createElement("div");
        gemGensAmt.style.fontWeight = "bold";
        moneyRow.gemGensAmt = gemGensAmt;
        gemGensDiv.append(gemGensAmt);
        gemGensDiv.append("gem generators");

        {
            let button = document.createElement("button");
            button.classList.add("pushy-button");
            button.tabIndex = -1;
            button.onclick = ev => {
                buyGemGen();
                let cost = getGemGenCost(game.gemGens);
                button.disabled = D.lt(game.money, cost);
                button.blur();
            }
            moneyRow.append(button);
            moneyRow.gemGenBtn = button;

            let gain = document.createElement("div");
            gain.textContent = "Buy one"
            button.append(gain);
            button.gain = gain;

            let cost = document.createElement("div");
            button.append(cost);
            button.cost = cost;
        }

        {
            let button = document.createElement("button");
            button.classList.add("pushy-button");
            button.tabIndex = -1;
            button.onclick = ev => {
                buyGemUpg();
                let cost = getGemUpgCost(game.gemUpgs);
                button.disabled = D.lt(game.money, cost);
                button.blur();
            }
            moneyRow.append(button);
            moneyRow.gemUpgBtn = button;

            let gain = document.createElement("div");
            gain.textContent = "Upgrade"
            button.append(gain);
            button.gain = gain;

            let cost = document.createElement("div");
            button.append(cost);
            button.cost = cost;
        }
        
        this.data.money.append(extraButtons);


        let gemRow = createRow();
        gemRow.name.textContent = "Gems";
        gemRow.items = [];
        this.data.gem = gemRow;
        container.append(gemRow);

        let invRow = createRow();
        invRow.classList.add("rune-inventory");
        invRow.name.textContent = "Runes";
        invRow.items = [];
        this.data.inv = invRow;
        container.append(invRow);

        container.append(invRow.bar = createScrollbar(invRow));


        let equipRow = createRow();
        equipRow.name.textContent = "Equipped";
        equipRow.items = [];
        this.data.equip = equipRow;
        container.append(equipRow);

        let detailsRow = createRow();
        detailsRow.classList.add("rune-details");
        detailsRow.amount.textContent = "No rune selected";
        this.data.details = detailsRow;
        container.append(detailsRow);

        let detailsInfo = document.createElement("div");
        detailsInfo.classList.add("desc-info");
        detailsRow.descInfo = detailsInfo;
        detailsRow.append(detailsInfo);

        let detailsBtns = document.createElement("div");
        detailsBtns.classList.add("bottom-buttons");
        detailsRow.buttons = detailsBtns;
        detailsRow.append(detailsBtns);

        this.mode = "";
        this.targets = [];

        this.updateData();
        this.focusRune();
        this.onTick();
    },
    onTick() {
        this.data.money.amount.textContent = format(game.money);
        this.data.money.rate.textContent = "+" + format(temp.moneySpeed) + "/s";
        this.data.gem.amount.textContent = format(game.gems);
        this.data.gem.rate.textContent = "+" + format(temp.gemSpeed) + "/s";
        this.data.inv.rate.textContent = format(game.scraps) + " Glyphs";

        this.data.money.gemGensAmt.textContent = format(game.gemGens);
        
        let gemGenCost = getGemGenCost(game.gemGens);
        this.data.money.gemGenBtn.cost.textContent = "−" + format(gemGenCost) + " Money";
        this.data.money.gemGenBtn.disabled = D.lt(game.money, gemGenCost);
        let gemUpgCost = getGemUpgCost(game.gemUpgs);
        this.data.money.gemUpgBtn.cost.textContent = "−" + format(gemUpgCost) + " Glyphs";
        this.data.money.gemUpgBtn.disabled = D.lt(game.scraps, gemUpgCost);

        while (this.data.gem.items.length < 8) {
            let button = document.createElement("button");
            button.classList.add("pushy-button");
            button.tabIndex = -1;
            button.onclick = ev => {
                buyRune(button.tier);
                let cost = getRuneCost(button.tier);
                button.disabled = D.lt(game.gems, cost);
                this.updateData();
                button.blur();
            }
            this.data.gem.append(button);
            this.data.gem.items.push(button);

            let gain = document.createElement("div");
            button.append(gain);
            button.gain = gain;

            let cost = document.createElement("div");
            button.append(cost);
            button.cost = cost;
        }
        
        for (let b = 0; b < 8; b++) {
            let button = this.data.gem.items[b];
            button.tier = D.add(0, b);
            button.gain.textContent = "+Tier " + format(D.add(1, button.tier)) + " Rune";
            let cost = getRuneCost(button.tier);
            button.cost.innerText = "−" + format(cost) + " Gems";
            button.disabled = D.lt(game.gems, cost);
        }
    },
    setRuneButton(button, rune, index) {
        button.index = index;
        button.namediv.textContent = "Tier " + format(D.add(1, rune.tier)) + " Rune";
        button.tier.textContent = (D.lt(rune.rarity, rarityNames.length) ? rarityNames[D(rune.rarity).toNumber()] : rarityNames[rarityNames.length - 1] + " +" + format(D.sub(rune.rarity, rarityNames.length).add(1)));
        if (D.gt(rune.level, 0)) button.tier.textContent += " | " + (D.lt(rune.rarity, runeLevelNames.length) ? runeLevelNames[D(rune.level).toNumber() - 1] : "+" + format(rune.level));
        button.style.setProperty("--background", D.lt(rune.rarity, rarityColors.length) ? rarityColors[D(rune.rarity).toNumber()] : "#f45");
        let selected = this.targets.includes(index);
        button.classList.toggle("selected", selected);
        button.disabled = false;
        if (this.mode == "merge") {
            if (!selected) {
                if (this.targets.length >= 5) button.disabled = true;
                else if (this.targets.length > 0) {
                    let firstRune = this.targets[0] < 0 ? game.runeEquip[-1 - this.targets[0]] : game.runes[this.targets[0]];
                    button.disabled = firstRune && (D.neq(firstRune.tier, rune.tier) || D.neq(firstRune.rarity, rune.rarity) || D.neq(firstRune.level, rune.level));
                }
            }
        }
    },
    updateData() {
        this.data.inv.amount.textContent = (game.runes.length + game.runeEquip.length) + " / " + temp.maxRunes;
        this.data.equip.amount.textContent = game.runeEquip.length + " / " + temp.maxRuneEquip;

        while (this.data.inv.items.length < game.runes.length) {
            let button = document.createElement("button");
            button.classList.add("rune-button");
            button.tabIndex = -1;
            button.onclick = ev => {
                this.focusRune(button.index);
                button.blur();
            }
            button.ondblclick = ev => {
                if (this.mode) return;
                if (game.runeEquip.length >= temp.maxRuneEquip) return;
                game.runeEquip.push(...game.runes.splice(button.index, 1));
                updateRuneStats();
                this.focusRune(-game.runeEquip.length);
                button.blur();
            }
            this.data.inv.append(button);
            this.data.inv.items.push(button);

            let name = document.createElement("b");
            button.append(name);
            button.namediv = name;

            let tier = document.createElement("div");
            button.append(tier);
            button.tier = tier;
        }
        while (this.data.inv.items.length > game.runes.length) {
            this.data.inv.items.pop().remove();
        }
        
        for (let b = 0; b < game.runes.length; b++) {
            this.setRuneButton(this.data.inv.items[b], game.runes[b], b);
        }

        while (this.data.equip.items.length < temp.maxRuneEquip) {
            let button = document.createElement("button");
            button.classList.add("rune-button");
            button.tabIndex = -1;
            button.onclick = ev => {
                this.focusRune(button.index);
                button.blur();
            }
            button.ondblclick = ev => {
                if (this.mode) return;
                game.runes.push(...game.runeEquip.splice(-1 - button.index, 1));
                updateRuneStats();
                this.focusRune(game.runes.length - 1);
                button.blur();
            }
            this.data.equip.append(button);
            this.data.equip.items.push(button);

            let name = document.createElement("b");
            button.append(name);
            button.namediv = name;

            let tier = document.createElement("div");
            button.append(tier);
            button.tier = tier;
        }
        
        for (let b = 0; b < temp.maxRuneEquip; b++) {
            let button = this.data.equip.items[b];
            let rune = game.runeEquip[b];
            button.index = b;
            if (button.disabled = !rune) {
                button.namediv.textContent = "Empty slot";
                button.tier.textContent = "";
                button.classList.remove("selected");
                button.style.setProperty("--background", "");
            } else {
                this.setRuneButton(button, rune, -1 - b);
            }
        }

        this.data.inv.bar.update();
    },
    focusRune(index = null) {
        if (typeof(index) != "number") {
            this.data.details.amount.textContent = {
                merge: "Rune merging"  
            }[this.mode] ?? "No rune selected";
            this.data.details.rate.textContent = "";
            this.data.details.descInfo.textContent = "";
            
            this.data.details.buttons.textContent = "";

            if (this.mode == "merge") {
                this.data.details.descInfo.textContent = "Select 5 runes of the same tier, rarity and strength to merge into a new similar tier and rarity rune of higher strength.";
            } else if (this.mode == "scrap") {
                this.data.details.descInfo.textContent = "Select runes to scrap, then press the \"Scrap\" button to scrap them all at once.";
            } else if (!this.mode) {
                this.data.details.descInfo.textContent = "Total equipped effects:";
                for (let stat in temp.runeStats) {
                    let sdata = runeStats[stat];
                    let effect = temp.runeStats[stat];
                    let line = document.createElement("li");
                    line.textContent = sdata.display.replace("{0}", format(effect, sdata.precision));
                    this.data.details.descInfo.append(line);
                }

                let grid = document.createElement("div");
                grid.classList.add("rune-actions");
                this.data.details.buttons.append(grid);
                
                if (game.unlocks.rne3) {
                    let button = document.createElement("button");
                    button.classList.add("pushy-button", "mini");
                    button.textContent = "Scrap";
                    button.onclick = () => {
                        this.mode = "scrap";
                        this.focusRune();
                    };
                    this.data.details.buttons.append(button);
                }
                if (game.unlocks.rne2) {
                    let button = document.createElement("button");
                    button.classList.add("pushy-button", "mini");
                    button.textContent = "Merge";
                    button.onclick = () => {
                        this.mode = "merge";
                        this.focusRune();
                    };
                    this.data.details.buttons.append(button);
                }
            }
        } else {
            let rune = index >= 0 ? game.runes[index] : game.runeEquip[-1 - index];
            let button = index >= 0 ? this.data.inv.items[index] : this.data.equip.items[-1 - index];
            if (button && button.tier.textContent) {
                this.data.details.amount.textContent = button.namediv.textContent;
                this.data.details.rate.textContent = button.tier.textContent;
            }
            
            this.data.details.descInfo.textContent = "Rune equipped effects:";
            for (let stat of rune.stats ?? []) {
                let sdata = runeStats[stat];
                let effect = sdata.get(getRuneQuality(rune));
                let line = document.createElement("li");
                line.textContent = sdata.display.replace("{0}", format(effect, sdata.precision));
                this.data.details.descInfo.append(line);
            }

            this.data.details.buttons.textContent = "";

            if (!this.mode) { 
                let equipBtn = document.createElement("button");
                equipBtn.classList.add("pushy-button");
                equipBtn.style.fontWeight = "bold";
                equipBtn.textContent = index >= 0 ? (game.runeEquip.length >= temp.maxRuneEquip ? "Max equipped" : "Equip") : "Unequip";
                equipBtn.disabled = index >= 0 && game.runeEquip.length >= temp.maxRuneEquip;
                equipBtn.onclick = button?.ondblclick;
                this.data.details.buttons.append(equipBtn);

                let scrapBtn = document.createElement("button");
                scrapBtn.classList.add("pushy-button");
                let scrapTitle = document.createElement("div");
                scrapTitle.textContent = "Scrap";
                scrapTitle.style.fontWeight = "bold";
                scrapBtn.append(scrapTitle);
                scrapBtn.append("+" + format(getRuneScraps(rune)) + " Glyphs");
                scrapBtn.onclick = () => {
                    game.scraps = D.add(game.scraps, getRuneScraps(rune));
                    index >= 0 ? game.runes.splice(index, 1) : game.runeEquip.splice(-1 - index, 1);
                    updateRuneStats();
                    this.focusRune();
                }
                this.data.details.buttons.append(scrapBtn);

                let backBtn = document.createElement("button");
                backBtn.classList.add("pushy-button", "mini");
                backBtn.textContent = "Back";
                backBtn.onclick = () => this.focusRune();
                this.data.details.buttons.append(backBtn);
            }
        }
            

        if (this.mode == "scrap") { 
            if (typeof(index) == "number") {
                let rune = index >= 0 ? game.runes[index] : game.runeEquip[-1 - index];
                let tPos = this.targets.indexOf(index);
                if (tPos < 0) {
                    this.targets.push(index);
                    this.targets.sum = D.add(this.targets.sum ?? 0, getRuneScraps(rune));
                } else {
                    this.targets.splice(tPos, 1);
                    this.targets.sum = D.sub(this.targets.sum ?? 0, getRuneScraps(rune));
                }
            }

            let scrapBtn = document.createElement("button");
            scrapBtn.classList.add("pushy-button");
            let scrapTitle = document.createElement("div");
            scrapTitle.textContent = "Scrap";
            scrapTitle.style.fontWeight = "bold";
            scrapBtn.append(scrapTitle);
            scrapBtn.append("+" + format(this.targets.sum ?? 0) + " Scraps");
            scrapBtn.disabled = this.targets.length < 1;
            scrapBtn.onclick = () => {
                this.targets.sort((a, b) => Math.abs(b) - Math.abs(a));
                let newRune, shouldEquip;
                for (let target of this.targets) {
                    if (target < 0) {
                        if (!newRune) newRune = game.runeEquip[-1 - target];
                        game.runeEquip.splice(-1 - target, 1);
                    } else {
                        if (!newRune) newRune = game.runes[target];
                        game.runes.splice(target, 1);
                    }
                }
                game.scraps = D.add(game.scraps, this.targets.sum);
                this.targets = [];
                this.updateData();
                if (shouldEquip) updateRuneStats();
                this.focusRune();
            }
            this.data.details.buttons.append(scrapBtn);

            let backBtn = document.createElement("button");
            backBtn.classList.add("pushy-button", "mini");
            backBtn.textContent = "Cancel";
            backBtn.onclick = () => {
                this.mode = "";
                this.focusRune();
                this.updateData();
            }
            this.data.details.buttons.append(backBtn);

            this.updateData();
        } else if (this.mode == "merge") { 
            if (typeof(index) == "number") {
                let tPos = this.targets.indexOf(index);
                if (tPos < 0) {
                    if (this.targets.length < 5) {
                        this.targets.push(index);
                    }
                } else {
                    this.targets.splice(tPos, 1);
                }
            }

            let scrapBtn = document.createElement("button");
            scrapBtn.classList.add("pushy-button");
            let scrapTitle = document.createElement("div");
            scrapTitle.textContent = "Merge";
            scrapTitle.style.fontWeight = "bold";
            scrapBtn.append(scrapTitle);
            scrapBtn.append(this.targets.length + " / " + 5);
            scrapBtn.disabled = this.targets.length < 5;
            scrapBtn.onclick = () => {
                this.targets.sort((a, b) => Math.abs(b) - Math.abs(a));
                let newRune, shouldEquip;
                for (let target of this.targets) {
                    if (target < 0) {
                        if (!newRune) newRune = game.runeEquip[-1 - target];
                        game.runeEquip.splice(-1 - target, 1);
                        shouldEquip = true;
                    } else {
                        if (!newRune) newRune = game.runes[target];
                        game.runes.splice(target, 1);

                    }
                }
                newRune.level = D.add(newRune.level, 1);
                newRune.stats = generateRune(newRune.tier).stats;
                game[shouldEquip ? "runeEquip" : "runes"].push(newRune);
                this.targets = [];
                this.updateData();
                if (shouldEquip) updateRuneStats();
                this.focusRune();
            }
            this.data.details.buttons.append(scrapBtn);

            let backBtn = document.createElement("button");
            backBtn.classList.add("pushy-button", "mini");
            backBtn.textContent = "Cancel";
            backBtn.onclick = () => {
                this.mode = "";
                this.focusRune();
                this.updateData();
            }
            this.data.details.buttons.append(backBtn);

            this.updateData();
        } else {
            this.targets = [...typeof(index) == "number" ? [index] : []];
            this.updateData();
        }
    },
    onEnd() {
        this.data = null;
    }
}