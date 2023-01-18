import _ from "lodash";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import AuthDemo from "./authDemo";
import AppMenu from "./menuComponent";
import Movies from "./movies";

function Products(props: any) {
  return <div>These are the products</div>;
}

type PostsParams = {
  id: string;
  year: string;
};

function Posts(props: any) {
  const params = useParams<PostsParams>();
  if (params.id !== undefined) return <div>This is a post {params.id}</div>;
  if (params.year !== undefined)
    return (
      <div>
        <ul>
          {_.range(+params.year).map((i) => {
            return (
              <li key={i}>
                <Link to={`/posts/${params.year}/${i}`}> Posts {i} </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );

  return (
    <div>
      <ul>
        {_.range(10).map((year) => {
          return (
            <li key={year}>
              <Link to={`/posts/${year}`}> Year {year} </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SinglePageApp() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/calc">Calculator</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/posts">Posts</Link>
            </li>
            <li>
              <Link to="/auth">Auth</Link>
            </li>
          </ul>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<Movies />} />
            <Route path="/products" element={<Products />} />
            <Route path="/posts/:year?/:id?" element={<Posts />} />
            <Route path="/auth" element={<AuthDemo />} />
            <Route path="/calc" element={<AppMenu />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default SinglePageApp;
