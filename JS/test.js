document.getElementById("tablePercent").style.visibility = "hidden";
let myAnswers = [];       // A kérdésekre adott válaszok tömbje
let maxQuestionsNum = 5;  // Maximális kérdésszám
let dataBaseSize    = 6;  // Adatbázisban található kérdések száma
let actQNum = 0;          // Az aktuális kérdés sorszáma az adatbázisban
let numOfQ  = 0;          // Hányadik kérdésnél tart a teszt. Ha 0, akkor még nem indult el.

document.getElementById("btnStartTest").onclick = startTest; // Teszt indítása gomb klikk esemény
document.getElementById("btnNextQ").onclick = nextQuestion;  // Következő kérdés gomb klikk esemény
answers = document.querySelectorAll("input[name='radioA']"); // Válaszok radiogombok klikk eseménye
for (let ci in answers) answers[ci].onclick = answerClick;

function answerClick() { // Ha valamelyik válaszra rá lett klikkelve, aktívvá válik a Következő kérdés gomb
    if (numOfQ > maxQuestionsNum) return;
    document.getElementById("btnNextQ").disabled = false;
}

let tdQ = document.getElementById("tdQ"); // Az egész teszt egy táblázatoszlopban található
tdQ.style.visibility = "hidden";          // Ennek elrejtése, csak akkor lesz látható, ha a teszt elindul

function startTest() { // Teszt indítása
    document.getElementById("tablePercent").style.visibility = "hidden";
    let lengthDB = myAnswers.length;
    if (myAnswers.length > 0) { // Megszakított teszt esetén törli a már feldolgozott válaszokat
        for (let ci = 1; ci <= lengthDB; ci++ ) myAnswers.pop();
    }
    tdQ.style.visibility = "visible";     // A tesztet tartalmazó td felfedése
    for (let ci in answers) answers[ci].checked = false; // Ne legyen kérdés kiválasztva
    document.getElementById("btnNextQ").disabled = true; // A Következő kérdés gomb inaktívvá tétele
    document.getElementById("btnNextQ").value = "Következő kérdés"; // A Következő kérdés gomb feliratának alaphelyzetbe állítása
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
    let str = ""; str = '<span class="textbold">' + numOfQ.toString() + '. </span>kérdés'; // A kérdés sorszámának stringbe rakása
    document.getElementById("txtNumOfQ").innerHTML = str;                  // Kérdés sorszáma
    document.getElementById("txtTxtOfQ").innerHTML = questions[actQNum].q; // Kérdés
    document.getElementById("lblA1").innerHTML = questions[actQNum].a1;    // Első válasz
    document.getElementById("lblA2").innerHTML = questions[actQNum].a2;    // Második válasz
    document.getElementById("lblA3").innerHTML = questions[actQNum].a3;    // Harmadik válasz
    document.getElementById("lblA4").innerHTML = questions[actQNum].a4;    // Negyedik válasz
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
    document.getElementById("btnNextQ").disabled = true;
    makeNewQuestion();
    for (let ci in answers) answers[ci].checked = false; // Ne legyen kérdés kiválasztva
}

function saveActAnswers() { // Elmenti a válasz sorszámát, a jó válasz sorszámát, és a kérdés sorszámát az adatbázisban
    let selectedAnswerNum = 4;
    if (document.getElementById("firstA").checked)  { selectedAnswerNum = 1 } else
    if (document.getElementById("secondA").checked) { selectedAnswerNum = 2 } else
    if (document.getElementById("thirdA").checked)  { selectedAnswerNum = 3 };
    myAnswers.push({selectedAnswerNum: selectedAnswerNum, goodAnswerNum: questions[actQNum].gA, answerInDB: actQNum});
}

function endTest() { // A teszt vége, kiértékelés
    tdQ.style.visibility = "hidden"; // A tesztet tartalmazó td elrejtése
    document.getElementById("tablePercent").style.visibility = "visible"; // A tesz kiértékelése táblázat felfedése
    document.getElementById("txtEndNumOfQ").innerHTML = ("Feltett kérdések száma: " + '<span class="textbold">' + maxQuestionsNum.toString() + '</span>');
    let numOfGoodA = 0; // Jó válaszok számának kiszámítása
    for (let ci = 0; ci < maxQuestionsNum; ci++) if (myAnswers[ci].selectedAnswerNum == myAnswers[ci].goodAnswerNum) numOfGoodA++;

    document.getElementById("txtEndNumOfGA").innerHTML = ("Jó válaszok száma: " + '<span class="textbold">' + numOfGoodA.toString() + '</span>');
    document.getElementById("txtEndPercent").innerHTML = ("Százalékos eredmény: " + '<span class="textbold">' + (numOfGoodA / maxQuestionsNum * 100).toString() + ' %</span>');
}

// "Adatbázis"
let questions = [
    {q: "Mi az áramerősség jele?", a1: "V", a2: "A", a3: "J", a4: "I", gA: 4},
    {q: "Mi az feszültség jele?", a1: "A", a2: "W", a3: "V", a4: "U", gA: 4},
    {q: "Mi az feszültség mértékegysége?", a1: "W", a2: "V", a3: "A", a4: "km", gA: 2},
    {q: "Mi az áramerősség mértékegysége?", a1: "V", a2: "A", a3: "J", a4: "I", gA: 2},
    {q: "Mi az ellenállás jele?", a1: "R", a2: "A", a3: "U", a4: "I", gA: 1},
    {q: "Mi az ellenállás mértékegysége?", a1: "R", a2: "Ω", a3: "W", a4: "E", gA: 2}
];
