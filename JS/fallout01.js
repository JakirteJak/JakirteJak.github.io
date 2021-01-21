document.getElementById("btnTest").onclick =    testClick;
let p = document.getElementById("pOne");
let p_leftkey  = document.getElementById("pleftkey");
let p_rightkey = document.getElementById("prightkey");
let p_upkey    = document.getElementById("pupkey");
let p_downkey  = document.getElementById("pdownkey");
document.getElementById("body").onload = onLoad;

let mapSizeX = 650;
let mapSizeY = 350;
let zoom = 1;
let animOn = false;

let c = document.getElementById("myCanvas");
let ctx_main = c.getContext("2d");

c.width  = mapSizeX * zoom;
c.height = mapSizeY * zoom;

let frameStart = 0;
let frameEnd   = 7;
let frameNum   = 0;
let actDirection = 0;

let timerMain = setInterval(timerMainF, 140);

let img_backg = new Image();
img_backg.src = '/img/backG02.jpg';

imgArray  = [];
let chars = []; // characters array
let keyMap = [];

let xB = 0;
let yB = 0;
speed  = 0;

loadSequence(imgArray, "/img_fallout/AdvPowerA/walk/HANPWRAB.gif-"); // load images
initChars(); // create characters

function addCharacter(charType, px, py) {
    chars.push({ type : charType, x : px, y : py});
}

function initChars() {
    for (let ci2 = 1; ci2 <=5; ci2++) {
        for (let ci = 1; ci <= 10; ci++)
            addCharacter(1, 
                         xB + ci * 30 + 200 - ci2 * 40, 
                         yB + ci * 30 + ci2 * 15);
    }
/*    addCharacter(1, 30, 100);
    addCharacter(1, 130, 100);*/
}

function loadSequence(target, name) {
    for (let ci2 = 0; ci2 < 6; ci2++)
        for (let ci = 0; ci < 8; ci++) {
            target[ci2 * 8 + ci] = new Image();
            target[ci2 * 8 + ci].src = name + ci2 + "-" + ci + ".gif";            
        }
}

document.onkeydown = document.onkeyup =function(e) {
    keyMap[e.keyCode] = e.type == 'keydown';
}

function testClick() {
    animOn = !animOn;
    p.innerHTML = "Animations ON = " + animOn;
}

function onLoad() {
    p.innerHTML = "Animations ON = " + animOn;
}

function drawOneCharacter(char) {
    ctx_main.drawImage(imgArray[frameNum], char.x + xB, char.y + yB);
}

function setDirection() {
    if (keyMap[39] && keyMap[38]) return 0; // right and up
    if (keyMap[39] && keyMap[40]) return 2; // right and down
    if (keyMap[39]) return 1;               // right
    if (keyMap[37] && keyMap[40]) return 3; // left and down
    if (keyMap[37] && keyMap[38]) return 5; // left and up
    if (keyMap[37]) return 4;               // left
    return 100;
}

function timerMainF() {
    if (keyMap[37]) p_leftkey.innerHTML  = "LEFT";  else p_leftkey.innerHTML = "0";
    if (keyMap[39]) p_rightkey.innerHTML = "RIGHT"; else p_rightkey.innerHTML = "0";
    if (keyMap[38]) p_upkey.innerHTML    = "UP";    else p_upkey.innerHTML = "0";
    if (keyMap[40]) p_downkey.innerHTML  = "DOWN";  else p_downkey.innerHTML = "0";

    let direction = setDirection();
    if (direction != 100) {
        animOn = true;
        if (direction != actDirection) {
            switch (direction){
                case 0: frameStart = 0;
                        frameEnd   = 7;
                        frameNum   = 0; break;
                case 1: frameStart = 8;
                        frameEnd   = 15;
                        frameNum   = 8; break;                
                case 2: frameStart = 16;
                        frameEnd   = 23;
                        frameNum   = 16; break;                
                case 3: frameStart = 24;
                        frameEnd   = 31;
                        frameNum   = 24; break;                
                case 4: frameStart = 32;
                        frameEnd   = 39;
                        frameNum   = 32; break;    
                case 5: frameStart = 40;
                        frameEnd   = 47;
                        frameNum   = 40; break;    
            }
            actDirection = direction;
        }
    }
    else {
        animOn = false;
        actDirection = 100;
    }

    p.innerHTML = "Animations ON = " + animOn + "<br>" + "Image count: " + imgArray.length +
    "<br>Frame start: " + frameStart +
    "<br>Act direction: " + actDirection +
    "<br>Direction: " + direction;


    ctx_main.drawImage(img_backg, 0, 0);
    //ctx_main.drawImage(imgArray[frameNum], 100, 100);
    chars.forEach(drawOneCharacter);

    if (!animOn) return;
    if (frameNum == frameEnd)
        frameNum = frameStart;
    else
        frameNum++;

    if (yB > 200) {
        xB = 0;
        yB = 0;
    }
    else {
        xB += speed;
        yB += speed;
    }
}