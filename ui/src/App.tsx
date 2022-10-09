import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState(0)
  useEffect(() => {
    fetch('/test').then(res => {
      console.log("feteched ->>>", res.json())
      return [];
    }).then(data => {
      setUsers(data.length)
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
