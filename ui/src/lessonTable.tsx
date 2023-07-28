import { Link } from "react-router-dom";
import Like from "./components/like";
import { Movie } from "./schemes";

export interface SortingColumn {
  column: String;
  order: boolean | "asc" | "desc";
}

function LessonTable(props: {
  lessons: Array<Movie>;
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
          <th onClick={sortBy("level")}>Level {renderSortIcon("level")}</th>
          <th onClick={sortBy("topic")}>Topic {renderSortIcon("topic")}</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.lessons.map((movie) => {
          return (
            <tr key={movie.id}>
              <td>
                <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
              </td>
              <td>{movie.genre.name}</td>
              <td>{movie.numberInStock}</td>
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

export default LessonTable;
