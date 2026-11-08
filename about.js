// Two static views on one page. Hash links also support back/forward and direct links.
const libraryView = document.querySelector('#library');
const aboutView = document.querySelector('#about');
let libraryScroll = 0;
let activeTransition = null;

document.querySelector('.page-turn-next').addEventListener('click', () => {
  libraryScroll = window.scrollY;
});

function showPage(initial = false) {
  const showingAbout = window.location.hash === '#about';
  const update = () => {
    if ((window.location.hash === '#about') !== showingAbout) return;
    libraryView.hidden = showingAbout;
    aboutView.hidden = !showingAbout;
    document.title = showingAbout ? 'Kravali — About me' : 'Kravali — Zines';
    if (!initial) {
      (showingAbout ? aboutView : libraryView).focus({ preventScroll: true });
      window.scrollTo(0, showingAbout ? 0 : libraryScroll);
    }
  };

  // A fast second click goes straight to its destination rather than queuing.
  if (activeTransition) {
    activeTransition.skipTransition();
    activeTransition = null;
    document.documentElement.classList.remove('swipe-to-about', 'swipe-to-library');
    update();
    return;
  }
  document.documentElement.classList.remove('swipe-to-about', 'swipe-to-library');
  if (initial || window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof document.startViewTransition !== 'function') {
    update();
    return;
  }

  // Snapshot both views so the whole page swipes left (or right on return).
  if (showingAbout) window.scrollTo(0, libraryScroll);
  const direction = showingAbout ? 'swipe-to-about' : 'swipe-to-library';
  document.documentElement.classList.add(direction);
  const transition = document.startViewTransition(update);
  activeTransition = transition;
  const finish = () => {
    if (activeTransition !== transition) return;
    activeTransition = null;
    document.documentElement.classList.remove(direction);
  };
  transition.finished.finally(finish);
  // Also clean up if a browser suspends the transition animation.
  window.setTimeout(() => {
    if (activeTransition === transition) transition.skipTransition();
    finish();
  }, 700);
}

window.addEventListener('hashchange', () => showPage());
showPage(true);
