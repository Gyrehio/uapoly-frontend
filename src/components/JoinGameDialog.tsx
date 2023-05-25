import React, {Component} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type JoinGameDialogProps = {};

type JoinGameDialogState = {
    gameId: number,
    password: string,
    open: boolean
};

class JoinGameDialog extends Component<JoinGameDialogProps, JoinGameDialogState> {
    constructor(props) {
        super(props);

        this.state = {
            gameId: 0,
            password: "",
            open: false
        };
    }

    handleOpen() {
        this.setState({
            gameId: this.state.gameId,
            password: this.state.password,
            open: true
        });
    }

    handleClose() {
        this.setState({
            gameId: this.state.gameId,
            password: this.state.password,
            open: false
        });
    }

    handleId(e) {
        this.setState({
            gameId: e.target.value,
            password: this.state.password,
            open: this.state.open
        });
    }

    handlePassword(e) {
        this.setState({
            gameId: this.state.gameId,
            password: e.target.value,
            open: this.state.open
        });
    }

    handleClick(e) {
        e.preventDefault();

        const obj = JSON.stringify({
            "gameId": this.state.gameId,
            "password": this.state.password
        });
        console.log(obj);

        const loader = async () => {
            const user = await (await fetch('/api/game/join', {
                method: "POST",
                body: obj,
                headers: {
                    "Authorization": "Bearer ".concat(localStorage.token),
                    "Content-Type": "application/json"
                }
            })).json();

            if (user) {
                if (user["message"] != null) {
                    this.setState({
                        gameId: 0,
                        password: "",
                        open: false
                    });
                    alert(user["message"]);
                } else {
                    this.handleClose();
                    alert("Game is joined !");
                    window.location.reload();
                }
            }
        };
        
        loader();
    }

    render(): React.ReactNode {
        return(
            <div className="joinDialog">
                <Button variant="outlined" onClick={this.handleOpen.bind(this)}>
                  Join a game
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose.bind(this)} onKeyDown={(e) => {if (e.key === 'Enter') this.handleClose.bind(this);}}>
                  <DialogTitle>Join a game</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Please enter the game ID and the password of the room, if it exists.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Game ID"
                      type="number"
                      fullWidth
                      variant="standard"
                      onChange={this.handleId.bind(this)}
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Password"
                      type="password"
                      fullWidth
                      variant="standard"
                      onChange={this.handlePassword.bind(this)}
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

export default JoinGameDialog;