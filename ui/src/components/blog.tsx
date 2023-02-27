

function Posts(props: {
    posts: Array<any>;
  }) {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {/* {props.posts.map((movie) => {
            return (
              <tr key={movie._id}>
                <td>
                  <Link to={`/posts/${movie._id}`}>{movie.title}</Link>
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
          })} */}
        </tbody>
      </table>
    );
  }


function Blog () {
  return (
      <div className="col">
        <button
          className="btn btn-primary my-3"
          onClick={() => {
            console.log("Clicked")
          }}
        >
          Add
        </button>
        <Posts posts={[]}/>
      </div>
  );
}
export default Blog;
