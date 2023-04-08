import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import http from "../auth";
import { User } from "../schemes";
import LessonPage from "./Lesson";
import Lessons from "./Lessons";
import Blog from "./blog";
import LoginForm from "./login";
import Movies from "./movies";
import NavBar from "./navbar";
import NewMovie from "./newMovie";
import RegisterForm from "./register";
import Products from "./sideBarDemo";
import UserList from "./users";

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
      const user = (await http.get("/users/me/"))?.data;
      setState((s) => {
        return {
          ...state,
          // @ts-ignore
          user: user,
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
      <ToastContainer />
      <div>
        <div className="content">
          <Routes>
            <Route path="/" element={protect(<Movies />)}></Route>
            <Route path="/movies/" element={protect(<Movies />)} />
            <Route path="/movies/new" element={protect(<NewMovie />)} />
            <Route path="/movies/:id?" element={protect(<MovieComponent />)} />
            <Route path="/users" element={protect(<UserList />)} />
            <Route path="/lesson/:id" element={protect(<LessonPage />)} />
            <Route path="/lessons" element={protect(<Lessons />)} />
            <Route path="/blog/" element={<Blog />} />
            <Route path="/products/*" element={<Products />} />
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
