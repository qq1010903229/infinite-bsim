overlays.options = {
    create(overlay) {
        let holder = document.createElement("div");
        overlay.append(holder);

        let title = document.createElement("div");
        title.classList.add("title");
        title.textContent = "Options";
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
    make: {
        action(name, desc, action, onclick) {
            let entry = document.createElement("div");
            entry.classList.add("option-entry");

            let infobox = document.createElement("div");
            entry.append(infobox);

            let namebox = document.createElement("b");
            namebox.textContent = name;
            infobox.append(namebox);

            let descbox = document.createElement("div");
            descbox.textContent = desc;
            infobox.append(descbox);

            let controlbox = document.createElement("div");
            entry.append(controlbox);

            let button = document.createElement("button");
            button.classList.add("pushy-button", "mini");
            button.textContent = action;
            button.onclick = () => {
                onclick();
                button.blur();
            }
            controlbox.append(button);

            return entry;
        },
        checkbox(name, desc, target, onchange) {
            let entry = document.createElement("label");
            entry.classList.add("option-entry");

            let infobox = document.createElement("div");
            entry.append(infobox);

            let namebox = document.createElement("b");
            namebox.textContent = name;
            infobox.append(namebox);

            let descbox = document.createElement("div");
            descbox.textContent = desc;
            infobox.append(descbox);

            let controlbox = document.createElement("div");
            entry.append(controlbox);

            let input = document.createElement("input");
            input.id = Math.random();
            input.type = "checkbox";
            input.checked = game.options[target];
            input.oninput = () => {
                game.options[target] = input.checked;
                onchange?.();
                input.blur();
            }
            controlbox.append(input);
            
            entry.htmlFor = input.id;

            return entry;
        },
        list(name, desc, target, items, onchange) {
            let entry = document.createElement("div");
            entry.classList.add("option-entry");

            let infobox = document.createElement("div");
            entry.append(infobox);

            let namebox = document.createElement("b");
            namebox.textContent = name;
            infobox.append(namebox);

            let descbox = document.createElement("div");
            descbox.textContent = desc;
            infobox.append(descbox);

            let controlbox = document.createElement("div");
            entry.append(controlbox);

            let button = document.createElement("button");
            button.classList.add("dropdown-button");
            button.textContent = items[game.options[target]] ?? "Choose...";
            button.onclick = () => {
                let list = document.createElement("div");
                list.classList.add("dropdown-list");
                document.body.append(list);

                let rect = button.getBoundingClientRect();
                list.style.top = rect.bottom + "px";
                list.style.left = rect.left + "px";
                list.style.minWidth = rect.width - 2 + "px";
                

                for (let item in items) {
                    let opt = document.createElement("button");
                    opt.textContent = items[item];
                    if (game.options[target] == item) opt.classList.add("active");
                    opt.onclick = () => {
                        button.textContent = items[game.options[target] = item];
                        onchange?.();
                        close();
                    }
                    list.append(opt);
                }

                function check(ev) {
                    if (!list.contains(ev.target)) close();
                }
                function wheel(ev) {
                    if (!list.contains(ev.target) || list.scrollHeight <= list.clientHeight) ev.preventDefault();
                }


                function close() {
                    list.remove();
                    document.body.removeEventListener("pointerdown", check);
                    document.body.removeEventListener("wheel", wheel);
                }
    
                button.blur();
                document.body.addEventListener("pointerdown", check);
                document.body.addEventListener("wheel", wheel, { passive: false });
            }
            controlbox.append(button);

            return entry;
        },
    },
    tabs: {
        Gameplay: {
            title: "Gameplay",
            create(content) {
                content.append(overlays.options.make.list(
                    "Tick Rate",
                    "How often the game logic updates. Larger values may cause performance issues. \"Auto\" uses your browser's preferred update rate.",
                    "tickRate",
                    { 0: "Auto", 1: "1 TPS", 2: "2 TPS", 5: "5 TPS", 10: "10 TPS", 20: "20 TPS", 30: "30 TPS", 60: "60 TPS", 1e60: "As fast as possible" }
                ));
            }
        },
        display: {
            title: "Display",
            create(content) {
                cat = document.createElement("h3");
                cat.textContent = "Formatting";
                content.append(cat);

                content.append(overlays.options.make.checkbox(
                    "Force Scientific Notation",
                    "Always use scientific notation even on supported numbers.",
                    "forceSci",
                    () => { allDirty = true; }
                ));

                cat = document.createElement("h3");
                cat.textContent = "Aesthetics";
                content.append(cat);

                content.append(overlays.options.make.checkbox(
                    "Pixelated Text",
                    "Use pixelated fonts for in-game text. Note: Some text might become blurry due to implementation limitations.",
                    "pixelText",
                    () => { updateStyles(); }
                ));
            }
        },
        storage: {
            title: "Storage",
            create(content) {
                let cat;

                cat = document.createElement("h3");
                cat.textContent = "Storage options";
                content.append(cat);

                content.append(overlays.options.make.checkbox(
                    "Auto-Save",
                    "The game will save itself every once in a while or when you close this page.",
                    "autoSave",
                ));
                
                let persistBox;
                content.append(persistBox = overlays.options.make.checkbox(
                    "Persistent Storage",
                    "Use the browser's persistent storage, which is less prune to browser data eviction. May require additional user confirmation.",
                    false,
                    () => {
                        let box = persistBox.querySelector("input");
                        if (box.checked) {
                            box.checked = false;
                            navigator.storage.persist().then(x => {
                                box.checked = x;
                                if (!box.checked) showOverlay("popup", "Request Unsuccessful", 
                                    "Your browser seems to be blocking the game from using persistent storage. " +
                                    "Check your browser's permissions for this website and try again.", ["Ok"])
                            });
                        } else {
                            box.checked = true;
                            showOverlay("popup", "Disable Persistent Storage", 
                                "Persistent storage can not be turned off using this panel. " +
                                "Please use your browser's settings to disable persistent storage for the game. " +
                                "Note that your browser may require all data on this website to be deleted in order to disable persistent storage, so creating a backup first is recommended.", ["Ok"])
                        }
                    }
                ));
                
                navigator.storage.persisted().then(x => persistBox.querySelector("input").checked = x);

                cat = document.createElement("h3");
                cat.textContent = "Storage actions";
                content.append(cat);

                content.append(overlays.options.make.action(
                    "Manual Save",
                    "Manually save the game.",
                    "Save Game",
                    () => {
                        save();
                        showOverlay("popup", "Game Saved", "It is now safe to close this game.", ["Ok"])
                    }
                ));

                content.append(overlays.options.make.action(
                    "Data Manipulation",
                    "Perform backup actions with your save file.",
                    "Import / Export Save",
                    () => {
                        showOverlay("save");
                    }
                ));

                content.append(overlays.options.make.action(
                    "Hard Reset",
                    "Start all over from the beginning.",
                    "Delete Save",
                    () => {
                        let desc = document.createElement("div");
                        desc.textContent = "Are you sure you want to delete your save data? " + 
                            "The game will export your save into the clipboard in case you decide to undo this change later on.";

                        
                        desc.append(document.createElement("br"));

                        let wipeOpts = document.createElement("input");
                        wipeOpts.id = Math.random();
                        wipeOpts.type = "checkbox";
                        wipeOpts.classList.add("inline-checkbox");
                        desc.append(wipeOpts);

                        let wipeOptsLabel = document.createElement("label");
                        wipeOptsLabel.htmlFor = wipeOpts.id;
                        wipeOptsLabel.textContent = "Also reset options";
                        desc.append(wipeOptsLabel);


                        showOverlay("popup", "Hard Reset?", desc, ["Yes", "No"], x => { if (!x) hardReset(wipeOpts.checked); });
                    }
                ));
            }
        },
        about: {
            title: "About",
            create(content) {
                let titleBox = document.createElement("div");
                titleBox.classList.add("title-box");
                content.append(titleBox);

                let title = document.createElement("h2");
                title.textContent = "Infinite Button Simulator";
                titleBox.append(title);

                let versionBox = document.createElement("div");
                versionBox.textContent = "Version " + VERSION;
                titleBox.append(versionBox);

                let textBox = document.createElement("div");
                textBox.style.textAlign = "center";
                textBox.style.paddingBlock = "8px 4px";
                content.append(textBox);

                function linkify(text, href) {
                    let link = document.createElement("a");
                    link.textContent = text;
                    link.href = href;
                    link.target = "_blank";
                    textBox.append(link);
                }

                textBox.innerHTML += `
                    Made by ducdat0507<br/>
                    <a href="https://ducdat0507.github.io" target="_blank">Check out my homepage!</a><br/>
                    <br/>
                    Inspired by <a href="https://www.roblox.com/discover/?Keyword=button%20simulator" target="_blank">all those button simulator games on Roblox</a><br/>
                    as well as <a href="https://reinhardt-c.github.io/TrueInfinity/" target="_blank">Reinhardt's True Infinity</a>.<br/>
                    <br/>
                    This game uses <a href="https://naruyoko.github.io/OmegaNum.js/index.html" target="_blank">Naruyoko's OmegaNum.js</a>.<br/>
                    <br/>
                    If you're feeling extremely donatey, feel free to send money to<br/>
                    <a href="${getForbiddenString()}" target="_blank">this PayPal account</a> to help me make more ambitious projects.
                `
            }
        },
    }
}