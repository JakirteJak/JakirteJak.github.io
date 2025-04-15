let szakmak = {};
let szakemberek = [];
const reszletekDiv = document.getElementById("reszletek");
// Menüelemek
document.getElementById("menuSzakiLista").addEventListener("click", SzakiListaAktivalas);
document.getElementById("menuSzakiKereso").addEventListener("click", kereses);
document.getElementById("menuKapcsolat").addEventListener("click", betolt(""));
// Kereső mezők, és törlőgombok
document.getElementById("nevKeres").addEventListener("input", kereses);
document.getElementById("szakmaKeres").addEventListener("input", kereses);
document.getElementById("btnNevTorol").addEventListener("click", nevTorol);
document.getElementById("btnSzakmaTorol").addEventListener("click", szakmaTorol);
// Fő tartalmak div -jei
let div_kereso     = document.getElementById("div_kereso");
let div_szakilista = document.getElementById("div_szakilista");
let talalatok = [];

kereses();

async function betoltAdatok() {
    try {
        // Szakmák adatainak betöltése
        const szakmakResponse = await fetch('data/szakmak.json');
        if (!szakmakResponse.ok) throw new Error("Nem sikerült betölteni a szakmak.json fájlt");
        szakmak = await szakmakResponse.json();        

        const szakmaLista = document.getElementById("szakmaLista");
        szakmaLista.innerHTML = ""; // Tisztítás
        
        const rendezettSzakmak = Object.values(szakmak).sort((a, b) => a.localeCompare(b, 'hu')); // Betűrendbe rendezés

        rendezettSzakmak.forEach(szakma => {
            const option = document.createElement("option");
            option.value = szakma;
            szakmaLista.appendChild(option);            
        });
       
        // Szakemberek adatainak betöltése
        const szakikResponse = await fetch('data/szakik.json');
        if (!szakikResponse.ok) throw new Error("Nem sikerült betölteni a szakik.json fájlt");
        const data = await szakikResponse.json();
        szakemberek = data;
        szakemberek.sort((a, b) => a.nev.localeCompare(b.nev)); // Névszerint rendezés

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

    SzakilistaFeltoltes();
}

async function kereses() {
    div_kereso.style.display = "block";
    div_szakilista.style.display = "none";

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
    tabla.className = "szakember-reszletek div_max";
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
        <table class="szakember-reszletek div_max">
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

function SzakiListaAktivalas(){
    div_kereso.style.display = "none";
    div_szakilista.style.display = "block";
}

function SzakilistaFeltoltes(){
    const tabla = document.createElement("table");
    tabla.className = "szakember-reszletek div_max";
    tabla.id = "szakember-talalatok";
    
    szakemberek.forEach((szakember, index) => {
        const sor = tabla.insertRow(); // Új sor létrehozása
        const sorszamCella = sor.insertCell(); // Cella a sorszámnak
        const nevCella = sor.insertCell(); // Cella a névnek

        sorszamCella.classList.add("sorszamok");
        sorszamCella.innerText = index + 1;
        nevCella.innerText = szakember.nev;

        // Szakterületek lekérdezése és formázása
        let szakteruletekSzoveg = "";
        if (szakember.szakteruletek && szakember.szakteruletek.length > 0) {
            szakteruletekSzoveg = szakember.szakteruletek
              .map(szakteruletId => szakmak[szakteruletId] || "Ismeretlen szakterület")
              .join(", ");
          } else {
            szakteruletekSzoveg = "Nincs megadva";
          }

        let reszletekSor = null; // Ide kerül majd a reszletek sor
        nevCella.onclick = () => { // Kattintásra részletek megjelenítése, vagy elrejtése
            if (reszletekSor){ // Ha a részletek sor már létezik, akkor töröljük
                tabla.deleteRow(reszletekSor.rowIndex);
                reszletekSor = null;
            }
            else
            { // Ha a részletek sor még nem létezik, akkor létrehozzuk
                reszletekSor = tabla.insertRow(sor.rowIndex + 1); // A név alatti sorba szúrjuk be
                const reszletekCella = reszletekSor.insertCell();
                reszletekCella.colSpan = 2; // Összefogjuk a két oszlopot

                reszletekCella.innerHTML = `
                    <div class="szakember-reszletek-container">
                        <p class="cimke"><span class="cimke">Telefon:</span><span class="adat">${szakember.telefon || 'Nincs megadva'}</span></p>
                        <p class="cimke"><span class="cimke">Email:</span> <span class="adat">${szakember.email || 'Nincs megadva'}</span></p>
                        <p class="cimke"><span class="cimke">Adószám:</span> <span class="adat">${szakember.adoszam || 'Nincs megadva'}</span></p>
                        <p class="cimke"><span class="cimke">Szakterületek:</span> <span class="adat">${szakteruletekSzoveg}</span></p>
                        <p></p>
                    </div>`;                    
            }
            
        }        
      });
    
      div_szakilista.querySelector("#szakilista_tartalom").innerHTML = "";
      div_szakilista.querySelector("#szakilista_tartalom").appendChild(tabla);

      document.getElementById("span_szakik_szama").innerHTML = 
        "<span style='color: lightgreen;'>" + szakemberek.length + "</span>" + "<span style='color: white;'> fő</span>";
}
