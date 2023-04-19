import React, {Component} from "react";
import UserHeader from "./UserHeader.tsx";

type FriendPageProps = {};

type FriendPageState = {
    login: string,
    friends: string[],
    received: string[],
    sent: string[]
};

class FriendPage extends Component<FriendPageProps, FriendPageState> {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            friends: [],
            received: [],
            sent: []
        }

        this.update();
    }

    update() {
        this.setState({
            login: '',
            friends: [],
            received: [],
            sent: [],
        });

        const me = fetch('/user/me', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        })

        const friend = fetch('/friend', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        })

        const pending = fetch('friend/pending', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        })

        Promise.all([me, friend, pending])
        .then(([meResolved, friendResolved, pendingResolved]) => {
            Promise.all([meResolved.json(), friendResolved.json(), pendingResolved.json()])
            .then(([meJson, friendJson, pendingJson]) => {
                this.setState({
                    login: meJson.login,
                    friends: friendJson.map((friend) => {
                        if (friend.firstAccountLogin !== meJson.login) {
                            return friend.firstAccountLogin;
                        } else {
                            return friend.secondAccountLogin;
                        }
                    }),
                    received: pendingJson.received.map((friend) => friend.firstAccountLogin),
                    sent: pendingJson.sent.map((friend) => friend.secondAccountLogin),
                })
            });
        });
    }

    clickOnRemoveButton(e) {
        e.preventDefault();
        const login = e.target.name;

        const obj = JSON.stringify({
            "login": login,
        });

        const action = fetch('/friend/remove', {
            method: "POST",
            body: obj,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        })
        .then((response) => response.json())
        .then(() => this.update());
    }

    clickOnAddButton(e) {
        e.preventDefault();
        const login = e.target.name;

        const obj = JSON.stringify({
            "login": login
        });

        const action = fetch('/friend/add', {
            method: "POST",
            body: obj,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        })
        .then((response) => response.json())
        .then(() => this.update());
    }

    clickOnAddWriting(e) {
        e.preventDefault();
        const login = document.querySelector('input[type="text"]')?.value;
        const obj = JSON.stringify({
            "login": login
        });

        const action = fetch('/friend/add', {
            method: "POST",
            body: obj,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        })
        .then((response) => response.json())
        .then(() => this.update());
    }

    render(): React.ReactNode {
        return(
            <>
                <UserHeader />
                <div className="content">
                    <div className="list&add">
                        <div><label>BOUTON DIALOGUE WSH</label></div>
                        <div className="friendlist">
                            <label>Your friend list</label>
                            <div className="friends">
                            {this.state.friends.map((friend) => (
                            <>
                                <div className="friends">{friend}</div>
                                <input type="button" name={friend} value={"Remove friend"} onClick={this.clickOnRemoveButton.bind(this)}/>
                            </>
                            ))}
                        </div>
                        </div>
                    </div>
                    <div className="pending">
                        <div className="receivedRequests">
                            <label>Received requests</label>
                            {this.state.received.map((friend) => (
                            <>
                                <div className="friend">{friend}</div>
                                <input type="button" name={friend} value={"Accept the invitation"} onClick={this.clickOnAddButton.bind(this)}/>
                                <input type="button" name={friend} value={"Refuse the invitation"} onClick={this.clickOnRemoveButton.bind(this)}/>
                            </>
                            ))}
                        </div>
                        <div className="sentRequests">
                            <label>Sent requests</label>
                            {this.state.sent.map((friend) => (
                            <>
                                <div className="friend">{friend}</div>
                                <input type="button" name={friend} value={"Don't invite anymore"} onClick={this.clickOnRemoveButton.bind(this)}/>
                            </>
                            ))}
                        </div>
                    </div>
                </div>
                {/*<div className="displayInfos">
                    <div className="infoTitle">
                        <label className="title" htmlFor="title">Your friend list</label>
                    </div>
                    <div className="friend">
                        {this.state.friends.map((friend) => (
                        <>
                            <div className="friend">{friend}</div>
                            <input type="button" name={friend} value={"Remove friend"} onClick={this.clickOnRemoveButton.bind(this)}/>
                        </>
                        ))}
                    </div>
                </div>
                <div className="displayInfos">
                    <div className="infoTitle">
                        <label className="title" htmlFor="title">Your friend requests</label>
                    </div>

                    <div className="received">
                        <label className="receivedInvites" htmlFor="receivedInvites">Received</label>
                        {this.state.received.map((friend) => (
                        <>
                            <div className="friend">{friend}</div>
                            <input type="button" name={friend} value={"Accept the invitation"} onClick={this.clickOnAddButton.bind(this)}/>
                            <input type="button" name={friend} value={"Refuse the invitation"} onClick={this.clickOnRemoveButton.bind(this)}/>
                        </>
                        ))}
                        
                    </div>
                    <div className="sent">
                        <label className="sentInvites" htmlFor="sentInvites">Sent</label>
                        {this.state.sent.map((friend) => (
                        <>
                            <div className="friend">{friend}</div>
                            <input type="button" name={friend} value={"Don't invite anymore"} onClick={this.clickOnRemoveButton.bind(this)}/>
                        </>
                        ))}
                    </div>
                </div>
                <div className="displayInfos">
                    <div className="infoTitle">
                        <label className="title" htmlFor="title">Add a friend</label>
                        <input type="text" name="addFriendLogin" /><br/>
                        <input type="button" name="addFriend" value={"Add friend"}  onClick={this.clickOnAddWriting.bind(this)} /><br/>
                    </div>
                        </div>*/}
            </>
        );
    }   
}

export default FriendPage;