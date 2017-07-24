import React, { Component } from 'react';
import './App.css';
import ErrorBarChart from './ErrorBarChart';
import Overlay from './Overlay';
import DetailChart from './DetailChart';
import data from './data2.json';

import * as d3 from 'd3';
import Navigation from "./Navigation";
import Info from "./Info";
import CitySelect from "./CitySelect";

require('normalize.css');

class App extends Component {

    constructor(){
        super();

        this.PAGES = Navigation.GetPages();

        this.minDate = new Date('2014-01-02');
        this.maxDate = new Date('2015-01-01');

        let hash = window.location.hash.substr(1);
        let hashes = hash.split('/');
        let params = [];
        for(let i=1; i < hashes.length; i++){
            params.push(hashes[i]);
        }

        // filter our data
        let realdata = {};
        for(let i in data){
            let seg = data[i];
            let curdate = new Date(seg.curdate);
            if(this.minDate <= curdate && this.maxDate > curdate){
                seg.date = curdate;
                if(!realdata[seg.location]){
                    realdata[seg.location] = [];
                }
                realdata[seg.location].push(seg);
            }
        }

        this.allData = {};
        for(var i in realdata){
            this.allData[i] = realdata[i].sort(sortByDateAscending);
        }

        function sortByDateAscending(a, b) {
            // Dates will be cast to numbers automagically:
            return a.date - b.date;
        }

        this.state = {
            page: hashes[0] ? hashes[0] : this.PAGES.front,
            params: params,
            domain: [new Date('2014-01-02'), new Date('2014-02-02')],
            data: this.allData['san-francisco-ca'],
            martini: false,
        };

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

    static getDays(){
        return ["\"Today\"", "\"Tomorrow\"", "+2 Days", "+3 Days"];
    }

    errorTitle(){
        if(this.state.params.length){
            let formatTime = d3.timeFormat("%b %e");
            return formatTime(this.state.domain[0]) + " - " + formatTime(this.state.domain[1]) + " Temperature Forecast Errors"
        }
        else {
            let formatTime = d3.timeFormat("%Y");
            return formatTime(this.minDate) + " Temperature Forecast Errors";
        }
    }

    static errorInfo(){
        return "For both <span class='high'>High</span> and <span class='low'>Low</span> " +
        "temperatures the amount of errors increases as forecasts are made further into the future. " +
            "An error is calculated by the number of degrees fahrenheit (°F) from the observed value for the day. " +
            "<strong>Select</strong> a column to see more details.";
    }

    static detailInfo(){
        return "Presented is the breakdown of how temperature errors accumulate. " +
            "As time moves forward, more errors will occur. Using the <strong>slider</strong>, " +
            "see if you can determine what months <span class='low'>Low</span> errors are higher. " +
            "You can also choose to see the different breakdowns by <strong>selecting</strong> " +
            "columns in the Temperature Forecast Errors chart.";
    }

    detailTitle(){
        let days = App.getDays();
        return days[this.state.params[0]] + " Forecasted " + this.state.params[1] + " Temperature Details";
    }

    brushed(dim){
        this.setState({domain: dim});
    }

    setData(to){
        this.setState({data: this.allData[to]});
        this.sendTo(this.PAGES.overview);
    }

    sendTo(page){
        let pages = page.split('/');

        if(this.PAGES.hasOwnProperty(pages[0])) {
            let martini = this.state.martini;
            if(pages[0] === this.PAGES.city){
                martini = true;
            }
            let pageinfo = { page: pages[0], params:[], martini: martini };
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
                page: this.PAGES.front,
            });
        }
    }

    render() {
        return (<div className='App'>
            <Navigation title={this.title}
                        author={this.author}
                        sendTo={this.sendTo.bind(this)}
                        page={this.state.page}
                        martini={this.state.martini} />
            { this.state.page === this.PAGES.front &&
                <Overlay title={this.title}
                     subtitle={"By " + this.author}
                     description={this.description}
                     sendTo={this.sendTo.bind(this)}
                />
            }

            { this.state.page === this.PAGES.overview &&
                <ErrorBarChart title={this.errorTitle()}
                               info={App.errorInfo()}
                               days={App.getDays()}
                               data={this.state.data}
                               sendTo={this.sendTo.bind(this)}
                />
            }

            { this.state.page === this.PAGES.detail &&
                <div className="inliner">
                    <Info info={App.detailInfo()} />
                    <ErrorBarChart title={this.errorTitle()}
                                   data={this.state.data}
                                   days={App.getDays()}
                                   params={this.state.params}
                                   domain={this.state.domain}
                                   sendTo={this.sendTo.bind(this)}
                    />
                    <DetailChart title={this.detailTitle()}
                                 data={this.state.data}
                                 params={this.state.params}
                                 onBrush={this.brushed.bind(this)}
                    />
                    <div className="detail-nav">
                        <button onClick={() => this.sendTo(this.PAGES.overview)}>
                            <i className="fa fa-arrow-left" aria-hidden="true"></i> Go Back
                        </button>
                        <button onClick={() => this.sendTo(this.PAGES.city)} >
                            Explore Other Cities <i className="fa fa-arrow-right" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            }

            { this.state.page === this.PAGES.city &&
                <CitySelect setData={this.setData.bind(this)} />
            }
        </div>);
    }
}

export default App;
