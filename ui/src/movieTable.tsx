import Like from "./components/like";

export interface Genre {
  _id: string;
  name: string;
}

export interface Movie {
  _id: string;
  title: string;
  genre: Genre;
  numberInStock: number;
  dailyRentalRate: number;
  publishDate: string;
  liked: boolean;
}

function MovieTable(props: {
  movies: Array<Movie>;
  likeForMovie: (arg0: Movie) => () => void;
  deleteMovie: (arg0: Movie) => () => void;
  sortBy: (arg0: String) => () => void;
}) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th onClick={props.sortBy("title")}>Title</th>
          <th onClick={props.sortBy("genre")}>Genere</th>
          <th onClick={props.sortBy("stock")}>Stock</th>
          <th onClick={props.sortBy("rate")}>Rate</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.movies.map((movie) => {
          return (
            <tr key={movie._id}>
              <td>{movie.title}</td>
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
