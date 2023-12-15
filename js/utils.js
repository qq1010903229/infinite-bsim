


function createRow() {
    let row = document.createElement("div");
    row.classList.add("button-row");
    row.items = [];

    let info = document.createElement("div");
    info.classList.add("info");
    row.info = info;
    row.append(info);

    let amount = document.createElement("b");
    amount.classList.add("amount");
    row.amount = amount;
    info.append(amount);

    info.append(" ");

    let name = document.createElement("span");
    name.classList.add("name");
    row.name = name;
    info.append(name);

    let rate = document.createElement("div");
    rate.classList.add("rate");
    row.rate = rate;
    info.append(rate);

    return row;
}

function createScrollbar(element) {
    let bar = document.createElement("div");
    bar.classList.add("scroll-bar");
    bar.items = [];

    let thumb = document.createElement("div");
    thumb.classList.add("thumb");
    thumb.addEventListener("pointerdown", (ev) => {
        let pos = ev.clientY;
        let base = element.scrollTop;
        let size = element.scrollHeight - element.clientHeight;
        let range = bar.clientHeight - thumb.offsetHeight;

        function drag(ev) {
            if (!(ev.buttons & 1)) end();
            else element.scrollTop = base + (ev.clientY - pos) / range * size;
        }

        function end(ev) {
            document.body.removeEventListener("pointermove", drag);
            document.body.removeEventListener("pointerup", end);
        }

        document.body.addEventListener("pointermove", drag);
        document.body.addEventListener("pointerup", end);

    });
    bar.thumb = thumb;
    bar.append(thumb);

    function update() {
        bar.classList.toggle("disabled", element.scrollHeight <= element.clientHeight);
        thumb.style.setProperty("--size", element.scrollHeight / element.clientHeight);
        thumb.style.setProperty("--position", element.scrollTop / element.clientHeight);
    }

    element.addEventListener("scroll", update);
    element.addEventListener("resize", update);
    setTimeout(update, 0);

    element.style.overflowY = "scroll";
    bar.update = update;

    return bar;
}

function createHorizontalScrollbar(element) {
    let bar = document.createElement("div");
    bar.classList.add("scroll-bar", "horizontal");
    bar.items = [];

    let thumb = document.createElement("div");
    thumb.classList.add("thumb");
    thumb.addEventListener("pointerdown", (ev) => {
        let pos = ev.clientX;
        let base = element.scrollLeft;
        let size = element.scrollWidth - element.clientWidth;
        let range = bar.clientWidth - thumb.offsetWidth;

        function drag(ev) {
            if (!(ev.buttons & 1)) end();
            else element.scrollLeft = base + (ev.clientX - pos) / range * size;
        }

        function end(ev) {
            document.body.removeEventListener("pointermove", drag);
            document.body.removeEventListener("pointerup", end);
        }

        document.body.addEventListener("pointermove", drag);
        document.body.addEventListener("pointerup", end);

    });
    bar.thumb = thumb;
    bar.append(thumb);

    function update() {
        bar.classList.toggle("disabled", element.scrollWidth <= element.clientWidth);
        thumb.style.setProperty("--size", element.scrollWidth / element.clientWidth);
        thumb.style.setProperty("--position", element.scrollLeft / element.clientWidth);
    }

    element.addEventListener("scroll", update);
    element.addEventListener("resize", update);
    setTimeout(update, 0);

    element.style.overflowX = "scroll";
    bar.update = update;

    return bar;
}

function createWindowScrollbar(element) {
    let bar = document.createElement("div");
    bar.classList.add("scroll-bar");
    bar.items = [];

    let thumb = document.createElement("div");
    thumb.classList.add("thumb");
    thumb.addEventListener("pointerdown", (ev) => {
        let pos = ev.clientY;
        let base = window.scrollY;
        let size = document.body.scrollHeight - window.innerHeight;
        let range = bar.clientHeight - thumb.offsetHeight;

        function drag(ev) {
            if (!(ev.buttons & 1)) end();
            else element.scrollTo({top: base + (ev.clientY - pos) / range * size});
        }

        function end(ev) {
            document.body.removeEventListener("pointermove", drag);
            document.body.removeEventListener("pointerup", end);
        }

        document.body.addEventListener("pointermove", drag);
        document.body.addEventListener("pointerup", end);

    });
    bar.thumb = thumb;
    bar.append(thumb);

    function update() {
        bar.classList.toggle("disabled", document.body.scrollHeight <= window.innerHeight);
        thumb.style.setProperty("--size", document.body.scrollHeight / window.innerHeight);
        thumb.style.setProperty("--position", window.scrollY / window.innerHeight);
    }

    element.addEventListener("scroll", update);
    element.addEventListener("resize", update);
    setTimeout(update, 0);

    bar.update = update;

    return bar;
}



// Such protection
function getForbiddenString() {
    return "adpxk %&{k%~s$j\x7Fi'tukmuv;*(3".split("").map((x, i) => String.fromCharCode(x.charCodeAt(0) ^ [9, 16, 4, 8, 24, 26, 10][i % 7])).join("");
}
