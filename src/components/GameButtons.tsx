import React, {Component} from "react"
import NewGameDialog from "./NewGameDialog.tsx"
import JoinGameDialog from "./JoinGameDialog.tsx"

type GameButtonsProps = {}

type GameButtonsState = {
}

class GameButtons extends Component<GameButtonsProps, GameButtonsState> {

    render(): React.ReactNode {
        return(
            <div id="gameButtonHolder">
                <NewGameDialog />
                <JoinGameDialog />
            </div>
        );
    }
}

export default GameButtons;