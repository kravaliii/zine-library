// YouTube's official iframe player provides Play/Pause and Next.
// The video is off-screen; YouTube still streams video data, not audio-only.
const videoId = '6lSduE_5vPc';
const playlistId = 'RDEMNr2LHhdAFPD8hqGeORvgyQ';
const playButton = document.querySelector('.radio-play');
const nextButton = document.querySelector('.radio-next');
const status = document.querySelector('.radio-status');
const track = document.querySelector('.radio-track');

let player;
let ready = false;
let playWhenReady = false;
nextButton.disabled = true;

function showPlaying(isPlaying) {
  playButton.textContent = isPlaying ? '❚❚' : '▶';
  playButton.setAttribute('aria-label', isPlaying ? 'Pause radio' : 'Play radio');
}

function updateTrackTitle() {
  const title = player.getVideoData()?.title;
  if (title) {
    track.textContent = title;
    track.title = title;
  }
}

function showError(message) {
  status.textContent = message;
  track.textContent = '';
  track.removeAttribute('title');
  playButton.title = message;
  nextButton.title = message;
}

playButton.addEventListener('click', () => {
  status.textContent = '';
  if (!ready) {
    playWhenReady = !playWhenReady;
    showPlaying(playWhenReady);
    return;
  }
  if (player.getPlayerState() === YT.PlayerState.PLAYING) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
});

nextButton.addEventListener('click', () => {
  if (!ready) return;
  status.textContent = '';
  track.textContent = '…';
  const playlist = player.getPlaylist();
  if (playlist && playlist.length > 1) {
    player.nextVideo();
  } else {
    // Some YouTube Mix playlists populate only when explicitly requested.
    player.loadPlaylist({ listType: 'playlist', list: playlistId, index: 1 });
  }
  showPlaying(true);
});

window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player('radio-player', {
    width: '220',
    height: '220',
    videoId,
    playerVars: {
      listType: 'playlist',
      list: playlistId,
      controls: 0,
      playsinline: 1
    },
    events: {
      onReady: () => {
        ready = true;
        player.getIframe().tabIndex = -1;
        nextButton.disabled = false;
        updateTrackTitle();
        if (playWhenReady) player.playVideo();
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.CUED) {
          updateTrackTitle();
        }
        if (event.data === YT.PlayerState.PLAYING) showPlaying(true);
        if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) showPlaying(false);
      },
      onError: (event) => {
        showPlaying(false);
        const message = event.data === 153
          ? 'Radio funktioniert nur auf einer veröffentlichten Website, nicht über file://.'
          : 'YouTube kann diesen Track hier nicht abspielen.';
        showError(message);
        if (event.data === 153) {
          document.querySelector('.radio-label').textContent = '♪ · online';
          playButton.disabled = true;
          nextButton.disabled = true;
        }
      }
    }
  });
};

const playerContainer = document.createElement('div');
playerContainer.id = 'radio-player';
playerContainer.className = 'radio-player';
playerContainer.setAttribute('aria-hidden', 'true');
document.body.appendChild(playerContainer);

const api = document.createElement('script');
api.src = 'https://www.youtube.com/iframe_api';
api.onerror = () => showError('Radio benötigt eine Internetverbindung.');
document.head.appendChild(api);
