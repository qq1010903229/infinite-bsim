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
        detailsInfo.classList.add("desc-info");
        moneyRow.descInfo = detailsInfo;
        moneyRow.append(detailsInfo);
        this.data.money = moneyRow;
        container.append(moneyRow);
        this.data.money.append(extraButtons);

        updateVisibleUnlocks();
        this.onTick();
    },
    onTick() {
        this.data.money.amount.textContent = format(game.collapsed);
		let tempHTML='<ul><li>×'+format(D(game.collapsed).pow(0.75).add(1).min(100),2)+' Automation Speed</li>';
		if(game.unlocks.col3){
			tempHTML+='<li>×'+format(D(game.collapsed).div(75).pow(2).add(1),2)+' Tokens</li>';
		}else{
			this.data.money.descInfo.innerHTML = tempHTML+'<li>Next at 100 Collapsed Layers</li></ul>';return;
		}
		if(game.unlocks.col4){
			tempHTML+='<li>×'+format(D(game.collapsed).div(10).pow(game.unlocks.col7?5:game.unlocks.col6?4:game.unlocks.col5?3:2).add(1),2)+' Sigil Automator Speed</li>';
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
        this.data.money.descInfo.innerHTML = tempHTML+'</ul>';
    },
    onEnd() {
        this.data = null;
    }
}