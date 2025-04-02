document.addEventListener('DOMContentLoaded', function() {
    // Elementi DOM
    const main = document.getElementById('main');
    const pomodoroTimer = document.getElementById('pomodoro-timer');
    const breakTimer = document.getElementById('break-timer');
    const pomodoroTab = document.getElementById('pomodoro-tab');
    const breakTab = document.getElementById('break-tab');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const soundBtn = document.getElementById('sound-btn');

    // Impostazioni timer (in secondi)
    const settings = {
        pomodoro: 25 * 60,    // 25 minuti
        shortBreak: 1 * 60      // 5 minuti
    };

    // Elemento audio e stato
    const alarmSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    let audioEnabled = false;
    let audioContextUnlocked = false;

    // Variabili di stato
    let currentTime = settings.pomodoro;
    let timerInterval;
    let isRunning = false;
    let isPomodoro = true;

    // Inizializzazione
    updateDisplay();
    displayTime();

    // Event listeners
    pomodoroTab.addEventListener('click', () => switchMode(true));
    breakTab.addEventListener('click', () => switchMode(false));
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    soundBtn.addEventListener('click', enableAudio);

    // Funzioni del timer
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
        // Rimuovi l'animazione se presente
        pomodoroTimer.classList.remove('timer-complete');
        breakTimer.classList.remove('timer-complete');
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
        
        // Aggiungi animazione
        if (isPomodoro) {
            pomodoroTimer.classList.add('timer-complete');
        } else {
            breakTimer.classList.add('timer-complete');
        }
        
        // Riproduci suono se abilitato
        if (audioEnabled) {
            playAlarm();
        }
        
        // Notifica all'utente
        const message = isPomodoro ? 
            "Pomodoro completato! Tempo di pausa." : 
            "Pausa terminata! Pronto per un altro Pomodoro?";
        
        // Usa le notifiche del browser se supportate
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(message);
        } else {
            alert(message);
        }
        
        // Cambia modalità automaticamente
        switchMode(!isPomodoro);
    }

    function playAlarm() {
        // Assicurati che l'audio sia riavvolto
        alarmSound.currentTime = 0;
        
        // Prova a riprodurre
        alarmSound.play().catch(error => {
            console.error("Errore riproduzione audio:", error);
            // Se fallisce, prova a sbloccare di nuovo l'audio
            enableAudio();
        });
    }

    function enableAudio() {
        // Sblocca l'audio context sui primi click dell'utente
        if (!audioContextUnlocked) {
            const unlockAudio = () => {
                const context = new (window.AudioContext || window.webkitAudioContext)();
                const source = context.createBufferSource();
                source.connect(context.destination);
                audioContextUnlocked = true;
                document.removeEventListener('click', unlockAudio);
            };
            document.addEventListener('click', unlockAudio);
        }
        
        // Sblocca l'audio
        alarmSound.volume = 0.5;
        alarmSound.play().then(() => {
            audioEnabled = true;
            alarmSound.pause();
            alarmSound.currentTime = 0;
            soundBtn.textContent = "Test Audio";
            soundBtn.classList.remove('bg-gray-300');
            soundBtn.classList.add('bg-white');
        }).catch(error => {
            console.error("Errore abilitazione audio:", error);
            soundBtn.textContent = "Audio Disabilitato";
            soundBtn.classList.remove('bg-white');
            soundBtn.classList.add('bg-gray-300');
        });
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
            // Modalità Pomodoro
            pomodoroTimer.classList.remove('hidden');
            breakTimer.classList.add('hidden');
            main.classList.remove('bg-cyan-700');
            main.classList.add('bg-red-600');
            pomodoroTab.classList.add('active-tab');
            breakTab.classList.remove('active-tab');
        } else {
            // Modalità Pausa
            pomodoroTimer.classList.add('hidden');
            breakTimer.classList.remove('hidden');
            main.classList.remove('bg-red-600');
            main.classList.add('bg-cyan-700');
            pomodoroTab.classList.remove('active-tab');
            breakTab.classList.add('active-tab');
        }
        
        // Aggiorna stato pulsanti
        if (isRunning) {
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
        } else {
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
        }
    }

    // Richiedi permesso per le notifiche
    if ("Notification" in window) {
        Notification.requestPermission();
    }
});