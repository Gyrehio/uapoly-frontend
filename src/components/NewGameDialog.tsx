import React, {Component} from "react";
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type NewGameDialogProps = {}

type NewGameDialogState = {
    maxPlayers: number,
    salary: number,
    initialMoney: number,
    friendsOnly: boolean,
    password: string,
    locale: string,
    name: string,
    open: boolean
}

class NewGameDialog extends Component<NewGameDialogProps, NewGameDialogState> {
    constructor(props) {
        super(props);

        this.state = {
            maxPlayers: 2,
            salary: 500,
            initialMoney: 2500,
            friendsOnly: false,
            password: "",
            locale: "en-US",
            name: "",
            open: false
        }
    }

    handleOpen() {
        this.setState({
            maxPlayers: this.state.maxPlayers,
            salary: this.state.salary,
            initialMoney: this.state.initialMoney,
            friendsOnly: this.state.friendsOnly,
            password: this.state.password,
            locale: this.state.locale,
            name: this.state.name,
            open: true
        });
    }

    handleClose() {
        this.setState({
            maxPlayers: this.state.maxPlayers,
            salary: this.state.salary,
            initialMoney: this.state.initialMoney,
            friendsOnly: this.state.friendsOnly,
            password: this.state.password,
            locale: this.state.locale,
            name: this.state.name,
            open: false
        });
    }

    handlePlayers(e) {
        this.setState({
            maxPlayers: e.target.value,
            salary: this.state.salary,
            initialMoney: this.state.initialMoney,
            friendsOnly: this.state.friendsOnly,
            password: this.state.password,
            locale: this.state.locale,
            name: this.state.name,
            open: this.state.open
        });
    }

    handleSalary(e) {
        this.setState({
            maxPlayers: this.state.maxPlayers,
            salary: e.target.value,
            initialMoney: this.state.initialMoney,
            friendsOnly: this.state.friendsOnly,
            password: this.state.password,
            locale: this.state.locale,
            name: this.state.name,
            open: this.state.open
        });
    }

    handleInitial(e) {
        this.setState({
            maxPlayers: this.state.maxPlayers,
            salary: this.state.salary,
            initialMoney: e.target.value,
            friendsOnly: this.state.friendsOnly,
            password: this.state.password,
            locale: this.state.locale,
            name: this.state.name,
            open: this.state.open
        });
    }

    handleFriends(e) {
        if (e.target.value === "true") {
            this.setState({
                maxPlayers: this.state.maxPlayers,
                salary: this.state.salary,
                initialMoney: this.state.initialMoney,
                friendsOnly: true,
                password: this.state.password,
                locale: this.state.locale,
                name: this.state.name,
                open: this.state.open
            });
        } else {
            this.setState({
                maxPlayers: this.state.maxPlayers,
                salary: this.state.salary,
                initialMoney: this.state.initialMoney,
                friendsOnly: false,
                password: this.state.password,
                locale: this.state.locale,
                name: this.state.name,
                open: this.state.open
            });
        }
    }

    handlePassword(e) {
        this.setState({
            maxPlayers: this.state.maxPlayers,
            salary: this.state.salary,
            initialMoney: this.state.initialMoney,
            friendsOnly: this.state.friendsOnly,
            password: e.target.value,
            locale: this.state.locale,
            name: this.state.name,
            open: this.state.open
        });
    }

    handleLocale(e) {
        this.setState({
            maxPlayers: this.state.maxPlayers,
            salary: this.state.salary,
            initialMoney: this.state.initialMoney,
            friendsOnly: this.state.friendsOnly,
            password: this.state.password,
            locale: e.target.value,
            name: this.state.name,
            open: this.state.open
        });
    }

    handleName(e) {
        this.setState({
            maxPlayers: this.state.maxPlayers,
            salary: this.state.salary,
            initialMoney: this.state.initialMoney,
            friendsOnly: this.state.friendsOnly,
            password: this.state.password,
            locale: this.state.locale,
            name: e.target.value,
            open: this.state.open
        });
    }

    handleClick(e) {
        e.preventDefault();

        const obj = JSON.stringify({
            "maxPlayers": this.state.maxPlayers,
            "salary": this.state.salary,
            "initialMoney": this.state.initialMoney,
            "friendsOnly": this.state.friendsOnly,
            "password": this.state.password,
            "locale": this.state.locale,
            "name": this.state.name
        });

        console.log(obj);

        const loader = async () => {
            const user = await (await fetch('/game/create', {
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
                        maxPlayers: 2,
                        salary: 500,
                        initialMoney: 2500,
                        friendsOnly: false,
                        password: "",
                        locale: "en-US",
                        open: false
                    });
                    alert(user["message"]);
                } else {
                    alert("Game is created !");
                }
            }
        };
        
        loader();
    }

    render(): React.ReactNode {
        return(
            <div>
                <Button variant="outlined" onClick={this.handleOpen.bind(this)}>
                  Create a game
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose.bind(this)}>
                  <DialogTitle>Create a game</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Please enter all the informations required to create your game (password is optionnal).
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Name of the room"
                      type="text"
                      fullWidth
                      variant="standard"
                      onChange={this.handleName.bind(this)}
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Number of players"
                      type="number"
                      defaultValue={2}
                      fullWidth
                      variant="standard"
                      onChange={this.handlePlayers.bind(this)}
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Salary"
                      type="number"
                      defaultValue={500}
                      fullWidth
                      variant="standard"
                      onChange={this.handleSalary.bind(this)}
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Initial money"
                      type="number"
                      defaultValue={2500}
                      fullWidth
                      variant="standard"
                      onChange={this.handleInitial.bind(this)}
                    />
                    <FormControl>
                      <FormLabel id="demo-radio-buttons-group-label">Only friends ?</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="false"
                        name="radio-buttons-group"
                      >
                        <FormControlLabel value="true" control={<Radio />} label="Yes" onChange={this.handleFriends.bind(this)} />
                        <FormControlLabel value="false" control={<Radio />} label="No" onChange={this.handleFriends.bind(this)} />
                      </RadioGroup>
                    </FormControl>
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
                    <FormControl fullWidth>
                      <InputLabel id="select-label">Board Language</InputLabel>
                      <Select
                        labelId="select-label"
                        id="select"
                        label="Board language"
                        defaultValue={"en-US"}
                        onChange={this.handleLocale.bind(this)}
                      >
                        <MenuItem value={"en-US"}>American Board</MenuItem>
                        <MenuItem value={"fr-FR"}>Plateau français</MenuItem>
                      </Select>
                    </FormControl>
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

export default NewGameDialog;