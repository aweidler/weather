/**
 * Created by aweidler on 7/23/17.
 */
import React, { Component } from 'react';
import "./Overlay.css";

class CitySelect extends Component{

    constructor(props){
        super(props);

        this.size = {width:800, height:600};
    }


    render() {
        return (
            <div className="city-list overlay">
                <div style={{minHeight: "400px"}} >
                    <h1>Select a City to Explore Forecasted Errors</h1>
                    <ul>
                        <li>
                            <button onClick={() => this.props.setData("san-francisco-ca")}>
                                <h2>San Francisco, California</h2>
                                <label>244 Data Points</label>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.props.setData("new-york-ny")}>
                                <h2>New York City, New York</h2>
                                <label>40 Data Points</label>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.props.setData("miami-fl")}>
                                <h2>Miami, Florida</h2>
                                <label>24 Data Points</label>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default CitySelect;
