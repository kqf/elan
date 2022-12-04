import { useEffect, useState } from 'react';

async function authentificate() {
  const response = await fetch('/tokens',
  {
    method: "POST",
    headers: {
      Authorization:  'Basic ' + btoa("bob:lol")
    }
  });

  if (!response.ok) {
    return response.status === 401 ? 'fail' : 'error';
  }

  var body = await response.json();

  // @ts-ignore
  localStorage.setItem('accessToken', body.token);
}

async function updateUsers() {
  const userResponse  = await fetch('/users/', {

    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
    },
    credentials: 'omit',
  });

  return userResponse.json();
}

interface User {
  email: string,
  id: Number,
  username: string,
};

function StatusBadge() {
  const [message, setMessage] = useState("Offline");

  useEffect(() => {
    fetch('/test').then(res => {
      return res.json()
    }).then(data => {
      setMessage("Online")
    }).catch(res => {
      setMessage("Offline")
    })
  })

  const success = message === "Offline" ? "success" : "danger";
  const spanClasses = "badge badge-pill badge-" + success;

  return (
      <span className={spanClasses}>
        {message}
      </span>
  )

}

function AuthDemo() {
  const [users, setUsers] = useState([] as Array<User>);
  const [logged, checkLogged] = useState(false);

  return (
    <div className='span'>

      <div className='row'>
          <StatusBadge />
      </div>
      <div className="row">
          <button className="btn btn-secondary btn-sm col-sm-3"
                  onClick={() => {
                    authentificate().then(
                      () => checkLogged(localStorage.getItem("accessToken") !== null)
                  )}}
          >
            Generate the token
          </button>
      </div>
        <div className='row'>
            <button className="btn btn-secondary btn-sm col-sm-3"
                    disabled={!logged}
                    onClick={() => {updateUsers().then(setUsers)}}
            >
                Get the list of users
            </button>
            <div className="btn-sm">
              {users.length === 0 && <p> No users exist</p>}
              <ul>
                {users.map(user => <li key={user.id.toString()}>{user.username}</li>)}
              </ul>
            </div>
        </div>
      </div>
  );
}

export default AuthDemo;
