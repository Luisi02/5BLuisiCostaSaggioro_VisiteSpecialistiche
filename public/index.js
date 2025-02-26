import { createMiddleware } from "./Middleware/CreateMiddleware.js";
import { createTable } from "./Table/CreateTable.js";
import { createNavigator } from "./Navigator/CreateNavigator.js";
import { createForm } from "./Form/CreateForm.js";
import { createBookButton } from "./Bottoni/CreateButtons.js";
import { giorno_iniziale, createDiz, createBooking } from "./Funzioni/CreateFunctions.js";

// Bottoni per le settimane precedenti e successive
const precedente = document.querySelector(".precedente");
const successivo = document.querySelector(".successiva");

// Funzione per aggiornare la tabella con i giorni della settimana precedente
precedente.onclick = () => {
    console.log(giorno);
    giorno.setDate(giorno.getDate() - 7);
    table.creaheader(giorno);
    table.crea(lista_diz, hours, giorno);
};

// Funzione per aggiornare la tabella con i giorni della settimana successiva
successivo.onclick = () => {
    giorno.setDate(giorno.getDate() + 7);
    table.creaheader(giorno);
    table.crea(lista_diz, hours, giorno);
};

// Creazione dei tab di specialità
let specialtyTabs;
let chiave;
// Creazione dei tab di specialità e del bottone di prenota
specialtyTabs = createNavigator(document.getElementById("specialty-tabs"), ["Cardiologia", "Psicologia", "Oncologia", "Ortopedia", "Neurologia"]);
specialtyTabs.render();

let table = createTable(document.querySelector("#table"));
let giorno = giorno_iniziale();
let hours = ["08:00", "09:00", "10:00", "11:00", "12:00"];

let lista_diz = [];
lista_diz = createDiz({});
table.build( ["LUNEDÌ", "MARTEDÌ", "MERCOLEDÌ", "GIOVEDÌ", "VENERDÌ"]);
let lunedi = giorno_iniziale()
table.creaheader(lunedi);
table.crea(lista_diz, hours, lunedi);

const form = createForm(document.getElementById("form"));
form.setlabels([["Data", "date"],
    ["Orario Prenotazione", "dropdown", ["08:00", "09:00", "10:00", "11:00", "12:00"]],
    ["Nominativo", "text"],
]); // Imposta le etichette e i campi del form

form.submit = ((formData) => {
    document.getElementById("Message").onclick = openModal();
    console.log("Dati inviati:", formData);
    createBooking(formData); // Esegue la funzione di prenotazione con i dati inviati
});
const bookButton = createBookButton(document.getElementById("controls"),form);
bookButton.render();