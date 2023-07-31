import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import http from "../auth";
import LessonTable, { SortingColumn } from "../lessonTable";
import { Lesson } from "../schemes";
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
  const [state, updateState] = useState({
    lessons: [] as Array<Lesson>,
    selectedLevel: "" as string,
    selectedTopic: "" as string,
    searchQuery: "" as string,
    pageSize: 4,
    currentPage: 1,
    sortColumn: { column: "title", order: "asc" } as SortingColumn,
  });

  useEffect(() => {
    // Fetch the data
    (async () => {
      const response = await http.get("/lessons/", () => {
        navigate("/login");
      });
      updateState({
        ...state,
        lessons: response?.data,
      });
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-3">
          <div className="col my-3">
            <ListGroup
              items={[
                { name: "a", id: "1" },
                { name: "b", id: "2" },
              ].map((item) => item)}
              onClick={(arg0) => () => {}}
              selectedItem={state.selectedLevel}
              title={"Level"}
            />
            <div className="col my-3">
              <ListGroup
                items={[
                  { name: "a", id: "1" },
                  { name: "b", id: "2" },
                ].map((item) => item)}
                onClick={(arg0) => () => {}}
                selectedItem={state.selectedTopic}
                title={"Topic"}
              />
            </div>
          </div>
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
          <div className="form-group">
            <input
              className="form-control my-3"
              name="search"
              placeholder={"Search for lessons ..."}
              onChange={() => {}}
            />
          </div>

          <LessonTable
            lessons={state.lessons}
            likeLesson={(arg0: Lesson) => () => {}}
            deleteLesson={(arg0: Lesson) => () => {}}
            onSort={(column: SortingColumn) => {}}
            sortingBy={{ column: "title", order: "asc" }}
          />

          <ul className="list-group">
            {state.lessons.map((u) => {
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
