document.getElementById("btnTest").onclick    = testClick;
document.getElementById("btnStart1").onclick  = testClick;

document.getElementById("btnTest2").onclick   = test2Click;
document.getElementById("btnStart2").onclick  = test2Click;

document.getElementById("btnRestart").onclick  = restartClick;
document.getElementById("btnRestart2").onclick = restartClick;

document.getElementById("body").onload = onLoad;
document.getElementById("cbSmoothed").onclick = smoothClick;

let p = document.getElementById("pOne");

let timerMain = setInterval(timerMainF, 0);
let timerStaticMoves = setInterval(timerStaticMovesF, 50);

let mapSizeX = 450;
let mapSizeY = 250;
let colorBackGr = "lightblue";
let phisicsOn   = false;
let zoom   = 1;
let mouseX = 0; let mzX = 0;
let mouseY = 0; let mzY = 0;

let c_zoom    = document.getElementById("zoomCanvas");
let ctx_zoom  = c_zoom.getContext("2d");
c_zoom.width  = mapSizeX * zoom / 1;
c_zoom.height = mapSizeY * zoom / 1;
ctx_zoom.fillStyle = "white";

let c_main = document.getElementById("mainCanvas");
let ctx_main = c_main.getContext("2d");
c_main.width  = mapSizeX * zoom;
c_main.height = mapSizeY * zoom;
c_main.onclick = function() { zoom_fixed = !zoom_fixed; };

let zoom_img = ctx_main.getImageData(100, 100, c_zoom.width / 3, c_zoom.height / 3);
let zoom_c = 4; let zoom_c_max = 6;
document.getElementById("btnZoom").onclick = btnZoomClick;
let txtZoom = document.getElementById("txtZoom");


let map     = [];
let water   = []; 
//let water_2 = [];
let blocks  = [];
let numOfTest = 0;
let randomMultiplier = 4;
let zoomX, zoomY;
let smooth = false;
let zoom_fixed = false;

let img_backg = new Image(); // Used for background image
img_backg.src = '/img/backG02.jpg'; // Background image source

let tempCanvas = document.createElement("canvas");
tempCanvas.width  = mapSizeX * zoom;
tempCanvas.height = mapSizeY * zoom;
ctx_temp = tempCanvas.getContext("2d");
imgData = ctx_temp.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

c_main.addEventListener("mousemove", function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

c_zoom.addEventListener("mousemove", function(event) {
   // mzX = event.clientX;
    mzX = event.layerX;
    //mzY = event.clientY;
    mzY = event.layerY;
    p.innerHTML = mzX;
});

function btnZoomClick() {
    if (zoom_c < zoom_c_max)
        zoom_c++;
    else
        zoom_c = 1;

    txtZoom.innerHTML = zoom_c + "X";
}

function setSmooth(ctx) {
    if (smooth) {
        ctx.imageSmoothingEnabled = true;
        ctx.mozImageSmoothingEnabled = true;
        ctx.webkitImageSmoothingEnabled = true;
        ctx.msImageSmoothingEnabled = true;      
    }
    else {
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;      
    }
}

function smoothClick() {
    smooth = this.checked;
    setSmooth(ctx_zoom);
}

function setPixels(r, g, b, a, sX, sY) {
    let pixelIndex = 0;    
    for (let y = 0; y < zoom; y++) {
        pixelIndex  = (sY * mapSizeX * zoom * zoom + (sX * zoom)) * 4;            
        pixelIndex += y * (mapSizeX * zoom * 4);
        for (x = 0; x < zoom; x++) {            
            imgData.data[pixelIndex]     = r;
            imgData.data[pixelIndex + 1] = g;
            imgData.data[pixelIndex + 2] = b;
            imgData.data[pixelIndex + 3] = a;
//            imgData.data[pixelIndex] = (a << 24) | (b/2 << 16) | (g < 8) | r;
            pixelIndex += 4;
        }    
    }
}

function makeImgData() { // redraw only the moving elements
    for (let x = 0; x < mapSizeX; x++)
        for (let y = 0; y < mapSizeY; y++) {
            switch (getColor(x, y)) {
                case colorBackGr : setPixels(0, 0, 0, 0, x, y);         break;
                case "white"     : setPixels(255, 255, 255, 255, x, y); break;
                case "blue"      : setPixels(0, 50, 255, 155, x, y);    break;
                //case "blue"      : setPixels(0, 50, 255, 155 - Math.floor(Math.random() * 90), x, y); break;
                case "green"     : setPixels(0, 255, 255, 155, x, y);
        }    
    }
}

function drawMap2() {    
    makeImgData();
    ctx_main.drawImage(img_backg, 0, 0, mapSizeX * zoom, mapSizeY * zoom); // draw background to main canvas
    ctx_temp.putImageData(imgData, 0, 0); // move changes to temp canvas
    ctx_main.drawImage(tempCanvas, 0, 0); // move temp canvas to main canvas

    if (!zoom_fixed) {
        zoomX = mouseX - (c_zoom.width / zoom_c / 2);
        zoomY = mouseY - (c_zoom.height / zoom_c / 2);
        ctx_main.strokeStyle = "black";
    }
    else
        ctx_main.strokeStyle = "green";

    ctx_main.beginPath();
    ctx_zoom.fillRect(0,0, c_zoom.width, c_zoom.height); // Clear zoom canvas
    ctx_main.rect(zoomX -1, zoomY -1, c_zoom.width / zoom_c + 2, c_zoom.height / zoom_c + 2); // Draw zoom rectangle
    ctx_main.stroke();

    ctx_zoom.drawImage(c_main,
        zoomX, zoomY, c_zoom.width / zoom_c, c_zoom.height / zoom_c, 
        0, 0, c_zoom.width, c_zoom.height); // Move data to zoom canvas
}

function main() {
    // draw everything once (!), after it, only changing element will be redraw
    for (let x = 0; x < mapSizeX; x++)
        for (let y = 0; y < mapSizeY; y++) {
            switch (getColor(x, y)) {
                case colorBackGr:  setPixels(0, 0, 0, 0, x, y); break;
                case "white"  : setPixels(255, 255, 255, 255, x, y); break;
                case "yellow" : setPixels(255, 255, 0, 255, x, y);   break;
                case "black"  : setPixels(0, 0, 0, 255, x, y);   break;
                case "red"    : setPixels(255, 0, 0, 255, x, y); break;
                case "blue"   : setPixels(0, 50, 255, 155 /*- Math.floor(Math.random() * 30)*/, x, y); break;
                case "green"  : setPixels(0, 255, 255, 155, x, y);
        }    
    }

    setSmooth(ctx_zoom);
    setSmooth(ctx_temp);
    txtZoom.innerHTML = zoom_c + "X";
  //  window.requestAnimationFrame(main);    
  //  drawMap2();
}

function makeOneBlock(data) {
    for (let ci = data.x; ci < (data.x + data.xSize); ci++)
        for (let ci2 = data.y; ci2 < (data.y + data.ySize); ci2++) {
            map[ci + ci2 * mapSizeX].color = data.color;
            map[ci + ci2 * mapSizeX].type  = data.type;
        }    
}

function makeBlockType2(x, y, xSize, depth, up) { // 
    for (let ci2 = 0; ci2 < depth; ci2++) {
        for (let ci = x; ci <= x + xSize; ci++)
            if (up) {
                map[ci + ci2 + (y - (ci - x)) * mapSizeX].color = "yellow";
                map[ci + ci2 + (y - (ci - x)) * mapSizeX].type = 1;    
            }
            else {
                map[ci + ci2 + (y + (ci - x)) * mapSizeX].color = "yellow";
                map[ci + ci2 + (y + (ci - x)) * mapSizeX].type = 1;    
            }
        }
}

function initBlocks() {
    blocks = []; // Clear the array
    // Background
    blocks.push({x : 0, y : 0, xSize : mapSizeX, ySize : mapSizeY,
        color : colorBackGr, type : 0, move : false})

    // Moving blocks
    blocks.push({x : 15, y : 30, xSize : 10, ySize : 5, 
                 color : "white" , type : 1, move : true, 
                 sX : 15, sY : 30, distX : 0, distY : 20});    
    blocks.push({x : 60, y : 30, xSize : 5, ySize : 5, 
                 color : "white" , type : 1, move : true, 
                 sX : 60, sY : 30, distX : 5, distY : 0});   
    blocks.push({x : 100, y : 110, xSize : 100, ySize : 5, 
                 color : "white" , type : 1, move : true, 
                 sX : 150, sY : 105, distX : 50, distY : 0});   


    // Static blocks
    blocks.push({x : 10, y : 5, xSize : 5, ySize : 40,
                color : "red", type : 1, move : false});
    blocks.push({x : 65, y : 5, xSize : 5, ySize : 25,
                color : "red", type : 1, move : false});
    blocks.push({x : 65, y : 35, xSize : 5, ySize : 5,
                color : "red", type : 1, move : false});
    blocks.push({x : 25, y : 30, xSize : 35, ySize : 5,
                color : "red", type : 1, move : false});
    blocks.push({x : 25, y : 35, xSize : 5, ySize : 10,
                color : "red", type : 1, move : false});

    blocks.push({x : 15, y : 55, xSize : 10, ySize : 10,
                color : "black", type : 1, move : false});
    blocks.push({x : 10, y : 75, xSize : 30, ySize : 5,
                color : "black", type : 1, move : false});
    blocks.push({x : 15, y : 80, xSize : 30, ySize : 5,
                color : "black", type : 1, move : false});
    blocks.push({x : 100, y : 5, xSize : 5, ySize : 100,
                color : "red", type : 1, move : false});
    blocks.push({x : 100, y : 105, xSize : 50, ySize : 5,
                color : "red", type : 1, move : false});
            

    blocks.forEach(makeOneBlock);
    
    // Water init
    makeWaterRect(  5,  0,  55,   5, "green");
    makeWaterRect( 15,  5,  50,  25, "blue");

    makeWaterRect( 105,  5,  100,  100, "blue");

    // Test blocks
    makeBlockType2(55, 55, 15, 5, true);
    makeBlockType2(40, 55, 15, 5, false);

    makeBlockType2(200, 110, 100, 5, true);
}

function onLoad() {
    resetMap();
    initBlocks();    
    p.innerHTML = "Phisics ON: " + phisicsOn;
    main();
}

function moveBlock(data) {
    if (!phisicsOn) return;
    if (data.move == false) return; // Nothing to do with static blocks
    if ((data.y == data.sY + data.distY) && (data.x == data.sX + data.distX)) return; // Move finished

    for (let ci = data.x; ci < (data.x + data.xSize); ci++)
        for (let ci2 = data.y; ci2 < (data.y + data.ySize); ci2++) {
            map[ci + ci2 * mapSizeX].color = colorBackGr;
            map[ci + ci2 * mapSizeX].type  = 0;
        }

    if (data.x < data.sX + data.distX)
        data.x++;
    else if (data.x != data.sX + data.distX)
        data.x--;
    if (data.y < data.sY + data.distY)
        data.y++;

    for (let ci = data.x; ci < (data.x + data.xSize); ci++)
        for (let ci2 = data.y; ci2 < (data.y + data.ySize); ci2++) {
            map[ci + ci2 * mapSizeX].color = data.color;
            map[ci + ci2 * mapSizeX].type  = data.type;
        }
}

function timerStaticMovesF() {
    blocks.forEach(moveBlock);
}

function getType(x, y) {
    return map[x + y * mapSizeX].type;
}

function getColor(x, y) {
    return map[x + y * mapSizeX].color;
}

function setType(x, y, type, color) {
    map[x + y * mapSizeX].type = type;
    map[x + y * mapSizeX].color = color;
}

// Start second type water move
function moveLeftOrRightSecond(direction, range, waterNum) {
    if (direction == 1) range = -range;
    if ((water[waterNum].x + range < 0) || (water[waterNum].x + range > mapSizeX - 1)) return;
    if (getType(water[waterNum].x + range, water[waterNum].y) != 0) return;

    setType(water[waterNum].x, water[waterNum].y, 0, colorBackGr);    
    setType(water[waterNum].x + range, water[waterNum].y, 10, water[waterNum].color);
    water[waterNum].x += range;
}

function MoveDownSecond(waterNum) {
    setType(water[waterNum].x, water[waterNum].y, 0, colorBackGr);    
    setType(water[waterNum].x, water[waterNum].y + 1, 10, water[waterNum].color);
    water[waterNum].y++;
}

function mainWaterMoveSecond() {
    for (let ci = water.length-1; ci >= 0; ci--) {
        if ((water[ci].y < mapSizeY - 1) && (getType(water[ci].x, water[ci].y + 1) == 0)) {
            MoveDownSecond(ci);
        }
        else {
            moveLeftOrRightSecond(Math.floor(Math.random() * 2) + 1, Math.floor(Math.random() * randomMultiplier) + 1, ci);
        }
    }
}
// End second type water move

// Start first type water move
function moveDownFirst(fromX, fromY, toX, toY) {
    setType(toX, toY, 10, map[fromX + fromY * mapSizeX].color);
    setType(fromX, fromY, 0, colorBackGr);
}

function moveLeftRightFirst(fromX, fromY, toX, toY) {
    if ((toX < 0) || (toX > mapSizeX - 1)) return;
    if (getType(toX, toY) != 0) return;
    setType(toX, toY, 10, map[fromX + fromY * mapSizeX].color);
    setType(fromX, fromY, 0, colorBackGr);
}

function moveWaterElementsFirst(x, y, fromLeft) {
    if ((getType(x, y) == 10) && (y < (mapSizeY - 1))) {
        if (getType(x, y + 1) == 0)
            moveDownFirst(x, y, x, y + 1)
        else {
            if (fromLeft) {                
                moveLeftRightFirst(x, y, x - Math.floor(Math.random() * randomMultiplier) - 1, y);
            }
            else {
                moveLeftRightFirst(x, y, x + Math.floor(Math.random() * randomMultiplier) + 1, y);
            }
        }
    }
}

function mainWaterMoveFirst() {
    fromLeft = Math.floor(Math.random() * 2)
    for (let cy = (mapSizeY - 1); cy >= 0; cy--) {
        if (fromLeft)
            for (let cx = 0; cx < mapSizeX; cx++) {
                moveWaterElementsFirst(cx, cy, fromLeft);
            }
        else {
            for (let cx = (mapSizeX - 1); cx >= 0; cx--) {
                moveWaterElementsFirst(cx, cy, fromLeft);
            }
        }
        fromLeft = !fromLeft;
    }
}
// End first type water move

function timerMainF() {
    if (phisicsOn)
        switch (numOfTest) {
            case 1: mainWaterMoveFirst();  break;  // move water elements (one moment)
            case 2: mainWaterMoveSecond(); break; // move water elements (one moment)
        }           
    drawMap2();
}

function testClick() {
    numOfTest = 1;
    phisicsOn = !phisicsOn;        
    p.innerHTML = "Phisics ON: " + phisicsOn;
    document.getElementById("btnTest2").disabled = true;
}

function test2Click() {    
    numOfTest = 2;
    phisicsOn = !phisicsOn;
    p.innerHTML = "Phisics ON: " + phisicsOn;
    document.getElementById("btnTest").disabled = true;
}

function restartClick() {  
    water = [];    
    initBlocks();    
    phisicsOn   = false;
    phisicsOn2  = false;
    p.innerHTML = "Phisics ON: " + phisicsOn;
    document.getElementById("btnTest").disabled  = false;
    document.getElementById("btnTest2").disabled = false;
}

function makeWaterRect(x1, y1, xSize, ySize, color) {
    for (let ci = x1; ci < (x1 + xSize); ci++)
        for (let ci2 = y1; ci2 < (y1 + ySize); ci2++) {
            map[ci + ci2 * mapSizeX].color = color;
            map[ci + ci2 * mapSizeX].type  = 10;
            water.push({color : color, x : ci, y : ci2, xA : 0, yA : 0});
        }
}

function resetMap() {
    // Fill map with "air"
    map = []; // Clear map array
    for (let ci = 0; ci < (mapSizeX * mapSizeY); ci++)
        map.push({type : 0, color : "yellow"});
}

/*function drawMap(targetMap) {
    for (let ci = 0; ci < mapSizeX; ci++)
        for (let ci2 = 0; ci2 < mapSizeY; ci2++) {
            ctx.fillStyle = targetMap[ci + ci2 * mapSizeX].color;            
            ctx.fillRect(ci * zoom, ci2 * zoom, zoom, zoom);
        }
}*/
