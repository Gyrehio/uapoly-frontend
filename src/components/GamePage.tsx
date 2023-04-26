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
                    <tbody>
                        <tr>
                            <td>Free parking</td>
                            <td className="red">Red 1</td>
                            <td className="chance">Chance</td>
                            <td className="red">Red 2</td>
                            <td className="red">Red 3</td>
                            <td className="train">Train 3</td>
                            <td className="yellow">Yellow 1</td>
                            <td className="yellow">Yellow 2</td>
                            <td className="utility">Utility 2</td>
                            <td className="yellow">Yellow 3</td>
                            <td className="jail">Go to Jail</td>
                        </tr>
                        <tr>
                            <td className="orange">Orange 3</td>
                            <td className="void" colSpan={9} />
                            <td className="green">Green 1</td>
                        </tr>
                        <tr>
                            <td className="orange">Orange 2</td>
                            <td className="void" colSpan={9} />
                            <td className="green">Green 2</td>
                        </tr>
                        <tr>
                            <td className="chest">Chest</td>
                            <td className="void" colSpan={9} />
                            <td className="chest">Chest</td>
                        </tr>
                        <tr>
                            <td className="orange">Orange 1</td>
                            <td className="void" colSpan={9} />
                            <td className="green">Green 3</td>
                        </tr>
                        <tr>
                            <td className="train">Train 2</td>
                            <td className="void" colSpan={9} />
                            <td className="train">Train 4</td>
                        </tr>
                        <tr>
                            <td className="pink">Pink 3</td>
                            <td className="void" colSpan={9} />
                            <td className="chance">Chance</td>
                        </tr>
                        <tr>
                            <td className="pink">Pink 2</td>
                            <td className="void" colSpan={9} />
                            <td className="blue">Blue 1</td>
                        </tr>
                        <tr>
                            <td className="utility">Utility 1</td>
                            <td className="void" colSpan={9} />
                            <td className="tax">Tax</td>
                        </tr>
                        <tr>
                            <td className="pink">Pink 1</td>
                            <td className="void" colSpan={9} />
                            <td className="blue">Blue 2</td>
                        </tr>
                        <tr>
                            <td className="jail">Jail/ Visit</td>
                            <td className="white">White 3</td>
                            <td className="white">White 2</td>
                            <td className="chance">Chance</td>
                            <td className="white">White 1</td>
                            <td className="train">Train 1</td>
                            <td className="tax">Tax</td>
                            <td className="brown">Brown 2</td>
                            <td className="chest">Chest</td>
                            <td className="brown">Brown 1</td>
                            <td className="start">Start</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default GamePage;