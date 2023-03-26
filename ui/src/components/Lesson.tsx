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

  return (
    <div>
      <ul className="list-group">
        {state.pairs?.map((u) => {
          return (
            <li key={u.id} className="list-group-item">
              {u.iffield}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
