/**
 * Created by aweidler on 7/19/17.
 */

import React, {Component} from 'react';
import * as d3 from 'd3';

class DetailChart extends Component{

    constructor(props){
        super(props);

        this.size = {width:800, height:600};
        this.margin = {top: 60, right: 10, bottom: 100, left: 60};
        this.submargin = {top: 530, right: 10, bottom: 30, left: 60};

        this.svgwidth = +this.size.width - this.margin.left - this.margin.right;
        this.svgheight = +this.size.height - this.margin.top - this.margin.bottom;
        this.subsvgheight = +this.size.height - this.submargin.top - this.submargin.bottom;

        this.brush = [1, this.svgwidth-1];
        this.animate = true;
        this.brusher = null;
    }

    calculateLine(){
        let self = this;
        let parseTime = d3.timeParse("%Y-%m-%d");
        let realdata = [];

        this.props.data.forEach(function(d){
            realdata.push({
                observed:  parseInt(d['observed_'+self.props.params[1].toLowerCase()], 10),
                forecasted: parseInt(d['temperature_' + parseInt(self.props.params[0], 10) + '_' + self.props.params[1].toLowerCase()], 10),
                date: parseTime(d.curdate),
            });
        });

        return realdata;
    }

    isHigh(){
        return this.props.params[1].toLowerCase() === 'high';
    }

    componentWillUnmount(){
        if(this.brusher){
            this.brusher.interrupt();
        }
    }

    componentDidMount() {
        this.createDetailChart();
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.params !== this.props.params;
    }

    componentDidUpdate(){
        this.createDetailChart();
    }

    createDetailChart(){
        const self = this;
        const node = this.node;
        const svg = d3.select(node);
        svg.selectAll("*").remove();
        svg.attr("width", this.size.width)
            .attr("height", this.size.height)
            .attr("style", "background-color: white;");

        //let g = svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        const lineData = this.calculateLine();

        let x = d3.scaleTime()
            .rangeRound([0, this.svgwidth]);
        let x2 = d3.scaleTime()
            .rangeRound([0, this.svgwidth]);

        let y = d3.scaleLinear()
            .rangeRound([this.svgheight, 0]);
        let y2 = d3.scaleLinear()
            .rangeRound([this.subsvgheight, 0]);

        let xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b %e"));
        let xAxis2 = d3.axisBottom((x2)).tickFormat(d3.timeFormat("%b"));
        let yAxis = d3.axisLeft(y);

        let brush = d3.brushX()
            .extent([[0, 0], [this.svgwidth, this.subsvgheight]])
            .on("brush end", brushed); // implement function

        let zoom = d3.zoom()
            .scaleExtent([1, 50])
            .translateExtent([[0, 0], [this.svgwidth, this.svgheight]])
            .extent([[0, 0], [this.svgwidth, this.svgheight]])
            .on("zoom", zoomed); // implement function

        let line = d3.line()
            .defined(function(d){ return true; })
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.observed); });
        // maybe interpolate...

        let line2 = d3.line()
            .defined(function(d) { return true; })
            .x(function(d) {return x2(d.date); })
            .y(function(d) {return y2(d.observed); });
        // maybe interpolate...

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", this.svgwidth)
            .attr("height", this.svgheight);

        let focus = svg.append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        let context = svg.append("g")
            .attr("transform", "translate(" + this.submargin.left + "," + this.submargin.top + ")");

        let dateExtent = d3.extent(lineData, function(d) { return d.date; });
        x.domain(dateExtent);
        y.domain(d3.extent(lineData, function(d) { return d.observed; }));
        x2.domain(x.domain());
        y2.domain(y.domain());

        // brush.extent([new Date(dateExtent[1]), new Date(dateExtent[10])]);

        // Tooltip
        d3.selectAll("div.tooltip").remove();
        let div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        // Line and dots
        focus.append("path")
            .datum(lineData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", this.isHigh() ? "#ffa9a5" : "#9bd5f2" )
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2.0)
            .attr("d", line);

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.svgheight + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis)
            .append("text")
            .attr("x", -this.svgwidth/2 + 60)
            .attr("y", -36)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .attr("transform", "rotate(-90)")
            .text("Temperature (°F)");

        context.append("path")
            .datum(lineData)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", this.isHigh() ? "#ffa9a5" : "#9bd5f2" )
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 0.5)
            .attr("d", line2);

        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.subsvgheight + ")")
            .call(xAxis2);

        focus.append("rect")
            .attr("class", "zoom")
            .attr("width", this.svgwidth)
            .attr("height", this.svgheight)
            .call(zoom);

        this.brusher = context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, this.brush);

        if(this.animate) {
            this.brusher.transition()
                .duration(2300)
                .ease(d3.easeQuadInOut)
                .call(brush.move, [20, 100]);
            this.animate = false;
        }

        focus.selectAll(".pline")
            .data(lineData)
            .enter().append("line")
            .attr("class", "pline")
            .attr("stroke", "#333")
            .attr("stroke-width", 0.5)
            .attr("stroke-dasharray", "5, 5")
            .attr("fill", "none")
            .attr("x1", function(d){ return x(d.date); })
            .attr("x2", function(d){ return x(d.date); })
            .attr("y1", function(d){ return y(d.forecasted); })
            .attr("y2", function(d){ return y(d.observed) });


        let formatTime = d3.timeFormat("%b %e");
        focus.selectAll(".dot")
            .data(lineData)
            .enter().append("circle")
            .attr("fill", this.isHigh() ? "#ffa9a5" : "#9bd5f2" )
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr('class', 'dot')
            .attr("r", 4)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.observed); })
            .on('mouseover', function(d){
                let me = d3.select(this);
                me.transition()
                    .duration(100)
                    .attr('r', 8);
                div.style("display", "block")
                    .transition()
                    .duration(100)
                    .style("opacity", .9);
                div.html("<b>" + formatTime(d.date)
                    + "</b><br/> Observed: " + d.observed
                    + "<br/> Forecasted: " + d.forecasted
                    + "<br/> Error: " + Math.abs(d.observed - d.forecasted))
                    .style("left", (d3.event.pageX - div.node().getBoundingClientRect().width/2) + "px")
                    .style("top", (d3.event.pageY - div.node().getBoundingClientRect().height - 10) + "px")
                    .style("border", "1px solid " + (self.isHigh() ? "#ffa9a5" : "#9bd5f2") );
            })
            .on('mouseout', function(d){
                let me = d3.select(this);
                me.transition()
                    .duration(500)
                    .attr('r', 4);
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        focus.selectAll(".pdot")
            .data(lineData)
            .enter().append("circle")
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", 1.0)
            .attr('class', 'pdot')
            .attr("r", 2)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.forecasted); });

        // Legend
        let boxscale = 20;
        var legend = svg.append("g")
            .selectAll("g")
            .data(["Observed", "Forecasted"])
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * (boxscale + 8) + ")"; });

        legend.append("circle")
            .attr("stroke", "black")
            .attr("cx", this.size.width - boxscale - 70)
            .attr("cy", this.margin.top)
            .attr("stroke-width", function(d){ return d === "Observed" ? 0.5 : 1.0; } )
            .attr("r", function(d){return (d === "Observed" ? 4 : 2); } )
            .attr("fill", function(d){ return (d === "Observed" ? (self.isHigh() ? "#ffa9a5" : "#9bd5f2") : "white"  )  });
        legend.append("text")
            .attr("x", this.svgwidth - 10)
            .attr("y", this.margin.top + 2)
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

        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom

            var s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            if(this.brusher) {
                d3.select(this.brusher).interrupt();
            }

            focus.selectAll(".dot")
                .attr("cx", function(d) { return x(d.date); })
                .attr("cy", function(d) { return y(d.observed); });
            focus.selectAll(".pdot")
                .attr("cx", function(d) { return x(d.date); })
                .attr("cy", function(d) { return y(d.forecasted); });

            focus.selectAll(".pline")
                .attr("x1", function(d){ return x(d.date); })
                .attr("x2", function(d){ return x(d.date); })
                .attr("y1", function(d){ return y(d.forecasted); })
                .attr("y2", function(d){ return y(d.observed) });

            focus.select(".line").attr("d", line);
            focus.select(".axis--x").call(xAxis);

            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(self.svgwidth / (s[1] - s[0]))
                .translate(-s[0], 0));

            self.brush = s;

            if(typeof self.props.onBrush === 'function') {
                self.props.onBrush(x.domain());
            }
        }

        function zoomed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            var t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            if(this.brusher) {
                d3.select(this.brusher).interrupt();
            }

            focus.selectAll(".dot")
                .attr("cx", function(d) { return x(d.date); })
                .attr("cy", function(d) { return y(d.observed); });
            focus.selectAll(".pdot")
                .attr("cx", function(d) { return x(d.date); })
                .attr("cy", function(d) { return y(d.forecasted); });

            focus.selectAll(".pline")
                .attr("x1", function(d){ return x(d.date); })
                .attr("x2", function(d){ return x(d.date); })
                .attr("y1", function(d){ return y(d.forecasted); })
                .attr("y2", function(d){ return y(d.observed) });

            focus.select(".line").attr("d", line);
            focus.select(".axis--x").call(xAxis);

            let brushSel = x.range().map(t.invertX, t);

            context.select(".brush").call(brush.move, brushSel);

            self.brush = brushSel;
            if(typeof self.props.onBrush === 'function') {
                self.props.onBrush(x.domain());
            }
        }

    }

    render() {
        return (
            <div className="detail-chart chart"><svg ref={node => this.node = node}></svg></div>
        );
    }
}

export default DetailChart;