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
document.getElementById("spanNumOfQs").innerHTML = maxQuestionsNum;
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

let infoWindow = document.getElementById("infoWindow"); // Info ablak
document.getElementById("btnInfo").onclick = function(){
    WriteDatabaseToJSONfile("aaa");
    if (infoWindow.style.visibility == "hidden")
        infoWindow.style.visibility = "visible";
    else
        infoWindow.style.visibility = "hidden";
}

let rButtons = document.getElementsByName("radioA"); // Radiobuttonok a válaszokhoz.
//let rButtons = document.querySelectorAll("input[name='radioA']");
let rLabels  = document.getElementsByName("labelA"); // Cimkék a radiobuttonokhoz.
for (let ci in rButtons) rButtons[ci].onclick = answerClick; // Mindegyik radiogomb ugyanazt a eseményt hívja meg.

document.getElementById("inputMaxQNum").onchange = function(){ // A tesztkérdések száma inputmező változásakor meghívott függvény
    maxQuestionsNum = document.getElementById("inputMaxQNum").value;
    if (maxQuestionsNum > question3.data.length){ // Ha nagyobb érték lett megadva, mint az adatbázis mérete.
        maxQuestionsNum = question3.data.length;
        document.getElementById("inputMaxQNum").value = maxQuestionsNum;
    }

    if (maxQuestionsNum < document.getElementById("inputMaxQNum").min){ // Ha kisebb érték lett megadva, mint a minimálisan megadható érték.
        maxQuestionsNum = document.getElementById("inputMaxQNum").min;
        document.getElementById("inputMaxQNum").value = maxQuestionsNum;
    }

    document.getElementById("spanNumOfQs").innerHTML = maxQuestionsNum;
    startTest();
}

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

function RestartVBFanim(){
    document.getElementById("vbf_svg").classList.remove("vbf_anim")
    setTimeout(() =>{
        document.getElementById("vbf_svg").classList.add("vbf_anim");
    })
    }

function startTest() { // Teszt indítása, a Start Teszt gomb onclick eseménye
    RestartVBFanim();

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
    for (let ci = 0; ci < question3.data[actQNum].numOfQs; ci++){ // Aktív válaszok
        rLabels[ci].innerHTML = question3.data[actQNum].a[ci];
        rButtons[ci].classList.remove("TRinvisible");
        rLabels[ci].classList.remove("TRinvisible");
    }

    if (question3.data[actQNum].numOfQs < 6){ // Inaktív válaszok (csak annyi radiogomb aktív, ahány kérdés van)
        for (let ci = question3.data[actQNum].numOfQs; ci < 6; ci++){
            rButtons[ci].classList.add("TRinvisible");
            rLabels[ci].classList.add("TRinvisible");    
        }
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
    /*for (let ci = 0; ci < question3.data[actQNum].numOfQs; ci++)
        if (rButtons[ci].checked) selectedAnswerNum = ci + 1;*/
    
    for (let ci = 0; ci < rButtons.length; ci++)
        if (rButtons[ci].checked) selectedAnswerNum = ci + 1;
        
    myAnswers.push({selectedAnswerNum: selectedAnswerNum, goodAnswerNum: question3.data[actQNum].gA, answerInDB: actQNum});
}

function addColoredLine(questionNum, answerNum){
    if (answerNum == myAnswers[questionNum].goodAnswerNum)
        return '<p class="margins20" style="color: green">'
    else if (answerNum == myAnswers[questionNum].selectedAnswerNum)
        return '<p class="margins20" style="color: red">'
    else
        return '<p class="margins20" style="color: black">';
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
            newRow.style = "border-width: 1px; border-style: solid;";
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

function WriteDatabaseToJSONfile(filename){
    return;
    let fs = writeFile('adatbazis.json', JSON.stringify(question3, null, 4), err => {        
        if (err) {
            console.error('Hiba történt a fájl írása közben:', err);
            return;
        }
        console.log('Az adatbázis sikeresen kiírva adatbazis.json fájlba.');
    });
}
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