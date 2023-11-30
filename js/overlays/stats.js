overlays.stats = {
    create(overlay) {
        let holder = document.createElement("div");
        overlay.append(holder);

        let title = document.createElement("div");
        title.classList.add("title");
        title.textContent = "Statistics";
        holder.append(title);

        let closebtn = document.createElement("button");
        closebtn.classList.add("close");
        closebtn.onclick = () => overlay.remove();
        title.append(closebtn);


        let tablist = document.createElement("div");
        tablist.classList.add("tab-list");
        holder.append(tablist);

        let activeButton = null;

        for (let tab in this.tabs) {
            let data = this.tabs[tab];
            let button = document.createElement("button");
            button.textContent = data.title;
            button.onclick = () => {
                content.textContent = "";
                data.create(content);
                activeButton?.classList.remove("active");
                button.classList.add("active");
                activeButton = button;
            };
            tablist.append(button);
        }

        let content = document.createElement("div");
        content.classList.add("content");
        content.textContent = "Options go here";
        holder.append(content);

        tablist.firstElementChild.click();
    },
    tabs: {
        summary: {
            title: "Summary",
            create(content) {
                let statbox = document.createElement("div");
                content.append(statbox);

                function makeStatEntry(name, value) {
                    let entry = document.createElement("label");
                    entry.classList.add("stat-entry");
                    statbox.append(entry);
        
                    let namebox = document.createElement("div");
                    namebox.textContent = name;
                    entry.append(namebox);
        
                    let valuebox = document.createElement("b");
                    valuebox.textContent = value;
                    entry.append(valuebox);
                }
    
                {
                    makeStatEntry("Time played:", format.time(game.stats.timePlayed));
                    let unlockCount = Object.values(game.unlocks).reduce((x, y) => x + !!y, 0), unlockLength = Object.keys(unlocks).length;
                    makeStatEntry("Unlock completion:", format.comma(unlockCount / unlockLength * 100) + "% (" + format.comma(unlockCount) + " / " + format.comma(unlockLength) + ")");
                    makeStatEntry("Skill level:", format(temp.skillLevel));
                    makeStatEntry("Manual button presses:", format.comma(game.stats.presses));
                }
                if (game.unlocks.rne1) {
                    makeStatEntry("Runes bought:", format.comma(game.stats.runeBought));
                }
                if (game.unlocks.atm1) {
                    makeStatEntry("Charger distance travelled:", format.comma(game.stats.chargerDist / 1e6, 2) + " Mpx");
                    makeStatEntry("Charge blocks collected:", format.comma(game.stats.chargeClick));
                }
                if (game.unlocks.sig1) {
                    makeStatEntry("Sigils forged:", format.comma(game.stats.sigilForged));
                }
    

                let actionDiv = document.createElement("div");
                actionDiv.classList.add("action-list");
                content.append(actionDiv);
                
                let copyBtn = document.createElement("button");
                copyBtn.classList.add("pushy-button", "mini");
                copyBtn.textContent = "Copy summary";
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(statbox.innerText).then(() => {
                        showOverlay("popup", "Copied summary", "Summary copied to clipboard!", ["Ok"]);
                    });
                }
                actionDiv.append(copyBtn);
                
            }
        },
        unlocks: {
            title: "Bought Unlocks",
            create(content) {
                function makeStatEntry(name, value) {
                    let entry = document.createElement("label");
                    entry.classList.add("stat-entry");
                    content.append(entry);
        
                    let namebox = document.createElement("div");
                    namebox.textContent = name;
                    entry.append(namebox);
        
                    let valuebox = document.createElement("div");
                    valuebox.textContent = value;
                    entry.append(valuebox);
                }
    
                for (let unl in unlocks) if (game.unlocks[unl])
                    makeStatEntry(unlocks[unl].desc(), "(" + unlocks[unl].conDisplay() + ")");
    
            }
        },
    }
}