import { FieldError, UseFormRegisterReturn, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

type PracticeParams = {
  id?: string;
};

type FormValues = {
  answer: string;
};

function ErrorField(props: {
  label: string;
  placeholder?: string;
  error?: FieldError;
  inputs: UseFormRegisterReturn;
}) {
  return (
    <div className="form-group">
      <label htmlFor={props.inputs.name}>{props.label}</label>
      <input
        className="form-control"
        {...props.inputs}
        placeholder={props.placeholder}
      />
      {props.error && (
        <div className="alert alert-danger">{props.error.message}</div>
      )}{" "}
    </div>
  );
}

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
          error={errors["answer"]}
          inputs={register("answer", {
            required: "Please provide the lesson level",
          })}
        />
      </form>
    </div>
  );
}

export default Practice;
