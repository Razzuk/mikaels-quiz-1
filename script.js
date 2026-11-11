// ==========================================
// GLOBALE FUNKSJONER (Navigasjon og hashing)
// ==========================================
function goToScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
    } else {
        console.error("Fant ikke skjerm med ID:", screenId);
    }
}

async function sha256(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// ==========================================
// SPILLETS REKKEFØLGE (TILSTANDSMASKIN)
// ==========================================
const gameFlow = {
    'screen-start': 'screen-task1',

    // VEIDELET FRA OPPGAVE 1:
    'path-oslo': 'screen-task2a', // OSLO sender til Spor A
    'path-solo': 'screen-task2b', // SOLO sender til Spor B

    // SPOR A (for de som svarte OSLO)
    'screen-task2a': 'screen-task3a',
    'screen-task3a': 'screen-task4a',
    'screen-task4a': 'screen-task5',  // Samles ved oppgave 5!

    // SPOR B (for de som svarte SOLO)
    'screen-task2b': 'screen-task3b',
    'screen-task3b': 'screen-task4b',
    'screen-task4b': 'screen-task5',  // Samles ved oppgave 5!

    // FELLES LØP VIDERE FRA OPPGAVE 5
    'screen-task5': 'screen-task6',
    'screen-task6': 'screen-task7',
    'screen-task7': 'screen-task8',
    'screen-task8': 'screen-task9',
    'screen-task9': 'screen-task10'
};

function advanceFrom(currentScreenId) {
    const nextScreen = gameFlow[currentScreenId];
    if (nextScreen) {
        goToScreen(nextScreen);
    } else {
        console.error("Ingen rute definert for:", currentScreenId);
    }
}

// ==========================================
// OPPGAVE 1: VALIDERINGS-LOGIKK (OSLO / SOLO)
// ==========================================
const HASH_OSLO = '8e016391c88c77d6773deab343b91f53bb64bfbc9ca18101844cb84c3d01e561';
const HASH_SOLO = '5364f2f2fc4f54e9d47ad29cfb08ef430c8153394bf2a0dff5cbe77a0ffef861';

async function validateTask1() {
    const inputEl = document.getElementById('task1-input');
    const errorEl = document.getElementById('task1-error');
    
    const answer = inputEl.value.trim().toLowerCase();
    const hashedAnswer = await sha256(answer);

    if (hashedAnswer === HASH_OSLO) {
        errorEl.style.display = 'none';
        goToScreen(gameFlow['path-oslo']);
    } else if (hashedAnswer === HASH_SOLO) {
        errorEl.style.display = 'none';
        goToScreen(gameFlow['path-solo']);
    } else {
        errorEl.style.display = 'block';
    }
}

// ==========================================
// TESTKODER FOR PLACEHOLDERE (SPOR A & B)
// ==========================================
const HASH_A2 = '2c3a4249d77070058649dbd822dcaf7957586fce428cfb2ca88b94741eda8b07'; // "a2"
const HASH_A3 = 'f46dd28a5499d8efef0b8fb8ee1ec1c5a5e407c9381741d576ba8deb4f59ec3f'; // "a3"
const HASH_A4 = '4539e4b4889079c2a00afeae0bfc1439840ef2379a1fb81c8ba27361ad476d6b'; // "a4"

const HASH_B2 = '4814d92093ac8a0f4a2163ab87dee509ba306a58f5888be0edcb2fcd0712028b'; // "b2"
const HASH_B3 = '76a8277347f52530e1cf979175a178980b3a180d176165c985d85f7e142f1eed'; // "b3"
const HASH_B4 = '486bacc5c2d8a71a73d51bf8e522deaa264ec2628dca2955da1e9b8e00f21943'; // "b4"

async function validateTask2a() {
    const val = document.getElementById('task2a-input').value.trim().toLowerCase();
    const hash = await sha256(val);
    if (hash === HASH_A2) {
        document.getElementById('task2a-error').style.display = 'none';
        advanceFrom('screen-task2a');
    } else {
        document.getElementById('task2a-error').style.display = 'block';
    }
}

async function validateTask3a() {
    const val = document.getElementById('task3a-input').value.trim().toLowerCase();
    const hash = await sha256(val);
    if (hash === HASH_A3) {
        document.getElementById('task3a-error').style.display = 'none';
        advanceFrom('screen-task3a');
    } else {
        document.getElementById('task3a-error').style.display = 'block';
    }
}

async function validateTask4a() {
    const val = document.getElementById('task4a-input').value.trim().toLowerCase();
    const hash = await sha256(val);
    if (hash === HASH_A4) {
        document.getElementById('task4a-error').style.display = 'none';
        advanceFrom('screen-task4a');
    } else {
        document.getElementById('task4a-error').style.display = 'block';
    }
}

async function validateTask2b() {
    const val = document.getElementById('task2b-input').value.trim().toLowerCase();
    const hash = await sha256(val);
    if (hash === HASH_B2) {
        document.getElementById('task2b-error').style.display = 'none';
        advanceFrom('screen-task2b');
    } else {
        document.getElementById('task2b-error').style.display = 'block';
    }
}

async function validateTask3b() {
    const val = document.getElementById('task3b-input').value.trim().toLowerCase();
    const hash = await sha256(val);
    if (hash === HASH_B3) {
        document.getElementById('task3b-error').style.display = 'none';
        advanceFrom('screen-task3b');
    } else {
        document.getElementById('task3b-error').style.display = 'block';
    }
}

async function validateTask4b() {
    const val = document.getElementById('task4b-input').value.trim().toLowerCase();
    const hash = await sha256(val);
    if (hash === HASH_B4) {
        document.getElementById('task4b-error').style.display = 'none';
        advanceFrom('screen-task4b');
    } else {
        document.getElementById('task4b-error').style.display = 'block';
    }
}

// ==========================================
// OPPGAVE 5: TIMEGLASS (BEVEGELSESSENSOR)
// ==========================================
let timeInSeconds = 59;         // Starter på 59 sekunder
const TARGET_TIME = 60;         // Målet er 1 minutt (60 sekunder)
let isUpsideDown = false;
let timerInterval = null;
let orientationListenerActive = false;

function startTask5() {
    // Ber om tillatelse på iOS 13+
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    initHourglass();
                } else {
                    alert("Vi trenger tilgang til bevegelsessensoren for å løse gåten!");
                }
            })
            .catch(console.error);
    } else {
        initHourglass();
    }
}

function handleOrientation(event) {
    // Når telefonen snus opp ned (beta under -45 grader)
    if (event.beta < -45) {
        isUpsideDown = true;
        document.getElementById('hourglass-icon').style.transform = "rotate(180deg)";
    } else {
        isUpsideDown = false;
        document.getElementById('hourglass-icon').style.transform = "rotate(0deg)";
    }
}

function initHourglass() {
    document.getElementById('task5-intro').style.display = 'none';
    document.getElementById('task5-content').style.display = 'block';
    document.getElementById('task5-gameover').style.display = 'none';
    document.getElementById('task5-success').style.display = 'none';

    // Start lytter kun én gang
    if (!orientationListenerActive) {
        window.addEventListener('deviceorientation', handleOrientation);
        orientationListenerActive = true;
    }

    startTimerLoop();
}

function updateTimerDisplay() {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;
    let timeString = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
    document.getElementById('timer-display').innerText = timeString;
}

function startTimerLoop() {
    clearInterval(timerInterval);
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        if (isUpsideDown) {
            timeInSeconds++; // Teller opp når telefonen er snudd opp ned
        } else {
            timeInSeconds--; // Teller ned i normal posisjon
        }

        updateTimerDisplay();

        // 1. Sjekk om målet på 1 minutt (60 sekunder) er nådd
        if (timeInSeconds >= TARGET_TIME) {
            clearInterval(timerInterval);
            document.getElementById('task5-success').style.display = 'block';
            document.getElementById('task5-hint').style.display = 'none';
        } 
        // 2. Sjekk om tiden rant ut (00:00)
        else if (timeInSeconds <= 0) {
            timeInSeconds = 0;
            updateTimerDisplay();
            clearInterval(timerInterval);
            document.getElementById('task5-gameover').style.display = 'block';
        }
    }, 1000);
}

// Funksjon for "Prøv på nytt"-knappen
function resetTask5() {
    timeInSeconds = 59; // Nullstill tilbake til 30 sekunder
    document.getElementById('task5-gameover').style.display = 'none';
    startTimerLoop();
}

// ==========================================
// OPPGAVE 6: FLAPPY SANTA SPILL-LOGIKK
// ==========================================
let canvas, ctx;
let santaY, santaVelocity, santaGravity, santaJump;
let pipes = [];
let flappyScore = 0;
let isFlappyRunning = false;
let flappyAnimationId;
let pipeTimer = 0;

function initFlappyCanvas() {
    canvas = document.getElementById('flappy-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        flapSanta();
    });

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && isFlappyRunning) {
            e.preventDefault();
            flapSanta();
        }
    });
}

function flapSanta() {
    if (isFlappyRunning) {
        santaVelocity = santaJump;
    }
}

function startFlappyGame() {
    if (!canvas) initFlappyCanvas();

    document.getElementById('flappy-overlay').style.display = 'none';
    document.getElementById('task6-success').style.display = 'none';

    santaY = 180;
    santaVelocity = 0;
    santaGravity = 0.28;
    santaJump = -5.5;
    pipes = [];
    flappyScore = 0;
    pipeTimer = 0;
    isFlappyRunning = true;

    cancelAnimationFrame(flappyAnimationId);
    flappyGameLoop();
}

function flappyGameLoop() {
    if (!isFlappyRunning) return;

    santaVelocity += santaGravity;
    santaY += santaVelocity;

    pipeTimer++;
    if (pipeTimer % 95 === 0) {
        const gap = 115;
        const minHeight = 40;
        const topHeight = Math.floor(Math.random() * (canvas.height - gap - minHeight * 2)) + minHeight;
        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: topHeight + gap,
            passed: false
        });
    }

    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        p.x -= 1.8;

        if (!p.passed && p.x + 35 < 50) {
            p.passed = true;
            flappyScore++;

            if (flappyScore >= 30) {
                winFlappyGame();
                return;
            }
        }

        const santaX = 50;
        const santaRadius = 12;

        if (santaX + santaRadius > p.x && santaX - santaRadius < p.x + 40) {
            if (santaY - santaRadius < p.top || santaY + santaRadius > p.bottom) {
                gameOverFlappy();
                return;
            }
        }
    }

    pipes = pipes.filter(p => p.x > -50);

    if (santaY > canvas.height - 15 || santaY < 10) {
        gameOverFlappy();
        return;
    }

    drawFlappyScene();
    flappyAnimationId = requestAnimationFrame(flappyGameLoop);
}

function drawFlappyScene() {
    ctx.fillStyle = '#071326';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let p of pipes) {
        ctx.fillStyle = '#8b1e2a';
        ctx.fillRect(p.x, 0, 40, p.top);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.x - 2, p.top - 6, 44, 6);

        ctx.fillStyle = '#8b1e2a';
        ctx.fillRect(p.x, p.bottom, 40, canvas.height - p.bottom);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.x - 2, p.bottom, 44, 6);
    }

    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎅', 50, santaY);

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Poeng: ${flappyScore} / 30`, 15, 28);
}

function gameOverFlappy() {
    isFlappyRunning = false;
    document.getElementById('flappy-msg').innerHTML = `Du krasjet på ${flappyScore} poeng!<br>Prøv igjen!`;
    document.getElementById('flappy-overlay').style.display = 'flex';
}

function winFlappyGame() {
    isFlappyRunning = false;
    drawFlappyScene();
    document.getElementById('task6-success').style.display = 'block';
}

window.addEventListener('DOMContentLoaded', initFlappyCanvas);
