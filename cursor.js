// Decorative cursor for mouse users only; keep the normal cursor on touch devices.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const star = document.createElement('div');
  star.className = 'pink-star-cursor';
  star.setAttribute('aria-hidden', 'true');
  document.body.appendChild(star);

  // Keep the star in the top layer of whichever popup is open.
  const dialogs = [...document.querySelectorAll('dialog')];
  function cursorLayer() {
    for (let i = dialogs.length - 1; i >= 0; i--) {
      if (dialogs[i].hasAttribute('open')) return dialogs[i];
    }
    return document.body;
  }
  function placeCursor() {
    cursorLayer().appendChild(star);
    dialogs.filter((dialog) => !dialog.hasAttribute('open')).forEach((dialog) => {
      dialog.querySelectorAll('.pink-glitter').forEach((sparkle) => sparkle.remove());
    });
  }
  dialogs.forEach((dialog) => {
    new MutationObserver(placeCursor).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });

  let lastSparkle = 0;

  document.addEventListener('mousemove', (event) => {
    document.body.classList.add('has-pink-cursor');
    star.style.left = `${event.clientX}px`;
    star.style.top = `${event.clientY}px`;

    const now = performance.now();
    if (now - lastSparkle < 22) return;
    lastSparkle = now;

    for (let i = 0; i < 5; i++) {
      const glitter = document.createElement('span');
      glitter.className = 'pink-glitter';
      glitter.style.left = `${event.clientX + (Math.random() - .5) * 38}px`;
      glitter.style.top = `${event.clientY + (Math.random() - .5) * 38}px`;
      glitter.style.width = glitter.style.height = `${4 + Math.random() * 8}px`;
      glitter.style.setProperty('--drift', `${(Math.random() - .5) * 36}px`);
      cursorLayer().appendChild(glitter);
      glitter.addEventListener('animationend', () => glitter.remove(), { once: true });
    }
  });

  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('has-pink-cursor');
  });
}
