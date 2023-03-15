import axios from "axios";
import _ from "lodash";
import { FieldError, useForm, UseFormRegisterReturn } from "react-hook-form";

type FormValues = {
  username: string;
  password: string;
  email: string;
};

function LoginField(props: {
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

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });
  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const response = await axios.get("/login", {
      headers: {
        Authorization: "Basic " + btoa(`${data.username}:${data.password}`),
      },
    });
    console.log(response.data);
    // @ts-ignore
    localStorage.setItem("accessToken", response.data.token);
  });

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <LoginField
          label={"Username"}
          placeholder="Bob"
          error={errors["username"]}
          inputs={register("username", {
            required: "Username is required",
          })}
        />
        <LoginField
          label={"Email"}
          placeholder="bob@example.com"
          error={errors["email"]}
          inputs={register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please provide a email address",
            },
          })}
        />
        <LoginField
          label={"Password"}
          placeholder="querty"
          error={errors["password"]}
          inputs={register("password", {
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

export default LoginForm;
