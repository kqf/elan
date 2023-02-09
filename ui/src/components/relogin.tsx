import { useForm, UseFormRegister, FieldErrors } from "react-hook-form";

type FormValues = {
  firstName: string;
  lastName: string;
};

function LoginField(props: {
  name: "firstName" | "lastName";
  label: string;
  placeholder: string;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}) {
  const errors = props.errors[props.name];
  return (
    <div className="form-group">
      <label htmlFor={props.name}>{props.label}</label>
      <input
        id={props.name}
        {...props.register(props.name, { required: true })}
        placeholder={props.placeholder}
        className="form-control"
      />
      {errors && <div className="alert alert-danger">{errors.message}</div>}
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
          name="firstName"
          label={"Username"}
          placeholder="Bob"
          register={register}
          errors={errors}
        />
        <LoginField
          name="lastName"
          label="Second Name"
          placeholder="Bobby"
          register={register}
          errors={errors}
        />
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default ReloginForm;
