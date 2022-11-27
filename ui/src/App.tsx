import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import './App.css';
import AuthDemo from './components/authDemo';
import AppMenu from './components/menuComponent';

function App() {
  return <div>
      <AppMenu />
      <AuthDemo />
    </div>
}

export default App;
