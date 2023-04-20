import React, {Component} from "react";
import UserHeader from "./UserHeader.tsx";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type FriendPageProps = {}

type FriendPageState = {
    login: string,
    friends: string[],
    received: string[],
    sent: string[],
    friendLogin: string,
    open: boolean
};

class FriendPage extends Component<FriendPageProps, FriendPageState> {
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            friends: [],
            received: [],
            sent: [],
            friendLogin: '',
            open: false
        }

        this.update();
    }

    handleOpen() {
        this.setState({
            login: this.state.login,
            friends: this.state.friends,
            received: this.state.received,
            sent: this.state.sent,
            friendLogin: this.state.friendLogin,
            open: true
        });
    }

    handleClose() {
        this.setState({
            login: this.state.login,
            friends: this.state.friends,
            received: this.state.received,
            sent: this.state.sent,
            friendLogin: this.state.friendLogin,
            open: false
        });
    }

    handleLogin(e) {
        this.setState({
            login: this.state.login,
            friends: this.state.friends,
            received: this.state.received,
            sent: this.state.sent,
            friendLogin: e.target.value,
            open: this.state.open
        });
    }

    handleClick(e) {
        e.preventDefault();

        const obj = JSON.stringify({
            "login": this.state.friendLogin
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
        .then(() => this.update())
        .then(() => this.handleClose());

        console.log(this.props);
    }

    update() {
        this.setState({
            login: '',
            friends: [],
            received: [],
            sent: [],
            friendLogin: '',
            open: this.state.open
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

        fetch('/friend/remove', {
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

            fetch('/friend/add', {
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
                        <div className="friendDialog">
                            <Button variant="outlined" onClick={this.handleOpen.bind(this)}>
                              Add a friend
                            </Button>
                            <Dialog open={this.state.open} onClose={this.handleClose.bind(this)}>
                              <DialogTitle>Search an account</DialogTitle>
                              <DialogContent>
                                <DialogContentText>
                                  Search an account by entering his login to add it to your friend list.
                                </DialogContentText>
                                <TextField
                                  autoFocus
                                  margin="dense"
                                  id="name"
                                  label="Your friend login"
                                  type="text"
                                  fullWidth
                                  variant="standard"
                                  onChange={this.handleLogin.bind(this)}
                                />
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={this.handleClose.bind(this)}>Cancel</Button>
                                <Button onClick={this.handleClick.bind(this)}>Confirm</Button>
                              </DialogActions>
                            </Dialog>
                        </div>
                        <div className="friendlist">
                            <label className="title">Your friend list</label>
                            {this.state.friends.map((friend) => (
                            <>
                                <div className="friends">
                                    <label>{friend}</label>
                                    <img name={friend} width={15} height={15} onClick={this.clickOnRemoveButton.bind(this)} src="/red-tick.png" alt={"Remove"} />
                                </div>
                            </>
                            ))}
                        </div>
                    </div>
                    <div className="pending">
                        <div className="receivedRequests">
                            <label className="title">Received requests</label>
                            {this.state.received.map((friend) => (
                            <>
                                <div className="friends">
                                    <label>{friend}</label>
                                    <img name={friend} width={15} height={15} onClick={this.clickOnAddButton.bind(this)} src="/green-tick.png" alt={"Accept"} />
                                    <img name={friend} width={15} height={15} onClick={this.clickOnRemoveButton.bind(this)} src="/red-tick.png" alt={"Decline"} />
                                </div>
                            </>
                            ))}
                        </div>
                        <div className="sentRequests">
                            <label className="title">Sent requests</label>
                            {this.state.sent.map((friend) => (
                            <>
                                <div className="friends">
                                    <label>{friend}</label>
                                    <img name={friend} width={15} height={15} onClick={this.clickOnRemoveButton.bind(this)} src="/red-tick.png" alt={"Cancel"} />
                                </div>
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