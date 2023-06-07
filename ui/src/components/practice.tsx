import { useNavigate, useParams } from "react-router-dom";

type PracticeParams = {
  id?: string;
};

function Practice() {
  const navigate = useNavigate();
  const lessonId = useParams<PracticeParams>().id;
  if (lessonId === undefined) {
    navigate("/lessons");
  }
  return <h1>Excercise your skills for lesson {lessonId}</h1>;
}

export default Practice;
