import React, {Component} from "react";
import Footer from "./Footer.tsx";
import UserHeader from "./UserHeader.tsx";

type GamePageProps = {};

type GamePageState = {
    slotClicked: boolean,
    indexClicked: number | null,
    slotName: string | null,
    slotType: string | undefined
};

class GamePage extends Component<GamePageProps, GamePageState> {
    constructor(props) {
        super(props);

        this.state = {
            slotClicked: false,
            indexClicked: null,
            slotName: null,
            slotType: undefined
        }
    }

    displaySlot(e) {
        if (e.target.innerText === this.state.slotName) {
            this.setState({
                slotClicked: !this.state.slotClicked
            });
        } else {
            this.setState({
                slotClicked: true,
                indexClicked: parseInt(e.target.id),
                slotName: e.target.innerText,
                slotType: (Array.from(e.target.classList) as string[]).find((x) => {
                    if (x.startsWith("slot-")) return true
                    else return false;
                })
            });
        }
    }

    displaySlotImage(e) {
        if (e.target.innerText === this.state.slotName) {
            this.setState({
                slotClicked: !this.state.slotClicked
            });
        } else {
            this.setState({
                slotClicked: true,
                indexClicked: parseInt(e.target.id),
                slotName: e.target.alt,
                slotType: (Array.from(e.target.classList) as string[]).find((x) => {
                    if (x.startsWith("slot-")) return true
                    else return false;
                })
            });
        }
    }

    render(): React.ReactNode {
        return(
            <>
            <UserHeader />
            <div className="game">
                <table>
                    <tbody>
                        <tr>
                            <td id="20"><img id="20" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-freeParking" src="/parking.svg" alt="Free Parking"/></td>
                            <td id="21" onClick={this.displaySlot.bind(this)} className="red slot-property">Red 1</td>
                            <td id="22" className="chance"><img id="22" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-chance" src="/chance.svg" alt="Chance"/></td>
                            <td id="23" onClick={this.displaySlot.bind(this)} className="red slot-property">Red 2</td>
                            <td id="24" onClick={this.displaySlot.bind(this)} className="red slot-property">Red 3</td>
                            <td id="25" className="train"><img id="25" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-train" src="/train.svg" alt="Train 1"/></td>
                            <td id="26" onClick={this.displaySlot.bind(this)} className="yellow slot-property">Yellow 1</td>
                            <td id="27" onClick={this.displaySlot.bind(this)} className="yellow slot-property">Yellow 2</td>
                            <td id="28" onClick={this.displaySlot.bind(this)} className="utility slot-utility">Utility 2</td>
                            <td id="29" onClick={this.displaySlot.bind(this)} className="yellow slot-property">Yellow 3</td>
                            <td id="30" className="jail"><img id="30" onClick={this.displaySlotImage.bind(this)} className="slotImage goToJail slot-goToJail" src="/whistle.svg" alt="Go to Jail"/></td>
                        </tr>
                        <tr>
                            <td id="19" onClick={this.displaySlot.bind(this)} className="orange slot-property">Orange 3</td>
                            <td className="void" colSpan={9} rowSpan={2} />
                            <td id="31" onClick={this.displaySlot.bind(this)} className="green slot-property">Green 1</td>
                        </tr>
                        <tr>
                            <td id="18" onClick={this.displaySlot.bind(this)} className="orange slot-property">Orange 2</td>
                            <td id="32" onClick={this.displaySlot.bind(this)} className="green slot-property">Green 2</td>
                        </tr>
                        <tr>
                            <td id="17" className="chest"><img id="17" className="slotImage slot-chest" src="/chest.svg" alt="Chest"/></td>
                            <td className="void" colSpan={3} rowSpan={5}/>
                            <td className="centerDisplay" colSpan={3} rowSpan={5}>
                                {!this.state.slotClicked &&
                                <img className="imageCenter" src="/UAPoly.png" alt="UAPoly"/>}
                                {this.state.slotClicked && this.state.slotType === "slot-property" && 
                                <div className="slotDisplay">
                                    <h3>{this.state.slotName}</h3><br/>
                                    <table className="slotInfos">
                                        <tr><td className="alignLeft">Ø 🏠</td> <td className="alignRight">$4</td></tr>
                                        <tr><td className="alignLeft">🏠</td> <td className="alignRight">$12</td></tr>
                                        <tr><td className="alignLeft">🏠🏠</td> <td className="alignRight">$24</td></tr>
                                        <tr><td className="alignLeft">🏠🏠🏠</td> <td className="alignRight">$40</td></tr>
                                        <tr><td className="alignLeft">🏠🏠🏠🏠</td> <td className="alignRight">$70</td></tr>
                                        <tr><td className="alignLeft">🏨</td> <td className="alignRight">$125</td></tr>
                                        <tr><td className="alignLeft">🏠 / 🏨 price</td><td className="alignRight">$25</td></tr>
                                    </table>
                                </div>
                                }
                                {this.state.slotClicked && this.state.slotType === "slot-utility" && 
                                <div className="slotDisplay">
                                    <h3>{this.state.slotName}</h3><br/>
                                    <table className="slotInfos">
                                        <tr><td className="alignLeft">💡</td> <td className="alignRight">$4</td></tr>
                                        <tr><td className="alignLeft">💡💡</td> <td className="alignRight">$12</td></tr>
                                    </table>
                                </div>
                                }
                                {this.state.slotClicked && this.state.slotType === "slot-train" && 
                                <div className="slotDisplay">
                                    <h3>{this.state.slotName}</h3><br/>
                                    <table className="slotInfos">
                                        <tr><td className="alignLeft">🚂</td> <td className="alignRight">$4</td></tr>
                                        <tr><td className="alignLeft">🚂🚂</td> <td className="alignRight">$12</td></tr>
                                        <tr><td className="alignLeft">🚂🚂🚂</td> <td className="alignRight">$40</td></tr>
                                        <tr><td className="alignLeft">🚂🚂🚂🚂</td> <td className="alignRight">$70</td></tr>
                                    </table>
                                </div>
                                }
                                {this.state.slotClicked && this.state.slotType === "slot-chance" && 
                                <div className="slotDisplay">
                                    <h3>{this.state.slotName}</h3><br/>
                                    <p>Draw a Chance card.</p>
                                </div>
                                }
                                {this.state.slotClicked && this.state.slotType === "slot-goToJail" && 
                                <div className="slotDisplay">
                                    <h3>{this.state.slotName}</h3><br/>
                                    <p>Go to Jail. Don't receive $200 from To Go.</p>
                                </div>
                                }
                            </td>
                            <td className="void" colSpan={3} rowSpan={5}/>
                            <td id="33" className="chest"><img id="33" className="slotImage slot-chest" src="/chest.svg" alt="Chest"/></td>
                        </tr>
                        <tr>
                            <td id="16" onClick={this.displaySlot.bind(this)} className="orange slot-property">Orange 1</td>
                            <td id="34" onClick={this.displaySlot.bind(this)} className="green slot-property">Green 3</td>
                        </tr>
                        <tr>
                            <td id="15" className="train"><img id="15" className="slotImage slot-train" src="/train.svg" alt="Train 2"/></td>
                            <td id="35" className="train"><img id="35" className="slotImage slot-train" src="/train.svg" alt="Train 4"/></td>
                        </tr>
                        <tr>
                            <td id="14" onClick={this.displaySlot.bind(this)} className="pink slot-property">Pink 3</td>
                            <td id="36" className="chance"><img className="slotImage slot-chance" src="/chance.svg" alt="Chance"/></td>
                        </tr>
                        <tr>
                            <td id="13" onClick={this.displaySlot.bind(this)} className="pink slot-property">Pink 2</td>
                            <td id="37" onClick={this.displaySlot.bind(this)} className="blue slot-property">Blue 1</td>
                        </tr>
                        <tr>
                            <td id="12" className="utility slot-utility">Utility 1</td>
                            <td className="void" colSpan={9} rowSpan={2} />
                            <td id="38" className="tax slot-tax">Tax</td>
                        </tr>
                        <tr>
                            <td id="11" onClick={this.displaySlot.bind(this)} className="pink slot-property">Pink 1</td>
                            <td id="39" onClick={this.displaySlot.bind(this)} className="blue slot-property">Blue 2</td>
                        </tr>
                        <tr>
                            <td id="10" className="jail slot-jail">Jail or Visit</td>
                            <td id="9" onClick={this.displaySlot.bind(this)} className="white slot-property">White 3</td>
                            <td id="8" onClick={this.displaySlot.bind(this)} className="white slot-property">White 2</td>
                            <td id="7" className="c onClick={this.displaySlot.bind(this)}hance"><img id="7" className="slotImage slot-chance" src="/chance.svg" alt="Chance"/></td>
                            <td id="6" onClick={this.displaySlot.bind(this)} className="white slot-property">White 1</td>
                            <td id="5" className="train"><img id="5" className="slotImage slot-train" src="/train.svg" alt="Train 1"/></td>
                            <td id="4" className="tax slot-tax">Tax</td>
                            <td id="3" onClick={this.displaySlot.bind(this)} className="brown slot-property">Brown 2</td>
                            <td id="2"className="chest"><img id="2" className="slotImage slot-chest" src="/chest.svg" alt="Chest"/></td>
                            <td id="1" onClick={this.displaySlot.bind(this)} className="brown slot-property">Brown 1</td>
                            <td id="0" className="start"><img className="slotImage arrow slot-start" src="/arrow.svg" alt="Start"/></td>
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