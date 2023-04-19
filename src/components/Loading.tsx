import React, {Component} from "react"

type LoadingProps = {};

type LoadingState = {
    isFinished: boolean
};

class Loading extends Component<LoadingProps, LoadingState> {
    constructor(props) {
        super(props);

        this.state = {
            isFinished: false
        }
    }

    render() {
        return(
            <>
            {this.state.isFinished === false && 
                <div id='loading' className="lds-ripple"><div></div><div></div></div>
            }
            </>
        );
    }
}

export default Loading;