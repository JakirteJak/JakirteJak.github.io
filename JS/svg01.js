let svg_txt01 = document.getElementById("txt01");
let angle = 20;

svg_txt01.setAttribute("transform", "rotate(" + angle + ")");
let timerMain      = setInterval(timerMainF, 100);

function timerMainF() {
    angle++;
    svg_txt01.setAttribute("transform", "rotate(" + angle + ")");    
    svg_txt01.innerHTML = "Angle: " + angle;
}