/**
 * Created by aweidler on 7/19/17.
 */
import React, { Component } from 'react';
import "./Overlay.css";


class Overlay extends Component{

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
                        {this.props.description}
                    </blockquote>
                    <div className="buttons">
                        <button onClick={() => this.props.sendTo('overview')}>Click to Begin <i className="fa fa-play" aria-hidden="true"></i> </button>
                    </div>
                </div>
            </div>
        );
    }

}

export default Overlay;