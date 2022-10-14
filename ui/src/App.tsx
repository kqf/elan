import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState(0)
  useEffect(() => {
    fetch('/test').then(res => {
      return res.json()
    }).then(data => {
      console.log(data)
      setUsers(data["payload"])
    })
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello world</p>
        <p> {users}</p>
      </header>
    </div>
  );
}

export default App;
