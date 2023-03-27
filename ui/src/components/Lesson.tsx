import axios from "axios";
import { useEffect, useState } from "react";
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

export default function LessonPage(props: LessonParams) {
  const params = useParams<LessonParams>();

  var lesson = params?.id;
  if (lesson === undefined) {
    lesson = props?.id;
  }
  const navigate = useNavigate();
  const [state, updateState] = useState({} as Lesson);
  useEffect(() => {
    // Fetch the data
    (async () => {
      const header = tokenHeader();

      if (header === null) {
        navigate("/login");
        return;
      }

      console.log("Calling ->", `/lessons/${lesson}`);
      const lessons = (
        await axios.get(`/lessons/${lesson}`, { headers: header })
      ).data;
      console.log("fetched ~", lessons);
      updateState(lessons);
    })();
    // eslint-disable-next-line
  }, []);

  const sortBy = (name: string) => () => {};

  return (
    <table className="table">
      <thead>
        <tr>
          <th onClick={sortBy("iffield")}>Source</th>
          <th onClick={sortBy("offield")}>Target</th>
        </tr>
      </thead>
      <tbody>
        {state?.pairs.map((pair) => {
          return (
            <tr key={pair.id}>
              <td>{pair.iffield}</td>
              <td>{pair.offield}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
