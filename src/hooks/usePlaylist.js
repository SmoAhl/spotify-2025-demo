import { useEffect, useMemo, useState } from "react";
import { sortTracks } from "@/lib/trackHelper";

const PAGE_SIZE = 10;
const MAX_TRACKS = 50;

export function usePlaylist() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState(null); // "title" | "artists" | "album" | "duration"
  const [sortDirection, setSortDirection] = useState("none"); // "asc" | "desc"

  // Spotify API -haku
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

  // Resetoi sivu, jos kappalemäärä muuttuu
  useEffect(() => {
    setPage(0);
  }, [tracks.length]);

  // Genretilasto + "unknown"
  const genreStats = useMemo(() => {
    if (!Array.isArray(tracks) || tracks.length === 0) return [];

    const counts = new Map(); // genre -> lukumäärä

    for (const track of tracks) {
      const rawGenres = Array.isArray(track.genres) ? track.genres : [];
      const genresToUse = rawGenres.length > 0 ? rawGenres : ["unknown"];

      for (const g of genresToUse) {
        const key = (g && g.trim().length > 0 ? g : "unknown").toLowerCase();
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);
  }, [tracks]);

  // Lajittelu
  const sortedTracks = useMemo(
    () => sortTracks(tracks, sortKey, sortDirection),
    [tracks, sortKey, sortDirection]
  );

  // Sivutus
  const totalPages = useMemo(() => {
    if (sortedTracks.length === 0) return 0;
    return Math.ceil(sortedTracks.length / PAGE_SIZE);
  }, [sortedTracks.length]);

  const startIndex = page * PAGE_SIZE;
  const pageTracks = sortedTracks.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePrevPage = () => setPage((prev) => Math.max(0, prev - 1));

  const handleNextPage = () =>
    setPage((prev) => {
      const lastPage = Math.max(totalPages - 1, 0);
      return Math.min(lastPage, prev + 1);
    });

  const handleSortChange = (columnKey) => {
    setPage(0);

    // Laske seuraava tila nykyisestä sortKey + sortDirection -tilasta
    let nextKey = sortKey;
    let nextDir = sortDirection;

    if (sortKey !== columnKey) {
      // Uusi sarake -> aloita nousevasta
      nextKey = columnKey;
      nextDir = "asc";
    } else {
      // Sama sarake -> kierto: none -> asc -> desc -> none
      if (sortDirection === "asc") {
        nextDir = "desc";
      } else if (sortDirection === "desc") {
        nextKey = null; // takaisin default: ei sorttia
        nextDir = "none";
      } else {
        // "none" -> "asc"
        nextDir = "asc";
      }
    }

    setSortKey(nextKey);
    setSortDirection(nextDir);
  };

  return {
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
  };
}
