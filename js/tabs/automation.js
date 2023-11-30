tabs.automation = {
    name: "Automation",
    condition: () => game.unlocks["atm1"],

    data: null,

    onStart() {
        this.data = {};
        this.data.rows = [];

        let moneyRow = createRow();
        moneyRow.name.textContent = "Money";
        this.data.money = moneyRow;
        container.append(moneyRow);

        if (game.unlocks.atm4a) {
            let odometer = document.createElement("div");
            odometer.classList.add("charger-odometer");
            moneyRow.append(odometer);
            moneyRow.odometer = odometer;

            let wheelBox = document.createElement("div");
            wheelBox.classList.add("wheels");
            odometer.append(wheelBox);
            odometer.wheelBox = wheelBox;

            odometer.wheels = [];

            for (let a = 0; a < 8; a++) {
                if (a == 2 || a == 5) {
                    let label = document.createElement("div");
                    label.classList.add("label")
                    label.textContent = a == 2 ? "." : ",";
                    odometer.wheelBox.append(label);
                }

                let wheel = document.createElement("div");
                odometer.wheelBox.append(wheel);
                odometer.wheels.push(wheel);

                let digit1 = document.createElement("div");
                wheel.append(digit1);
                wheel.digit1 = digit1;

                let digit2 = document.createElement("div");
                wheel.append(digit2);
                wheel.digit2 = digit2;
            }

            let label = document.createElement("b");
            label.textContent = "Mpx"
            odometer.append(label);
            odometer.label = label;
        }

        let charger = document.createElement("div");
        charger.classList.add("charger");
        charger.style.setProperty("--background", "#cc0");
        charger.onpointerdown = (ev) => this.doCharger(charger, ev);
        charger.onscroll = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
        charger.items = [];
        moneyRow.append(charger);

        moneyRow.append(extraButtons);

        let chargeRow = createRow();
        chargeRow.name.textContent = "Charge";
        this.data.charge = chargeRow;
        container.append(chargeRow);

        let autoRow = createRow();
        autoRow.classList.add("auto-list");
        autoRow.amount.textContent = "Automators";
        autoRow.items = [];
        this.data.auto = autoRow;
        container.append(autoRow);

        container.append(autoRow.bar = createScrollbar(autoRow));

        if (game.unlocks.atm3a) {
            let panel = document.createElement("div");
            panel.classList.add("auto-panel");
            autoRow.append(panel);
            autoRow.panel = panel;

            let eta = document.createElement("div");
            panel.append(eta);
            panel.eta = eta;

            let slider = document.createElement("input");
            slider.type = "range";
            slider.min = 0;
            slider.max = 1;
            slider.value = +game.autoActive;
            slider.oninput = ev => {
                game.autoActive = !!+slider.value;
                updateAutomationStats();
            }
            panel.append(slider);
            container.slider = slider;
        }

        chargeNotes = [1, -5, -5];

        this.updateCharger(charger);
        this.onTick();
    },
    doCharger(charger, ev) {
        let pos = ev.clientY;
        let tTime = performance.now();

        function drag(ev) {
            if (!(ev.buttons & 1)) {
                end();
                return;
            }

            let pDelta = ev.clientY - pos;
            pos += pDelta;
            let tDelta = performance.now() - tTime;
            tTime += tDelta;
            tDelta /= 1000;

            charger.style.setProperty("--delta", (+charger.style.getPropertyValue("--delta") || 0) + pDelta);
            doChargerDrag(pDelta, tDelta);
            tabs.automation.updateCharger(charger);
        }

        function end(ev) {
            document.body.removeEventListener("pointermove", drag);
            document.body.removeEventListener("pointerup", end);
        }

        document.body.addEventListener("pointermove", drag);
        document.body.addEventListener("pointerup", end);
    },
    updateCharger(charger) {
        if (chargeNotes[0] > 0) {
            charger.style.setProperty("--note", '"Drag this panel" "\\A" "forward or backward" "\\A" "to find charges."');
            charger.style.setProperty("--note-alpha", chargeNotes[0]);
        } else if (chargeNotes[1] > 0) {
            charger.style.setProperty("--note", '"Please drag in" "\\A" "one direction only."');
            charger.style.setProperty("--note-alpha", chargeNotes[1]);
        } else if (chargeNotes[2] > 0) {
            charger.style.setProperty("--note", '"Max height reached." "\\A" "Please colllect excessive" "\\A" "charge in the charger."');
            charger.style.setProperty("--note-alpha", chargeNotes[2]);
        } else {
            charger.style.setProperty("--note", null);
            charger.style.setProperty("--note-alpha", null);
        }

        while (game.charges.length > charger.items.length) {
            let button = document.createElement("button");
            button.classList.add("pushy-button", "charge");
            button.onclick = () => {
                clickCharge(button.pos);
                button.remove();
                charger.items.splice(charger.items.indexOf(button), 1);
                this.updateCharger(charger);
            }
            charger.append(button);
            charger.items.push(button);
        }
        while (game.charges.length < charger.items.length) {
            charger.items.pop().remove();
        }
        for (let a = 0; a < game.charges.length; a++) {
            let data = game.charges[a];
            let button = charger.items[a];
            button.pos = a;
            button.setAttribute("type", data.type);
            button.style.setProperty("--x", data.x);
            button.style.setProperty("--y", data.y);
        }
    },
    onTick() {
        this.data.money.amount.textContent = format(game.money);
    
        if (this.data.money.odometer) {
            let odo = this.data.money.odometer;
            let rollover = game.stats.chargerDist / 1e4 % 1;
            for (let a = 0; a < odo.wheels.length; a++) {
                let number = Math.floor(game.stats.chargerDist / (1e4 * 10 ** a) % 10);
                odo.wheels[a].digit1.textContent = number;
                odo.wheels[a].digit2.textContent = (number + 1) % 10;
                odo.wheels[a].style.setProperty("--rollover", rollover);
                if (number < 9) rollover = null;
            }
        } else {
            this.data.money.rate.textContent = "+" + format(temp.moneySpeed) + "/s";
        }

        this.data.charge.amount.textContent = format(game.charge);
        this.data.charge.rate.textContent = "−" + format(temp.chargeConsumption) + "/s";

        if (this.data.auto.panel) {
            let eta = D.div(game.charge, temp.chargeConsumption)
            this.data.auto.panel.eta.textContent = D.gt(temp.chargeConsumption, 0) ?
                D.lte(eta, 0) ? "Automators halted - No charge" : format.time(eta.toNumber()) + " until no charge" :
                "Automators inactive";

        }

        let chargeUpgList = Object.keys(chargerUpgrades);
        
        {
            let row = this.data.charge;
            while (row.items.length < chargeUpgList.length) {
                let button = document.createElement("button");
                button.classList.add("pushy-button", "upgrade");
                button.tabIndex = -1;
                button.onclick = ev => {
                    buyChargerUpgrade(button.target);
                    let upgrade = chargerUpgrades[button.target];
                    let level = game.chargerUpg[button.target] ?? 0;
                    button.disabled = D.lt(game.charge, upgrade.costAmount(level));
                    button.blur();
                }
                row.append(button);
                row.items.push(button);

                let effect = document.createElement("div");
                button.append(effect);
                button.effect = effect;

                let cost = document.createElement("div");
                cost.style.marginTop = "4px";
                button.append(cost);
                button.cost = cost;
            }

            for (let b = 0; b < chargeUpgList.length; b++) {
                let button = row.items[b];
                button.target = chargeUpgList[b];
                let upgrade = chargerUpgrades[button.target];
                let level = game.chargerUpg[button.target] ?? 0;
                let cost = upgrade.costAmount(level);
                button.disabled = D.lt(game.charge, cost);
                button.effect.textContent = "";
                button.effect.append(
                    upgrade.effectText[0].replace("{0}", format(upgrade.effectAmount(level), upgrade.effectPrecision)) + 
                        " → " + upgrade.effectText[0].replace("{0}", format(upgrade.effectAmount(D.add(1, level)), upgrade.effectPrecision)),
                    document.createElement("br"),
                    upgrade.effectText[1],
                );
                button.cost.textContent = "−" + format(cost) + " Charge";
            }
        }

        let automatorList = Object.keys(automators).filter(x => !automators[x].requires || game.unlocks[automators[x].requires]);
        
        {
            let row = this.data.auto;
            while (row.items.length < automatorList.length) {
                let container = document.createElement("div");
                container.classList.add("auto-item");
                row.append(container);
                row.items.push(container);

                let info = document.createElement("div");
                container.append(info);
                container.infoBox = info;

                let title = document.createElement("b");
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
                slider.min = -1;
                slider.oninput = ev => {
                    let data = game.automators[container.target];
                    if (!data) data = game.automators[container.target] = {};
                    data.active = D.min(slider.value, data.level ?? 0).max(-1);
                    updateAutomationStats();
                }
                info.append(slider);
                container.slider = slider;
                
                let upgBtn = document.createElement("button");
                upgBtn.classList.add("pushy-button");
                upgBtn.tabIndex = -1;
                upgBtn.onclick = ev => {
                    upgradeAutomator(container.target);
                    let data = automators[container.target];
                    let level = game.automators[container.target]?.level ?? 0;
                    upgBtn.disabled = D.lt(game.charge, data.levelCost(level));
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

                let configBtn = document.createElement("button");
                configBtn.classList.add("config-button");
                configBtn.onclick = () => {
                    if (container.configs) {
                        container.configs.remove();
                        delete container.configs;
                    } else {
                        if (automators[container.target].configs) {
                            let cfgBox = document.createElement("div");
                            cfgBox.classList.add("config-box");
                            container.insertBefore(cfgBox, configBtn);
                            container.configs = cfgBox;
                            automators[container.target].configs.start(cfgBox);
                            automators[container.target].configs.update(cfgBox);
                        }
                    }
                    this.data.auto.bar.update();
                }
                container.append(configBtn);
                container.configBtn = cost;
            }

            for (let b = 0; b < automatorList.length; b++) {
                let div = row.items[b];
                div.target = automatorList[b];
                let data = automators[div.target];
                let level = game.automators[div.target]?.level ?? 0;
                let active = game.automators[div.target]?.active ?? -1;
                let cost = data.levelCost(level);

                div.titleBox.textContent = data.title;

                div.speed.textContent = format(D.gte(active, 0) ? data.speed(active) : 0, data.speedPrecision) + "/s";
                div.consumption.textContent = D.gte(active, 0) ? "×" + format(data.consumption(active)) + " consumption factor" : "Inactive";

                div.slider.max = D(level).toNumber();
                div.slider.value = D(active).toNumber();

                div.button.disabled = D.lt(game.charge, cost);
                div.cost.textContent = "−" + format(cost) + " Charge";

                if (game.unlocks.atm2a && data.configs) div.classList.add("has-config");

                if (div.configs) data.configs.update(div.configs);
            }
        }
    },
    onEnd() {
        this.data = null;
    }
}