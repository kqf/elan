import { useState } from "react";

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
  email: HTMLInputElement;
}

interface UsernameFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function LoginField(props: {
  name: string;
  label: string;
  error: string;
  value: string;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="form-group">
      <label htmlFor={props.name}>{props.label}</label>
      <input
        autoFocus
        value={props.value}
        onChange={props.onChange}
        id={props.name}
        className="form-control"
        type="text"
      ></input>
      {props.error && <div className="alert alert-danger">{props.error}</div>}
    </div>
  );
}

function RegisterForm() {
  const [state, setState] = useState({
    account: {
      username: "John Doe",
      password: "Default password",
      email: "joe.doe@gmail.om",
    },
    errors: {
      username: "",
      password: "",
      email: "",
    },
  });

  const validateProperty = (value: string) => {
    if (value === "") return "Must not be empty";
    if (value.length > 20) return "Too long, must be less than 20 characters";
    return "";
  };

  const validate = (username: string, password: string, email: string) => {
    return {
      status: username.length > 0 && password.length > 0,
      errors: {
        username: username.length === 0 ? "Username can't be empty" : "",
        password: password.length === 0 ? "Password can't be empty" : "",
        email: email.length === 0 ? "Password can't be empty" : "",
      },
    };
  };

  const handleSubmit = (event: React.FormEvent<UsernameFormElement>) => {
    event.preventDefault();

    const { status, errors } = validate(
      event.currentTarget.elements.username.value,
      event.currentTarget.elements.password.value,
      event.currentTarget.elements.email.value
    );

    if (!status) return;

    setState({
      ...state,
      errors: errors,
    });
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    setState({
      ...state,
      account: {
        ...state.account,
        [event.currentTarget.id]: event.currentTarget.value,
      },
      errors: {
        ...state.errors,
        [event.currentTarget.id]: validateProperty(event.currentTarget.value),
      },
    });
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <LoginField
          name="email"
          label="E-mail"
          value={state.account.email}
          onChange={handleChange}
          error={state.errors.email}
        />
        <LoginField
          name="password"
          label="Password"
          value={state.account.password}
          onChange={handleChange}
          error={state.errors.password}
        />
        <LoginField
          name="username"
          label="Username"
          value={state.account.username}
          onChange={handleChange}
          error={state.errors.username}
        />
        <button
          disabled={
            !validate(
              state.account.username,
              state.account.password,
              state.account.email
            ).status
          }
          className="btn btn-primary"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;