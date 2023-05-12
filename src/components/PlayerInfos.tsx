import React, {Component} from "react";

type PlayerInfosProps = {};

type PlayerInfosState = {
    playerName: string,
    money: number
};

class PlayerInfos extends Component<PlayerInfosProps, PlayerInfosState> {
    constructor(props) {
        super(props);

        this.state = {
            playerName: "Gyrehio",
            money: 0
        };
    }

    update() {
        const me = fetch('/user/me', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        });
    }

    render(): React.ReactNode {
        return(
            <div className="playerInfos">
                <img className="pfp" src={`/user/picture/${this.state.playerName}`} alt={this.state.playerName}/>
                <div className="playerStats">
                    <span>{this.state.playerName}</span><br/>
                    <span>${this.state.money}</span>
                </div>
            </div>
        );
    }
}

export default PlayerInfos;