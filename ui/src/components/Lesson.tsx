import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../auth";

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
      const response = await http.get(`/lessons/${lessonId}`, () => {
        navigate("/login");
      });

      updateState({ ...state, lesson: response?.data });
    })();
    // eslint-disable-next-line
  }, []);

  const sortBy = (name: string) => () => {
    let order = "asc" as "asc" | "desc";
    if (state.sort.column === name && state.sort.order === "asc") {
      order = "desc";
    }
    if (state.sort.column === name && state.sort.order === "desc") {
      order = "asc";
    }

    updateState({
      ...state,
      sort: {
        column: name,
        order: order,
      },
    });
  };

  const renderSortIcon = (field: "iffield" | "offield") => {
    if (field !== state.sort.column) return null;
    if (state.sort.order === "asc") return <i className="fa fa-sort-asc" />;
    return <i className="fa fa-sort-desc" />;
  };

  const sorted: Array<Pair> = _.orderBy(
    state.lesson?.pairs,
    state.sort.column,
    state.sort.order
  );

  return (
    <React.Fragment>
      {state.lesson && (
        <div className="row">
          <h2>{state.lesson.title}</h2>
          <table className="table">
            <thead>
              <tr>
                <th onClick={sortBy("iffield")}>
                  Source {renderSortIcon("iffield")}
                </th>
                <th onClick={sortBy("offield")}>
                  Target {renderSortIcon("offield")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((pair) => {
                return (
                  <tr key={pair.iffield}>
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
