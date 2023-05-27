import React, {Component} from "react";
import ReactMarkdown from "react-markdown";
import EmojiPicker, { EmojiStyle, Emoji } from "emoji-picker-react";
import remarkGemoji from "remark-gemoji";
import remarkBreaks from "remark-breaks";
import Footer from "./Footer.tsx";
import UserHeader from "./UserHeader.tsx";
import { getSocket } from "../GlobalSocket.ts";
import ManagePropertiesDialog from "./ManagePropertiesDialog.tsx";

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
    showEmojiPicker: boolean,
    currentSystemMessageId: number,
    diceRolls: number[],
    startTurn: boolean,
    endTurn: boolean,
    position: number | undefined,
    isInDebt: boolean
};

class GamePage extends Component<GamePageProps, GamePageState> {
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
            showEmojiPicker: false,
            currentSystemMessageId: -2,
            diceRolls:[],
            startTurn: true,
            endTurn: false,
            position: undefined,
            isInDebt: false
        };

        this.searchWhoami();

        getSocket().on('connect', () => {
            getSocket().emit('join', this.state.gameId);
        });

        getSocket().on('joined', (game) => {
            this.setState({
                gameInfos: game
            });
            getSocket().emit('update', this.state.gameId);
        });

        getSocket().on('update', (game) => {
            for (let i = 0; i < this.state.gameInfos.slots.length; i++) {
                this.displayPawns(i);
                this.setSlotColor(i);
                this.forceUpdate();
            };
            Promise.resolve().then(() => {
                this.setState({
                    gameInfos: game
                });
            });
        });

        getSocket().on('player-connected', (object) => {
            for (let i = 0; i < this.state.gameInfos.slots.length; i++) {
                this.displayPawns(i);
                this.setSlotColor(i);
                this.forceUpdate();
            };
            Promise.resolve().then(() => {
                let message = {
                    id: this.state.currentSystemMessageId,
                    sender: "System",
                    content: "**" + object.accountLogin + "** has joined the game."
                };
                this.setState({
                    messages: [message, ...this.state.messages],
                    unreadMessages: true,
                    currentSystemMessageId: this.state.currentSystemMessageId - 1,
                });
            });
        });

        getSocket().on('player-disconnected', (object) => {
            let message = {
                id: this.state.currentSystemMessageId,
                sender: "System",
                content: "**" + object.accountLogin + "** has left the game."
            };
            this.setState({
                messages: [message, ...this.state.messages],
                unreadMessages: true,
                currentSystemMessageId: this.state.currentSystemMessageId - 1,
            });
        });

        getSocket().on('message', (message) => {
            this.setState({
                messages: [message, ...this.state.messages],
                unreadMessages: true,
            });
        });

        getSocket().on('startOfTurn', (object) => {
            for (let i = 0; i < this.state.gameInfos.slots.length; i++) {
                this.displayPawns(i);
                this.setSlotColor(i);
                this.forceUpdate();
            };
            Promise.resolve().then(() => {
                let message = {
                    id: this.state.currentSystemMessageId,
                    sender: "System",
                    content: "It's your turn, **" + object.accountLogin + "** !"
                };
                this.setState({
                    messages: [message, ...this.state.messages],
                    unreadMessages: true,
                    currentSystemMessageId: this.state.currentSystemMessageId - 1,
                    startTurn: true,
                    endTurn: false,
                    position: undefined
                });
            });
        });

        getSocket().on('endOfTurn', (object) => {
            for (let i = 0; i < this.state.gameInfos.slots.length; i++) {
                this.displayPawns(i);
                this.setSlotColor(i);
                this.forceUpdate();
            };
            Promise.resolve().then(() => {
                this.setState({
                    endTurn: true
                });
            });
        })

        getSocket().on('diceRoll', (object) => {
            for (let i = 0; i < this.state.gameInfos.slots.length; i++) {
                this.displayPawns(i);
                this.setSlotColor(i);
                this.forceUpdate();
            };
            Promise.resolve().then(() => {
                let message = {
                    id: this.state.currentSystemMessageId,
                    sender: "System",
                    content: "**" + this.state.gameInfos.players[this.state.gameInfos.currentPlayerIndex].accountLogin + "** made a " + object.dices[0] + " and a " + object.dices[1] + ' !'
                };
                this.setState({
                    messages: [message, ...this.state.messages],
                    unreadMessages: true,
                    currentSystemMessageId: this.state.currentSystemMessageId - 1,
                    startTurn: false,
                    position: this.state.gameInfos.players[this.state.gameInfos.currentPlayerIndex].currentSlotIndex
                });
            });
        });

        getSocket().on('landedOnUnowned', (object) => {
            this.setState({
                position: object.position,
            });
            Promise.resolve().then(() => {
                for (let i = 0; i < this.state.gameInfos.slots.length; i++) {
                    this.displayPawns(i);
                    this.setSlotColor(i);
                    this.forceUpdate();
                };
            });
        });

        getSocket().on('propertyBought', (object) => {
            for (let i = 0; i < this.state.gameInfos.slots.length; i++) {
                this.displayPawns(i);
                this.setSlotColor(i);
                this.forceUpdate();
            };
            Promise.resolve().then(() => {
                let message = {
                    id: this.state.currentSystemMessageId,
                    sender: "System",
                    content: "**" + object.accountLogin + "** just bought **" + this.state.gameInfos.slots[object.slotIndex].name +"** !"
                };
                this.setState({
                    messages: [message, ...this.state.messages],
                    unreadMessages: true,
                    currentSystemMessageId: this.state.currentSystemMessageId - 1
                });
            });
        });

        getSocket().on('paymentSucceeded', (object) => {
            this.setState({
                isInDebt: false
            });
            for (let i = 0; i < this.state.gameInfos.slots.length; i++) {
                this.displayPawns(i);
                this.setSlotColor(i);
                this.forceUpdate();
            };
            Promise.resolve().then(()=> {
                switch (object.receiver) {
                    case "bank": break;
                    case "jackpot": break;
                    default: {
                        let message = {
                            id: this.state.currentSystemMessageId,
                            sender: "System",
                            content: "**" + object.sender + "** has to pay $" + object.amount + " to **" + object.receiver + "**"  
                        };
                        this.setState({
                            messages: [message, ...this.state.messages],
                            unreadMessages: true,
                            currentSystemMessageId: this.state.currentSystemMessageId - 1
                        });
                    }
                }
                switch (object.sender) {
                    case "jackpot": {
                        let message = {
                            id: this.state.currentSystemMessageId,
                            sender: "System",
                            content: "**" + object.receiver + "** just won $" + object.amount + " thanks to the jackpot !"  
                        };
                        this.setState({
                            messages: [message, ...this.state.messages],
                            unreadMessages: true,
                            currentSystemMessageId: this.state.currentSystemMessageId - 1
                        });
                    }
                }
            });
        });

        getSocket().on('cardDrawn', (object) => {
            for (let i = 0; i < this.state.gameInfos.slots.length; i++) {
                this.displayPawns(i);
                this.setSlotColor(i);
                this.forceUpdate();
            };
            Promise.resolve().then(() => {
                let message = {
                    id: this.state.currentSystemMessageId,
                    sender: "System",
                    content: "**" + object.accountLogin + '** just drew a card : \n' + object.description,
                };
                this.setState({
                    messages: [message, ...this.state.messages],
                    unreadMessages: true,
                    currentSystemMessageId: this.state.currentSystemMessageId - 1,
                });
            });
        });

        getSocket().on('tax', (object) => {
            for (let i = 0; i < this.state.gameInfos.slots.length; i++) {
                this.displayPawns(i);
                this.setSlotColor(i);
                this.forceUpdate();
            };
            Promise.resolve().then(() => {
                let message = {
                    id: this.state.currentSystemMessageId,
                    sender: "System",
                    content: "**" + object.accountLogin + '** has to pay a tax of $' + object.amount,
                };
                this.setState({
                    messages: [message, ...this.state.messages],
                    unreadMessages: true,
                    currentSystemMessageId: this.state.currentSystemMessageId - 1,
                });
            });
        });

        getSocket().on('shouldRollDices', (object) => {
            this.forceUpdate();
        });

        getSocket().on('bankrupt', (object) => {
            if (object.quitted) {
                let message = {
                    id: this.state.currentSystemMessageId,
                    sender: "System",
                    content: "**" + object.accountLogin + "** has decided to give up !"
                };
                this.setState({
                    messages: [message, ...this.state.messages],
                    unreadMessages: true,
                    currentSystemMessageId: this.state.currentSystemMessageId - 1
                });
            } else {
                let message = {
                    id: this.state.currentSystemMessageId,
                    sender: "System",
                    content: "**" + object.accountLogin + "** has no more money."
                };
                this.setState({
                    messages: [message, ...this.state.messages],
                    unreadMessages: true,
                    currentSystemMessageId: this.state.currentSystemMessageId - 1
                });
            }
        });

        getSocket().on('game-over', (object) => {
            if (object.winner !== null) {
                let message = {
                    id: this.state.currentSystemMessageId,
                    sender: "System",
                    content: "**" + object.winner + "** has won the game ! Congratulations !"
                };
                this.setState({
                    messages: [message, ...this.state.messages],
                    unreadMessages: true,
                    currentSystemMessageId: this.state.currentSystemMessageId - 1
                });
                alert("Congratulations, " + object.winner + " won the game");
            }
        });

        getSocket().on('playerInDebt', (object) => {
            let message = {
                id: this.state.currentSystemMessageId,
                sender: "System",
                content: "**" + object.accountLogin + "** has to pay a debt of $" + object.amount
            }
            this.setState({
                isInDebt: true,
                messages: [message, ...this.state.messages],
                unreadMessages: true,
                currentSystemMessageId: this.state.currentSystemMessageId - 1
            });
        });
    }

    startGame() {
        getSocket().emit('start', this.state.gameId);
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
            let nb = "";
            console.log(nb);
            for (let i = 4; i < e.target.id.length; i++) {nb += e.target.id[i];}
            this.setState({
                slotClicked: true,
                indexClicked: parseInt(nb),
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
            let nb = "";
            for (let i = 4; i < e.target.id.length; i++) {nb += e.target.id[i];}
            console.log(nb);
            this.setState({
                slotClicked: true,
                indexClicked: parseInt(nb),
                slotName: e.target.alt,
                slotType: (Array.from(e.target.classList) as string[]).find((x) => {
                    if (x.startsWith("slot-")) return true
                    else return false;
                })
            });
        }
    }

    displayPawns(nb: number) {
        document.querySelectorAll(`td#slot${nb} .pion`).forEach(e => {
            e.remove();
        });
        let selector = document.querySelector(`td#slot${nb}`);
        if (selector) {
            let cpt = 0;
            for (let player of this.state.gameInfos.players) {
                if (player.currentSlotIndex === nb) {
                    let img = document.createElement("img");
                    img.classList.add("pion");
                    img.classList.add(`player${cpt+1}`);
                    img.src = `/api/user/picture/${player.accountLogin}`;
                    img.alt = player.accountLogin;
                    selector.appendChild(img);
                }
                cpt++;
            }
        }
        return;
    }

    setSlotColor(nb: number) {
        let selector = document.querySelector(`td#slot${nb}`);
        if (selector) {
            let cpt = 0;
            let found = false;
            for (let player of this.state.gameInfos.players) {
                if (this.state.gameInfos.slots[nb].owner) {
                    if (this.state.gameInfos.slots[nb].owner.accountLogin === player.accountLogin) {
                        selector.classList.add(`owned${cpt+1}`);
                        found = true;
                    }
                } else if (!found) {
                    selector.classList.remove(`owned${cpt+1}`);
                }
                cpt++;
            }
        }
        return;
    }

    sendMessage(e) {
        e.preventDefault();

        if(this.state.currentMessageContent.trim().length !== 0) {
            getSocket().emit('message', {
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
                    <span className="chatMessageContent"><ReactMarkdown remarkPlugins={[remarkBreaks, remarkGemoji]}>{message["content"]}</ReactMarkdown></span>
                </div>
            );
        }
    }

    recipientChange(e) {
        this.setState({
            messageRecipient: e.target.value
        });
    }

    emojiClick(e) {
        this.setState({
            currentMessageContent: this.state.currentMessageContent.concat(e.emoji),
            showEmojiPicker: false,
        });
    }

    toggleEmojiPicker(e) {
        this.setState({
            showEmojiPicker: !this.state.showEmojiPicker
        });
    }

    isYourTurn(players) {
        for (let i = 0; i < players.length; i++) {
            if (players[i].accountLogin === this.state.whoami) {
                if (this.state.gameInfos.currentPlayerIndex === i) {
                    return true;
                } else return false;
            }
        }
        return false;
    }

    rollDices() {
        getSocket().emit('rollDices', this.state.gameId);
    };

    buy() {
        getSocket().emit('buy', this.state.gameId);
        this.setState({
            endTurn: true,
        });
    }

    doNotBuy() {
        getSocket().emit('doNotBuy', this.state.gameId);
        this.setState({
            endTurn: true,
        });
    }

    endTurn() {
        getSocket().emit('nextPlayer', this.state.gameId);  
        this.setState({
            startTurn: true,
            endTurn: false,
            position: undefined
        });
    }

    displayRollDice(players): boolean {
        return (this.state.gameInfos.players[this.state.gameInfos.currentPlayerIndex].accountLogin === this.state.whoami);
    }

    declareBankruptcy() {
        getSocket().emit('declareBankruptcy', this.state.gameId);
        this.setState({
            startTurn: true,
            endTurn: false,
            position: undefined
        });
    }

    dicesInJail() {
        getSocket().emit('escapeJail', {"gameId": this.state.gameId, "meanOfEscape": "ROLL"});
    }

    payTheBail() {
        getSocket().emit('escapeJail', {"gameId": this.state.gameId, "meanOfEscape": "PAY"});
    }

    useFreeFromJailCard() {
        getSocket().emit('escapeJail', {"gameId": this.state.gameId, "meanOfEscape": "USE_CARD"});

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
                                <td id="slot20" className="boardSlot"><img id="slot20" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-freeParking" src="/parking.svg" alt={`${this.state.gameInfos.slots[20].name}`}/></td>
                                <td id="slot21" onClick={this.displaySlot.bind(this)} className="boardSlot red slot-property">{this.state.gameInfos.slots[21].name}</td>
                                <td id="slot22" className="boardSlot chance"><img id="slot22" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-chance" src="/chance.svg" alt={`${this.state.gameInfos.slots[22].name}`}/></td>
                                <td id="slot23" onClick={this.displaySlot.bind(this)} className="boardSlot red slot-property">{this.state.gameInfos.slots[23].name}</td>
                                <td id="slot24" onClick={this.displaySlot.bind(this)} className="boardSlot red slot-property">{this.state.gameInfos.slots[24].name}</td>
                                <td id="slot25" className="boardSlot train"><img id="slot25" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-train" src="/train.svg" alt={`${this.state.gameInfos.slots[25].name}`}/></td>
                                <td id="slot26" onClick={this.displaySlot.bind(this)} className="boardSlot yellow slot-property">{this.state.gameInfos.slots[26].name}</td>
                                <td id="slot27" onClick={this.displaySlot.bind(this)} className="boardSlot yellow slot-property">{this.state.gameInfos.slots[27].name}</td>
                                <td id="slot28" onClick={this.displaySlot.bind(this)} className="boardSlot utility slot-utility">{this.state.gameInfos.slots[28].name}</td>
                                <td id="slot29" onClick={this.displaySlot.bind(this)} className="boardSlot yellow slot-property">{this.state.gameInfos.slots[29].name}</td>
                                <td id="slot30" className="boardSlot jail"><img id="slot30" onClick={this.displaySlotImage.bind(this)} className="slotImage goToJail slot-goToJail" src="/whistle.svg" alt={`${this.state.gameInfos.slots[30].name}`}/></td>
                            </tr>
                            <tr>
                                <td id="slot19" onClick={this.displaySlot.bind(this)} className="boardSlot orange slot-property">{this.state.gameInfos.slots[19].name}</td>
                                <td className="void" colSpan={9} rowSpan={2} />
                                <td id="slot31" onClick={this.displaySlot.bind(this)} className="boardSlot green slot-property">{this.state.gameInfos.slots[31].name}</td>
                            </tr>
                            <tr>
                                <td id="slot18" onClick={this.displaySlot.bind(this)} className="boardSlot orange slot-property">{this.state.gameInfos.slots[18].name}</td>
                                <td id="slot32" onClick={this.displaySlot.bind(this)} className="boardSlot green slot-property">{this.state.gameInfos.slots[32].name}</td>
                            </tr>
                            <tr>
                                <td id="slot17" className="boardSlot chest"><img id="slot17" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-chest" src="/chest.svg" alt={`${this.state.gameInfos.slots[17].name}`}/></td>
                                <td className="void" colSpan={3} rowSpan={5}/>
                                <td className="centerDisplay" colSpan={3} rowSpan={5}>
                                    {!this.state.slotClicked && !this.state.gameInfos.started && this.displayStartButton(this.state.gameInfos.players) && <button onClick={this.startGame.bind(this)}>Start the game</button>}

                                    {!this.state.slotClicked && !this.state.gameInfos.started && !this.displayStartButton(this.state.gameInfos.players) && <p>Waiting for the game master to start the game...</p>}
                                    
                                    {!this.state.slotClicked && this.state.gameInfos.started && this.state.startTurn && this.isYourTurn(this.state.gameInfos.players) && !this.state.gameInfos.players[this.state.gameInfos.currentPlayerIndex].inJail && <button onClick={this.rollDices.bind(this)}>Roll the dices</button>}
                                    
                                    {!this.state.slotClicked && this.state.gameInfos.started && this.state.startTurn && this.isYourTurn(this.state.gameInfos.players) && this.state.gameInfos.players[this.state.gameInfos.currentPlayerIndex].inJail &&
                                    <div className="slotDisplay">
                                        <p>You're in Jail. What will you do ?</p>
                                        <button onClick={this.dicesInJail.bind(this)}>Try to get a double</button>
                                        <button onClick={this.payTheBail.bind(this)}>Pay your bail</button>
                                        {this.state.gameInfos.players[this.state.gameInfos.currentPlayerIndex].outOfJailCards > 0 && <button onClick={this.useFreeFromJailCard.bind(this)}>Use a "Get out of Jail Free" card</button>}
                                    </div>}

                                    {!this.state.slotClicked && this.state.gameInfos.started && !this.state.startTurn && !this.state.endTurn && this.isYourTurn(this.state.gameInfos.players) && (!this.state.gameInfos.slots[this.state.position].owner) &&
                                    <div className="slotDisplay">
                                        <p>Do you want to buy {this.state.gameInfos.slots[this.state.position].name} for ${this.state.gameInfos.slots[this.state.position].price} ?</p>
                                        <button onClick={this.buy.bind(this)}>Yes</button>
                                        <button onClick={this.doNotBuy.bind(this)}>No</button>
                                    </div>}
                                    
                                    {!this.state.slotClicked && this.state.gameInfos.started && this.state.endTurn && this.isYourTurn(this.state.gameInfos.players) && !this.state.isInDebt &&
                                    <div className="slotDisplay">
                                        <p>Which action do you want to perform ?</p>
                                        {/* <button>Manage properties</button> */}
                                        <ManagePropertiesDialog ownedProperties={this.state.gameInfos.slots.filter((p) => p.owner?.accountLogin === this.state.whoami).map((p) => Object.assign({}, p))} gameId={this.state.gameId}></ManagePropertiesDialog>
                                        <button onClick={this.endTurn.bind(this)}>End your turn</button>
                                        <button onClick={this.declareBankruptcy.bind(this)}>Declare bankruptcy</button>
                                    </div>}

                                    {!this.state.slotClicked && this.state.gameInfos.started && this.isYourTurn(this.state.gameInfos.players) && this.state.isInDebt &&
                                    <div className="slotDisplay">
                                        <p>You have a debt to pay. What action do you want to perform ?</p>
                                        <ManagePropertiesDialog ownedProperties={this.state.gameInfos.slots.filter((p) => p.owner?.accountLogin === this.state.whoami).map((p) => Object.assign({}, p))} gameId={this.state.gameId}></ManagePropertiesDialog>
                                        <button onClick={this.declareBankruptcy.bind(this)}>Declare bankruptcy</button>
                                    </div>}
                                    
                                    {!this.state.slotClicked && this.state.gameInfos.started && !this.isYourTurn(this.state.gameInfos.players) &&
                                    <img className="imageCenter" src="/UAPoly.png" alt="UAPoly"/>}    

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
                                <td id="slot33" className="boardSlot chest"><img id="slot33" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-chest" src="/chest.svg" alt={`${this.state.gameInfos.slots[33].name}`}/></td>
                            </tr>
                            <tr>
                                <td id="slot16" onClick={this.displaySlot.bind(this)} className="boardSlot orange slot-property">{this.state.gameInfos.slots[16].name}</td>
                                <td id="slot34" onClick={this.displaySlot.bind(this)} className="boardSlot green slot-property">{this.state.gameInfos.slots[34].name}</td>
                            </tr>
                            <tr>
                                <td id="slot15" className="boardSlot train"><img id="slot15" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-train" src="/train.svg" alt={`${this.state.gameInfos.slots[15].name}`}/></td>
                                <td id="slot35" className="boardSlot train"><img id="slot35" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-train" src="/train.svg" alt={`${this.state.gameInfos.slots[35].name}`}/></td>
                            </tr>
                            <tr>
                                <td id="slot14" onClick={this.displaySlot.bind(this)} className="boardSlot pink slot-property">{this.state.gameInfos.slots[14].name}</td>
                                <td id="slot36" className="boardSlot chance"><img id="slot36" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-chance" src="/chance.svg" alt={`${this.state.gameInfos.slots[36].name}`}/></td>
                            </tr>
                            <tr>
                                <td id="slot13" onClick={this.displaySlot.bind(this)} className="boardSlot pink slot-property">{this.state.gameInfos.slots[13].name}</td>
                                <td id="slot37" onClick={this.displaySlot.bind(this)} className="boardSlot blue slot-property">{this.state.gameInfos.slots[37].name}</td>
                            </tr>
                            <tr>
                                <td id="slot12" onClick={this.displaySlot.bind(this)} className="boardSlot utility slot-utility">{this.state.gameInfos.slots[12].name}</td>
                                <td className="void" colSpan={9} rowSpan={2} />
                                <td id="slot38" onClick={this.displaySlot.bind(this)} className="boardSlot tax slot-tax">{this.state.gameInfos.slots[38].name}</td>
                            </tr>
                            <tr>
                                <td id="slot11" onClick={this.displaySlot.bind(this)} className="boardSlot pink slot-property">{this.state.gameInfos.slots[11].name}</td>
                                <td id="slot39" onClick={this.displaySlot.bind(this)} className="boardSlot blue slot-property">{this.state.gameInfos.slots[39].name}</td>
                            </tr>
                            <tr>
                                <td id="slot10" onClick={this.displaySlot.bind(this)} className="boardSlot jail slot-jail">{this.state.gameInfos.slots[10].name}</td>
                                <td id="slot9" onClick={this.displaySlot.bind(this)} className="boardSlot white slot-property">{this.state.gameInfos.slots[9].name}</td>
                                <td id="slot8" onClick={this.displaySlot.bind(this)} className="boardSlot white slot-property">{this.state.gameInfos.slots[8].name}</td>
                                <td id="slot7" className="boardSlot chance"><img id="slot7" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-chance" src="/chance.svg" alt={`${this.state.gameInfos.slots[7].name}`}/></td>
                                <td id="slot6" onClick={this.displaySlot.bind(this)} className="boardSlot white slot-property">{this.state.gameInfos.slots[6].name}</td>
                                <td id="slot5" className="boardSlot train"><img id="slot5" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-train" src="/train.svg" alt={`${this.state.gameInfos.slots[5].name}`}/></td>
                                <td id="slot4" onClick={this.displaySlot.bind(this)} className="boardSlot tax slot-tax">{this.state.gameInfos.slots[4].name}</td>
                                <td id="slot3" onClick={this.displaySlot.bind(this)} className="boardSlot brown slot-property">{this.state.gameInfos.slots[3].name}</td>
                                <td id="slot2" className="boardSlot chest"><img id="slot2" onClick={this.displaySlotImage.bind(this)} className="slotImage slot-chest" src="/chest.svg" alt={`${this.state.gameInfos.slots[2].name}`}/></td>
                                <td id="slot1" onClick={this.displaySlot.bind(this)} className="boardSlot brown slot-property">{this.state.gameInfos.slots[1].name}</td>
                                <td id="slot0" onClick={this.displaySlotImage.bind(this)} className="boardSlot start"><img className="slotImage arrow slot-start" src="/arrow.svg" alt={`${this.state.gameInfos.slots[0].name}`}/></td>
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
                        {this.state.messages.map((message) => this.displayMessage(message))}
                    </div>

                    {this.state.showEmojiPicker && 
                        <div id="emojiPicker">
                            <EmojiPicker height="100%" width="100%" onEmojiClick={this.emojiClick.bind(this)} emojiStyle={EmojiStyle.NATIVE} />
                        </div>
                    }

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
                            <div id="emojiPickerBtn" onClick={this.toggleEmojiPicker.bind(this)} title="Pick an emoji">
                                <Emoji unified="1f604" size={25} emojiStyle={EmojiStyle.NATIVE}/>
                            </div>

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