import { useState } from "react";

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
  const handleSubmit = (event: React.FormEvent<UsernameFormElement>) => {
    event.preventDefault();
    console.log(
      `Handling submission ~> ${event.currentTarget.elements.username.value} ${event.currentTarget.elements.password.value}`
    );
  };

  const [state, updatesState] = useState({
    username: "Defaut User",
    password: "Default password",
  });

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    updatesState({
      ...state,
      [event.currentTarget.id]: event.currentTarget.value,
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <LoginField
          name="username"
          label="Username"
          value={state.username}
          onChange={handleChange}
        />
        <LoginField
          name="password"
          label="Password"
          value={state.password}
          onChange={handleChange}
        />
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
