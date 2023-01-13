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
      title: `Title ${15 - i}`,
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
  order: boolean | "asc" | "desc";
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
    let order = "asc" as "asc" | "desc";
    if (state.sortColumn.column === field && state.sortColumn.order === "asc") {
      order = "desc";
    }
    if (
      state.sortColumn.column === field &&
      state.sortColumn.order === "desc"
    ) {
      order = "asc";
    }
    console.log("Before", field, state.sortColumn);
    updateState({
      ...state,
      sortColumn: { column: field, order: order },
    });
    console.log("After", field, state.sortColumn);
  };

  const filtered = state.movies.filter(
    (movie) =>
      state.selectedGenre === movie.genre.name || state.selectedGenre === ""
  );
  const sorted: Array<Movie> = _.orderBy(
    filtered as Array<Movie>,
    state.sortColumn.column,
    state.sortColumn.order
  ) as Array<Movie>;
  console.log(sorted);

  const paginated = paginate(sorted, state.currentPage, state.pageSize);

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
