const clientId = "b6097dd7b34f4722aa77228496d0ceb6"; // Replace with your Spotify API Client ID
const redirectUri = "http://127.0.0.1:5500/"; // Replace with your Redirect URI
const clientSecret = "b59fb33feb0242a9947998c094060655"; // Replace with your actual Client Secret
const scope = "user-read-playback-state user-modify-playback-state"; // Add the desired scopes
const responseType = "code";
const loginButton = document.getElementById("loginButton");
var access_Token;
var refresh_Token;

window.onload = function() {
  checkURL()
};

/*EVENT LISTENERS*/
loginButton.addEventListener("click", Auth);

//FLOATING WINDOW FUNCTION
function checkURL() {
  const currentURL = window.location.href;
  var authToken = Trim(window.location.href, "=");
  // Replace this with your Spotify callback URL
  const spotifyCallbackURL = authToken; // Replace with your actual callback URL

  if (currentURL.includes(spotifyCallbackURL)) {
    // Authentication is over; change the property of an element
    document.getElementById("loginButton").innerHTML = "logged in";
    document.getElementById("loginButton").style.transform = "translateY(50px)";
    // You can perform other actions as needed here
    getToken();
    getCurrentTrackInfo();
  }
}

//AUTH STATE CHECK
// Check if a user is authenticated by looking for an authentication token in cookies
function isAuthenticated() {
  // Replace 'authToken' with the name of your authentication token cookie
  var authToken = getCookie("authCode");
  // Check if the authToken exists and is not empty
  return authToken !== null && authToken.trim() !== "";
}

// AUTH
function Auth() {
  // Construct the authorization URL
  const authorizationUrl =
    `https://accounts.spotify.com/authorize?` +
    `client_id=${encodeURIComponent(clientId)}` +
    `&response_type=${encodeURIComponent(responseType)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}`;
  window.location.href = authorizationUrl;
  const authorizationCode = Trim(window.location.href, "=");
  //Entering authkey into cookie
  document.cookie = `authCode=${encodeURIComponent(
    authorizationCode
  )}; expires=Thu, 01 Jan 2030 00:00:00 UTC; path=/`;
  document.cookie = `authF=true; expires=Thu, 01 Jan 2030 00:00:00 UTC; path=/`;
  document.getElementById("loginButton").innerHTML = "logging in";
}

//TRIM
function Trim(string, key) {
  return string.split(key)[1];
}

//COOKIE VARIABLE
// Function to retrieve the value of a specific cookie by name
function getCookie(cookieName) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim(); // Remove leading/trailing whitespace
    if (cookie.startsWith(cookieName + "=")) {
      const cookieValue = decodeURIComponent(
        cookie.substring(cookieName.length + 1)
      );
      return cookieValue;
    }
  }
  return null; // Cookie not found
}

//ACCESS TOKEN FETCH
function getToken() {
  // Define the request body parameters
  const requestBody = new URLSearchParams();
  requestBody.append("grant_type", "authorization_code");
  requestBody.append("code", getCookie("authCode"));
  requestBody.append("redirect_uri", redirectUri);

  // Encode the client ID and client secret for the Authorization header
  const base64Credentials = btoa(`${clientId}:${clientSecret}`);
  // Set up the POST request headers
  const headers = new Headers({
    Authorization: `Basic ${base64Credentials}`,
    "Content-Type": "application/x-www-form-urlencoded",
  });
  // Create the POST request
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: requestBody,
  };
  // Make the POST request to exchange the authorization code for an access token
  fetch("https://accounts.spotify.com/api/token", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // Access token is in data.access_Token
      console.log("Access Token:", data.access_token);
      // Refresh token (if provided) is in data.refresh_token
      console.log("Refresh Token:", data.refresh_token);
      // Other data like token type and expiration may also be available
      // Set up the headers with the access token
      access_Token = data.access_token;
      refresh_Token = data.refresh_token;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//REFRESHING ACCESS TOKEN
function refreshToken() {
  // Define the request body with the refresh token
  const requestBody1 = new URLSearchParams();
  requestBody1.append("grant_type", "refresh_token");
  requestBody1.append("refresh_token", refresh_Token);

  // Make a POST request to refresh the access token
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_Token}`,
      "Content-Type": "application/json",
    },
    body: requestBody1,
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the refreshed access token
      access_Token = data.access_token;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//TRACK INFO FETCH
// Function to get currently playing track information
function getCurrentTrackInfo() {
  // Set up the headers with the access token
  const headers = new Headers({
    Authorization: `Bearer ${access_Token}`,
    "Content-Type": "application/json",
  });

  // Make a GET request to retrieve the currently playing track
  fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data
      if (data.item) {
        // Extract information about the currently playing track
        const trackName = data.item.name;
        const artistName = data.item.artists
          .map((artist) => artist.name)
          .join(", ");
        const albumName = data.item.album.name;

        // Display the information (you can update your HTML elements here)
        console.log("Track Name:", trackName);
        console.log("Artist(s):", artistName);
        console.log("Album Name:", albumName);

        const albumArtURL = data.item.album.images[0].url; // Assuming you want the first image (largest size)
        console.log("Album Art URL:", albumArtURL);

        document.getElementById("album-art").src = albumArtURL;
        document.getElementById("song-title").innerHTML = trackName;
        document.getElementById("album-name").innerHTML = albumName;
        document.getElementById("artist-name").innerHTML = artistName;
      } else {
        // No track is currently playing
        console.log("No track is currently playing.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//USER PLAYLIST FETCH
// Function to fetch user playlists
function getUserPlaylists() {
  fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${access_Token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const playlists = data.items;
      playlists.forEach((playlist) => {
        const listItem = document.createElement("li");
        listItem.textContent = playlist.name;
        playlistList.appendChild(listItem);
      });
    })
    .catch((error) => console.error("Error fetching playlists:", error));
}

//ACCESS TOKEN STATE CHECK
/*
function TokenStateCheck() {
  // Decode the token (assuming it's a JWT)
  const decodedToken = JSON.parse(atob(access_Token.split(".")[1]));
  // Get the expiration timestamp from the token
  const expirationTimestamp = decodedToken.exp;
  // Get the current timestamp
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (expirationTimestamp < currentTimestamp) {
    console.log("Access token has expired.");
    refreshToken();
  }
}
*/
