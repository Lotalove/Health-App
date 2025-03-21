import { useState } from 'react';
import './App.css'; 
import { Login } from './components/login_form';



function App() {
 const [credentials,setCredentials] = useState(null)
  return (
    <div className="App">
      <Login></Login>
    </div>
  );
}

export default App;
