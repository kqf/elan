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
  placeholder: string;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}) {
  return (
    <div>
      <label htmlFor={props.name}>{"Username"}</label>
      <input {...props.register(props.name)} placeholder={props.placeholder} />
      {props.errors?.firstName && <p>{props.errors.firstName.message}</p>}
    </div>
  );
}

function ReloginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div>
      <h1>Re-login</h1>
      <form onSubmit={onSubmit}>
        <LoginField
          name="firstName"
          placeholder="Bob"
          register={register}
          errors={errors}
        />
        <input {...register("lastName")} placeholder="Luo" />

        <input type="submit" />
      </form>
    </div>
  );
}

export default ReloginForm;
