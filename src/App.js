import './App.css';

import { Route, Routes, Link, BrowserRouter as Router } from 'react-router-dom';
import  Login  from './pages/Login';
import { Calculator } from './pages/Calculator';
import { SignUp } from './pages/SignUp';


function App() {

  return (
    <div>

      <Router>
        <Routes>
          <Route path="/" element={<Login />} />  
          <Route path="Calculator" element={<Calculator />} />  
          <Route path="SignUp" element={<SignUp />} />
        </Routes>
        
      </Router>  

    </div>
  );
}

export default App;
