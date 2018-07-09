graph2();

function graph2() {

    var margin = { top: 30, right: 20, bottom: 40, left: 150 },
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3v3.timeParse("%Y");

    // set the ranges
    var x = d3v3.scaleTime().range([0, width]);
    var y = d3v3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3v3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.arrested); });
    // define the line
    var valueline2 = d3v3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.not_arrested); });

    var svg = d3v3.select("#graph2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    function draw(data) {

        // format the data
        data.forEach(function(d) {
            d.year = parseTime(d.year);
            d.arrested = +d.arrested;
            d.not_arrested = +d.not_arrested;
        });


        x.domain(d3v3.extent(data, function(d) { return d.year; }));
        y.domain([0, d3v3.max(data, function(d) {
            return Math.max(d.arrested, d.not_arrested);
        })]);

        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line1")
            .attr("d", valueline);
        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line2")
            .attr("d", valueline2);
        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3v3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .call(d3v3.axisLeft(y));
    }
    // Get the data
    d3.json("chicago_crimes_graph2.json", function(error, data) {
        if (error) throw error;
        draw(data);
    });
}