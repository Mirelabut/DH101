// ===== BARBIE 8-BIT WORLD SCRIPT =====

// Navigation functionality
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const sectionId = this.getAttribute('data-section');
        
        // Remove active class from all sections and buttons
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.nav-btn').forEach(button => {
            button.classList.remove('active');
        });
        
        // Add active class to selected section and button
        document.getElementById(sectionId).classList.add('active');
        this.classList.add('active');
    });
});

// Decorative box interaction
document.querySelectorAll('.deco-box').forEach(box => {
    box.addEventListener('click', function() {
        playSound('beep');
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = '';
        }, 10);
    });
});

// Simple beep sound
function playSound(type = 'beep') {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'beep') {
            oscillator.frequency.value = 800;
            oscillator.type = 'square';
        } else if (type === 'win') {
            oscillator.frequency.value = 1200;
            oscillator.type = 'sine';
        }
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log('Audio context not available');
    }
}

// ===== CLICK THE PIXELS GAME =====
let gameActive = false;
let score = 0;
let gameTimer = null;
const GAME_DURATION = 30; // seconds

const startGameBtn = document.getElementById('startGameBtn');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');

startGameBtn.addEventListener('click', startGame);

function startGame() {
    gameActive = true;
    score = 0;
    scoreDisplay.textContent = '0';
    gameArea.innerHTML = '';
    startGameBtn.disabled = true;
    startGameBtn.textContent = 'GAME RUNNING...';
    
    // Generate initial pixels
    generatePixels();
    
    // Game timer
    let timeLeft = GAME_DURATION;
    gameTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(gameTimer);
    startGameBtn.disabled = false;
    startGameBtn.textContent = `GAME OVER! SCORE: ${score}`;
    
    setTimeout(() => {
        startGameBtn.textContent = 'START GAME';
    }, 2000);
}

function generatePixels() {
    if (!gameActive) return;
    
    const pixel = document.createElement('div');
    pixel.className = 'game-pixel';
    
    // Random position
    const x = Math.random() * (gameArea.clientWidth - 30);
    const y = Math.random() * (gameArea.clientHeight - 30);
    
    pixel.style.left = x + 'px';
    pixel.style.top = y + 'px';
    
    pixel.addEventListener('click', () => {
        if (gameActive) {
            score++;
            scoreDisplay.textContent = score;
            playSound('win');
            pixel.remove();
            generatePixels();
        }
    });
    
    gameArea.appendChild(pixel);
    
    // Generate more pixels as difficulty increases
    if (Math.random() > 0.7 && gameActive) {
        generatePixels();
    }
}

// ===== BARBIE COLOR QUIZ =====
const quizData = [
    {
        question: "What's Barbie's favorite color?",
        options: ["PINK", "BLUE", "PURPLE", "YELLOW"],
        correct: 0
    },
    {
        question: "What is Barbie's dream vehicle?",
        options: ["TRUCK", "PINK CAR", "SKATEBOARD", "MOTORCYCLE"],
        correct: 1
    },
    {
        question: "What year was Barbie created?",
        options: ["1959", "1960", "1958", "1961"],
        correct: 0
    },
    {
        question: "What's Barbie's best friend's name?",
        options: ["ISABELLA", "KEN", "SKIPPER", "CHELSEA"],
        correct: 2
    }
];

let currentQuizIndex = 0;
const quizArea = document.getElementById('quizArea');

function loadQuiz() {
    const quiz = quizData[currentQuizIndex];
    quizArea.innerHTML = `<p style="color: #c41e3a; margin-bottom: 20px; font-size: 1rem;">${quiz.question}</p>`;
    
    quiz.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => checkAnswer(index, btn));
        quizArea.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btn) {
    const quiz = quizData[currentQuizIndex];
    const allButtons = document.querySelectorAll('.quiz-option');
    
    if (selectedIndex === quiz.correct) {
        btn.classList.add('correct');
        playSound('win');
        
        allButtons.forEach(b => b.disabled = true);
        
        setTimeout(() => {
            currentQuizIndex++;
            if (currentQuizIndex < quizData.length) {
                loadQuiz();
            } else {
                quizArea.innerHTML = '<p style="color: #c41e3a; font-size: 1rem; text-align: center;">✨ YOU DID IT! ✨<br><br>You know all about Barbie!</p>';
                currentQuizIndex = 0;
                setTimeout(() => loadQuiz(), 3000);
            }
        }, 1500);
    } else {
        btn.classList.add('incorrect');
        document.querySelectorAll('.quiz-option').forEach((b, i) => {
            b.disabled = true;
            if (i === quiz.correct) {
                b.classList.add('correct');
            }
        });
        
        setTimeout(() => {
            currentQuizIndex++;
            if (currentQuizIndex < quizData.length) {
                loadQuiz();
            } else {
                quizArea.innerHTML = '<p style="color: #c41e3a; font-size: 1rem; text-align: center;">✨ YOU DID IT! ✨<br><br>You know all about Barbie!</p>';
                currentQuizIndex = 0;
                setTimeout(() => loadQuiz(), 3000);
            }
        }, 1500);
    }
}

// Initialize quiz
loadQuiz();

// Add easter egg
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'b') {
        document.body.style.filter = 'hue-rotate(' + Math.random() * 360 + 'deg)';
    }
});

// Floating animation for pixels
const style = document.createElement('style');
style.textContent = `
    @keyframes pixelFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(5deg); }
    }
    
    .game-pixel {
        animation: pixelFloat 2s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

console.log('🎮 BARBIE 8-BIT WORLD LOADED! 🎮');
console.log('Press B to activate BARBIE MODE!');
