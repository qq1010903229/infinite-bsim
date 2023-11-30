let tabs = {};
let tabButtons = {};
let currentTab = "";
let extraButtons;
let bodyScrollbar;
let containerScrollbar;

function initTabs() {
    for (let tab in tabs) {
        let button = document.createElement("button");
        button.textContent = tabs[tab].name;
        button.onclick = () => loadTab(currentTab == tab ? "" : tab);
        tabButtons[tab] = button;
        tabContainer.append(button);
    }

    containerScrollbar = createHorizontalScrollbar(container);
    window.addEventListener("resize", containerScrollbar.update);

    bodyScrollbar = createWindowScrollbar(window);
    bodyScrollbar.classList.add("body-scroll-bar");
    document.body.insertBefore(bodyScrollbar, tabContainer);
    window.addEventListener("resize", bodyScrollbar.update);

    makeExtraButtons();
    updateTabVisibility();
}

function updateTabVisibility() {
    for (let tab in tabs) {
        tabButtons[tab].style.display = tabs[tab].condition() ? "" : "none";
    }

    loadTab(game.currentTab);
}

function loadTab(tab) {
    tabs[currentTab]?.onEnd?.();
    tabButtons[currentTab]?.classList.remove("active");
    container.textContent = "";

    game.currentTab = currentTab = tab;

    tabs[tab]?.onStart?.();
    tabButtons[tab]?.classList.add("active");
    let tabBtn = tabButtons[tab];
    if (tabBtn) {
        tabBtn.parentNode.insertBefore(container, tabBtn.nextSibling);
        tabBtn.parentNode.insertBefore(containerScrollbar, container.nextSibling);
    }

    container.scrollIntoView({behavior: "smooth", block: "center"});
    bodyScrollbar.update();
    containerScrollbar.update();
}

function makeExtraButtons() {
    extraButtons = document.createElement("div");
    extraButtons.classList.add("bottom-buttons");

    let statsBtn = document.createElement("button");
    statsBtn.classList.add("pushy-button", "mini");
    statsBtn.textContent = "Statistics";
    statsBtn.onclick = () => {
        showOverlay("stats");
        statsBtn.blur();
    }
    extraButtons.append(statsBtn);

    let optionsBtn = document.createElement("button");
    optionsBtn.classList.add("pushy-button", "mini");
    optionsBtn.textContent = "Options";
    optionsBtn.onclick = () => {
        showOverlay("options");
        optionsBtn.blur();
    }
    extraButtons.append(optionsBtn);
}