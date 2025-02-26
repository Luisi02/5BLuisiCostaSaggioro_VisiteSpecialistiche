//creazione del componente tabella
export const createTable = (parentElement) => {
    let data = null;
    let header;
    let newrow = [];

    return {
        build:(dati) => {
            data = dati;
        },
        
        creaheader: (lunedi) => {
            header = "<table class='table table-bordered'><thead>";
            header += "<th>ORE</th>";
        
            let tempDate = new Date(lunedi);
            tempDate.setDate(tempDate.getDate() - ((tempDate.getDay() + 6) % 7));
        
            header += data.map(day => {
                const formato = `${day} ${tempDate.toLocaleDateString("it-IT")}`;
                tempDate.setDate(tempDate.getDate() + 1);
                return `<th>${formato}</th>`;
            }).join("");
        
            header += "</thead><tbody>";
            parentElement.innerHTML = header;
        },

        crea: (listadata, hours, lunedi) => {
            let Row = "";
            let nom_rep = document.querySelector(".active").textContent.trim()
            const currentWeek = [];
            console.log(lunedi)
            // Creiamo un'altra copia di `lunedi`
            let tempDate = new Date(lunedi);

            // Genera l'array delle date per i giorni della settimana
            for (let i = 0; i < 5; i++) {
                currentWeek.push(new Date(tempDate));
                tempDate.setDate(tempDate.getDate() + 1);
            }

            // Crea una riga per ogni ora
            hours.forEach(hour => {
                Row += `<tr><td>${hour}</td>`;

                // Crea una cella per ogni giorno della settimana
                currentWeek.forEach(day => {
                    let paziente = ""
                    const dayString = day.toISOString().split("T")[0];
                    //controllo dati e prenotazioni
                    listadata.forEach((prenotazione)=>{
                        if (nom_rep===prenotazione[0] && prenotazione[1]===dayString && prenotazione[2]===hour){
                            console.log("giorno e ora uguale")
                            paziente=prenotazione[3]
                        }
                    })
                    console.log(paziente)
                    //se ha trovato il paziente o inserisce altrimenti la casella rimane vuota
                    if (paziente!=""){
                        Row += `<td>${paziente}</td>`;
                    }
                    else{
                        Row += `<td></td>`
                    }
                    
                });

                Row += "</tr>";
            });
            parentElement.innerHTML = header + Row + "</tbody></table>";
        }
    }
};