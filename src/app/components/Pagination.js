"use client";

import React from "react";

/**
 * Pagination
 *  - props.page: nykyinen sivunumero (0-indeksoitu)
 *  - props.totalPages: sivujen kokonaismäärä
 *  - props.onPrevPage: funktio edellinen-sivun painikkeelle
 *  - props.onNextPage: funktio seuraava-sivun painikkeelle
 */
export function Pagination({ page, totalPages, onPrevPage, onNextPage }) {
  return (
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
  );
}
