import axios from "axios";
import _ from "lodash";
import {
  FieldError,
  UseFormRegisterReturn,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../auth";

type PairEntry = {
  iffield: string;
  offield: string;
};

type FormValues = {
  title: string;
  level: string;
  topic: string;
  pairs: Array<PairEntry>;
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pairs",
  });

  const navigate = useNavigate();
  const onSubmit = handleSubmit(async (data: FormValues) => {
    try {
      await http.post("/lessons/", {
        title: data.title,
        level: data.level,
        topic: data.topic,
        pairs: data.pairs,
      });
    } catch (ex) {
      if (axios.isAxiosError(ex) && ex.response) {
        console.log(ex.response);
        toast.error("Somethign went wrong, can't upate the server");
      }
    }
    navigate("/lessons", { replace: true });
  });

  const handleKeywordKeyPress =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        append({ iffield: "", offield: "" });
      }
    };

  return (
    <div>
      <h1>Add a new Lesson</h1>
      <form onSubmit={onSubmit}>
        <ErrorField
          label={"Level"}
          placeholder="B1"
          error={errors["level"]}
          inputs={register("level", {
            required: "Please provide the lesson level",
          })}
        />

        <ErrorField
          label={"Topic"}
          placeholder="Outdoor activities"
          error={errors["topic"]}
          inputs={register("topic", {
            required: "Topic should not be empty",
          })}
        />
        <ErrorField
          label={"Title"}
          placeholder="Living in a village"
          error={errors["title"]}
          inputs={register("title", {
            required: "Movie name is required",
          })}
        />

        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Source </th>
                <th>Target</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>
                      <input
                        className="form-control"
                        onKeyDown={handleKeywordKeyPress(index)}
                        {...register(`pairs.${index}.iffield`)}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        onKeyDown={handleKeywordKeyPress(index)}
                        {...register(`pairs.${index}.offield`)}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => remove(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={3} className="text-align center" align="center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      append({ iffield: "der Vogel", offield: "the Bird" })
                    }
                  >
                    Add a new Pair
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button disabled={!_.isEmpty(errors)} className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewLesson;
