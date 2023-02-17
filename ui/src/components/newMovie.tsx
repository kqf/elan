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
          label={"Username"}
          placeholder="Bob"
          error={errors["name"]}
          inputs={register("name", {
            required: "Username is required",
          })}
        />
        <ErrorField
          label={"Email"}
          placeholder="bob@example.com"
          error={errors["description"]}
          inputs={register("genre", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please provide a email address"
            }
          })}
        />
        <ErrorField
          label={"Password"}
          placeholder="querty"
          error={errors["genre"]}
          inputs={register("description", {
            required: "Password is required",
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
