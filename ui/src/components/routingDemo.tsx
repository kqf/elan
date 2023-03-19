import axios from "axios";
import _ from "lodash";
import { useEffect, useState } from "react";
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
import tokenHeader from "../auth";
import { User } from "../schemes";
import AuthDemo from "./authDemo";
import Blog from "./blog";
import LoginForm from "./login";
import AppMenu from "./menuComponent";
import Movies from "./movies";
import NavBar from "./navbar";
import NewMovie from "./newMovie";
import RegisterForm from "./register";
import UserList from "./users";

function SideBar() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/products/old">Old</Link>
        </li>
        <li>
          <Link to="/products/new">New</Link>
        </li>
      </ul>
    </div>
  );
}

function Product(props: { state: string }) {
  return <h2>This is {props.state} section</h2>;
}

function Products(props: any) {
  return (
    <div>
      <h1>These are the product options</h1>
      <SideBar />
      <Routes>
        <Route path="old" element={<Product state={"old"} />} />
        <Route path="new" element={<Product state={"new"} />} />
      </Routes>
    </div>
  );
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
  const [searchParams] = useSearchParams();
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

type MovieParams = {
  id: string;
};

function MovieComponent() {
  const params = useParams<MovieParams>();
  const navigate = useNavigate();
  return (
    <div>
      <h1>This is movie {params.id}</h1>
      <button
        className="btn btn-primary"
        onClick={() => navigate("/", { replace: true })}
      >
        Save
      </button>
    </div>
  );
}

function Protect({
  isAuthenticated,
  children,
}: {
  isAuthenticated: any;
  children: JSX.Element;
}) {
  if (isAuthenticated) {
    return children;
  } else {
    return <Navigate to={{ pathname: "/login" }} />;
  }
}

function SinglePageApp() {
  const [state, setState] = useState<{ user?: User }>({});
  useEffect(() => {
    // Fetch the data
    (async () => {
      const header = tokenHeader();
      if (header === null) return;
      const response = await axios.get("/users/me/", { headers: header });
      setState((s) => {
        return {
          ...state,
          // @ts-ignore
          user: response.data,
        };
      });
    })();
    // eslint-disable-next-line
  }, []);

  const protect = (x: JSX.Element) => {
    return (
      <Protect isAuthenticated={localStorage.getItem("accessToken")}>
        {x}
      </Protect>
    );
  };

  return (
    <BrowserRouter>
      <NavBar user={state?.user} />
      <div>
        <div className="content">
          <Routes>
            <Route path="/" element={protect(<Movies />)}></Route>
            <Route path="/movies/" element={protect(<Movies />)} />
            <Route path="/movies/new" element={protect(<NewMovie />)} />
            <Route path="/movies/:id?" element={protect(<MovieComponent />)} />
            <Route path="/users" element={protect(<UserList />)} />
            <Route path="/blog/" element={<Blog />} />
            <Route path="/products/*" element={<Products />} />
            <Route path="/posts/:year?/:id?" element={<Posts />} />
            <Route path="/auth" element={<AuthDemo />} />
            <Route path="/calc" element={<AppMenu />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default SinglePageApp;
