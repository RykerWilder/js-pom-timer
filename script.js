const $one = document.querySelector.bind(document);
const $all = document.querySelectorAll.bind(document);

const main = $one('#main');
const pomTimer = $one('#pomodoro-timer');
const breakTimer = $one('#break-timer');
const pomoBtn = $one('#pomo-btn');
const breakBtn = $one('#break-btn');

let flagPom = true;
let flagBreak = false;

function updateDisplay() {
    if (flagPom) {
        pomTimer.classList.remove('hidden');
        main.classList.remove('bg-cyan-800');
        main.classList.add('bg-red-700');
        breakTimer.classList.add('hidden');
    } else {
        pomTimer.classList.add('hidden');
        main.classList.add('bg-cyan-800');
        main.classList.remove('bg-red-700');
        breakTimer.classList.remove('hidden');
    }
}

pomoBtn.addEventListener('click', () => {
    if (!flagPom) {
        flagPom = true;
        flagBreak = false;
        updateDisplay();
    }
});

breakBtn.addEventListener('click', () => {
    if (!flagBreak) {
        flagBreak = true;
        flagPom = false;
        updateDisplay();
    }
});

// Inizializza il display
updateDisplay();