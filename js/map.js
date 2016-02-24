var zoom = d3.behavior.zoom()
.scaleExtent([0.5, 8])
.on("zoom", move);

//Assings the svg canvas to the map div
var svg = d3.select("#map").append("svg")
        .attr("width", 400)
        .attr("height", 600)
        .call(zoom);

var g = svg.append("g");

var tooltip = [];

var div = d3.select("body").append("div")	
		.attr("class", "tooltip")				
		//.style("opacity", 0);
		.style("visability", false)

//Sets the map projection
var projection = d3.geo.mercator()
        .center([40, 62.5])
        .scale(700);

//Creates a new geographic path generator and assing the projection        
var path = d3.geo.path().projection(projection);

//Draws the map and the points
function draw(regions)
{
    g.selectAll("*").remove();
    //draw map
    var region = g.selectAll(".country").data(regions);
    region.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .style('stroke-width', 0.1)
            .style("fill", function(d) {
				
				var tempMaj = "";
				
				var nameReplaced = replaceSpecialChars( d.properties.name ).toLowerCase();
				
				//Seach through majParty  until region names match, use the maj-party to set color
				for (var i = 0; i < majParty.length; i++) {
				
					//compare region names					
					if( nameReplaced == majParty[i].region) {
						
						console.log("Matched " + nameReplaced +  " and " + majParty[i].region); 
						
						tempMaj = (majParty[i].majority).toLowerCase();
						break;
					}
					// else 
						// console.log("Did not match " + nameReplaced +  " and " + majParty[i].region);
					
				}
				

				//return color depending on leading party
				switch (tempMaj) {
					
					case "socialdemokraterna":
						return "red";
					break;
					case "moderaterna":
						return "blue";
					break;
					case "centerpartiet":
						return "green";
					break;
					case "folkpartiet":
						return "green";
					break;
					case "kristdemokraterna":
						return "green";
					break;
					case "miljöpartiet":
						return "green";
					break;
					case "vänsterpartiet":
						return "green";
					break;
					case "sverigedemokraterna":
						return "yellow";
					break;
				}
				
				//return black as default color
				return "black";
			})
            .style("stroke", "white")
};

function formatString(str) {
	res = str
		.replace("Ã¥", 'å')
		.replace("Ã…", 'å')
		.replace("Ã¤", 'ä')
		.replace("Ã„", 'ä')
		.replace("Ã¶", 'ö')
		.replace("Ã–", 'ö');	
	return res;
}

//Zoom and panning method
function move() {

    var t = d3.event.translate;
    var s = d3.event.scale;

    zoom.translate(t);
    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}