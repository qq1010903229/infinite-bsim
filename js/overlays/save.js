overlays.save = {
    create(overlay) {
        let holder = document.createElement("div");
        overlay.append(holder);

        let titleBox = document.createElement("div");
        titleBox.classList.add("title");
        titleBox.textContent = "Data Manipulation";
        holder.append(titleBox);

        let closebtn = document.createElement("button");
        closebtn.classList.add("close");
        closebtn.onclick = () => overlay.remove();
        titleBox.append(closebtn);

        let content = document.createElement("div");
        content.classList.add("content");
        holder.append(content);
        content.append(
            "This text box below contains your save file. Keep it somewhere safe.",
            document.createElement("br"),
            "Alternatively, paste your save data into the box for the \"Import Save\" option to appear."
        );

        let saveText = document.createElement("textarea");
        saveText.classList.add("save-box");
        saveText.value = btoa(encodeURIComponent(JSON.stringify(game)));
        saveText.onfocus = () => saveText.select();
        saveText.oninput = () => {
            exportToClipBtn.style.display = "none";
            exportToFileBtn.style.display = "none";
            importBtn.style.display = "";
        }
        content.append(saveText);


        let importActions = document.createElement("div");
        importActions.classList.add("action-list");
        content.append(importActions);

        let importFromClipBtn = document.createElement("button");
        importFromClipBtn.classList.add("pushy-button", "mini");
        importFromClipBtn.innerText = "Import from Clipboard";
        importFromClipBtn.onclick = () => {
            showOverlay("popup", "Import from Clipboard", 
                "Please paste the save on your clipboard to the big text box above the button. " + 
                "(click on the text box then press Ctrl and V at the same time on your keyboard or right click / long press on mobile and select the \"Paste\" option)",
                ["Ok"]);
        }
        importActions.append(importFromClipBtn);

        let importFromFileBtn = document.createElement("button");
        importFromFileBtn.classList.add("pushy-button", "mini");
        importFromFileBtn.innerText = "Import from File";
        importFromFileBtn.onclick = () => {
            let file = document.createElement("input");
            file.type = "file";
            file.accept = ".ibss";

            file.onchange = (e) => {
                file.files[0]?.text().then(x => {
                    saveText.value = x;
                    saveText.oninput();
                })
            }

            file.click();
        }
        importActions.append(importFromFileBtn);


        let exportActions = document.createElement("div");
        exportActions.classList.add("action-list");
        content.append(exportActions);

        let exportToClipBtn = document.createElement("button");
        exportToClipBtn.classList.add("pushy-button", "mini");
        exportToClipBtn.textContent = "Export to Clipboard";
        exportToClipBtn.onclick = () => {
            navigator.clipboard.writeText(saveText.value).then(() => {
                showOverlay("popup", "Game Exported", "Save exported to clipboard!", ["Ok"]);
            }).catch(() => {
                showOverlay("popup", "Export Unsuccessful", 
                    "Couldn't copy your save into clipboard. Try again, or use the \"Export to File\" option.",
                    ["Ok"]);
            })
            exportToClipBtn.blur();
        }
        exportActions.append(exportToClipBtn);

        let exportToFileBtn = document.createElement("button");
        exportToFileBtn.classList.add("pushy-button", "mini");
        exportToFileBtn.textContent = "Export to File";
        exportToFileBtn.onclick = () => {
            let a = document.createElement("a");
            a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(saveText.value);
            a.download = +Date.now() + ".ibss";
            a.click();
            showOverlay("popup", "Game Exported", "Save exported to \"" + a.download + "\".", ["Ok"]);
            exportToFileBtn.blur();
        }
        exportActions.append(exportToFileBtn);

        let importBtn = document.createElement("button");
        importBtn.classList.add("pushy-button", "mini");
        importBtn.textContent = "Import Save";
        importBtn.style.display = "none";
        importBtn.onclick = () => {
            let importData = null;
            try {
                importData = JSON.parse(decodeURIComponent(atob(saveText.value)));
                importData = deepCopy(importData, getStartGame());
            } catch {
                showOverlay("popup", "Invalid Save", 
                    "This save appears to be incorrect or corrupted. " +
                    "Make sure you have copied the entire save string and the save string is not truncated.", ["Ok"]);
                return;
            }

            let desc = document.createElement("div");
            desc.textContent = "Do you want to import this save? This will override the current save!";

            desc.append(document.createElement("br"));
            desc.append(document.createElement("br"));

            function makeStatEntry(name, value) {
                let entry = document.createElement("label");
                entry.classList.add("stat-entry");
                desc.append(entry);
    
                let namebox = document.createElement("div");
                namebox.textContent = name;
                entry.append(namebox);
    
                let valuebox = document.createElement("b");
                valuebox.textContent = value;
                entry.append(valuebox);
            }

            makeStatEntry("Time played:", format.time(importData.stats.timePlayed));
            makeStatEntry("Unlock completion:", format.comma(Object.values(importData.unlocks).reduce((x, y) => x + !!y, 0) / Object.keys(unlocks).length * 100) + "%");

            desc.append(document.createElement("br"));

            let wipeOpts = document.createElement("input");
            wipeOpts.id = Math.random();
            wipeOpts.type = "checkbox";
            wipeOpts.classList.add("inline-checkbox");
            desc.append(wipeOpts);

            let wipeOptsLabel = document.createElement("label");
            wipeOptsLabel.htmlFor = wipeOpts.id;
            wipeOptsLabel.textContent = "Also override options with those from imported save";
            desc.append(wipeOptsLabel);

            showOverlay("popup", "Import Save?", desc, ["Yes", "No"], x => {
                if (x == 0) {
                    if (!wipeOpts.checked) importData.options = {...game.options};
                    game.options.autoSave = false;
                    localStorage.setItem("ibsim", btoa(encodeURIComponent(JSON.stringify(importData))));
                    window.location.reload();
                }
            });
        }
        exportActions.append(importBtn);
    },
}