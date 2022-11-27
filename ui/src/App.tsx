import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import './App.css';
import AuthDemo from './components/authDemo';
import AppMenu from './components/menuComponent';

function App() {
  // return <div>
  //     <AppMenu />
  //     <AuthDemo />
  //   </div>

  return (
        <div className="row">
            <div className="col-xs-4">
              <AppMenu />
            </div>
            <div className="col-xs-6">
                <AuthDemo />
            </div>
      </div>
  );
}

export default App;
