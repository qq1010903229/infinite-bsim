let overlays = {};

function showOverlay(name, ...args) {
    let overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.append(overlay);

    overlays[name].create(overlay, ...args);

    return overlay;
} 