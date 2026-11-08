const aboutDialog = document.querySelector('.about-dialog');
const aboutTrigger = document.querySelector('.about-trigger');
const aboutClose = document.querySelector('.about-close');

function finishAboutClose() {
  document.body.classList.remove('dialog-open', 'fallback-about-open');
  aboutTrigger.focus();
}

function closeAbout() {
  if (aboutDialog.classList.contains('fallback-dialog')) {
    aboutDialog.removeAttribute('open');
  } else {
    aboutDialog.close();
  }
  finishAboutClose();
}

aboutTrigger.addEventListener('click', () => {
  if (typeof aboutDialog.showModal === 'function') {
    aboutDialog.showModal();
  } else {
    aboutDialog.classList.add('fallback-dialog');
    aboutDialog.setAttribute('open', '');
    aboutDialog.setAttribute('aria-modal', 'true');
    document.body.classList.add('fallback-about-open');
  }
  document.body.classList.add('dialog-open');
  aboutClose.focus();
});

aboutClose.addEventListener('click', closeAbout);
aboutDialog.addEventListener('click', (event) => {
  if (event.target === aboutDialog) closeAbout();
});
aboutDialog.addEventListener('keydown', (event) => {
  if (!aboutDialog.classList.contains('fallback-dialog')) return;
  if (event.key === 'Escape') { event.preventDefault(); closeAbout(); }
  if (event.key === 'Tab') { event.preventDefault(); aboutClose.focus(); }
});
document.addEventListener('click', (event) => {
  if (document.body.classList.contains('fallback-about-open') && event.target === document.body) closeAbout();
});
aboutDialog.addEventListener('close', finishAboutClose);
