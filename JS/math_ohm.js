document.getElementById("btn_OhmDataClear").onclick = ohm_dataclear;
document.getElementById("btn_OhmCalc").onclick = ohm_calc;

function ohm_dataclear() {
    // Mezők törlése egyesével, két különböző módszerrel
    /*document.getElementById("tb_OhmR").value = "";
    document.querySelector("input[id='tb_OhmU']").value = "";
    document.getElementById("tb_OhmI").value = "";*/

    // Az összes text típusú input kigyűjtése, majd a mezők törlése ciklussal.
    tb_all = document.querySelectorAll("input[type='text']");

    for (let ci in tb_all) tb_all[ci].value = "";

    // Ez is működik.
    /*for (let i = 0; i < tb_all.length; i++)
        tb_all[i].value = "";*/
}

function ohm_calc() {
    let R = parseFloat(document.getElementById("tb_OhmR").value);
    let U = parseFloat(document.getElementById("tb_OhmU").value);
    let I = parseFloat(document.getElementById("tb_OhmI").value);

    let numofempty = 0; // Üres mezők száma.
    let numofNaN = 0;   // Érvénytelen mezők száma. (Üres, vagy nem szám.)
    for (let ci of document.querySelectorAll("input[type='text']")) {
        if (ci.value == "") numofempty++;
        if (parseFloat(ci.value).toString() == "NaN") numofNaN++;
    }

    if (numofempty > 1) { // Ha több mint egy mező üres, hiba.
        alert("Legalább két mezőt ki kell tölteni!"); return;
    }
    if (numofempty == 0) { // Ha minden mező ki van töltve, hiba.
        alert("Egyszerre csak két mezőt kell kitölteni, a harmadikat számolom!"); return;
    }

    if (numofNaN > 1) { // Hibás értékmegadás, például számok helyett más karakterek.
        alert("Hibás értékmegadás!"); return;
    }

    // Ellenállás számítás.
    if (R.toString() == "NaN") document.getElementById("tb_OhmR").value = parseFloat(U / I).toPrecision(3);
    // Feszültség számítás.
    if (U.toString() == "NaN") document.getElementById("tb_OhmU").value = (R * I).toPrecision(3);
    // Áramerősség számítás.
    if (I.toString() == "NaN") document.getElementById("tb_OhmI").value = parseFloat(U / R).toPrecision(3);    
}