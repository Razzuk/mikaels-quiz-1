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

        // Initialiser flaggene hvis man ankommer oppgave 4A eller 4B
        if (screenId === 'screen-task4a') {
            initFlagTaskA();
        } else if (screenId === 'screen-task4b') {
            initFlagTaskB();
        }
    } else {
        console.error("Fant ikke skjerm med ID:", screenId);
    }
}

// Koblet direkte til "Start spillet"-knappen
function startGame() {
    goToScreen('screen-task1');
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
    'path-oslo': 'screen-task2a',
    'path-solo': 'screen-task2b',

    // SPOR A (OSLO)
    'screen-task2a': 'screen-task3a',
    'screen-task3a': 'screen-task4a',
    'screen-task4a': 'screen-task5',

    // SPOR B (SOLO)
    'screen-task2b': 'screen-task3b',
    'screen-task3b': 'screen-task4b',
    'screen-task4b': 'screen-task5',

    // FELLES LØP FRA OPPGAVE 5
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
    if (!inputEl) return;

    const answer = inputEl.value.trim().toLowerCase();
    const hashedAnswer = await sha256(answer);

    if (hashedAnswer === HASH_OSLO) {
        if (errorEl) errorEl.style.display = 'none';
        goToScreen(gameFlow['path-oslo']);
    } else if (hashedAnswer === HASH_SOLO) {
        if (errorEl) errorEl.style.display = 'none';
        goToScreen(gameFlow['path-solo']);
    } else {
        if (errorEl) errorEl.style.display = 'block';
    }
}


// ==========================================
// TESTKODER FOR PLACEHOLDERE (SPOR A & B)
// ==========================================

// ==========================================
// OPPGAVE 3A OG 3B: VALIDERINGS-LOGIKK
// ==========================================

// SHA-256 for koden "5937"
const HASH_A3 = '0718b5188109465df3fba5039b8eef456a9bda69e1cba53dba299adddf6ef2f6';

async function validateTask3a() {
    const inputEl = document.getElementById('task3a-input');
    const errorEl = document.getElementById('task3a-error');
    if (!inputEl) return;

    // Fjerner mellomrom hvis deltakerne taster inn f.eks. "59 37"
    const val = inputEl.value.trim().replace(/\s+/g, '');
    const hash = await sha256(val);

    if (hash === HASH_A3) {
        if (errorEl) errorEl.style.display = 'none';
        const successEl = document.getElementById('task3a-success');
        if (successEl) {
            successEl.style.display = 'block';
        } else {
            advanceFrom('screen-task3a');
        }
    } else {
        if (errorEl) errorEl.style.display = 'block';
    }
}

// SHA-256 for koden "6721"
const HASH_B3 = 'ce0f260d26064118bd9e5d32796ec10ceb95e36e9f12a7f4b0a5cc262304a3d5';

async function validateTask3b() {
    const inputEl = document.getElementById('task3b-input');
    const errorEl = document.getElementById('task3b-error');
    if (!inputEl) return;

    // Fjerner mellomrom hvis deltakerne taster inn f.eks. "67 21"
    const val = inputEl.value.trim().replace(/\s+/g, '');
    const hash = await sha256(val);

    if (hash === HASH_B3) {
        if (errorEl) errorEl.style.display = 'none';
        const successEl = document.getElementById('task3b-success');
        if (successEl) {
            successEl.style.display = 'block';
        } else {
            advanceFrom('screen-task3b');
        }
    } else {
        if (errorEl) errorEl.style.display = 'block';
    }
}

// Hashen for tallet 6770130840 (1969 * 9551 * 24 * 15)
const HASH_A2 = 'a0f55f635a6f4c4fa6fd9a05f0b2be06f817a0e0bb83fc3cdd795f546f94657d';

async function validateTask2a() {
    const inputEl = document.getElementById('task2a-input');
    const errorEl = document.getElementById('task2a-error');
    if (!inputEl) return;

    // Fjerner eventuelle mellomrom (f.eks. om noen skriver 6 770 130 840)
    const val = inputEl.value.replace(/\s+/g, '');
    const hash = await sha256(val);

    if (hash === HASH_A2) {
        if (errorEl) errorEl.style.display = 'none';
        const successEl = document.getElementById('task2a-success');
        if (successEl) {
            successEl.style.display = 'block';
        } else {
            advanceFrom('screen-task2a');
        }
    } else {
        if (errorEl) errorEl.style.display = 'block';
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

// Hashen for tallet 230504352 (1976 * 9721 * 4 * 3)
const HASH_B2 = 'c0b819813b20b7f50aa1b29c723197d128b0640d07c38557896cc250311aff79';

async function validateTask2b() {
    const inputEl = document.getElementById('task2b-input');
    const errorEl = document.getElementById('task2b-error');
    if (!inputEl) return;

    // Fjerner eventuelle mellomrom (f.eks. om noen skriver 230 504 352)
    const val = inputEl.value.replace(/\s+/g, '');
    const hash = await sha256(val);

    if (hash === HASH_B2) {
        if (errorEl) errorEl.style.display = 'none';
        const successEl = document.getElementById('task2b-success');
        if (successEl) {
            successEl.style.display = 'block';
        } else {
            advanceFrom('screen-task2b');
        }
    } else {
        if (errorEl) errorEl.style.display = 'block';
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


// ==========================================
// OPPGAVE 4A & 4B: FLAGG-SORTERING (EMOJIS)
// ==========================================

// SPOR A: Obskure flagg (Bhutan -> Nauru)
const flagsDataA = [
    { id: 'BT', name: 'Bhutan',     flag: '🇧🇹' },
    { id: 'DJ', name: 'Djibouti',   flag: '🇩🇯' },
    { id: 'SZ', name: 'Eswatini',   flag: '🇸🇿' },
    { id: 'GD', name: 'Grenada',    flag: '🇬🇩' },
    { id: 'KI', name: 'Kiribati',   flag: '🇰🇮' },
    { id: 'LS', name: 'Lesotho',    flag: '🇱🇸' },
    { id: 'MR', name: 'Mauritania', flag: '🇲🇷' },
    { id: 'NR', name: 'Nauru',      flag: '🇳🇷' }
];
const CORRECT_ORDER_4A = ['BT', 'DJ', 'SZ', 'GD', 'KI', 'LS', 'MR', 'NR'];
let currentFlagsA = [];

// SPOR B: Obskure flagg (Belize -> Zimbabwe)
const flagsDataB = [
    { id: 'BZ', name: 'Belize',   flag: '🇧🇿' },
    { id: 'KM', name: 'Komorene', flag: '🇰🇲' },
    { id: 'MW', name: 'Malawi',   flag: '🇲🇼' },
    { id: 'PW', name: 'Palau',    flag: '🇵🇼' },
    { id: 'SR', name: 'Surinam',  flag: '🇸🇷' },
    { id: 'TV', name: 'Tuvalu',   flag: '🇹🇻' },
    { id: 'VU', name: 'Vanuatu',  flag: '🇻🇺' },
    { id: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' }
];
const CORRECT_ORDER_4B = ['BZ', 'KM', 'MW', 'PW', 'SR', 'TV', 'VU', 'ZW'];
let currentFlagsB = [];

function renderFlagListUI(containerId, flagList, track) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    flagList.forEach((item, index) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'space-between';
        row.style.background = 'rgba(255, 255, 255, 0.1)';
        row.style.border = '1px solid #ffd700';
        row.style.borderRadius = '6px';
        row.style.padding = '8px 12px';

        const label = document.createElement('div');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '12px';
        label.innerHTML = `
            <span style="font-size: 16px; font-weight: bold; color: #ffd700; width: 22px;">${index + 1}.</span> 
            <span style="font-size: 30px; line-height: 1;">${item.flag}</span>
        `;

        const btnGroup = document.createElement('div');
        btnGroup.style.display = 'flex';
        btnGroup.style.gap = '6px';

        const upBtn = document.createElement('button');
        upBtn.innerText = '⬆️';
        upBtn.style.padding = '6px 10px';
        upBtn.style.fontSize = '14px';
        upBtn.disabled = (index === 0);
        upBtn.onclick = () => moveFlagItem(track, index, -1);

        const downBtn = document.createElement('button');
        downBtn.innerText = '⬇️';
        downBtn.style.padding = '6px 10px';
        downBtn.style.fontSize = '14px';
        downBtn.disabled = (index === flagList.length - 1);
        downBtn.onclick = () => moveFlagItem(track, index, 1);

        btnGroup.appendChild(upBtn);
        btnGroup.appendChild(downBtn);

        row.appendChild(label);
        row.appendChild(btnGroup);
        container.appendChild(row);
    });
}

function moveFlagItem(track, index, direction) {
    const list = (track === '4a') ? currentFlagsA : currentFlagsB;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    if (track === '4a') {
        renderFlagListUI('flag-list-4a', currentFlagsA, '4a');
    } else {
        renderFlagListUI('flag-list-4b', currentFlagsB, '4b');
    }
}

function validateTask4a() {
    const userOrder = currentFlagsA.map(item => item.id);
    const isCorrect = userOrder.every((id, idx) => id === CORRECT_ORDER_4A[idx]);

    const errorEl = document.getElementById('task4a-error');
    const successEl = document.getElementById('task4a-success');

    if (isCorrect) {
        if (errorEl) errorEl.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
    } else {
        if (errorEl) errorEl.style.display = 'block';
    }
}

function validateTask4b() {
    const userOrder = currentFlagsB.map(item => item.id);
    const isCorrect = userOrder.every((id, idx) => id === CORRECT_ORDER_4B[idx]);

    const errorEl = document.getElementById('task4b-error');
    const successEl = document.getElementById('task4b-success');

    if (isCorrect) {
        if (errorEl) errorEl.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
    } else {
        if (errorEl) errorEl.style.display = 'block';
    }
}

function initFlagTaskA() {
    if (currentFlagsA.length === 0) {
        currentFlagsA = [...flagsDataA].sort(() => Math.random() - 0.5);
    }
    renderFlagListUI('flag-list-4a', currentFlagsA, '4a');
}

function initFlagTaskB() {
    if (currentFlagsB.length === 0) {
        currentFlagsB = [...flagsDataB].sort(() => Math.random() - 0.5);
    }
    renderFlagListUI('flag-list-4b', currentFlagsB, '4b');
}


// ==========================================
// OPPGAVE 5: TIMEGLASS (BEVEGELSESSENSOR)
// ==========================================
let timeInSeconds = 45;
const TARGET_TIME = 60;
let isUpsideDown = false;
let timerInterval = null;
let orientationListenerActive = false;

function startTask5() {
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
    if (event.beta < -45) {
        isUpsideDown = true;
        const icon = document.getElementById('hourglass-icon');
        if (icon) icon.style.transform = "rotate(180deg)";
    } else {
        isUpsideDown = false;
        const icon = document.getElementById('hourglass-icon');
        if (icon) icon.style.transform = "rotate(0deg)";
    }
}

function initHourglass() {
    document.getElementById('task5-intro').style.display = 'none';
    document.getElementById('task5-content').style.display = 'block';
    document.getElementById('task5-gameover').style.display = 'none';
    document.getElementById('task5-success').style.display = 'none';

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
    const disp = document.getElementById('timer-display');
    if (disp) disp.innerText = timeString;
}

function startTimerLoop() {
    clearInterval(timerInterval);
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        if (isUpsideDown) {
            timeInSeconds++;
        } else {
            timeInSeconds--;
        }

        updateTimerDisplay();

        if (timeInSeconds >= TARGET_TIME) {
            clearInterval(timerInterval);
            document.getElementById('task5-success').style.display = 'block';
            document.getElementById('task5-hint').style.display = 'none';
        } else if (timeInSeconds <= 0) {
            timeInSeconds = 0;
            updateTimerDisplay();
            clearInterval(timerInterval);
            document.getElementById('task5-gameover').style.display = 'block';
        }
    }, 1000);
}

function resetTask5() {
    timeInSeconds = 45;
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

            if (flappyScore >= 15) {
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
    ctx.fillText(`Poeng: ${flappyScore} / 20`, 15, 28);
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


// ==========================================
// OPPGAVE 7: PUSLESPILLET (KODE: 14916)
// ==========================================
const HASH_TASK7 = '0cba2fa7ffebce9bb31e312ee655e6c071e3e83dadeca2d5a75a67a0a9aa9421';

async function validateTask7() {
    const inputEl = document.getElementById('task7-input');
    const errorEl = document.getElementById('task7-error');
    if (!inputEl) return;

    const val = inputEl.value.replace(/\s+/g, '');
    const hash = await sha256(val);

    if (hash === HASH_TASK7) {
        if (errorEl) errorEl.style.display = 'none';
        advanceFrom('screen-task7');
    } else {
        if (errorEl) errorEl.style.display = 'block';
    }
}


// ==========================================
// OPPGAVE 8: WALDO (ZOOM OG KLIKK-SPORING)
// ==========================================

// Sett inn dine 5 objekter her. Foreløpige test-koordinater:
const waldoTargets = [
    { name: "Willy",                x: 85.4, y: 73.9, radius: 3.5, found: false },
    { name: "Trollmann Hvitskjegg", x: 6.8,  y: 75.8, radius: 3.5, found: false },
    { name: "Et par vannski",        x: 83.6, y: 40.4, radius: 3.5, found: false },
    { name: "Et anker",             x: 96.2, y: 66.5, radius: 3.5, found: false },
    { name: "Et monster",           x: 93.2, y: 11.7, radius: 3.5, found: false }
];

let waldoFoundCount = 0;
let currentZoomPercent = 100;

function zoomWaldo(factor) {
    const wrapper = document.getElementById('waldo-wrapper');
    if (!wrapper) return;

    currentZoomPercent = Math.min(Math.max(currentZoomPercent * factor, 100), 400); // 100% til 400% zoom
    wrapper.style.width = `${currentZoomPercent}%`;
}

function resetWaldoZoom() {
    const wrapper = document.getElementById('waldo-wrapper');
    if (!wrapper) return;
    currentZoomPercent = 100;
    wrapper.style.width = '100%';
}

function initWaldoTask() {
    const img = document.getElementById('waldo-img');
    const wrapper = document.getElementById('waldo-wrapper');
    if (!img || !wrapper) return;

    img.addEventListener('click', (event) => {
        const rect = img.getBoundingClientRect();
        // Regner ut klikk i prosent (0 til 100) av selve bildet
        const clickX = ((event.clientX - rect.left) / rect.width) * 100;
        const clickY = ((event.clientY - rect.top) / rect.height) * 100;

        // Viser nøyaktige koordinater i konsollen (F12) for oppsett
        console.log(`Waldo klikk -> x: ${clickX.toFixed(1)}%, y: ${clickY.toFixed(1)}%`);

        waldoTargets.forEach((target, index) => {
            if (!target.found) {
                const distance = Math.hypot(clickX - target.x, clickY - target.y);
                if (distance <= target.radius) {
                    target.found = true;
                    waldoFoundCount++;
                    markTargetFound(target, index, wrapper);
                }
            }
        });
    });
}

function markTargetFound(target, index, wrapper) {
    // Plasserer en rød/gull sirkel på funnstedet
    const marker = document.createElement('div');
    marker.style.position = 'absolute';
    marker.style.left = `${target.x}%`;
    marker.style.top = `${target.y}%`;
    marker.style.width = '32px';
    marker.style.height = '32px';
    marker.style.border = '3px solid #ffd700';
    marker.style.backgroundColor = 'rgba(196, 30, 58, 0.45)';
    marker.style.borderRadius = '50%';
    marker.style.transform = 'translate(-50%, -50%)';
    marker.style.pointerEvents = 'none';
    marker.style.boxShadow = '0 0 10px #ffd700';
    wrapper.appendChild(marker);

    // Oppdater sjekklisten
    const itemEl = document.getElementById(`item-${index}`);
    if (itemEl) {
        itemEl.innerHTML = `🟢 ${index + 1}. <del>${target.name}</del>`;
        itemEl.style.color = '#4ade80';
    }

    const statusEl = document.getElementById('waldo-status');
    if (statusEl) {
        statusEl.innerText = `Funnet: ${waldoFoundCount} / 5`;
    }

    if (waldoFoundCount >= 5) {
        const successEl = document.getElementById('task8-success');
        if (successEl) successEl.style.display = 'block';
    }
}

// ==========================================
// OPPGAVE 9: JULEMARKEDET (FASIT: -3.5)
// ==========================================
// SHA-256 for "-3.5" (3 + 4.5 - 11)
const HASH_TASK9 = '3eb155cf9da37ed018b55502844dcf8d285189ca01f0af27fea31df46d388760';

async function validateTask9() {
    const inputEl = document.getElementById('task9-input');
    const errorEl = document.getElementById('task9-error');
    if (!inputEl) return;

    // Fjerner mellomrom og gjør komma om til punktum (støtter både -3,5 og -3.5)
    let val = inputEl.value.trim().replace(/\s+/g, '').replace(',', '.');
    const hash = await sha256(val);

    if (hash === HASH_TASK9) {
        if (errorEl) errorEl.style.display = 'none';
        const successEl = document.getElementById('task9-success');
        if (successEl) {
            successEl.style.display = 'block';
        } else {
            advanceFrom('screen-task9');
        }
    } else {
        if (errorEl) errorEl.style.display = 'block';
    }
}

// ==========================================
// FINALE: LYDER OG KONFETTI
// ==========================================

function startVictoryScreen() {
    playVictoryFanfare();
    startConfetti();
}

// 1. Innebygd seiersfanfare (Web Audio API) - krever ingen eksterne filer!
function playVictoryFanfare() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        // Melodi for fanfare: [frekvens (Hz), varighet (sekunder)]
        const notes = [
            { f: 523.25, d: 0.15 }, // C5
            { f: 523.25, d: 0.15 }, // C5
            { f: 523.25, d: 0.15 }, // C5
            { f: 659.25, d: 0.45 }, // E5
            { f: 587.33, d: 0.20 }, // D5
            { f: 659.25, d: 0.20 }, // E5
            { f: 783.99, d: 0.80 }  // G5 (Høytidelig seierstone)
        ];

        let startTime = ctx.currentTime + 0.05;

        notes.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle'; // Myk og fyldig messingtone
            osc.frequency.setValueAtTime(note.f, startTime);

            // Volum-kurve
            gain.gain.setValueAtTime(0.01, startTime);
            gain.gain.linearRampToValueAtTime(0.3, startTime + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.d);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + note.d);

            startTime += note.d + 0.04;
        });
    } catch (e) {
        console.log("Audio kunne ikke spilles automatisk:", e);
    }
}

// 2. Fargerik konfetti-animasjon på canvas
let confettiRunning = false;
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement.clientHeight || window.innerHeight;

    const pieces = [];
    const colors = ['#ffd700', '#c41e3a', '#4ade80', '#ffffff', '#38bdf8', '#f43f5e'];

    for (let i = 0; i < 120; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            rotSpeed: Math.random() * 6 - 3
        });
    }

    if (confettiRunning) return;
    confettiRunning = true;

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotSpeed;

            // Start på toppen igjen når de faller ut
            if (p.y > canvas.height) {
                p.y = -15;
                p.x = Math.random() * canvas.width;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
        });

        requestAnimationFrame(render);
    }

    render();
}

// ==========================================
// OPPSTART VED SIDELASTING
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    initFlagTaskA();
    initFlagTaskB();
    initFlappyCanvas();
    initWaldoTask();
});
