"use client";

import { useEffect, useMemo, useState } from "react";
import TrackList from "../components/TrackList";

const PAGE_SIZE = 10;
const MAX_TRACKS = 50;

export default function YlexPlaylistPage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadTracks() {
      try {
        setLoading(true);
        const res = await fetch("/api/ylex-playlist");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Soittolistan haku epäonnistui");
        }
        const data = await res.json();
        const safeTracks = Array.isArray(data.tracks) ? data.tracks : [];
        if (!cancelled) {
          setTracks(safeTracks.slice(0, MAX_TRACKS));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Tuntematon virhe");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTracks();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPage(0);
  }, [tracks.length]);

  const totalPages = useMemo(() => {
    if (tracks.length === 0) return 0;
    return Math.ceil(tracks.length / PAGE_SIZE);
  }, [tracks.length]);

  const startIndex = page * PAGE_SIZE;
  const pageTracks = tracks.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePrevPage = () => setPage((prev) => Math.max(0, prev - 1));
  const handleNextPage = () =>
    setPage((prev) => {
      const lastPage = Math.max(totalPages - 1, 0);
      return Math.min(lastPage, prev + 1);
    });

  return (
    <main className="px-6 py-10 text-(--text-primary)">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-(--text-muted)">
            YleX
          </p>
          <h1 className="text-3xl font-semibold text-(--text-strong)">
            Uuden Musiikin Spotify-soittolista
          </h1>
          <p className="text-(--text-primary)">
            Näytä 10 kappaletta kerrallaan ja selaa nuolilla 50 kappaleen
            joukkoa.
          </p>
        </header>

        {loading && (
          <div className="rounded-lg border border-(--border) bg-(--surface) p-4 text-(--text-primary) shadow-sm">
            Haetaan soittolistaa...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
            Virhe soittolistan haussa: {error}
          </div>
        )}

        {!loading && !error && pageTracks.length === 0 && (
          <div className="rounded-lg border border-(--border) bg-(--surface) p-4 text-(--text-primary) shadow-sm">
            Ei kappaleita näytettäväksi.
          </div>
        )}

        {!loading && !error && pageTracks.length > 0 && (
          <>
            <TrackList tracks={pageTracks} offset={startIndex} />

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-(--border) bg-(--surface) px-4 py-3 text-sm text-(--text-primary) shadow-sm">
              <button
                type="button"
                onClick={handlePrevPage}
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
                onClick={handleNextPage}
                disabled={page + 1 >= totalPages}
                className="flex items-center gap-1 rounded border border-(--button-border) bg-(--button-bg) px-3 py-1 font-medium text-(--button-text) transition hover:bg-(--button-bg-hover) disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Seuraavat 10 kappaletta"
              >
                Seuraava
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
