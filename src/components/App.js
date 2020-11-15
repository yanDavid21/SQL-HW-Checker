import '../stylesheets/app.css';
import Header from './header.js';
import Body from './body.js'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
   <div className = "app">
     <Header/>
     <Body/>
   </div>
  );
}

export default App;
