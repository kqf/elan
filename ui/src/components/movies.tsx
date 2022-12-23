import { useState } from "react";


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
}

const movies: Array<Movie> = ["1", "2", "3", "4"].map((i) => {
  return {
    _id: i,
    title: `Title ${i}`,
    genre: { _id: i, name: `name ${i}` },
    numberInStock: i,
    dailyRentalRate: 1.5,
    publishDate: "2020-01-01",
  };
});

function getMovies() {
  return movies;
}

function Movies() {
  const [movies, updateMovies] = useState(getMovies());
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Genere</th>
          <th>Stock</th>
          <th>Rate</th>
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Movies;
