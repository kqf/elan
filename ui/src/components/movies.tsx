import { useState } from "react";
import Like from "./like";

interface Genre {
  _id: string;
  name: string;
}

interface Movie {
  _id: string;
  title: string;
  genre: Genre;
  numberInStock: string;
  dailyRentalRate: number;
  publishDate: string;
  liked: boolean;
}

const movies: Array<Movie> = ["1", "2", "3", "4"].map((i) => {
  return {
    _id: i,
    title: `Title ${i}`,
    genre: { _id: i, name: `name ${i}` },
    numberInStock: i,
    dailyRentalRate: 1.5,
    publishDate: "2020-01-01",
    liked: false,
  };
});

function getMovies() {
  return movies;
}

function Movies() {
  const [movies, updateMovies] = useState(getMovies() as Array<Movie>);

  const likeForMovie = (movie: Movie) => {
    return () => {
      const newstate = movies.map((c) => {
        if (movie !== c) {
          return movie;
        }
        let newquery = { ...c };
        newquery.liked = !newquery.liked;
        return newquery;
      });
      updateMovies(newstate);
    };
  };
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Genere</th>
          <th>Stock</th>
          <th>Rate</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {movies.map((movie) => {
          return (
            <tr>
              <td>{movie.title}</td>
              <td>{movie.genre.name}</td>
              <td>{movie.numberInStock}</td>
              <td>{movie.dailyRentalRate}</td>
              <td>
                <Like liked={movie.liked} onClick={likeForMovie(movie)} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Movies;
