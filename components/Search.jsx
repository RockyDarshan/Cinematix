"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Search = ({ searchTerm, setSearchTerm, skipMovieFetch }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skipFetch, setSkipFetch] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (skipFetch) {
      setSkipFetch(false);
      return;
    }

    const fetchSuggestions = async () => {
      if (!searchTerm || searchTerm.trim().length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchTerm)}&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDM_API_KEY}`,
            },
          },
        );
        const data = await res.json();
        setSuggestions(data.results?.slice(0, 6) || []);
        setShowDropdown(true);
      } catch (err) {
        console.log("Suggestions fetch failed:", err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (movie) => {
    setSkipFetch(true);
    if (skipMovieFetch) skipMovieFetch.current = true;
    setShowDropdown(false);
    setSuggestions([]);
    setSearchTerm("");
    router.push(`/movie/${movie.id}`);
  };

  return (
    <div className="search" ref={dropdownRef}>
      <div>
        <Image src="/search.svg" alt="Search Icon" width={20} height={20} />
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          onKeyDown={(e) => e.key === "Escape" && setShowDropdown(false)}
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-dark-100 border border-light-100/10 rounded-xl overflow-hidden shadow-2xl z-999">
          {suggestions.map((movie) => (
            <li
              key={movie.id}
              onClick={() => handleSuggestionClick(movie)}
              className="flex items-center justify-between px-4 py-3 hover:bg-light-100/5 cursor-pointer transition-colors border-b border-light-100/5 last:border-0"
            >
              <div className="min-w-0 flex-1 flex flex-col">
                <p className="text-white text-sm font-medium truncate">
                  {movie.title}
                </p>
                <p className="text-gray-100 text-xs">
                  {movie.release_date?.split("-")[0] || "N/A"}
                  {movie.vote_average > 0 && (
                    <span className="ml-2 text-amber-400">
                      ★ {movie.vote_average.toFixed(1)}
                    </span>
                  )}
                </p>
              </div>
              <svg
                className="w-4 h-4 text-gray-100 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
