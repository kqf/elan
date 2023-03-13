import axios from "axios";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Genre, Movie, User } from "../fakeBackend";
import MovieTable, { SortingColumn } from "../movieTable";
import paginate from "../paginate";
import ListGroup from "./listGroup";
import Pagination from "./pagination";

function UserList() {
  const [state, updateState] = useState([] as Array<User>);
  useEffect(() => {
    // Fetch the data
    (async () => {
      const users = (await axios.get("/users/")).data;
      updateState(users);
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <ul className="list-group">
        {state.map((u) => {
          return <li className="list-group-item">{u.username}</li>;
        })}
      </ul>
    </div>
  );
}

function Movies() {
  const [state, updateState] = useState({
    movies: [] as Array<Movie>,
    genres: [] as Array<Genre>,
    searchQuery: "" as string,
    selectedGenre: "" as String,
    pageSize: 4,
    currentPage: 1,
    sortColumn: { column: "title", order: "asc" } as SortingColumn,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the data
    (async () => {
      const genres = (await axios.get("/genres/")).data;
      const movies = (await axios.get("/movies/")).data;
      console.log(genres);
      console.log(movies);
      updateState((s) => {
        return {
          ...state,
          genres: genres,
          movies: movies,
        };
      });
    })();
    // eslint-disable-next-line
  }, []);

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
      searchQuery: event.currentTarget.value,
      selectedGenre: "",
      // This is needed to fix the issues with search
      currentPage: 1,
    });
  };

  const filteredByGenre = state.movies.filter(
    (movie) =>
      state.selectedGenre === movie.genre.name || state.selectedGenre === ""
  );
  const filteredBySearch = filteredByGenre.filter(
    (movie) =>
      movie.title.toLowerCase().startsWith(state.searchQuery) ||
      state.searchQuery === ""
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

        <div className="form-group">
          <input
            className="form-control my-3"
            name="search"
            placeholder={"Search for movies ..."}
            onChange={handleSearch}
          />
        </div>

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
        <UserList />
      </div>
    </div>
  );
}

export default Movies;
