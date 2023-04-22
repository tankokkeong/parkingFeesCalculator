import './App.css';

import { Route, Routes, Link, BrowserRouter as Router } from 'react-router-dom';
import  Login  from './pages/Login';
import { Calculator } from './pages/Calculator';
import { SignUp } from './pages/SignUp';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { setCookie } from './pages/helper';
import { useState, useEffect } from 'react';


function App() {
  const [userID, setUserID] = useState("Unauthorized");
  const [userEmail, setUserEmail] = useState("Unauthorized");
  const auth = getAuth();

  const Logout = async () => {
    
    await signOut(auth).then(() => {
      setCookie("parkingFeesUID", "", -7);
      window.location.href = "/";
    }).catch((error) => {
      // An error happened.
      console.log(error)
    });
  };

  useEffect(() => {

    if(userEmail === "Unauthorized" && userID === "Unauthorized"){
      onAuthStateChanged(auth, (user) => {
        if (user) {
            setUserEmail(user.email);
            setUserID(user.uid);
            // console.log(user)
        }
      });
    }

  });

  return (
    <div>
      <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
            <h1 className="navbar-brand">Parking Fees Calculator</h1>  

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            {
              (userEmail !== "Unauthorized" && userID !== "Unauthorized") && 
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                  
                </ul>

                <span className="nav-item">
                  <div role="button" 
                  data-toggle="modal" 
                  data-target="#myProfile"
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
            }



            {/* <Link to={`ReportDesigner?token=${localStorage.getItem("accessToken")}`} style={{margin: "5px 10px"}} className="nav-options">Report Designer</Link> */}
            {/* <Link to={`DocumentViewer?token=${localStorage.getItem("accessToken")}`} className="nav-options">Document Viewer</Link> */}
            {/* <Link to="/" style={{margin: "5px 10px"}} className="nav-options">Login</Link> */}
      </nav>

      <Router>
        <Routes>
          <Route path="/" element={<Login />} />  
          <Route path="Calculator" element={<Calculator />} />  
          <Route path="SignUp" element={<SignUp />} />
          <Route path="*" element={<Login />} />  
        </Routes>
        
      </Router>  

      {/* <!-- Modal --> */}
      <div className="modal fade" id="myProfile" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">My Profile</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group row">
                  <label htmlFor="staticEmail" className="col-sm-3 col-form-label">User ID:</label>
                  <div className="col-sm-9">
                    <span className="form-control">{userID}</span>
                  </div>
              </div>

              <div className="form-group row">
                  <label htmlFor="staticEmail" className="col-sm-3 col-form-label">User Email:</label>
                  <div className="col-sm-9">
                    <span className="form-control">{userEmail}</span>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
