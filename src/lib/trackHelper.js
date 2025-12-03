import React from "react";

/**
 * Palauttaa JSX:n Artistit-saraketta varten.
 * track.artists: [{ id, name, popularity?, followers?, externalUrl? }]
 */
export function getArtistNodes(track) {
  const artistArray = Array.isArray(track.artists) ? track.artists : [];

  if (artistArray.length === 0) {
    return "unknown";
  }

  return artistArray.map((artist, i) => {
    const isLast = i === artistArray.length - 1;

    const tooltipText = `Popularity: ${artist.popularity ?? "?"} | Followers: ${
      artist.followers?.toLocaleString("fi-FI") ?? "?"
    }`;

    const content = artist.externalUrl ? (
      <a
        href={artist.externalUrl}
        target="_blank"
        rel="noreferrer"
        title={tooltipText}
        className="text-(--link) underline-offset-4 hover:text-(--link-hover) hover:underline"
      >
        {artist.name}
      </a>
    ) : (
      artist.name
    );

    return (
      <span key={artist.id ?? i}>
        {content}
        {!isLast && ", "}
      </span>
    );
  });
}

export function getGenresText(track) {
  const genreList = Array.isArray(track.genres) ? track.genres : [];
  return genreList.length > 0 ? genreList.slice(0, 2).join(", ") : "unknown";
}

// Tätä käytetään lajitteluun
export function getGenreSortKey(track) {
  const genreList = Array.isArray(track.genres) ? track.genres : [];
  if (genreList.length === 0) return "unknown";

  // Vaihtoehto A: käytä ensimmäistä genreä
  return genreList[0].toLowerCase();

  // Vaihtoehto B: jos haluat lajitella koko yhdistetyn stringin mukaan:
  // return genreList.join(", ").toLowerCase();
}

export function sortTracks(tracks, sortKey, sortDirection) {
  if (!Array.isArray(tracks)) return [];

  if (!sortKey || sortDirection === "none") {
    return tracks;
  }

  const dir = sortDirection === "desc" ? -1 : 1;

  return [...tracks].sort((a, b) => {
    switch (sortKey) {
      case "title": {
        const an = a.name?.toLowerCase() ?? "";
        const bn = b.name?.toLowerCase() ?? "";
        if (an < bn) return -1 * dir;
        if (an > bn) return 1 * dir;
        return 0;
      }
      case "artists": {
        const aa = (a.artists?.[0]?.name || "").toLowerCase();
        const ba = (b.artists?.[0]?.name || "").toLowerCase();
        if (aa < ba) return -1 * dir;
        if (aa > ba) return 1 * dir;
        return 0;
      }
      case "album": {
        const aal = a.album?.toLowerCase() ?? "";
        const bal = b.album?.toLowerCase() ?? "";
        if (aal < bal) return -1 * dir;
        if (aal > bal) return 1 * dir;
        return 0;
      }
      case "duration": {
        const ad = a.durationMs ?? 0;
        const bd = b.durationMs ?? 0;
        if (ad < bd) return -1 * dir;
        if (ad > bd) return 1 * dir;
        return 0;
      }
      case "genre": {
        const ag = getGenreSortKey(a);
        const bg = getGenreSortKey(b);
        if (ag < bg) return -1 * dir;
        if (ag > bg) return 1 * dir;
        return 0;
      }
      default:
        return 0;
    }
  });
}
