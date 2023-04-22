import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setCookie, getCookie } from './helper';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";

export function SignUp(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const auth = getAuth();
    const navigate = useNavigate();

    const CreateUser = () => {
        //Display Loader
        document.getElementById("signup-loader").style.display = "";

        if(email.trim().length === 0){
            setErrorMessage("You cannot leave the field empty");
        }
        else{
            if(password !== confirmPassword){
                setErrorMessage("Password and confirm password are different!");
                //Remove Loader
                document.getElementById("signup-loader").style.display = "none";
            }
            else{
                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    alert("User created successfully");
                    // console.log(userCredential.user.uid)
                    setCookie("parkingFeesUID", userCredential.user.uid, 7);
                    navigate("/Calculator", { replace: true});
    
                })
                .catch((error) => {
                    if(error.code === "auth/invalid-email"){
                        setErrorMessage("The email format is invalid!");
                    }
                    else if(error.code === "auth/weak-password"){
                        setErrorMessage("Your password cannot be less than 6 characters!");
                    }
                    else{
                        setErrorMessage("This email already exists!");
                    }
                    //Remove Loader
                    document.getElementById("signup-loader").style.display = "none";
                });
            }
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

    return(
        <div id="login-container">
            <div className="login-box">
                <div className="login-title mt-2">
                    <h1 className="text-center">Sign up</h1>

                    <div className="input-container">
                        <div className="form-group mt-2">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" onChange={e => setEmail(e.currentTarget.value)} />
                        </div>

                        <div className="form-group mt-2">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" id="password" onChange={e => setPassword(e.currentTarget.value)} />
                        </div>

                        <div className="form-group mt-2">
                            <label htmlFor="exampleInputPassword1">Confirm Password</label>
                            <input type="password" className="form-control" id="confirm-password" onChange={e => setConfirmPassword(e.currentTarget.value)} />
                            Already have an account? <a href="/">Login now</a>!
                        </div>
                        
                        <div className="form-group" id="error-prompt" style={{color : "red"}}>{errorMessage}</div>

                        <div className="form-group mt-3">
                            <button type="submit" className="btn btn-primary" onClick={CreateUser}>Sign up</button>

                            <div className="text-info" id="signup-loader" role="status" style={{display : "none"}}>
                                <span className="mt-3 ml-1 mr-3 spinner-border spinner-border-sm"></span>
                                Loading...
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};