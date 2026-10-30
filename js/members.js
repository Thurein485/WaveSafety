
const cards = document.querySelectorAll(".member-card");
const prevButton = document.querySelector(".prev-btn");
const nextButton = document.querySelector(".next-btn");

let currentIndex = 0;

function updateMembers() {

    cards.forEach((card, index) => {

        card.classList.remove("left", "center", "right", "hidden");

        if (index === currentIndex) {
            card.classList.add("center");
        } 
        else if (index === (currentIndex - 1 + cards.length) % cards.length) {
            card.classList.add("left");
        } 
        else if (index === (currentIndex + 1) % cards.length) {
            card.classList.add("right");
        } 
        else {
            card.classList.add("hidden");
        }

    });

}

// Click a card to move it to the centre
cards.forEach((card, index) => {

    card.addEventListener("click", () => {
        currentIndex = index;
        updateMembers();
    });

});

// Previous button
prevButton.addEventListener("click", () => {

    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateMembers();

});

// Next button
nextButton.addEventListener("click", () => {

    currentIndex = (currentIndex + 1) % cards.length;
    updateMembers();

});

// Initial display
updateMembers();
