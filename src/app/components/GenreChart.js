"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

/**
 * GenreChart
 *  - props.stats: [{ genre, count }]
 */
export default function GenreChart({ stats }) {
  if (!Array.isArray(stats) || stats.length === 0) {
    return null;
  }

  const labels = stats.map((s) => s.genre);
  const dataValues = stats.map((s) => s.count);

  // luetaan värit CSS-muuttujista (client-komponentti, joten ok)
  const styles = getComputedStyle(document.documentElement);
  const fern200 = styles.getPropertyValue("--border").trim();
  const fern500 = styles.getPropertyValue("--accent").trim();
  const textStrong = styles.getPropertyValue("--muted").trim();
  const textPrimary = styles.getPropertyValue("--text-primary").trim();
  const surface = styles.getPropertyValue("--surface").trim();

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [fern200, fern500, textStrong],
        borderColor: surface,
        borderWidth: 1,
      },
    ],
  };

  // HUOM: ei TypeScript-tyypitystä .js-tiedostossa
  const options = {
    responsive: true,
    maintainAspectRatio: false, // tärkein rivi responsiivisuuteen
    plugins: {
      legend: {
        position: "bottom", // mobiilissa selkeämpi
        labels: {
          color: textPrimary,
        },
      },
      tooltip: {
        bodyColor: textPrimary,
        titleColor: textPrimary,
      },
    },
  };

  // GenreChart.js
  return (
    <div className="space-y-4 w-full rounded-lg border border-(--border) bg-(--surface) p-4 sm:p-6 shadow-sm">
      <h2 className="mb-3 text-base sm:text-lg md:text-xl font-semibold text-(--text-strong)">
        Genrejakauma Uuden Musiikin X -soittolistalla
      </h2>

      <p className="mb-4 text-xs sm:text-sm md:text-base leading-relaxed text-(--text-primary)">
        Kaavio näyttää, kuinka monta kappaletta eri genreihin liitetään
        artistien Spotify-profiilien perusteella. Kukin kappale voi kuulua
        useampaan genreen. Kappale merkitään unknown, jos genreä ei ole
        asetettu.
      </p>

      {/* Wrapper: leveys 100 %, korkeus breakpointien mukaan */}
      <div className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] overflow-hidden">
        <Pie
          data={data}
          options={options}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
