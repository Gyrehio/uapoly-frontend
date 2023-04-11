import React, {Component} from "react";

type UserDisplayProps = {};

type UserDisplayState = {
    login: string,
    email: string,
    friends: string[],
    received: string[],
    sent: string[],
}

class UserDisplay extends Component<UserDisplayProps, UserDisplayState> {
    constructor(props) {
        super(props);

        let states: UserDisplayState = {
            login: '',
            email: '',
            friends: [],
            received: [],
            sent: [],
        };

        this.state = {
            login: '',
            email: '',
            friends: [],
            received: [],
            sent: [],
        };

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
                            email: meJson.email,
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

        this.setState(states);

        console.log(this.state);
    }

    render(): React.ReactNode {
        return(
            <>
                <div className="displayInfos">
                    <div className="infoTitle">
                        <label className="title" htmlFor="title">Your informations</label>
                    </div>
                    <div>
                        <label className="infos" htmlFor="loginLabel">Login : {this.state.login}</label>
                    </div>
                    <div>
                        <label className="infos" htmlFor="emailLabel">Email : {this.state.email}</label>
                    </div>
                </div>
                <div className="displayInfos">
                    <div className="infoTitle">
                        <label className="title" htmlFor="title">Your friendlist</label>
                    </div>
                    <div className="friend">
                        {this.state.friends.map((friend) => (
                        <>
                            <div className="friend">{friend}</div>
                            <input type="button" name={friend} value={"Remove friend"} onClick={removeFriendButton}/>
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
                            <input type="button" name={friend} value={"Accept the invitation"} onClick={addFriendButton}/>
                            <input type="button" name={friend} value={"Refuse the invitation"} onClick={removeFriendButton}/>
                        </>
                        ))}
                        
                    </div>
                    <div className="sent">
                        <label className="sentInvites" htmlFor="sentInvites">Sent</label>
                        {this.state.sent.map((friend) => (
                        <>
                            <div className="friend">{friend}</div>
                            <input type="button" name={friend} value={"Don't invite anymore"} onClick={removeFriendButton}/>
                        </>
                        ))}
                    </div>
                </div>
                <div className="displayInfos">
                    <div className="infoTitle">
                        <label className="title" htmlFor="title">Add a friend</label>
                        <input type="text" name="addFriendLogin" /><br/>
                        <input type="button" name="addFriend" value={"Add friend"} onClick={addFriendWriting} /><br/>
                    </div>
                </div>
            </>
            
        );
    }
}

function addFriendWriting(e) {
    e.preventDefault();
    const obj = JSON.stringify({
        "login": this.state.newfriendlogin,
    });

    fetch('/friend/add', {
        method: "POST",
        body: obj,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer ".concat(localStorage.token)
        }
    })
    .then((response) => response.json())
    .then((result) => console.log(result));
}

function addFriendButton(e) {
    e.preventDefault();
    const login = e.target.name;

    const obj = JSON.stringify({
        "login": login
    });

    fetch('/friend/add', {
        method: "POST",
        body: obj,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer ".concat(localStorage.token)
        }
    })
    .then((response) => response.json())
    .then((result) => console.log(result));
}

function removeFriendButton(e) {
    e.preventDefault();
    const login = e.target.name;

    const obj = JSON.stringify({
        "login": login,
    });

    fetch('/friend/remove', {
        method: "POST",
        body: obj,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer ".concat(localStorage.token)
        }
    })
    .then((response) => response.json())
    .then((result) => console.log(result));
}

export default UserDisplay;