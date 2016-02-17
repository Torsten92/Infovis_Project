var zoom = d3.behavior.zoom()
.scaleExtent([0.5, 8])
.on("zoom", move);

//Assings the svg canvas to the map div
var svg = d3.select("#map").append("svg")
        .attr("width", 800)
        .attr("height", 300)
        .call(zoom);

var g = svg.append("g");

//Sets the map projection
var projection = d3.geo.mercator()
        .center([8.25, 56.8])
        .scale(700);

//Creates a new geographic path generator and assing the projection        
var path = d3.geo.path().projection(projection);

d3.json("data/swe_mun.topojson", function(error, sweden) {
    var mun = topojson.feature(sweden, sweden.objects.swe_mun).features;
    console.log(mun);
    draw(mun);
});
//Draws the map and the points
function draw(countries)
{
    //draw map
    var country = g.selectAll(".country").data(countries);
    country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .style('stroke-width', 1)
            .style("fill", "lightgray")
            .style("stroke", "white");
};

//Zoom and panning method
function move() {

    var t = d3.event.translate;
    var s = d3.event.scale;

    zoom.translate(t);
    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}