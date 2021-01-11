let svg_gear01 = document.getElementById("svg_gear01");
let svg_txt01 = document.getElementById("svg_txt01");
let txt01 = document.getElementById("txt01");
let HT = document.getElementById("heart_test");
document.addEventListener('mousemove', onMouseUpdate, false);
let p_mouseXY = document.getElementById("p_mouseXY");
let angle = 20; let mX = 0; let mY = 0;

svg_txt01.setAttribute("transform", "rotate(" + angle + ")");
let timerMain      = setInterval(timerMainF, 20);
HT.href ="img/backG01.jpg";
HT.width = "10";
function timerMainF() {
    angle++;
    if (angle > 359) angle =  0;
    txt01.setAttribute("transform", "rotate(" + (360 - angle) + " 100,100)");    
    txt01.innerHTML = "Angle: " + angle;

    let xH = 0;
    let yH = 0;
    svg_txt01.setAttribute("transform", "rotate(" + angle + " " + xH + "," + yH + ")");    

    svg_gear01.style.strokeDashoffset = angle / 3.6;


}

function onMouseUpdate(e) {
    mX = e.pageX;
    mY = e.pageY;
    HT.x = mX;
    HT.y = mY.toString();
    p_mouseXY.innerHTML = "mouseX = " + mX + "<br>mouseY = " + mY + "<br>" + HT.x + "<br>" + HT.y;
}