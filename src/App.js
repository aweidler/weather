import React, { Component } from 'react';
import './App.css';
import ErrorBarChart from './ErrorBarChart';
import data from './data.json';

import * as d3 from 'd3';

require('normalize.css');

class App extends Component {

    constructor(){
        super();

        this.minDate = new Date('2014-01-02');
        this.maxDate = new Date('2015-01-01');

        // filter our data
        let realdata = new Array(data.length);
        for(let i in data){
            let seg = data[i];
            let curdate = new Date(seg.curdate);
            if(this.minDate <= curdate && this.maxDate > curdate){
                realdata[i] = seg;
            }
        }

        this.data = data;
    }

    errorTitle(){
        let formatTime = d3.timeFormat("%Y");

        return "Temperature Forecast Errors For " + formatTime(this.minDate);
    }

    render() {
        return (<div className='App'>
            <div className="error-chart">
                <ErrorBarChart title={this.errorTitle()} data={this.data} />
            </div>
        </div>);
    }
}

export default App;
