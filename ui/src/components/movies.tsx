import _ from "lodash";
import { useState } from "react";
import MovieTable, { Genre, Movie } from "../movieTable";
import paginate from "../paginate";
import ListGroup from "./listGroup";
import Pagination from "./pagination";

function getMovies() {
  return _.range(0, 15).map((i) => {
    return {
      _id: String(i),
      title: `Title ${i}`,
      genre: { _id: String(i % 4), name: `Genre ${i % 4}` },
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

interface SortingColumn {
  column: String;
  order: String;
}

function Movies() {
  const [state, updateState] = useState({
    movies: getMovies() as Array<Movie>,
    genres: getGenres() as Array<Genre>,
    selectedGenre: "" as String,
    pageSize: 4,
    currentPage: 1,
    sortColumn: { column: "title", order: "asc" } as SortingColumn,
  });

  const likeForMovie = (movie: Movie) => () => {
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

  const deleteMovie = (movie: Movie) => () => {
    updateState({
      ...state,
      movies: state.movies.filter((m) => m !== movie),
    });
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

  const handleSorting = (field: String) => () => {
    console.log(field);
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
        <MovieTable
          movies={paginated}
          likeForMovie={likeForMovie}
          deleteMovie={deleteMovie}
          sortBy={handleSorting}
        />
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
