let cTD = document.getElementById("cTD");
let newX = 0; let newY = 0; oldX = 0; oldY = 0;
let minFontSize = 20;
let midFontSize = 40;
let maxFontSize = 60;
let pointsNum = 30;
let act_mC = 0; let new_mC = 1; let numOf_mC = 100; let mXY = [];
let clockSize = 2; let actHour = 0;
let clockNumbers = []; let clockXY = []; let clockSpeed = [33, 30, 27, 24, 21, 18, 15, 12, 10, 9, 8, 7];
let pointSpeed = [5, 6, 7, 8 ,9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ,20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];
let secPoints = []; secCoord = [];
let minPoints = []; minCoord = [];
let hourPoints = []; hourCoord = [];
let timerNumSize = setInterval(setNumSize, 100);    // Számok fontméret változtatása
let timerClockMove = setInterval(setMoveCoord, 10); // Pozíció koordináták számolása
let timerTime = setInterval(setTimeAndCoord, 1000); // Mutatók alapkoordinátáinak számolása, másodpercenként
let timerMouseCoordChange = setInterval(setMouseCoordNum, 50);
let moveSpeed = 50;
document.getElementById("id_html").addEventListener("mousemove", function (event) { mouseXY(event) });

function setMouseCoordNum() {
  /*  if (act_mC == new_mC) return;
    act_mC++;
    if (act_mC == numOf_mC)
        act_mC = 0;*/
}

function secminhourCoordZero() { // Mutatók tömbjeinek inicializálása
    for (let ci = 0; ci < pointsNum; ci++) {
        secCoord.push({ "X": 0, "Y": 0 });
        minCoord.push({ "X": 0, "Y": 0 });
        hourCoord.push({ "X": 0, "Y": 0 });
    }
}

function mouseCoordZero() {
    for (let ci = 0; ci < numOf_mC; ci++) { mXY.push({ "X": 0, "Y": 0}); }
}

function setTimeAndCoord() { // Mutatók alapkoordinátáinak számolása, másodpercenként
    let myTime = new Date();
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

function setX(oldX, newX, arraySpeed, arrayDiv, ci) { // X koordináta általános számolása 
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

function setY(oldY, newY, arraySpeed, arrayDiv, ci) { // Y koordináta általános számolása 
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

function setMoveCoord() { // Pozíció koordináták számolása
    for (let ci in clockNumbers) {
        newX = parseFloat(clockSize * clockXY[ci].x + mXY[act_mC].X - (parseFloat(clockNumbers[ci].style.fontSize) / 2));
        newY = parseFloat(clockSize * clockXY[ci].y + mXY[act_mC].Y - (parseFloat(clockNumbers[ci].style.fontSize) / 2));
        oldX = parseFloat(clockNumbers[ci].style.left);
        oldY = parseFloat(clockNumbers[ci].style.top);
        setX(oldX, newX, clockSpeed, clockNumbers, ci);
        setY(oldY, newY, clockSpeed, clockNumbers, ci);
    }

    for (let ci in secPoints) {
        newX = parseFloat(secCoord[ci].X + mXY[act_mC].X) - 13;
        newY = parseFloat(secCoord[ci].Y + mXY[act_mC].Y) - 13;
        oldX = parseFloat(secPoints[ci].style.left);
        oldY = parseFloat(secPoints[ci].style.top);
        setX(oldX, newX, pointSpeed, secPoints, ci);
        setY(oldY, newY, pointSpeed, secPoints, ci);
    }

    for (let ci in minPoints) {
        newX = parseFloat(minCoord[ci].X + mXY[act_mC].X) - 13;
        newY = parseFloat(minCoord[ci].Y + mXY[act_mC].Y) - 13;
        oldX = parseFloat(minPoints[ci].style.left);
        oldY = parseFloat(minPoints[ci].style.top);
        setX(oldX, newX, pointSpeed, minPoints, ci);
        setY(oldY, newY, pointSpeed, minPoints, ci);
    }

    for (let ci in hourPoints) {
        newX = parseFloat(hourCoord[ci].X + mXY[act_mC].X) - 13;
        newY = parseFloat(hourCoord[ci].Y + mXY[act_mC].Y) - 13;
        oldX = parseFloat(hourPoints[ci].style.left);
        oldY = parseFloat(hourPoints[ci].style.top);
        setX(oldX, newX, pointSpeed, hourPoints, ci);
        setY(oldY, newY, pointSpeed, hourPoints, ci);
    }
}

function setNumSize() { // Számok fontméret változtatása
    if (actHour == 11) {
        clockNumbers[11].style.fontSize = maxFontSize + "px";
        clockNumbers[10].style.fontSize = midFontSize + "px";
        clockNumbers[9].style.fontSize = minFontSize + "px";
        clockNumbers[0].style.fontSize = midFontSize + "px";
        actHour = 0;
    } else
        if (actHour == 0) {
            clockNumbers[0].style.fontSize = maxFontSize + "px";
            clockNumbers[11].style.fontSize = midFontSize + "px";
            clockNumbers[10].style.fontSize = minFontSize + "px";
            clockNumbers[1].style.fontSize = midFontSize + "px";
            actHour++;
        } else
            if (actHour == 1) {
                clockNumbers[1].style.fontSize = maxFontSize + "px";
                clockNumbers[0].style.fontSize = midFontSize + "px";
                clockNumbers[11].style.fontSize = minFontSize + "px";
                clockNumbers[2].style.fontSize = midFontSize + "px";
                actHour++;
            }
            else {
                clockNumbers[actHour].style.fontSize = maxFontSize + "px";
                clockNumbers[actHour - 1].style.fontSize = midFontSize + "px";
                clockNumbers[actHour - 2].style.fontSize = minFontSize + "px";
                clockNumbers[actHour + 1].style.fontSize = midFontSize + "px";
                actHour++;
            }
}

function mouseXY(event) {
    mXY[new_mC].X = event.clientX;
    mXY[new_mC].Y = event.clientY;

    act_mC = new_mC;//!!!

    new_mC++;
    if (new_mC == numOf_mC)
        new_mC = 0;

}

function addDiv(d_HTML, d_id, d_class, d_x, d_y, array, parent) {
    let div = document.createElement("div");

    div.innerHTML = d_HTML;
    div.id = d_id;
    div.classList = d_class;
    div.style.fontSize = minFontSize + "px";
    div.style.top = (clockSize * d_y + "px");
    div.style.left = (clockSize * d_x + "px");

    div.style.position = "absolute";
    div.style.textAlign = "center";
    //if (array == secPoints) div.style.color = "green";

    parent.appendChild(div);
    array.push(div);
    //clockNumbers.push(div);
    clockXY.push({ y: d_y, x: d_x });
}

let mainDiv = document.createElement("div");
/*mainDiv.style.width = "300px";
mainDiv.style.height = "300px";*/
mainDiv.style.position = "relative";
cTD.appendChild(mainDiv);
secminhourCoordZero();
mouseCoordZero();
console.log(clockNumbers);
console.log(secCoord);

addDiv("1", "dig1", "dig", 50, -87, clockNumbers, mainDiv);
addDiv("2", "dig2", "dig", 87, -50, clockNumbers, mainDiv);
addDiv("3", "dig3", "dig", 100, 0, clockNumbers, mainDiv);
addDiv("4", "dig4", "dig", 87, 50, clockNumbers, mainDiv);
addDiv("5", "dig5", "dig", 50, 87, clockNumbers, mainDiv);
addDiv("6", "dig6", "dig", 0, 100, clockNumbers, mainDiv);
addDiv("7", "dig7", "dig", -50, 87, clockNumbers, mainDiv);
addDiv("8", "dig8", "dig", -87, 50, clockNumbers, mainDiv);
addDiv("9", "dig9", "dig", -100, 0, clockNumbers, mainDiv);
addDiv("10", "dig10", "dig", -87, -50, clockNumbers, mainDiv);
addDiv("11", "dig11", "dig", -50, -87, clockNumbers, mainDiv);
addDiv("12", "dig12", "dig", 0, -100, clockNumbers, mainDiv);

for (let ci = 0; ci < pointsNum; ci++) {
    addDiv(".", "sec1", "dig", 0, 0, secPoints, mainDiv);
    secPoints[ci].style.color = "green";
    secPoints[ci].style.fontSize = "30px";
    addDiv(".", "min1", "dig", 0, 0, minPoints, mainDiv);
    minPoints[ci].style.color = "red";
    minPoints[ci].style.fontSize = "30px";
    addDiv(".", "hour1", "dig", 0, 0, hourPoints, mainDiv);
    hourPoints[ci].style.color = "black";
    hourPoints[ci].style.fontSize = "30px";
}


/*addDiv("1", "dig1", "dig", -49.823,  5.681, mainDiv);
addDiv("2", "dig2", "dig", -35.223, 20.511, mainDiv);
addDiv("3", "dig3", "dig", -15.149, 25.999, mainDiv);
addDiv("4", "dig4", "dig", 4.96459, 20.6614, mainDiv);
addDiv("5", "dig5", "dig", 19.6749, 5.94126, mainDiv);
addDiv("6", "dig6", "dig", 24.9996, -14.1765, mainDiv);
addDiv("7", "dig7", "dig", 19.4976, -34.2464, mainDiv);
addDiv("8", "dig8", "dig", 4.65796, -48.8363, mainDiv);
addDiv("9", "dig9", "dig", -15.5025, -53.9968, mainDiv);
addDiv("10", "dig10", "dig", -35.527, -48.3314, mainDiv);
addDiv("11", "dig11", "dig", -49.9953, -33.3734, mainDiv);
addDiv("12", "dig12", "dig", -54.9914, -13.1715, mainDiv);*/


/*<div style="width:120px;height:100px;position: relative;left:58px;top:50px;">
<div id="dig1" class="dig" style="top: -49.823px; left: 5.6814px;">1</div>
<div id="dig2" class="dig" style="top: -35.2232px; left: 20.5112px;">2</div>
<div id="dig3" class="dig" style="top: -15.1496px; left: 25.9997px;">3</div>
<div id="dig4" class="dig" style="top: 4.96459px; left: 20.6614px;">4</div>
<div id="dig5" class="dig" style="top: 19.6749px; left: 5.94126px;">5</div>
<div id="dig6" class="dig" style="top: 24.9996px; left: -14.1765px;">6</div>
<div id="dig7" class="dig" style="top: 19.4976px; left: -34.2464px;">7</div>
<div id="dig8" class="dig" style="top: 4.65796px; left: -48.8363px;">8</div>
<div id="dig9" class="dig" style="top: -15.5025px; left: -53.9968px;">9</div>
<div id="dig10" class="dig" style="top: -35.527px; left: -48.3314px;">10</div>
<div id="dig11" class="dig" style="top: -49.9953px; left: -33.3734px;">11</div>
<div id="dig12" class="dig" style="top: -54.9914px; left: -13.1715px;">12</div>

<div id="hour1" class="hour" style="top: 0px; left: 0px;"></div>
<div id="hour2" class="hour" style="top: 0.621322px; left: -7.97584px;"></div>
<div id="hour3" class="hour" style="top: 1.24264px; left: -15.9517px;"></div>
<div id="hour4" class="hour" style="top: 1.86396px; left: -23.9275px;"></div>

<div id="min1" class="min" style="top: 0px; left: 0px;"></div>
<div id="min2" class="min" style="top: -4.70743px; left: -6.46839px;"></div>
<div id="min3" class="min" style="top: -9.41487px; left: -12.9368px;"></div>
<div id="min4" class="min" style="top: -14.1223px; left: -19.4052px;"></div>
<div id="min5" class="min" style="top: -18.8297px; left: -25.8736px;"></div>

<div id="sec1" class="sec" style="top: 0px; left: 0px;"></div>
<div id="sec2" class="sec" style="top: -4.00552px; left: -6.92502px;"></div>
<div id="sec3" class="sec" style="top: -8.01103px; left: -13.85px;"></div>
<div id="sec4" class="sec" style="top: -12.0165px; left: -20.775px;"></div>
<div id="sec5" class="sec" style="top: -16.0221px; left: -27.7001px;"></div>
<div id="sec6" class="sec" style="top: -20.0276px; left: -34.6251px;"></div>
</div>*/
