import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import tokenHeader from "../auth";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.resonse.status < 500;

  if (!expectedError) {
    console.log("Logging the error", error);
    toast.error("Unexpected error");
  }
}

export default function Lessons() {
  const navigate = useNavigate();
  const [state, updateState] = useState([] as Array<any>);
  useEffect(() => {
    // Fetch the data
    (async () => {
      const header = tokenHeader();
      if (header === null) {
        navigate("/login");
        return;
      }

      try {
        const lessons = (await axios.get("/lessons/", { headers: header }))
          .data;
        console.log("fetched ~", lessons);
        updateState(lessons);
      } catch (error) {
        toast.error("Ooops, something went wrong.");
        return;
      }
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <ToastContainer />
      <ul className="list-group">
        {state.map((u) => {
          return (
            <li key={u.id} className="list-group-item">
              <Link to={`/lesson/${u.id}`}>{u.title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
