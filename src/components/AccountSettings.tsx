import React, {Component} from "react";
import UserHeader from "./UserHeader.tsx";

type AccountSettingsProps = {};

type AccountSettingsState = {
    login: string,
    email: string
};

class AccountSettings extends Component<AccountSettingsProps, AccountSettingsState> {
    constructor(props) {
        super(props);

        this.state = {
            login: "",
            email: ""
        };

        this.update();
    }

    update() {
        this.setState({
            login: "",
            email: ""
        });

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
                            <input type="password" className="passwordForm" name="actualPswd" required onChange={() => console.log("Ok")} />
                        </div>
                        <br/>
                        <div>
                            <label>New password</label><br/>
                            <input type="password" className="passwordForm" name="newPswd" required onChange={() => console.log("Ok")} />
                        </div>
                        <br/>
                        <div>
                            <label>Confirm password</label>
                            <input type="password" className="passwordForm" name="confirmPswd" required onChange={() => console.log("Ok")} />
                        </div>
                        <br/>
                        <div>
                            <input type="button" name="button" value={"Confirm"} />
                        </div>
                    </form>
                </div>
            </>
            
        );
    }
}

export default AccountSettings;