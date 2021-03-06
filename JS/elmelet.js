let tableElmelet = document.getElementById("tableElmelet");

function add_elmTR(cim, url) {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
   // let str = '<a class="linker01" href="' + url + '">' + cim + '</a>';
    td.innerHTML = '<a class="linker01" href="' + url + '">' + cim + '</a>';
    td.style.textAlign = "center";
    td.style.paddingLeft  = "5px";
    td.style.paddingRight = "5px";
    tr.appendChild(td);
    td.classList.add("kiemel2");
    tableElmelet.appendChild(tr);
}

add_elmTR("Eredő ellenállás számítása", "x_eredo_ell.html");
add_elmTR("Érintésvédelmi osztályok", "x_erintesvedelmi_o.html");
add_elmTR("Feszültségmentesítés lépései (20. Tétel)", "t20_megujulo.html#T20_feszultsegmentesites");
add_elmTR("Fénycső elektromos bekötése (6. Tétel)", "t06_lakasvilagitas.html#T06_fenycso");
add_elmTR("Hurokimpedancia", "x_hurokimpedancia.html");
add_elmTR("IP védettség", "x_ipvedettseg.html");
add_elmTR("Kirchhoff-törvények", "x_kirchoff.html");
add_elmTR("Kismegszakítók működése, beazonosítása", "x_kismegszakito.html");
add_elmTR("Mértékegységek neve, jelölése", "x_mertekegysegek.html");
add_elmTR("Ohm törvénye", "x_ohm_torvenye.html");
add_elmTR("Sönt ellenállás", "x_sont_ellenallas.html");
add_elmTR("Szigetelési ellenállás", "x_szigetelesi_ell.html");
add_elmTR("Törpefeszültség, SELV, PELV, FELV (8. Tétel)", "t08_hibavedelem.html#T08_torpefesz");
add_elmTR("Villamos rendszerek TT, IT, TN-C, TN-S, TN-C-S", "x_villrendszerek.html");
