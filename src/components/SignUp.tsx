import React, {Component} from "react";
import {Link, Navigate} from 'react-router-dom';

type SignUpProps = {};

type SignUpState = {
    login: string,
    email: string,
    password: string,
    confirmPassword: string,
    redirectUrl: string | null
}

class SignUp extends Component<SignUpProps, SignUpState> {
    constructor(props) {
        super(props);

        this.state = {
            login: "",
            email: "",
            password: "",
            confirmPassword: "",
            redirectUrl: null
        }
    }

    render() {
        return (
            <div className="signup">
                <div className="template">
                <h1>Welcome to UAPoly</h1>
                <img src={require("../images/UAPoly.png")} alt={"Logo UAPoly"}/>
            </div>
                {this.state.redirectUrl &&
                    <Navigate to={this.state.redirectUrl} replace={true}/>
                }
                <form name="signup">
                    <div>
                        <label htmlFor="login" className="signup">Login</label>
                        <input type="text" name="login" onChange={this.handleChangeLogin.bind(this)} required={true}/>
                    </div>
                    <br/>
                    <div>
                        <label htmlFor="email" className="signup">Email</label>
                        <input type="text" name="email" onChange={this.handleChangeEmail.bind(this)} required={true}/>
                    </div>
                    <br/>
                    <div>
                        <label htmlFor="password" className="signup">Password</label>
                        <input type="password" name="password" onChange={this.handleChangePassword.bind(this)} required={true}/>
                    </div>
                    <br/>
                    <div>
                        <label htmlFor="confirmPassword" className="signup">Confirm password</label>
                        <input type="password" name="confirmPassword" onChange={this.handleChangeConfirm.bind(this)} required={true}/>
                    </div>
                    <br/>
                    <div className="buttonHolder">
                        <input type="submit" name="button" value={"Sign up"} onClick={this.handleClick.bind(this)}/>
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

    handleChangeLogin(e) {
        this.setState({
            login: e.target.value,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            redirectUrl: null
        });
    }

    handleChangeEmail(e) {
        this.setState({
            login: this.state.login,
            email: e.target.value,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            redirectUrl: null
        });
    }

    handleChangePassword(e) {
        this.setState({
            login: this.state.login,
            email: this.state.email,
            password: e.target.value,
            confirmPassword: this.state.confirmPassword,
            redirectUrl: null
        });
    }

    handleChangeConfirm(e) {
        this.setState({
            login: this.state.login,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: e.target.value,
            redirectUrl: null
        });
    }

    handleClick(e) {
        e.preventDefault();
        const regex = /^([a-zA-Z]|[0-9]|-|_){4,15}$/;
        const error = document.querySelector(".error");
    
        if (this.state.password !== this.state.confirmPassword) {
            if (error?.hasChildNodes()) {error.removeChild(error.firstElementChild);}
            let label = document.createElement('label');
            label.innerText = "Please enter the same passwords on the 2 fields.";
            label.addEventListener('click', function() {
                error?.removeChild(error.firstElementChild);
            });
            error?.appendChild(label);
        } else if (!this.state.login.match(regex)) {
            if (error?.hasChildNodes()) {error?.removeChild(error.firstElementChild);}
            let label = document.createElement('label');
            console.log(this.state.login);
            label.innerText = "Invalid login. Please enter between 4 and 15 characters (letters, digits and dashes).";
            label.addEventListener('click', function() {
                error?.removeChild(error.firstElementChild);
            });
            error?.appendChild(label);
        } else {
            if (error?.hasChildNodes()) {error.removeChild(error.firstElementChild);}
            const obj = JSON.stringify({
                "login": this.state.login,
                "password": this.state.password,
                "email": this.state.email
            });

            const loader = async () => {
                const user = await (await fetch('/user/register', {
                    method: "POST",
                    body: obj,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })).json();

                if (user) {
                    if (user["message"] != null) {
                        alert(user["message"]);
                        this.setState({
                            login: "",
                            email: "",
                            password: "",
                            confirmPassword: "",
                            redirectUrl: null
                        });
                    } else {
                        localStorage.setItem("token",user["token"]);

                        this.setState({
                            login: this.state.login,
                            email: this.state.email,
                            password: this.state.password,
                            confirmPassword: this.state.confirmPassword,
                            redirectUrl: "/home"
                        });
                    }
                }
            };

            loader();
        }
    }
}

export default SignUp;