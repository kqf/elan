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
    const originalPosts = state.posts;
    const updated = { ...post, title: "UPDATED" };
    // @ts-ignore
    const posts = state.posts.map((p) => (p.id === post.id ? updated : p));
    setState({
      ...state,
      // @ts-ignore
      posts: posts,
    });

    try {
      // alternative:
      // await axios.patch(`${apiurl}/${post.id}`, { title: "updated" });
      await axios.put(`${apiurl}/${post.id}`, updated);
    } catch (ex) {
      alert("Somethign went wrong, can't upate the server");
      setState({
        ...state,
        posts: originalPosts,
      });
    }
  };

  const handleDelete = (post: Post) => async () => {
    await axios.delete(`${apiurl}/${post.id}`);
    setState({
      ...state,
      // @ts-ignore
      posts: state.posts.filter((p) => p.id !== post.id),
    });
  };

  return (
    <div className="col">
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
