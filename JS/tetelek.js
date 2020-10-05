let tableElmelet = document.getElementById("tableTetelek");

function add_elmTR(cim, url) {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let str = '<a class="linker01" href="' + url + '">' + cim + '</a>';
    td.innerHTML = str;
    td.style.textAlign = "center";
    td.style.paddingLeft  = "5px";
    td.style.paddingRight = "5px";
    tr.appendChild(td);
    tableElmelet.appendChild(tr);
}

add_elmTR("1. A villamosenergia-rendszer jellemzői", "t01.html");
add_elmTR("2. Fogyasztásmérőhely kialakítása", "t02_fogyasztasmerohely.html");
add_elmTR("3. Családi ház villamos áramköreinek kialakítása", "t03_csaladi_haz_vill.html");
add_elmTR("4. Többlakásos épület villamos áramköreinek kialakítása", "t04_tobblakasos.html");
add_elmTR("5. Villamos áramkörök kialakításánál használt anyagok falon kívüli és süllyesztett szerelési technológiák esetén",
    "t05_anyagok.html");
add_elmTR("6. Lakásvilágítási áramkörök", "t06_lakasvilagitas.html");
add_elmTR("7. Túláramvédelem", "t07_tularamvedelem.html");
add_elmTR("8. Hibavédelem (Érintésvédelem)", "t08_hibavedelem.html");
add_elmTR("9. Áramütés elleni védelem nullázott (TN) rendszerű hálózaton", "t09_aramutes.html");
add_elmTR("10. Áramütés elleni védelem földelt vagy szigetelt csillagpontú hálózat esetén", "t10_aramutes10.html");
add_elmTR("11. Lakó és kommunális épület hibaáram-rendszerében a központi EPH-csomópont kialakítása és az áram-védőkapcsoló ellenőrzése", "t11_eph_csomopont.html");