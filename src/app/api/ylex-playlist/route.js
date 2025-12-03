import { NextResponse } from "next/server";
import { fetchAccessToken } from "@/lib/spotifyAuth";

async function fetchPlaylistTracks(playlistId, token) {
  const params = new URLSearchParams({ limit: "50" });
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?${params.toString()}`;

  const res = await fetch(url, {
    headers: { Authorization: "Bearer " + token },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Spotify playlist error:", errorText);
    throw new Error(`Playlist fetch failed: ${errorText}`);
  }

  const playlistData = await res.json();
  const items = Array.isArray(playlistData.items) ? playlistData.items : [];

  return items
    .filter((item) => item?.track && !item.track.is_local && item.track.id)
    .map((item) => {
      const t = item.track;

      const artists = (t.artists || [])
        .filter((a) => a && a.id && a.name)
        .map((a) => ({
          id: a.id,
          name: a.name,
        }));

      return {
        id: t.id,
        name: t.name,
        artists,
        album: t.album?.name,
        popularity: t.popularity,
        durationMs: t.duration_ms,
        externalUrl: t.external_urls?.spotify,
      };
    });
}

async function fetchArtistsByIds(artistIds, token) {
  const artistGenresById = new Map();

  // pilkotaan max 50 ID:n palasiin
  for (let i = 0; i < artistIds.length; i += 50) {
    const chunk = artistIds.slice(i, i + 50);
    const url = `https://api.spotify.com/v1/artists?ids=${chunk.join(",")}`;

    const res = await fetch(url, {
      headers: { Authorization: "Bearer " + token },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Spotify artist error:", errorText);
      throw new Error(`Artist fetch failed: ${errorText}`);
    }

    const artistData = await res.json();
    const artists = Array.isArray(artistData.artists) ? artistData.artists : [];

    for (const a of artists) {
      const genres = Array.isArray(a.genres) ? a.genres : [];
      artistGenresById.set(a.id, genres);
    }
  }

  return artistGenresById;
}

function getUniqueArtistIdsFromTracks(tracks) {
  const artistIdSet = new Set();
  for (const track of tracks) {
    for (const artist of track.artists) {
      artistIdSet.add(artist.id);
    }
  }
  return Array.from(artistIdSet);
}

function addGenresToTracks(tracks, artistGenresById) {
  return tracks.map((track) => {
    const genreSet = new Set();

    for (const artist of track.artists) {
      const genresForArtist = artistGenresById.get(artist.id) || [];
      for (const genre of genresForArtist) {
        genreSet.add(genre);
      }
    }

    return {
      ...track,
      genres: Array.from(genreSet),
    };
  });
}

export async function GET() {
  try {
    const token = await fetchAccessToken();
    const playlistId = process.env.YLEX_PLAYLIST_ID;
    if (!playlistId) {
      console.error("playlist ID missing");
      throw new Error("Playlist ID missing");
    }

    const tracks = await fetchPlaylistTracks(playlistId, token);

    const artistIds = getUniqueArtistIdsFromTracks(tracks);
    if (artistIds.length === 0) {
      return NextResponse.json({ tracks });
    }

    const artistGenresById = await fetchArtistsByIds(artistIds, token);

    const tracksWithGenres = addGenresToTracks(tracks, artistGenresById);

    return NextResponse.json({ tracks: tracksWithGenres });
  } catch (err) {
    console.error("playlist error:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
