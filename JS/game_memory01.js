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

let timerMain = setInterval(tMain, 10);
let timerCardMoveToBase = setInterval(tCardMoveToBase, 5);
document.addEventListener("mousemove", function (event) { mouseXY(event) }); // Egérmozgás esemény

let baseCardSize = 100; // alap kártyaszélesség pixelben, ehhez viszonyít
let actCardSize  = 100;

let cardGrow   = false; // átforduláskor a növekedsi, vagy a csökkenése fázisban van
let cardRotate = false; // az egyik kártya éppen átfordul
let cardMoveToBase = false;
let growNumber = 5;        // átfordulás sebessége, valójában pixelben megadott érték, ennyit csökkent vagy növel
let cardFront = true;
let rowCount = 4; let colCount = 6;   // sorok és oszlopok száma
let flippedOne = -1; flippedTwo = -1; // átfordított kártyák sorszámai, egyszerre max kettő lehet; -1 esetén nincs kártyaszám
let distX1, distY1, distX2, distY2;

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

//cardRotateing = false;
let baseX = static_card.offsetLeft; 
let baseY = static_card.offsetTop;

initImages(); // képek betöltése
initCoords();
initCards();  // kártyát divjeinek létrehozása
giveNewCoordsToCards();
moveCardsToNewCoords();

function initImages() {
    for (let ci = 0; ci < 12; ci++) {
        img_num1 = (ci * 2);
        img_num2 = (ci * 2) + 1;
        images[img_num1] = document.createElement("img");
        images[img_num1].src = "img_cards/card" + (ci + 1) + ".jpg";        
        images[img_num1].style.height = baseCardSize * 1.6 +  "px";
      //  images[img_num1].style.visibility = "hidden";
        images[img_num1].picID = ci + 1;

        images[img_num2] = document.createElement("img");
        images[img_num2].src = "img_cards/card" + (ci + 1) + ".jpg";        
        images[img_num2].style.height = baseCardSize * 1.6 +  "px";
      //  images[img_num2].style.visibility = "hidden";
        images[img_num2].picID = ci + 1;
    }

    for (let ci = 0; ci < 24; ci++) {
        images_back[ci] = document.createElement("img");
        images_back[ci].src = "img_cards/cardback01_100x160.jpg";
        images_back[ci].style.height = baseCardSize * 1.6 +  "px";
        images_back[ci].style.position ="absolute";
        //images_back[ci].style.visibility = "hidden";
    }
}

function initCoords() {
    for (let y = 0; y < rowCount; y++)        
        for (let x = 0; x < colCount; x++)                
            coords.push({ X : x * (baseCardSize + 10), Y: y * ((baseCardSize * 1.6) + 10)});    
}

function giveNewCoordsToCards() {
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

function moveCardsToNewCoords() {
    for (let ci = 0; ci < (rowCount * colCount); ci++) {
        cards[ci].style.left = coords[cards[ci].coordNum].X + "px";
        cards[ci].style.top  = coords[cards[ci].coordNum].Y + "px";
    }
}

function newGameClick() {
    giveNewCoordsToCards();
    moveCardsToNewCoords();    
}

function onMouseHover() { // égér a kártyalap felett
    let h = this.style.height
    p.innerHTML = "cardnum: " + this.cardNum + "<br>" + 
                  "picnum: " + this.picNum + "<br>" +
                  this.style.left + "<br>" +
                  this.style.top + "<br>" + 
                  this.style.height + "<br>" +
                  this.offsetLeft + "<br>" +
                  this.offsetTop + "<br>" +
                  "picID: " + this.picID;
               
    this.style.width = baseCardSize + 14 + "px";
    this.style.height = baseCardSize * 1.6 + 14 + "px";
    this.style.left = this.offsetLeft - 7 + "px";    
    this.style.top = this.offsetTop - 7 + "px";

    images[this.picNum].style.width = baseCardSize + 18 + "px";
    images[this.picNum].style.height = baseCardSize * 1.6 + 18 + "px";
    images_back[this.picNum].style.width = baseCardSize + 18 + "px";
    images_back[this.picNum].style.height = baseCardSize * 1.6 + 18 + "px";
}

function onMouseOutOfCard() {
    this.style.width = baseCardSize + "px";
    this.style.height = baseCardSize * 1.6 + "px";
    this.style.left = this.offsetLeft + 7 + "px";
    this.style.top = this.offsetTop + 7 + "px";
    
    images[this.picNum].style.width = baseCardSize + "px";
    images[this.picNum].style.height = baseCardSize * 1.6 + "px";
    images_back[this.picNum].style.width = baseCardSize + "px";
    images_back[this.picNum].style.height = baseCardSize * 1.6 + "px";
}

function initOneCard(num, picnum, x, y) { // egy kártya inicializálása (num: kártyasorszám; picnum: kép sorszám)
    cards[num] = document.createElement("div");
    cards[num].style.height = baseCardSize * 1.6;   
    cards[num].cardNum = num;
    cards[num].picNum = picnum;
    cards[num].coordNum = 0;
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

function flipCard(num) { // num értkben megadott sorszámú kártya átfordítása
    images_back[num].style.visibility = "hidden";
    images[num].style.visibility = "visible";
}

function onCardClick() { // klikk a kártyán
    if (cardRotate || cardMoveToBase) return; // if a card rotating animation is not finished, return

    if (this.cardNum == flippedOne || this.cardNum == flippedTwo) { // már át van fordítva / already flipped
        if (flippedOne != -1 && flippedTwo != -1) flipBackSelectedCards(); // már két kártya át van fordítva
        return;
    }
    if (flippedOne != -1 && flippedTwo != -1) { // már két kártya át van fordítva
        flipBackSelectedCards();
        return;
    } 

    flipCard(this.cardNum); // a kártya átfordítrása

    if (flippedOne == -1) 
        flippedOne = this.cardNum
    else {
        flippedTwo = this.cardNum;
        checkIfSamePic(); // ha már két kártya van átfordítva, megvizsgálja, hogy azonosak-e
    }    
}

function flipBackSelectedCards() { // visszafordítja az átfordított kértyákat
    images_back[flippedOne].style.visibility = "visible";
    images[flippedOne].style.visibility = "hidden";
    images_back[flippedTwo].style.visibility = "visible";
    images[flippedTwo].style.visibility = "hidden";
    flippedOne = -1; flippedTwo = -1;

}

function checkIfSamePic() { // ha már két kártya van átfordítva, megvizsgálja, hogy azonosak-e
    if (cards[flippedOne].picID != cards[flippedTwo].picID) return;

    distX1 = (baseX - cards[flippedOne].offsetLeft) / 100;
    distY1 = (baseY - cards[flippedOne].offsetTop) / 100;
    distX2 = (baseX - cards[flippedTwo].offsetLeft) / 100;
    distY2 = (baseY - cards[flippedTwo].offsetTop) / 100;

    cardMoveToBase = true;
}

function tCardMoveToBase() {  // timer: a párosított kártyák visszatérnek a pakliba
    if (!cardMoveToBase) return;

    cards[flippedOne].style.left = cards[flippedOne].offsetLeft + distX1 + "px";
    cards[flippedOne].style.top  = cards[flippedOne].offsetTop  + distY1 + "px";

    cards[flippedTwo].style.left = cards[flippedTwo].offsetLeft + distX2 + "px";
    cards[flippedTwo].style.top  = cards[flippedTwo].offsetTop  + distY2 + "px";

    if (baseX - cards[flippedOne].offsetLeft < 5) {
        cards[flippedOne].style.left = baseX + "px";
        cards[flippedOne].style.top  = baseY + "px";
        cards[flippedTwo].style.left = baseX + "px";
        cards[flippedTwo].style.top  = baseY + "px";

        cards[flippedOne].style.display = "none";
        cards[flippedTwo].style.display = "none";
        flippedOne = -1; flippedTwo = -1;
        cardMoveToBase = false;        
    }
}

function initCards() {    
    for (let y = 0; y < rowCount; y++)        
        for (let x = 0; x < colCount; x++)                
            initOneCard(y * colCount + x, // card number
                        y * colCount + x, // picture number
                       (x * (baseCardSize + 10)) + 0,   // x
                        y * ((baseCardSize * 1.6) + 10)); // y
}

function tMain() {
    return;

    if (!cardGrow) {
        actCardSize -= growNumber;
        if (actCardSize <= 0) {
            actCardSize = 0;
            cardGrow = true;
            if (cardFront)
                img.src = "img/backg02.jpg";
            else
                img.src = "img_cards/card001.jpg";
            cardFront = !cardFront;            
        }
    }
    else {
        actCardSize += growNumber;
        if (actCardSize >= baseCardSize) {
            actCardSize = baseCardSize;
            cardGrow = true;
            cardRotateing = false;            
        }        
    }

    card.style.width = actCardSize + "px";
    img.style.width = actCardSize + "px";
    card.style.marginLeft = (100 - actCardSize) / 2 + "px";
}

function mouseXY(e) {
  /*  card.style.left = e.clientX - 50 + "px";
    card.style.top  = e.clientY - 50 + "px";*/
}

function cardClick() {
    if (cardRotateing) return;
    cardRotateing = true;
    cardGrow = false;
}
