import React, {Component} from "react";
import UserHeader from "./UserHeader.tsx";
import Footer from "./Footer.tsx";

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
    searchValue: string,
    matchingNames: string[],
    open: boolean
};

class FriendPage extends Component<FriendPageProps, FriendPageState> {
    timeoutId: number | undefined   
    
    constructor(props) {
        super(props);

        this.state = {
            login: '',
            friends: [],
            received: [],
            sent: [],
            searchValue: '',
            matchingNames: [],
            open: false
        }

        this.timeoutId = undefined;

        this.update();
    }

    handleOpen() {
        this.setState({
            open: true
        });
    }

    handleClose() {
        this.setState({
            searchValue: "",
            matchingNames: [],
            open: false
        });
    }

    handleLogin(e) {
        this.setState({
            searchValue: e.target.value
        });

        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.setState({matchingNames: []});
            console.log(this.state.searchValue);
            const obj = JSON.stringify({
                "login": this.state.searchValue,
                "page": 1
            });

            fetch('/api/user/search', {
                method: "POST",
                body: obj,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer ".concat(localStorage.token)
                }
            })
            .then((response) => response.json())
            .then((data: object[]) => data.map((friend: any) => {
                this.state.matchingNames.push(friend.login);
            }))
            .then(() => this.update());
        }, 500);
    }

    handleClick(e) {
        e.preventDefault();

        const obj = JSON.stringify({
            "login": this.state.searchValue
        });

        const loader = async () => {
            const user = await (await fetch('/api/friend/add', {
                method: "POST",
                body: obj,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer ".concat(localStorage.token)
                }
            })).json();
            
            if (user) {
                if (user["message"] !== "Friend request sent") {
                    this.setState({
                        login: '',
                        friends: [],
                        received: [],
                        sent: [],
                        searchValue: '',
                        open: false
                    });
                    this.update();
                    this.handleClose();
                    alert(user["message"]);
                } else {
                    this.update();
                    this.handleClose();
                }
            }
        }

        loader();
    }

    update() {
        const me = fetch('/api/user/me', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        })

        const friend = fetch('/api/friend', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ".concat(localStorage.token)
            }
        })

        const pending = fetch('/api/friend/pending', {
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

        fetch('/api/friend/remove', {
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

            fetch('/api/friend/add', {
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
                                {this.state.matchingNames.map((friend) => (
                                <>
                                    <div className="friends">
                                        <label>{friend}</label>
                                        <img name={friend} width={15} height={15} onClick={this.clickOnAddButton.bind(this)} src="/green-tick.png" alt={"Accept"} />
                                        <img name={friend} width={15} height={15} onClick={this.clickOnRemoveButton.bind(this)} src="/red-tick.png" alt={"Decline"} />
                                    </div>
                                </>
                                ))}
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={this.handleClose.bind(this)}>Close</Button>
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
                            {this.state.friends.length === 0 &&
                                <label className="empty"><i>You don't have any friend yet. Try to add someone with the "Add a friend" button !</i></label>
                            }
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
                            {this.state.received.length === 0 &&
                                <label className="empty"><i>You don't have any received friend request for the moment.</i></label>
                            }
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
                            {this.state.sent.length === 0 &&
                                <label className="empty"><i>You didn't send any friend request for the moment. Try to use the "Add a friend" button to send one !</i></label>
                            }
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }   
}

export default FriendPage;