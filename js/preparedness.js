
// action cards and tip panels
const actionCards = document.querySelectorAll(".action-card");
const tipPanels = document.querySelectorAll(".tip-panel");
const closeButtons = document.querySelectorAll(".close-panel");

actionCards.forEach(function(card) {
    card.addEventListener("click", function() {
        const panelId = card.getAttribute("data-panel");
        const selectedPanel = document.getElementById(panelId);
        const isOpen = selectedPanel.style.display === "block";

        tipPanels.forEach(function(panel) {
            panel.style.display = "none";
        });

        actionCards.forEach(function(item) {
            item.classList.remove("active");
        });

        if (!isOpen) {
            selectedPanel.style.display = "block";
            card.classList.add("active");

            selectedPanel.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    });
});

closeButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const panel = button.closest(".tip-panel");
        panel.style.display = "none";

        const panelId = panel.id;

        actionCards.forEach(function(card) {
            if (card.getAttribute("data-panel") === panelId) {
                card.classList.remove("active");
            }
        });
    });
});

// checklist
const checkboxes = document.querySelectorAll(".prep-check");
const progressPercent = document.getElementById("progress-percent");
const progressCount = document.getElementById("progress-count");
const progressMessage = document.getElementById("progress-message");
const progressBar = document.getElementById("progress-bar");
const progressRing = document.getElementById("progress-ring");
const resetButton = document.getElementById("reset-checklist");

const storageName = "waveSafetyPreparedness";
let toastTimer;

// notifications
function showToast(message) {
    const toast = document.getElementById("toast-message");
    const toastText = document.getElementById("toast-text");

    toastText.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function() {
        toast.classList.remove("show");
    }, 2500);
}

// save completed tasks
function saveChecklist() {
    const completedTasks = [];

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            completedTasks.push(checkbox.value);
        }
    });

    localStorage.setItem(storageName, JSON.stringify(completedTasks));
}

// update progress and rewards
function updateProgress() {
    let completed = 0;

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            completed++;
        }
    });

    const total = checkboxes.length;
    const percentage = Math.round((completed / total) * 100);
    const points = completed * 10;

    // progress chart
    progressPercent.textContent = percentage + "%";
    progressCount.textContent = completed + " of " + total + " tasks";
    progressBar.style.width = percentage + "%";

    progressRing.style.background =
        "conic-gradient(#2a4700 " + (percentage * 3.6) +
        "deg, #e7ecdf " + (percentage * 3.6) + "deg)";

    if (percentage === 100) {
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

    // points
    document.getElementById("points-total").textContent = points;

    const pointsBar = document.getElementById("points-bar");
    const pointsNext = document.getElementById("points-next");

    pointsBar.style.width = (points / 80 * 100) + "%";

    // reward
    const rewardCard = document.getElementById("reward-card");
    const rewardIcon = document.getElementById("reward-icon");
    const rewardLabel = document.getElementById("reward-label");
    const rewardTitle = document.getElementById("reward-title");
    const rewardDescription = document.getElementById("reward-description");

    if (points === 80) {
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

// load saved tasks
function loadChecklist() {
    const savedTasks = localStorage.getItem(storageName);

    if (savedTasks) {
        try {
            const completedTasks = JSON.parse(savedTasks);

            if (Array.isArray(completedTasks)) {
                checkboxes.forEach(function(checkbox) {
                    checkbox.checked =
                        completedTasks.includes(checkbox.value);
                });
            }
        } catch (error) {
            localStorage.removeItem(storageName);
        }
    }

    updateProgress();
}

// update when a task is checked or unchecked
checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", function() {
        saveChecklist();
        updateProgress();

        if (checkbox.checked) {
            showToast("You earned 10 points!");
        } else {
            showToast("Task unchecked. Your points have been updated.");
        }
    });
});

// reset checklist
resetButton.addEventListener("click", function() {
    const confirmed = confirm(
        "Are you sure you want to reset your checklist and points?"
    );

    if (confirmed) {
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });

        localStorage.removeItem(storageName);

        updateProgress();
        showToast("Your checklist and points have been reset.");
    }
});

// start the page
loadChecklist();
