import _ from "lodash";
import { useState } from "react";
import paginate from "../paginate";
import Like from "./like";
import ListGroup from "./listGroup";
import Pagination from "./pagination";

interface Genre {
  _id: string;
  name: string;
}

interface Movie {
  _id: string;
  title: string;
  genre: Genre;
  numberInStock: number;
  dailyRentalRate: number;
  publishDate: string;
  liked: boolean;
}

function getMovies() {
  return _.range(0, 15).map((i) => {
    return {
      _id: String(i),
      title: `Title ${i}`,
      genre: { _id: String(i % 4), name: `Gnr ${i % 4}` },
      numberInStock: i,
      dailyRentalRate: 1.5,
      publishDate: "2020-01-01",
      liked: false,
    };
  });
}

function getGenres() {
  const movies = getMovies();
  const genrelist = movies.map((c) => c.genre);
  return _.uniqBy(genrelist, "name");
}

function Movies() {
  const [state, updateState] = useState({
    movies: getMovies() as Array<Movie>,
    genres: getGenres() as Array<Genre>,
    selectedGenre: "" as String,
    pageSize: 4,
    currentPage: 1,
  });

  const likeForMovie = (movie: Movie) => {
    return () => {
      const newstate = state.movies.map((c) => {
        if (c !== movie) {
          return c;
        }
        let newquery = { ...c };
        newquery.liked = !newquery.liked;
        return newquery;
      });
      updateState({ ...state, movies: newstate });
    };
  };

  const deleteMovie = (movie: Movie) => {
    return () => {
      updateState({
        ...state,
        movies: state.movies.filter((m) => m !== movie),
      });
    };
  };

  const switchPage = (page: number) => () => {
    updateState({
      ...state,
      currentPage: page,
    });
  };

  const handleGenreChange = (genre: String) => () => {
    const selectedGenre = genre !== state.selectedGenre ? genre : "";

    updateState({
      ...state,
      selectedGenre: selectedGenre,
      currentPage: 1,
    });
  };

  const filtered = state.movies.filter(
    (movie) =>
      state.selectedGenre === movie.genre.name || state.selectedGenre === ""
  );
  const paginated = paginate(filtered, state.currentPage, state.pageSize);

  return (
    <div className="row">
      <div className="col-3">
        <ListGroup
          items={state.genres.map((item) => item)}
          onClick={handleGenreChange}
          selectedItem={state.selectedGenre}
        />
      </div>
      <div className="col">
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
            {paginated.map((movie) => {
              return (
                <tr key={movie._id}>
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
        <Pagination
          itemCount={filtered.length}
          pageSize={state.pageSize}
          currentPage={state.currentPage}
          onClick={switchPage}
        />
      </div>
    </div>
  );
}

export default Movies;
