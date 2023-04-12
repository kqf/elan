import axios from "axios";
import _ from "lodash";
import { useEffect, useState } from "react";
import { FieldError, UseFormRegisterReturn, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Genre } from "../schemes";

type FormValues = {
  name: string;
  level: string;
  topic: string;
  rate: number;
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

function NewLesson() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });
  const navigate = useNavigate();
  const [state, updateState] = useState({
    genres: [] as Array<Genre>,
  });
  useEffect(() => {
    // Fetch the data
    (async () => {
      const genres = (await axios.get("/genres/")).data;
      console.log(genres);
      updateState((s) => {
        return {
          ...state,
          genres: genres,
        };
      });
    })();
    // eslint-disable-next-line
  }, []);

  const onSubmit = handleSubmit(async (data: FormValues) => {
    try {
      await axios.post("/lessons/", {
        title: data.name,
        level: data.level,
        topic: data.topic,
        source: "unknown",
        liked: false,
      });
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        if (ex.response) {
          console.log(ex.response);
          toast.error("Somethign went wrong, can't upate the server");
        }
      }
    }

    navigate("/", { replace: true });
  });

  return (
    <div>
      <h1>Add a new Lesson</h1>
      <form onSubmit={onSubmit}>
        <ErrorField
          label={"Movie Name"}
          placeholder="The shining"
          error={errors["name"]}
          inputs={register("name", {
            required: "Movie name is required",
          })}
        />

        <div className="form-group">
          <label htmlFor="level">Genre</label>
          <select className="form-control" id="level" {...register("level")}>
            <option value=" " />
            {state.genres.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <ErrorField
          label={"Number in stock"}
          placeholder="1"
          error={errors["stock"]}
          inputs={register("stock", {
            required: "Number in stock is required",
            validate: (val: number) => {
              if (val < 0 || val >= 100)
                return "Number in stock should be between 0, 100";
            },
          })}
        />

        <ErrorField
          label={"Rate"}
          placeholder="1"
          error={errors["rate"]}
          inputs={register("rate", {
            required: "Number in stock is required",
            validate: (val: number) => {
              if (val < 0 || val >= 5) return "Rate should be between 0, 5";
            },
          })}
        />

        <button disabled={!_.isEmpty(errors)} className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewLesson;
