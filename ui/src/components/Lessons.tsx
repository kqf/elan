import axios from "axios";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import http from "../auth";
import LessonTable, { SortingColumn } from "../lessonTable";
import { Lesson } from "../schemes";
import ListGroup from "./listGroup";
import Pagination from "./pagination";

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
    topics: [] as Array<String>,
    levels: [] as Array<String>,
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
      const lessons = response?.data;
      const topics = _.uniq(_.map(lessons, "topic"));
      const levels = _.uniq(_.map(lessons, "level"));

      updateState({
        ...state,
        lessons: response?.data,
        topics: topics,
        levels: levels,
      });
    })();
    // eslint-disable-next-line
  }, []);

  const filteredByTopic = state.lessons.filter(
    (lesson) =>
      state.selectedTopic === lesson.topic || state.selectedTopic === ""
  );

  const final = filteredByTopic;

  return (
    <div>
      <div className="row">
        <div className="col-3">
          <div className="col my-3">
            <ListGroup
              items={state.topics}
              onClick={(topic) => () => {
                const selected = topic === state.selectedTopic ? "" : topic;
                updateState({ ...state, selectedTopic: selected as string });
              }}
              selectedItem={state.selectedTopic}
              title={"Level"}
            />
            <div className="col my-3">
              <ListGroup
                items={state.levels}
                onClick={(level) => () => {
                  updateState({ ...state, selectedLevel: level as string });
                }}
                selectedItem={state.selectedLevel}
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
              onChange={(event: React.FormEvent<HTMLInputElement>) => {
                updateState({
                  ...state,
                  searchQuery: event.currentTarget.value,
                  selectedLevel: "",
                  selectedTopic: "",
                  // This is needed to fix the issues with search
                  currentPage: 1,
                });
              }}
            />
          </div>

          <LessonTable
            lessons={final}
            likeLesson={(arg0: Lesson) => () => {}}
            deleteLesson={(arg0: Lesson) => () => {}}
            onSort={(column: SortingColumn) => {}}
            sortingBy={{ column: "title", order: "asc" }}
          />

          <Pagination
            // itemCount={filteredByGenre.length}
            itemCount={final.length}
            pageSize={state.pageSize}
            currentPage={state.currentPage}
            onClick={(page: number) => () => {
              updateState({
                ...state,
                currentPage: page,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
