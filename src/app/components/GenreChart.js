"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

/**
 * Generoi dynaaminen vihertävä väripaletti
 * niin, että värien määrä = count.
 */
function generateColors(count) {
  const colors = [];

  for (let i = 0; i < count; i++) {
    // Jakaa sävyt tasaisesti 200 asteen kaarella vihreän ympärillä
    const hue = (130 + (200 * i) / Math.max(count, 1)) % 360;
    const saturation = 70; // 0–100
    const lightness = 30 + (i % 3) * 10; // 30, 40, 50 -> vähän vaihtelua

    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
}

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

  // generoidaan yhtä monta väriä kuin on genrejä
  const colors = generateColors(labels.length);

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors,
        borderColor: "#022c22", // tumma vihreä reuna (voit säätää)
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
          color: "#f9fafb", // vaalea teksti legendassa
        },
      },
      tooltip: {
        bodyColor: "#f9fafb",
        titleColor: "#f9fafb",
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
