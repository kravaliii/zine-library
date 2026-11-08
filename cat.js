// A small illustrated cat. It never blocks clicks or other page interactions.
const cat = document.createElement('div');
cat.className = 'wandering-cat';
cat.setAttribute('aria-hidden', 'true');
cat.innerHTML = `
  <span class="cat-bubble">meow</span>
  <div class="cat-shape">
    <svg class="cat-walking" viewBox="0 0 120 100" aria-hidden="true">
      <path class="cat-leg cat-leg-far" d="" />
      <path class="cat-leg cat-leg-far" d="" />
      <g class="cat-torso">
        <path class="cat-tail" d="M30 66 C10 67 8 48 21 46" />
        <path class="cat-coat" d="M30 52 C20 51 18 58 20 68 Q24 81 53 81 L76 81 Q88 78 88 62 Q85 49 70 48 Z" />
        <path class="cat-ear" d="M68 30 L67 10 L83 27 Z M96 27 L113 10 L109 32 Z" />
        <path class="cat-inner-ear" d="M71 23 L70 16 L77 25 Z M102 25 L110 16 L107 26 Z" />
        <rect class="cat-coat" x="64" y="27" width="49" height="42" rx="13" />
        <circle class="cat-iris" cx="79" cy="46" r="8" />
        <circle class="cat-iris" cx="99" cy="46" r="8" />
        <circle class="cat-pupil" cx="79" cy="46" r="4.5" />
        <circle class="cat-pupil" cx="99" cy="46" r="4.5" />
        <path class="cat-nose" d="M86 56 L93 56 L89.5 60 Z" />
        <path class="cat-mouth" d="M89.5 60 L89.5 63 M89.5 63 L86.5 65 M89.5 63 L92.5 65" />
      </g>
      <path class="cat-leg cat-leg-near" d="" />
      <path class="cat-leg cat-leg-near" d="" />
    </svg>
    <svg class="cat-sitting" viewBox="0 0 120 120" aria-hidden="true">
      <path class="cat-tail" d="M72 108 L115 108" />
      <path class="cat-coat" d="M42 55 Q39 50 47 49 L76 49 C94 58 100 73 100 89 L100 114 L43 114 Q40 110 40 103 Z" />
      <path class="cat-coat" d="M41 109 L41 118 Q45 120 49 116 L52 109 Z M65 109 L65 118 Q69 120 73 116 L76 109 Z" />
      <path class="cat-ear" d="M31 25 L29 0 L49 20 Z M76 20 L96 0 L93 25 Z" />
      <path class="cat-inner-ear" d="M34 19 L33 8 L43 21 Z M82 21 L92 8 L90 20 Z" />
      <rect class="cat-coat" x="26" y="18" width="69" height="42" rx="15" />
      <circle class="cat-iris" cx="47" cy="39" r="10" />
      <circle class="cat-iris" cx="74" cy="39" r="10" />
      <circle class="cat-pupil" cx="47" cy="39" r="5.5" />
      <circle class="cat-pupil" cx="74" cy="39" r="5.5" />
      <path class="cat-nose" d="M57 49 L64 49 L60.5 53 Z" />
      <path class="cat-mouth" d="M60.5 53 L60.5 56 M60.5 56 L57.5 58 M60.5 56 L63.5 58" />
    </svg>
  </div>`;
document.body.appendChild(cat);

// Each tail is a curved path: bend its middle and tip, not the whole tail.
const walkingTail = cat.querySelector('.cat-walking .cat-tail');
const sittingTail = cat.querySelector('.cat-sitting .cat-tail');

function bendTail(amount) {
  walkingTail.setAttribute('d',
    `M30 66 C10 67 ${8 + amount * 4} ${48 - amount * 6} ${21 + amount * 4} ${46 - amount * 4}`);
  sittingTail.setAttribute('d',
    `M72 108 C85 108 ${97 - amount * 3} ${108 - amount * 9} 115 ${108 - amount * 7}`);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  function swishTail(startTime) {
    const elapsed = (performance.now() - startTime) / 1800;
    if (elapsed >= 1) {
      bendTail(0);
      setTimeout(() => requestAnimationFrame(swishTail), 2000 + Math.random() * 5000);
      return;
    }
    const amount = Math.sin(Math.PI * elapsed) * Math.sin(4 * Math.PI * elapsed);
    bendTail(amount);
    requestAnimationFrame(() => swishTail(startTime));
  }
  setTimeout(() => requestAnimationFrame(swishTail), 1500 + Math.random() * 3000);
}

// Detect hover without blocking clicks. Pause the walk and sit while the mouse is near.
let mouseX = -1000;
let mouseY = -1000;
let hovered = false;
let resting = false;
let activeAnimation = null;

function updateCatState() {
  cat.classList.toggle('is-meowing', hovered);
  cat.classList.toggle('is-sitting', hovered || resting);
  if (activeAnimation) {
    if (hovered) activeAnimation.pause();
    else activeAnimation.play();
  }
}

document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});
document.addEventListener('mouseleave', () => {
  mouseX = -1000;
  mouseY = -1000;
});
setInterval(() => {
  const box = cat.getBoundingClientRect();
  const overCat = mouseX >= box.left && mouseX <= box.right &&
    mouseY >= box.top && mouseY <= box.bottom;
  if (overCat !== hovered) {
    hovered = overCat;
    updateCatState();
  }
}, 100);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Four-beat walk (see https://en.wikipedia.org/wiki/Cat_anatomy#Legs):
// each paw plants, moves back under the body, then lifts forward.
const legPaths = cat.querySelectorAll('.cat-walking .cat-leg');
const torso = cat.querySelector('.cat-torso');
const legs = [
  { path: legPaths[0], hip: 37, y: 75, phase: .5 },  // far hind
  { path: legPaths[1], hip: 76, y: 75, phase: .25 }, // far front
  { path: legPaths[2], hip: 30, y: 77, phase: 0 },   // near hind
  { path: legPaths[3], hip: 70, y: 77, phase: .75 }  // near front
];

function drawGait(animation) {
  if (activeAnimation !== animation) return;
  const cycle = (animation.currentTime || 0) / 750;
  for (const leg of legs) {
    const step = (cycle + leg.phase) % 1;
    const planted = step < .65;
    const swing = (step - .65) / .35;
    const footX = planted ? leg.hip + 12 - 24 * step / .65 : leg.hip - 12 + 24 * swing;
    const footY = planted ? 94 : 94 - 8 * Math.sin(Math.PI * swing);
    const kneeX = (leg.hip + footX) / 2 + (leg.hip < 50 ? 4 : -4);
    leg.path.setAttribute('d', `M${leg.hip} ${leg.y} Q${kneeX} 85 ${footX} ${footY} l4 0`);
  }
  torso.setAttribute('transform', `translate(0 ${-Math.abs(Math.sin(cycle * Math.PI * 2)) * 1.2})`);
  requestAnimationFrame(() => drawGait(animation));
}

async function walk(from, to) {
  while (hovered) await wait(100);
  resting = false;
  updateCatState();
  cat.classList.add('is-walking');
  cat.style.transform = `translateX(${from}px)`;
  const distance = Math.abs(to - from);
  const ramp = Math.min(24, distance / 4);
  const direction = Math.sign(to - from);
  const animation = cat.animate([
    { transform: `translateX(${from}px)`, offset: 0, easing: 'ease-in' },
    { transform: `translateX(${from + direction * ramp}px)`, offset: ramp / distance },
    { transform: `translateX(${to - direction * ramp}px)`, offset: 1 - ramp / distance, easing: 'ease-out' },
    { transform: `translateX(${to}px)`, offset: 1 }
  ], { duration: distance / 30 * 1000, easing: 'linear', fill: 'forwards' });
  activeAnimation = animation;
  requestAnimationFrame(() => drawGait(animation));
  if (hovered) updateCatState();
  await animation.finished;
  activeAnimation = null;
  cat.style.transform = `translateX(${to}px)`;
  animation.cancel();
  cat.classList.remove('is-walking');
}

async function visit() {
  let direction = 1;
  while (true) {
    const width = window.innerWidth;
    const start = direction === 1 ? -80 : width + 80;
    const end = direction === 1 ? width + 80 : -80;
    cat.querySelector('.cat-shape').style.transform = direction === 1 ? '' : 'scaleX(-1)';

    if (Math.random() < 0.75) {
      const stop = width * (0.2 + Math.random() * 0.6);
      await walk(start, stop);
      resting = true;
      updateCatState();
      await wait(2200 + Math.random() * 3500);
      resting = false;
      updateCatState();
      await walk(stop, end);
    } else {
      await walk(start, end);
    }

    direction *= -1;
    await wait(1800 + Math.random() * 1800);
  }
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  resting = true;
  updateCatState();
  cat.style.transform = `translateX(${window.innerWidth - 74}px)`;
} else {
  visit();
}
