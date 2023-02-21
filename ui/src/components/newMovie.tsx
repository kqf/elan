import _ from "lodash";
import {
  useForm,
  FieldError,
  UseFormRegisterReturn,
} from "react-hook-form";
import { useLocation } from "react-router-dom";

type FormValues = {
  name: string;
  genre: string;
  stock: number;
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
      <input className="form-control" {...props.inputs} placeholder={props.placeholder}/>
      {props.error && (
        <div className="alert alert-danger">{props.error.message}</div>
      )} </div>
  );
}

function NewMovie() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });
  const location = useLocation();
  console.log("Passed the props ~>", location)
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div>
      <h1>Add a new movie</h1>
      <form onSubmit={onSubmit}>
        <ErrorField
          label={"Movie Name"}
          placeholder="The shining"
          error={errors["name"]}
          inputs={register("name", {
            required: "Movie name is required",
          })}
        />
        <ErrorField
          label={"Genre"}
          placeholder="bob@example.com"
          error={errors["genre"]}
          inputs={register("genre", {
            required: "Genre is required",
            }
          )}
        />

        <ErrorField
          label={"Number in stock"}
          placeholder="1"
          error={errors["stock"]}
          inputs={register("stock", {
            required: "Number in stock is required",
            validate: (val: number) => {
              if(val < 0 || val >= 100)
                return "Number in stock should be between 0, 100"
            }
          })}
        />

        <ErrorField
          label={"Rate"}
          placeholder="1"
          error={errors["rate"]}
          inputs={register("rate", {
            required: "Number in stock is required",
            validate: (val: number) => {
              if(val < 0 || val >= 5)
                return "Rate should be between 0, 5"
            }
          })}
        />

        <button disabled={!_.isEmpty(errors)} className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewMovie;
