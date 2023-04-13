export function SignUp(){
    return(
        <div id="login-container">
            <div class="login-box">
                <div class="login-title mt-2">
                    <h1 class="text-center">Sign up</h1>

                    <div class="input-container">
                        <div class="form-group mt-2">
                            <label for="exampleInputEmail1">Email address</label>
                            <input type="email" class="form-control" id="email" aria-describedby="emailHelp" onkeyup="enterSignUp()" />
                        </div>

                        <div class="form-group mt-2">
                            <label for="exampleInputEmail1">Full Name</label>
                            <input type="text" class="form-control" id="full-name" aria-describedby="emailHelp" onkeyup="enterSignUp()" />
                        </div>

                        <div class="form-group mt-2">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" class="form-control" id="password" onkeyup="enterSignUp()" />
                        </div>

                        <div class="form-group mt-2">
                            <label for="exampleInputPassword1">Confirm Password</label>
                            <input type="password" class="form-control" id="confirm-password" onkeyup="enterSignUp()" />
                            Already have an account? <a href="login">Login now</a>!
                        </div>
                        
                        <div class="form-group" id="error-prompt" style={{color : "red"}}></div>

                        <div class="form-group mt-3">
                            <button type="submit" class="btn btn-primary" onclick="signUp()">Sign up</button>

                            <div class="text-info" id="signup-loader" role="status" style={{display : "none"}}>
                                <span class="mt-3 ml-1 spinner-border spinner-border-sm"></span>
                                Loading...
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};