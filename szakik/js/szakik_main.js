let szakmak = {};
let szakemberek = [];
const reszletekDiv = document.getElementById("reszletek");
document.getElementById("nevKeres").addEventListener("input", kereses);
document.getElementById("szakmaKeres").addEventListener("input", kereses);
document.getElementById("btnNevTorol").addEventListener("click", nevTorol);
document.getElementById("btnSzakmaTorol").addEventListener("click", szakmaTorol);
document.getElementById("menuSzakiLista").addEventListener("click", betolt(""));
document.getElementById("menuSzakiKereso").addEventListener("click", betolt(""));
document.getElementById("menuKapcsolat").addEventListener("click", betolt(""));
kereses();

async function betoltAdatok() {
    try {
        // Szakmák adatainak betöltése
        const szakmakResponse = await fetch('data/szakmak.json');
        if (!szakmakResponse.ok) throw new Error("Nem sikerült betölteni a szakmak.json fájlt");
        szakmak = await szakmakResponse.json();

        const szakmaLista = document.getElementById("szakmaLista");
        szakmaLista.innerHTML = ""; // Tisztítás

        Object.values(szakmak).forEach(szakma => {
            const option = document.createElement("option");
            option.value = szakma;
            szakmaLista.appendChild(option);
        });

        // Szakemberek adatainak betöltése
        const szakikResponse = await fetch('data/szakik.json');
        if (!szakikResponse.ok) throw new Error("Nem sikerült betölteni a szakik.json fájlt");
        const data = await szakikResponse.json();
        szakemberek = data;

        const szakemberNevLista = document.getElementById("szakemberNevLista");
        szakemberNevLista.innerHTML = ""; // Tisztítás

        Object.values(szakemberek).forEach(szakember => {
            const option = document.createElement("option");
            option.value = szakember.nev;
            szakemberNevLista.appendChild(option);
        }); 

    } catch (error) {
        console.error("Hiba történt az adatok betöltésekor:", error);
        alert("Nem sikerült betölteni az adatokat. Nézd meg a konzolt (F12) a részletekért.");
    }
}

let talalatok = [];

async function kereses() {    
    if (szakemberek.length === 0) await betoltAdatok();
    const nevInput = document.getElementById("nevKeres").value.toLowerCase();
    const szakmaInput = document.getElementById("szakmaKeres").value.toLowerCase();
    const talalatokDiv = document.getElementById("talalatok");
    reszletekDiv.innerHTML = "";
    talalatokDiv.innerHTML = "";

    // Ha mindkét mező üres, ne legyen találat
    if (nevInput === "" && szakmaInput === "") {
        return;
    }

    talalatok = szakemberek.filter(szakember => 
        (nevInput === "" || szakember.nev.toLowerCase().includes(nevInput)) &&
        (szakmaInput === "" || szakember.szakteruletek.some(id => szakmak[id]?.toLowerCase().includes(szakmaInput)))
    );

    const tabla = document.createElement("table");
    tabla.className = "szakember-reszletek";
    tabla.id = "szakember-talalatok";
    talalatok.forEach((szakember, index) => {
        const sor = tabla.insertRow(); // Új sor létrehozása
    
        const nevCella = sor.insertCell(); // Cella a névnek
        nevCella.innerText = szakember.nev;
        nevCella.onclick = () => megjelenitReszletek(index); // Kattintásra részletek megjelenítése
        nevCella.style.cursor = "pointer";  //Mutató kéz a cellára    
      });
    
      talalatokDiv.appendChild(tabla);
    /*talalatok.forEach((szakember, index) => {
        const div = document.createElement("div");
        div.className = "talalat";
        div.innerText = szakember.nev;
        div.onclick = () => megjelenitReszletek(index);
        talalatokDiv.appendChild(div);
    });*/
}

function megjelenitReszletek(index) {
    const szakember = talalatok[index];            
    reszletekDiv.innerHTML = `
        <p class="kiemelt_hatter div_max"><strong>Név:</strong> ${szakember.nev}</p>
        <p class="kiemelt_hatter div_max"><strong>Telefon:</strong> ${szakember.telefon}</p>
        <p class="kiemelt_hatter div_max"><strong>Email:</strong> <a href="mailto:${szakember.email}">${szakember.email}</a></p>
        <p class="kiemelt_hatter div_max"><strong>Szakterületek:</strong> ${szakember.szakteruletek.map(id => szakmak[id] || "Ismeretlen szakma").join(", ")}</p>
    `;
    
    reszletekDiv.innerHTML = `
        <table class="szakember-reszletek">
        <tr>
        <td><strong>Név:</strong></td>
        <td>${szakember.nev}</td>
        </tr>
        <tr>
        <td><strong>Telefon:</strong></td>
        <td>${szakember.telefon}</td>
        </tr>
        <tr>
        <td><strong>Email:</strong></td>
        <td><a href="mailto:${szakember.email}">${szakember.email}</a></td>
        </tr>
        <tr>
        <td><strong>Szakterületek:</strong></td>
        <td>${szakember.szakteruletek.map(id => szakmak[id] || "Ismeretlen szakma").join(", ")}</td>
        </tr>
        </table>
    `;
}

function betolt(fajl) {
    return;
    fetch(fajl)
        .then(response => response.text())
        .then(szoveg => {
            document.getElementById('tartalom').innerHTML = szoveg;
        });
}

function nevTorol(){
    document.getElementById("nevKeres").value = "";
    kereses();
}

function szakmaTorol(){
    document.getElementById("szakmaKeres").value = "";
    kereses();
}