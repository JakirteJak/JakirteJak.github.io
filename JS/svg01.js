let svg_gear01 = document.getElementById("svg_gear01");
let svg_txt01 = document.getElementById("svg_txt01");
let txt01 = document.getElementById("txt01");
let angle = 20;

svg_txt01.setAttribute("transform", "rotate(" + angle + ")");
let timerMain      = setInterval(timerMainF, 20);

function timerMainF() {
    angle++;
    if (angle > 359) angle =  0;
    txt01.set
    Attribute("transform", "rotate(" + (360 - angle) + " 100,100)");    
    txt01.innerHTML = "Angle: " + angle;

    let xH = 0;
    let yH = 0;
    svg_txt01.setAttribute("transform", "rotate(" + angle + " " + xH + "," + yH + ")");    

    svg_gear01.style.strokeDashoffset = angle / 3.6;
}