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
  });

  loveButton.addEventListener('animationend', (event) => {
    if (event.animationName === 'love-blink') loveButton.classList.remove('is-blinking');
  });
}
