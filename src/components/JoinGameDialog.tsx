import React, {Component} from "react"

type JoinGameDialogProps = {};

type JoinGameDialogState = {
    gameId: number,
    password: string
};

class JoinGameDialog extends Component<JoinGameDialogProps, JoinGameDialogState> {
    constructor(props) {
        super(props);

        this.state = {
            gameId: 0,
            password: ""
        }
    }

    handleId(e) {
        this.setState({
            gameId: e.target.value,
            password: this.state.password
        });
    }

    handlePassword(e) {
        this.setState({
            gameId: this.state.gameId,
            password: e.target.value
        });
    }

    handleClick(e) {
        e.preventDefault();

        const obj = JSON.stringify({
            "gameId": this.state.gameId,
            "password": this.state.password
        });
        console.log(obj);

        const loader = async () => {
            const user = await (await fetch('/game/join', {
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
                        gameId: 0,
                        password: ""
                    });
                } else {
                    console.log("Game is joined !");
                }
            }
        };
        
        loader();
    }

    render(): React.ReactNode {
        return(
            <div id="joinGameDialog">
                <form name="joinGameDialog">
                    <div>
                        <label htmlFor="gameId">Game ID :&nbsp;</label>
                        <input type="number" min={1} onChange={this.handleId.bind(this)} value={this.state.gameId} name="gameId" required={true} />
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

export default JoinGameDialog;