import {
  useForm,
  Resolver,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";

type FormValues = {
  firstName: string;
  lastName: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.firstName ? values : {},
    errors: !values.firstName
      ? {
          firstName: {
            type: "required",
            message: "This is required.",
          },
        }
      : {},
  };
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
        {...props.register(props.name)}
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
  } = useForm<FormValues>({ resolver, mode: "onChange" });
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
