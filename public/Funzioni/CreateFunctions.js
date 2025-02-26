//funzione per il calcolo del giorno di partenza, ossia lunedì e toglie sabati e domeniche
export const giorno_iniziale = () => {
    let oggi = new Date();
    let giorno_settimanale = oggi.getDay();

    // Se oggi è sabato (6) o domenica (0), passiamo a lunedì
    if (giorno_settimanale === 6) {
        oggi.setDate(oggi.getDate() + 2);
    } else if (giorno_settimanale === 0) {
        oggi.setDate(oggi.getDate() + 1);
    }

    oggi.setDate(oggi.getDate() - ((oggi.getDay() + 6) % 7));

    console.log("Lunedì della settimana corrente:", oggi);
    return oggi;
};


/* Funzione per creare una lista a partire da un dizionario */
export const createDiz = (result) => {
    let lista_diz = [];
    const chiaviPrenotazioni = Object.keys(result);
    
    chiaviPrenotazioni.forEach((chiave_diz) => {
        // Per ogni chiave, crea una lista separando gli elementi con "/"
        let lista_prenotazione = chiave_diz.split("/");
        lista_prenotazione.push(result[chiave_diz]);
        lista_diz.push(lista_prenotazione);
    });
    
    console.log(lista_diz);
    return lista_diz;
};

/* Funzione per gestire una prenotazione*/
export const createBooking = (result) => {
    let available = [...lista_dizionario_giorni];
    console.log(available);
    let controllo = false;

    available.forEach((giorno) => {
        if (giorno["Data"] == result.Data) {
            for (chiave_dizionario in result) {
                if (chiave_dizionario != "Data") {
                    if ((giorno[chiave_dizionario] - result[chiave_dizionario]) < 0) {
                        controllo = true;
                    }
                }
            }
        }
    });

    if (controllo) {
        alert("Errore");
    } else {
        console.log("stai aggiornando");
        Aggiorna(result);
    }
};