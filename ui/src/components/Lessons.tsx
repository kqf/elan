import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import http from "../auth";
import ListGroup from "./listGroup";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.resonse.status < 500;

  if (!expectedError) {
    toast.error("Unexpected error");
  }
});

export default function Lessons() {
  const navigate = useNavigate();
  const [state, updateState] = useState([] as Array<any>);
  useEffect(() => {
    // Fetch the data
    (async () => {
      const response = await http.get("/lessons/", () => {
        navigate("/login");
      });
      updateState(response?.data);
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={[
              { name: "a", id: "1" },
              { name: "b", id: "2" },
            ].map((item) => item)}
            onClick={(arg0) => () => {}}
            selectedItem={"a"}
          />
        </div>

        <div className="col">
          <ToastContainer />
          <div className="col my-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate("/lessons/new");
              }}
            >
              New Lesson
            </button>
          </div>

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
      </div>
    </div>
  );
}
