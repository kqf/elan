import { useEffect, useState } from 'react';
import './App.css';

function click() {
  console.log("Clicked on event");
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
      </header>

      <button onClick={click}>
        Activate Lasers
      </button>
    </div>
  );
}

export default App;
