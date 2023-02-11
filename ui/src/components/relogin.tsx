import _ from "lodash";
import {
  useForm,
  FieldError,
} from "react-hook-form";

type FormValues = {
  username: string;
  password: string;
};

function LoginField(props: {
  id: "username" | "password";
  label: string;
  error?: FieldError;
  inputs?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  console.log("this is field", props.error);
  return (
    <div className="form-group">
      <label htmlFor={props.id}>{props.label}</label>
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
          id={"username"}
          label={"Username"}
          // placeholder="Bob"
          error={errors["username"]}
          {...register("username", {
            required: "Username is required",
          })}
        />
        <LoginField
          id={"password"}
          label={"Username"}
          // placeholder="Bob"
          error={errors["password"]}
          {...register("password", {
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
