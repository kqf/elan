import axios from "axios";
import _ from "lodash";
import { FieldError, useForm, UseFormRegisterReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type FormValues = {
  username: string;
  password: string;
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
    setError,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });
  const navigate = useNavigate();
  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axios.get("/login", {
        auth: {
          username: data.username,
          password: data.password,
        },
      });
      // // @ts-ignore
      localStorage.setItem("accessToken", response.data.token);
      navigate("/", { replace: true });
      window.location.reload();
    } catch (ex) {
      setError(
        "root",
        { type: "focus", message: "Wrong username or password" }
        // { shouldFocus: true }
      );
    }
  });

  return (
    <div className="container">
      <h1>Sign In</h1>
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
          label={"Password"}
          placeholder="querty"
          error={errors["password"]}
          inputs={register("password", {
            required: "Password is required",
          })}
        />

        {errors.root && (
          <div className="alert alert-danger">
            {errors.root.message as string}
          </div>
        )}

        <button disabled={!_.isEmpty(errors)} className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
