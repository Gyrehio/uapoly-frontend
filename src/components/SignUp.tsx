import React from "react";
import {Link} from 'react-router-dom';

function handleClick(e) {
    e.preventDefault();
    const login = document.querySelector("input[name='login']").value;
    const password = document.querySelector("input[name='password']").value;

    const obj = JSON.stringify({
        "login": login,
        "password": password
    });
    console.log(obj);
    
    fetch('/user/login', {
        method: "POST",
        body: obj,
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => response.json())
    .then((result) => {
        if (result["message"] != null) {
            alert(result["message"]);
        } else {
            localStorage.setItem("token",result["token"]);
        }
    });
}

const SignUp=()=> {
    return (
        <div className="signup">
            <form action="/user/login" method="post" name="signup">
                <div>
                    <label htmlFor="login" className="signup">Login :&nbsp;</label>
                    <input type="text" name="login" required={true}/>
                </div>
                <br/>
                <div>
                    <label htmlFor="password" className="signup">Password :&nbsp;</label>
                    <input type="password" name="password" required={true}/>
                </div>
                <br/>
                <div className="buttonHolder">
                    <input type="button" name="button" value={"Sign up"} onClick={handleClick}/>
                </div>
            </form>
            <div className="redirect">
                <label htmlFor="linkSignIn">Don't have an account ?&nbsp;</label>
                <Link to='/signin'>Sign in</Link>
            </div>
        </div>
    );
}

export default SignUp;