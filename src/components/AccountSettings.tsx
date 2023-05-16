import React, {Component} from "react";
import UserHeader from "./UserHeader.tsx";
import Footer from "./Footer.tsx";

type AccountSettingsProps = {};

type AccountSettingsState = {
    login: string,
    email: string,
    oldPassword: string,
    newPassword: string,
    confirmPswd: string,
    newMail: string,
    confirmMail: string,
    pswdMail: string
};

class AccountSettings extends Component<AccountSettingsProps, AccountSettingsState> {
    constructor(props) {
        super(props);

        this.state = {
            login: "",
            email: "",
            oldPassword: "",
            newPassword: "",
            confirmPswd: "",
            newMail: "",
            confirmMail: "",
            pswdMail: ""
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
            confirmPswd: e.target.value
        });
    }

    handleNewMail(e) {
        this.setState({
            newMail: e.target.value
        });
    }

    handleConfirmMail(e) {
        this.setState({
            confirmMail: e.target.value
        });
    }

    handlePassword(e) {
        this.setState({
            pswdMail: e.target.value
        });
    }

    handleClick(e) {
        e.preventDefault();

        if (this.state.newPassword !== this.state.confirmPswd) {
            this.setState({
                newPassword: "",
                confirmPswd: ""
            });
            alert("Please make sure the new password and the confirm password are the same.");
        } else {
            const obj = JSON.stringify({
                "oldPassword": this.state.oldPassword,
                "newPassword": this.state.newPassword
            });

            const loader = async () => {
                const user = await (await fetch('/api/user/change-password', {
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
                        confirmPswd: ""
                    });
                    alert(user["message"]);
                }
            };
            
            loader();
        }
    }

    handleClickMail(e) {
        e.preventDefault();

        if (this.state.newMail !== this.state.confirmMail) {
            this.setState({
                newMail: "",
                confirmMail: ""
            });
            alert("Please make sure the new Email address and the confirm Email address are the same.");
        } else {
            const obj = JSON.stringify({
                "email": this.state.newMail,
                "password": this.state.pswdMail
            });

            const loader = async () => {
                const user = await (await fetch('/api/user/change-email', {
                    method: "POST",
                    body: obj,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer ".concat(localStorage.token)
                    }
                })).json();
    
                if (user) {
                    this.setState({
                        newMail: "",
                        confirmMail: "",
                        pswdMail: ""
                    });
                    alert(user["message"]);
                    this.update();
                }
            };
            
            loader();
        }
    }

    update() {
        fetch('/api/user/me', {
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
                <div className="changeForms">
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
                                <label>Confirm password</label><br/>
                                <input type="password" className="passwordForm" name="confirmPswd" required onChange={this.handleConfirmPassword.bind(this)} value={this.state.confirmPswd} />
                            </div>
                            <br/>
                            <div>
                                <input type="button" name="button" value={"Confirm"} onClick={this.handleClick.bind(this)} />
                            </div>
                        </form>
                    </div>
                    <div className="emailForm">
                        <form name="changeEmail">
                            <div>
                                <label>Change your Email address</label>
                            </div>
                            <br/>
                            <div>
                                <label>New Email address</label><br/>
                                <input type="text" className="emailForm" name="newEmail" required onChange={this.handleNewMail.bind(this)} value={this.state.newMail} />
                            </div>
                            <br/>
                            <div>
                                <label>Confirm Email address</label><br/>
                                <input type="text" className="emailForm" name="confirmEmail" required onChange={this.handleConfirmMail.bind(this)} value={this.state.confirmMail} />
                            </div>
                            <br/>
                            <div>
                                <label>Password</label><br/>
                                <input type="password" className="emailForm" name="pswd" required onChange={this.handlePassword.bind(this)} value={this.state.pswdMail} />
                            </div>
                            <br/>
                            <div>
                                <input type="button" name="button" value={"Confirm"} onClick={this.handleClickMail.bind(this)} />
                            </div>
                        </form>
                    </div>
                </div>
                <Footer />
            </>
            
        );
    }
}

export default AccountSettings;