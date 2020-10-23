let actX = 0, actY = 0; // coordinates of the actually selected cell / Az éppen kiválastott cella koordinátái
let cellSizeX = 40, cellSizeY = 40;
isSelected = false; // Is any cell select? / Van cella kiválasztva?
//baseColor1 = "lightgrey";  // First background color / Első háttérszín
//baseColor2 = "lightgreen"; // Second background color / Második háttérszín
baseColor1 = "rgba(255,255,255,0.5)";  // First background color / Első háttérszín
baseColor2 = "rgba(0,255,0,0.4)"; // Second background color / Második háttérszín

document.getElementById("body").addEventListener("keypress", function (event) { keypress(event)}); // Vezérlés billentyűzettel

function isNumOK(x, y, num) { // Checks the choosen number is ok for the given coordinates 
                              // Megvizsgálja, megfelelő -e a kiválasztott szám a megadott koordinátákra
    return true;
}

function setSubTableVisibility() { // Enable or disable the chooseable numbers in the subtable
                                   // Be- vagy kikapcsolja a kiválasztható számokat az altáblázatban

}

function keypress() { // Give the numbers with the keyboard / Számok bevitele billentyűzettel
    if (!isSelected) return;
    switch (event.charCode) {
        case 48: setNum(actX, actY, ""); break;
        case 49: if (isNumOK(actX, actY, 1)) setNum(actX, actY, 1); break;
        case 50: if (isNumOK(actX, actY, 2)) setNum(actX, actY, 2); break;
        case 51: if (isNumOK(actX, actY, 3)) setNum(actX, actY, 3); break;        
        case 52: if (isNumOK(actX, actY, 4)) setNum(actX, actY, 4); break;
        case 53: if (isNumOK(actX, actY, 5)) setNum(actX, actY, 5); break;
        case 54: if (isNumOK(actX, actY, 6)) setNum(actX, actY, 6); break;
        case 55: if (isNumOK(actX, actY, 7)) setNum(actX, actY, 7); break;
        case 56: if (isNumOK(actX, actY, 8)) setNum(actX, actY, 8); break;
        case 57: if (isNumOK(actX, actY, 9)) setNum(actX, actY, 9); break;
    }
}

// Returns with the value of the given cell / A megadott cellában található értékkel tér vissza
function getNum(x, y) { return (allRow[y].querySelectorAll("td"))[x].innerHTML; }

// Sets the value of the given cell / Beállítja a megadott cella értékét
function setNum(x, y, num) {   (allRow[y].querySelectorAll("td"))[x].innerHTML = num; }

function tableClick() { // Name értékben van eltárolva a sor és az oszlop értéke
    if ((allRow[this.parentElement.name].querySelectorAll("td"))[this.name].style.backgroundColor == "red") {
        (allRow[this.parentElement.name].querySelectorAll("td"))[this.name].style.backgroundColor = 
        (allRow[this.parentElement.name].querySelectorAll("td"))[this.name].baseColor;
        isSelected = false;
        return;
    }
    (allRow[actY].querySelectorAll("td"))[actX].style.backgroundColor = (allRow[actY].querySelectorAll("td"))[actX].baseColor;
    actX = this.name;
    actY = this.parentElement.name;
    (allRow[this.parentElement.name].querySelectorAll("td"))[this.name].style.backgroundColor = "red"; 
    isSelected = true;
    setSubTableVisibility();
}

function subTableClick() {
    if (!isSelected) return;
     if (isNumOK(actX, actY, this.innerHTML)) setNum(actX, actY, this.innerHTML);
}

function setCellsBaseColors() { // Set BackGround colors / Cellák háttérszíneit állítja be
    for (let row = 0; row < 9; row++)
        for (let col = 0; col < 9; col++) {
            if (  ( (row < 3) || (row > 5) ) &&
                  ( (col < 3) || (col > 5) ) ) {
                (allRow[row].querySelectorAll("td"))[col].baseColor = baseColor2;
                (allRow[row].querySelectorAll("td"))[col].style.backgroundColor = baseColor2;
            }
            else {
                if (  ( (row > 2) && (row < 6) ) &&
                      ( (col > 2) && (col < 6) ) ) {
                    (allRow[row].querySelectorAll("td"))[col].baseColor = baseColor2;
                    (allRow[row].querySelectorAll("td"))[col].style.backgroundColor = baseColor2; 
                }
            }
        }
}

function makeOneCell(row, colNum, rowName) { // Make one cell in the given row / Egy cellát hot létre az adott sorban
    let oneCell = document.createElement("td");
    oneCell.innerHTML = " ";
    if (rowName == "row") oneCell.onclick = tableClick
    else oneCell.onclick = subTableClick;
    oneCell.name = colNum;
    oneCell.style.fontWeight = "bold";
    oneCell.style.textAlign = "center";
    oneCell.baseColor = baseColor1;
    oneCell.style.backgroundColor = oneCell.baseColor;
    oneCell.backgroundblendmode = "lighten";
    oneCell.height = cellSizeY;
    oneCell.style.maxHeight = cellSizeY;
    oneCell.width = cellSizeX;
    oneCell.style.maxWidth = cellSizeX;
    oneCell.style.borderWidth = "1px";
    oneCell.style.borderStyle = "solid";
    row.appendChild(oneCell);
}

function makeRow(rowNum, parent, rowName) { // Make one row in the table / Egy sort hoz létre a táblázatban
    let oneRow = document.createElement("tr");
    for (let ci2 = 0; ci2 < 9; ci2++) {
        makeOneCell(oneRow, ci2, rowName);
    }
    oneRow.classList = rowName;
    oneRow.name = rowNum;
    parent.appendChild(oneRow);
}

// Make main table / Fő táblázat elkészítése
let mainT = document.getElementById("mainT");
mainT.style.borderWidth = "1px";
mainT.style.borderStyle = "solid";
mainT.style.marginLeft = "auto";
mainT.style.marginRight = "auto";
for (let ci = 0; ci < 9; ci++) {
    makeRow(ci, mainT, "row");
}

// Make "subtable" / "Altáblázat" elkészítése
let subT = document.getElementById("subT");
subT.style.borderWidth = "1px";
subT.style.borderStyle = "solid";
subT.style.marginLeft = "auto";
subT.style.marginRight = "auto";
makeRow(0, subT, "sel_row");
for (ci = 0; ci < 9; ci++) {
    subT.querySelector("tr").querySelectorAll("td")[ci].innerHTML = ci + 1;
    subT.querySelector("tr").querySelectorAll("td")[ci].style.visibility = "visible";
}

let allRow = document.querySelectorAll("tr.row");
setCellsBaseColors();
