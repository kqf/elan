import { useEffect, useState } from 'react';
import './App.css';

async function click() {
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
  // @ts-ignore
  localStorage.setItem('accessToken', response.body.access_token);

  // @ts-ignore
  console.log("Fetched the token ->", response.body.access_token);
}

function App() {
  const [users, setUsers] = useState(0)
  useEffect(() => {
    fetch('/test').then(res => {
      return res.json()
    }).then(data => {
      console.log(data)
      setUsers(data["payloads"])
    })
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello world</p>
        <p> {users}</p>

      <button onClick={click}>
            Generate token
          </button>
      </header>
    </div>
  );
}

export default App;
