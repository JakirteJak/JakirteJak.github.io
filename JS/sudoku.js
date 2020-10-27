let diffEasy = document.getElementById("cbDiffEasy");
let diffMedium = document.getElementById("cbDiffMedium");
let diffHard = document.getElementById("cbDiffHard");
let diffExpert = document.getElementById("cbDiffExpert");
let borderWidth = 3;
let actX = 0, actY = 0; // Coordinates of the actually selected cell / Az éppen kiválastott cella koordinátái
let cellSizeX  = 50, cellSizeY = 50;
let easyLimit  = 36;
isSelected     = false; // Is any cell select? / Van cella kiválasztva?
baseColor1     = "rgba(255,255,255,0.5)"; // First background color / Első háttérszín
baseColor2     = "rgba(255,255,205,0.4)"; // Second background color / Második háttérszín
highColor1     = "rgba(255,255,205,0.7";
highColor2     = "rgba(255,255,205,0.7)";
//highCellColor  = "rgba(255,255,255, 0.9)";
highCellColor  = "white";

document.getElementById("body").addEventListener("keypress", function (event) { keypress(event) }); // Vezérlés billentyűzettel
document.getElementById("body").addEventListener("keydown", function (event) { arrowKeyPress(event) }); // Nyílgombok
let pControls = document.getElementById("pControls");

function setActCellBackgroundToBaseColor() { // Set actual cells background to base color / Az aktuális cella hátterének alapszínre állítása
    (allRow[actY].querySelectorAll("td"))[actX].style.backgroundColor =
        (allRow[actY].querySelectorAll("td"))[actX].baseColor;
}

function setActCellBackgroudToRed() { // Set actual cells background to "highCellColor"
                                      // Az aktuális cella hátterének "highCellColor" -ra állítása
    (allRow[actY].querySelectorAll("td"))[actX].style.backgroundColor = highCellColor;
    setSubTableVisibility();
}

function clearWholeTable() {
    btnClearCellClick();
    for (let row = 0; row < 9; row++)
        for (let col = 0; col < 9; col++)
            allRow[row].querySelectorAll("td")[col].innerHTML = "";
    setSubTableVisibility();
}

function fillOneRow(rowNum, startNum) {
    for (let ci = 0; ci < 9; ci++) {
        if (!isNumOK(ci, rowNum, startNum)) return;
        allRow[rowNum].querySelectorAll("td")[ci].innerHTML = startNum;

        if (startNum == 9) startNum = 1
        else startNum++;
    }
}

function replaceTwoRows(row1, row2) {
    let num;
    for (let ci = 0; ci < 9; ci++) {
        num = allRow[row1].querySelectorAll("td")[ci].innerHTML;
        allRow[row1].querySelectorAll("td")[ci].innerHTML = allRow[row2].querySelectorAll("td")[ci].innerHTML;
        allRow[row2].querySelectorAll("td")[ci].innerHTML = num;
    }

}

function replaceTwoCols(col1, col2) {
    let num;
    for (let ci = 0; ci < 9; ci++) {
        num = allRow[ci].querySelectorAll("td")[col1].innerHTML;
        allRow[ci].querySelectorAll("td")[col1].innerHTML = allRow[ci].querySelectorAll("td")[col2].innerHTML;
        allRow[ci].querySelectorAll("td")[col2].innerHTML = num;
    }

}

function getRandomRowOrCol(rowOrCol) {
    let res;
    if (rowOrCol == 9)
        return Math.floor(Math.random() * 9)
    else {
        let div = (rowOrCol + 1) % 3;
        let rNum = (Math.floor(Math.random() * 2)) + 1;
        if (div == 1) {
            res = rowOrCol + rNum;
        } else
            if (div == 0) {
                res = rowOrCol - rNum;
            }
            else {
                if (rNum == 1) res = rowOrCol - 1
                else res = rowOrCol + 1;
            }
    }
    return res;
}

function fillWholeTable() {
    clearWholeTable();
    fillOneRow(0, 1);
    fillOneRow(1, 4);
    fillOneRow(2, 7);
    fillOneRow(3, 2);
    fillOneRow(4, 5);
    fillOneRow(5, 8);
    fillOneRow(6, 3);
    fillOneRow(7, 6);
    fillOneRow(8, 9);
    let rRowOrColNum, rNum;
    for (let ci = 0; ci < 100; ci++) {
        rRowOrColNum = Math.floor(Math.random() * 2);
        rNum = getRandomRowOrCol(9);
        if (rRowOrColNum == 0) replaceTwoRows(rNum, getRandomRowOrCol(rNum))
        else replaceTwoCols(rNum, getRandomRowOrCol(rNum));
    }
}

function makeRandomGame() { // Randomly generate a new game / Véletlenszerűen generál egy új játékot
    fillWholeTable();
    let limit, rX, rY; let coordOK = false;
    if (diffEasy.checked) limit = 43;
    if (diffMedium.checked) limit = 51;
    if (diffHard.checked) limit = 56;
    if (diffExpert.checked) limit = 58;
    for (let ci = 0; ci < limit; ci++) {
        coordOK = false;
        while (!coordOK) {
            rX = Math.floor(Math.random() * 9);
            rY = Math.floor(Math.random() * 9);
            if (allRow[rY].querySelectorAll("td")[rX].innerHTML != "") {
                allRow[rY].querySelectorAll("td")[rX].innerHTML = "";
                coordOK = true;
            }
        }
    }
    setSubTableVisibility();
}

function changeXYforArrowKeys(incdec, XorY, funct) { // Subfunction for arrowKeyPress / Alfunkció arrowKeyPress -hez
    setActCellBackgroundToBaseColor();
    if (funct == "SR") changeHighlightedCells("reset");
    if (XorY == "X")
        actX += incdec;
    if (XorY == "Y")
        actY += incdec;
    if (funct == "SR") changeHighlightedCells("set");
}

function arrowKeyPress() { // Use arrow keys to move inside the table / Használd a nyílgombokat, hogy mozogj a táblázatban
    if (!isSelected) isSelected = true;
    //    pControls.innerHTML = event.keyCode;
    switch (event.keyCode) {
        case 37: // left keypress / bal nyílgomb
            if (actX > 0) changeXYforArrowKeys(-1, "X", "SR");
            setActCellBackgroudToRed();
            break;
        case 39: // right keypress / jobb nyílgomb
            if (actX < 8) changeXYforArrowKeys(1, "X", "SR");
            setActCellBackgroudToRed();
            break;
        case 38: // up keypress / fel nyílgomb
            if (actY > 0) changeXYforArrowKeys(-1, "Y", "SR");
            setActCellBackgroudToRed();
            break;
        case 40: // down keypress / le nyílgomb
            if (actY < 8) changeXYforArrowKeys(1, "Y", "SR");
            setActCellBackgroudToRed();
            break;
        case 46: // Del keypress (one cell clear)
            btnClearCellClick();
            break;
        case 35: // End keypress (clear all cells)
            clearWholeTable();
            break;
    }
}

function btnClearCellClick() {
    if (!isSelected) return;
    (allRow[actY].querySelectorAll("td"))[actX].innerHTML = "";
    setSubTableVisibility();
}

function rowCheck(rowNum, num) {
    let isOK = true;
    let row = allRow[rowNum].querySelectorAll("td");
    for (let ci = 0; ci < 9; ci++) {
        if (row[ci].innerHTML == num)
            isOK = false;
    }
    return isOK;
}

function colCheck(colNum, num) {
    let isOK = true;
    for (let ci = 0; ci < 9; ci++) {
        if ((allRow[ci].querySelectorAll("td"))[colNum].innerHTML == num)
            isOK = false;
    }
    return isOK;
}

function nineCellCheck(x, y, num) {
    let isOK = true;
    let x1, x2, y1, y2;
    if (x < 3) { x1 = 0; x2 = 2; } else
        if (x > 5) { x1 = 6; x2 = 8; } else { x1 = 3; x2 = 5; }
    if (y < 3) { y1 = 0; y2 = 2; } else
        if (y > 5) { y1 = 6; y2 = 8; } else { y1 = 3; y2 = 5; }
    for (let ci = x1; ci <= x2; ci++) {
        for (let cj = y1; cj <= y2; cj++) {
            if ((allRow[cj].querySelectorAll("td"))[ci].innerHTML == num)
                isOK = false;
        }
    }
    return isOK;
}

function isNumOK(x, y, num) { // Checks the choosen number is ok for the given coordinates 
    // Megvizsgálja, megfelelő -e a kiválasztott szám a megadott koordinátákra
    if (!rowCheck(y, num)) return false;
    if (!colCheck(x, num)) return false;
    if (!nineCellCheck(x, y, num)) return false;
    return true;
}

function setSubTableVisibility() { // Enable or disable the chooseable numbers in the subtable
    // Be- vagy kikapcsolja a kiválasztható számokat az altáblázatban
    for (let ci = 0; ci < 9; ci++) {
        if ((isNumOK(actX, actY, ci + 1)) && (isSelected))
            subRow[ci].style.visibility = "visible"
        else subRow[ci].style.visibility = "hidden";
    }
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
    setSubTableVisibility();
}

// Returns with the value of the given cell / A megadott cellában található értékkel tér vissza
function getNum(x, y) { return (allRow[y].querySelectorAll("td"))[x].innerHTML; }

// Sets the value of the given cell / Beállítja a megadott cella értékét
function setNum(x, y, num) { (allRow[y].querySelectorAll("td"))[x].innerHTML = num; }

function changeHighlightedCells(funct) {
    for (let ci = 0; ci < 9; ci++) {
        if (funct == "reset") {
            allRow[ci].querySelectorAll("td")[actX].style.backgroundColor = allRow[ci].querySelectorAll("td")[actX].baseColor;
            allRow[actY].querySelectorAll("td")[ci].style.backgroundColor = allRow[actY].querySelectorAll("td")[ci].baseColor;    
        }
        else {
            allRow[ci].querySelectorAll("td")[actX].style.backgroundColor = allRow[ci].querySelectorAll("td")[actX].highColor;
            allRow[actY].querySelectorAll("td")[ci].style.backgroundColor = allRow[actY].querySelectorAll("td")[ci].highColor;
        }
    }

    let x1, x2, y1, y2;
    if (actX < 3) { x1 = 0; x2 = 2; } else
        if (actX > 5) { x1 = 6; x2 = 8; } else { x1 = 3; x2 = 5; }
    if (actY < 3) { y1 = 0; y2 = 2; } else
        if (actY > 5) { y1 = 6; y2 = 8; } else { y1 = 3; y2 = 5; }
    for (let row = y1; row <= y2; row++)
        for (let col = x1; col <= x2; col++)
            if (funct == "reset")
                allRow[row].querySelectorAll("td")[col].style.backgroundColor = allRow[row].querySelectorAll("td")[col].baseColor
            else
                allRow[row].querySelectorAll("td")[col].style.backgroundColor = allRow[row].querySelectorAll("td")[col].highColor;
}

function tableClick() { // Name értékben van eltárolva a sor és az oszlop értéke
    if ((allRow[this.parentElement.name].querySelectorAll("td"))[this.name].style.backgroundColor == highCellColor) {
        (allRow[this.parentElement.name].querySelectorAll("td"))[this.name].style.backgroundColor =
            (allRow[this.parentElement.name].querySelectorAll("td"))[this.name].baseColor;
        isSelected = false;
        changeHighlightedCells("reset");
        setSubTableVisibility();
        return;
    }
    (allRow[actY].querySelectorAll("td"))[actX].style.backgroundColor = (allRow[actY].querySelectorAll("td"))[actX].baseColor;
    changeHighlightedCells("reset");
    actX = this.name;
    actY = this.parentElement.name;
    changeHighlightedCells("set");
    (allRow[this.parentElement.name].querySelectorAll("td"))[this.name].style.backgroundColor = highCellColor;
    isSelected = true;
    setSubTableVisibility();
}

function subTableClick() {
    if (!isSelected) return;
    if (isNumOK(actX, actY, this.innerHTML)) setNum(actX, actY, this.innerHTML);
    setSubTableVisibility();
}

function setCellsBaseColors() { // Set BackGround colors / Cellák háttérszíneit állítja be
    for (let row = 0; row < 9; row++)
        for (let col = 0; col < 9; col++) {
            if (((row < 3) || (row > 5)) &&
                ((col < 3) || (col > 5))) {
                (allRow[row].querySelectorAll("td"))[col].baseColor = baseColor2;
                (allRow[row].querySelectorAll("td"))[col].highColor = highColor2;
                (allRow[row].querySelectorAll("td"))[col].style.backgroundColor = baseColor2;
            }
            else {
                if (((row > 2) && (row < 6)) &&
                    ((col > 2) && (col < 6))) {
                    (allRow[row].querySelectorAll("td"))[col].baseColor = baseColor2;
                    (allRow[row].querySelectorAll("td"))[col].highColor = highColor2;
                    (allRow[row].querySelectorAll("td"))[col].style.backgroundColor = baseColor2;
                }
            }
        }
}

function makeOneCell(row, colNum, rowName, mainParent) { // Make one cell in the given row / Egy cellát hot létre az adott sorban
    let oneCell = document.createElement("td");
    //oneCell.innerHTML = " ";
    if (rowName == "row") oneCell.onclick = tableClick;
    else oneCell.onclick = subTableClick;
    oneCell.name = colNum;
    oneCell.style.fontWeight = "bold";
    oneCell.style.textAlign = "center";
    oneCell.style.fontSize = (cellSizeX - 10) + "px";
    oneCell.baseColor = baseColor1;
    oneCell.highColor = highColor1;
    oneCell.style.backgroundColor = oneCell.baseColor;
    oneCell.backgroundblendmode = "lighten";
    oneCell.height = cellSizeY;
    oneCell.style.maxHeight = cellSizeY;
    oneCell.width = cellSizeX;
    oneCell.style.maxWidth = cellSizeX;
    oneCell.style.borderWidth = "1px";
    oneCell.style.borderStyle = "solid";
    if ( ((colNum + 1) % 3 == 0) && (mainParent != "subT")) oneCell.style.borderRightWidth = borderWidth + "px";
    row.appendChild(oneCell);
}

function makeRow(rowNum, parent, rowName) { // Make one row in the table / Egy sort hoz létre a táblázatban
    let oneRow = document.createElement("tr");
    for (let ci2 = 0; ci2 < 9; ci2++) {
        makeOneCell(oneRow, ci2, rowName, parent.id);
    }
    oneRow.classList = rowName;
    oneRow.name = rowNum;
    if ( ((rowNum + 1) % 3 == 0) && (parent != "subT") ){
        oneRow.style.borderWidth = "0px";
        oneRow.style.borderBottomWidth = borderWidth + "px";
        oneRow.style.borderStyle = "solid";
    }     
    parent.appendChild(oneRow);
}

// Make main table / Fő táblázat elkészítése
let mainT = document.getElementById("mainT");
mainT.style.borderWidth = borderWidth + "px";
mainT.style.borderStyle = "solid";
mainT.style.borderColor = "black";
mainT.style.marginLeft = "auto";
mainT.style.marginRight = "auto";
mainT.style.borderCollapse = "collapse";
for (let ci = 0; ci < 9; ci++) {
    makeRow(ci, mainT, "row");
}

// Make "subtable" / "Altáblázat" elkészítése
let subT = document.getElementById("subT");
subT.style.borderWidth = "1px";
subT.style.borderStyle = "solid";
subT.style.borderColor = "black";
subT.style.marginLeft = "auto";
subT.style.marginRight = "auto";
subT.style.borderCollapse = "collapse";
makeRow(0, subT, "sel_row");

let allRow = document.querySelectorAll("tr.row");
let subRow = subT.querySelector("tr").querySelectorAll("td");
pControls.style.fontSize = cellSizeX * 0.4 + "px";
pControls.parentElement.style.backgroundColor = "rgba(255,255,205,0.4)";
pControls.parentElement.style.borderStyle = "solid";
pControls.parentElement.style.borderWidth = "2px;"

setSubTableVisibility();
setCellsBaseColors();
document.getElementById("btnClearCell").onclick = btnClearCellClick;
document.getElementById("btnClearWholeTable").onclick = clearWholeTable;
document.getElementById("btnMakeRandomGame").onclick = makeRandomGame;

for (ci = 0; ci < 9; ci++)
    subRow[ci].innerHTML = ci + 1;
