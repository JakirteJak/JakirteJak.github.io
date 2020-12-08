document.getElementById("btnTest").onclick = testClick;
document.getElementById("btnRestart").onclick = restartClick;

let p = document.getElementById("pOne");

let mapSizeX = 80;
let mapSizeY = 130;
let colorBackGr   = "lightblue";
let phisicsOn     = false;
let startFromLeft = false;
let zoom = 1;

let c = document.getElementById("myCanvas");
let ctx  = c.getContext("2d");
c.width  = mapSizeX * zoom;
c.height = mapSizeY * zoom;

let map = [];

document.getElementById("body").onload = onLoad;

function onLoad() {
    resetMap();
    makeBasicTileSet();
    drawMap();
    p.innerHTML = phisicsOn;
}

let timerMain = setInterval(timerMainF, 10);

function getType(x, y) {
    return map[x + y * mapSizeX].type;
}

function setType(x, y, type, color) {
    map[x + y * mapSizeX].type = type;
    map[x + y * mapSizeX].color = color;
}

function move(fromX, fromY, toX, toY) {
    setType(toX, toY, 10, "blue");
    setType(fromX, fromY, 0, colorBackGr);
}

function moveWaterElement(x, y, fromLeft) {
    if ((getType(x, y) == 10) && (y < (mapSizeY - 1))) {
        if (getType(x, y + 1) == 0)
            move(x, y, x, y + 1)
        else {
            if (fromLeft) {
                if ((x > 0) && (getType(x - 1, y) == 0))
                    move(x, y, x - 1, y);
            }
            else {
                if ((x < (mapSizeX - 1)) && (getType(x + 1, y) == 0))
                    move(x, y, x + 1, y);
            }
        }
    }
}

function moveTest(fromX, fromY, toX, toY) {
    if ((toX < 0) || (toX > mapSizeX - 1)) return;
    if (getType(toX, toY) != 0) return;
    setType(toX, toY, 10, "blue");
    setType(fromX, fromY, 0, colorBackGr);
}

function moveWaterElementTest(x, y, fromLeft) {
    if ((getType(x, y) == 10) && (y < (mapSizeY - 1))) {
        if (getType(x, y + 1) == 0)
            move(x, y, x, y + 1)
        else {
            if (fromLeft) {                
                moveTest(x, y, x - Math.floor(Math.random() * 2) - 1, y);
            }
            else {
                moveTest(x, y, x + Math.floor(Math.random() * 2) + 1, y);
            }
        }
    }
}

function oneWaterMove() {
    //let fromLeft = startFromLeft;
    fromLeft = Math.floor(Math.random()*2)
    for (let cy = (mapSizeY - 1); cy >= 0; cy--) {
        if (fromLeft)
            for (let cx = 0; cx < mapSizeX; cx++) {
                moveWaterElementTest(cx, cy, fromLeft);
            }
        else {
            for (let cx = (mapSizeX - 1); cx >= 0; cx--) {
                moveWaterElementTest(cx, cy, fromLeft);
            }
        }
        fromLeft = !fromLeft;
    }
}

function timerMainF() {
    if (phisicsOn)
        oneWaterMove();
    drawMap();
    startFromLeft = !startFromLeft;
}

function testClick() {
    makeRect(15, 25, 10, 10, colorBackGr, 0);
    phisicsOn = !phisicsOn;        
    p.innerHTML = phisicsOn;    
}

function restartClick() {
    makeBasicTileSet();
    drawMap();
    phisicsOn = false; p.innerHTML = phisicsOn;
}

function makeRect(x1, y1, xSize, ySize, color, type) {
    ctx.fillStyle = color;
    for (let ci = x1; ci < (x1 + xSize); ci++)
        for (let ci2 = y1; ci2 < (y1 + ySize); ci2++) {
            map[ci + ci2 * mapSizeX].color = color;
            map[ci + ci2 * mapSizeX].type = type;
        }
}

function makeBasicTileSet() {
    makeRect(0, 0, mapSizeX, mapSizeY, colorBackGr, 0);

    makeRect(  5,  5,  10,  30, "red",    1);
    makeRect( 65,  5,  10,  30, "red",    1);
    makeRect( 25, 25,  40,  10, "red",    1);
    makeRect( 15, 25,  10,  10, "black",  2);
    makeRect( 15, 45,  10,  10, "black",  2);
    makeRect( 10, 75,  30,  5, "black",  2);
    makeRect( 15, 80,  30,  5, "black",  2);
    makeRect( 15, 5,  50,  20, "blue",  10);
}

function resetMap() {
    // Fill map with "air"
    for (let ci = 0; ci < (mapSizeX * mapSizeY); ci++)
    {
        map.push({type : 0, color : colorBackGr});
    }
}

function drawMap() {
    //ctx.fillStyle = colorBackGr;
    //ctx.fillRect(0, 0, mapSizeX, mapSizeY);
    for (let ci = 0; ci < mapSizeX; ci++)
        for (let ci2 = 0; ci2 < mapSizeY; ci2++) {
            ctx.fillStyle = map[ci + ci2 * mapSizeX].color;
            ctx.fillRect(ci * zoom, ci2 * zoom, zoom, zoom);
        }
}
