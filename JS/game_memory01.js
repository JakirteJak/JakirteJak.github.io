let body = document.getElementById("body");
let div_main = document.getElementById("div_main");
let div_header = document.getElementById("div_header");
let btnNewGame = document.getElementById("btn_newgame");
btnNewGame.onclick = newGameClick;

p  = document.getElementById("p");

images      = []; // fényképek   (img)
images_back = []; // háttérképek (img)
cards       = []; // kértyák (div)
coords      = [];

let timerCardFlip = setInterval(tCardFlip, 10);
let timerCardMoveToBase       = setInterval(tCardMoveToBase, 5);
let timerAllCardsMoveToBase   = setInterval(tAllCardsMoveToBase, 10);
let timerAllCardsMoveToNewPos = setInterval(tMoveCardsToNewCoords, 5);
document.addEventListener("mousemove", function (event) { mouseXY(event) }); // Egérmozgás esemény

let baseCardSize = 100; // alap kártyaszélesség pixelben, ehhez viszonyít
let actCardSize  = 100;

let cardGrow = false; // átforduláskor a növekedési, vagy a csökkenése fázisban van
let cardFlip = false; // az egyik kártya éppen átfordul
let cardFlipToSeePic = true;

let cardMoveToBase = false;
let growNumber = 5;        // átfordulás sebessége, valójában pixelben megadott érték, ennyit csökkent vagy növel
let rowCount = 4; let colCount = 6;   // sorok és oszlopok száma
let flippedOne = -1; flippedTwo = -1; // átfordított kártyák sorszámai, egyszerre max kettő lehet; -1 esetén nincs kártyaszám
let distX1, distY1, distX2, distY2;
let cardDockedCount = 0;
let cardsDocking = false;
let cardsPositioning = false;

div_main.style.width = (baseCardSize + 10) * colCount + 130 + "px";
div_header.style.width = (baseCardSize + 10) * colCount + 130 + "px";

// "statikus kártya": a paklit jelképezi, az alá térnek vissza a párosított lapok, illetve innen történik a kiosztás
let static_card = document.createElement("div");
static_card.classList = "div_onecard";
static_card.style.position = "absolute";
static_card.style.overflow = "hidden";
static_card.onclick = cardClick;
static_card.id = "sss";
static_card.style.left = (baseCardSize + 10) * colCount + 20 + "px";
static_card.style.top  = "40px";
img = document.createElement("img");
img.src = "img_cards/cardback01_100x160.jpg";
static_card.appendChild(img);
div_main.appendChild(static_card);

let baseX = static_card.offsetLeft; 
let baseY = static_card.offsetTop;

initImages(); // képek betöltése
initCoords(); // koordinátatömb init
initCards();  // kártyát divjeinek létrehozása
giveNewCoordsToCards(); // random kap koordinátákat minden kártya a koordináta tömbből
cardsPositioning = true;

function initImages() { // képek betöltése tömbbe
    for (let ci = 0; ci < 12; ci++) {
        img_num1 = (ci * 2);
        img_num2 = (ci * 2) + 1;
        images[img_num1] = document.createElement("img");
        images[img_num1].src = "img_cards/card" + (ci + 1) + ".jpg"; 
        images[img_num1].classList = "img_card";

        images[img_num1].style.height = baseCardSize * 1.6 +  "px";
        //images[img_num1].style.height = "100%";

      //  images[img_num1].style.visibility = "hidden";
        images[img_num1].picID = ci + 1;

        images[img_num2] = document.createElement("img");
        images[img_num2].src = "img_cards/card" + (ci + 1) + ".jpg";
        images[img_num2].classList = "img_card";

        images[img_num2].style.height = baseCardSize * 1.6 +  "px";
        //images[img_num2].style.height = "100%";        

      //  images[img_num2].style.visibility = "hidden";
        images[img_num2].picID = ci + 1;
    }

    for (let ci = 0; ci < 24; ci++) {
        images_back[ci] = document.createElement("img");
        images_back[ci].src = "img_cards/cardback01_100x160.jpg";
        images_back[ci].classList = "img_card";

        images_back[ci].style.height = baseCardSize * 1.6 +  "px";
        //images_back[ci].style.height = '100%';

        images_back[ci].style.position ="absolute";
        //images_back[ci].style.visibility = "hidden";
    }
}

function initCoords() { // koordinátatömb init        
    for (let y = 0; y < rowCount; y++)        
        for (let x = 0; x < colCount; x++) {
            coords.push({ X : x * (baseCardSize + 10), Y: y * ((baseCardSize * 1.6) + 10), 
                          moveX: (baseX - (x * (baseCardSize + 10))) / 50,
                          moveY: (baseY - (y * ((baseCardSize * 1.6) + 10))) / 50});

        }
}

function giveNewCoordsToCards() { // random kap koordinátákat minden kártya a koordináta tömbből
    for (let ci = 0; ci < (rowCount * colCount); ci++) {
        cards[ci].coordNum = 0;
        cards[ci].style.display = "flex";
        images_back[ci].style.visibility = "visible";
        images[ci].style.visibility = "hidden";         
    }

    let actCoordNum = 0; let rNum;
    while(actCoordNum != (rowCount * colCount)) {
        rNum = Math.floor(Math.random() * rowCount * colCount);  
        if (cards[rNum].coordNum == 0) {
            cards[rNum].coordNum = actCoordNum;
            actCoordNum++;
        }
    }
}

function tMoveCardsToNewCoords() { // átmozgatja a kártyákat az új koordinátákra
    if (!cardsPositioning || cardsDocking) return;

    giveNewCoordsToCards();
    cardsPositioning = false;
    cardDockedCount = 0;

    for (let ci = 0; ci < (rowCount * colCount); ci++) {        
        cards[ci].style.left = coords[cards[ci].coordNum].X + "px";
        cards[ci].style.top  = coords[cards[ci].coordNum].Y + "px";
        cards[ci].docked = false;
    }

}

function newGameClick() { // új játék gombra klikkelés
    if (cardDockedCount != rowCount * colCount) setAllDockingON();
        
    cardsPositioning = true;
    flippedOne = -1; flippedTwo = -1;
}

function onMouseHover() { // égér a kártyalap felett
    return;
    let h = this.style.height
    /*p.innerHTML = "cardnum: " + this.cardNum + "<br>" + 
                  "picnum: " + this.picNum + "<br>" +
                  this.style.left + "<br>" +
                  this.style.top + "<br>" + 
                  this.style.height + "<br>" +
                  this.offsetLeft + "<br>" +
                  this.offsetTop + "<br>" +
                  "picID: " + this.picID;*/
               
    this.style.width = baseCardSize + 14 + "px";
    this.style.height = baseCardSize * 1.6 + 14 + "px";
    this.style.left = this.offsetLeft - 7 + "px";    
    this.style.top = this.offsetTop - 7 + "px";

    images[this.picNum].style.width = baseCardSize + 18 + "px";
    images[this.picNum].style.height = baseCardSize * 1.6 + 18 + "px";
    images_back[this.picNum].style.width = baseCardSize + 18 + "px";
    images_back[this.picNum].style.height = baseCardSize * 1.6 + 18 + "px";
}

function onMouseOutOfCard() { // égér elmozgatása a kártyalapról
    return;
    this.style.width = baseCardSize + "px";
    this.style.height = baseCardSize * 1.6 + "px";
    this.style.left = this.offsetLeft + 7 + "px";
    this.style.top = this.offsetTop + 7 + "px";
    
    images[this.picNum].style.width = baseCardSize + "px";
    images[this.picNum].style.height = baseCardSize * 1.6 + "px";
    images_back[this.picNum].style.width = baseCardSize + "px";
    images_back[this.picNum].style.height = baseCardSize * 1.6 + "px";
}

function initOneCard(num, picnum, x, y) { // egy kártya inicializálása
    cards[num] = document.createElement("div");
    cards[num].style.height = baseCardSize * 1.6;
    cards[num].cardNum = num;   // kártyasorszám
    cards[num].picNum = picnum; // kép sorszám
    cards[num].coordNum = 0;    // koordinátatömb sorszáma (újrakeveréskor random kap másikat)
    cards[num].docked = false;  // a kártya vissza van -e rakva a pakliba
    cards[num].picID = images[picnum].picID;
    cards[num].classList  = "div_onecard";
    cards[num].style.left = x + "px";
    cards[num].style.top  = y + "px";

    cards[num].appendChild(images[picnum]);
    cards[num].appendChild(images_back[picnum]);
    
    cards[num].onmouseover = onMouseHover;
    cards[num].onmouseout  = onMouseOutOfCard;
    cards[num].onclick = onCardClick;
    div_main.appendChild(cards[num]);    
}

function onCardClick() { // klikk a kártyán
    if (cardFlip || cardMoveToBase || cardsDocking) return; // if a card rotating animation is not finished, return

    if (this.cardNum == flippedOne || this.cardNum == flippedTwo) { // már át van fordítva / already flipped
        if (flippedOne != -1 && flippedTwo != -1) flipBackSelectedCards(); // már két kártya át van fordítva
        return;
    }
    if (flippedOne != -1 && flippedTwo != -1) { // már két kártya át van fordítva
        flipBackSelectedCards();
        return;
    } 

    //flipCard(this.cardNum, true); // a kártya átfordítrása

    if (flippedOne == -1) 
        flippedOne = this.cardNum
    else {
        flippedTwo = this.cardNum;
        checkIfSamePic(); // ha már két kártya van átfordítva, megvizsgálja, hogy azonosak-e
    }    

    cardFlipToSeePic = true;
    cardFlip = true;
}

function flipBackSelectedCards() { // visszafordítja az átfordított kártyákat
    cardFlipToSeePic = false;
    cardFlip = true;    
    return;

    images_back[flippedOne].style.visibility = "visible";
    images[flippedOne].style.visibility = "hidden";
    images_back[flippedTwo].style.visibility = "visible";
    images[flippedTwo].style.visibility = "hidden";
    flippedOne = -1; flippedTwo = -1;

}

function checkIfSamePic() { // ha már két kártya van átfordítva, megvizsgálja, hogy azonosak-e
    if (cards[flippedOne].picID != cards[flippedTwo].picID) return;
    cardMoveToBase = true;
}

function moveCardOneStepIsDocked(cardNum) {
    cards[cardNum].style.left = cards[cardNum].offsetLeft + coords[cards[cardNum].coordNum].moveX + "px";
    cards[cardNum].style.top  = cards[cardNum].offsetTop  + coords[cards[cardNum].coordNum].moveY + "px";

    if (baseX - cards[cardNum].offsetLeft < 5) {
        cards[cardNum].style.left = baseX + "px";
        cards[cardNum].style.top  = baseY + "px";
        cards[cardNum.docked] = true;

        cards[cardNum].style.display = "none";
        cardDockedCount ++;
        return true;
    }

    return false;
}

function setAllDockingON() {
    cardsDocking = true;
}

function tAllCardsMoveToBase() {
    if (!cardsDocking || cardDockedCount == (rowCount * colCount)) return;
    
    for (let cNum = 0; cNum < rowCount * colCount; cNum++) {
        if (cards[cNum].docked) continue;
    
       // if (moveCardOneStepIsDocked(cNum)) cardsDocking = false;
        moveCardOneStepIsDocked(cNum);
        if (cardDockedCount == rowCount * colCount) 
            cardsDocking = false;
    }        
}

function tCardMoveToBase() {  // timer: a párosított kártyák visszatérnek a pakliba
    if (!cardMoveToBase || cardFlip) return;
    
    if (moveCardOneStepIsDocked(flippedOne)) {
        cards[flippedTwo].style.left = baseX + "px";
        cards[flippedTwo].style.top  = baseY + "px";
        cards[flippedTwo.docked] = true;
        cards[flippedTwo].style.display = "none";
        cardDockedCount ++;

        flippedOne = -1; flippedTwo = -1;
        cardMoveToBase = false;
    }
    else
        moveCardOneStepIsDocked(flippedTwo);  
}

function initCards() {    
    for (let y = 0; y < rowCount; y++)        
        for (let x = 0; x < colCount; x++)                
            initOneCard(y * colCount + x,                 // card number
                        y * colCount + x,                 // picture number
                       (x * (baseCardSize + 10)) + 0,     // x
                        y * ((baseCardSize * 1.6) + 10)); // y
}

function flipCard(num, toSeePic) { // num értékben megadott sorszámú kártya átfordítása
    if (toSeePic) {
        images_back[num].style.visibility = "hidden";
        images[num].style.visibility = "visible";    
    }
    else {
        images[num].style.visibility = "hidden";    
        images_back[num].style.visibility = "visible";
    }
}

function changeSizeToActSize(cNum) {
    cards[cNum].style.width = actCardSize + "px";
    images_back[cNum].style.width = actCardSize + "px";
    images[cNum].style.width = actCardSize + "px";
    cards[cNum].style.marginLeft = (baseCardSize - actCardSize) / 2 + "px";
}

function tCardFlip() {
    if (!cardFlip) return; // Csak akkor van tennivaló, ha éppen átfordul egy kártya

    if (!cardGrow) {
        actCardSize -= growNumber;
        if (actCardSize <= 0) {
            actCardSize = 0;
            cardGrow = true;
            if (cardFlipToSeePic) {
                if (flippedTwo != -1) flipCard(flippedTwo, true)
                else                  flipCard(flippedOne, true)
            }
            else {
                flipCard(flippedOne, false);
                flipCard(flippedTwo, false);
            }
        }
    }
    else {
        actCardSize += growNumber;
        if (actCardSize >= baseCardSize) {
            actCardSize = baseCardSize;
            if (!cardFlipToSeePic) {
                flippedOne = -1; flippedTwo = -1;
            }
            cardGrow = false;            
            cardFlip = false;
        }        
    }

    if (flippedTwo != -1) {
        changeSizeToActSize(flippedTwo);
        if (!cardFlipToSeePic)
            changeSizeToActSize(flippedOne);
    }
    else {
        changeSizeToActSize(flippedOne);
    }

    /*  card.style.width = actCardSize + "px";
    img.style.width = actCardSize + "px";
    card.style.marginLeft = (100 - actCardSize) / 2 + "px";*/
}

function mouseXY(e) {
  /*  card.style.left = e.clientX - 50 + "px";
    card.style.top  = e.clientY - 50 + "px";*/
}

function cardClick() {
    /*if (cardRotateing) return;
    cardRotateing = true;
    cardGrow = false;*/
}
