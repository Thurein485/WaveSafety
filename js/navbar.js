const mobileHome = document.getElementById("mobile_home");
const mobileUpd = document.getElementById("mobile_updates");
const mobileMore = document.getElementById("mobile_more");
const mobileSolution = document.getElementById("mobile_solution");
const mobileFloodRisk = document.getElementById("mobile_flood_risk");
const mobileNavButton = document.querySelectorAll(".mobile-nav-item");

const mobileLabels = [
    mobileHome,
    mobileUpd,
    mobileMore,
    mobileSolution,
    mobileFloodRisk
];

// Show Home by default
mobileLabels.forEach(function (label) {
    label.style.display = label === mobileHome ? "block" : "none";
});

mobileNavButton.forEach(function (button) {
    button.addEventListener("mouseenter", function () {
        mobileLabels.forEach(function (label) {
            label.style.display = "none";
        });

        const label = button.querySelector(".active-label");

        if (label) {
            label.style.display = "block";
        }
    });

    button.addEventListener("mouseleave", function () {
        mobileLabels.forEach(function (label) {
            label.style.display = "none";
        });

        mobileHome.style.display = "block";
    });
});
