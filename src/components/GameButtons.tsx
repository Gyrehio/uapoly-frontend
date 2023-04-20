import React, {Component} from "react";
import NewGameDialog from "./NewGameDialog.tsx";
import JoinGameDialog from "./JoinGameDialog.tsx";
import SelectGameDialog from "./SelectGameDialog.tsx";

type GameButtonsProps = {}

type GameButtonsState = {};

class GameButtons extends Component<GameButtonsProps, GameButtonsState> {

    render(): React.ReactNode {
        return(
            <div id="gameButtonHolder">
                <NewGameDialog />
                <JoinGameDialog />
                <SelectGameDialog />
            </div>
        );
    }
}

export default GameButtons;