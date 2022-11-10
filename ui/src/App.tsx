import { useEffect, useState } from 'react';
import './App.css';

interface User{
  email: string,
  id: Number,
  username: string,
};

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

async function updateUsers(setUsers: any) {
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
  setUsers(ubody)
}

function StatusWidget(props: {message: string, users: Array<any>}) {
  const [users, setUsers] = useState(props.users);
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello world</p>
          Server response:
          {props.message}
          <button onClick={authentificate}>
            Generate the token
          </button>
          <button onClick={() => {updateUsers(setUsers)}}>
              Get the list of users
          </button>
          <div>
            {users.map(user => <p>{user.username}</p>)}
          </div>
        </header>
    </div>
  );
}

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch('/test').then(res => {
      return res.json()
    }).then(data => {
      setMessage(data["payloads"])
    })
  }, [])
  return <StatusWidget message={message} users={[
    {username: "No user exist", id: -1, emai: "None"}
  ]}/>
}

export default App;
