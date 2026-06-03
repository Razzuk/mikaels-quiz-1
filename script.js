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
// OPPGAVE 1
// ==========================================
const HASH_TASK1 = '8e016391c88c77d6773deab343b91f53bb64bfbc9ca18101844cb84c3d01e561';
async function validateTask1() {
    const inputEl = document.getElementById('task1-input');
    const errorEl = document.getElementById('task1-error');
    
    // Saniterer teksten for unødvendige mellomrom og store bokstaver
    const answer = inputEl.value.trim().toLowerCase();

    // Venter på at hashen skal beregnes
    const hashedAnswer = await sha256(answer);

    // Sammenligner brukerens hash med fasit-hashen
    if (hashedAnswer === HASH_TASK1) {
        errorEl.style.display = 'none';
        goToScreen('screen-task3');
    } else {
        errorEl.style.display = 'block';
    }
}

// ==========================================
// OPPGAVE 3 (TIMEGLASS)
// ==========================================
let timeInSeconds = 13 * 60;
function startTask3() { ... }