import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../config.json";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.resonse.status < 500;

  if (!expectedError) {
    console.log("Logging the error", error);
    toast.error("Unsexpected error");
  }
});

function Posts(props: {
  posts: Array<Post>;
  onUpdate: (post: Post) => () => void;
  onDelete: (post: Post) => () => void;
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
                <button
                  className="btn btn-danger btn-sm"
                  onClick={props.onDelete(post)}
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

function Blog() {
  const [state, setState] = useState<{ posts: Array<Post> }>({
    posts: [],
  });

  useEffect(() => {
    // Fetch the data
    (async () => {
      const response = await axios.get(config.apiurl);
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
      await axios.post(config.apiurl, {
        title: "ADDED",
        body: "NO BODY",
      })
    ).data;

    setState({
      ...state,
      posts: [post, ...state.posts],
    });
  };

  const handleUpdate = (post: Post) => async () => {
    const originalPosts = state.posts;
    const updated = { ...post, title: "UPDATED" };
    const posts = state.posts.map((p) => (p.id === post.id ? updated : p));
    setState({
      ...state,
      posts: posts,
    });

    try {
      // alternative:
      // await axios.patch(`${config.apiurl}/${post.id}`, { title: "updated" });
      await axios.put(`${config.apiurl}/x${post.id}`, updated);
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        if (ex.response && ex.response.status === 404) {
          toast.error("Somethign went wrong, can't upate the server");
        }
      }

      setState({
        ...state,
        posts: originalPosts,
      });
    }
  };

  const handleDelete = (post: Post) => async () => {
    await axios.delete(`${config.apiurl}/${post.id}`);
    setState({
      ...state,
      posts: state.posts.filter((p) => p.id !== post.id),
    });
  };

  return (
    <div className="col">
      <ToastContainer />
      <button className="btn btn-primary my-3" onClick={handleAdd}>
        Add
      </button>
      <Posts
        posts={state.posts}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
export default Blog;
