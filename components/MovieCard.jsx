"use client";

import Image from "next/image";
import Link from "next/link";

const MovieCard = ({
  movie: {
    id,
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
  },
}) => {
  return (
    <Link
      href={`/movie/${id}`}
      prefetch={true}
      className="movie-card block group cursor-pointer hover:scale-105 transition-transform duration-200"
    >
      <Image
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : "/H4.png"
        }
        alt={title}
        width={500}
        height={750}
        className="group-hover:brightness-90 transition-all duration-200 rounded-lg h-auto w-full"
      />
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <Image src="/star.svg" alt="Rating" width={16} height={16} />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>
          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
