import React, {Component} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type SelectGameDialogProps = {};

type SelectGameDialogState = {
    searchValue: string,
    matchingRooms: object[],
    password: string,
    open: boolean
};

class SelectGameDialog extends Component<SelectGameDialogProps, SelectGameDialogState> {
    constructor(props) {
        super(props);

        this.state = {
            searchValue: "",
            matchingRooms: [],
            password: "",
            open: false
        };

        this.timeoutId = null;
    }

    update() {
        this.setState({
            searchValue: ""
        })
    }

    handleOpen() {
        this.setState({
            open: true
        });
    }

    handleClose() {
        this.setState({
            open: false
        });
    }

    handleName(e) {
        this.setState({
            searchValue: e.target.value
        });

        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.setState({matchingRooms: []});
            console.log(this.state.searchValue);
            const obj = JSON.stringify({
                "name": this.state.searchValue,
                "page": 1
            });

            fetch('/api/game/search', {
                method: "POST",
                body: obj,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer ".concat(localStorage.token)
                }
            })
            .then((response) => response.json())
            .then((data) => data.map((game) => {
                this.state.matchingRooms.push({"gameId": game.id, "name": game.name});
            }))
            .then(() => this.update());
        }, 500);
    }

    handlePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    handleClick(e) {
        e.preventDefault();

        this.handleClose();
    }

    joinGame(e) {
        e.preventDefault();
        const gameId = e.target.id;
        const pswd = this.state.password;

        const obj  = JSON.stringify({
            "gameId": gameId,
            "password": pswd
        });

        const loader = async () => {
            const game = await (await fetch('/api/game/join', {
                method: "POST",
                body: obj,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer ".concat(localStorage.token)
                }
            })).json();
            
            if (game) {
                this.setState({
                    searchValue: "",
                    matchingRooms: [],
                    password: "",
                    open: false
                });
                this.update();
                this.handleClose();
                alert(game["message"]);
                window.location.reload();
            }
        }

        loader();
    }

    render(): React.ReactNode {
        return(
            <div className="selectDialog">
                <Button variant="outlined" onClick={this.handleOpen.bind(this)}>
                  Select a game
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose.bind(this)} onKeyDown={(e) => {if (e.key === 'Enter') this.handleClose.bind(this);}}>
                  <DialogTitle>Select a game</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Please enter the room name, any game which has a name corresponding to what is written will be displayed.
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Room name"
                      type="text"
                      fullWidth
                      variant="standard"
                      onChange={this.handleName.bind(this)}
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
                    <div className="games">
                    {this.state.matchingRooms.map((game) => (
                    <>
                        <span>{game["name"]}</span>
                        <img name={game["name"]} id={game["gameId"]} width={15} height={15} onClick={this.joinGame.bind(this)} src="/green-tick.png" alt={"Join"} />
                    </>
                    ))}
                    </div>
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

export default SelectGameDialog;