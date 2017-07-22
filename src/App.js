import React, { Component } from 'react';
import './App.css';
import ErrorBarChart from './ErrorBarChart';
import Overlay from './Overlay';
import DetailChart from './DetailChart';
import data from './data.json';

import * as d3 from 'd3';

require('normalize.css');

var PAGES = {
    detail: 'detail',
    overview: 'overview',
    front: 'front',
};

class App extends Component {

    constructor(){
        super();

        this.minDate = new Date('2014-01-02');
        this.maxDate = new Date('2015-01-01');

        this.subMinDate = new Date('2014-01-02');
        this.subMaxDate = new Date('2014-02-02');

        let hash = window.location.hash.substr(1);
        let hashes = hash.split('/');
        let params = [];
        for(let i=1; i < hashes.length; i++){
            params.push(hashes[i]);
        }
        this.state = {
            page: hashes[0] ? hashes[0] : PAGES.front,
            params: params,
        };

        // filter our data
        let realdata = new Array(data.length);
        for(let i in data){
            let seg = data[i];
            let curdate = new Date(seg.curdate);
            if(this.minDate <= curdate && this.maxDate > curdate){
                realdata[i] = seg;
            }
        }

        this.data = realdata;

        this.title = "How Well Are Temperatures Forecasted?";
        this.author = "Austin Weidler";
        this.description = "This vizualization describes how forecasted high and low temperatures " +
            "compare to observed high and low temperatures. These historic observations are taken from " +
            "NOAA's dataset and were recorded at the station in downtown San Francisco. " +
            "The historic temperature forecasts are taken from AccuWeather.com," +
            " set at the same location.";

        let self = this;
        window.onhashchange = function(){
            let hash = window.location.hash.substr(1);
            self.sendTo(hash);
        };
    }

    errorTitle(){
        let formatTime = d3.timeFormat("%Y");

        return "Temperature Forecast Errors For " + formatTime(this.minDate);
    }

    sendTo(page){
        let pages = page.split('/');

        if(PAGES.hasOwnProperty(pages[0])) {
            let pageinfo = { page: pages[0], params:[] };
            for(let i=1; i<pages.length; i++){
                pageinfo.params.push(pages[i]);
            }
            this.setState(pageinfo);

            if(history.pushState) {
                history.pushState(null, null, '#'+page);
            }
            else {
                location.hash = '#'+page;
            }
        }
        else{
            this.setState({
                page: PAGES.front,
            });
        }
    }

    render() {
        return (<div className='App'>
            { this.state.page === PAGES.front &&
                <Overlay title={this.title}
                     subtitle={"By " + this.author}
                     description={this.description}
                     sendTo={this.sendTo.bind(this)}
                />
            }

            { this.state.page === PAGES.overview &&
                <ErrorBarChart title={this.errorTitle()}
                           data={this.data}
                           sendTo={this.sendTo.bind(this)}
                />
            }

            { this.state.page === PAGES.detail &&
                <div className="inliner">
                    <ErrorBarChart title={this.errorTitle()}
                                   data={this.data}
                                   params={this.state.params}
                                   sendTo={this.sendTo.bind(this)}
                    />
                    <DetailChart data={this.data}
                                 params={this.state.params}
                    />
                </div>
            }
        </div>);
    }
}

export default App;
