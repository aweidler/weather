/**
 * Created by aweidler on 7/17/17.
 */

import React, {Component} from 'react';
import './App.css';
import * as d3 from 'd3';

class ErrorBarChart extends Component {
    constructor(props) {
        super(props);

        this.size = {width:800, height:600};
        this.margin = {top: 60, right: 90, bottom: 60, left: 60};

        this.svgwidth = +this.size.width - this.margin.left - this.margin.right;
        this.svgheight = +this.size.height - this.margin.top - this.margin.bottom;

        this.createBarChart = this.createBarChart.bind(this);
    }

    calculateError(){
        let base = 10;

        let errors = {
            low0: 0,
            low1: 0,
            low2: 0,
            low3: 0,
            high0: 0,
            high1: 0,
            high2: 0,
            high3: 0,
        };

        this.props.data.forEach(function(row){
            let lowbase = parseInt(row.observed_low, base);
            let highbase = parseInt(row.observed_high, base);

            errors.low0 += Math.abs(parseInt(row.temperature_0_low, base) - lowbase);
            errors.low1 += Math.abs(parseInt(row.temperature_1_low, base) - lowbase);
            errors.low2 += Math.abs(parseInt(row.temperature_2_low, base) - lowbase);
            errors.low3 += Math.abs(parseInt(row.temperature_3_low, base) - lowbase);

            errors.high0 += Math.abs(parseInt(row.temperature_0_high, base) - highbase);
            errors.high1 += Math.abs(parseInt(row.temperature_1_high, base) - highbase);
            errors.high2 += Math.abs(parseInt(row.temperature_2_high, base) - highbase);
            errors.high3 += Math.abs(parseInt(row.temperature_3_high, base) - highbase);
        });

        return {
            types: ["Low", "High"],
            days: ["\"Today\"", "\"Tomorrow\"", "+2 Days", "+3 Days"],
            "High": [errors.high0, errors.high1, errors.high2, errors.high3],
            "Low": [errors.low0, errors.low1, errors.low2, errors.low3],
        };

    }

    componentDidMount() {
        this.createBarChart()
    }

    componentDidUpdate() {
        this.createBarChart()
    }

    createBarChart() {
        const self = this;
        const node = this.node;
        const svg = d3.select(node);
        svg.attr("width", this.size.width)
            .attr("height", this.size.height)
            .attr("style", "background-color: white;");

        const errorData = this.calculateError();

        var x0 = d3.scaleBand()
            .rangeRound([0, this.svgwidth])
            .paddingInner(0.2);

        var x1 = d3.scaleBand()
            .padding(0.0);

        var y = d3.scaleLinear()
            .rangeRound([this.svgheight, 0]);

        var z = d3.scaleOrdinal()
            .range([d3.color("#9bd5f2"), d3.color("#ffa9a5")]);

        let g = svg.append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        let keys = errorData.types;

        x0.domain(errorData.days);
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(keys, function(key){ return d3.max(errorData[key]) }) ]);

        g.append("g")
            .selectAll("g")
            .data(errorData.days)
            .enter().append("g")
            .attr("transform", function(d) { return "translate(" + x0(d) + ",0)"; })
            .selectAll("rect")
            .data(function(d, i) { return keys.map(function(key) { return {key: key, value: errorData[key][i]}; }); })
            .enter().append("rect")
            .attr("class", "selectable col")
            .attr("x", function(d) {return x1(d.key); })
            .attr("y", function(d) { return y(d.value); })
            .attr("width", x1.bandwidth())
            .attr("height", function(d) { return self.svgheight - y(d.value); })
            .attr("style", function(d){ return "stroke-width:1; stroke:" + z(d.key).darker(0.8); })
            .attr("fill", function(d) { return z(d.key); })
            .on("mouseover", function(d){
                d3.select(this)
                    .attr("style", "stroke-width:1; stroke:#444;")
                    .attr("fill", z(d.key).brighter(0.3));
            })
            .on("mouseout", function(d){
                d3.select(this)
                    .attr("style", "stroke-width:1; stroke:" + z(d.key).darker(0.8))
                    .attr("fill", z(d.key));
            });

        let bottomAxis = d3.axisBottom(x0);
        let leftAxis = d3.axisLeft(y).ticks(5);

        g.append("g")
            .attr("class", "axis axis-x")
            .attr("transform", "translate(0," + this.svgheight + ")")
            .call(bottomAxis)
            .append("text")
            .attr("x", this.svgwidth/2)
            .attr("y", 45)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "center")
            .text("Forecast");

        g.append("g")
            .attr("class", "axis axis-y")
            .call(leftAxis)
            .append("text")
            .attr("x", -this.svgwidth/2 + 25)
            .attr("y", y(y.ticks().pop()) - 20)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .attr("transform", "rotate(-90)")
            .text("Temperature Error");

        // Legend
        let boxscale = 20;
        var legend = svg.append("g")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * (boxscale + 8) + ")"; });

        legend.append("rect")
            .attr("x", this.size.width - boxscale * 3.3)
            .attr("y", this.margin.top)
            .attr("width", boxscale)
            .attr("height", boxscale)
            .attr("style", function(d){ return "stroke-width:1; stroke:" + z(d.key).darker(1.0); })
            .attr("fill", z);

        legend.append("text")
            .attr("x", this.svgwidth + this.margin.left/2 + boxscale * 4)
            .attr("y", this.margin.top + boxscale/2 + 1)
            .attr("width", boxscale)
            .attr("height", boxscale)
            .attr("text-anchor", "start")
            .attr("alignment-baseline", "middle")
            .text(function(d) { return d; });

        // Title
        svg.append("text")
            .attr("x", (this.size.width / 2))
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .style("font-size", "16pt")
            .style("font-weight", "bold")
            .text(this.props.title);
    }

    render() {
        return <svg ref={node => this.node = node}></svg>
    }
}
export default ErrorBarChart