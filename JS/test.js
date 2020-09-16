let oneAnswer = {selectedAnswerNum: 0, goodAnswerNum: 0}; // Egy válasz: kiválasztott válasz sorszáma, jó válasz sorszáma
let goodAnswers = [];     // A kérdésekre adott válaszok tömbje
for (let ci = 0; ci < 20; ci++) goodAnswers[ci] = oneAnswer; // Tömb alapállapotba hozása
let maxQuestionsNum = 20; // Maximális kérdésszám
let actQNum = 0;          // Az aktuális kérdés sorszáma az adatbázisban
let dataBaseSize = 2;     // Adatbázisban található kérdések száma
let numOfQ = 0;           // Hányadik kérdésnél tart a teszt. Ha 0, akkor még nem indult el.

document.getElementById("btnStartTest").onclick = startTest; // Teszt indítása gomb klikk esemény
document.getElementById("btnNextQ").onclick = nextQuestion;  // Következő kérdés gomb klikk esemény

answers = document.querySelectorAll("input[name='radioA']"); // Válaszok radiogombok klikk eseménye
for (let ci in answers) answers[ci].onclick = answerClick;

let tdQ = document.getElementById("tdQ"); // Az egész teszt egy táblázatoszlopban található
tdQ.style.visibility = "hidden";          // Ennek elrejtése, csak akkor lesz látható, ha a teszt elindul

function makeNewQuestion() { // Új kérdést rak ki
    actQNum = Math.floor(Math.random() * dataBaseSize); // Véletlenszerűen kiválaszt egy sorszámot, az adatbáziks méretétől függően
    let str = ""; str =  '<span class="textbold">' + numOfQ.toString() + '. </span>kérdés';
    document.getElementById("txtNumOfQ").innerHTML = str; // Kérdés sorszáma
    document.getElementById("txtTxtOfQ").innerHTML = questions[actQNum].q; // Kérdés
    document.getElementById("lblA1").innerHTML = questions[actQNum].a1; // Első válasz
    document.getElementById("lblA2").innerHTML = questions[actQNum].a2; // Első válasz
    document.getElementById("lblA3").innerHTML = questions[actQNum].a3; // Első válasz
    document.getElementById("lblA4").innerHTML = questions[actQNum].a4; // Első válasz
}

function startTest() { // Teszt indítása
    tdQ.style.visibility = "visible";
    document.getElementById("btnNextQ").disabled = true;
    document.getElementById("btnNextQ").value = "Következő kérdés";
    numOfQ = 1;
    makeNewQuestion();
}

function nextQuestion() { // Következő kérdés
    numOfQ++;
    if (numOfQ == maxQuestionsNum + 1) {
        document.getElementById("btnNextQ").disabled = true;
        return;
    }
    if (numOfQ == maxQuestionsNum) document.getElementById("btnNextQ").value = "Teszt bejefezése";
    makeNewQuestion();
}

function answerClick() { // Ha valamelyik válaszra rá lett klikkelve, aktívvá válik a Következő kérdés gomb
    document.getElementById("btnNextQ").disabled = false;
}

let questions = [
    {q: "Mi az áramerősség jele?", a1: "V", a2: "A", a3: "J", a4: "I", gA: 4},
    {q: "Mi az feszültség jele?", a1: "A", a2: "W", a3: "V", a4: "U", gA: 4}
];

console.log(questions);