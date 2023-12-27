tabs.colboost = {
    name: "Collapse Boost",
    condition: () => game.unlocks["col2"],

    data: null,

    onStart() {
        this.data = {};
        this.data.rows = [];

        let moneyRow = createRow();
        moneyRow.name.textContent = "Collapsed Layers";
        let detailsInfo = document.createElement("div");
        moneyRow.classList.add("rune-details");
        detailsInfo.classList.add("desc-info");
        moneyRow.descInfo = detailsInfo;
        moneyRow.append(detailsInfo);
        this.data.money = moneyRow;
        container.append(moneyRow);
		
		if(game.unlocks.col19){
			moneyRow = createRow();
			moneyRow.name.textContent = "Collapsed Super Layers";
			detailsInfo = document.createElement("div");
			moneyRow.classList.add("rune-details");
			detailsInfo.classList.add("desc-info");
			moneyRow.descInfo = detailsInfo;
			moneyRow.append(detailsInfo);
			this.data.money2 = moneyRow;
			container.append(moneyRow);
		}

        updateVisibleUnlocks();
        this.onTick();
    },
    onTick() {
		
        if(!game.unlocks.col17)while (this.data.rows.length < game.super_ladder.length) {
            let row = createRow();
            container.append(row);
            this.data.rows.push(row);
        }
        let prevName = "Collapsed Layers";
        if(!game.unlocks.col17)for (let a = 0; a < game.super_ladder.length; a++) {
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
            let needsUpdate = allDirty || D.neq(multi, row.multi) || D.neq(row.items[0]?.tier ?? -1, offset);
            row.multi = multi;
            row.rate.textContent = "×" + format(row.multi);

            for (let b = 0; b < 8; b++) {
                let button = row.items[b];
                button.tier = D.add(offset, b);
                let cost = getSuperButtonCost(data.tier, button.tier);
				if (needsUpdate) {
                    button.gain.textContent = "+" + format(getSuperButtonGain(data.tier, button.tier).mul(row.multi)) + " " + name;
                    button.cost.textContent = "≥" + format(cost) + " " + prevName;
                    if (game.unlocks.btn9 && D(button.row).gt(0)) button.setAttribute("mark", "#(ω^2+ω×" + format(button.row) + "+" + format(button.tier.add(1))+")");
                    else if (game.unlocks.btn9) button.setAttribute("mark", "#(ω^2+" + format(button.tier.add(1))+")");
                    else if (game.unlocks.btn6) button.setAttribute("mark", "#" + format(button.tier.add(1)));
                }
                button.disabled = D.lt(a == 0 ? game.collapsed : game.super_ladder[a - 1].amount, cost);
            }

            prevName = name;
        }
		
        this.data.money.amount.textContent = format(game.collapsed);
		let tempHTML='<ul><li>×'+format(game.unlocks.col9?100:D(game.collapsed).pow(0.75).add(1).min(100),2)+' Automation Speed</li>';
		if(game.unlocks.col3){
			tempHTML+='<li>×'+format(D(game.collapsed).div(75).pow(2).add(1),2)+' Tokens</li>';
		}else{
			this.data.money.descInfo.innerHTML = tempHTML+'<li>Next at 100 Collapsed Layers</li></ul>';return;
		}
		if(game.unlocks.col19){
			// collapse boost removed
		}else if(game.unlocks.col4){
			tempHTML+='<li>×'+format(D(game.collapsed).div(10).pow(game.unlocks.col14?15:game.unlocks.col13?12:game.unlocks.col12?10:game.unlocks.col11?8:game.unlocks.col10?7:game.unlocks.col9?6:game.unlocks.col7?5:game.unlocks.col6?4:game.unlocks.col5?3:2).add(1),2)+' Sigil Automator Speed</li>';
		}else{
			this.data.money.descInfo.innerHTML = tempHTML+'<li>Next at 150 Collapsed Layers</li></ul>';return;
		}
		if(game.unlocks.col5){
			tempHTML+='<li>×'+format(D(game.collapsed).div(10).add(1))+' Glyph gain</li>';
		}else{
			this.data.money.descInfo.innerHTML = tempHTML+'<li>Next at 250 Collapsed Layers</li></ul>';return;
		}
		if(game.unlocks.col6){
			tempHTML+='<li>×'+format(D(game.collapsed).div(100).add(1),2)+' Charge gain</li>';
		}else{
			this.data.money.descInfo.innerHTML = tempHTML+'<li>Next at 350 Collapsed Layers</li></ul>';return;
		}
		if(game.unlocks.col7){
			tempHTML+='<li>×'+format(D(game.collapsed).div(300).add(1).pow(3))+' Gem gain</li>';
		}else{
			this.data.money.descInfo.innerHTML = tempHTML+'<li>Next at 500 Collapsed Layers</li></ul>';return;
		}
		if(game.unlocks.col8){
			tempHTML+='<li>Unlock Super Buttons</li>';
		}else{
			this.data.money.descInfo.innerHTML = tempHTML+'<li>Next at 600 Collapsed Layers</li></ul>';return;
		}
		if(game.unlocks.col15){
			tempHTML+='<li>Super Buttons won\'t reset anything</li>';
		}else if(game.unlocks.col10){
			tempHTML+='<li>Super-Multi won\'t reset anything</li>';
		}else{
			this.data.money.descInfo.innerHTML = tempHTML+'<li>Next at 900 Collapsed Layers</li></ul>';return;
		}
		if(game.unlocks.col11){
			tempHTML+='<li>Unlock Super-Multi Automator</li>';
		}else{
			this.data.money.descInfo.innerHTML = tempHTML+'<li>Next at 1000 Collapsed Layers</li></ul>';return;
		}
		
		if(game.unlocks.col18){
			tempHTML+='<li>-9 uncollapsed layers</li>';
		}else if(game.unlocks.col14){
			tempHTML+='<li>-6 uncollapsed layers</li>';
		}else if(game.unlocks.col13){
			tempHTML+='<li>-5 uncollapsed layers</li>';
		}else if(game.unlocks.col12){
			tempHTML+='<li>-3 uncollapsed layers</li>';
		}else{
			this.data.money.descInfo.innerHTML = tempHTML+'<li>Next at 1111 Collapsed Layers</li></ul>';return;
		}
		
		if(game.unlocks.col16){
			tempHTML+='<li>Unlock Super-Reset Automator</li>';
		}else if(game.unlocks.col15){
			this.data.money.descInfo.innerHTML = tempHTML+'<li>Next at 27,000 Collapsed Layers</li></ul>';return;
		}
		
		if(game.unlocks.col20){
			tempHTML+='<li>×'+format(D(game.collapsed).pow(5).add(1),2)+' Sigil Generating Speed</li>';
		}else if(game.unlocks.col19){
			this.data.money.descInfo.innerHTML = tempHTML+'<li>Next at 250,000 Collapsed Layers</li></ul>';return;
		}
		
        this.data.money.descInfo.innerHTML = tempHTML+'</ul>';
		
		if(game.unlocks.col19){
			this.data.money2.amount.textContent = format(game.scollapsed);
			let tempHTML='<ul><li>×'+format(D(game.scollapsed).pow(0.75).add(1).min(100),2)+' Automation Speed</li>';
			this.data.money2.descInfo.innerHTML = tempHTML+'</ul>';
		}
    },
    onEnd() {
        this.data = null;
    }
}