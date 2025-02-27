import { createMiddleware } from "./Middleware/CreateMiddleware.js";
import { createTable } from "./Table/CreateTable.js";
import { createNavigator } from "./Navigator/CreateNavigator.js";
import { createForm } from "./Form/CreateForm.js";
import { createBookButton } from "./Bottoni/CreateButtons.js";
import { giorno_iniziale, createDiz, createBooking } from "./Funzioni/CreateFunctions.js";
import { createLogin } from "./Login/CreateLogin.js";

const database = createMiddleware();
database.add({
    "idType": 1,
    "name": "Mario Rossi",
    "hour": 1200,
    "date": "2025-02-27"
}).then(res => {
    database.load().then(result => {
        console.log(result);
    });
})

const login = createLogin();

const loginButton = document.getElementById("LoginButton");

// Nascondere inizialmente il bottone "Prenota"
const bookButtonContainer = document.getElementById("controls");
bookButtonContainer.classList.add("hidden");

loginButton.onclick = () => {
    document.getElementById("login").classList.remove("hidden");
    document.getElementById("modal").classList.add("visible");
};

// Bottoni per la navigazione tra le settimane
const precedente = document.querySelector(".precedente");
const successivo = document.querySelector(".successiva");

// Inizializzazione della tabella e dei dati
let table = createTable(document.querySelector("#table"));
let giorno = giorno_iniziale(); // Data iniziale corretta
let hours = ["08:00", "09:00", "10:00", "11:00", "12:00"];
let lista_diz = createDiz({});

// Creazione dei tab di specialità
let specialtyTabs = createNavigator(
    document.getElementById("specialty-tabs"),
    ["Cardiologia", "Psicologia", "Oncologia", "Ortopedia", "Neurologia"],
    table, 
    giorno, 
    lista_diz, 
    hours
);
specialtyTabs.render();

// Creazione della tabella con i giorni della settimana corretti
table.build(["LUNEDÌ", "MARTEDÌ", "MERCOLEDÌ", "GIOVEDÌ", "VENERDÌ"]);
table.creaheader(new Date(giorno));
table.crea(lista_diz, hours, new Date(giorno));

// Gestione della navigazione tra le settimane
precedente.onclick = () => {
    giorno.setDate(giorno.getDate() - 7);
    table.creaheader(new Date(giorno));
    table.crea(lista_diz, hours, new Date(giorno));
};

successivo.onclick = () => {
    giorno.setDate(giorno.getDate() + 7);
    table.creaheader(new Date(giorno));
    table.crea(lista_diz, hours, new Date(giorno));
};

// Creazione e configurazione del form di prenotazione
const form = createForm(document.getElementById("form"));
form.setlabels([
    ["Data", "date"],
    ["Orario Prenotazione", "dropdown", ["08:00", "09:00", "10:00", "11:00", "12:00"]],
    ["Nominativo", "text"],
]); 

form.submit((formData) => {
    document.getElementById("Message").onclick = openModal();
    console.log("Dati inviati:", formData);
    createBooking(formData);
});

// Creazione del bottone di prenotazione
const bookButton = createBookButton(document.getElementById("controls"), form);
bookButton.render();

document.getElementById("buttonConfermaLogin").onclick = () => {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    if (username && password) {
        login.checkLogin(username, password).then((result) => {
            console.log(result);
            if (result === true) {
                login.validateLogin();
                // Nasconde il login e il modal
                document.getElementById("login").classList.add("hidden");
                document.getElementById("modal").classList.remove("visible");

                // Nasconde il pulsante di login
                loginButton.classList.add("hidden");

                // Mostra il bottone "Prenota"
                bookButtonContainer.classList.remove("hidden");
            } else {
                alert("Credenziali errate");
            }
        }, console.log);
    } else {
        alert("Compila tutti i campi.");
    }
};

document.getElementById("buttonCancella").onclick = () => {
    document.getElementById("login").classList.add("hidden"); // Nasconde il form di login
    document.getElementById("modal").classList.remove("visible"); // Nasconde il modal
};