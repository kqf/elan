import _ from "lodash";
import {
  useForm,
  FieldError,
  UseFormRegisterReturn,
} from "react-hook-form";

type FormValues = {
  username: string;
  password: string;
  email: string;
};

function LoginField(props: {
  label: string;
  error?: FieldError;
  inputs: UseFormRegisterReturn;
}) {
  return (
    <div className="form-group">
      <label htmlFor={props.inputs.name}>{props.label}</label>
      <input className="form-control" {...props.inputs} />
      {props.error && (
        <div className="alert alert-danger">{props.error.message}</div>
      )}
    </div>
  );
}

function ReloginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div>
      <h1>Re-login</h1>
      <form onSubmit={onSubmit}>
        <LoginField
          label={"Username"}
          error={errors["username"]}
          inputs={register("username", {
            required: "Username is required",
          })}
        />
        <LoginField
          label={"Email"}
          // placeholder="Bob"
          error={errors["email"]}
          inputs={register("email", {
            required: "Email is required",
          })}
        />
        <LoginField

          label={"Password"}
          // placeholder="Bob"
          error={errors["password"]}
          inputs={register("password", {
            required: "Username is required",
          })}
        />

        <button disabled={!_.isEmpty(errors)} className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ReloginForm;
