import React, {Component} from "react";

class UserDisplay extends Component {
    constructor(props) {
        super(props);

        fetch('/user/me', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        })
        .then((response) => response.json())
        .then((result) => {
            console.log(result.login);
            console.log(result.email);
            this.state = {
                login: result.login,
                email: result.email
            }
        });

        fetch('/friend', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        })
        .then((response) => response.json())
        .then((result) => {
            let arr = [];
            for (let obj of result) {
                arr.push(obj.secondAccountLogin);
            }
            console.log(arr);
            this.state = {
                friends: arr
            }
        });

        fetch('friend/pending', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        })
        .then((response) => response.json())
        .then((result) => {
            let rec = [];
            let sent = [];
            for (let obj of result.received) {
                rec.push(obj.firstAccountLogin);
            }
            for (let obj of result.sent) {
                sent.push(obj.firstAccountLogin);
            }
            console.log(rec);
            console.log(sent);
            this.state = {
                received: rec,
                sent: sent
            }
        });
    }

    render(): React.ReactNode {
        return(
            <>
                <div className="displayInfos">
                    <div className="infoTitle">
                        <label className="title" htmlFor="title">Your informations</label>
                    </div>
                    <div>
                        <label className="infos" htmlFor="loginLabel">Login : {this.props.login}</label>
                    </div>
                    <div>
                        <label className="infos" htmlFor="emailLabel">Email : {this.props.email}</label>
                    </div>
                </div>
                <div className="displayInfos">
                    <div className="infoTitle">
                        <label className="title" htmlFor="title">Your friendlist</label>
                    </div>
                    <div className="friend">
                        {this.props.friends.map((friend) => (
                        <>
                            <div className="friend">{friend}</div>
                            <input type="button" name={friend} value={"Remove friend"} onClick={removeFriend}/>
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
                        {this.props.received.map((friend) => (
                        <>
                            <div className="friend">{friend}</div>
                            <input type="button" name={friend} value={"Add friend"} onClick={addFriend}/>
                        </>
                        ))}
                        
                    </div>
                    <div className="sent">
                        <label className="sentInvites" htmlFor="sentInvites">Sent</label>
                        {this.props.sent.map((friend) => (
                        <>
                            <div className="friend">{friend}</div>
                            <input type="button" name={friend} value={"Don't invite anymore"} onClick={removeFriend}/>
                        </>
                        ))}
                    </div>
                </div>
                <div className="displayInfos">
                    <div className="infoTitle">
                        <label className="title" htmlFor="title">Add a friend</label>
                        <input type="text" name="addFriendLogin" /><br/>
                        <input type="button" name="addFriend" value={"Add friend"} onClick={addFriend} /><br/>
                    </div>
                </div>
            </>
            
        );
    }
}

function addFriend(e) {
    e.preventDefault();
    const login = document.querySelector("input[name='addFriendLogin']").value;

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

function removeFriend(e) {
    e.preventDefault();
    const login = document.querySelector("input[name='removeFriendLogin']").value;

    const obj = JSON.stringify({
        "login": login,
    });

    fetch('/friend/remove', {
        method: "POST",
        body: obj,
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => response.json())
    .then((result) => console.log(result));
}

/*const UserDisplay=({login, email})=> {
    return(
        <>
            <div className="displayInfos">
                <div className="infoTitle">
                    <label className="title" htmlFor="title">Your informations</label>
                </div>
                <div>
                    <label className="infos" htmlFor="loginLabel">Login : {login}</label>
                </div>
                <div>
                    <label className="infos" htmlFor="emailLabel">Email : {email}</label>
                </div>
            </div>
            <div className="displayInfos">
                <div className="infoTitle">
                    <label className="title" htmlFor="title">Your friendlist</label>
                </div>
                <div>
                    
                </div>
            </div>
            <div className="displayInfos">
                <div className="infoTitle">
                    <label className="title" htmlFor="title">Your friend requests</label>
                </div>
                <div>
                    
                </div>
            </div>
            <div className="displayInfos">
                <div className="infoTitle">
                    <label className="title" htmlFor="title">Add a friend</label>
                    <input type="text" name="addFriendLogin" /><br/>
                    <input type="button" name="addFriend" value={"Add friend"} onClick={addFriend} /><br/>
                </div>
            </div>
            <div className="displayInfos">
                <div className="infoTitle">
                    <label className="title" htmlFor="title">Remove a friend</label>
                    <input type="text" name="removeFriendLogin" /><br/>
                    <input type="button" name="removeFriend" value={"Remove friend"} onClick={removeFriend} /><br/>
                </div>
            </div>
        </>
        
    );
}*/

export default UserDisplay;