/**
 * Created by aweidler on 7/22/17.
 */
import React, { Component } from 'react';

var PAGES = {
    detail: 'detail',
    overview: 'overview',
    front: 'front',
};

class Navigation extends Component{

    static GetPages(){
        return PAGES;
    }

    getName(name){
        return this.props.page === name ? "active" : "";
    }
    getIcon(name){
        return this.props.page === name ? "fa-stop" : "fa-play";
    }

    render(){
        return (
            <nav className="navigation">
                <div className="title">{this.props.title}</div>
                <a onClick={() => this.props.sendTo(PAGES.front)}
                   className={this.getName(PAGES.front)} ><i className={"fa " + this.getIcon(PAGES.front)} aria-hidden="true"></i></a>
                <a onClick={ () => this.props.sendTo(PAGES.overview)}
                   className={this.getName(PAGES.overview)}><i className={"fa " + this.getIcon(PAGES.overview)} aria-hidden="true"></i></a>

                {this.props.page === PAGES.detail && <a onClick={ () => this.props.sendTo(PAGES.detail)}
                                                        className={this.getName(PAGES.detail)}><i
                    className={"fa " + this.getIcon(PAGES.detail)} aria-hidden="true"></i></a>
                }
                <div className="author">{this.props.author}</div>
            </nav>
        );
    }
}

export default Navigation;