import { Link } from "react-router-dom";
import Like from "./components/like";
export interface Movie {
  id: string;
  title: string;
  genre: Genre;
  numberInStock: number;
  dailyRentalRate: number;
  publishDate: string;
  liked: boolean;
}
export interface Genre {
  id: string;
  name: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: Genre;
  numberInStock: number;
  dailyRentalRate: number;
  publishDate: string;
  liked: boolean;
}

export interface SortingColumn {
  column: String;
  order: boolean | "asc" | "desc";
}

function MovieTable(props: {
  movies: Array<Movie>;
  likeForMovie: (arg0: Movie) => () => void;
  deleteMovie: (arg0: Movie) => () => void;
  onSort: (column: SortingColumn) => void;
  sortingBy: SortingColumn;
}) {
  const sortBy = (field: String) => () => {
    let order = "asc" as "asc" | "desc";
    if (props.sortingBy.column === field && props.sortingBy.order === "asc") {
      order = "desc";
    }
    if (props.sortingBy.column === field && props.sortingBy.order === "desc") {
      order = "asc";
    }

    props.onSort({ column: field, order: order });
  };

  const renderSortIcon = (field: String) => {
    if (field !== props.sortingBy.column) {
      return null;
    }
    if (props.sortingBy.order === "asc")
      return <i className="fa fa-sort-asc" />;
    return <i className="fa fa-sort-desc" />;
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th onClick={sortBy("title")}>Title {renderSortIcon("title")}</th>
          <th onClick={sortBy("genre.name")}>
            Genere {renderSortIcon("genre.name")}
          </th>
          <th onClick={sortBy("numberInStock")}>
            Stock {renderSortIcon("numberInStock")}
          </th>
          <th onClick={sortBy("dailyRentalRate")}>
            Rate {renderSortIcon("dailyRentalRate")}
          </th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.movies.map((movie) => {
          return (
            <tr key={movie.id}>
              <td>
                <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
              </td>
              <td>{movie.genre.name}</td>
              <td>{movie.numberInStock}</td>
              <td>{movie.dailyRentalRate}</td>
              <td>
                <Like liked={movie.liked} onClick={props.likeForMovie(movie)} />
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={props.deleteMovie(movie)}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default MovieTable;
