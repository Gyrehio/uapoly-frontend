import React, {Component} from "react";
import UserHeader from "./UserHeader.tsx";

type AccountSettingsProps = {};

type AccountSettingsState = {
    login: string,
    email: string,
    oldPassword: string,
    newPassword: string,
    confirm: string
};

class AccountSettings extends Component<AccountSettingsProps, AccountSettingsState> {
    constructor(props) {
        super(props);

        this.state = {
            login: "",
            email: "",
            oldPassword: "",
            newPassword: "",
            confirm: ""
        };

        this.update();
    }

    handleOldPassword(e) {
        this.setState({
            oldPassword: e.target.value
        });
    }

    handleNewPassword(e) {
        this.setState({
            newPassword: e.target.value
        });
    }

    handleConfirmPassword(e) {
        this.setState({
            confirm: e.target.value
        });
    }

    handleClick(e) {
        e.preventDefault();

        if (this.state.newPassword !== this.state.confirm) {
            this.setState({
                newPassword: "",
                confirm: ""
            });
            alert("Please make sure the new password and the confirm password are the same.");
        } else {
            const obj = JSON.stringify({
                "oldPassword": this.state.oldPassword,
                "newPassword": this.state.newPassword
            });

            const loader = async () => {
                const user = await (await fetch('/user/change-password', {
                    method: "POST",
                    body: obj,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer ".concat(localStorage.token)
                    }
                })).json();
    
                if (user) {
                    this.setState({
                        oldPassword: "",
                        newPassword: "",
                        confirm: ""
                    });
                    alert(user["message"]);
                }
            };
            
            loader();
        }
    }

    update() {
        fetch('/user/me', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        })
        .then((me) => me.json())
        .then((result) => this.setState({
            login: result.login,
            email: result.email
        }))
    }

    render() {
        return(
            <>
                <UserHeader />
                <div className="displayInfos">
                    <div className="infoTitle">
                        <label className="title" htmlFor="title">Your account details</label>
                    </div>
                    <div>
                        <label className="infos" htmlFor="loginLabel">Login : {this.state.login}</label>
                    </div>
                    <div>
                        <label className="infos" htmlFor="emailLabel">Email : {this.state.email}</label>
                    </div>
                </div>
                <div className="passwordForm">
                    <form name="changePassword">
                        <div>
                            <label>Change your password</label>
                        </div>
                        <br/>
                        <div>
                            <label>Actual password</label><br/>
                            <input type="password" className="passwordForm" name="actualPswd" required onChange={this.handleOldPassword.bind(this)} value={this.state.oldPassword} />
                        </div>
                        <br/>
                        <div>
                            <label>New password</label><br/>
                            <input type="password" className="passwordForm" name="newPswd" required onChange={this.handleNewPassword.bind(this)} value={this.state.newPassword} />
                        </div>
                        <br/>
                        <div>
                            <label>Confirm password</label>
                            <input type="password" className="passwordForm" name="confirmPswd" required onChange={this.handleConfirmPassword.bind(this)} value={this.state.confirm} />
                        </div>
                        <br/>
                        <div>
                            <input type="button" name="button" value={"Confirm"} onClick={this.handleClick.bind(this)} />
                        </div>
                    </form>
                </div>
            </>
            
        );
    }
}

export default AccountSettings;