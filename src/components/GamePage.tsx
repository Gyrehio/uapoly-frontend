import React, {Component} from "react";
import Footer from "./Footer.tsx";
import UserHeader from "./UserHeader.tsx";

type GamePageProps = {};

type GamePageState = {};

class GamePage extends Component<GamePageProps, GamePageState> {
    constructor(props) {
        super(props);
    }

    render(): React.ReactNode {
        return(
            <>
            <UserHeader />
            <div className="game">
                <table>
                    <tbody>
                        <tr>
                            <td><img className="slotImage" src="/parking.svg" alt="Free Parking"/></td>
                            <td className="red">Red 1</td>
                            <td className="chance"><img className="slotImage" src="/chance.svg" alt="Chance"/></td>
                            <td className="red">Red 2</td>
                            <td className="red">Red 3</td>
                            <td className="train">Train 3</td>
                            <td className="yellow">Yellow 1</td>
                            <td className="yellow">Yellow 2</td>
                            <td className="utility">Utility 2</td>
                            <td className="yellow">Yellow 3</td>
                            <td className="jail"><img className="slotImage goToJail" src="/whistle.svg" alt="Go to Jail"/></td>
                        </tr>
                        <tr>
                            <td className="orange">Orange 3</td>
                            <td className="void" colSpan={9} rowSpan={2} />
                            <td className="green">Green 1</td>
                        </tr>
                        <tr>
                            <td className="orange">Orange 2</td>
                            <td className="green">Green 2</td>
                        </tr>
                        <tr>
                            <td className="chest"><img className="slotImage" src="/chest.svg" alt="Chest"/></td>
                            <td className="void" colSpan={3} rowSpan={5}/>
                            <td className="centerDisplay" colSpan={3} rowSpan={5}><img className="imageCenter" src="/UAPoly.png" alt="UAPoly"/></td>
                            <td className="void" colSpan={3} rowSpan={5}/>
                            <td className="chest"><img className="slotImage" src="/chest.svg" alt="Chest"/></td>
                        </tr>
                        <tr>
                            <td className="orange">Orange 1</td>
                            <td className="green">Green 3</td>
                        </tr>
                        <tr>
                            <td className="train">Train 2</td>
                            <td className="train"><span><span>Train 4</span></span></td>
                        </tr>
                        <tr>
                            <td className="pink">Pink 3</td>
                            <td className="chance"><img className="slotImage" src="/chance.svg" alt="Chance"/></td>
                        </tr>
                        <tr>
                            <td className="pink">Pink 2</td>
                            <td className="blue">Blue 1</td>
                        </tr>
                        <tr>
                            <td className="utility">Utility 1</td>
                            <td className="void" colSpan={9} rowSpan={2} />
                            <td className="tax">Tax</td>
                        </tr>
                        <tr>
                            <td className="pink">Pink 1</td>
                            <td className="blue">Blue 2</td>
                        </tr>
                        <tr>
                            <td className="jail">Jail or Visit</td>
                            <td className="white">White 3</td>
                            <td className="white">White 2</td>
                            <td className="chance"><img className="slotImage" src="/chance.svg" alt="Chance"/></td>
                            <td className="white">White 1</td>
                            <td className="train">Train 1</td>
                            <td className="tax">Tax</td>
                            <td className="brown">Brown 2</td>
                            <td className="chest"><img className="slotImage" src="/chest.svg" alt="Chest"/></td>
                            <td className="brown">Brown 1</td>
                            <td className="start"><img className="slotImage arrow" src="/arrow.svg" alt="Start"/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Footer />
            </>
            
        );
    }
}

export default GamePage;