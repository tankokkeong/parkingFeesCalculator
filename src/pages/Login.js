import { authentication, setCookie, getCookie } from "./helper";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Login(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const auth = getAuth();
    const navigate = useNavigate();
    const Submit = async () =>{

        //Display Loader
        document.getElementById("login-loader").style.display = "";

        if(email.trim().length === 0 && password.length === 0){
            setErrorMessage("You cannot leave empty field(s)!");
            //Remove Loader
            document.getElementById("login-loader").style.display = "none";
        }
        else{
            //Login Action
            const message = await authentication(email, password);

            if(message.hasOwnProperty("uid")){
                setCookie("parkingFeesUID", message.uid, 7);
                window.location.href = "/Calculator";
            }
            else{
                setErrorMessage("Incorrect email or password");
                //Remove Loader
                document.getElementById("login-loader").style.display = "none";
            }
            // console.log(message);
        }
        
    };

    useEffect(() => {
        if(getCookie("parkingFeesUID") !== ""){
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    navigate("/Calculator", { replace: true});
                }
            });
        }
    });

    return (
        <div id="login-container">
            <div className="login-box">
                <div className="login-title mt-2">
                    <h1 className="text-center">Login</h1>

                    <div className="input-container">
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" id="email" onChange={e => setEmail(e.currentTarget.value)} 
                            onKeyUp={e => {if (e.keyCode === 13) Submit()}}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" id="password" onChange={e => setPassword(e.currentTarget.value)}
                            onKeyUp={e => {if (e.keyCode === 13) Submit()}}/>
                            No account? <a href="SignUp">Sign Up</a> now!
                        </div>
                        
                        <div className="form-group" id="error-prompt" style={{color : "red"}}>{errorMessage}</div>

                        <div className="form-group mt-3">
                            <button type="submit" className="btn btn-primary" onClick={Submit}>Login</button>

                            <div className="text-info" id="login-loader" role="status" style={{display : "none"}}>
                                <span className="mt-3 ml-1 mr-3 spinner-border spinner-border-sm"></span>
                                Loading...
                            </div>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        </div>
    );
}