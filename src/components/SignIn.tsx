import React, {Component} from "react";
import {Link, Navigate} from 'react-router-dom';

type UserPageProps = {}

type UserPageState = {
    login: string,
    password: string,
    redirectUrl : string | null
}

class SignIn extends Component<UserPageProps, UserPageState> {
    constructor(props) {
        super(props);

        this.state = {
            login: "",
            password: "",
            redirectUrl: null,
        };
    }

    render(): React.ReactNode {
        return (
            <div className="signin">
                <div className="template">
                <h1>Welcome to UAPoly</h1>
                <img src={require("../images/UAPoly.png")} alt={"Logo UAPoly"}/>
            </div>
                {this.state.redirectUrl &&
                    <Navigate to={this.state.redirectUrl} replace={true}/>
                }

                <form name="signin">
                    <div>
                        <label htmlFor="login" className="signin">Login</label>
                        <input type="text" name="login" id="login" required={true} onChange={this.handleChangeLogin.bind(this)} value={this.state.login}/>
                    </div>
                    <br/>
                    <div>
                        <label htmlFor="password" className="signin">Password</label>
                        <input type="password" name="password" id="password" required={true} onChange={this.handleChangePassword.bind(this)} value={this.state.password} />
                    </div>
                    <br/>
                    <div className="buttonHolder">
                        <input type="submit" name="button" value={"Sign in"} onClick={this.handleClick.bind(this)}/>
                    </div>
                </form>
                <div className="redirect">
                    <label htmlFor="linkSignUp">Don't have an account ?&nbsp;</label>
                    <Link to='/signup'>Sign up</Link>
                </div>
            </div>
        );
    }

    handleClick(e) {
        e.preventDefault()

        const obj = JSON.stringify({
            "login": this.state.login,
            "password": this.state.password
        });

        const loader = async () => {
            const user = await (await fetch('/api/user/login', {
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
                        login: this.state.login,
                        password: "",
                        redirectUrl: null
                    });
                } else {
                    localStorage.setItem("token",user["token"]);
                    
                    this.setState({
                        login: this.state.login,
                        password: this.state.password,
                        redirectUrl: "/home",
                    });
                }
            }
        };
        
        loader();
    }

    handleChangeLogin(e) {
        this.setState({
            login: e.target.value,
            password: this.state.password
        })
    };

    handleChangePassword(e) {
        this.setState({
            login: this.state.login,
            password: e.target.value
        })
    };
}

export default SignIn;