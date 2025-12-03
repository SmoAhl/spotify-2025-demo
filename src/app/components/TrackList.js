"use client";

import React from "react";
import { formatDuration } from "@/lib/formatter";

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
 *  - props.page: nykyinen sivunumero (0-indeksoitu)
 *  - props.totalPages: sivujen kokonaismäärä
 *  - props.onPrevPage: funktio edellinen-sivun painikkeelle
 *  - props.onNextPage: funktio seuraava-sivun painikkeelle
 */
export default function TrackList({
  tracks,
  offset = 0,
  page,
  totalPages,
  onPrevPage,
  onNextPage,
}) {
  if (!Array.isArray(tracks) || tracks.length === 0) {
    return (
      <p className="mt-4 text-sm text-(--text-primary)">
        Ei kappaleita näytettäväksi.
      </p>
    );
  }

  return (
    <section className="mt-6 space-y-2">
      <h2 className="text-2xl font-semibold text-(--text-strong)">Kappaleet</h2>

      <div className="overflow-x-auto rounded-lg border border-(--border) bg-(--surface) shadow-sm">
        <table className="min-w-full text-sm text-(--text-primary)">
          <thead className="bg-(--table-header-bg) text-(--table-header-text)">
            <tr>
              <th className="px-3 py-2 text-left">Kappale</th>
              <th className="px-3 py-2 text-left">Artistit</th>
              <th className="px-3 py-2 text-left">Albumi</th>
              <th className="px-3 py-2 text-left">Genret</th>
              <th className="px-3 py-2 text-left">Kesto</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, index) => {
              const artists = (track.artists || [])
                .map((a) => a.name)
                .join(", ");
              const genreList = Array.isArray(track.genres) ? track.genres : [];
              const genres =
                genreList.length > 0 ? genreList.join(", ") : "unknown";

              return (
                <tr
                  key={track.id ?? rowNumber}
                  className="border-t border-(--border) hover:bg-(--table-row-hover)"
                >
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
                  <td className="px-3 py-2 text-(--text-primary)">{artists}</td>
                  <td className="px-3 py-2 text-(--text-primary)">
                    {track.album}
                  </td>
                  <td className="px-3 py-2 text-(--text-muted)">{genres}</td>
                  <td className="px-3 py-2 text-(--text-muted)">
                    {formatDuration(track.durationMs)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text-primary) shadow-sm">
        <button
          type="button"
          onClick={onPrevPage}
          disabled={page === 0}
          className="flex items-center gap-1 rounded border border-(--button-border) bg-(--button-bg) px-3 py-1 font-medium text-(--button-text) transition hover:bg-(--button-bg-hover) disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Edellinen 10 kappaletta"
        >
          Edellinen
        </button>

        <span className="font-semibold text-(--text-strong)">
          Sivu {page + 1} / {Math.max(totalPages, 1)}
        </span>

        <button
          type="button"
          onClick={onNextPage}
          disabled={page + 1 >= totalPages}
          className="flex items-center gap-1 rounded border border-(--button-border) bg-(--button-bg) px-3 py-1 font-medium text-(--button-text) transition hover:bg-(--button-bg-hover) disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Seuraavat 10 kappaletta"
        >
          Seuraava
        </button>
      </div>
    </section>
  );
}
