"use client";

import React from "react";
import { formatDuration } from "@/lib/formatter";
import { Pagination } from "./Pagination"; // polku sen mukaan mihin laitat
import { getArtistNodes, getGenresText } from "@/lib/trackHelper";

/**
 * TrackList
 *  - props.tracks: taulukko olioita muodossa
 *    {
 *      id, name,
 *      artists: [{ id, name, popularity?, followers?, externalUrl? }],
 *      album,
 *      genres: [ ... ],
 *      durationMs,
 *      externalUrl,
 *      popularity?
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
              const rowNumber = offset + index + 1;
              const trackTooltipText = `Popularity: ${track.popularity ?? "?"}`;

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
                        title={trackTooltipText}
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
                    {getArtistNodes(track)}
                  </td>

                  <td className="px-3 py-2 text-(--text-primary)">
                    {track.album}
                  </td>

                  <td className="px-3 py-2 text-(--text-muted)">
                    {getGenresText(track)}
                  </td>

                  <td className="px-3 py-2 text-(--text-muted)">
                    {formatDuration(track.durationMs)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />
    </section>
  );
}
