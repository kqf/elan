import { useState } from "react";
var Joi = require("joi-browser");

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
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

function LoginForm() {
  const [state, setState] = useState({
    account: {
      username: "Defaut User",
      password: "Default password",
    },
    errors: {
      username: "",
      password: "",
    },
  });

  const schema = {
    username: Joi.string().required(),
    password: Joi.string().required(),
  };

  const validateProperty = (value: string) => {
    if (value === "") return "Must not be empty";
    if (value.length > 20) return "Too long, must be less than 20 characters";
    return "";
  };

  const validate = (username: string, password: string) => {
    return {
      status: username.length && password.length,
      errors: {
        username: username.length === 0 ? "Username can't be empty" : "",
        password: password.length === 0 ? "Password can't be empty" : "",
      },
    };
  };

  const handleSubmit = (event: React.FormEvent<UsernameFormElement>) => {
    event.preventDefault();

    const result = Joi.validate(state.account, schema);
    console.log(result);

    const { status, errors } = validate(
      event.currentTarget.elements.username.value,
      event.currentTarget.elements.password.value
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
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <LoginField
          name="username"
          label="Username"
          value={state.account.username}
          onChange={handleChange}
          error={state.errors.username}
        />
        <LoginField
          name="password"
          label="Password"
          value={state.account.password}
          onChange={handleChange}
          error={state.errors.password}
        />
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
