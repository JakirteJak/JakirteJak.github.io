let p = document.getElementById("p");
let c_main   = document.getElementById("mainCanvas");
let ctx_main = c_main.getContext("2d");

imgData = ctx_main.getImageData(0, 0, c_main.width, c_main.height);
let img_backg = new Image(); // Used for background image
img_backg.src = '/img/backG03.jpg'; // Background image source

let timerMain      = setInterval(timerMainF, 1);

let num = 1;

function timerMainF() {    
    c_main.width  = window.innerWidth - 18;
    c_main.height = window.innerHeight - 68;
    drawMap();
    if (num < 630)
        num += 1;
    else
        num = 1;
}

function drawMap() {    
    ctx_main.drawImage(img_backg, 0, 0, c_main.width, c_main.height); // draw background to main canvas
  //  drawCircle();
    drawWaves();
}

function drawOneWave(horizontal, height, R, A) {
    ctx_main.strokeStyle = "rgba(" + R + ", 0, 0, " + A +")";

    ctx_main.beginPath();
    for (let x = 0; x < 1000; x++) {
        ctx_main.lineTo(x + 100, Math.sin(((x * horizontal) + num) / 100) * (x / height) + 400);        
    }
    ctx_main.stroke();
}

function drawWaves() {
    for (let ci = 1; ci <= 2; ci += 0.05) {
        drawOneWave(ci, 5 - ci, (ci - 1) * 100, ci - 1);
    }
//    drawOneWave(1, 5, "black");
//    drawOneWave(1.1, 5.5, "red");
}