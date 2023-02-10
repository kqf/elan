import _ from "lodash";
import {
  useForm,
  UseFormRegister,
  FieldErrors,
  FieldError,
} from "react-hook-form";

type FormValues = {
  firstName: string;
  lastName: string;
};

function LoginField(props: {
  id: "firstName" | "lastName";
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
          id={"firstName"}
          label={"Username"}
          // placeholder="Bob"
          error={errors["firstName"]}
          {...register("firstName", {
            required: "Username is required",
          })}
        />
        {/* <LoginField
          name="lastName"
          label="Second Name"
          placeholder="Bobby"
          register={register}
          errors={errors}
        /> */}
        <button disabled={!_.isEmpty(errors)} className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ReloginForm;
