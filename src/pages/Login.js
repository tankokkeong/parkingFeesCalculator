export function Login(){
    return (
        <div id="login-container">
            <div class="login-box">
                <div class="login-title mt-2">
                    <h1 class="text-center">Login</h1>

                    <div class="input-container">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Email address</label>
                            <input type="email" class="form-control" id="email" onkeyup="enterSignIn()" />
                        </div>

                        <div class="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" class="form-control" id="password" onkeyup="enterSignIn()" />
                            No account? <a href="signup">Sign Up</a> now!
                        </div>
                        
                        <div class="form-group" id="error-prompt" style="color:red;"></div>

                        <div class="form-group mt-3">
                            <button type="submit" class="btn btn-primary" onclick="login()">Login</button>

                            <div class="text-info" id="login-loader" role="status" style="display: none;">
                                <span class="mt-3 ml-1 spinner-border spinner-border-sm"></span>
                                Loading...
                            </div>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        </div>
    );
}