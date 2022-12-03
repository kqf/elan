import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import './App.css'
import AuthDemo from './components/authDemo';
import AppMenu from './components/menuComponent';

function App() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-6 equal-height equal-width">
          <AppMenu />
        </div>
        <div className="col-xs-6 equal-height equal-width">
          <AuthDemo />
        </div>
      </div>
    </div>
  );
}

export default App;
