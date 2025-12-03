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

  const styles = getComputedStyle(document.documentElement);
  const fern200 = styles.getPropertyValue("--border").trim();
  const fern500 = styles.getPropertyValue("--accent").trim();
  const textStrong = styles.getPropertyValue("--muted").trim();
  const textPrimary = styles.getPropertyValue("--text-primary").trim();

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [fern200, fern500, textStrong],
        borderColor: styles.getPropertyValue("--surface").trim(),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: textPrimary,
        },
      },
    },
  };

  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-(--border) bg-(--surface) p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-(--text-strong)">
        Genrejakauma Uuden Musiikin X -soittolistalla
      </h2>
      <p className="mb-4 text-sm text-(--text-primary)">
        Kaavio näyttää, kuinka monta kappaletta eri genreihin liitetään
        artistien Spotify-profiilien perusteella. Kukin kappale voi kuulua
        useampaan genreen. Kappale merkitään unknown, jos genreä ei ole
        asetettu.
      </p>
      <Pie data={data} options={options} />
    </div>
  );
}
