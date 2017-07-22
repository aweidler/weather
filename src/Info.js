/**
 * Created by aweidler on 7/22/17.
 */
import React, { Component } from 'react';
import './App.css';

class Info extends Component{

    constructor(props){
        super(props);
        this.state = {display: true};
    }


    toggle(){
        this.setState({display: !this.state.display});
    }

    render(){
        return (
            <aside className="chart-info">
                <blockquote style={{display: this.state.display ? "block" : "none" }} dangerouslySetInnerHTML={{ __html: this.props.info}} />
                <button onClick={() => this.toggle()} className="hide-content">
                    <i className={"fa " + (this.state.display ? "fa-arrow-up" : "fa-arrow-down") } aria-hidden="true"></i>
                    <span>{ this.state.display ? "Hide" : "Show" }</span>
                </button>
            </aside>
        );
    }
}

export default Info;