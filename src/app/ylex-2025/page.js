"use client";

import TrackList from "../components/TrackList";
import GenreChart from "../components/GenreChart";
import { Pagination } from "../components/Pagination";
import { usePlaylist } from "@/hooks/usePlaylist";

export default function YlexPlaylistPage() {
  const {
    loading,
    error,
    genreStats,
    pageTracks,
    startIndex,
    page,
    totalPages,
    sortKey,
    sortDirection,
    handlePrevPage,
    handleNextPage,
    handleSortChange,
  } = usePlaylist();

  return (
    <main className="px-6 py-10 text-(--text-primary)">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="space-y-2">
          <div>
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
            <img />
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
          <>
            <TrackList
              tracks={pageTracks}
              offset={startIndex}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onChangeSort={handleSortChange}
              pageSize={10}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
            />
          </>
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
