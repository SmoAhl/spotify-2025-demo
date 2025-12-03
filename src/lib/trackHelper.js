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

/**
 * Yhdistää track.genres-taulukon merkkijonoksi ("unknown" jos tyhjä/puuttuu)
 */
export function getGenresText(track) {
  const genreList = Array.isArray(track.genres) ? track.genres : [];
  return genreList.length > 0 ? genreList.join(", ") : "unknown";
}
