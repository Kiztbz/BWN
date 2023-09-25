const clientId = "b6097dd7b34f4722aa77228496d0ceb6"; // Replace with your Spotify API Client ID
const redirectUri = "http://127.0.0.1:5500/"; // Replace with your Redirect URI
const clientSecret = "b59fb33feb0242a9947998c094060655"; // Replace with your actual Client Secret
const scope = "user-read-playback-state user-modify-playback-state user-read-currently-playing, streaming"; // Add the desired scopes
const responseType = "code";
var access_Token = localStorage.getItem('AccessToken');
var refresh_Token = localStorage.getItem('RefreshToken');
var expiry;
var Ctime;
var authorizationServerUrl;
var f = 0;
var f1;

//ONLOAD 
window.onload = function () 
{
    if(localStorage.getItem('AuthCode') == 'undefined')
    localStorage.setItem('LoginY', 'transform(0px)')
    document.documentElement.style.setProperty("--LoginY", localStorage.getItem('LoginY'));
    document.documentElement.style.setProperty("--StartY", localStorage.getItem('StartY'));
    loop();
};
window.onchange = function () 
{
    document.documentElement.style.setProperty("--LoginY", localStorage.getItem('LoginY'));
    document.documentElement.style.setProperty("--StartY", localStorage.getItem('StartY'));
};


//ACCESS_TOKEN VALIDITY CHECK FUNCTION
function accessTokenValidity()
{
    var time = new Date();
    if(time.getMinutes>9)
    Ctime = time.getHours()+""+time.getMinutes();
    else
    Ctime = time.getHours()+"0"+time.getMinutes();
    const accessTokenExpiration = localStorage.getItem('AccessTokenExpiry');;
        if (accessTokenExpiration > Ctime && accessTokenExpiration !== null) {
            getCurrentTrackInfo();
        } else {
            if(f==1)
            {
                f = 0;
                Auth();
                getToken();
                accessTokenExpiration();
            }
            else
            {
                console.log('Invalid Access Token');
                refreshTokenValidity();
                f = 1;
            }
        }
}

//REFRESH_TOKEN VALIDITY CHECK FUNCTION
function refreshTokenValidity()
{

    // Construct the request to obtain a new access token using the refresh token
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const requestBody = new URLSearchParams();/*
    if(localStorage.getItem('AuthCode') == null)
    {
        Auth();
    }
    const tokenEndpoint = localStorage.getItem('AuthURL');

    // Construct the request body
    const requestBody = new URLSearchParams();
    requestBody.append('grant_type', 'refresh_token');
    requestBody.append('refresh_token', localStorage.getItem('RefreshToken'));
    requestBody.append('client_id', clientId);
    requestBody.append('client_secret', clientSecret);

    // Create the fetch request
    fetch(tokenEndpoint, {
        method: 'POST',
        body: requestBody,
        headers: 
        {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    .then((response) => response.json())
    .then((tokenResponse) => {
        // Extract the new access token from the response
        const newAccessToken = tokenResponse.access_token;
        access_Token = newAccessToken;
        var time = new Date();
        if(time.getMinutes>9)
            expiry = (time.getHours()+1)+""+time.getMinutes();
        else
            expiry = (time.getHours()+1)+"0"+time.getMinutes();    
        localStorage.setItem('AccessToken', access_Token);
        localStorage.setItem('AccessTokenExpiry', expiry);
    })
    .catch((error) => {
        console.error('Error refreshing token:', error);
    });
    accessTokenValidity();*/
    requestBody.append('grant_type', 'refresh_token');
    requestBody.append('refresh_token', localStorage.getItem('RefreshToken'));

    // Encode the client ID and client secret for basic authentication
    const base64Credentials = btoa(`${clientId}:${clientSecret}`);

    // Make a POST request to the token URL to obtain a new access token
    fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${base64Credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: requestBody
    })
    .then((response) => {
    if (response.status === 200) {
        return response.json();
    } else {
        throw new Error('Failed to refresh access token');
    }
    })
    .then((data) => {
        // Handle the new access token in the response
        const accessToken = data.access_token;
        console.log('New access token:', accessToken);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


//REFRESH_TOKEN VALIDITY CHECK FUNCTION
function Auth()
{
    const authorizationUrl =
    `https://accounts.spotify.com/authorize?` +
    `client_id=${encodeURIComponent(clientId)}` +
    `&response_type=${encodeURIComponent(responseType)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}`;
    window.location.href = authorizationUrl;
    const authorizationCode = Trim(window.location.href, "=");
    //Entering authkey into cookie
    localStorage.setItem('AuthCode', authorizationCode);
    localStorage.setItem('AuthURL', authorizationUrl);
}
//TRIM
function Trim(string, key) 
{
    return string.split(key)[1];
}

//TOKEN FETCH
function getToken() 
{
    // Define the request body parameters
    const requestBodyToken = new URLSearchParams();
    requestBodyToken.append("grant_type", "authorization_code");
    requestBodyToken.append("code", localStorage.getItem('AuthCode'));
    requestBodyToken.append("redirect_uri", redirectUri);

    // Encode the client ID and client secret for the Authorization header
    const base64Credentials = btoa(`${clientId}:${clientSecret}`);
    // Create the POST request
    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Basic ${base64Credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBodyToken,
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
        var time = new Date();
        if(time.getMinutes>9)
            expiry = (time.getHours()+1)+""+time.getMinutes();
        else
            expiry = (time.getHours()+1)+"0"+time.getMinutes();
        localStorage.setItem('AccessToken', access_Token);
        localStorage.setItem('AccessTokenExpiry', expiry);
        localStorage.setItem('RefreshToken', refresh_Token);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//TRACK INFO FETCH
function getCurrentTrackInfo() 
{
    // Make a GET request to retrieve the currently playing track
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem('AccessToken')}`,
            "Content-Type": "application/json",
        },
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

            const albumArtURL = data.item.album.images[0].url; // Assuming you want the first image (largest size)
            localStorage.setItem('AlbumArtURL', albumArtURL);
            localStorage.setItem('SongTitle', trackName);
            localStorage.setItem('AlbumName', albumName);
            localStorage.setItem('ArtistName', artistName);
            document.getElementById("album-art").src = localStorage.getItem('AlbumArtURL');
            document.getElementById("song-title").innerHTML = localStorage.getItem('SongTitle');
            document.getElementById("album-name").innerHTML = localStorage.getItem('AlbumName');
            document.getElementById("artist-name").innerHTML = localStorage.getItem('ArtistName');
            } else {
            // No track is currently playing
            console.log("No track is currently playing.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

async function loop() 
{
    getCurrentTrackInfo();
    var min = new Date();
    if(min.getMinutes() == 18 && min.getSeconds >50)
    {
        refreshTokenValidity();
    }
    await sleep(1000);
    loop();
}
function sleep(ms) 
{
    return new Promise((val) => setTimeout(val, ms));
}


//LOGIN BUTTON
function checkBtn1()
{
    Auth();
    document.getElementById("loginButton").innerHTML = "Lets go!";
    localStorage.setItem('LoginY', "translateY(50px)");
    document.documentElement.style.setProperty("--LoginY", localStorage.getItem('LoginY'));
    localStorage.setItem('StartY', "translateY(0px)");
    document.documentElement.style.setProperty("--StartY", localStorage.getItem('StartY'));
}
function checkBtn2()
{
    getToken();
    document.getElementById("loginButton").innerHTML = "Lets go!";
    localStorage.setItem('LoginY', "translateY(50px)");
    document.documentElement.style.setProperty("--LoginY", localStorage.getItem('LoginY'));
    localStorage.setItem('StartY', "translateY(50px)");
    document.documentElement.style.setProperty("--StartY", localStorage.getItem('StartY'));
    loop();
}


/*
//GETTING COOKIE EXPIRATION TIME
function getCookieExpiration(cookieName) 
{
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) 
    {
        cookie = cookie.trim();
        if (cookie.startsWith(cookieName + '=')) 
        {
            const cookieValue = cookie.substring(cookieName.length + 1);
            const decodedCookieValue = decodeURIComponent(cookieValue);
            const cookiePairs = decodedCookieValue.split(';');
            for (let pair of cookiePairs) 
            {
                pair = pair.trim();
                if (pair.startsWith('expiresAt=')) 
                {
                    const expiresValue = pair.substring('expiresAt='.length);
                    return expiresValue;
                }
            }
        }
    }
    return null; // Return null if the cookie or expiration is not found
}

//GETTING COOKIE VALUE
function getCookie(cookieName) 
{
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) 
    {
        const cookie = cookies[i].trim(); // Remove leading/trailing whitespace
        if (cookie.startsWith(cookieName + "=")) 
        {
            const cookieValue = decodeURIComponent(cookie.substring(cookieName.length + 1));
            return cookieValue;
        }
    }
    return null; // Cookie not found
}*/

  /*
  EXPIRATION TIME

  var time = new Date();
  if(time.getMinutes>9)
  var expiry = (time.getHours()+1)+""+time.getMinutes();
  else
  var expiry = (time.getHours()+1)+"0"+time.getMinutes();
  document.cookie = `AccessToken=${encodeURIComponent(authorizationCode)}; expiresAt=2123;`;

  */
