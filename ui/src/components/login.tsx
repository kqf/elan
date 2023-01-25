function LoginForm() {
  const handleSubmit = (e: any) => {
    e.preventEvent();
    console.log("Handling submission");
  };
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" className="form-control" type="text"></input>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="username" className="form-control" type="text"></input>
        </div>
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
