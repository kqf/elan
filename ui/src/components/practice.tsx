import _ from "lodash";
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
    correct: true,
  } as {
    task: string;
    finished: Boolean;
    correct: Boolean;
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
        correct: true,
      });
    })();
    // eslint-disable-next-line
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });

  const onSubmit = handleSubmit(async (data: FormValues) => {
    const response = await http.post(`/practice/${lessonId}/`, {
      offield: data.answer,
    });
    if (!response?.data.matched) {
      setError("answer", {
        type: "manual",
        message: `Incorrect input: "${data.answer}" is an incorrect answer`,
      });
    }

    if (response?.data.matched) {
      const response = await http.get(`/practice/${lessonId}/`);
      updateState({
        task: response?.data.iffield,
        finished: response?.data.finished,
        correct: true,
      });
      resetField("answer");
    }
  });

  const session = (
    <div>
      <h1>Excercise your skills for lesson {lessonId}</h1>
      <form onSubmit={onSubmit}>
        <ErrorField
          label={state.task}
          placeholder="Answer"
          error={errors["answer"]}
          inputs={register("answer", {
            required: "Please provide the lesson level",
          })}
        />
        <button disabled={!_.isEmpty(errors)} className="btn btn-primary">
          Check
        </button>
      </form>
    </div>
  );
  const message = <h1>The lesson is over</h1>;

  return state.finished ? message : session;
}

export default Practice;
