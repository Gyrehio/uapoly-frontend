import React, {Component} from "react";
import {Link, useNavigate} from 'react-router-dom';

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
            const navigate = useNavigate();
            navigate("/user");
        }
    });
}

class SignIn extends Component {
    constructor(props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div className="signin">
                <form action="/user/login" method="post" name="signin">
                    <div>
                        <label htmlFor="login" className="signin">Login :&nbsp;</label>
                        <input type="text" name="login" required={true}/>
                    </div>
                    <br/>
                    <div>
                        <label htmlFor="password" className="signin">Password :&nbsp;</label>
                        <input type="password" name="password" required={true}/>
                    </div>
                    <br/>
                    <div className="buttonHolder">
                        <input type="button" name="button" value={"Sign in"} onClick={handleClick}/>
                    </div>
                </form>
                <div className="redirect">
                    <label htmlFor="linkSignUp">Don't have an account ?&nbsp;</label>
                    <Link to='/signup'>Sign up</Link>
                </div>
            </div>
        );
    }
}

export default SignIn;