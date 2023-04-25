import React, {Component} from "react"

type FooterProps = {}

type FooterState = {
    isClicked: boolean
}

class Footer extends Component<FooterProps, FooterState> {
    constructor(props) {
        super(props);

        this.state = {
            isClicked: false
        }
    }

    showLinks() {
        this.setState({
            isClicked : !this.state.isClicked
        })
    }

    render(): React.ReactNode {
        return(
            <div className="footer">
                <p>&copy; 2023 Tom Chedmail & Victor Loiseau</p>
                <div className="githubLinks">
                    {this.state.isClicked &&
                        <div>
                            <a href="https://github.com/ttcchhmm/uapoly-backend" target="_blank" >Backend</a>
                            <a href="https://github.com/Gyrehio/uapoly-frontend" target="_blank" >Frontend</a>
                        </div>
                    }
                    <img src="/Github.svg" alt="Links to the GitHub pages" onClick={this.showLinks.bind(this)} />
                </div>
            </div>
        );
    }
}

export default Footer;