import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import http from "./auth";
import LessonPage from "./components/Lesson";
import Lessons from "./components/Lessons";
import Blog from "./components/blog";
import LoginForm from "./components/login";
import Movies from "./components/movies";
import NavBar from "./components/navbar";
import NewLesson from "./components/newLesson";
import NewMovie from "./components/newMovie";
import Practice from "./components/practice";
import RegisterForm from "./components/register";
import UserList from "./components/users";
import MovieComponent from "./movieComponent";
import { User } from "./schemes";

function NotFound() {
  return (
    <div>
      <h1>Not found</h1>
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

function App() {
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
            <Route
              path="/lesson/:id/practice"
              element={protect(<Practice />)}
            />
            <Route path="/lessons" element={protect(<Lessons />)} />
            <Route path="/lessons/new" element={protect(<NewLesson />)} />
            <Route path="/blog/" element={<Blog />} />
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

export default App;
