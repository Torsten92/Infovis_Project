
var zoom = d3.behavior.zoom()
.scaleExtent([1, 50])
.on("zoom", move);

var width = document.getElementById("map").clientWidth - 5;
var height = document.getElementById("map").clientHeight - 5;

//Assigns the svg canvas to the map div
var svg = d3.select("#map").append("svg")
		.attr("class", "map")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

//Used for displaying text while the "Filter by specific party" is checked
var filtertextDiv = d3.select("#map").append("div")
		.attr("class", "filteredPartyText")
		.style("opacity", 0);

var g = svg.append("g");

var tooltipDiv = d3.select("body").append("div")	
		.attr("class", "tooltip")
		.style("opacity", 0.5)
		.style("visability", false);


//Sets the map projection
var projection = d3.geo.mercator()
        .center([40, 62.5])
        .scale(700);

//Creates a new geographic path generator and assing the projection        
var path = d3.geo.path().projection(projection);

//color legend
var partyLegend = ["Socialdemokraterna", "Moderaterna", "Centerpartiet", "Folkpartiet", "Kristdemokraterna", "Miljöpartiet", "Vänsterpartiet", "Sverigedemokraterna"];

var color_domain = [0, 50, 150, 350, 750, 1500, 2000, 2500];             
var color = d3.scale.ordinal()
  .range([ 
  partyColor["socialdemokraterna"], 
  partyColor["moderaterna"],
  partyColor["centerpartiet"],
  partyColor["folkpartiet"], 
  partyColor["kristdemokraterna"], 
  partyColor["miljöpartiet"], 
  partyColor["vänsterpartiet"], 
  partyColor["sverigedemokraterna"] ]);

var legend = svg.selectAll("g.legend")
  .data(color_domain)
  .enter().append("g")
  .attr("class", "legend");

var lWidth = 15, lHeight = 15;

legend.append("rect")
	.attr("x", 20)
	.attr("y", function(d, i){ return height - (i*lHeight) - 2*lWidth;})
	.attr("width", lWidth)
	.attr("height", lHeight)
	.style("fill", color);

legend.append("text")
	.attr("x", 40)
	.attr("y", function(d, i){ return height - (i*lHeight) - lWidth - 4;})
	.attr("font-size", "10px")
	.text(function(d, i){ return partyLegend[i]; });


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
            .style("fill", function(d, i) {
				
				//draw differently if filter checkbox is used
				if( filterChecked ) {
					return drawFiltered(d, i);
				}
				else
					return drawMajority(d);
			})
            .style("stroke", "white")

			//On mouse click, filter region
			.on("click", function(d) {

				showDetails(d);

				if(regionIsFiltered && filteredRegionName == d.properties.name) {
					regionIsFiltered = false;
					
					if(filterByPercent)
						redrawWithPercentFilter();
					else
						redrawNoFilter();
				}
				else {
					filteredRegionName = d.properties.name;
					regionIsFiltered = true;
					redrawNoFilter();
					redrawWithFilter(d.properties.name.toLowerCase(), true);
				}
			})
			
            //Tooltip
			.on("mouseover", function(d,i) { 
				tooltipDiv.transition()	
					.duration(200)
					.style("opacity", 0.9);
				tooltipDiv.html( printParties(d, filterChecked) )
				.style("left", (d3.event.pageX + 50) + "px")		
                .style("top", (d3.event.pageY - 100) + "px")
            })
			.on("mouseout", function(d) {
				tooltipDiv.transition().style("opacity", 0);		
			})
			
			tooltipDiv.on("mouseover", function(d) {
				tooltipDiv.style("opacity", 0)
					.style("left", -1000 + "px")
					.style("top", -1000 + "px");
			});
};

function setTooltipText() {
	
}

function drawFiltered(d, i) {

	var regionPercent;
	
	var geoRegionString = d.properties.name;
	geoRegionString = geoRegionString.toLowerCase();
	
	//find corresponding region in filteredPartyPercentList to get right percent
	for(var k = 0; k < filteredPartyPercentList.length; k++) {
		
		var dataRegionString = formatString( filteredPartyPercentList[k][0], true );
		
		if( geoRegionString == dataRegionString ) {
			regionPercent = filteredPartyPercentList[k][1] / 100;
			break;
		}
	}
	
	//Multply color values with election percentages
	var colorString =   partyColor[ partyToFilter];
    var colorsOnly = colorString.substring(colorString.indexOf('(') + 1, colorString.lastIndexOf(')')).split(/,\s*/);
    var red 	= Math.floor( colorsOnly[0] * regionPercent );
    var green = Math.floor( colorsOnly[1] * regionPercent );
	var blue 	= Math.floor( colorsOnly[2] * regionPercent );
	
	//normalize the color channels
	red		= Math.floor( (red / maxRed) * colorsOnly[0]);
	green 	= Math.floor( (green / maxGreen) * colorsOnly[1]);
	blue 	= Math.floor( (blue / maxBlue) * colorsOnly[2]);
	
	//reconvert the color to a rgb string
	var resColor = "rgb(" + red + "," + green + "," + blue + ")";

	//return the color
	return  resColor;
}

function drawMajority(d) {
	var tempMaj = "";
	
	//some string formating is done n order to compaare region name
	var nameReplaced = ( d.properties.name ).toLowerCase();
	
	//Seach through majParty  until region names match, use the maj-party to set color
	for (var i = 0; i < majParty.length; i++) {
		//compare region names					
		if( nameReplaced == majParty[i].region) {
			tempMaj = (majParty[i].majority).toLowerCase();
			break;
		}	
	}
	
	return partyColor[tempMaj];
}

//Zoom and panning method
function move() {

    var t = d3.event.translate;
    var s = d3.event.scale;

    zoom.translate(t);
    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}
