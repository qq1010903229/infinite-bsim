

function format(num, precision = 0) {
    num = D(num);
    if (D.lt(num, 1e3)) {
        return format.comma(num.toNumber(), precision);
    } else if (D.lt(num, 1e9)) {
        return format.comma(num.toNumber());
    } else if (D.lt(num, 1e123) && !game.options.forceSci) {
        let list = [
            "", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No",
            "De", "UD", "DD", "TD", "QaD", "QiD", "SxD", "SpD", "OcD", "NoD",
            "Vg", "UV", "DV", "TV", "QaV", "QiV", "SxV", "SpV", "OcV", "NoV",
            "Tg", "UT", "DT", "TT", "QaT", "QiT", "SxT", "SpT", "OcT", "NoT",
        ]
        let exp = num.log10().div(3).floor();
        let man = num.div(D.pow(1000, exp));
        return format.sig(man.toNumber(), 4) + " " + list[exp.toNumber()];
    } else {
        let exp = num.log10().floor();
        let man = num.div(D.pow(10, exp))
        return format.comma(man.toNumber(), 3) + "e" + format.comma(exp.toNumber());
    }
}
format.comma = function(num, precision = 0) {
    return (+num).toLocaleString("en-US", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
    });
}
format.sig = function(num, precision = 0) {
    return (+num).toLocaleString("en-US", {
        minimumSignificantDigits: precision,
        maximumSignificantDigits: precision,
    });
}
format.time = function(seconds) {
    let str = Math.floor(seconds % 60).toFixed(0) + "s";
    if (seconds = Math.floor(seconds / 60)) str = Math.floor(seconds % 60).toFixed(0) + "m " + str;
    if (seconds = Math.floor(seconds / 60)) str = Math.floor(seconds % 24).toFixed(0) + "h " + str;
    if (seconds = Math.floor(seconds / 24)) str = Math.floor(seconds).toFixed(0) + "d " + str;
    return str;
}