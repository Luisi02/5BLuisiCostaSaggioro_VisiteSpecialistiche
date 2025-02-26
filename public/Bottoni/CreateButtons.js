//crea il bottone di prenota
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

