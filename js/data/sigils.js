function getSigilCost() {
    return D(50);
}

let sigilTime = Date.now();

function forgeSigil(cooldown = 200, amount = 1) {
    let cost = getSigilCost();
    let time = Date.now();
    if (D.gte(game.scraps, cost) && time - sigilTime >= cooldown) {
        let bulk = D.div(game.scraps, cost).floor().min(amount);
        game.scraps = D.sub(game.scraps, D.mul(cost, bulk));
		if(bulk.gte(5000)){
			while (game.sigils.length <= 9) game.sigils.push(D(0));
			game.stats.sigilForged=Math.min(game.stats.sigilForged+D(bulk).toNumber(),1e300);
			for(let a = 9;a >= 0;a--){
				let add = bulk.div(Math.pow(Math.E,a)).floor();
				bulk = bulk.sub(add);
				game.sigils[a] = D.add(game.sigils[a], add);
			}
			sigilTime = time;
			updateSigilEffects();
			return;
		}
        let rarity = Math.min(Math.floor(Math.log(1 / (1 - Math.random()))), 9);
        while (game.sigils.length <= rarity) game.sigils.push(D(0));
        game.sigils[rarity] = D.add(game.sigils[rarity], bulk);
		game.stats.sigilForged=Math.min(game.stats.sigilForged+D(bulk).toNumber(),1e300);
        sigilTime = time;
        updateSigilEffects();
    }
}

function getSigilMult(){
	let mult = (temp.tokenUpgEffects.ext1?.sigil_gen ?? 1);
	if(game.unlocks.col20)mult = mult.mul(D(game.collapsed).add(1).pow(game.unlocks.col24?20:5));
	return mult;
}