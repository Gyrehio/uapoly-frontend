import React, {Component} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type FriendDialogProps = {};

type FriendDialogState = {
    login: string,
    open: boolean
}

class FriendDialog extends Component<FriendDialogProps, FriendDialogState> {
    constructor(props) {
        super(props);

        this.state = {
            login: "",
            open: false
        }
    }

    handleOpen() {
        this.setState({
            login: this.state.login,
            open: true
        });
    }

    handleClose() {
        this.setState({
            login: this.state.login,
            open: false
        });
    }

    handleLogin(e) {
        this.setState({
            login: e.target.value,
            open: this.state.open
        });
    }

    handleClick(e) {
        e.preventDefault();

        const obj = JSON.stringify({
            "login": this.state.login
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
        .then(() => this.handleClose());
    }

    render(): React.ReactNode {
        return(
            <div>
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
        );
    }
}

export default FriendDialog;