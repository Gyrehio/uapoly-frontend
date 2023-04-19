import React, {Component} from "react"
import NewGameDialog from "./NewGameDialog.tsx"
import JoinGameDialog from "./JoinGameDialog.tsx"

type GameButtonsProps = {}

type GameButtonsState = {
    newGameIsOpen: boolean,
    joinGameIsOpen: boolean
}

class GameButtons extends Component<GameButtonsProps, GameButtonsState> {
    constructor(props) {
        super(props);

        this.state = {
            newGameIsOpen: false,
            joinGameIsOpen: false
        };
    }

    render(): React.ReactNode {
        return(
            <div id="gameButtonHolder">
                <NewGameDialog />
                {/*<input type="button" name="joinGame" value={"Join a game"} onClick={this.handleJoin.bind(this)} />*/}
                <JoinGameDialog />
                {/*<input type="button" name="selectGame" value={"Select a game"} onClick={() => console.log("LET'S GO *stylophone intensifies*")} />*/}
            </div>
        );
    }

    createNewGame(e: Event) {
        const newGame = this.state.newGameIsOpen;
        const joinGame = this.state.joinGameIsOpen;

        this.setState({
            newGameIsOpen: !newGame,
            joinGameIsOpen: false
        });
    }

    joinGame(e: Event) {
        const newGame = this.state.newGameIsOpen;
        const joinGame = this.state.joinGameIsOpen;

        this.setState({
            newGameIsOpen: false,
            joinGameIsOpen: !joinGame
        });
    }

    handleJoin(e: Event) {
        e.preventDefault();

        let joinDialog = document.querySelector("#joinDialog");

        if (typeof joinDialog.showModal === "function") {
            joinDialog.showModal();
        } else {
            console.error("C pa possib");
        }
    }
}

export default GameButtons;