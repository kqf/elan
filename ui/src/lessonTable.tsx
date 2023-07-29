import { Link } from "react-router-dom";
import Like from "./components/like";
import { Lesson } from "./schemes";

export interface SortingColumn {
  column: String;
  order: boolean | "asc" | "desc";
}

function LessonTable(props: {
  lessons: Array<Lesson>;
  likeForMovie: (arg0: Lesson) => () => void;
  deleteMovie: (arg0: Lesson) => () => void;
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
        {props.lessons.map((lesson) => {
          return (
            <tr key={lesson.id}>
              <td>
                <Link to={`/movies/${lesson.id}`}>{lesson.title}</Link>
              </td>
              <td>{lesson.level}</td>
              <td>{lesson.topic}</td>
              <td>
                <Like liked={true} onClick={props.likeForMovie(lesson)} />
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={props.deleteMovie(lesson)}
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
