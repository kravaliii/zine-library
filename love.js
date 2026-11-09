const loveButton = document.querySelector('.love-button');
const loveStorageKey = 'kravali-left-some-love-v1';

function readLove() {
  try { return localStorage.getItem(loveStorageKey) === 'yes'; }
  catch { return false; }
}

function saveLove() {
  try { localStorage.setItem(loveStorageKey, 'yes'); }
  catch { /* The blink still works if storage is unavailable. */ }
}

function playPlop() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const audio = new AudioContext();
  const now = audio.currentTime;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(210, now);
  oscillator.frequency.exponentialRampToValueAtTime(72, now + .18);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(520, now);
  filter.frequency.exponentialRampToValueAtTime(160, now + .18);
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(.16, now + .025);
  gain.gain.exponentialRampToValueAtTime(.0001, now + .22);

  oscillator.connect(filter).connect(gain).connect(audio.destination);
  oscillator.start(now);
  oscillator.stop(now + .24);
  oscillator.addEventListener('ended', () => audio.close());
}

if (loveButton) {
  const savedLove = readLove();
  loveButton.classList.toggle('is-loved', savedLove);
  loveButton.setAttribute('aria-pressed', savedLove ? 'true' : 'false');

  loveButton.addEventListener('click', () => {
    loveButton.classList.remove('is-blinking');
    // Restart the blink animation every time the heart is clicked.
    void loveButton.offsetWidth;
    loveButton.classList.add('is-loved', 'is-blinking');
    loveButton.setAttribute('aria-pressed', 'true');
    saveLove();
    playPlop();
  });

  loveButton.addEventListener('animationend', (event) => {
    if (event.animationName === 'love-blink') loveButton.classList.remove('is-blinking');
  });
}
