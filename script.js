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
    'path-solo': 'screen-task2a',
    'path-oslo': 'screen-task2b',

    // SPOR A (Hvis de svarer SOLO)
    'screen-task2a': 'screen-task3a',
    'screen-task3a': 'screen-task4a',
    'screen-task4a': 'screen-task5', 

    // SPOR B (Hvis de svarer OSLO)
    'screen-task2b': 'screen-task3b',
    'screen-task3b': 'screen-task4b',
    'screen-task4b': 'screen-task5'  
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
const HASH_SOLO = '5364f2f2fc4f54e9d47ad29cfb08ef430c8153394bf2a0dff5cbe77a0ffef861';
const HASH_OSLO = '8e016391c88c77d6773deab343b91f53bb64bfbc9ca18101844cb84c3d01e561';

async function validateTask1() {
    const inputEl = document.getElementById('task1-input');
    const errorEl = document.getElementById('task1-error');
    
    // Saniterer teksten for unødvendige mellomrom og store bokstaver
    const answer = inputEl.value.trim().toLowerCase();

    // Venter på at hashen skal beregnes
    const hashedAnswer = await sha256(answer);

    // Sammenligner brukerens hash med fasit-hashen
    if (hashedAnswer === HASH_SOLO) {
        // De svarte SOLO! Skjul feilmelding og send til Spor A
        errorEl.style.display = 'none';
        
        // Slå opp i kartet hvor "path-solo" leder:
        const nextScreen = gameFlow['path-solo'];
        goToScreen(nextScreen);
        
    } else if (hashedAnswer === HASH_OSLO) {
        // De svarte OSLO! Skjul feilmelding og send til Spor B
        errorEl.style.display = 'none';
        
        // Slå opp i kartet hvor "path-oslo" leder:
        const nextScreen = gameFlow['path-oslo'];
        goToScreen(nextScreen);
        
    } else {
        // Feil svar
        errorEl.style.display = 'block';
    }
}

// ==========================================
//  (TIMEGLASS)
// ==========================================
let timeInSeconds = 13 * 60;
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