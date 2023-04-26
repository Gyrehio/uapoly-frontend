import React, {Component} from "react";

type GamePageProps = {};

type GamePageState = {};

class GamePage extends Component<GamePageProps, GamePageState> {
    constructor(props) {
        super(props);
    }

    render(): React.ReactNode {
        return(
            <div className="game">
                <table>
                    <tr>
                        <td>Free parking</td>
                        <td>Red 1</td>
                        <td>Chance</td>
                        <td>Red 2</td>
                        <td>Red 3</td>
                        <td>Train 3</td>
                        <td>Yellow 1</td>
                        <td>Yellow 2</td>
                        <td>Utility 2</td>
                        <td>Yellow 3</td>
                        <td>Go to Jail</td>
                    </tr>
                    <tr>
                        <td>Orange 3</td>
                        <td className="void" colSpan={9} />
                        <td>Green 1</td>
                    </tr>
                    <tr>
                        <td>Orange 2</td>
                        <td className="void" colSpan={9} />
                        <td>Green 2</td>
                    </tr>
                    <tr>
                        <td>Chest</td>
                        <td className="void" colSpan={9} />
                        <td>Chest</td>
                    </tr>
                    <tr>
                        <td>Orange 1</td>
                        <td className="void" colSpan={9} />
                        <td>Green 3</td>
                    </tr>
                    <tr>
                        <td>Train 2</td>
                        <td className="void" colSpan={9} />
                        <td>Train 4</td>
                    </tr>
                    <tr>
                        <td>Pink 3</td>
                        <td className="void" colSpan={9} />
                        <td>Chance</td>
                    </tr>
                    <tr>
                        <td>Pink 2</td>
                        <td className="void" colSpan={9} />
                        <td>Blue 1</td>
                    </tr>
                    <tr>
                        <td>Utility 1</td>
                        <td className="void" colSpan={9} />
                        <td>Tax</td>
                    </tr>
                    <tr>
                        <td>Pink 1</td>
                        <td className="void" colSpan={9} />
                        <td>Blue 2</td>
                    </tr>
                    <tr>
                        <td>Jail/ Visit</td>
                        <td>White 3</td>
                        <td>White 2</td>
                        <td>Chance</td>
                        <td>White 1</td>
                        <td>Train 1</td>
                        <td>Tax</td>
                        <td>Brown 2</td>
                        <td>Chest</td>
                        <td>Brown 1</td>
                        <td>Start</td>
                    </tr>
                </table>
            </div>
        );
    }
}

export default GamePage;