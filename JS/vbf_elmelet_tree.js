const topPanel = document.getElementById('topPanel');
const mainPanel = document.getElementById('mainPanel');
const resizer = document.getElementById('resizer');
const leftPanel = document.getElementById('leftPanel');
const rightPanel = document.querySelector('.right');
const container = document.querySelector('.container');

ReadLinkList('../data/vbf_elmelet_links.json'); // Elmélet anyagok lista beolvasása

// Függőleges méretezőpanel eseményei
let isResizing = false; // Változó, hogy jelzi, hogy éppen átméretezés folyamatban van-e

resizer.addEventListener('mousedown', function(e) {
    isResizing = true; // Átméretezés megkezdése

    // Az egérmozgás figyelése
    window.addEventListener('mousemove', resizePanel);
});

window.addEventListener('mouseup', function(e) {        
    if (isResizing) {
        isResizing = false; // Átméretezés befejezése

        // Az egérmozgás figyelésének leállítása
        window.removeEventListener('mousemove', resizePanel);
    }
});

function resizePanel(e) {
    if (isResizing) {
        const panelWidth = e.clientX;
        leftPanel.style.width = `${panelWidth}px`; // Bal oldali panel átméretezése
    }
}

// Felső panel klikk esemény
topPanel.addEventListener('click', function(e) {
    const target = e.target;
    readyToFillMainPanel = false;
    e.preventDefault(); // Az alapértelmezett esemény letiltása        
    const targetHref = target.getAttribute('href'); // link
    const contentElement = document.querySelector('.div_right'); // Cél panel

    if (target.id == 'btnQs'){ // Tesztkérdések gomb
        leftPanel.style.display = 'none';
        resizer.style.display = 'none';
        readyToFillMainPanel = true;
    }
    else if (target.id == 'btnElmelet'){ // Elmélet gomb
        leftPanel.style.display = 'block';
        resizer.style.display = 'block';
        ReadLinkList('../data/vbf_elmelet_links.json');
        readyToFillMainPanel = true;
    }

    if (readyToFillMainPanel)
        contentElement.innerHTML = `<iframe src="${targetHref}" style="width:100%; height:100%; border:none;"></iframe>`;
});

// Bal oldali panel tartalmának kezelése kattintáskor
leftPanel.addEventListener('click', function(e) {
    const target = e.target;

    if (target.classList.contains('node-parent')) {
        e.preventDefault(); // Az alapértelmezett esemény letiltása

        // Ha a kattintott elem egy fő elem, akkor jelenítsük meg vagy rejtjük el a gyermek elemeket
        const childNodes = Array.from(target.getElementsByClassName('node'));

        if (target.dataset.childVisible === 'false') {
            childNodes.forEach(child => {
                child.style.display = 'block';
            });
            target.dataset.childVisible = 'true';

            if (!target.classList.contains('no-child')){
                arrowIndex = target.innerHTML.indexOf('➤');
                newIH = target.innerHTML.substring(0, arrowIndex) + '▼' + target.innerHTML.substring(arrowIndex + 1);
                target.innerHTML = newIH;
            }
        } 
        else {
            childNodes.forEach(child => {
                child.style.display = 'none';
            });
            target.dataset.childVisible = 'false';

            if (!target.classList.contains('no-child')){
                arrowIndex = target.innerHTML.indexOf('▼');
                newIH = target.innerHTML.substring(0, arrowIndex) + '➤' + target.innerHTML.substring(arrowIndex + 1);
                target.innerHTML = newIH;
            }
        }

        if (target.classList.contains('link')) {
            e.preventDefault(); // Az alapértelmezett esemény letiltása

            // Ha a kattintott elem link, akkor frissítsük a jobb oldali panel tartalmát
            const targetHref = target.getAttribute('href');
            const contentElement = document.querySelector('.div_right');
            contentElement.innerHTML = `<iframe src="${targetHref}" style="width:100%; height:100%; border:none;"></iframe>`;
        }
    } else if (target.classList.contains('link')) {
        e.preventDefault(); // Az alapértelmezett esemény letiltása

        // Ha a kattintott elem link, akkor frissítsük a jobb oldali panel tartalmát
        const targetHref = target.getAttribute('href');
        const contentElement = document.querySelector('.div_right');
        contentElement.innerHTML = `<iframe src="${targetHref}" style="width:100%; height:100%; border:none;"></iframe>`;
    }
});  

// Linkek beolvasása a baloldali panelba
function ReadLinkList(filename){    
    leftPanel.innerHTML = "";
    fetch(filename)
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        const mainLink = Object.values(item)[0];
        if (mainLink != "") {
          mainLinkElement = document.createElement('a'); // A szülő elemek linkként kerülnek megjelenítésre
          mainLinkElement.classList.add('link', 'node-parent', 'allNode');
        } else {
          mainLinkElement = document.createElement('div'); // A szülő elemek linkként kerülnek megjelenítésre
          mainLinkElement.classList.add('node-parent', 'allNode');
        }
  
        mainLinkElement.textContent = Object.keys(item)[0];
        if (item.childs && item.childs.length > 0)
          mainLinkElement.textContent += " ➤";
        else
          mainLinkElement.classList.add('no-child'); // ha nincs gyermek objektum
  
        mainLinkElement.href = mainLink; // Frissítve: valós linkeket használunk
        mainLinkElement.dataset.childVisible = 'false'; // Hozzáadva: alapértelmezett érték hozzáadása
        leftPanel.appendChild(mainLinkElement);
  
        item.childs.forEach(child => {
          const childKey = Object.keys(child)[0];
          const childLink = child[childKey];
  
          const linkElement = document.createElement('a');
          linkElement.textContent = '• ' + childKey;
          linkElement.href = childLink; // Frissítve: valós linkeket használunk
          linkElement.classList.add('link', 'node', 'allNode');
          linkElement.style.display = 'none'; // A gyermek nodeok alapból zárva vannak
          linkElement.target = "_blank"; // Az új ablakban való megnyitáshoz
  
          mainLinkElement.appendChild(linkElement); // A gyermek elemeket hozzá kell adni a fő elemhez
        });
      });
    })
    .catch(error => console.error('Hiba történt a JSON fájl beolvasása közben:', error));
}