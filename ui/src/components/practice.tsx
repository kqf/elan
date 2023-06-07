import { useForm } from "react-hook-form";
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
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });

  return (
    <div>
      <h1>Excercise your skills for lesson {lessonId}</h1>
      <form>
        <ErrorField
          label={"INPUT"}
          placeholder="Answer"
          error={errors["level"]}
          inputs={register("level", {
            required: "Please provide the lesson level",
          })}
        />
      </form>
    </div>
  );
}

export default Practice;
