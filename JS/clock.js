// Az óralap minden száma egy DIV, ahogyan a mutatók minden pontja is.
let cTD = document.getElementById("cTD"); // A TD, amibe a DIV -eket fogjuk helyezni
let newX = 0; let newY = 0; oldX = 0; oldY = 0; // Koordinátaváltozók a későbbi számolásokhoz
let minFontSize = 20; let baseMinFontSize = 20; // Minimális fontméret (aktuális és alapállapot)
let midFontSize = 40; let baseMidFontSize = 40; // Közepes fontméret   (aktuális és alapállapot)
let maxFontSize = 60; let baseMaxFontSize = 60; // Maximális fontméret (aktuális és alapállapot)
let pointsNum = 30;        // Hány pontból áll egy mutató
let act_mC = 0;            // Aktuális sorszáma az egérkoordináta tömbnek
let new_mC = 1;            // Új sorszáma az egérkoordináta tömbnek
let numOf_mC = 100;        // Eltárolt egérkkordináták száma
let mXY = [];              // Egérkoordináták tömbje
let clockSize = 2.0;       // Óra méretszorzó (*100)
let clockIncrement = true; // Óraméret változása pulzáláskor (true = nővekszik, false = csökken)
let clockSizeMin = 2.0;    // Méretminimum méretszorzó
let clockSizeMax = 2.5;    // Méretmaximum méretszorzó
let clockScale = 0.05;     // Méretszorzó változása cilusonként
let actHour = 0;           // Hányadik számnál (1-12) jár a cirkálás
let numberDIVs =  [];      // 1-12 számok DIV tömbje
let numberCoord = [];      // 1-12 számok koordinátái
let clockSpeed = [33, 30, 27, 24, 21, 18, 15, 12, 10, 9, 8, 7]; // 1-12 számok mozgási sebessége
let pointSpeed = [5, 6, 7, 8 ,9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ,20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];
let secDIVs =  [];  secCoord = []; // Másodpermutató
let minDIVs =  [];  minCoord = []; // Percmutató
let hourDIVs = []; hourCoord = []; // Óramutató

let timerNumSize   = setInterval(setNumSize, 100);    // Számok fontméret változtatása
let timerClockMove = setInterval(setMoveCoord, 10);   // Pozíció koordináták számolása
let timerTime = setInterval(setTimeAndCoord, 10);     // Mutatók alapkoordinátáinak számolása
let timerClockPulse = setInterval(setClockPulse, 50); // Pulzálás változtatása
let timerMouseCoordChange = setInterval(setMouseCoordNum, 50);

document.getElementById("id_html").addEventListener("mousemove", function (event) { mouseXY(event) }); // Egérmozgás esemény
document.getElementById("cbPulse").checked = true;           // Pulzálás alapbeállítás
document.getElementById("cbCircle").checked = true;          // Cirkálás alapbeállítás
document.getElementById("cbCircle").onclick = cbCircleClick; // Cirkálás checkbox klikk
document.getElementById("id_html").addEventListener("keypress", function (event) { keypress(event)}); // Vezérlés billentyűzettel
document.getElementById("rangeClockSizeMin").value = "18";

function keypress(event) { // Vezérlés billentyűzettel
    let minValue = parseInt(document.getElementById("rangeClockSizeMin").value);
    let maxValue = parseInt(document.getElementById("rangeClockSizeMax").value);

    switch (event.charCode) {
        case 49: document.getElementById("cbPulse").checked = !document.getElementById("cbPulse").checked; break;
        case 50: document.getElementById("cbCircle").checked = !document.getElementById("cbCircle").checked; cbCircleClick(); break;
        case 51: minValue -= 1; break;
        case 52: minValue += 1; break;
        case 53: maxValue -= 1; break;
        case 54: maxValue += 1; break;
    }    11
    document.getElementById("rangeClockSizeMin").value = minValue;
    document.getElementById("rangeClockSizeMax").value = maxValue;
}

function cbCircleClick() { 
// Cirkálás checkbox klikk. Ha nincs kipipálva, azonos méretűre van állítva a három fő karakterméret.
// Igy úgy tűnik, mintha a cirkálás ki lenne kapcsolva.
    if (document.getElementById("cbCircle").checked) {
        baseMinFontSize = 20;
        baseMidFontSize = 40;
        baseMaxFontSize = 60;
    }
    else {
        baseMinFontSize = 20;
        baseMidFontSize = 20;
        baseMaxFontSize = 20;
    }
}

function setClockPulse() { 
// Pulzálás változtatása. Ha eléri a max méretet, átvált csökkentésre. Ha a min méretet, akkor vissza növelésre.
    if (!document.getElementById("cbPulse").checked) return; // Ha a Pulzálás checkbox nincs kipipálva, kilép.
    clockSizeMin = document.getElementById("rangeClockSizeMin").value / 10;
    clockSizeMax = document.getElementById("rangeClockSizeMax").value / 10;
    if (clockSize > clockSizeMax)
        clockIncrement = false;
    if (clockSize < clockSizeMin)
        clockIncrement = true;
    if (clockIncrement)
        clockSize+= clockScale
    else
        clockSize-= clockScale;
}   

function setMouseCoordNum() {
  /*  if (act_mC == new_mC) return;
    act_mC++;
    if (act_mC == numOf_mC)
        act_mC = 0;*/
}

function secminhourCoordZero() { // Mutatók koordináta tömbjeinek inicializálása
    for (let ci = 0; ci < pointsNum; ci++) {
        secCoord.push({ "X": 0, "Y": 0 });
        minCoord.push({ "X": 0, "Y": 0 });
        hourCoord.push({ "X": 0, "Y": 0 });
    }
}

function mouseCoordZero() { // Egérkoordináták tömbjének inicializálása
    for (let ci = 0; ci < numOf_mC; ci++) { mXY.push({ "X": 0, "Y": 0}); }
}

function setTimeAndCoord() { 
// Mutatók alapkoordinátáinak számolása. Valójában azt számolja ki, és helyezi el egy tömbben, hogy az aktuális óraméret alapján
// mik lennének a mutatók DIV -jeinek a koordinátái a nullához képest. Később ez lesz eltolva az egér pozíviójához, és a mozgási
// sebességhez képest.
    let myTime = new Date(); // Aktuális idő lekérdezése
    let sec = myTime.getSeconds();
    let min = myTime.getMinutes();
    let hour = myTime.getHours();
    for (let ci in secCoord) {
        secCoord[pointsNum - ci - 1].X = (-(Math.sin(((sec * 6) + 180) * Math.PI / 180) * clockSize * 100)) / pointsNum * ci;
        secCoord[pointsNum - ci - 1].Y = ((Math.cos(((sec * 6) + 180) * Math.PI / 180) * clockSize * 100)) / pointsNum * ci;

        minCoord[pointsNum - ci - 1].X = (-(Math.sin(((min * 6) + 180) * Math.PI / 180) * clockSize * 100)) / pointsNum * ci;
        minCoord[pointsNum - ci - 1].Y = ((Math.cos(((min * 6) + 180) * Math.PI / 180) * clockSize * 100)) / pointsNum* ci;

        hourCoord[pointsNum - ci - 1].X = (-(Math.sin((((hour * 30) + (30 * (min / 60))) + 180) * Math.PI / 180) * clockSize * 100)) / (pointsNum + 5) * ci;
        hourCoord[pointsNum - ci - 1].Y = ((Math.cos((((hour * 30) +  (30 * (min / 60))) + 180) * Math.PI / 180) * clockSize * 100)) / (pointsNum + 5) * ci;
    }
}

function setX(oldX, newX, arraySpeed, arrayDiv, ci) { 
// X koordináta általános számolása és beállítása annak figyelembevételével, hogy mi az új viszonyítási pont, és a DIV sebessége
// alapján mennyit mozdul el abba az irányba a jelenlegi pozíciójából
    if (newX > oldX) {
        if ((newX - oldX) > arraySpeed[ci])
            arrayDiv[ci].style.left = (oldX + arraySpeed[ci]) + "px"
        else
            arrayDiv[ci].style.left = newX + "px";
    }
    else {
        if ((oldX - newX) > arraySpeed[ci])
            arrayDiv[ci].style.left = (oldX - arraySpeed[ci]) + "px"
        else
            arrayDiv[ci].style.left = newX + "px";
    }
}

function setY(oldY, newY, arraySpeed, arrayDiv, ci) {
// Y koordináta általános számolása és beállítása annak figyelembevételével, hogy mi az új viszonyítási pont, és a DIV sebessége
// alapján mennyit mozdul el abba az irányba a jelenlegi pozíciójából
    if (newY > oldY) {
        if ((newY - oldY) > arraySpeed[ci])
            arrayDiv[ci].style.top = (oldY + arraySpeed[ci]) + "px"
        else
            arrayDiv[ci].style.top = newY + "px";
    }
    else {
        if ((oldY - newY) > arraySpeed[ci])
            arrayDiv[ci].style.top = (oldY - arraySpeed[ci]) + "px"
        else
            arrayDiv[ci].style.top = newY + "px";
    }
}

function setMoveCoord() { 
// Pozíció koordináták számolása. A ciklus végigmegy a tömbön, és kiszámolja az egérkoordináta tömb aktuális értéke alapján
// hol kellene lennie a DIV -nek. Ezt, és a jelenlegi koordinátát átadva a függvény beállítja az új koordinátát,
// figyelembe véve az elmozdulási sebességet.
    for (let ci in numberDIVs) { // Óralap számai DIV tömb
        newX = parseFloat(clockSize * numberCoord[ci].x + mXY[act_mC].X - (parseFloat(numberDIVs[ci].style.fontSize) / 2));
        newY = parseFloat(clockSize * numberCoord[ci].y + mXY[act_mC].Y - (parseFloat(numberDIVs[ci].style.fontSize) / 2));
        oldX = parseFloat(numberDIVs[ci].style.left);
        oldY = parseFloat(numberDIVs[ci].style.top);
        setX(oldX, newX, clockSpeed, numberDIVs, ci);
        setY(oldY, newY, clockSpeed, numberDIVs, ci);
    }

    for (let ci in secDIVs) { // Másodperc mutató pontjai DIV tömb
        newX = parseFloat(secCoord[ci].X + mXY[act_mC].X) - 13;
        newY = parseFloat(secCoord[ci].Y + mXY[act_mC].Y) - 13;
        oldX = parseFloat(secDIVs[ci].style.left);
        oldY = parseFloat(secDIVs[ci].style.top);
        setX(oldX, newX, pointSpeed, secDIVs, ci);
        setY(oldY, newY, pointSpeed, secDIVs, ci);
    }

    for (let ci in minDIVs) { // Perc mutató pontjai DIV tömb
        newX = parseFloat(minCoord[ci].X + mXY[act_mC].X) - 13;
        newY = parseFloat(minCoord[ci].Y + mXY[act_mC].Y) - 13;
        oldX = parseFloat(minDIVs[ci].style.left);
        oldY = parseFloat(minDIVs[ci].style.top);
        setX(oldX, newX, pointSpeed, minDIVs, ci);
        setY(oldY, newY, pointSpeed, minDIVs, ci);
    }

    for (let ci in hourDIVs) { // Óramutató pontjai DIV tömb
        newX = parseFloat(hourCoord[ci].X + mXY[act_mC].X) - 13;
        newY = parseFloat(hourCoord[ci].Y + mXY[act_mC].Y) - 13;
        oldX = parseFloat(hourDIVs[ci].style.left);
        oldY = parseFloat(hourDIVs[ci].style.top);
        setX(oldX, newX, pointSpeed, hourDIVs, ci);
        setY(oldY, newY, pointSpeed, hourDIVs, ci);
    }
}

function setNumSize() { 
// Számok fontméret változtatása. Három fontméretet váltogat a curkuláláshoz. (Persze az aktuális óraméret ezen még változtat.)
// Az aktuális óra a nagy, az előtte és utána lévő a közepes, a maradék a kis méretű.
    minFontSize = baseMinFontSize * (clockSize - 1);
    midFontSize = baseMidFontSize * (clockSize - 1);
    maxFontSize = baseMaxFontSize * (clockSize - 1);
    
    if (actHour == 11) {
        numberDIVs[11].style.fontSize = maxFontSize + "px";
        numberDIVs[10].style.fontSize = midFontSize + "px";
        numberDIVs[9].style.fontSize = minFontSize + "px";
        numberDIVs[0].style.fontSize = midFontSize + "px";
        actHour = 0;
    } else
        if (actHour == 0) {
            numberDIVs[0].style.fontSize = maxFontSize + "px";
            numberDIVs[11].style.fontSize = midFontSize + "px";
            numberDIVs[10].style.fontSize = minFontSize + "px";
            numberDIVs[1].style.fontSize = midFontSize + "px";
            actHour++;
        } else
            if (actHour == 1) {
                numberDIVs[1].style.fontSize = maxFontSize + "px";
                numberDIVs[0].style.fontSize = midFontSize + "px";
                numberDIVs[11].style.fontSize = minFontSize + "px";
                numberDIVs[2].style.fontSize = midFontSize + "px";
                actHour++;
            }
            else {
                numberDIVs[actHour].style.fontSize = maxFontSize + "px";
                numberDIVs[actHour - 1].style.fontSize = midFontSize + "px";
                numberDIVs[actHour - 2].style.fontSize = minFontSize + "px";
                numberDIVs[actHour + 1].style.fontSize = midFontSize + "px";
                actHour++;
            }
}

function mouseXY(event) { // Egérmozgás esemény
    mXY[new_mC].X = event.clientX;
    mXY[new_mC].Y = event.clientY;

    act_mC = new_mC;//!!!

    new_mC++;
    if (new_mC == numOf_mC)
        new_mC = 0;

}

function addDiv(d_HTML, d_id, d_class, d_x, d_y, array, parent) { // Divek hozzáadása a szülő objektumhoz
    let div = document.createElement("div");

    div.innerHTML = d_HTML;
    div.id = d_id;
    div.classList = d_class;
    div.style.fontSize = minFontSize + "px";
    div.style.fontFamily = "Times New Roman";
    div.style.top = (clockSize * d_y + "px");
    div.style.left = (clockSize * d_x + "px");

    div.style.position = "absolute";
    div.style.textAlign = "center";

    parent.appendChild(div);
    array.push(div);
    numberCoord.push({ y: d_y, x: d_x });
}

let mainDiv = document.createElement("div"); // Fő DIV létrehozása
mainDiv.style.position = "relative";
cTD.appendChild(mainDiv); // A fő DIV hozzáadása a TD -hez
secminhourCoordZero();    // Mutatók koordináta tömbjeinek inicializálása
mouseCoordZero();         // Egérkoordináták tömbjének inicializálása
console.log(numberDIVs);
console.log(secCoord);

// Óra számainak (1-12) alapbeállítása
addDiv("1", "dig1", "dig", 50, -87, numberDIVs, mainDiv);
addDiv("2", "dig2", "dig", 87, -50, numberDIVs, mainDiv);
addDiv("3", "dig3", "dig", 100, 0, numberDIVs, mainDiv);
addDiv("4", "dig4", "dig", 87, 50, numberDIVs, mainDiv);
addDiv("5", "dig5", "dig", 50, 87, numberDIVs, mainDiv);
addDiv("6", "dig6", "dig", 0, 100, numberDIVs, mainDiv);
addDiv("7", "dig7", "dig", -50, 87, numberDIVs, mainDiv);
addDiv("8", "dig8", "dig", -87, 50, numberDIVs, mainDiv);
addDiv("9", "dig9", "dig", -100, 0, numberDIVs, mainDiv);
addDiv("10", "dig10", "dig", -87, -50, numberDIVs, mainDiv);
addDiv("11", "dig11", "dig", -50, -87, numberDIVs, mainDiv);
addDiv("12", "dig12", "dig", 0, -100, numberDIVs, mainDiv);

// Mutatók pontjainak alabeállítása
for (let ci = 0; ci < pointsNum; ci++) {
    addDiv(".", "sec1", "dig", 0, 0, secDIVs, mainDiv);
    secDIVs[ci].style.color = "green";
    secDIVs[ci].style.fontSize = "30px";
    addDiv(".", "min1", "dig", 0, 0, minDIVs, mainDiv);
    minDIVs[ci].style.color = "red";
    minDIVs[ci].style.fontSize = "30px";
    addDiv(".", "hour1", "dig", 0, 0, hourDIVs, mainDiv);
    hourDIVs[ci].style.color = "black";
    hourDIVs[ci].style.fontSize = "30px";
}
