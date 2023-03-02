import axios from "axios";
import { useEffect, useState } from "react";

const apiurl = "https://jsonplaceholder.typicode.com/posts";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function Posts(props: {
  posts: Array<Post>;
  onUpdate: (post: Post) => () => void;
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
                  onClick={props.onUpdate(post)}
                >
                  Update
                </button>
              </td>
              <td>
                <button className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Blog() {
  const [state, setState] = useState({
    posts: [],
  });

  useEffect(() => {
    // Fetch the data
    (async () => {
      const response = await axios.get(apiurl);
      setState((s) => {
        return {
          ...state,
          posts: response.data,
        };
      });
    })();
    // eslint-disable-next-line
  }, []);

  const handleAdd = async () => {
    const post = (
      await axios.post(apiurl, {
        title: "ADDED",
        body: "NO BODY",
      })
    ).data;

    setState({
      ...state,
      // @ts-ignore
      posts: [post, ...state.posts],
    });
  };

  const handleUpdate = (post: Post) => async () => {
    post.title = "UPDATED";
    // alternative:
    // const added = (await axios.patch(`${apiurl}/${post.id}`, {title: "updated"})).data;
    const added = (await axios.put(`${apiurl}/${post.id}`, post)).data;
    var posts = [...state.posts];
    // @ts-ignore
    posts[posts.indexOf[post]] = added;
    console.log(added);
    setState({
      ...state,
      posts: posts,
    });
  };

  return (
    <div className="col">
      <button className="btn btn-primary my-3" onClick={handleAdd}>
        Add
      </button>
      <Posts posts={state.posts} onUpdate={handleUpdate} />
    </div>
  );
}
export default Blog;
