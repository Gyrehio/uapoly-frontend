import React, {Component} from "react";

import UserHeader from "./UserHeader.tsx";
import GameButtons from "./GameButtons.tsx";
import Footer from "./Footer.tsx";

type UserPageProps = {}

type UserPageState = {
    joinedGames: object[]
}

class UserPage extends Component<UserPageProps, UserPageState> {
    constructor(props) {
        super(props);

        this.state = {
            joinedGames: []
        };

        this.getGames();
    }

    getGames() {
        fetch("/game/join", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        })
        .then((result) => result.json())
        .then((data) => data.map((game) => {
            this.state.joinedGames.push({"name": game.name, "gameId": game.id})
        }))
        .then(() => this.forceUpdate());
    }

    render(): React.ReactNode {
        return(
            <>
                <UserHeader />
                <div className="userpage">
                    <GameButtons />
                    <div className="games">
                        <h2>Joined games</h2>
                        {this.state.joinedGames.map((game) => (
                        <>
                            <span>{game["name"]+" - "+game["gameId"]}</span>
                            <br/>
                        </>
                        ))}
                    </div>
                </div> 
                <Footer />
            </>
        );
    }
}

export default UserPage;