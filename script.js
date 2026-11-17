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

        // Initialiser flaggoppgavene når spilleren ankommer skjermen
        if (screenId === 'screen-task4a') {
            initFlagTaskA();
        } else if (screenId === 'screen-task4b') {
            initFlagTaskB();
        }
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

// Spillets ruting-kart
const gameFlow = {
    'screen-task2a': 'screen-task3a',
    'screen-task3a': 'screen-task4a',
    'screen-task4a': 'screen-task5',

    'screen-task2b': 'screen-task3b',
    'screen-task3b': 'screen-task4b',
    'screen-task4b': 'screen-task5',

    'screen-task5': 'screen-task6',
    'screen-task6': 'screen-task7',
    'screen-task7': 'screen-task8',
    'screen-task8': 'screen-task9'
};

function advanceFrom(currentScreenId) {
    const nextScreen = gameFlow[currentScreenId];
    if (nextScreen) {
        goToScreen(nextScreen);
    } else {
        console.error("Ingen rute definert for skjerm:", currentScreenId);
    }
}


// ==========================================
// OPPGAVE 1: FORGRENINGEN (OSLO / SOLO)
// ==========================================
const HASH_OSLO = '5898ad16710aebe7cc5582f3beee738bbd1cf36647bc3827ab153a7f6f1a8e10';
const HASH_SOLO = 'ee44962ebef1cd1f579ae7483d259c6dd372bf95e263ab2df9313d30b91cb2ab';

async function validateTask1() {
    const inputEl = document.getElementById('task1-input');
    const errorEl = document.getElementById('task1-error');
    const val = inputEl.value.trim().toLowerCase();
    const hash = await sha256(val);

    if (hash === HASH_OSLO) {
        errorEl.style.display = 'none';
        goToScreen('screen-task2a');
    } else if (hash === HASH_SOLO) {
        errorEl.style.display = 'none';
        goToScreen('screen-task2b');
    } else {
        errorEl.style.display = 'block';
    }
}


// ==========================================
// OPPGAVER 2 & 3: TRIVIA FOR SPOR A OG B
// ==========================================
async function validateTask2a() { advanceFrom('screen-task2a'); }
async function validateTask3a() { advanceFrom('screen-task3a'); }
async function validateTask2b() { advanceFrom('screen-task2b'); }
async function validateTask3b() { advanceFrom('screen-task3b'); }


// ==========================================
// OPPGAVE 4A & 4B: FLAGG-SORTERING (MED EMOJIS)
// ==========================================

// SPOR A: Flaggdata og fasit (A–H: Argentina -> Hellas)
const flagsDataA = [
    { id: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { id: 'BE', name: 'Belgia',    flag: '🇧🇪' },
    { id: 'CL', name: 'Chile',     flag: '🇨🇱' },
    { id: 'DK', name: 'Danmark',   flag: '🇩🇰' },
    { id: 'EG', name: 'Egypt',     flag: '🇪🇬' },
    { id: 'FI', name: 'Finland',   flag: '🇫🇮' },
    { id: 'GH', name: 'Ghana',     flag: '🇬🇭' },
    { id: 'GR', name: 'Hellas',    flag: '🇬🇷' }
];
const CORRECT_ORDER_4A = ['AR', 'BE', 'CL', 'DK', 'EG', 'FI', 'GH', 'GR'];
let currentFlagsA = [];

// SPOR B: Flaggdata og fasit (I–S: Island -> Spania)
const flagsDataB = [
    { id: 'IS', name: 'Island',  flag: '🇮🇸' },
    { id: 'JP', name: 'Japan',   flag: '🇯🇵' },
    { id: 'KE', name: 'Kenya',   flag: '🇰🇪' },
    { id: 'LB', name: 'Libanon', flag: '🇱🇧' },
    { id: 'MX', name: 'Mexico',  flag: '🇲🇽' },
    { id: 'NO', name: 'Norge',   flag: '🇳🇴' },
    { id: 'PL', name: 'Polen',   flag: '🇵🇱' },
    { id: 'ES', name: 'Spania',  flag: '🇪🇸' }
];
const CORRECT_ORDER_4B = ['IS', 'JP', 'KE', 'LB', 'MX', 'NO', 'PL', 'ES'];
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

        // Venstre side: Nummerering og flagg-emoji
        const label = document.createElement('div');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '12px';
        label.innerHTML = `
            <span style="font-size: 16px; font-weight: bold; color: #ffd700; width: 22px;">${index + 1}.</span> 
            <span style="font-size: 30px; line-height: 1;">${item.flag}</span>
        `;

        // Høyre side: Opp/ned-knapper
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
// OPPGAVE 5: TIMEGLASSET (GYROSKOP / SENSOR)
// ==========================================
let hourglassTimer = null;
let currentRemainingSeconds = 60;
let isUpsideDown = false;
let isSensorActive = false;

function initHourglass() {
    if (isSensorActive) return;

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    startHourglassTracking();
                } else {
                    alert('Sensor-tilgang ble avvist. Oppgaven krever bevegelsessensor.');
                }
            })
            .catch(console.error);
    } else {
        startHourglassTracking();
    }
}

function startHourglassTracking() {
    isSensorActive = true;
    const btn = document.getElementById('btn-sensor-start');
    if (btn) btn.style.display = 'none';

    window.addEventListener('deviceorientation', handleOrientation);

    hourglassTimer = setInterval(() => {
        if (isUpsideDown) {
            currentRemainingSeconds--;
            updateHourglassUI();

            if (currentRemainingSeconds <= 0) {
                clearInterval(hourglassTimer);
                window.removeEventListener('deviceorientation', handleOrientation);
                document.getElementById('screen-task5-success').style.display = 'block';
            }
        }
    }, 1000);
}

function handleOrientation(event) {
    const beta = event.beta;
    if (beta === null) return;

    // Enheten regnes som opp-ned hvis beta er lavere enn -60 grader
    if (beta < -60) {
        isUpsideDown = true;
        document.getElementById('hourglass-hint').innerText = "Bra! Sanden renner bakover...";
        document.getElementById('hourglass-hint').style.color = "#4ade80";
    } else {
        isUpsideDown = false;
        document.getElementById('hourglass-hint').innerText = "Snu mobilen helt opp-ned for å tømme glasset!";
        document.getElementById('hourglass-hint').style.color = "#ffd700";
    }
}

function updateHourglassUI() {
    const timeDisplay = document.getElementById('hourglass-time');
    if (timeDisplay) {
        timeDisplay.innerText = `${currentRemainingSeconds}s`;
    }
}


// ==========================================
// OPPGAVE 6: FLAPPY BIRD
// ==========================================
let flappyScore = 0;
const FLAPPY_GOAL = 10;

function jumpBird() {
    // Enkel klikk-mekanikk for demonstrasjon / mobiltest
    flappyScore++;
    const scoreDisplay = document.getElementById('flappy-score');
    if (scoreDisplay) scoreDisplay.innerText = flappyScore;

    if (flappyScore >= FLAPPY_GOAL) {
        document.getElementById('flappy-success').style.display = 'block';
    }
}


// ==========================================
// OPPGAVE 7: PUSLESPILLET (KODE: 14916)
// ==========================================
const HASH_TASK7 = '0cba2fa7ffebce9bb31e312ee655e6c071e3e83dadeca2d5a75a67a0a9aa9421';

async function validateTask7() {
    const inputEl = document.getElementById('task7-input');
    const errorEl = document.getElementById('task7-error');
    const val = inputEl.value.replace(/\s+/g, '');
    const hash = await sha256(val);

    if (hash === HASH_TASK7) {
        errorEl.style.display = 'none';
        advanceFrom('screen-task7');
    } else {
        errorEl.style.display = 'block';
    }
}


// ==========================================
// OPPGAVE 8: FINN 5 JULEOBJEKTER (WALDO)
// ==========================================
const waldoTargets = [
    { name: "Nisselue",   x: 24.5, y: 35.0, radius: 3.5, found: false },
    { name: "Pepperkake", x: 62.0, y: 18.5, radius: 3.5, found: false },
    { name: "Pakke",      x: 81.2, y: 74.0, radius: 3.5, found: false },
    { name: "Bjelle",     x: 12.8, y: 82.3, radius: 3.5, found: false },
    { name: "Candy cane", x: 45.0, y: 56.7, radius: 3.5, found: false }
];

let waldoFoundCount = 0;

function initWaldoTask() {
    const img = document.getElementById('waldo-img');
    const wrapper = document.getElementById('waldo-wrapper');
    if (!img || !wrapper) return;

    img.addEventListener('click', (event) => {
        const rect = img.getBoundingClientRect();
        const clickX = ((event.clientX - rect.left) / rect.width) * 100;
        const clickY = ((event.clientY - rect.top) / rect.height) * 100;

        console.log(`Klikket på: x: ${clickX.toFixed(1)}%, y: ${clickY.toFixed(1)}%`);

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
    const marker = document.createElement('div');
    marker.style.position = 'absolute';
    marker.style.left = `${target.x}%`;
    marker.style.top = `${target.y}%`;
    marker.style.width = '36px';
    marker.style.height = '36px';
    marker.style.border = '3px solid #ffd700';
    marker.style.backgroundColor = 'rgba(196, 30, 58, 0.4)';
    marker.style.borderRadius = '50%';
    marker.style.transform = 'translate(-50%, -50%)';
    marker.style.pointerEvents = 'none';
    marker.style.boxShadow = '0 0 8px #ffd700';
    wrapper.appendChild(marker);

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
// OPPSTART VED SIDELASTING
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    initFlagTaskA();
    initFlagTaskB();
    initWaldoTask();
});
