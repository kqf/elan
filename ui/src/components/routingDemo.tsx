import _ from "lodash";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import AuthDemo from "./authDemo";
import AppMenu from "./menuComponent";
import Movies from "./movies";
import NavBar from "./navbar";

function Products(props: any) {
  return <div>These are the products</div>;
}

type PostsParams = {
  id: string;
  year: string;
};

function PostDetails(props: { id: String }) {
  const navigate = useNavigate();
  const handleSave = () => {
    navigate("/posts", { replace: true });
  };
  return (
    <div>
      <h1>This is a post {props.id}</h1>
      <button onClick={handleSave}>Add to read</button>
    </div>
  );
}

function RawPosts(props: any) {
  const params = useParams<PostsParams>();
  if (params.id !== undefined) return <PostDetails id={params.id} />;
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

function Posts(props: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const author = searchParams.get("author");
  const language = searchParams.get("language");
  let explanation = null;
  if (author !== null) {
    explanation = (
      <div>
        The author {author} {language !== null ? `written in ${language}` : ""}
      </div>
    );
  }

  return (
    <div>
      <RawPosts />
      {explanation}
    </div>
  );
}

function NotFound() {
  return (
    <div>
      <h1>Not found</h1>
    </div>
  );
}

function SinglePageApp() {
  return (
    <BrowserRouter>
      <NavBar />
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
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default SinglePageApp;
