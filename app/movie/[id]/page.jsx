import Link from "next/link";
import MovieCard from "../../../components/MovieCard";
import Image from "next/image";

const API_BASE_URL = "https://api.themoviedb.org/3";

const getApiOptions = () => ({
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
  },
});

async function getMovieDetails(id) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/movie/${id}?append_to_response=credits,videos`,
      getApiOptions(),
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.log("Movie details fetch failed:", error.message);
    return null;
  }
}

async function getSimilarMovies(id) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/movie/${id}/similar?page=1`,
      getApiOptions(),
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results?.slice(0, 8) || [];
  } catch (error) {
    console.log("Similar movies fetch failed:", error.message);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);
  return {
    title: movie ? `${movie.title} — MovieVerse` : "Movie — MovieVerse",
    description: movie?.overview || "",
  };
}

export default async function MoviePage({ params }) {
  const { id } = await params;

  const [movie, similarMovies] = await Promise.all([
    getMovieDetails(id),
    getSimilarMovies(id),
  ]);

  if (!movie) {
    return (
      <main className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-4xl mb-4">Movie not found</p>
          <Link
            href="/"
            className="px-6 py-3 bg-linear-to-r from-[#FCD34D] to-[#F59E0B] text-black font-bold rounded-lg"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube",
  );

  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  const writers =
    movie.credits?.crew
      ?.filter((c) => c.job === "Writer" || c.job === "Screenplay")
      .slice(0, 2) || [];
  const topCast = movie.credits?.cast?.slice(0, 10) || [];

  const hours = Math.floor((movie.runtime || 0) / 60);
  const minutes = (movie.runtime || 0) % 60;
  const runtime = movie.runtime ? `${hours}h ${minutes}m` : "N/A";

  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
  const releaseYear = movie.release_date?.split("-")[0] || "N/A";

  return (
    <main className="min-h-screen bg-primary">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-5 pt-6 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-light-200 hover:text-white transition-colors group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Movies
        </Link>
      </div>

      {/* Backdrop Hero */}
      <div className="relative">
        {movie.backdrop_path && (
          <div className="absolute inset-0 h-130 overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-linear-to-b from-primary/30 via-primary/75 to-primary" />
          </div>
        )}

        {/* Poster + Info */}
        <div className="relative max-w-7xl mx-auto px-5 pt-14 pb-10 flex flex-col md:flex-row gap-8 md:gap-12 items-end">
          {/* Poster */}
          <div className="shrink-0 mx-auto md:mx-0">
            <Image
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/.png"
              }
              alt={movie.title}
              width={256}
              height={384}
              className="w-52 md:w-64 rounded-2xl shadow-2xl shadow-black/70 ring-1 ring-white/10"
            />
          </div>

          {/* Text Details */}
          <div className="flex flex-col gap-4 text-center md:text-left flex-1">
            {/* Genres */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 text-xs font-semibold bg-light-100/10 border border-light-100/20 text-light-100 rounded-full"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-left">
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-light-200 italic text-base md:text-lg">
                "{movie.tagline}"
              </p>
            )}

            {/* Meta pills */}
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start text-sm">
              <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1.5 rounded-full">
                <Image src="/star.svg" alt="Rating" width={16} height={16} />
                <span className="text-yellow-300 font-bold">
                  {movie.vote_average?.toFixed(1) || "N/A"}
                </span>
                <span className="text-gray-100 text-xs">/ 10</span>
              </div>
              <span className="text-gray-100 text-xs">
                ({movie.vote_count?.toLocaleString()} votes)
              </span>
              <span className="text-gray-100">•</span>
              <span className="text-gray-100">{releaseYear}</span>
              <span className="text-gray-100">•</span>
              <span className="text-gray-100">{runtime}</span>
              <span className="text-gray-100">•</span>
              <span className="uppercase text-gray-100 font-medium">
                {movie.original_language}
              </span>
              {movie.adult && (
                <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/40 text-red-400 rounded text-xs font-bold">
                  18+
                </span>
              )}
            </div>

            {/* Overview */}
            <p className="text-light-200 leading-relaxed text-sm md:text-base max-w-2xl">
              {movie.overview}
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              {director && (
                <div className="bg-light-100/5 border border-light-100/10 rounded-xl p-3">
                  <p className="text-gray-100 text-xs uppercase tracking-wider mb-1">
                    Director
                  </p>
                  <p className="text-white text-sm font-semibold">
                    {director.name}
                  </p>
                </div>
              )}
              {writers.length > 0 && (
                <div className="bg-light-100/5 border border-light-100/10 rounded-xl p-3">
                  <p className="text-gray-100 text-xs uppercase tracking-wider mb-1">
                    Writer
                  </p>
                  <p className="text-white text-sm font-semibold">
                    {writers[0].name}
                  </p>
                </div>
              )}
              {movie.budget > 0 && (
                <div className="bg-light-100/5 border border-light-100/10 rounded-xl p-3">
                  <p className="text-gray-100 text-xs uppercase tracking-wider mb-1">
                    Budget
                  </p>
                  <p className="text-white text-sm font-semibold">
                    ${(movie.budget / 1_000_000).toFixed(0)}M
                  </p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div className="bg-light-100/5 border border-light-100/10 rounded-xl p-3">
                  <p className="text-gray-100 text-xs uppercase tracking-wider mb-1">
                    Box Office
                  </p>
                  <p className="text-white text-sm font-semibold">
                    ${(movie.revenue / 1_000_000).toFixed(0)}M
                  </p>
                </div>
              )}
              <div className="bg-light-100/5 border border-light-100/10 rounded-xl p-3">
                <p className="text-gray-100 text-xs uppercase tracking-wider mb-1">
                  Release
                </p>
                <p className="text-white text-sm font-semibold">
                  {releaseDate}
                </p>
              </div>
              {movie.status && (
                <div className="bg-light-100/5 border border-light-100/10 rounded-xl p-3">
                  <p className="text-gray-100 text-xs uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <p className="text-white text-sm font-semibold">
                    {movie.status}
                  </p>
                </div>
              )}
            </div>

            {/* Trailer CTA */}
            {trailer && (
              <div className="mt-1">
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#FCD34D] to-[#F59E0B] text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Trailer
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cast */}
      {topCast.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 py-10 border-t border-light-100/10">
          <h2 className="text-2xl font-bold text-white mb-6">Top Cast</h2>
          <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-3">
            {topCast.map((actor) => (
              <div
                key={actor.cast_id ?? actor.id}
                className="shrink-0 w-28 text-center"
              >
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-dark-100 border-2 border-light-100/10 mb-2">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : "/H4.png"
                    }
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                  {actor.name}
                </p>
                <p className="text-gray-100 text-xs mt-0.5 line-clamp-1 italic">
                  {actor.character}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Production Companies */}
      {movie.production_companies?.some((c) => c.logo_path) && (
        <section className="max-w-7xl mx-auto px-5 pb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Production</h2>
          <div className="flex flex-wrap gap-3">
            {movie.production_companies
              .filter((c) => c.logo_path)
              .map((company) => (
                <div
                  key={company.id}
                  className="flex items-center gap-2 bg-white/5 border border-light-100/10 rounded-xl px-4 py-2"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                    alt={company.name}
                    className="h-5 object-contain brightness-200 invert"
                  />
                  <span className="text-light-200 text-sm">{company.name}</span>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Similar Movies Footer */}
      {similarMovies.length > 0 && (
        <footer className="border-t border-light-100/10 bg-dark-100/40 mt-6">
          <div className="max-w-7xl mx-auto px-5 py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Similar Movies</h2>
              <Link
                href="/"
                className="text-sm text-light-200 hover:text-white transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {similarMovies.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </div>
        </footer>
      )}
    </main>
  );
}
