let p = document.getElementById("p");
let c_main   = document.getElementById("mainCanvas");
let ctx_main = c_main.getContext("2d");

let timerMain      = setInterval(timerMainF, 10);
let timerArcmove   = setInterval(tArcMove, 10);
let timerArcrotate = setInterval(tArcRotate, 10);
let timerSetTime   = setInterval(tSetTime, 500);
let isArcRotate = true; let actRotateAngle = 0; let rotateAngle = 0.005;
let isMoveAfterMouse = true;
let speedMax = 10;
let speedMin = 1;
let mouseX; let mouseY;
imgData = ctx_main.getImageData(0, 0, c_main.width, c_main.height);
let img_backg = new Image(); // Used for background image
img_backg.src = '/img/backG03.jpg'; // Background image source

let arcAngle  = 0;
let clockSize = 1;
let hourSectionSize = 0.1667;
let secSectionSize  = 0.0333;

let sec, min, hour; tSetTime();

document.getElementById("btnZoomIn").onclick  = function() { if (clockSize < 3.5) clockSize+= 0.5 };
document.getElementById("btnZoomOut").onclick = function() { if (clockSize > 0.5) clockSize-= 0.5 };
document.getElementById("cbRotate").checked = isArcRotate;
document.getElementById("cbMoveAfterMouse").checked = isMoveAfterMouse;
document.getElementById("cbRotate").onclick = function() { isArcRotate = document.getElementById("cbRotate").checked; }
document.getElementById("cbMoveAfterMouse").onclick = function() { isMoveAfterMouse = document.getElementById("cbMoveAfterMouse").checked; }
document.getElementById("btnRestart").onclick = function() { elems = []; initElements(); };
document.getElementById("btn001").onclick     = function() { 
    if (document.getElementById("menu001").style.visibility == "visible") {
        document.getElementById("menu001").style.visibility = "hidden";
        this.style.color = "black";
    }
    else {
        document.getElementById("menu001").style.visibility = "visible";
        this.style.color = "green";
    }
 };

let elems = [];

c_main.addEventListener("mousemove", function(event) {
    mouseX = event.layerX;
    mouseY = event.layerY;
});

function tSetTime() {
    let myTime = new Date(); // Aktuális idő lekérdezése
    sec = myTime.getSeconds();
    min = myTime.getMinutes();
    hour = myTime.getHours();
}

function initElements() {
    // Init hour red / black arcs
    let actSpeed = 10;
    for (let ci = 1; ci < 12; ci+=2) {    
        actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
        elems.push({ type : 1, speed : actSpeed, X : 200, Y : 200, fillR : 255, fillG : 0, fillB : 0, strokeColor : "black", D : 257, angle : ci * hourSectionSize, secSize : hourSectionSize, rotateLeft : true });
        actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
        elems.push({ type : 1, speed : actSpeed, X : 200, Y : 200, fillR : 0, fillG : 0, fillB : 0, strokeColor : "black", D : 257, angle : (ci + 1) * hourSectionSize, secSize : hourSectionSize, rotateLeft : true });        
    }

    // init secund red / black arcs
    for (let ci = 1; ci < 60; ci+=2) {        
        actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
        elems.push({ type : 1, speed : actSpeed, X : 200, Y : 200, fillR : 0, fillG : 0, fillB : 0, strokeColor : "black", D : 175, angle : ci * secSectionSize + secSectionSize / 2, secSize : secSectionSize, rotateLeft : false });
        actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
        elems.push({ type : 1, speed : actSpeed, X : 200, Y : 200, fillR : 255, fillG : 0, fillB : 0, strokeColor : "black", D : 177, angle : (ci + 1) * secSectionSize + secSectionSize / 2, secSize : secSectionSize, rotateLeft : false });
    }

    // init hour hands
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "hour", type : 2, speed : actSpeed, X : 200, Y : 200, strokeColor : "green", D : 70, angle : 0 });
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "min", type : 2, speed : actSpeed, X : 200, Y : 200, strokeColor : "blue", D : 85, angle : 0 });
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "sec", type : 2, speed : actSpeed, X : 200, Y : 200, strokeColor : "grey", D : 85, angle : 0 });

    // init numbers
    let D_base = 115;
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "12", type : 3, speed : actSpeed, X : 200, Y : 200, D : D_base, angle : 270});
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "1", type : 3, speed : actSpeed, X : 200, Y : 200, D : D_base, angle : 300});
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "2", type : 3, speed : actSpeed, X : 200, Y : 200, D : D_base, angle : 330});
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "3", type : 3, speed : actSpeed, X : 200, Y : 200, D : D_base, angle : 0});
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "4", type : 3, speed : actSpeed, X : 200, Y : 200, D : D_base, angle : 30});
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "5", type : 3, speed : actSpeed, X : 200, Y : 200, D : D_base, angle : 60});
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "6", type : 3, speed : actSpeed, X : 200, Y : 200, D : D_base, angle : 90});
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "7", type : 3, speed : actSpeed, X : 200, Y : 200, D : D_base, angle : 120});
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "8", type : 3, speed : actSpeed, X : 200, Y : 200, D : D_base, angle : 150});
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "9", type : 3, speed : actSpeed, X : 200, Y : 200, D : D_base, angle : 180});
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "10", type : 3, speed : actSpeed, X : 200, Y : 200, D : D_base, angle : 210});
    actSpeed = Math.floor(Math.random() * (speedMax - speedMin)) + speedMin;
    elems.push({ name : "11", type : 3, speed : actSpeed, X : 200, Y : 200, D : D_base, angle : 240});

}

function tArcRotate() {
    if (!isArcRotate) return;
    for (let ci = 0; ci < elems.length; ci++) {
        if (elems[ci].type == 1)
            if (elems[ci].rotateLeft)
                elems[ci].angle += rotateAngle;
            else
                elems[ci].angle -= rotateAngle;
    }        
}

function tArcMove() {
    if (arcAngle > 2)
        arcAngle = 0;
    else
        arcAngle += 0.005;
}

hMain = document.getElementById("header_main");

function timerMainF() {    
    c_main.width  = window.innerWidth - 18;
    c_main.height = window.innerHeight - 68;
    p.innerHTML = "Element array length: " + elems.length + 
                  "<br>Canvas width: " + c_main.width +
                  "<br>Header width: " + hMain.width +
                  "<br>Hour: " + hour +
                  "<br>Min: " + min +
                  "<br>Sec: " + sec +
                  "<br>Clock size: " + clockSize;
    drawMap();
}

function setXY(data) {
    if (isMoveAfterMouse) {
        if (mouseX > data.X) {
            if ((mouseX - data.X) > data.speed)
                data.X = data.X + data.speed;
            else
                data.X = mouseX;
        }
        else {
           if ((data.X - mouseX) > data.speed)
                data.X = data.X - data.speed;
            else
                data.X = mouseX;
        }
    
        if (mouseY > data.Y) {
            if ((mouseY - data.Y) > data.speed)
                data.Y = data.Y + data.speed;
            else
                data.Y = mouseY;
        }
        else {
           if ((data.Y - mouseY) > data.speed)
                data.Y = data.Y - data.speed;
            else
                data.Y = mouseY;
        }    
    }
}

function drawArcSection(data) { // for array draw
    setXY(data);    

    ctx_main.moveTo(data.X, data.Y);
    ctx_main.beginPath();
    ctx_main.strokeStyle = data.strokeColor;
    let a = (c_main.height / 10000.0) * data.Y;
    ctx_main.fillStyle   = "rgba(" + data.fillR +", " 
                                   + data.X / (c_main.width / 256) + 30 + ", " 
                                   + data.X / (c_main.width / 256) + 30 + ", "
                                   + data.Y / (c_main.height - 200) +")";
    ctx_main.arc(data.X, data.Y, (data.D * clockSize) / 2, 
        data.angle * Math.PI,
        (data.angle + data.secSize) * Math.PI);
    ctx_main.arc(data.X, data.Y, (data.D * clockSize) / 1.8, 
        (data.angle + data.secSize) * Math.PI,
        data.angle * Math.PI, true);
    ctx_main.arc(data.X, data.Y, (data.D * clockSize) / 2, 
        data.angle * Math.PI,
        data.angle * Math.PI);
    ctx_main.fill();
    ctx_main.stroke();
}

function drawHourHands(data) {
    setXY(data);

    ctx_main.beginPath();
    ctx_main.moveTo(data.X, data.Y);
    ctx_main.strokeStyle = data.strokeColor;

    switch (data.name) {
        case "hour": ctx_main.lineTo(data.X + Math.cos(Math.PI * ((hour * 30) - 90 + (30 * (min / 60))) / 180) * data.D * clockSize,
                    data.Y + Math.sin(Math.PI * ((hour * 30) - 90 + (30 * (min / 60))) / 180) * data.D * clockSize);
                    ctx_main.lineWidth = 3;
                    break;
        case "min": ctx_main.lineTo(data.X + Math.cos(Math.PI * ((min * 6) - 90) / 180) * data.D * clockSize,
                    data.Y + Math.sin(Math.PI * ((min * 6) - 90) / 180) * data.D * clockSize);
                    ctx_main.lineWidth = 2;
                    break;
        case "sec": ctx_main.lineTo(data.X + Math.cos(Math.PI * ((sec * 6) - 90) / 180) * data.D * clockSize,
                    data.Y + Math.sin(Math.PI * ((sec * 6) - 90) / 180) * data.D * clockSize);
                    ctx_main.lineWidth = 1;
    }
    ctx_main.stroke();
}

function drawNumbers(data) {
    setXY(data);

    ctx_main.textAlign = "center";
    ctx_main.fillStyle = "yellow";
    ctx_main.strokeStyle = "black";
    ctx_main.lineWidth = clockSize * 1.5;
    ctx_main.font = 25 * clockSize + "px serif";
    ctx_main.strokeText(data.name, data.X + Math.cos(Math.PI * data.angle / 180) * data.D * clockSize, 9 * clockSize +
    data.Y + Math.sin(Math.PI * data.angle / 180) * data.D * clockSize);
    ctx_main.fillText(data.name, data.X + Math.cos(Math.PI * data.angle / 180) * data.D * clockSize, 9 * clockSize +
    data.Y + Math.sin(Math.PI * data.angle / 180) * data.D * clockSize);
}

function drawElements() {
    for (let ci = 0; ci < elems.length; ci++) {   
        switch (elems[ci].type) {
            case 1: drawArcSection(elems[ci]); break; // arc
            case 2: drawHourHands(elems[ci]);  break; // hour hands
            case 3: drawNumbers(elems[ci]);    break; // numbers
        }        
    }
}

function drawMap() {
    //ctx_main.putImageData(imgData, 0, 0); // move changes to temp canvas
    ctx_main.drawImage(img_backg, 0, 0, c_main.width, c_main.height); // draw background to main canvas
  //  drawCircle();
    drawElements();
}

function drawOneArcSection(angle, fillColor, strokeColor, cX1, cY1, cD) {
    ctx_main.moveTo(cX1, cY1); // for manual draw
    ctx_main.beginPath();
    ctx_main.strokeStyle = strokeColor;
    ctx_main.fillStyle = fillColor;
    ctx_main.arc(cX1, cY1, cD / 2, 
        angle * Math.PI,
        (angle + hourSectionSize) * Math.PI);
    ctx_main.arc(cX1, cY1, cD / 1.8, 
        (angle + hourSectionSize) * Math.PI,
        angle * Math.PI, true);
    ctx_main.arc(cX1, cY1, cD / 2, 
        angle * Math.PI,
        angle * Math.PI);
    ctx_main.fill();
    ctx_main.stroke();
}

function drawCircle() {
    let cX1 = mouseX;
    let cY1 = mouseY;
    let cD  = 200;
    let num = 0.656;
    ctx_main.beginPath();
    ctx_main.moveTo(cX1, cY1);
    ctx_main.strokeStyle = "black";
    //ctx_main.bezierCurveTo(cX1, cY1 - num * cD, cX1 + cD, cY1 - num * cD, cX1 + cD, cY1);
    //ctx_main.bezierCurveTo(cX1 + cD, cY1 + num * cD, cX1, cY1 + num * cD, cX1, cY1);
    ctx_main.stroke();

    for (let ci = 0; ci < 12; ci+=2) {        
        drawOneArcSection(arcAngle + ci * hourSectionSize, "red", "black", cX1, cY1, cD * clockSize);
        drawOneArcSection(arcAngle + (ci + 1) * hourSectionSize, "black", "blacks", cX1, cY1, cD);
    }
}

initElements();

/*
var imported = document.createElement('script');
imported.src = '/path/to/imported/script';
document.head.appendChild(imported);
*/