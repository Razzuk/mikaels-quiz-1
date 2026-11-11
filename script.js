// ==========================================
// GLOBALE FUNKSJONER (Navigasjon og hashing)
// ==========================================
function goToScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}
async function sha256(message) {
    // Konverterer strengen til en UTF-8 bytestrøm
    const msgUint8 = new TextEncoder().encode(message); 
    // Genererer selve hashen asynkront
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); 
    // Gjør om ArrayBuffer til et vanlig Array, og oversetter bytene til en heksadesimal streng
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
    'screen-task5': 'screen-task6'
    'screen-task6': 'screen-task7'
    'screen-task7': 'screen-task8'
    'screen-task8': 'screen-task9'
    'screen-task9': 'screen-task10'
};

function advanceFrom(currentScreenId) {
    // 1. Slå opp i kartet for å finne neste skjerm
    const nextScreen = gameFlow[currentScreenId];
    
    // 2. Gå til den skjermen
    goToScreen(nextScreen);
}


// ==========================================
// OPPGAVE 1
// ==========================================
// Forhåndsberegnede SHA-256 hashes
const HASH_OSLO = '8e016391c88c77d6773deab343b91f53bb64bfbc9ca18101844cb84c3d01e561';
const HASH_SOLO = '5364f2f2fc4f54e9d47ad29cfb08ef430c8153394bf2a0dff5cbe77a0ffef861';

async function validateTask1() {
    const inputEl = document.getElementById('task1-input');
    const errorEl = document.getElementById('task1-error');
    
    const answer = inputEl.value.trim().toLowerCase();
    const hashedAnswer = await sha256(answer);

    if (hashedAnswer === HASH_OSLO) {
        errorEl.style.display = 'none';
        // Slår opp i kartet og sender til screen-task2a:
        goToScreen(gameFlow['path-oslo']);
        
    } else if (hashedAnswer === HASH_SOLO) {
        errorEl.style.display = 'none';
        // Slår opp i kartet og sender til screen-task2b:
        goToScreen(gameFlow['path-solo']);
        
    } else {
        errorEl.style.display = 'block';
    }
}


// ==========================================
//  (5TIMEGLASS)
// ==========================================
let timeInSeconds = 60;
        const TARGET_TIME = 80;
        let isUpsideDown = false;
        let timerInterval;

        function startTask3() {
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
                // Enheter som ikke krever tillatelse
                initHourglass();
            }
        }

        function initHourglass() {
            // Skjul introtekst og vis selve timeglasset
            document.getElementById('task3-intro').style.display = 'none';
            document.getElementById('task3-content').style.display = 'block';

            // Lytt etter endringer i telefonens rotasjon
            window.addEventListener('deviceorientation', (event) => {
                // Hvis beta er under -45 grader, regnes telefonen som opp ned
                if (event.beta < -45) {
                    isUpsideDown = true;
                    document.getElementById('hourglass-icon').style.transform = "rotate(180deg)"; // Visuell rotasjon
                } else {
                    isUpsideDown = false;
                    document.getElementById('hourglass-icon').style.transform = "rotate(0deg)";
                }
            });

            // Start en "game loop" som kjører hver 1000. millisekund (hvert sekund)
            timerInterval = setInterval(() => {
                // Logikken for timeglasset
                if (isUpsideDown) {
                    timeInSeconds++; // Reverserer tiden
                } else {
                    timeInSeconds--; // Tiden renner vanlig ut
                }

                // Formaterer tiden tilbake til mm:ss
                let minutes = Math.floor(timeInSeconds / 60);
                let seconds = timeInSeconds % 60;
                let timeString = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
                
                document.getElementById('timer-display').innerText = timeString;

                // Sjekk om målet er nådd
                if (timeInSeconds >= TARGET_TIME) {
                    clearInterval(timerInterval); // Stopp klokken
                    document.getElementById('task3-success').style.display = 'block';
                } else if (timeInSeconds <= 0) {
                    // Sørg for at tiden ikke går i minus
                    timeInSeconds = 0; 
                }
            }, 1000); 
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

    // Lytt etter trykk/klikk for å flakse
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

    // Tilbakestill verdier
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

    // 1. Fysikk for nissen
    santaVelocity += santaGravity;
    santaY += santaVelocity;

    // 2. Generer hindringer (piper)
    pipeTimer++;
    if (pipeTimer % 95 === 0) {
        const gap = 115; // Åpningen nissen skal fly gjennom
        const minHeight = 40;
        const topHeight = Math.floor(Math.random() * (canvas.height - gap - minHeight * 2)) + minHeight;
        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: topHeight + gap,
            passed: false
        });
    }

    // 3. Flytt piper og sjekk kollisjoner
    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        p.x -= 1.8; // Fart mot venstre

        // Poengtelling når nissen passerer
        if (!p.passed && p.x + 35 < 50) {
            p.passed = true;
            flappyScore++;

            // Sjekk om målet på 30 poeng er nådd!
            if (flappyScore >= 30) {
                winFlappyGame();
                return;
            }
        }

        // Kollisjonssjekk (nisse-størrelse ca. 24x24 px ved x = 50)
        const santaX = 50;
        const santaRadius = 12;

        if (santaX + santaRadius > p.x && santaX - santaRadius < p.x + 40) {
            if (santaY - santaRadius < p.top || santaY + santaRadius > p.bottom) {
                gameOverFlappy();
                return;
            }
        }
    }

    // Fjern rør som har sklidd ut av skjermen
    pipes = pipes.filter(p => p.x > -50);

    // Kollisjon med tak eller gulv
    if (santaY > canvas.height - 15 || santaY < 10) {
        gameOverFlappy();
        return;
    }

    // 4. Tegn alt på lerretet
    drawFlappyScene();

    flappyAnimationId = requestAnimationFrame(flappyGameLoop);
}

function drawFlappyScene() {
    // Bakgrunn (nattehimmel)
    ctx.fillStyle = '#071326';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tegn piper (julerøde piper med snø på toppen)
    for (let p of pipes) {
        // Øvre pipe
        ctx.fillStyle = '#8b1e2a';
        ctx.fillRect(p.x, 0, 40, p.top);
        ctx.fillStyle = '#ffffff'; // Snøkant
        ctx.fillRect(p.x - 2, p.top - 6, 44, 6);

        // Nedre pipe
        ctx.fillStyle = '#8b1e2a';
        ctx.fillRect(p.x, p.bottom, 40, canvas.height - p.bottom);
        ctx.fillStyle = '#ffffff'; // Snøkant
        ctx.fillRect(p.x - 2, p.bottom, 44, 6);
    }

    // Tegn Nissen (emoji)
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎅', 50, santaY);

    // Tegn poengoversikt øverst
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
    // Tegn siste bilde med 30 poeng
    drawFlappyScene();
    document.getElementById('task6-success').style.display = 'block';
}

// Klargjør lyttere når siden lastes
window.addEventListener('DOMContentLoaded', initFlappyCanvas);
