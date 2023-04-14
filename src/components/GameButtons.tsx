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
                <input type="button" name="createNewGame" value={"Create a new game"} onClick={this.createNewGame.bind(this)} />
                {this.state.newGameIsOpen && (
                    <NewGameDialog />
                )}
                {this.state.joinGameIsOpen && (
                    <JoinGameDialog />
                )}
                <input type="button" name="joinGame" value={"Join a game"} onClick={this.joinGame.bind(this)} />
            </div>
        );
    }

    createNewGame(e) {
        const newGame = this.state.newGameIsOpen;
        const joinGame = this.state.joinGameIsOpen;

        this.setState({
            newGameIsOpen: !newGame,
            joinGameIsOpen: false
        });
    }

    joinGame(e) {
        const newGame = this.state.newGameIsOpen;
        const joinGame = this.state.joinGameIsOpen;

        this.setState({
            newGameIsOpen: false,
            joinGameIsOpen: !joinGame
        });
    }
}

export default GameButtons;