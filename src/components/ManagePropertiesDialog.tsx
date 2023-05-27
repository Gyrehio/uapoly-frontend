import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Slider, Switch } from "@mui/material";
import React from "react";
import { ChangeEvent } from "react";
import { getSocket } from "../GlobalSocket";

/**
 * A dialog that allows the player to manage their properties.
 */
export default function ManagePropertiesDialog(props): JSX.Element {
    const [state, setState] = React.useState({
        /**
         * Whether the dialog is open.
         */
        open: false,

        /**
         * The properties owned by the player.
         */
        properties: props.ownedProperties.map((p) => {
            return {
                ...p,
                currentState: p.state,
            };
        }),
        
        /**
         * The properties that have been updated.
         */
        updated: [],

        /**
         * The debt that the player has to pay. Can be negative, if the bank owes the player money.
         */
        debt: 0,
    });

    /**
     * Builds a JSX element that allows the player to manage a buildable property.
     * @param property The property to manage.
     * @returns A JSX element that allows the player to manage the property.
     */
    const BuildableProperty = (property) => {   
        const setMortgaged = (_e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
            property.state = checked ? "MORTGAGED" : "OWNED";

            state.updated[property.position] = property;
            setState({ ...state, properties: state.properties, updated: state.updated, debt: state.debt + calculateMortagedDeltaDebt(property, checked) });
        };
    
        const setNumberOfBuildings = (_e: Event, value: number) => {
            const deltaDebt = (value - property.numberOfBuildings) * property.buildingPrice;
            property.numberOfBuildings = value;

            state.updated[property.position] = property;
            setState({ ...state, properties: state.properties, updated: state.updated, debt: state.debt + deltaDebt });
        };
    
        // Marks on the slider.
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
                <DialogContentText>{ property.name } / ${ property.buildingPrice } per building</DialogContentText>
                <FormControlLabel control={<Switch onChange={setMortgaged} checked={property.state !== "OWNED"}/>} label="Mortgaged"/>
                <Slider value={property.numberOfBuildings} onChangeCommitted={setNumberOfBuildings} min={0} max={5} step={1} valueLabelDisplay="auto" marks={marks} />
            </div>
        );
    };
    
    /**
     * Builds a JSX element that allows the player to manage a train property.
     * @param property The property to manage.
     * @returns A JSX element that allows the player to manage the property.
     */
    const TrainProperty = (property) => {
        const setMortgaged = (_e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
            property.state = checked ? "MORTGAGED" : "OWNED";

            state.updated[property.position] = property;
            setState({ ...state, properties: state.properties, updated: state.updated, debt: state.debt + calculateMortagedDeltaDebt(property, checked) });
        };
    
        return (
            <div>
                <DialogContentText>{ property.name }</DialogContentText>
                <FormControlLabel control={<Switch onChange={setMortgaged} checked={property.state !== "OWNED"}/>} label="Mortgaged"/>
            </div>
        );
    };
    
    /**
     * Builds a JSX element that allows the player to manage a utility property.
     * @param property The property to manage.
     * @returns A JSX element that allows the player to manage the property.
     */
    const UtilityProperty = (property) => {  
        const setMortgaged = (_e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
            property.state = checked ? "MORTGAGED" : "OWNED";

            state.updated[property.position] = property;
            setState({ ...state, properties: state.properties, updated: state.updated, debt: state.debt + calculateMortagedDeltaDebt(property, checked) });
        };
    
        return (
            <div>
                <DialogContentText>{ property.name }</DialogContentText>
                <FormControlLabel control={<Switch onChange={setMortgaged} checked={property.state !== "OWNED"}/>} label="Mortgaged"/>
            </div>
        );
    };

    const handleClickOpen = () => {
        setState({ ...state, open: true });
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const handleFinish = () => {
        getSocket().emit('manageProperties', {
            gameId: props.gameId,
            properties: state.updated.filter((p) => p !== null && p !== undefined).map((p) => {
                return {
                    position: p.position,
                    newState: p.state,
                    newNumberOfBuildings: p.numberOfBuildings,
                }
            }),
        });

        handleClose();
    };

    const buildableProperties: JSX.Element[] = [];
    const trainStations = [];
    const utilities = [];

    state.properties.forEach((property) => {
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

            <Dialog open={state.open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Manage Properties - Total: ${ state.debt }</DialogTitle>
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

/**
 * Calculates the delta debt for a morgagable property.
 * @param property The property to calculate the delta debt for.
 * @param checked Whether the property is mortgaged or not.
 * @returns The delta debt for the property.
 */
function calculateMortagedDeltaDebt(property, checked) {
    // Make sure to remove the debt if the property state does not change.
    let deltaDebt = 0;
    if(property.state !== property.currentState) {
        deltaDebt = checked ? Math.ceil(property.price / 2) : - Math.ceil(property.price / 2 + property.price / 10);
    } else {
        deltaDebt = property.currentState === "MORTGAGED" ? Math.ceil(property.price / 2 + property.price / 10) : - Math.ceil(property.price / 2);
    }

    return deltaDebt;
}