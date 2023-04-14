import React, {Component} from "react";
import {Link, Navigate, redirect} from 'react-router-dom';

type UserHeaderProps = {};

type UserHeaderState = {
    login: string,
    redirectUrl: string | null
}

class UserHeader extends Component<UserHeaderProps, UserHeaderState> {
    constructor(props) {
        super(props);

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
       
    }

    disconnect(e) {
        e.preventDefault();
        localStorage.removeItem("token");
        this.setState({
            login: "",
            redirectUrl: "/"
        });
    }

    render(): React.ReactNode {
        return (
            <div className="userheader">
                {this.state.redirectUrl &&
                    <Navigate to={this.state.redirectUrl} replace={true} />
                }
                <h1>Welcome {this.state.login}</h1>
                <input type="button" name="disconnect" value={"Log out"} onClick={this.disconnect.bind(this)} />
            </div>
        );
    }
}

export default UserHeader;