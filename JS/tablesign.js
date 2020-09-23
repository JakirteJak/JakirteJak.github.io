let tBody = document.getElementById("tableSigns");

function addTD(HTML, parentTR, classL) {
    let td = document.createElement("td");
    td.innerHTML = HTML;
    td.classList = classL;
    td.style.paddingLeft = "5px";
    td.style.paddingRight = "5px";
    parentTR.appendChild(td);
}

function addTR(mennyisegNev, mennyisegJel, mertekegysegNev, mertekegysegJel) {
    let tr = document.createElement("tr");
    addTD(mennyisegNev, tr);
    addTD(mennyisegJel, tr, "tdc2");
    addTD(mertekegysegNev, tr);
    addTD(mertekegysegJel, tr, "tdc2");
    tBody.appendChild(tr);
}

addTR("áramerősség", "I", "amper", "A");
addTR("áramsűrűség", "J", "amper/négyzetmilliméter", "A/mm<sup>2</sup>");
addTR("ellenállás", "R", "ohm", "Ω");
addTR("feszültség", "U", "volt", "V");
addTR("frekvencia", "f", "hertz", "Hz");
addTR("hatásos ellenállás (rezisztencia)", "R", "hertz", "Hz");
addTR("idő", "t", "másodperc", "s");
addTR("impedancia", "Z", "ohm", "Ω");
addTR("kapacitás", "C", "farad", "F");
addTR("keresztmetszet", "A", "négyzetmilliméter", "mm<sup>2</sup>");
addTR("mágneses fluxus", "Ф", "Weber", "Wb (Vs)")
addTR("mágneses indukció", "B", "tesla", "T");
addTR("mágneses térerősség", "H", "amper/méter", "A/m");
addTR("nyomás", "p", "pascal", "Pa (N/m<sup>2</sup>)");
addTR("önindukciós tényező", "L", "henry", "H");
addTR("sebesség", "v", "méter/másodperc", "m/s");
addTR("töltés", "Q", "coulomb", "C");
addTR("villamos munka", "W", "joule", "J");
