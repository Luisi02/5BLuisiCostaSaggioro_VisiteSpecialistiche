import { createMiddleware, createSpecialtyTabs, createBookButton, OpenNavigator, crea_lista_diz, createForm, Booking, createTable } from "./components.js";

const middleware = createMiddleware();
const categories = createSpecialtyTabs();
const bookButton = createBookButton();
const navigator = OpenNavigator();
const list = crea_lista_diz();
const form = createForm();
const booking = Booking();
const table = createTable();

//bottoni per le settimane precedenti e successive
const precedente = document.querySelector(".precedente");
const successivo = document.querySelector(".successiva")

//funzione per aggiornare la tabella con i giorni della settimana precedente
precedente.onclick = () => {
    console.log(giorno)
    giorno.setDate(giorno.getDate() - 7);
    table.creaheader(giorno)
    table.crea(lista_diz, hours,giorno);
}

//funzione per aggiornare la tabella con i giorni della settimana successiva
successivo.onclick = () => {
    giorno.setDate(giorno.getDate() + 7);
    table.creaheader(giorno)
    table.crea(lista_diz, hours,giorno);
}

//funzione per il calcolo del giorno di partenza, ossia lunedì e toglie sabati e domeniche
const giorno_iniziale = () => {
    let oggi = new Date();
    let giorno_settimanale = oggi.getDay();

    if (giorno_settimanale === 6){
        oggi.setDate(oggi.getDate() + 2);
    } else if (giorno_settimanale === 0){
        oggi.setDate(oggi.getDate() + 1);
    }
    console.log(oggi)
    return oggi;
};

let giorno = giorno_iniziale()
let hours = ["08:00", "09:00", "10:00", "11:00", "12:00"];

//fetch del json, fetch dei data per aggiornare la tabella con la render
GetData().then(()=>{
    chiave = config.cacheToken
    GET(chiave).then((result_get)=>{
        lista_diz=crea_lista_diz(result_get)
        table.build( ["LUNEDÌ", "MARTEDÌ", "MERCOLEDÌ", "GIOVEDÌ", "VENERDÌ"]);
        let lunedi = giorno_iniziale()
        table.creaheader(lunedi);
        table.crea(lista_diz, hours,lunedi);
    })

    }
  )

//set Interval per aggiornare i dati ogni 3 minuti
setInterval(()=>{
    GetData().then(()=>{
        chiave = config.cacheToken
        GET(chiave).then((result_get)=>{
            lista_diz=crea_lista_diz(result_get)
            table.creaheader(giorno);
            table.crea(lista_diz, hours,giorno);
        })
        }
      )
},300000)

