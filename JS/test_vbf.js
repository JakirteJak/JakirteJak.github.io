// Rövid leírás:
// Az "inputMaxQNum" input mezőben megadott számú, véletlenszerű kérdést generáló teszprogram.
// A teszt indítását követően,a felkínált válaszok egyikére klikkelve elérhetővé váli a következő kérdés gomb.
// Az útolsó késdés után a válaszok kiértékelése következik.
// Működés:
// Egy JSON adatbázisból olvassa be a szükséges adatokat. (ReadDataFromJson();)
// A válaszokat a myAnswers tömmbe gyűjti. (saveActAnswers();)
// Ennek alapján értékeli ki a tsztet a végén.

let myAnswers = [];         // A kérdésekre adott válaszok tömbje
let maxQuestionsNum = document.getElementById("inputMaxQNum").value; // Maximális kérdésszám
let dataBaseSize    = 3;    // Adatbázisban található kérdések száma
let actQNum = 0;            // Az aktuális kérdés sorszáma az adatbázisban
let numOfQ  = 0;            // Hányadik kérdésnél tart a teszt. Ha 0, akkor még nem indult el.

let evaulateRowsArray = []; // Az eredmények sorai. A teszt végén ide lesznek gyűjtve a rossz válaszok, 
                            //hogy a felhasználók megnézhessék, miket hibáztak el.

let question3;        // A teszt kérdéseinek adatbázisa ide lesz beolvasva.
let dateRead = false; // Adatellenőrzéshez. Amíg a fetch nem ad visszajelzést, false marad.
ReadDataFromJson();   // Adatok beolvasása JSON fileból question3 globális változóba.

nextQuestionBTN = document.getElementById("btnNextQ");

document.getElementById("btnStartTest").onclick = startTest; // Teszt indítása gomb klikk esemény
document.getElementById("btnNextQ").onclick = nextQuestion;  // Következő kérdés gomb klikk esemény

let tdQ = document.getElementById("tdQ"); // Az egész teszt egy táblázatoszlopban található
tdQ.classList.add("invisible"); // Ennek elrejtése, csak akkor lesz látható, ha a teszt elindul

let tEvaulation = document.getElementById("tableEvaulation");
tEvaulation.style.visibility = "hidden";

document.getElementById("tablePercent").style.visibility = "hidden";

let rButtons = document.getElementsByName("radioA"); // Radiobuttonok a válaszokhoz.
//let rButtons = document.querySelectorAll("input[name='radioA']");
let rLabels  = document.getElementsByName("labelA"); // Cimkék a radiobuttonokhoz.
for (let ci in rButtons) rButtons[ci].onclick = answerClick; // Mindegyik radiogomb ugyanazt a eseményt hívja meg.

function ReadDataFromJson(){ // Adatok beolvasása JSON fileból question3 globális változóba.
    fetch('../data/vbf_teszt.json')
       .then(response => response.json())
       .then(data => {question3 = data;})
       .then(() => { /*console.log("Elérhető adatok!");*/ 
            dateRead = true;
            document.getElementById("txtDBsize").innerHTML = "Az adatbázisban található kérdések száma: "
                + '<span style="color: green;">' 
                + question3.data.length;
                dataBaseSize = question3.data.length;}) // value of outsideVariable is now available            
       .catch(error => { console.error('Hiba történt:', error)});    
}

function answerClick() { // Ha valamelyik válaszra rá lett klikkelve, aktívvá válik a Következő kérdés gomb
    if (numOfQ > maxQuestionsNum) return; // Az utolsó kérdésnél már nem aktiválhatjuk a gombot.   
    nextQuestionBTN.disabled = false;
}

function startTest() { // Teszt indítása, a Start Teszt gomb onclick eseménye    
    if (!dateRead) return; // Ha az a adatok beolvasása nem történt meg, kilépés. (fetch változtathatja true -ra)
    if (myAnswers.length > 0) { // Megszakított teszt esetén törli a már feldolgozott válaszokat
        for (let ci = 1; ci <= myAnswers.length; ci++ ) myAnswers.pop();
    }

    document.getElementById("tablePercent").style.visibility = "hidden"; // Az eredmények táblázat elrejtése    
    tEvaulation.style.visibility = "hidden"; // A kiértékelés elrejtése
    tdQ.classList.remove("invisible");       // A tesztet tartalmazó td felfedése

    for (let ci in rButtons) rButtons[ci].checked = false; // Ne legyen kérdés kiválasztva
    nextQuestionBTN.disabled = true; // A Következő kérdés gomb inaktívvá tétele
    nextQuestionBTN.value = "Következő kérdés"; // A Következő kérdés gomb feliratának alaphelyzetbe állítása
    numOfQ = 1;        // Az első kérdés következik
    makeNewQuestion(); // Új kérdés kirakása    
}

function makeNewQuestion() { // Új kérdést rak ki
    let qOk = false;
    while (!qOk) { // Meg kell vizsgálni, volt-e már feltéve ez a kérdés ebben a tesztben
        actQNum = Math.floor(Math.random() * dataBaseSize); // Véletlenszerűen kiválaszt egy sorszámot, az adatbáziks méretétől függően
        qOk = true;
        for (let ci = 0; ci < myAnswers.length; ci++) {
            if (actQNum == myAnswers[ci].answerInDB) {
                qOk = false;
                break;
            }
        }
    }    

    let str = '<span class="textbold">' + numOfQ.toString() + '. </span>kérdés'; // A kérdés sorszámának stringbe rakása
    document.getElementById("txtNumOfQ").innerHTML = str;                  // Kérdés sorszáma

    document.getElementById("txtTxtOfQ").innerHTML = question3.data[actQNum].q; // Kérdés
    for (let ci = 0; ci < question3.data[actQNum].numOfQs; ci++){
        rLabels[ci].innerHTML = question3.data[actQNum].a[ci];
        rButtons[ci].classList.remove("TRinvisible");
        rLabels[ci].classList.remove("TRinvisible");
    }

    if (question3.data[actQNum].numOfQs < 6){
        for (let ci = question3.data[actQNum].numOfQs; ci < 6; ci++){
            rButtons[ci].classList.add("TRinvisible");
            rLabels[ci].classList.add("TRinvisible");    
        }
    }

/*    document.getElementById("txtTxtOfQ").innerHTML = questions[actQNum].q; // Kérdés
    
    document.getElementById("lblA1").innerHTML = questions[actQNum].a1;    // Első válasz
    document.getElementById("lblA2").innerHTML = questions[actQNum].a2;    // Második válasz
    document.getElementById("lblA3").innerHTML = questions[actQNum].a3;    // Harmadik válasz
    if (questions[actQNum].a4 != null){ // Negyedik válasz  
        document.getElementById("fourthA").classList.remove("TRinvisible");
        document.getElementById("lblA4").classList.remove("TRinvisible");  

        document.getElementById("lblA4").innerHTML = questions[actQNum].a4;          
    }else{
        document.getElementById("fourthA").classList.add("TRinvisible");
        document.getElementById("lblA4").classList.add("TRinvisible");  
    }

    if (questions[actQNum].a5 != null){ // Ötödik válasz   
        document.getElementById("fifthA").classList.remove("TRinvisible");
        document.getElementById("lblA5").classList.remove("TRinvisible");  

        document.getElementById("lblA5").innerHTML = questions[actQNum].a5;
    }else{
        document.getElementById("fifthA").classList.add("TRinvisible");
        document.getElementById("lblA5").classList.add("TRinvisible");  
    }

    if (questions[actQNum].a6 != null){ // Hatodik válasz   
        document.getElementById("sixthA").classList.remove("TRinvisible");
        document.getElementById("lblA6").classList.remove("TRinvisible");  

        document.getElementById("lblA6").innerHTML = questions[actQNum].a6;
    }else{
        document.getElementById("sixthA").classList.add("TRinvisible");
        document.getElementById("lblA6").classList.add("TRinvisible");
        /*document.getElementById("sixthA").classList.add("invisible_common");
        document.getElementById("lblA6").classList.add("invisible_common");
    }*/

    if (question3){        
        /*console.log("OK");*/
        console.log(question3.data[0].q);
        console.log(question3.data[0].a[0]);
        console.log(question3.data[0].numOfQs);
        console.log(question3.data[1].q);     
    }else{
        console.log("Error!");
        
    }
}

function nextQuestion() { // Következő kérdés gomb megnyomásakor meghívott funkció
    saveActAnswers(); // Elmenti a jelenlegi kérdésre adott választ
    numOfQ++; // A kérdés sorszámát egyel növeli    
    if (numOfQ > maxQuestionsNum) { // Ha a maximális kérdészámot túllépjük, a teszt végetér
        document.getElementById("btnNextQ").disabled = true;
        endTest();
        return;
    }
    
    if (numOfQ == maxQuestionsNum) document.getElementById("btnNextQ").value = "Teszt bejefezése"; // Útolsó kérdés következik
    nextQuestionBTN.disabled = true;
    makeNewQuestion();
    for (let ci in rButtons) rButtons[ci].checked = false; // Ne legyen kérdés kiválasztva
}

function saveActAnswers() { // Elmenti a válasz sorszámát, a jó válasz sorszámát, és a kérdés sorszámát az adatbázisban
    let selectedAnswerNum = 4;

    for (let ci = 0; ci < maxQuestionsNum; ci++)
        if (rButtons[ci].checked) selectedAnswerNum = ci + 1;

    myAnswers.push({selectedAnswerNum: selectedAnswerNum, goodAnswerNum: question3.data[actQNum].gA, answerInDB: actQNum});
}

function addColoredLine(questionNum, answerNum){
    if (answerNum == myAnswers[questionNum].goodAnswerNum)
        return '<p class="margins20" style="color: green">'
    else if (answerNum == myAnswers[questionNum].selectedAnswerNum)
        return '<p class="margins20" style="color: red">'
    else
        return '<p class="margins20" style="color: white">';
}

function endTest() { // A teszt vége, kiértékelés
//    tdQ.style.visibility = "hidden"; // A tesztet tartalmazó td elrejtése
    tdQ.classList.add("invisible"); // !!!
    //tdQ.classList.add("invisible_common");

    var rows = document.getElementsByClassName("evaulatedRow");
    evaulateRowsArray = Array.from(rows);
    evaulateRowsArray.forEach(function(row){
        row.parentNode.removeChild(row);
    });    

    document.getElementById("tablePercent").style.visibility = "visible"; // A tesz kiértékelése táblázat felfedése
    document.getElementById("txtEndNumOfQ").innerHTML = ("Feltett kérdések száma: " + '<span class="textbold">' + maxQuestionsNum.toString() + '</span>');
    let numOfGoodA = 0; // Jó válaszok számának kiszámítása
    for (let ci = 0; ci < maxQuestionsNum; ci++){
        if (myAnswers[ci].selectedAnswerNum == myAnswers[ci].goodAnswerNum){
            numOfGoodA++; // Összeszámlálja a jó válaszok számát.
        }
        else {
            // Rossz válasz esetén megmutatja a hibát, és a helyes megoldást is.
            let newRow = tEvaulation.insertRow(tEvaulation.rows.length);
            newRow.className = "evaulatedRow";
            let cell1 = newRow.insertCell(0);
    
            cell1.innerHTML = '<p class="maxwidth1000">' + question3.data[myAnswers[ci].answerInDB].q + '</p>';
    
            for (let ci2 = 0; ci2 < question3.data[myAnswers[ci].answerInDB].numOfQs; ci2++)
                cell1.innerHTML += addColoredLine(ci, ci2 + 1) + question3.data[myAnswers[ci].answerInDB].a[ci2];
        }        
    }

    // Jó válaszok számának elhelyezése a HTML -ben
    document.getElementById("txtEndNumOfGA").innerHTML = ("Jó válaszok száma: " + '<span class="textbold subtitle">' + numOfGoodA.toString() + '</span>');
    // Százalékos eredmény kiszámolása és elhelyezése két tizedes jegyig
    document.getElementById("txtEndPercent").innerHTML = ("Százalékos eredmény: " + '<span class="textbold subtitle" style="color: black;">' + ((numOfGoodA / maxQuestionsNum * 100)).toFixed(2).toString() + ' %</span>');

    tEvaulation.style.visibility = "visible";    
}

// "Adatbázis"
let questions_old = [
    // 00 - 10:  
    {q: "1.01. Mit jelent az alapvédelem?", 
        a1: "korszerű beton-alapvédelem kialakítása, illetve alkalmazása", 
        a2: "az aktív részek véletlen vagy szándékolt érintését akadályozó intézkedések", 
        a3: "alapvető védelmi módszer alkalmazása",        
        numOfQs: 3,
        gA: 2},
    {q: "1.02. Kik végezhetik el az időszakos villamos biztonsági felülvizsgálatot?", 
        a1: "csak magánszemély, illetve vállalkozó", 
        a2: "az üzemeltető, vagy egy általa megbízott szolgáltató", 
        a3: "csak az erre jogosított szolgáltató vállalat", 
        a4: "a fentiek bármelyike, ha rendelkezik az 34/2021. (VII.26.) ITM rendeletben előírt szakképesítéssel",
        numOfQs: 4,
        gA: 4},
    {q: "1.06. Elsősorban kinek a feladata és felelőssége az üzemelő villamos berendezés időszakos ellenőrzéseiről gondoskodni?", 
        a1: "a berendezést üzemeltető művezetőé", 
        a2: "a szerződött szolgáltatóé", 
        a3: "az üzemeltető felelős vezetőjének feladata", 
        a4: "valamennyi villamos szakemberé", 
        numOfQs: 4,
        gA: 3},
    {q: "2.05. Mi a tényleges érintési feszültség?", 
        a1: "két, meghibásodás folytán feszültség alá kerülő test között fellépő feszültség", 
        a2: "zárlatos test és a földpotenciálú hely között mérhető feszültség", 
        a3: "személy vagy haszonállat által egyidejűleg megérintett vezetőképes részek közötti feszültség", 
        a4: "a talaj felületén meghatározott távolságban lévő két pont közötti feszültség", 
        numOfQs : 4, gA: 3},
    {q: "2.07.  Jelölje meg, hogy az áramütés elleni védelem létesítési előírásait melyik érvényes szabványsorozat tartalmazza!", 
        a1: "MSZ HD 60364 szabványsorozat", 
        a2: "MSZ 2064 szabványsorozat", 
        a3: "MSZ 1585 szabványsorozat", 
        a4: "MSZ 4851 szabványsorozat", 
        numOfQs: 4,
        gA: 1}
];

let q2_old = [
    { q: "1.01. Mit jelent az alapvédelem?",
      a: ["korszerű beton-alapvédelem kialakítása, illetve alkalmazása",
          "az aktív részek véletlen vagy szándékolt érintését akadályozó intézkedések", 
          "alapvető védelmi módszer alkalmazása"],
      numOfQs : 3, gA: 2},
    {q: "1.02. Kik végezhetik el az időszakos villamos biztonsági felülvizsgálatot?", 
     a: ["csak magánszemély, illetve vállalkozó", 
         "az üzemeltető, vagy egy általa megbízott szolgáltató", 
         "csak az erre jogosított szolgáltató vállalat", 
         "a fentiek bármelyike, ha rendelkezik az 34/2021. (VII.26.) ITM rendeletben előírt szakképesítéssel"],
     numOfQs: 4, gA: 4},
    {q: "1.06. Elsősorban kinek a feladata és felelőssége az üzemelő villamos berendezés időszakos ellenőrzéseiről gondoskodni?", 
     a: ["a berendezést üzemeltető művezetőé", 
         "a szerződött szolgáltatóé", 
         "az üzemeltető felelős vezetőjének feladata", 
         "valamennyi villamos szakemberé"], 
     numOfQs: 4, gA: 3},
    {q: "2.05. Mi a tényleges érintési feszültség?", 
     a: ["két, meghibásodás folytán feszültség alá kerülő test között fellépő feszültség", 
         "zárlatos test és a földpotenciálú hely között mérhető feszültség", 
         "személy vagy haszonállat által egyidejűleg megérintett vezetőképes részek közötti feszültség", 
         "a talaj felületén meghatározott távolságban lévő két pont közötti feszültség"], 
     numOfQs: 4, gA: 3},
    {q: "2.07.  Jelölje meg, hogy az áramütés elleni védelem létesítési előírásait melyik érvényes szabványsorozat tartalmazza!", 
     a: ["MSZ HD 60364 szabványsorozat", 
        "MSZ 2064 szabványsorozat", 
        "MSZ 1585 szabványsorozat", 
        "MSZ 4851 szabványsorozat"], 
     numOfQs: 4, gA: 1}
];
// {q: "", a1: "", a2: "", a3: "", a4: "", gA: }
/*   q: question
    a1: answer 1
    a2: answer 2
    a3: answer 3
    a4: answer 4
    a5: answer 5
    a6: answer 6
    numOfQs: number of questions
    gA: good answer order
*/
/*
        {
            "q": "",
            "a": ["",
                  "",
                  "",
                  ""],
            "numOfQs": ,"gA": 
        },
*/