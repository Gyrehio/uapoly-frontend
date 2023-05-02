import React, {Component} from "react";
import {Navigate} from 'react-router-dom';

type UserHeaderProps = {};

type UserHeaderState = {
    login: string,
    redirectUrl: string | null
}

class UserHeader extends Component<UserHeaderProps, UserHeaderState> {
    constructor(props) {
        super(props);

        if (localStorage.token) {
            this.state = {
                login: "",
                redirectUrl: null
            };
    
            fetch('/user/me', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer ".concat(localStorage.token)
                }
            })
            .then((result) => result.json())
            .then((res) => this.setState({
                login: res.login,
                redirectUrl: null
            }));
        } else {
            this.state = {
                login: "",
                redirectUrl: "/"
            };
        }
    }

    disconnect(e) {
        e.preventDefault();
        localStorage.removeItem("token");
        this.setState({
            login: "",
            redirectUrl: "/"
        });
    }

    generateRedirectFunction(url: string) {
        return (e: Event) => {
            e.preventDefault()
            
            if(!window.location.href.endsWith(url)) {
                this.setState({
                    login: '',
                    redirectUrl: url,
                });
            }
        }
    }

    render(): React.ReactNode {
        return (
            <div className="userheader">
                <>
                    <div className="flex" onClick={this.generateRedirectFunction('/home').bind(this)}>
                        <img src={require("../images/UAPoly.png")} alt={"Logo UAPoly"} />
                        <h1 id="title">UAPoly</h1>
                    </div>
                    <div className="optionsHolder">
                        <img className="pfp" src={`/user/picture/${this.state.login}`} alt="Account" onClick={(this.generateRedirectFunction('/user').bind(this))}/>
                        <input type="button" name="friends" value={"Friends"} onClick={this.generateRedirectFunction('/friends').bind(this)} />
                        <input type="button" name="disconnect" value={"Log out"} onClick={this.disconnect.bind(this)} />
                    </div>
                </>
                {this.state.redirectUrl &&
                    <Navigate to={this.state.redirectUrl} replace={true} />
                }

            </div>
        );
    }
}

export default UserHeader;