'use strict';

(function() {
  
    var width = 700,
        height = 580;

    // load data and make scatter plot after window loads
    window.onload = function() {
        fetch("data/nygeo.json")
            .then(res => res.json()) // res is returned from the above fetch
            .then(data => renderBackground(data)); // data is returned from last .then
    }

    function renderBackground(data) {
        var svg = d3.select( "body" )
            .append( "svg" )
            .attr( "width", width )
            .attr( "height", height );

        var neighborhoods = svg.append( "g" ).attr( "id", "neighborhoods" );

        var albersProjection = d3.geoAlbers()
            .scale( 80000 )
            .rotate( [74.0060, 0] )
            .center( [0, 40.70])
            .translate([(width) / 2, (height) / 2]);

        var geoPath = d3.geoPath()
            .projection( albersProjection );

        neighborhoods.selectAll( "path" )
            .data( data.features )
            .enter()
            .append( "path" )
            .attr( "d", geoPath );

        // d3.csv is basically fetch but it can be be passed a csv file as a parameter
        d3.csv("data/data.csv")
            .then((csvData) => makeScatterPlot(svg, albersProjection, csvData));
    }


    function makeScatterPlot(svg, albersProjection, csvData) {
        var airbnb = svg.append( "g" ).attr( "id", "rodents" );
        
        var circles = airbnb.selectAll( "circle" )
            .data( csvData )
            .enter()
            .append( "circle" )
            .attr("class", "dot")
            .attr("cx", function(d) {
                let coordinates = [d["longitude"], d["latitude"]];
                return albersProjection( coordinates )[0] ;
            })
            .attr("cy", function(d) {
                let coordinates = [d["longitude"], d["latitude"]];
                return albersProjection( coordinates )[1] ;
            })
            .attr('r', 3)
            .attr('fill', "#4286f4")
            .on( "click", function(){
                d3.select(this)
                  .attr("opacity", 1)
                  .transition()
                  .duration( 1000 )
                  .attr( "x", width * Math.round( Math.random() ))
                  .attr( "y", height * Math.round( Math.random() ))
                  .attr( "opacity", 0 )
                  .on("end",function(){
                    d3.select(this).remove();
                  })
              });
    }
})();