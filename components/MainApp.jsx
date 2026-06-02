"use client";

import { useEffect, useState } from "react";
import Search from "./Search";
import Spinner from "./Spinner";
import MovieCard from "./MovieCard";
import AuthModal from "./AuthModal";
import UserMenu from "./UserMenu";
import { useDebounce } from "react-use";
import { useAuth } from "../contexts/AuthContext";
import { getTopSearches, updateSearchCount } from "../appwrite";
import Image from "next/image";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDM_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MainApp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { loading: authLoading, isAuthenticated } = useAuth();

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) throw new Error("Failed to fetch movies");

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        setErrorMessage("No movies found.");
        setMovies([]);
        return;
      }

      setMovies(data.results || []);

      if (query && data.results.length > 0 && isAuthenticated) {
        try {
          await updateSearchCount(query, data.results[0]);
          await loadTrendingMovies();
        } catch (error) {
          console.log("Failed to update search count:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    if (!isAuthenticated) return;
    try {
      const movies = await getTopSearches();
      setTrendingMovies(movies || []);
    } catch (error) {
      console.log("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (isAuthenticated) {
      loadTrendingMovies();
    } else {
      setTrendingMovies([]);
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="text-white mt-4">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper mt-1">
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center mb-4 mt-3">
          <div className="flex items-center space-x-4 ml-6">
            <h3 className="text-amber-400 font-stretch-50% font-sans font-bold text-4xl">
              🍿MovieVerse
            </h3>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-light-100/5 hover:bg-light-100/10 text-white rounded-lg transition-colors border border-light-100/20"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-linear-to-r from-[#FCD34D] to-[#F59E0B] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </nav>

        <header>
          <Image
            src="/hero-bg.png"
            alt="Hero Banner"
            width={500}
            height={400}
            className="transparent"
          />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {isAuthenticated && (
          <section className="trending">
            <div className="flex justify-between items-center mb-1.5">
              <h2>Your Trending Searches</h2>
              <p className="text-amber-200 text-sm">
                Based on your search history
              </p>
            </div>

            {trendingMovies.length > 0 ? (
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <Image
                      src={movie.poster_url}
                      alt={movie.searchTerm}
                      width={100}
                      height={150}
                      onError={(e) => {
                        e.target.src = "/H4.png";
                      }}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-yellow-500">No trending movies yet</p>
            )}
          </section>
        )}

        {!isAuthenticated && (
          <section className="mt-20">
            <div className="bg-light-100/5 border border-light-100/10 rounded-2xl p-8 text-center">
              <h2 className="text-white mb-4">
                Discover Your Next Favorite Movie
              </h2>
              <p className="text-gray-100 mb-6 max-w-2xl mx-auto">
                Sign up to get personalized movie recommendations, save your
                favorite searches, and see trending movies based on what you
                love most.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-3 bg-linear-to-r from-[#FCD34D] to-[#F59E0B] text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign Up for Free
              </button>
            </div>
          </section>
        )}

        <section className="all-movies mt-1.5">
          <h2>Popular Movies</h2>

          {loading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-400">{errorMessage}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </main>
  );
};

export default MainApp;
