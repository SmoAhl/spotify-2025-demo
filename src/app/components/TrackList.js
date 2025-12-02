"use client";

import React from "react";

/**
 * TrackList
 *  - props.tracks: taulukko olioita muodossa
 *    {
 *      id, name,
 *      artists: [{ id, name }],
 *      album,
 *      genres: [ ... ],
 *      durationMs,
 *      externalUrl
 *    }
 *  - props.offset: rivinumeroinnin aloitus (esim. currentPage * pageSize)
 */
export default function TrackList({ tracks, offset = 0 }) {
  if (!Array.isArray(tracks) || tracks.length === 0) {
    return (
      <p className="mt-4 text-sm text-(--text-primary)">
        Ei kappaleita näytettäväksi.
      </p>
    );
  }

  return (
    <section className="mt-6 space-y-2">
      <h2 className="text-lg font-semibold text-(--text-strong)">
        Kappaleet
      </h2>

      <div className="overflow-x-auto rounded-lg border border-(--border) bg-(--surface) shadow-sm">
        <table className="min-w-full text-sm text-(--text-primary)">
          <thead className="bg-(--table-header-bg) text-(--table-header-text)">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Kappale</th>
              <th className="px-3 py-2 text-left">Artistit</th>
              <th className="px-3 py-2 text-left">Albumi</th>
              <th className="px-3 py-2 text-left">Genret</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, index) => {
              const artists = (track.artists || [])
                .map((a) => a.name)
                .join(", ");
              const genres = (track.genres || []).join(", ");

              const rowNumber = offset + index + 1;

              return (
                <tr
                  key={track.id ?? rowNumber}
                  className="border-t border-(--border) hover:bg-(--table-row-hover)"
                >
                  <td className="px-3 py-2 text-(--text-muted)">
                    {rowNumber}
                  </td>
                  <td className="px-3 py-2 font-semibold text-(--text-strong)">
                    {track.externalUrl ? (
                      <a
                        href={track.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-(--link) underline-offset-4 hover:text-(--link-hover) hover:underline"
                      >
                        {track.name}
                      </a>
                    ) : (
                      track.name
                    )}
                  </td>
                  <td className="px-3 py-2 text-(--text-primary)">
                    {artists}
                  </td>
                  <td className="px-3 py-2 text-(--text-primary)">
                    {track.album}
                  </td>
                  <td className="px-3 py-2 text-(--text-muted)">
                    {genres}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
