import React, {Component} from "react";

type UserHeaderProps = {};

type UserHeaderState = {
    login: string
}

class UserHeader extends Component<UserHeaderProps, UserHeaderState> {
    constructor(props) {
        super(props);

        let states: UserHeaderState = {
            login: ""
        };

        this.state = {
            login: ""
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
            login: res.login
        }));
       
    }

    render(): React.ReactNode {
        return (
            <div className="userheader">
                <h1>Welcome {this.state.login}</h1>
            </div>
        );
    }
}

export default UserHeader;