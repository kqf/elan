import axios from "axios";
import _ from "lodash";
import { FieldError, useForm, UseFormRegisterReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });
  const navigate = useNavigate();
  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axios.get("/login", {
        headers: {
          Authorization: "Basic " + btoa(`${data.username}:${data.password}`),
        },
      });
      // @ts-ignore
      localStorage.setItem("accessToken", response.data.token);
      navigate("/", { replace: true });
      window.location.reload();
    } catch (ex) {
      if (!axios.isAxiosError(ex)) {
        console.log("Unknown exception occurred");
        console.log(ex);
        return;
      }
      if (ex.response && ex.response.status === 401) {
        console.log("Error ~~~>");
      }
      if (ex.response) {
        console.log(ex.response);
        toast.error("Somethign went wrong, can't upate the server");
      }
    }
  });

  return (
    <div>
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

        <button disabled={!_.isEmpty(errors)} className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
