const dialog = document.querySelector('.zine-dialog');
let activeReader = null;
let opener = null;

// Both the grid card and the large reader display the same page position.
function renderPages(view, reader) {
  const { title, cover, folder, total, turns, position } = reader;
  const page = turns[position];
  const facing = page > 1 && page + 1 <= total ? page + 1 : null;
  const left = view.querySelector('.page-left');
  const right = view.querySelector('.page-right');

  left.src = page === 0 ? cover : `${folder}/page-${page}.png`;
  left.alt = page === 0 ? `Cover of ${title}` : `${title}, page ${page}`;
  right.hidden = !facing;
  if (facing) {
    right.src = `${folder}/page-${facing}.png`;
    right.alt = `${title}, page ${facing}`;
  } else {
    right.removeAttribute('src');
    right.alt = '';
  }

  view.classList.toggle('has-spread', Boolean(facing));
  view.querySelector('.prev-page').disabled = position === 0;
  view.querySelector('.next-page').disabled = position === turns.length - 1;
}

function turnPage(reader, direction) {
  const nextPosition = reader.position + direction;
  if (nextPosition < 0 || nextPosition >= reader.turns.length) return;
  reader.position = nextPosition;
  renderPages(reader.zine, reader);
  if (activeReader === reader) renderPages(dialog, reader);
}

function closeReader() {
  if (dialog.classList.contains('fallback-dialog')) {
    dialog.removeAttribute('open');
    dialog.dispatchEvent(new Event('close'));
  } else {
    dialog.close();
  }
}

function openReader(reader, image) {
  activeReader = reader;
  opener = image;
  dialog.setAttribute('aria-label', `${reader.title} reader (press Escape or click outside to close)`);
  renderPages(dialog, reader);
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    // Older browsers without native <dialog> support still get a usable popup.
    dialog.classList.add('fallback-dialog');
    dialog.setAttribute('open', '');
    dialog.setAttribute('aria-modal', 'true');
    document.body.classList.add('fallback-reader-open');
  }
  document.body.classList.add('dialog-open');
  const next = dialog.querySelector('.next-page');
  (next.disabled ? dialog.querySelector('.prev-page') : next).focus();
}

document.querySelectorAll('.zine').forEach((zine) => {
  zine.style.setProperty('--tilt', `${(Math.random() * 4 - 2).toFixed(2)}deg`);
  const { title, cover, folder } = zine.dataset;
  const total = Number(zine.dataset.pages);
  // The cover is page 1, followed by spreads 2–3, 4–5... and a lone last page.
  const turns = [0];
  for (let page = 2; page < total; page += 2) turns.push(page);
  if (total > 1 && total % 2 === 0) turns.push(total);
  const reader = { zine, title, cover, folder, total, turns, position: 0 };

  zine.querySelector('.prev-page').addEventListener('click', () => turnPage(reader, -1));
  zine.querySelector('.next-page').addEventListener('click', () => turnPage(reader, 1));

  // Only clicking a page image opens the large reader; card controls stay inline.
  zine.querySelectorAll('.zine-pages img').forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `Open ${title} in the large reader`);
    image.addEventListener('click', () => openReader(reader, image));
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openReader(reader, image);
      }
    });
  });
  renderPages(zine, reader);
});

dialog.querySelector('.prev-page').addEventListener('click', () => {
  if (activeReader) turnPage(activeReader, -1);
});
dialog.querySelector('.next-page').addEventListener('click', () => {
  if (activeReader) turnPage(activeReader, 1);
});
document.addEventListener('click', (event) => {
  if (document.body.classList.contains('fallback-reader-open') && event.target === document.body) closeReader();
});
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeReader();
});
dialog.addEventListener('keydown', (event) => {
  if (!activeReader) return;
  if (dialog.classList.contains('fallback-dialog') && event.key === 'Escape') {
    event.preventDefault();
    closeReader();
    return;
  }
  if (dialog.classList.contains('fallback-dialog') && event.key === 'Tab') {
    const focusable = [...dialog.querySelectorAll('.zine-controls button:not(:disabled)')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    turnPage(activeReader, event.key === 'ArrowRight' ? 1 : -1);
  }
});
dialog.addEventListener('close', () => {
  activeReader = null;
  document.body.classList.remove('dialog-open', 'fallback-reader-open');
  opener?.focus();
});
