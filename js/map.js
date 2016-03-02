
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

var legend = svg.append("g");

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

	filterLegend();

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

	majLegend();

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

function majLegend() {

	var partyLegend = ["Socialdemokraterna", "Moderaterna", "Centerpartiet", "Folkpartiet", "Kristdemokraterna", "Miljöpartiet", "Vänsterpartiet", "Sverigedemokraterna"];

	legend.selectAll("*").remove();

	var legendItem = legend.selectAll(".legend").data(partyLegend)
	  .enter().append("g").attr("class", "legend");

	var lWidth = 15, lHeight = 15;

	legendItem.append("rect")
		.attr("x", 20)
		.attr("y", function(d, i){ return height - (i*lHeight) - 2*lWidth;})
		.attr("width", lWidth)
		.attr("height", lHeight)
		.style("fill", function(d){
			return partyColor[d.toLowerCase()];
		});

	legendItem.append("text")
		.attr("x", 40)
		.attr("y", function(d, i){ return height - (i*lHeight) - lWidth - 4;})
		.attr("font-size", "12px")
		.text(function(d, i){ return partyLegend[i];});
}

function filterLegend() {

	var colorString = partyColor[ partyToFilter.toLowerCase()];	

	var maxValue = getPercent(partyToFilter.toLowerCase());

	var col = d3.scale.linear()
		.domain([0, 0.25*maxValue, 0.5*maxValue, 0.75*maxValue, maxValue])
		.range(getRange(colorString));

	var values = [0, 0.25*maxValue, 0.5*maxValue, 0.75*maxValue, maxValue];
	var text = [0 + "%", "", "", "", maxValue + "%"];

	legend.selectAll("*").remove();

	var legendItem = legend.selectAll(".legend").data(values)
	  .enter().append("g").attr("class", "legend");

	var lWidth = 15, lHeight = 15;

	legendItem.append("rect")
		.attr("x", 20)
		.attr("y", function(d, i){ return height - (i*lHeight) - 2*lWidth;})
		.attr("width", lWidth)
		.attr("height", lHeight)
		.style("fill", col);

	legendItem.append("text")
		.attr("x", 40)
		.attr("y", function(d, i){ return height - (i*lHeight) - lWidth - 4;})
		.attr("font-size", "12px")
		.text(function(d, i){ return text[i];});
}

function getR(str) {
	var colorsOnly = str.substring(str.indexOf('(') + 1, str.lastIndexOf(')')).split(/,\s*/);
	return colorsOnly[0];
}

function getG(str) {
	var colorsOnly = str.substring(str.indexOf('(') + 1, str.lastIndexOf(')')).split(/,\s*/);
	return colorsOnly[1];
}

function getB(str) {
	var colorsOnly = str.substring(str.indexOf('(') + 1, str.lastIndexOf(')')).split(/,\s*/);
	return colorsOnly[2];
}

function getRange(str) {
	return [ "rgb(" + getR(str)*0.1 + ", " + getG(str)*0.1 + ", " + getB(str)*0.1 + ")", 
			 "rgb(" + getR(str)*0.3 + ", " + getG(str)*0.3 + ", " + getB(str)*0.3 + ")",
			 "rgb(" + getR(str)*0.5 + ", " + getG(str)*0.5 + ", " + getB(str)*0.5 + ")",
			 "rgb(" + getR(str)*0.7 + ", " + getG(str)*0.7 + ", " + getB(str)*0.7 + ")", 
			 "rgb(" + getR(str) + ", " + getG(str) + ", " + getB(str) + ")"];
}

//Zoom and panning method
function move() {

    var t = d3.event.translate;
    var s = d3.event.scale;

    zoom.translate(t);
    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}
