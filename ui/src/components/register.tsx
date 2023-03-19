import axios from "axios";
import _ from "lodash";
import { FieldError, useForm, UseFormRegisterReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type RegisterFilds = {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
};

function RegistrationField(props: {
  label: string;
  placeholder?: string;
  error?: FieldError;
  inputs: UseFormRegisterReturn;
  type?: string;
}) {
  return (
    <div className="form-group">
      <label htmlFor={props.inputs.name}>{props.label}</label>
      <input
        className="form-control"
        {...props.inputs}
        placeholder={props.placeholder}
        type={props.type}
      />
      {props.error && (
        <div className="alert alert-danger">{props.error.message}</div>
      )}{" "}
    </div>
  );
}

function RegisterForm() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFilds>({ mode: "onChange" });
  const navigate = useNavigate();
  const onSubmit = handleSubmit(async (data: RegisterFilds) => {
    const response = await axios.post("/users/", {
      username: data.username,
      password: data.password,
      email: data.email,
    });
    console.log(response);
    navigate("/", { replace: true });
  });

  return (
    <div>
      <h1>Sign up</h1>
      <form onSubmit={onSubmit}>
        <RegistrationField
          label={"Username"}
          placeholder="Bob"
          error={errors["username"]}
          inputs={register("username", {
            required: "Username is required",
          })}
        />
        <RegistrationField
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
        <RegistrationField
          label={"Password"}
          placeholder="querty"
          type="password"
          error={errors["password"]}
          inputs={register("password", {
            required: "Password is required",
          })}
        />

        <RegistrationField
          label={"Confirm password"}
          placeholder="querty"
          type="password"
          error={errors["confirm_password"]}
          inputs={register("confirm_password", {
            required: "Password is required",
            validate: (val: string) => {
              if (watch("password") !== val) return "Passwords should match";
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

export default RegisterForm;
