export const createNavigator = (parentElement, reparti, table, giorno, lista_diz, hours) => {
    let activeIndex = 0; 

    return {
        build: () => {
            return reparti.map((item, index) => {
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
            Array.from(parentElement.querySelectorAll("button")).forEach(button => {
                button.addEventListener("click", () => {
                    const index = parseInt(button.getAttribute("data-index")); 
                    this.setActive(index);
                });
            });
        },
        setActive: function(index) {
            activeIndex = index;
            this.render();
            table.creaheader(giorno); 
            table.crea(lista_diz, hours, giorno);
        }
    };
};