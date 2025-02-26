export const createMiddleware = () => {
    return {
        load: async () => {
          const response = await fetch("/bookings");
          const json = await response.json();
          return json;
        },
        delete: async (id) => {
          const response = await fetch("/delete/" + id, {
            method: 'DELETE',
          });
          const json = await response.json();
          return json;
        },
        add: async (booking) => {
          const response = await fetch("/insert", {
              method: 'POST',
              headers: {
                  "content-type": "application/json"
              },
              body: JSON.stringify({
                  booking: booking
              })
          });
          const json = await response.json();
          return json;        
        }
    }
};

let specialtyTabs;
let chiave;

export const createSpecialtyTabs = (parentElement,reparti) => {
  let activeIndex = 0; 
  console.log(parentElement)
  console.log(reparti)
  return {
    //funzione che crea i bottoni
    build: () => {
      return reparti.map((item,index) => {
        let buttonClass = 'specialty-tab';
        if (index === activeIndex) {
          buttonClass += ' active';
        }
        return `<button class="${buttonClass}" data-index="${index}">
          ${item}
        </button>`;
      }).join('');
    },
    render: function() {
      parentElement.innerHTML = this.build();
      //per ogni bottone creo un funzione che se il bottone viene schiacciato gli da la classe active e aggiorna la tabella
      Array.from(parentElement.querySelectorAll("button")).forEach(button => {
        button.addEventListener("click", () => {
          const index = parseInt(button.getAttribute("data-index")); 
          this.setActive(index); 
          table.creaheader(giorno)
          table.crea(lista_diz, hours,giorno);
        });
      });
    },
    setActive: function(index) {
      activeIndex = index;
      this.render();
    }
  };
};

//bottone prenota
export const createBookButton = (parentElement) => {
    return {
      render: () => {
        parentElement.innerHTML = `
          <button class="book-button" id="openModalButton">Prenota<i class="fa-solid fa-arrow-right"></i></button>
        `;
        document.getElementById("openModalButton").onclick = () => {
          form.render();
        };
      }
    };
};

export const OpenNavigator = () => {
    let specialtyTabs = createSpecialtyTabs(document.getElementById("specialty-tabs"),config.tipologie);
    const bookButton = createBookButton(document.getElementById("controls"));
    specialtyTabs.render();
    bookButton.render();
};

let lista_diz = [];

/* Funzione per creare una lista a partire da un dizionario */
export const crea_lista_diz = (result) => {
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

/* Funzione per creare e gestire un form all'interno di una modale */
export const createForm = () => {
    let data;
    callback = null;

    const modal = document.getElementById("modal");
    modal.style.display = "none";

    const closeModal = () => {
        modal.style.display = "none";
    };

    const openModal = () => {
        modal.style.display = "block";
    };

    const renderModalContent = () => {
        // Aggiunge il contenuto HTML alla modale, compreso il form e i pulsanti
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button" id="closeButton"></span>
                <div id="formContent"></div>
                <div id="Message"></div>
                <button type="button" class="btn btn-primary" id="submit">PRENOTA</button>
                <button type="button" class="btn btn-secondary" id="cancel">ANNULLA</button>
            </div>
        `;

        document.getElementById("Message").onclick = closeModal;
        document.getElementById("closeButton").onclick = closeModal;
        document.getElementById("cancel").onclick = closeModal;

        const submitButton = document.getElementById("submit");
        submitButton.onclick = () => {
            const result = {};
            data.forEach((index) => {
                result[index[0]] = document.getElementById(index[0]).value;
            });
            let nom_rep = document.querySelector(".active").textContent.trim();
            console.log(nom_rep);
            result["Reparto"] = nom_rep;
            let chiave_d = `${result["Reparto"]}/${result["Data"]}/${result["Orario Prenotazione"]}`;
            Aggiorna(chiave_d, result["Nominativo"]);
            document.getElementById("Message").innerText = "Prenotazione eseguita con successo";
            if (callback) {
                console.log(result);
                callback(result);
            }
        };
    };

    return {
        // Components
        setlabels: (labels) => { data = labels; },
        submit: (callbackinput) => { callback = callbackinput; },
        render: () => {
            renderModalContent();
            const formContent = document.getElementById("formContent");
            formContent.innerHTML = data.map((index) => {
                if (index[1] === "dropdown") {
                    return `
                    <div class="form-group">
                        ${index[0]}
                        <select id="${index[0]}" class="form-control">
                            ${index[2].map(option => `<option value="${option}">${option}</option>`).join('')}
                        </select>
                    </div>`;
                }
                return `
                <div class="form-group">
                    ${index[0]}
                    <input type="${index[1]}" id="${index[0]}" class="form-control"/>
                </div>`;
            }).join("\n");

            openModal();
        },
    };
};

/* Funzione per gestire una prenotazione*/
export const Booking = (result) => {
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

const form = createForm(document.getElementById("form"));
form.setlabels([["Data", "date"],
    ["Orario Prenotazione", "dropdown", ["08:00", "09:00", "10:00", "11:00", "12:00"]],
    ["Nominativo", "text"],
]); // Imposta le etichette e i campi del form

form.submit = ((formData) => {
    document.getElementById("Message").onclick = openModal();
    console.log("Dati inviati:", formData);
    Booking(formData); // Esegue la funzione di prenotazione con i dati inviati
});

//creazione del componente tabella
export const createTable = (parentElement) => {
    let data = null;
    let header;
    let newrow = [];

    return {
        build:(dati) => {
            data = dati;
        },
        
        creaheader:(lunedi) => {
            header = "<table class='table table-bordered'><thead>";
            header += "<th>ORE</th>";
            let tempDate = new Date(lunedi);
            header += data.map(day => {
                const formato = day + " " + tempDate.toLocaleDateString("it-IT");
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
}

let table = createTable(document.querySelector("#table"));