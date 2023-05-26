import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Slider, Switch } from "@mui/material";
import React from "react";
import { ChangeEvent } from "react";

export default function ManagePropertiesDialog(props): JSX.Element {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFinish = () => {
        
        handleClose();
    };

    const buildableProperties: JSX.Element[] = [];
    const trainStations = [];
    const utilities = [];

    props.ownedProperties.forEach((property) => {
        if(property.propertyRent) {
            buildableProperties.push(BuildableProperty(property));
        } else if(property.trainRent) {
            trainStations.push(TrainProperty(property));
        } else if(property.utilityRent) {
            utilities.push(UtilityProperty(property));
        } else {
            console.error("Property has no rent value");
        }
    });

    let buildablePropertiesDisplay = (<span></span>);
    if(buildableProperties.length > 0) {
        buildablePropertiesDisplay = (
            <div>
                <h3>Buildable properties</h3>
                { buildableProperties }
            </div>
        );
    }

    let trainStationsDisplay = (<span></span>);
    if(trainStations.length > 0) {
        trainStationsDisplay = (
            <div>
                <h3>Train stations</h3>
                { trainStations }
            </div>
        );
    }

    let utilitiesDisplay = (<span></span>);
    if(utilities.length > 0) {
        utilitiesDisplay = (
            <div>
                <h3>Utilities</h3>
                { utilities }
            </div>
        );
    }

    return (
        <div>
            <button onClick={handleClickOpen}>Manage Properties</button>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Manage Properties</DialogTitle>
                <DialogContent>
                    { buildablePropertiesDisplay }
                    { trainStationsDisplay }
                    { utilitiesDisplay }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleFinish}>Finish</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function BuildableProperty(property) {
    const [state, setState] = React.useState({
        state: property.state,
        numberOfBuildings: property.numberOfBuildings,
    });

    const setMortgaged = (_e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        property.state = checked ? "MORTGAGED" : "OWNED";
        setState({ ...state, state: property.state });
    };

    const setNumberOfBuildings = (_e: Event, value: number) => {
        property.numberOfBuildings = value;
        setState({ ...state, numberOfBuildings: property.numberOfBuildings });
    };

    const marks = [
        {
            value: 0,
            label: "None",
        },
        {
            value: 1,
            label: "1",
        },
        {
            value: 2,
            label: "2",
        },
        {
            value: 3,
            label: "3",
        },
        {
            value: 4,
            label: "4",
        },
        {
            value: 5,
            label: "Hotel",
        },
    ];

    return (
        <div>
            <DialogContentText>{ property.name }</DialogContentText>
            <FormControlLabel control={<Switch onChange={setMortgaged} checked={state.state !== "OWNED"}/>} label="Mortgaged"/>
            <Slider value={state.numberOfBuildings} onChangeCommitted={setNumberOfBuildings} min={0} max={5} step={1} valueLabelDisplay="auto" marks={marks} />
        </div>
    );
}

function TrainProperty(property) {
    const [state, setState] = React.useState({
        state: property.state,
    });

    const setMortgaged = (_e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        property.state = checked ? "MORTGAGED" : "OWNED";
        setState({... state, state: property.state });
    };

    return (
        <div>
            <DialogContentText>{ property.name }</DialogContentText>
            <FormControlLabel control={<Switch onChange={setMortgaged} checked={state.state !== "OWNED"}/>} label="Mortgaged"/>
        </div>
    );
}

function UtilityProperty(property) {
    const [state, setState] = React.useState({
        state: property.state,
    });

    const setMortgaged = (_e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        property.state = checked ? "MORTGAGED" : "OWNED";
        setState({... state, state: property.state });
    };

    return (
        <div>
            <DialogContentText>{ property.name }</DialogContentText>
            <FormControlLabel control={<Switch onChange={setMortgaged} checked={state.state !== "OWNED"}/>} label="Mortgaged"/>
        </div>
    );
}