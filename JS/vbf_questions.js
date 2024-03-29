let tableQ = document.getElementById("tableQuestions");
let question3;        // A teszt kérdéseinek adatbázisa ide lesz beolvasva.
let dateRead = false; // Adatellenőrzéshez. Amíg a fetch nem ad visszajelzést, false marad.
ReadDataFromJson();   // Adatok beolvasása JSON fileból question3 globális változóba.

function ReadDataFromJson(){ // Adatok beolvasása JSON fileból question3 globális változóba.
    fetch('../data/vbf_teszt.json')
       .then(response => response.json())
       .then(data => {question3 = data;})
       .then(() => { /*console.log("Elérhető adatok!");*/ 
            dateRead = true;
            MakeTableFromDatabase();
/*            document.getElementById("txtDBsize").innerHTML = "Az adatbázisban található kérdések száma: "
                + '<span style="color: green;">' 
                + question3.data.length;
dataBaseSize = question3.data.length;*/}) // value of outsideVariable is now available                    
       .catch(error => { console.error('Hiba történt:', error)});    
}

function MakeTableFromDatabase(){    
    //let tr;

    for (let ci = 0; ci < question3.data.length; ci++){
        let tr = document.createElement("tr");
        let td = document.createElement("td");

        td.innerHTML += '<p class = "table_questions textbold">' + question3.data[ci].q + "</p>";

        tr.addEventListener('mouseover', event => {
            pLine = event.currentTarget.getElementsByClassName('gA')[0];
            if (pLine){
                pLine.classList.add("goodAnswer");
                pLine.classList.add("mouseOverModifier");
                pLine.classList.remove("gA");                
            } 
        });

        tr.addEventListener('mouseout', event => {            
            const trRect = event.currentTarget.getBoundingClientRect();
            if (event.clientX >= trRect.left && event.clientX <= trRect.right &&
                event.clientY >= trRect.top && event.clientY <= trRect.bottom) {
                return;
            }

            pLine = event.currentTarget.getElementsByClassName('mouseOverModifier')[0];
          
            if (pLine){
                pLine.classList.remove("goodAnswer");
                pLine.classList.remove("mouseOverModifier");
                pLine.classList.add("gA");
            }
        })
        
        for (let cj = 0; cj < question3.data[ci].a.length; cj++){
            if (question3.data[ci].gA == cj + 1)
                td.innerHTML += '<p style = "margin-left: 40px;" class = "table_questions gA">' + question3.data[ci].a[cj] + "</p>";
            else
                td.innerHTML += '<p style = "margin-left: 40px;" class = "table_questions">' + question3.data[ci].a[cj] + "</p>";
        }
            
        td.style.paddingLeft  = "5px";
        td.style.paddingRight = "5px";
        td.classList.add("kiemel2");    
        tr.appendChild(td);        
        tableQ.appendChild(tr);
    }
}