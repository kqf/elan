import _ from "lodash";
import {
  useForm,
  FieldError,
  UseFormRegisterReturn,
} from "react-hook-form";

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

function RegisterForm() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFilds>({ mode: "onChange" });
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div>
      <h1>Re-login</h1>
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
              message: "Please provide a email address"
            }
          })}
        />
        <RegistrationField

          label={"Password"}
          placeholder="querty"
          error={errors["password"]}
          inputs={register("password", {
            required: "Password is required",
          })}
        />

        <RegistrationField

          label={"Confirm password"}
          placeholder="querty"
          error={errors["confirm_password"]}
          inputs={register("confirm_password", {
            required: "Password is required",
            validate: (val: string) => {
              if (watch("password") !== val)
                return "Passwords should match"
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

export default RegisterForm;
