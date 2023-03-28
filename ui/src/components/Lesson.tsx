import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import tokenHeader from "../auth";

type LessonParams = {
  id?: string;
};

interface Pair {
  id: number;
  iffield: string;
  offield: string;
}

interface Lesson {
  id: number;
  title: string;
  pairs: Array<Pair>;
}

interface LessonPageState {
  lesson?: Lesson;
  sort: {
    column: string;
    order: "asc" | "desc";
  };
}

export default function LessonPage(props: { lesson?: Lesson }) {
  const params = useParams<LessonParams>();

  var lessonId = params?.id;
  if (lessonId === undefined) {
    lessonId = props.lesson?.id.toString();
  }
  const navigate = useNavigate();
  const [state, updateState] = useState<LessonPageState>({
    sort: {
      column: "iffield",
      order: "asc",
    },
  });
  useEffect(() => {
    // Fetch the data
    (async () => {
      const header = tokenHeader();

      if (header === null) {
        navigate("/login");
        return;
      }

      console.log("Calling ->", `/lessons/${lessonId}`);
      const lesson = (
        await axios.get(`/lessons/${lessonId}`, { headers: header })
      ).data;
      console.log("fetched ~", lesson);
      updateState({ ...state, lesson: lesson });
    })();
    // eslint-disable-next-line
  }, []);

  const sortBy = (name: string) => () => {};

  return (
    <React.Fragment>
      {state.lesson && (
        <div className="row">
          <h2>{state.lesson.title}</h2>
          <table className="table">
            <thead>
              <tr>
                <th onClick={sortBy("iffield")}>Source</th>
                <th onClick={sortBy("offield")}>Target</th>
              </tr>
            </thead>
            <tbody>
              {state.lesson.pairs.map((pair) => {
                return (
                  <tr key={pair.id}>
                    <td>{pair.iffield}</td>
                    <td>{pair.offield}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </React.Fragment>
  );
}
