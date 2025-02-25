document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const sessionTypeDisplay = document.getElementById('session-type');
    const sessionCountDisplay = document.getElementById('session-count');
    const workDurationSelect = document.getElementById('work-duration');
    const breakDurationSelect = document.getElementById('break-duration');
    const totalWorkTimeDisplay = document.getElementById('total-work-time');
    const totalBreakTimeDisplay = document.getElementById('total-break-time');
    const totalSessionsDisplay = document.getElementById('total-sessions');
    const endSound = document.getElementById('end-sound');

    let timerInterval;
    let isPaused = true;
    let sessionType = 'Work'; // 'Work' or 'Break'
    let sessionCount = 1;
    let minutes = Math.floor(parseFloat(workDurationSelect.value, 10));
    let seconds = Math.round((parseFloat(workDurationSelect.value) % 1) * 60);

    // Load statistics from local storage
    let totalWorkTime = parseInt(localStorage.getItem('totalWorkTime')) || 0;
    let totalBreakTime = parseInt(localStorage.getItem('totalBreakTime')) || 0;
    let totalSessions = parseInt(localStorage.getItem('totalSessions')) || 0;
    updateStatisticsDisplay();

    workDurationSelect.addEventListener('change', () => {
        if (sessionType === 'Work') {
            minutes = Math.floor(parseFloat(workDurationSelect.value, 10));
            seconds = Math.round((parseFloat(workDurationSelect.value) % 1) * 60);
            updateDisplay();
        }
    });

    breakDurationSelect.addEventListener('change', () => {
        if (sessionType === 'Break') {
            minutes = Math.floor(parseFloat(breakDurationSelect.value, 10));
            seconds = Math.round((parseFloat(breakDurationSelect.value) % 1) * 60);
            updateDisplay();
        }
    });

    startButton.addEventListener('click', () => {
        if (isPaused) {
            isPaused = false;
            startTimer();
        }
    });

    pauseButton.addEventListener('click', () => {
        isPaused = true;
        clearInterval(timerInterval);
    });

    resetButton.addEventListener('click', resetTimer);

    function startTimer() {
        timerInterval = setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(timerInterval);
                    endSound.play(); // Ensure the sound plays when the timer ends
                    updateStatistics();
                    switchSession();
                } else {
                    minutes--;
                    seconds = 59;
                }
            } else {
                seconds--;
            }
            updateDisplay();
        }, 1000);
    }

    function updateDisplay() {
        minutesDisplay.textContent = minutes < 10 ? `0${minutes}` : minutes;
        secondsDisplay.textContent = seconds < 10 ? `0${seconds}` : seconds;
    }

    function switchSession() {
        if (sessionType === 'Work') {
            sessionType = 'Break';
            minutes = Math.floor(parseFloat(breakDurationSelect.value, 10));
            seconds = Math.round((parseFloat(breakDurationSelect.value) % 1) * 60);
            sessionCount++;
        } else {
            sessionType = 'Work';
            minutes = Math.floor(parseFloat(workDurationSelect.value, 10));
            seconds = Math.round((parseFloat(workDurationSelect.value) % 1) * 60);
        }
        sessionTypeDisplay.textContent = sessionType;
        sessionCountDisplay.textContent = `Session: ${sessionCount}`;
        startTimer();
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isPaused = true;
        sessionType = 'Work';
        sessionCount = 1;
        minutes = Math.floor(parseFloat(workDurationSelect.value, 10));
        seconds = Math.round((parseFloat(workDurationSelect.value) % 1) * 60);
        updateDisplay();
        sessionTypeDisplay.textContent = sessionType;
        sessionCountDisplay.textContent = `Session: ${sessionCount}`;
    }

    function updateStatistics() {
        if (sessionType === 'Work') {
            totalWorkTime += parseFloat(workDurationSelect.value);
        } else {
            totalBreakTime += parseFloat(breakDurationSelect.value);
        }
        totalSessions++;

        localStorage.setItem('totalWorkTime', totalWorkTime);
        localStorage.setItem('totalBreakTime', totalBreakTime);
        localStorage.setItem('totalSessions', totalSessions);

        updateStatisticsDisplay();
    }

    function updateStatisticsDisplay() {
        totalWorkTimeDisplay.textContent = totalWorkTime.toFixed(2);
        totalBreakTimeDisplay.textContent = totalBreakTime.toFixed(2);
        totalSessionsDisplay.textContent = totalSessions;
    }

    updateDisplay();
    sessionTypeDisplay.textContent = sessionType;
    sessionCountDisplay.textContent = `Session: ${sessionCount}`;
});
