export const createBookButton = (parentElement, form) => {
    return {
        render: () => {
            parentElement.innerHTML = `
                <button class="book-button" id="openModalButton">Prenota <i class="fa-solid fa-arrow-right"></i></button>
            `;
            document.getElementById("openModalButton").onclick = () => {
                if (form && form.render) {
                    form.render();
                } else {
                    console.error("Errore", form);
                }
            };
        }
    };
};