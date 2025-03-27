document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const main = document.getElementById('main');
    const pomodoroTimer = document.getElementById('pomodoro-timer');
    const breakTimer = document.getElementById('break-timer');
    const pomodoroTab = document.getElementById('pomodoro-tab');
    const breakTab = document.getElementById('break-tab');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Timer Settings (in seconds)
    const settings = {
        pomodoro: 25 * 60,   // 25 minutes
        shortBreak: 5 * 60    // 5 minutes
    };

    // State Variables
    let currentTime = settings.pomodoro;
    let timerInterval;
    let isRunning = false;
    let isPomodoro = true;

    // Initialize
    updateDisplay();
    displayTime();

    // Event Listeners
    pomodoroTab.addEventListener('click', () => switchMode(true));
    breakTab.addEventListener('click', () => switchMode(false));
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Timer Functions
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            timerInterval = setInterval(updateTimer, 1000);
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
        }
    }

    function pauseTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            pauseBtn.classList.add('hidden');
            startBtn.classList.remove('hidden');
        }
    }

    function resetTimer() {
        pauseTimer();
        currentTime = isPomodoro ? settings.pomodoro : settings.shortBreak;
        displayTime();
    }

    function updateTimer() {
        if (currentTime > 0) {
            currentTime--;
            displayTime();
        } else {
            timerComplete();
        }
    }

    function timerComplete() {
        pauseTimer();
        if (isPomodoro) {
            // Pomodoro completed, switch to break
            switchMode(false);
            alert('Pomodoro completed! Time for a break.');
        } else {
            // Break completed, switch to pomodoro
            switchMode(true);
            alert('Break over! Ready for another Pomodoro?');
        }
    }

    function switchMode(toPomodoro) {
        if (isPomodoro !== toPomodoro) {
            pauseTimer();
            isPomodoro = toPomodoro;
            currentTime = isPomodoro ? settings.pomodoro : settings.shortBreak;
            updateDisplay();
            displayTime();
        }
    }

    function displayTime() {
        const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
        const seconds = (currentTime % 60).toString().padStart(2, '0');
        const displayText = `${minutes}:${seconds}`;
        
        if (isPomodoro) {
            pomodoroTimer.textContent = displayText;
        } else {
            breakTimer.textContent = displayText;
        }
    }

    function updateDisplay() {
        if (isPomodoro) {
            // Show Pomodoro
            pomodoroTimer.classList.remove('hidden');
            breakTimer.classList.add('hidden');
            main.classList.remove('bg-cyan-700');
            main.classList.add('bg-red-600');
            pomodoroTab.classList.add('active-tab');
            breakTab.classList.remove('active-tab');
        } else {
            // Show Break
            pomodoroTimer.classList.add('hidden');
            breakTimer.classList.remove('hidden');
            main.classList.remove('bg-red-600');
            main.classList.add('bg-cyan-700');
            pomodoroTab.classList.remove('active-tab');
            breakTab.classList.add('active-tab');
        }
        
        // Update button states
        if (isRunning) {
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
        } else {
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
        }
    }
});