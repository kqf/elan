import axios from "axios";
import _ from "lodash";
import { useEffect, useState } from "react";
import {
  Controller,
  FieldError,
  UseFormRegisterReturn,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Genre } from "../schemes";

type PairEntry = {
  firstName: string;
  lastName: string;
};

type FormValues = {
  name: string;
  level: string;
  topic: string;
  rate: number;
  test: Array<PairEntry>;
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
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "test",
  });

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
          error={errors["level"]}
          inputs={register("level", {
            required: "Please provide the lesson level",
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

        <ErrorField
          label={"Rate"}
          placeholder="1"
          error={errors["topic"]}
          inputs={register("topic", {
            required: "Topic should not be empty",
          })}
        />
        <div>
          <ul className="list-group">
            {fields.map((item, index) => (
              <li key={item.id}>
                <input {...register(`test.${index}.firstName`)} />
                <Controller
                  render={({ field }) => <input {...field} />}
                  name={`test.${index}.lastName`}
                  control={control}
                />
                <button type="button" onClick={() => remove(index)}>
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    insert(index, { firstName: "bill", lastName: "luo" })
                  }
                >
                  Insert
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button disabled={!_.isEmpty(errors)} className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewLesson;
