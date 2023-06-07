import { useParams } from "react-router-dom";

type PracticeParams = {
  id?: string;
};

function Practice() {
  const lessonId = useParams<PracticeParams>().id;
  return <h1>Excercise your skills for lesson {lessonId}</h1>;
}

export default Practice;
