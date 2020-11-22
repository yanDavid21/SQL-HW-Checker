import '../stylesheets/app.css';
import Header from './header.js';
import Body from './body.js'

//react component that holds the whole website, contains a header and body
function App() {
  return (
   <div className = "app">
     <Header/>
     <Body/>
   </div>
  );
}

export default App;
