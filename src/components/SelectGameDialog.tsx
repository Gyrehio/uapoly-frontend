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
    name: string,
    open: boolean
};

class SelectGameDialog extends Component<SelectGameDialogProps, SelectGameDialogState> {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            open: false
        };
    }

    handleOpen() {
        this.setState({
            name: this.state.name,
            open: true
        });
    }

    handleClose() {
        this.setState({
            name: this.state.name,
            open: false
        });
    }

    handleName(e) {
        this.setState({
            name: e.target.value,
            open: this.state.open
        });
    }

    handleClick(e) {
        e.preventDefault();

        this.handleClose();
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