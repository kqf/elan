import { useEffect, useState } from 'react';
import './App.css';

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

  var ubody = await userResponse.json();
  console.log(ubody)
}

function App() {
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState(0);

  useEffect(() => {
    fetch('/test').then(res => {
      return res.json()
    }).then(data => {
      setMessage(data["payloads"])
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello world</p>
          Server response:
          {message}
          <button onClick={authentificate}>
            Generate the token
          </button>
          <button onClick={updateUsers}>
              Get the list of users
          </button>
          {users}
        </header>
    </div>
  );
}

export default App;
