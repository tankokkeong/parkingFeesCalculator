import './App.css';

import { Route, Routes, Link, BrowserRouter as Router } from 'react-router-dom';
import  Login  from './pages/Login';
import { Calculator } from './pages/Calculator';
import { SignUp } from './pages/SignUp';
import { getAuth, signOut } from "firebase/auth";


function App() {

  const Logout = async () => {
    const auth = getAuth();
    
    await signOut(auth).then(() => {
      window.location.href = "/";
    }).catch((error) => {
      // An error happened.
      console.log(error)
    });
  };

  return (
    <div>
      <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
            <h1 className="navbar-brand">Dev Express Demo</h1>  

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                
              </ul>

              <span className="nav-item">
                <div role="button" 
                data-toggle="modal" 
                data-target="#profileModal"
                className="nav-options nav-item text-light mr-3">
                  Profile
                  </div>
              </span>
                
              <span className="nav-item">
                <span href="#" 
                  onClick={Logout} 
                  role="button"
                  className="nav-options nav-item text-light text-decoration-none mr-3">
                  Log out
                </span>
              </span>

            </div>


            {/* <Link to={`ReportDesigner?token=${localStorage.getItem("accessToken")}`} style={{margin: "5px 10px"}} className="nav-options">Report Designer</Link> */}
            {/* <Link to={`DocumentViewer?token=${localStorage.getItem("accessToken")}`} className="nav-options">Document Viewer</Link> */}
            {/* <Link to="/" style={{margin: "5px 10px"}} className="nav-options">Login</Link> */}
      </nav>

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
