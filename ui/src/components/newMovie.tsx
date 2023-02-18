import _ from "lodash";
import {
  useForm,
  FieldError,
  UseFormRegisterReturn,
} from "react-hook-form";

type FormValues = {
  name: string;
  genre: string;
  description: string;
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
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div>
      <h1>Add a new movie</h1>
      <form onSubmit={onSubmit}>
        <ErrorField
          label={"Movie Name"}
          placeholder="Bob"
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
          label={"Description"}
          placeholder="querty"
          error={errors["description"]}
          inputs={register("description", {
            required: "Description is required",
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
