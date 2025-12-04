"use client";

import React from "react";
import { formatDuration } from "@/lib/formatter";
import {
  getArtistNodes,
  getGenresText,
  getMainArtistFollowersText,
} from "@/lib/trackHelper";

export default function TrackList({
  tracks,
  offset = 0,
  sortKey,
  sortDirection,
  onChangeSort,
  pageSize = 10,
}) {
  if (!Array.isArray(tracks) || tracks.length === 0) {
    return (
      <p className="mt-4 text-sm text-(--text-primary)">
        Ei kappaleita näytettäväksi.
      </p>
    );
  }

  function getSortIndicator(columnKey, sortKey, sortDirection) {
    if (sortKey !== columnKey) return "↑↓";
    if (sortDirection === "none") return "";
    return sortDirection === "asc" ? "↑" : "↓";
  }

  const emptyRowCount = Math.max(0, pageSize - tracks.length);

  return (
    <section className="space-y-2">
      <h2 className="text-2xl font-semibold text-(--text-strong) pb-2">
        Kappaleet
      </h2>

      <div className="overflow-x-auto rounded-lg border border-(--border) bg-(--surface) shadow-sm">
        <table
          className="w-full text-sm text-(--text-primary)"
          style={{ tableLayout: "fixed" }}
        >
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[24%]" />
            <col className="hidden md:table-column w-[20%]" />
            <col className="w-[20%]" />
            <col className="hidden md:table-column w-[8%]" />
          </colgroup>

          <thead className="bg-(--table-header-bg) text-(--table-header-text)">
            <tr>
              <th className="px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => onChangeSort("title")}
                  className="inline-flex items-center gap-1 font-semibold text-(--table-header-text)"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <span>Kappale</span>
                  <span>
                    {getSortIndicator("title", sortKey, sortDirection)}
                  </span>
                </button>
              </th>

              <th className="px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => onChangeSort("artists")}
                  className="inline-flex items-center gap-1 font-semibold text-(--table-header-text)"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <span>Artistit</span>
                  <span>
                    {getSortIndicator("artists", sortKey, sortDirection)}
                  </span>
                </button>
              </th>

              {/* Albumi – piiloon mobiilissa */}
              <th className="hidden md:table-cell px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => onChangeSort("album")}
                  className="inline-flex items-center gap-1 font-semibold text-(--table-header-text)"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <span>Albumi</span>
                  <span>
                    {getSortIndicator("album", sortKey, sortDirection)}
                  </span>
                </button>
              </th>

              <th className="px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => onChangeSort("genre")}
                  className="inline-flex items-center gap-1 font-semibold text-(--table-header-text)"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <span>Genret</span>
                  <span>
                    {getSortIndicator("genre", sortKey, sortDirection)}
                  </span>
                </button>
              </th>

              <th className="hidden md:table-cell px-3 py-2 text-left">
                <button
                  type="button"
                  onClick={() => onChangeSort("duration")}
                  className="inline-flex items-center gap-1 font-semibold text-(--table-header-text)"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <span>Kesto</span>
                  <span>
                    {getSortIndicator("duration", sortKey, sortDirection)}
                  </span>
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {tracks.map((track, index) => {
              const rowNumber = offset + index + 1;
              const followersText = getMainArtistFollowersText(track);
              const trackTooltipText = `Popularity: ${track.popularity ?? "?"}${
                track.followers
                  ? ` | Followers: ${track.followers.toLocaleString("fi-FI")}`
                  : ""
              }`;

              return (
                <tr
                  key={track.id ?? rowNumber}
                  className="border-t border-(--border) hover:bg-(--table-row-hover)"
                >
                  {/* Kappale */}
                  <td className="px-3 py-2 font-semibold text-(--text-strong) whitespace-nowrap truncate">
                    {track.externalUrl ? (
                      <a
                        href={track.externalUrl}
                        target="_blank"
                        title={trackTooltipText} // desktop-hover
                        rel="noreferrer"
                        className="text-(--link) underline-offset-4 hover:text-(--link-hover) hover:underline"
                      >
                        {track.name}
                      </a>
                    ) : (
                      track.name
                    )}

                    {/* Mobiilille lisärivi: suosio + seuraajat */}
                    <div className="mt-0.5 text-xs text-(--text-muted) sm:hidden">
                      Popularity: {track.popularity ?? "?"}
                      {track.followers}
                    </div>
                  </td>

                  {/* Artistit */}
                  <td className="px-3 py-2 text-(--text-primary) whitespace-nowrap truncate">
                    {getArtistNodes(track)}

                    {/* Mobiilille lisärivi: seuraajat */}
                    <div className="mt-0.5 text-xs text-(--text-muted) sm:hidden">
                      Seuraajat: {followersText}
                    </div>
                  </td>

                  {/* Albumi – näkyy vain md+ */}
                  <td className="hidden md:table-cell px-3 py-2 text-(--text-primary) whitespace-nowrap truncate">
                    {track.album}
                  </td>

                  {/* Genret */}
                  <td className="px-3 py-2 text-(--text-muted) whitespace-nowrap truncate">
                    {getGenresText(track)}
                  </td>

                  {/* Kesto */}
                  <td className="hidden md:table-cell text-right px-3 py-2 text-(--text-muted) whitespace-nowrap truncate">
                    {formatDuration(track.durationMs)}
                  </td>
                </tr>
              );
            })}

            {Array.from({ length: emptyRowCount }).map((_, i) => (
              <tr
                key={`empty-${i}`}
                className="border-t border-(--border)"
                aria-hidden="true"
              >
                <td className="px-3 py-2" colSpan={5}>
                  &nbsp;
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
