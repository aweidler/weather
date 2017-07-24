/**
 * Created by aweidler on 7/19/17.
 */
import React, { Component } from 'react';
import "./Overlay.css";


class Overlay extends Component{

    constructor(props){
        super(props);

        this.about = "This visualization follows both a slideshow and martini glass structure. " +
            "The entire visualization consists of slides that are controlled via triggers in each component, " +
            "or the navigation triggers at the top. After the slideshow ends, the user can choose to explore other cities. " +
            "This will restart the slideshow with different parameters. Each slide can be considered a scene. " +
            "Also, when each error column is selected, the \"day\" or \"high/low\" parameter is set. " +
            "These triggers update the line chart to a new scene where the user can drill down and investigate. " +
            "Users will know to select these triggers because of the highlight effect on a mouseover event and information in annotations. " +
            "The bottom slider in the detail chart is also a trigger that updates both the error chart and detail chart by setting new start and end date parameters. " +
            "Annotations exist as descriptions for each slide and can be cleared using the \"Hide\" button. Annotations are also available " +
            "as a hover effect for each data point on the line chart; these present the user with more detailed information and " +
            "are cleared on a mouseout event. The overall design of the visualization is minimalistic. There are only two colors used " +
            "that accent the high/low temperature theme and consistant button styles are used. Hover effects on buttons, icons, and mouse changes " +
            "help the user know what is selectable in the visualization.";

        this.state = {
            showAbout: false,
        };
    }



    render(){
        return (
            <div className="overlay">
                <div>
                    <div className="titles">
                        <h1>{this.props.title}</h1>
                        <h2>
                            {this.props.subtitle}
                        </h2>
                    </div>
                    <blockquote>
                        {this.state.showAbout ? this.about : this.props.description}
                    </blockquote>
                    <div className="buttons">
                        <button onClick={() => this.setState({showAbout: !this.state.showAbout}) } >
                            <i className="fa fa-info-circle" aria-hidden="true"></i> About the {!this.state.showAbout ? "Visualization" : "Data" }
                        </button>
                        <button onClick={() => this.props.sendTo('overview')}>Click to Begin <i className="fa fa-arrow-right" aria-hidden="true"></i> </button>
                    </div>
                </div>
            </div>
        );
    }

}

export default Overlay;