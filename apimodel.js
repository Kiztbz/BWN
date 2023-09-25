// Declare and initialize the player variable
player = new Spotify.Player({
  name: 'My Web Playback SDK Player',
  getOAuthToken: (cb) => { cb(localStorage.getItem('AccessToken')); }
});

// Initialize the player
player.connect().then((success) => {
  if (success) {
    console.log('The Web Playback SDK has been initialized and connected.');
  }
});

// Listen for "player_state_changed" event
player.addListener('player_state_changed', (state) => {
  if (state) {
    const trackName = state.track_window.current_track.name;
    const artistName = state.track_window.current_track.artists[0].name;
    
    console.log(`Now playing: ${trackName} by ${artistName}`);
  } else {
    console.log('No track is currently playing.');
  }
});
