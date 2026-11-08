// Two static views on one page. Hash links also support back/forward and direct links.
const libraryView = document.querySelector('#library');
const aboutView = document.querySelector('#about');
let libraryScroll = 0;

document.querySelector('.page-turn-next').addEventListener('click', () => {
  libraryScroll = window.scrollY;
});

function showPage(initial = false) {
  const showingAbout = window.location.hash === '#about';
  libraryView.hidden = showingAbout;
  aboutView.hidden = !showingAbout;
  document.title = showingAbout ? 'Kravali — About me' : 'Kravali — Zines';

  if (!initial) {
    (showingAbout ? aboutView : libraryView).focus({ preventScroll: true });
    requestAnimationFrame(() => window.scrollTo(0, showingAbout ? 0 : libraryScroll));
  }
}

window.addEventListener('hashchange', () => showPage());
showPage(true);
