import { Fragment, useState } from "react";
import Like from "./like";
import Pagination from "./pagination";

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
        if (c !== movie) {
          return c;
        }
        let newquery = { ...c };
        newquery.liked = !newquery.liked;
        return newquery;
      });
      updateMovies(newstate);
    };
  };

  const deleteMovie = (movie: Movie) => {
    return () => {
      updateMovies(movies.filter((m) => m !== movie));
    };
  };
  return (
    <Fragment>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Genere</th>
            <th>Stock</th>
            <th>Rate</th>
            <th></th>
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
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={deleteMovie(movie)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination itemCount={movies.length} pageSize={4} />
    </Fragment>
  );
}

export default Movies;
