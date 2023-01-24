function LoginForm() {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" className="form-control" type="text"></input>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="username" className="form-control" type="text"></input>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
