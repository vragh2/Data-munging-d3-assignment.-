graph1();

function graph1() {

    // set the dimensions of the canvas
    var margin = { top: 20, right: 20, bottom: 30, left: 150 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    // set the ranges
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    // define the axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);


    // add the SVG element
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // load the data
    d3.json("chicago_crimes_graph1.json", function(error, data) {

        data.forEach(function(d) {
            d.year = d.year;
            d.under = +d.under;
            d.over = +d.over;
        });

        // scale the range of the data
        x.domain(data.map(function(d) { return d.year; }));
        y.domain([0, d3.max(data, function(d) { return (d.under + d.over); })]);

        // add axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("transform", "translate(" + (width - 50) + "," + 28 + ")")
            .text("Years");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 5)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("count");

        svg.selectAll("bar1") /*over*/
            .data(data)
            .enter().append("rect")
            .attr("class", "bar1")
            .attr("x", function(d) { return x(d.year); })
            .attr("width", (x.rangeBand()))
            .attr("y", function(d) { return y(d.over); })
            .attr("height", function(d) { return (height - y(d.over)); });


        svg.selectAll("bar2") /*under*/
            .data(data)
            .enter().append("rect")
            .attr("class", "bar2")
            .attr("x", function(d) { return x(d.year); })
            .attr("width", (x.rangeBand()))
            .attr("y", function(d) { return y(d.under); })
            .attr("height", function(d) { return (y(d.over) - y(d.under)); });


    });

}