import React, {Component} from "react"

type NewGameDialogProps = {}

type NewGameDialogState = {
    maxPlayers: number,
    salary: number,
    initialMoney: number,
    friendsOnly: boolean,
    password: string,
    locale: string
}

class NewGameDialog extends Component<NewGameDialogProps, NewGameDialogState> {
    constructor(props) {
        super(props);

        this.state = {
            maxPlayers: 2,
            salary: 500,
            initialMoney: 2500,
            friendsOnly: false,
            password: "",
            locale: "en-US"
        }
    }

    handlePlayers(e) {
        this.setState({
            maxPlayers: e.target.value,
            salary: this.state.salary,
            initialMoney: this.state.initialMoney,
            friendsOnly: this.state.friendsOnly,
            password: this.state.password,
            locale: this.state.locale
        });
    }

    handleSalary(e) {
        this.setState({
            maxPlayers: this.state.maxPlayers,
            salary: e.target.value,
            initialMoney: this.state.initialMoney,
            friendsOnly: this.state.friendsOnly,
            password: this.state.password,
            locale: this.state.locale
        });
    }

    handleInitial(e) {
        this.setState({
            maxPlayers: this.state.maxPlayers,
            salary: this.state.salary,
            initialMoney: e.target.value,
            friendsOnly: this.state.friendsOnly,
            password: this.state.password,
            locale: this.state.locale
        });
    }

    handleFriends(e) {
        if (e.target.value === "true") {
            this.setState({
                maxPlayers: this.state.maxPlayers,
                salary: this.state.salary,
                initialMoney: this.state.initialMoney,
                friendsOnly: true,
                password: this.state.password,
                locale: this.state.locale
            });
        } else {
            this.setState({
                maxPlayers: this.state.maxPlayers,
                salary: this.state.salary,
                initialMoney: this.state.initialMoney,
                friendsOnly: false,
                password: this.state.password,
                locale: this.state.locale
            });
        }
    }

    handlePassword(e) {
        this.setState({
            maxPlayers: this.state.maxPlayers,
            salary: this.state.salary,
            initialMoney: this.state.initialMoney,
            friendsOnly: this.state.friendsOnly,
            password: e.target.value,
            locale: this.state.locale
        });
    }

    handleLocale(e) {
        this.setState({
            maxPlayers: this.state.maxPlayers,
            salary: this.state.salary,
            initialMoney: this.state.initialMoney,
            friendsOnly: this.state.friendsOnly,
            password: this.state.password,
            locale: e.target.value
        });
        console.log(this.state);
    }

    handleClick(e) {
        e.preventDefault();

        const obj = JSON.stringify({
            "maxPlayers": this.state.maxPlayers,
            "salary": this.state.salary,
            "initialMoney": this.state.initialMoney,
            "friendsOnly": this.state.friendsOnly,
            "password": this.state.password,
            "locale": this.state.locale
        });
        console.log(obj);

        const loader = async () => {
            const user = await (await fetch('/game/create', {
                method: "POST",
                body: obj,
                headers: {
                    "Authorization": "Bearer ".concat(localStorage.token),
                    "Content-Type": "application/json"
                }
            })).json();

            if (user) {
                if (user["message"] != null) {
                    alert(user["message"]);
                    this.setState({
                        maxPlayers: 2,
                        salary: 500,
                        initialMoney: 2500,
                        friendsOnly: false,
                        password: "",
                        locale: "en-US"
                    });
                } else {
                    console.log("Game is created !");
                }
            }
        };
        
        loader();
    }

    render(): React.ReactNode {
        return(
            <div id="newGameDialog">
                <form name="newGameDialog">
                    <div>
                        <label htmlFor="password">Board language :&nbsp;</label>
                        <select onChange={this.handleLocale.bind(this)} name="locale">
                            <option value="en-US">American Board</option>
                            <option value="fr-FR">Plateau français</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="maxPlayers">Maximum players :&nbsp;</label>
                        <input type="number" min={2} max={2147483647} onChange={this.handlePlayers.bind(this)} value={this.state.maxPlayers} name="maxPlayers" required={true} />
                    </div>
                    <div>
                        <label htmlFor="salary">Salary :&nbsp;</label>
                        <input type="number" onChange={this.handleSalary.bind(this)} value={this.state.salary} name="salary" required={true} />
                    </div>
                    <div>
                        <label htmlFor="initialMoney">Initial money :&nbsp;</label>
                        <input type="number" min={1} onChange={this.handleInitial.bind(this)} value={this.state.initialMoney} name="initialMoney" required={true} />
                    </div>
                    <div>
                        <label htmlFor="onlyFriends">Only friends ?&nbsp;</label><br/>
                        <input type="radio" name="onlyFriends" onChange={this.handleFriends.bind(this)} value={"true"} required={true} />
                        <label>Yes</label>
                        <input type="radio" name="onlyFriends" onChange={this.handleFriends.bind(this)} checked={true} value={"false"} required={true} />
                        <label>No</label>
                    </div>
                    <div>
                        <label htmlFor="password">Password :&nbsp;</label>
                        <input type="password" onChange={this.handlePassword.bind(this)} name="password" />
                    </div>
                    <div className="buttonHolder">
                        <input type="submit" name="button" value={"Confirm"} onClick={this.handleClick.bind(this)}/>
                    </div>
                </form>
            </div>
        );
    }
}

export default NewGameDialog;