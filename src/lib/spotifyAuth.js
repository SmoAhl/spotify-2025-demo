const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET");
}

export async function fetchAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Spotify token error:", errorText);
    throw new Error("Spotify token request failed");
  }

  const data = await response.json();
  const accessToken = data.access_token;

  if (!accessToken) {
    console.error("Spotify token error: access_token missing", data);
    throw new Error("access_token missing");
  }

  return accessToken;
}
