interface Post {
    userId: number,
    id: number,
    title: string,
    body: string,
}


function Posts(props: {
    posts: Array<Post>;
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
          {props.posts.map((post) => {
            return (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
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
