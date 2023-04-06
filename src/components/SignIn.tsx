import React from "react";
import {Link} from 'react-router-dom';

function handleClick(e) {
    e.preventDefault();
    const login = document.querySelector("input[name='login']").value;
    const password = document.querySelector("input[name='password']").value;
    const confirm = document.querySelector("input[name='confirmPassword']").value;
    const email = document.querySelector("input[name='email']").value;
    const regex = /^([a-zA-Z]|[0-9]|-|_){4,15}$/;
    const error = document.querySelector(".error");

    if (password !== confirm) {
        if (error?.hasChildNodes()) {error.removeChild(error.firstElementChild);}
        let label = document.createElement('label');
        label.innerText = "Please enter the same passwords on the 2 fields.";
        label.addEventListener('click', function() {
            error?.removeChild(error.firstElementChild);
        });
        error?.appendChild(label);
    } else if (!login.match(regex)) {
        if (error?.hasChildNodes()) {error?.removeChild(error.firstElementChild);}
        let label = document.createElement('label');
        label.innerText = "Invalid login. Please enter between 4 and 15 characters (letters, digits and dashes).";
        label.addEventListener('click', function() {
            error?.removeChild(error.firstElementChild);
        });
        error?.appendChild(label);
    } else {
        if (error?.hasChildNodes()) {error.removeChild(error.firstElementChild);}
        const obj = JSON.stringify({
            "login": login,
            "password": password,
            "email": email
        });

        fetch('/user/register', {
            method: "POST",
            body: obj,
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => response.json())
        .then((result) => console.log(result));
    }
}

const SignIn=()=> {
    return (
        <div className="signin">
            <form action="" method="post" name="signin">
                <div>
                    <label htmlFor="login" className="signup">Login :&nbsp;</label>
                    <input type="text" name="login" required={true}/>
                </div>
                <br/>
                <div>
                    <label htmlFor="email" className="signup">Email :&nbsp;</label>
                    <input type="text" name="email" required={true}/>
                </div>
                <br/>
                <div>
                    <label htmlFor="password" className="signup">Password :&nbsp;</label>
                    <input type="password" name="password" required={true}/>
                </div>
                <br/>
                <div>
                    <label htmlFor="confirmPassword" className="signup">Confirm password :&nbsp;</label>
                    <input type="password" name="confirmPassword" required={true}/>
                </div>
                <br/>
                <div className="buttonHolder">
                    <input type="button" name="button" value={"Sign in"} onClick={handleClick}/>
                </div>
            </form>
            <div className="redirect">
                <label htmlFor="linkHomePage">Return to the&nbsp;</label>
                <Link to='/'>previous page</Link>
            </div>
            <div className="error"></div>
        </div>
    );
}

export default SignIn;