"use client";

import TrackList from "../components/TrackList";
import GenreChart from "../components/GenreChart";
import { Pagination } from "../components/Pagination";
import { usePlaylist } from "@/hooks/usePlaylist";
import Image from "next/image";

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
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        {/* HERO / INGRESSI */}
        <header className="mx-auto max-w-3xl space-y-4 pb-4">
          <p className="text-sm text-(--text-muted)">
            Datajournalismi • YleX Uuden Musiikin X
          </p>

          <h1>Mitä YleX Uuden Musiikin listalle päätyy juuri nyt?</h1>

          <p>
            Tässä data-analyysidemossa tarkastellaan Ella Ossin juontaman Uuden
            Musiikin X -radio-ohjelman Spotify-soittolistan sisältöä. Ohjelma
            lähetetään arkisin kello 10.00–12.00, ja siinä esitellään kotimaisia
            ja ulkomaisia uutuuskappaleita sekä niiden tekijöitä.
          </p>

          <p>
            Demo perustuu viiteenkymmeneen viimeisimpänä soittolistalle
            lisättyyn kappaleeseen. Niistä on poimittu näkyviin kappaleen ja
            artistien perustiedot sekä Spotify-algoritmin tarjoamaa dataa
            suosiosta ja genrelokeroinnista.
          </p>
          <p className="text-sm text-(--text-muted)">
            Koodi ja artikkeli on osittain tekoälyllä toteutettu.
          </p>
          <div className="mt-10 flex justify-center">
            <div className="max-w-xs">
              <Image
                src="/img/ylex.jpg"
                alt="YleX-logo"
                width={300}
                height={300}
                className="h-auto w-full rounded-lg border border-(--border)"
              />
            </div>
          </div>
        </header>

        {/* SELITYS: MITÄ ANALYSOIDAAN */}
        <section className="mx-auto max-w-3xl space-y-4">
          <h2>Mitä analysoidaan?</h2>

          <p>
            Tällä sivulla tarkastellaan, millaisia kappaleita Uuden Musiikin X
            -soittolistalle on lisätty viimeksi ja mitä ne kertovat tämän hetken
            musiikkikentästä. Otos koostuu viidestäkymmenestä tuoreimmasta
            biisistä.
          </p>

          <h3>Mistä data tulee?</h3>
          <p>
            Data haetaan Spotify Web API:n kautta. Yhteys muodostetaan
            Spotify-tilille luodun kehittäjäsovelluksen avulla. Sovellukselle
            annetaan Spotify for Developers -hallintapaneelista saadut Client ID
            ja Client Secret, joilla palvelu pyytää tilapäisen access tokenin.
            Tämän tunnisteen avulla voidaan hakea soittolistan kappaleet ja
            niihin liittyvien artistien tiedot eri Web API -endpointeista.
          </p>

          <h3>Mitä sivu näyttää?</h3>
          <p>
            Taulukossa näkyy jokaisesta kappaleesta nimi, artisti, albumi,
            genret, kesto, artistin seuraajien lukumäärä sekä Spotify-algoritmin
            laskema suosioarvo<sup>*</sup>.
          </p>

          <p>
            Käyttäjä voi selata 50 viimeisimpänä soittolistaan lisättyä
            kappaletta, järjestää sarakkeita aakkosittain tai kappaleen keston
            mukaan ja tarkastella tarkempia tietoja. Kappaleen ja artistin nimen
            päällä pysähtyessä näkyvät suosioluku ja seuraajamäärä. Klikkaamalla
            kappaletta tai artistia valintasi avautuu suoraan Spotifyssa.
          </p>

          <p>
            Genregraafi kokoaa yhteen sen, miten kappaleet jakautuvat eri
            genreihin. Yksi kappale voi kuulua useampaan genreen, ja jos
            artistille ei ole määritelty genreä, kappale päätyy{" "}
            <strong>unknown</strong>-luokkaan.
          </p>
        </section>

        {/* DATA-OSUUS: TAULUKKO + PAGINATION */}
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

        {/* GENREJAKAUMA + TULKINTA */}
        {genreStats.length > 0 && (
          <section className="mx-auto max-w-3xl space-y-4 mt-10">
            <GenreChart stats={genreStats} />

            <h2 className="text-base font-semibold text-(--text-strong)">
              Mitä soittolista kertoo tämän hetken musiikista?
            </h2>

            <p>
              Tämän otoksen perusteella Uuden Musiikin X -soittolista painottuu
              selvästi genreen <strong>{genreStats[0]?.genre}</strong>. Se on
              soittolistalla yleisin genre, ja sen alle osuu{" "}
              <strong>{genreStats[0]?.count}</strong> kappaletta viidenkymmenen
              biisin joukosta.
            </p>

            <p>
              Samalla listalla on yhteensä <strong>{genreStats.length}</strong>{" "}
              genreä, mikä kertoo, että soittolista kokoaa sekä valtavirtaa että
              pienempiä alakulttuureja saman katon alle. Demossa käytetty
              genredata tulee suoraan artistien Spotify-profiileista.
            </p>
          </section>
        )}

        <section className="mx-auto max-w-3xl space-y-4 text-sm text-(--text-primary)">
          <h3>Rajoitukset: mitä jäi analysoimatta?</h3>
          <p>
            Aiemmin Spotify Web API tarjosi audio-features- ja audio-analysis
            -rajapinnat, joiden kautta kappaleista sai tarkkaa numeerista tietoa
            esimerkiksi temposta, äänenvoimakkuudesta, dynamiikasta,
            tanssittavuudesta, energiatasosta sekä rakenteesta (introt,
            kertosäkeet, sillat). Näiden end-pointtien avulla olisi voitu
            porautua paljon syvemmälle siihen, millaisia kappaleita Uuden
            Musiikin X -soittolistalle päätyy: kuinka energisiä biisit ovat,
            kuinka tanssittavia ne ovat verrattuna aiempiin viikkoihin, tai
            poikkeavatko valinnat ”tyypillisestä” hittiprofiilista.
          </p>
          <p>
            Spotify on sittemmin sulkenut nämä rajapinnat ulkopuolisilta
            kehittäjiltä, mikä rajaa tällaisen tarkemman musiikillisen analyysin
            lähinnä Spotifyn omien työkalujen sisälle. Tässä demossa voidaan
            siksi tarkastella ennen kaikkea genrepainotuksia ja artistien
            suosittuutta, mutta ei enää pureutua yhtä syvälle yksittäisten
            kappaleiden rakenteeseen ja äänimaailmaan.
          </p>
        </section>
        <section className="mx-auto max-w-3xl mt-2 text-sm text-(--text-muted)">
          <p className="text-sm text-(--text-muted)">
            <sup>*</sup> The popularity of a track is a value between 0 and 100,
            with 100 being the most popular. The popularity is calculated by
            algorithm and is based, in the most part, on the total number of
            plays the track has had and how recent those plays are. Generally
            speaking, songs that are being played a lot now will have a higher
            popularity than songs that were played a lot in the past. Duplicate
            tracks (e.g. the same track from a single and an album) are rated
            independently. Artist and album popularity is derived mathematically
            from track popularity. Note: the popularity value may lag actual
            popularity by a few days: the value is not updated in real time.
          </p>
        </section>
      </div>
    </main>
  );
}
