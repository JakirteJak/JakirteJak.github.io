let tBody = document.getElementById("tableSigns");

function addTD(HTML, parentTR, classL) {
    let td = document.createElement("td");
    td.innerHTML = HTML;
    td.classList = classL;
    td.style.paddingLeft = "5px";
    td.style.paddingRight = "5px";
    //td.style.border = "border: 1px solid black;";
    parentTR.appendChild(td);
}

function addTR(rovidites, leiras) {
    let tr = document.createElement("tr");    
    addTD(rovidites, tr, "tdc2 kiemel");
    addTD(leiras, tr);    
    tBody.appendChild(tr);
}

addTR("TT", "Földeléses rendszer védőföldeléssel.<br>1. betű: T - egy ponton követlenül földelt.<br>2. betű: T - a testek közvetlenül csatlakoznak a földhöz");
