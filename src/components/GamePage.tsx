import React, {Component} from "react";
import ReactMarkdown from "react-markdown";
import Footer from "./Footer.tsx";
import UserHeader from "./UserHeader.tsx";
import PlayerInfos from "./PlayerInfos.tsx";
import { Socket, io } from "socket.io-client";

type GamePageProps = {};

type GamePageState = {
    gameId: number,
    slotClicked: boolean,
    indexClicked: number,
    slotName: string | null,
    slotType: string | undefined,
    gameInfos: any,
    messages: {
        id: number,
        content: string,
        sender: string,
    }[],
    showChat: boolean,
    unreadMessages: boolean,
    currentMessageContent: string,
    whoami: string,
    messageRecipient: string,
};

class GamePage extends Component<GamePageProps, GamePageState> {
    socket: Socket;

    constructor(props) {
        super(props);

        this.displayStartButton.bind(this);

        const urlSplit = window.location.href.split('/');

        this.state = {
            gameId: parseInt(urlSplit[urlSplit.length - 1]),
            slotClicked: false,
            indexClicked: -1,
            slotName: null,
            slotType: undefined,
            gameInfos: {
                "slots": ["a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a","a"],
                "players": [{ accountLogin: "a" }, { accountLogin: "a" }, { accountLogin: "a" }, { accountLogin: "a" }, { accountLogin: "a" }, { accountLogin: "a" }, { accountLogin: "a" }, { accountLogin: "a" }] ,
                "started": undefined
            },
            messages: [
                {
                    id: -1,
                    sender: "System",
                    content: "# Welcome to UApoly !\nThis is the chat, you can talk with other players here.\n## Mobile users\nIf you are on mobile click the 'Return to the game.' button at the top to close the chat window.\n## Formatting\nYou can use a subset of Markdown to format your messages, for example *italic* (`*italic*`) or **bold** (`**bold**`).\n\nYou can find more information about Markdown [here](https://www.markdownguide.org/basic-syntax/).",
                },
            ],
            showChat: false,
            unreadMessages: true,
            currentMessageContent: "",
            whoami: "",
            messageRecipient: "*", // * = everyone, otherwise the login of the recipient
        };

        this.searchWhoami();

        this.socket = io("",{
            auth: {
                token: localStorage.token
            }
        });

        this.socket.on('connect', () => {
            this.socket.emit('join', this.state.gameId);
        });

        this.socket.on('joined', (game) => {
            console.log(game);
            this.setState({
                gameInfos: game
            });
        });

        this.socket.on('update', (game) => {
            this.setState({
                gameInfos: game
            })
        });

        this.socket.on('player-connected', (object) => {
            console.log(object.player.concat(" has joined the game."));
        });

        this.socket.on('player-disconnected', (object) => {
            console.log(object.player.concat(" has left the game."));
        });

        this.socket.on('message', (message) => {
            this.setState({
                messages: [...this.state.messages, message],
                unreadMessages: true,
            });
        });
    }

    searchWhoami() {
        fetch('/api/user/me', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        })
        .then((result) => result.json())
        .then((res) => this.setState({
            whoami: res.login
        }));
    }

    displayStartButton(players): boolean {
        console.log(players.find);

        const player = players.find((p: any) => p.accountLogin === this.state.whoami);
        if (player && player.isGameMaster === true) {
            return true;
        }
        else {
            return false
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
        if (e.target.alt === this.state.slotName) {
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

    sendMessage(e) {
        e.preventDefault();

        if(this.state.currentMessageContent.trim().length !== 0) {
            this.socket.emit('message', {
                gameId: this.state.gameId,
                message: this.state.currentMessageContent,
                recipient: this.state.messageRecipient === "*" ? undefined : this.state.messageRecipient,
            });
    
            this.setState({
                currentMessageContent: "",
                messageRecipient: "*",
            });
        }
    }

    toggleChat(e) {
        this.setState({
            showChat: !this.state.showChat,
            unreadMessages: false,
        });
    }

    currentMessageChange(e) {
        this.setState({
            currentMessageContent: e.target.value
        });
    }

    chatBoxKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if(e.key === "Enter" && !e.shiftKey) {
            this.sendMessage(e);
        }
    }

    displayMessage(message) {
        if(message.sender === this.state.whoami || !message.recipient || message.recipient === this.state.whoami) {
            return (
                <div className="chatMessage">
                    <span className="chatMessageSender">{message["sender"]}{message.recipient !== undefined && ` to ${message.recipient}`}</span>
                    <span className="chatMessageContent"><ReactMarkdown>{message["content"]}</ReactMarkdown></span>
                </div>
            );
        }
    }

    recipientChange(e) {
        this.setState({
            messageRecipient: e.target.value
        });
    }

    render(): React.ReactNode {
        return(
            <>
            <UserHeader />
            <div className="game">
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td id="20"><img id="20" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-freeParking" src="/parking.svg" alt={`${this.state.gameInfos.slots[20].name}`}/></td>
                                <td id="21" onClick={this.displaySlot.bind(this)} className="red slot-property">{this.state.gameInfos.slots[21].name}</td>
                                <td id="22" className="chance"><img id="22" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-chance" src="/chance.svg" alt={`${this.state.gameInfos.slots[22].name}`}/></td>
                                <td id="23" onClick={this.displaySlot.bind(this)} className="red slot-property">{this.state.gameInfos.slots[23].name}</td>
                                <td id="24" onClick={this.displaySlot.bind(this)} className="red slot-property">{this.state.gameInfos.slots[24].name}</td>
                                <td id="25" className="train"><img id="25" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-train" src="/train.svg" alt={`${this.state.gameInfos.slots[25].name}`}/></td>
                                <td id="26" onClick={this.displaySlot.bind(this)} className="yellow slot-property">{this.state.gameInfos.slots[26].name}</td>
                                <td id="27" onClick={this.displaySlot.bind(this)} className="yellow slot-property">{this.state.gameInfos.slots[27].name}</td>
                                <td id="28" onClick={this.displaySlot.bind(this)} className="utility slot-utility">{this.state.gameInfos.slots[28].name}</td>
                                <td id="29" onClick={this.displaySlot.bind(this)} className="yellow slot-property">{this.state.gameInfos.slots[29].name}</td>
                                <td id="30" className="jail"><img id="30" onClick={this.displaySlotImage.bind(this)} className="slotImage goToJail slot-goToJail" src="/whistle.svg" alt={`${this.state.gameInfos.slots[30].name}`}/></td>
                            </tr>
                            <tr>
                                <td id="19" onClick={this.displaySlot.bind(this)} className="orange slot-property">{this.state.gameInfos.slots[19].name}</td>
                                <td className="void" colSpan={9} rowSpan={2} />
                                <td id="31" onClick={this.displaySlot.bind(this)} className="green slot-property">{this.state.gameInfos.slots[31].name}</td>
                            </tr>
                            <tr>
                                <td id="18" onClick={this.displaySlot.bind(this)} className="orange slot-property">{this.state.gameInfos.slots[18].name}</td>
                                <td id="32" onClick={this.displaySlot.bind(this)} className="green slot-property">{this.state.gameInfos.slots[32].name}</td>
                            </tr>
                            <tr>
                                <td id="17" className="chest"><img id="17" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-chest" src="/chest.svg" alt={`${this.state.gameInfos.slots[17].name}`}/></td>
                                <td className="void" colSpan={3} rowSpan={5}/>
                                <td className="centerDisplay" colSpan={3} rowSpan={5}>
                                    {!this.state.slotClicked && this.state.gameInfos.started &&
                                    <img className="imageCenter" src="/UAPoly.png" alt="UAPoly"/>}

                                    {!this.state.slotClicked && !this.state.gameInfos.started && this.displayStartButton(this.state.gameInfos.players) && <button>Start the game</button>}
                                    {!this.state.slotClicked && !this.state.gameInfos.started && !this.displayStartButton(this.state.gameInfos.players) && <p>Waiting for the game master to start the game...</p>}    

                                    {this.state.slotClicked && this.state.slotType === "slot-property" && 
                                    <div className="slotDisplay">
                                        <h3>{this.state.slotName}</h3><br/>
                                        <table className="slotInfos">
                                            <tr><td className="alignLeft">💵</td> <td className="alignRight">${this.state.gameInfos.slots[this.state.indexClicked].price}</td></tr>
                                            <tr><td className="alignLeft">Ø 🏠</td> <td className="alignRight">${this.state.gameInfos.slots[this.state.indexClicked].propertyRent["noBuildings"]}</td></tr>
                                            <tr><td className="alignLeft">🏠</td> <td className="alignRight">${this.state.gameInfos.slots[this.state.indexClicked].propertyRent["oneBuilding"]}</td></tr>
                                            <tr><td className="alignLeft">🏠🏠</td> <td className="alignRight">${this.state.gameInfos.slots[this.state.indexClicked].propertyRent["twoBuildings"]}</td></tr>
                                            <tr><td className="alignLeft">🏠🏠🏠</td> <td className="alignRight">${this.state.gameInfos.slots[this.state.indexClicked].propertyRent["threeBuildings"]}</td></tr>
                                            <tr><td className="alignLeft">🏠🏠🏠🏠</td> <td className="alignRight">${this.state.gameInfos.slots[this.state.indexClicked].propertyRent["fourBuildings"]}</td></tr>
                                            <tr><td className="alignLeft">🏨</td> <td className="alignRight">${this.state.gameInfos.slots[this.state.indexClicked].propertyRent["hotel"]}</td></tr>
                                            <tr><td className="alignLeft">🏠 / 🏨 price</td><td className="alignRight">${this.state.gameInfos.slots[this.state.indexClicked].buildingPrice}</td></tr>
                                        </table>
                                    </div>
                                    }
                                    {this.state.slotClicked && this.state.slotType === "slot-utility" && 
                                    <div className="slotDisplay">
                                        <h3>{this.state.slotName}</h3><br/>
                                        <table className="slotInfos">
                                            <tr><td className="alignLeft">💵</td> <td className="alignRight">${this.state.gameInfos.slots[this.state.indexClicked].price}</td></tr>
                                            <tr><td className="alignLeft">💡</td> <td className="alignRight">x{this.state.gameInfos.slots[this.state.indexClicked].utilityRent["oneUtilityMultiplier"]}</td></tr>
                                            <tr><td className="alignLeft">💡💡</td> <td className="alignRight">x{this.state.gameInfos.slots[this.state.indexClicked].utilityRent["twoUtilitiesMultiplier"]}</td></tr>
                                        </table>
                                    </div>
                                    }
                                    {this.state.slotClicked && this.state.slotType === "slot-train" && 
                                    <div className="slotDisplay">
                                        <h3>{this.state.slotName}</h3><br/>
                                        <table className="slotInfos">
                                            <tr><td className="alignLeft">💵</td> <td className="alignRight">${this.state.gameInfos.slots[this.state.indexClicked].price}</td></tr>
                                            <tr><td className="alignLeft">🚂</td> <td className="alignRight">${this.state.gameInfos.slots[this.state.indexClicked].trainRent["oneStation"]}</td></tr>
                                            <tr><td className="alignLeft">🚂🚂</td> <td className="alignRight">${this.state.gameInfos.slots[this.state.indexClicked].trainRent["twoStations"]}</td></tr>
                                            <tr><td className="alignLeft">🚂🚂🚂</td> <td className="alignRight">${this.state.gameInfos.slots[this.state.indexClicked].trainRent["threeStations"]}</td></tr>
                                            <tr><td className="alignLeft">🚂🚂🚂🚂</td> <td className="alignRight">${this.state.gameInfos.slots[this.state.indexClicked].trainRent["fourStations"]}</td></tr>
                                        </table>
                                    </div>
                                    }
                                    {this.state.slotClicked && this.state.slotType === "slot-chance" && 
                                    <div className="slotDisplay">
                                        <h3>{this.state.slotName}</h3><br/>
                                        <p>{this.state.gameInfos.slots[this.state.indexClicked].description}</p>
                                    </div>
                                    }
                                    {this.state.slotClicked && this.state.slotType === "slot-chest" && 
                                    <div className="slotDisplay">
                                        <h3>{this.state.slotName}</h3><br/>
                                        <p>{this.state.gameInfos.slots[this.state.indexClicked].description}</p>
                                    </div>
                                    }
                                    {this.state.slotClicked && this.state.slotType === "slot-goToJail" && 
                                    <div className="slotDisplay">
                                        <h3>{this.state.slotName}</h3><br/>
                                        <p>{this.state.gameInfos.slots[this.state.indexClicked].description}</p>
                                    </div>
                                    }
                                    {this.state.slotClicked && this.state.slotType === "slot-freeParking" && 
                                    <div className="slotDisplay">
                                        <h3>{this.state.slotName}</h3><br/>
                                        <p>{this.state.gameInfos.slots[this.state.indexClicked].description}</p>
                                    </div>
                                    }
                                    {this.state.slotClicked && this.state.slotType === "slot-start" && 
                                    <div className="slotDisplay">
                                        <h3>{this.state.slotName}</h3><br/>
                                        <p>{this.state.gameInfos.slots[0].description}</p>
                                    </div>
                                    }
                                    {this.state.slotClicked && this.state.slotType === "slot-tax" && 
                                    <div className="slotDisplay">
                                        <h3>{this.state.slotName}</h3><br/>
                                        <p>{this.state.gameInfos.slots[this.state.indexClicked].description}</p>
                                    </div>
                                    }
                                    {this.state.slotClicked && this.state.slotType === "slot-jail" && 
                                    <div className="slotDisplay">
                                        <h3>{this.state.slotName}</h3><br/>
                                        <p>{this.state.gameInfos.slots[this.state.indexClicked].description}</p>
                                    </div>
                                    }
                                </td>
                                <td className="void" colSpan={3} rowSpan={5}/>
                                <td id="33" className="chest"><img id="33" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-chest" src="/chest.svg" alt={`${this.state.gameInfos.slots[33].name}`}/></td>
                            </tr>
                            <tr>
                                <td id="16" onClick={this.displaySlot.bind(this)} className="orange slot-property">{this.state.gameInfos.slots[16].name}</td>
                                <td id="34" onClick={this.displaySlot.bind(this)} className="green slot-property">{this.state.gameInfos.slots[34].name}</td>
                            </tr>
                            <tr>
                                <td id="15" className="train"><img id="15" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-train" src="/train.svg" alt={`${this.state.gameInfos.slots[15].name}`}/></td>
                                <td id="35" className="train"><img id="35" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-train" src="/train.svg" alt={`${this.state.gameInfos.slots[35].name}`}/></td>
                            </tr>
                            <tr>
                                <td id="14" onClick={this.displaySlot.bind(this)} className="pink slot-property">{this.state.gameInfos.slots[14].name}</td>
                                <td id="36" className="chance"><img id="36" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-chance" src="/chance.svg" alt={`${this.state.gameInfos.slots[36].name}`}/></td>
                            </tr>
                            <tr>
                                <td id="13" onClick={this.displaySlot.bind(this)} className="pink slot-property">{this.state.gameInfos.slots[13].name}</td>
                                <td id="37" onClick={this.displaySlot.bind(this)} className="blue slot-property">{this.state.gameInfos.slots[37].name}</td>
                            </tr>
                            <tr>
                                <td id="12" onClick={this.displaySlot.bind(this)} className="utility slot-utility">{this.state.gameInfos.slots[12].name}</td>
                                <td className="void" colSpan={9} rowSpan={2} />
                                <td id="38" onClick={this.displaySlot.bind(this)} className="tax slot-tax">{this.state.gameInfos.slots[38].name}</td>
                            </tr>
                            <tr>
                                <td id="11" onClick={this.displaySlot.bind(this)} className="pink slot-property">{this.state.gameInfos.slots[11].name}</td>
                                <td id="39" onClick={this.displaySlot.bind(this)} className="blue slot-property">{this.state.gameInfos.slots[39].name}</td>
                            </tr>
                            <tr>
                                <td id="10" onClick={this.displaySlot.bind(this)} className="jail slot-jail">{this.state.gameInfos.slots[10].name}</td>
                                <td id="9" onClick={this.displaySlot.bind(this)} className="white slot-property">{this.state.gameInfos.slots[9].name}</td>
                                <td id="8" onClick={this.displaySlot.bind(this)} className="white slot-property">{this.state.gameInfos.slots[8].name}</td>
                                <td id="7" className="chance"><img id="7" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-chance" src="/chance.svg" alt={`${this.state.gameInfos.slots[7].name}`}/></td>
                                <td id="6" onClick={this.displaySlot.bind(this)} className="white slot-property">{this.state.gameInfos.slots[6].name}</td>
                                <td id="5" className="train"><img id="5" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-train" src="/train.svg" alt={`${this.state.gameInfos.slots[5].name}`}/></td>
                                <td id="4" onClick={this.displaySlot.bind(this)} className="tax slot-tax">{this.state.gameInfos.slots[4].name}</td>
                                <td id="3" onClick={this.displaySlot.bind(this)} className="brown slot-property">{this.state.gameInfos.slots[3].name}</td>
                                <td id="2" className="chest"><img id="2" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-chest" src="/chest.svg" alt={`${this.state.gameInfos.slots[2].name}`}/></td>
                                <td id="1" onClick={this.displaySlot.bind(this)} className="brown slot-property">{this.state.gameInfos.slots[1].name}</td>
                                <td id="0" onClick={this.displaySlotImage.bind(this)} className="boardSlot start"><img className="slotImage arrow slot-start" src="/arrow.svg" alt={`${this.state.gameInfos.slots[0].name}`}/>
                                {/*<img className="pion player1" src={`/api/user/picture/Gyrehio`} alt="Gyrehio"/>
                                <img className="pion player2" src={`/api/user/picture/Gyrehio`} alt="Gyrehio"/>
                                <img className="pion player3" src={`/api/user/picture/Gyrehio`} alt="Gyrehio"/>
                                <img className="pion player4" src={`/api/user/picture/Gyrehio`} alt="Gyrehio"/>
                                <img className="pion player5" src={`/api/user/picture/Gyrehio`} alt="Gyrehio"/>
                                <img className="pion player6" src={`/api/user/picture/Gyrehio`} alt="Gyrehio"/>
                                <img className="pion player7" src={`/api/user/picture/Gyrehio`} alt="Gyrehio"/>
                                <img className="pion player8" src={`/api/user/picture/Gyrehio`} alt="Gyrehio"/>*/}
                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button className="mobileOnly" onClick={this.toggleChat.bind(this)}>{this.state.unreadMessages ? 'Show chat (!)' : 'Show chat'}</button>
                <div className="playerList">
                {this.state.gameInfos.players.map((player) => (
                    <div className="playerInfos">
                        <img className="pfp" src={`/api/user/picture/${player["accountLogin"]}`} alt={player["accountLogin"]}/>
                        <div className="playerStats">
                            <span>{player["accountLogin"]}</span><br/>
                            <span>${player["money"]}</span>
                        </div>
                    </div>
                ))}
                </div>
                <div id="chat" className={this.state.showChat ? '' : 'hideChat'}>
                    <button className="mobileOnly" onClick={this.toggleChat.bind(this)}>Return to the game.</button>
                    <div id="chatMessages">
                        {this.state.messages.reverse().map((message) => this.displayMessage(message))}
                    </div>
                    
                    <form id="chatInput" onSubmit={this.sendMessage.bind(this)}>
                        <div>
                            <label htmlFor="msgRecipient">To:</label>
                            <select id="msgRecipient" value={this.state.messageRecipient} onChange={this.recipientChange.bind(this)}>
                                <option value="*">Everyone</option>
                                {this.state.gameInfos.players.map((player) => (
                                    <option value={player["accountLogin"]}>{player["accountLogin"]}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <textarea id="chatInputField" placeholder="Type your message here" value={this.state.currentMessageContent} onChange={this.currentMessageChange.bind(this)} onKeyDown={this.chatBoxKeyDown.bind(this)}/>
                            <button id="chatSendButton" disabled={this.state.currentMessageContent.trim().length === 0} type="submit">Send</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
            </>
        );
    }
}

export default GamePage;