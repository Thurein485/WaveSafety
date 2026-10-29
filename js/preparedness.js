// clock and date
function updateClock() {
    const timeElement = document.getElementById("live-time");
    const dateElement = document.getElementById("live-date");

    if (!timeElement || !dateElement) return;

    const now = new Date();

    timeElement.textContent = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    dateElement.textContent = now.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

updateClock();
setInterval(updateClock, 1000);


/* Safety tips for the dashboard */
const safetyTips = [
    {
        title: "Prepare an emergency bag",
        description: "Keep drinking water, food, a flashlight, a first-aid kit, important documents, and essential medicine ready."
    },
    {
        title: "Know your evacuation route",
        description: "Identify a safe place on higher ground and plan how to get there before flooding begins."
    },
    {
        title: "Stay away from floodwater",
        description: "Floodwater may hide dangerous objects, strong currents, and electrical hazards. Never walk or drive through it."
    },
    {
        title: "Protect important documents",
        description: "Place important documents and valuables in waterproof bags and keep them somewhere elevated."
    },
    {
        title: "Follow official warnings",
        description: "Listen to local authorities and trusted weather updates. Evacuate promptly when officials tell you to leave."
    }
];

let currentTip = 0;

const nextTipButton = document.getElementById("next-tip");

if (nextTipButton) {
    nextTipButton.addEventListener("click", function () {
        currentTip = (currentTip + 1) % safetyTips.length;

        const titleElement = document.getElementById("tip-title");
        const descriptionElement = document.getElementById("tip-description");

        if (titleElement && descriptionElement) {
            titleElement.textContent = safetyTips[currentTip].title;
            descriptionElement.textContent = safetyTips[currentTip].description;
        }
    });
}


/* Action cards and tip panels */
const actionCards = document.querySelectorAll(".action-card");
const tipPanels = document.querySelectorAll(".tip-panel");
const closeButtons = document.querySelectorAll(".close-panel");

actionCards.forEach(function (card) {
    card.addEventListener("click", function () {
        const panelId = card.getAttribute("data-panel");
        const selectedPanel = document.getElementById(panelId);

        if (!selectedPanel) return;

        const isOpen = selectedPanel.classList.contains("open");

        tipPanels.forEach(function (panel) {
            panel.classList.remove("open");
            panel.style.display = "none";
        });

        actionCards.forEach(function (item) {
            item.classList.remove("active");
        });

        if (!isOpen) {
            selectedPanel.classList.add("open");
            selectedPanel.style.display = "block";
            card.classList.add("active");

            selectedPanel.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    });
});

closeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const panel = button.closest(".tip-panel");

        if (!panel) return;

        panel.classList.remove("open");
        panel.style.display = "none";

        const panelId = panel.id;

        actionCards.forEach(function (card) {
            if (card.getAttribute("data-panel") === panelId) {
                card.classList.remove("active");
            }
        });
    });
});


/* Checklist, progress, points, and rewards */
const checkboxes = document.querySelectorAll(".prep-check");
const progressPercent = document.getElementById("progress-percent");
const progressCount = document.getElementById("progress-count");
const progressMessage = document.getElementById("progress-message");
const progressBar = document.getElementById("progress-bar");
const progressRing = document.getElementById("progress-ring");
const resetButton = document.getElementById("reset-checklist");

const storageName = "waveSafetyPreparedness";
let toastTimer;


/* Toast notifications */
function showToast(message) {
    const toast = document.getElementById("toast-message");
    const toastText = document.getElementById("toast-text");

    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 2500);
}


/* Save completed checklist tasks */
function saveChecklist() {
    const completedTasks = [];

    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            completedTasks.push(checkbox.value);
        }
    });

    try {
        localStorage.setItem(storageName, JSON.stringify(completedTasks));
    } catch (error) {
        console.warn("Could not save checklist progress.");
    }
}


/* Update checklist progress and rewards */
function updateProgress() {
    let completed = 0;

    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            completed++;
        }
    });

    const total = checkboxes.length;
    const percentage = total > 0
        ? Math.round((completed / total) * 100)
        : 0;

    const points = completed * 10;
    const degrees = percentage * 3.6;

    if (progressPercent) {
        progressPercent.textContent = percentage + "%";
    }

    if (progressCount) {
        progressCount.textContent = completed + " of " + total + " tasks";
    }

    if (progressBar) {
        progressBar.style.width = percentage + "%";
    }

    if (progressRing) {
        progressRing.style.background =
            "conic-gradient(#2a4700 " + degrees +
            "deg, #e7ecdf " + degrees + "deg)";
    }

    /* Progress message */
    if (progressMessage) {
        if (total === 0) {
            progressMessage.textContent = "No checklist tasks found.";
        } else if (percentage === 100) {
            progressMessage.textContent =
                "Great job! You have completed every task.";
        } else if (percentage >= 60) {
            progressMessage.textContent =
                "Good progress! Keep going and finish your plan.";
        } else if (percentage > 0) {
            progressMessage.textContent =
                "Nice start! Complete more tasks to prepare.";
        } else {
            progressMessage.textContent =
                "Start checking off your tasks to get ready.";
        }
    }

    /* Points */
    const pointsTotal = document.getElementById("points-total");
    const pointsBar = document.getElementById("points-bar");
    const pointsNext = document.getElementById("points-next");

    if (pointsTotal) {
        pointsTotal.textContent = points;
    }

    if (pointsBar) {
        pointsBar.style.width = (points / 80 * 100) + "%";
    }

    /* Reward information */
    const rewardCard = document.getElementById("reward-card");
    const rewardIcon = document.getElementById("reward-icon");
    const rewardLabel = document.getElementById("reward-label");
    const rewardTitle = document.getElementById("reward-title");
    const rewardDescription = document.getElementById("reward-description");

    if (
        rewardCard &&
        rewardIcon &&
        rewardLabel &&
        rewardTitle &&
        rewardDescription &&
        pointsNext
    ) {
        if (points >= 80) {
            rewardCard.classList.add("earned");
            rewardIcon.innerHTML = '<i class="fa-solid fa-trophy"></i>';
            rewardLabel.textContent = "REWARD UNLOCKED!";
            rewardTitle.textContent = "Flood Ready Champion!";
            rewardDescription.textContent =
                "Amazing! You completed every task and earned all 80 points.";
            pointsNext.textContent = "You reached the maximum score!";

        } else if (points >= 40) {
            rewardCard.classList.remove("earned");
            rewardIcon.innerHTML = '<i class="fa-solid fa-medal"></i>';
            rewardLabel.textContent = "SAFETY LEARNER";
            rewardTitle.textContent = "You're doing great!";
            rewardDescription.textContent =
                "Keep going to unlock your Flood Ready Champion reward.";
            pointsNext.textContent =
                (80 - points) + " more points to unlock your champion reward.";

        } else if (points >= 10) {
            rewardCard.classList.remove("earned");
            rewardIcon.innerHTML = '<i class="fa-solid fa-star"></i>';
            rewardLabel.textContent = "FIRST STEP UNLOCKED";
            rewardTitle.textContent = "Nice start!";
            rewardDescription.textContent =
                "You've started preparing. Complete more tasks to earn points.";
            pointsNext.textContent =
                (80 - points) + " more points to unlock your champion reward.";

        } else {
            rewardCard.classList.remove("earned");
            rewardIcon.innerHTML = '<i class="fa-solid fa-lock"></i>';
            rewardLabel.textContent = "REWARD LOCKED";
            rewardTitle.textContent = "Your reward is waiting!";
            rewardDescription.textContent =
                "Complete tasks to collect points and unlock your reward.";
            pointsNext.textContent =
                "Earn 10 points for every completed task.";
        }
    }
}


/* Load saved checklist tasks */
function loadChecklist() {
    let savedTasks = null;

    try {
        savedTasks = localStorage.getItem(storageName);
    } catch (error) {
        console.warn("Could not access saved checklist progress.");
    }

    if (savedTasks) {
        try {
            const completedTasks = JSON.parse(savedTasks);

            if (Array.isArray(completedTasks)) {
                checkboxes.forEach(function (checkbox) {
                    checkbox.checked =
                        completedTasks.includes(checkbox.value);
                });
            }
        } catch (error) {
            try {
                localStorage.removeItem(storageName);
            } catch (removeError) {
                console.warn("Could not clear invalid saved progress.");
            }
        }
    }

    updateProgress();
}


/* Listen for checklist changes */
checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
        saveChecklist();
        updateProgress();

        if (checkbox.checked) {
            showToast("You earned 10 points!");
        } else {
            showToast("Task unchecked. Your points have been updated.");
        }
    });
});


/* Reset checklist */
if (resetButton) {
    resetButton.addEventListener("click", function () {
        const confirmed = confirm(
            "Are you sure you want to reset your checklist and points?"
        );

        if (!confirmed) return;

        checkboxes.forEach(function (checkbox) {
            checkbox.checked = false;
        });

        try {
            localStorage.removeItem(storageName);
        } catch (error) {
            console.warn("Could not clear saved checklist progress.");
        }

        updateProgress();
        showToast("Your checklist and points have been reset.");
    });
}


/* Start the page */
loadChecklist();
