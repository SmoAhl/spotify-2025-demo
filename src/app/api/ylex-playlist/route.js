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
  const uniqueIds = Array.from(new Set(artistIds));

  const artistDataById = new Map();

  for (let i = 0; i < uniqueIds.length; i += 50) {
    const chunk = uniqueIds.slice(i, i + 50);
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
      if (!a || !a.id) continue;

      const genres = Array.isArray(a.genres) ? a.genres : [];
      const followersTotal =
        typeof a.followers?.total === "number" ? a.followers.total : 0;
      const popularity = typeof a.popularity === "number" ? a.popularity : 0;
      const externalUrl = a.external_urls?.spotify ?? null;

      artistDataById.set(a.id, {
        genres,
        followers: followersTotal,
        popularity,
        externalUrl,
      });
    }
  }

  return artistDataById;
}

function getUniqueArtistIdsFromTracks(tracks) {
  const artistIdSet = new Set();
  for (const track of tracks) {
    const artists = Array.isArray(track.artists) ? track.artists : [];
    for (const artist of artists) {
      if (artist?.id) {
        artistIdSet.add(artist.id);
      }
    }
  }
  return Array.from(artistIdSet);
}

function addArtistInfoToTracks(tracks, artistDataById) {
  return tracks.map((track) => {
    const artists = Array.isArray(track.artists) ? track.artists : [];

    const enrichedArtists = artists.map((artist) => {
      const data = artistDataById.get(artist.id);
      return {
        ...artist,
        genres: data?.genres ?? [],
        followers: data?.followers ?? 0,
        popularity: data?.popularity ?? 0,
        externalUrl: data?.externalUrl ?? null,
      };
    });

    const genreSet = new Set();
    for (const a of enrichedArtists) {
      const genresForArtist = Array.isArray(a.genres) ? a.genres : [];
      for (const g of genresForArtist) {
        genreSet.add(g);
      }
    }

    return {
      ...track,
      artists: enrichedArtists,
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

    const artistDataById = await fetchArtistsByIds(artistIds, token);

    const tracksWithArtistInfo = addArtistInfoToTracks(tracks, artistDataById);

    return NextResponse.json({ tracks: tracksWithArtistInfo });
  } catch (err) {
    console.error("playlist error:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
