import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import tokenHeader from "../auth";

type LessonParams = {
  id: string;
};

export default function Lesson(props?: LessonParams) {
  const params = useParams<LessonParams>();
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

      const lessons = (
        await axios.get(`/lessons/${props.id}`, { headers: header })
      ).data;
      console.log("fetched ~", lessons);
      updateState(lessons);
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <ul className="list-group">
        {state.map((u) => {
          return (
            <li key={u.id} className="list-group-item">
              {u.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
