import { useState } from "react";

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}

interface UsernameFormElement extends HTMLFormElement {
  readonly elements: FormElements;
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
      username: event.currentTarget.value,
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            autoFocus
            value={state.username}
            onChange={handleChange}
            id="username"
            className="form-control"
            type="text"
          ></input>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            value={state.password}
            id="password"
            className="form-control"
            type="text"
          ></input>
        </div>
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
