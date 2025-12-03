"use client";

import { useEffect, useMemo, useState } from "react";
import TrackList from "../components/TrackList";
import GenreChart from "../components/GenreChart";

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

  const genreStats = useMemo(() => {
    if (!Array.isArray(tracks) || tracks.length === 0) return [];

    const counts = new Map(); // genre -> lukumäärä

    for (const track of tracks) {
      const rawGenres = Array.isArray(track.genres) ? track.genres : [];

      // If track has no genres at all, treat it as ["unknown"]
      const genresToUse = rawGenres.length > 0 ? rawGenres : ["unknown"];

      for (const g of genresToUse) {
        // If genre string is empty/null, also map it to "unknown"
        const key = (g && g.trim().length > 0 ? g : "unknown").toLowerCase();
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);
  }, [tracks]);

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
          <div className="">
            <p className="text-sm">
              pieni yläotsikko, esim. “Datajournalismi • YleX Uuden Musiikin X”
            </p>
            <h1 className="text-4xl p-4">
              Mitä YLEX Uuden Musiikin listaan lisätään?
            </h1>
            <p className="text-sm">
              2–3 virkettä kuvaus: mistä soittolistasta on kyse mitä dataa
              haetaan mitä käyttäjä voi tehdä (selata, tarkastella genrejä tms.)
            </p>
          </div>
          <div>
            <img></img>
          </div>
        </header>

        <section>
          <h2>Mitä analysoidaan?</h2>
          <p>
            kappale 1: lyhyt taustoitus YleX:n Uuden Musiikin X -ohjelmasta /
            soittolistasta kappale. 2: miten data haetaan (Spotify API,
            soittolistan kappaleet + artistien genret) kappale. 3: mitä käyttäjä
            näkee alempana sivulla (taulukko + genregraafi + loppuanalyysi).
          </p>
        </section>

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
          <TrackList
            tracks={pageTracks}
            offset={startIndex}
            page={page}
            totalPages={totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        )}

        {genreStats.length > 0 && (
          <section className="mt-10 space-y-6">
            <GenreChart stats={genreStats} />

            <article className="mx-auto max-w-3xl space-y-3 rounded-lg bg-(--surface-subtle) p-4 text-sm text-(--text-primary)">
              <h2 className="text-base font-semibold text-(--text-strong)">
                Mitä soittolista kertoo tämän hetken musiikista?
              </h2>

              <p>
                Tämän otoksen perusteella Uuden Musiikin X -soittolista
                painottuu selvästi genreen{" "}
                <strong>{genreStats[0]?.genre}</strong>. Se on soittolistalla
                yleisin genre, ja sen alle osuu{" "}
                <strong>{genreStats[0]?.count}</strong> kappaletta
                viidenkymmenen biisin joukosta.
              </p>

              <p>
                Samalla listalla on yhteensä{" "}
                <strong>{genreStats.length}</strong> yleisintä genreä, mikä
                kertoo, että soittolista kokoaa sekä valtavirtaa että pienempiä
                alakulttuureja saman katon alle. Demossa käytetty genredata
                tulee suoraan artistien Spotify-profiileista.
              </p>
            </article>
          </section>
        )}
      </div>
    </main>
  );
}
