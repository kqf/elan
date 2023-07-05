import { useEffect, useState } from "react";
import { FieldError, UseFormRegisterReturn, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import http from "../auth";

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
  const [state, updateState] = useState({
    task: "Undefined",
    finished: false,
  } as {
    task: string;
    finished: Boolean;
  });
  useEffect(() => {
    // Fetch the data
    (async () => {
      const response = await http.get(`/practice/${lessonId}/`, () => {
        console.log(response);
        navigate("/login");
      });
      updateState({
        task: response?.data.iffield,
        finished: response?.data.finished,
      });
    })();
    // eslint-disable-next-line
  }, []);

  const {
    register,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });

  return (
    <div>
      <h1>Excercise your skills for lesson {lessonId}</h1>
      <form>
        <ErrorField
          label={state.task}
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
