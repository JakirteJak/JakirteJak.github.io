function sont_dataclear() { // Törli a szövegmezőket
    let mezo1 = document.getElementById("Iminput");
    mezo1.value = "";
    mezo1 = document.getElementById("Itinput");
    mezo1.value = "";
    mezo1 = document.getElementById("Rminput");
    mezo1.value = "";
    mezo1 = document.getElementById("Rsinput");
    mezo1.value = "";
}

function sont_szamitas() { // Kiszámolja három mezőből a negyediket
    let Im = parseFloat(document.getElementById("Iminput").value); // Ampermérő méréshatára
    let It = parseFloat(document.getElementById("Itinput").value); // Szükséges méréshatár a sönttel
    let Rm = parseFloat(document.getElementById("Rminput").value); // Műszer belső ellenállása
    let Rs = parseFloat(document.getElementById("Rsinput").value); // Sönt ellenállás

    // Megszámolja hány üresenhagyott mező van
    let numofempty = 0;
    if (document.getElementById("Iminput").value == "") numofempty++;
    if (document.getElementById("Itinput").value == "") numofempty++;
    if (document.getElementById("Rminput").value == "") numofempty++;
    if (document.getElementById("Rsinput").value == "") numofempty++;

    if (numofempty > 1) { // Ha több mint egy mező üres, hiba
        alert("Legalább három mezőt ki kell tölteni!"); return;
    }
    if (numofempty == 0) { // Ha minden mező ki van töltve, hiba
        alert("Egyszerre csak három mezőt kell kitölteni, a negyediket számolom!"); return;
    }

    // Megszámolja, hogy mező érvénytelen
    let numofnan = 0;
    ImOK = true; ItOK = true;
    RmOK = true; RsOK = true;
    if (Im.toString() == "NaN") { numofnan++; ImOK = false; }
    if (It.toString() == "NaN") { numofnan++; ItOK = false; }
    if (Rm.toString() == "NaN") { numofnan++; RmOK = false; }
    if (Rs.toString() == "NaN") { numofnan++; RsOK = false; }
    if (numofnan > 1) { // Ha számok helyett más karakterek vannak megadva, hiba.
                        // Legalább egy mezőt hibásnak lát, amelyiket üresen hagyott a felhasználó.
        alert("Hibás értékmegadás!")
        return;
    }

    result = parseFloat(0);
    if (!ImOK) { // Ampermérő méréshatára sönt nélkül számítása
        result = It * Rs / (Rm + Rs);
        document.getElementById("Iminput").value = parseFloat(result).toPrecision(4);
    }

    if (!ItOK) { // Szükséges méréshatár a sönttel
        result = (Im * Rm + Im * Rs) / Rs;
        document.getElementById("Itinput").value = parseFloat(result).toPrecision(4);
    }

    if (!RmOK) { // Műszer belső ellenállása számítása
        result = (It - Im) * Rs / Im;
        document.getElementById("Rminput").value = parseFloat(result).toPrecision(4);
    }

    if (!RsOK) { // Sönt ellenállás számítása
        result = Im * Rm / (It - Im);
        document.getElementById("Rsinput").value = parseFloat(result).toPrecision(4);
    }
}
