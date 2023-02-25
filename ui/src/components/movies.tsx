import _ from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Genre, Movie } from "../fakeBackend";
import MovieTable, { SortingColumn } from "../movieTable";
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

function Movies() {
  const [state, updateState] = useState({
    movies: getMovies() as Array<Movie>,
    genres: getGenres() as Array<Genre>,
    search: "" as string,
    selectedGenre: "" as String,
    pageSize: 4,
    currentPage: 1,
    sortColumn: { column: "title", order: "asc" } as SortingColumn,
  });
  const navigate = useNavigate();

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

  const handleSorting = (column: SortingColumn) => {
    updateState({
      ...state,
      sortColumn: column,
    });
  };

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    updateState({
      ...state,
      search: event.currentTarget.value,
      selectedGenre: "",
    });
  };

  const filteredByGenre = state.movies.filter(
    (movie) =>
      state.selectedGenre === movie.genre.name || state.selectedGenre === ""
  );
  const filteredBySearch = filteredByGenre.filter(
    (movie) =>
      movie.title.toLowerCase().startsWith(state.search) || state.search === ""
  );

  const sorted: Array<Movie> = _.orderBy(
    filteredBySearch as Array<Movie>,
    state.sortColumn.column,
    state.sortColumn.order
  ) as Array<Movie>;

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
        <button
          className="btn btn-primary"
          onClick={() => {
            navigate("/movies/new", {
              state: {
                onSubmit: (movie: Movie) => {
                  updateState({
                    ...state,
                    movies: [...state.movies, movie],
                  });
                },
                payload: "Hello world",
              },
            });
          }}
        >
          New Movie
        </button>

        <input
          className="form-control"
          name="search"
          placeholder={"Search for movies ..."}
          onChange={handleSearch}
        />

        <MovieTable
          movies={paginated}
          likeForMovie={likeForMovie}
          deleteMovie={deleteMovie}
          onSort={handleSorting}
          sortingBy={state.sortColumn}
        />
        <Pagination
          itemCount={filteredByGenre.length}
          pageSize={state.pageSize}
          currentPage={state.currentPage}
          onClick={switchPage}
        />
      </div>
    </div>
  );
}

export default Movies;
