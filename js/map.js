
var zoom = d3.behavior.zoom()
.scaleExtent([0.5, 8])
.on("zoom", move);

//Assings the svg canvas to the map div
var svg = d3.select("#map").append("svg")
        .attr("width", 400)
        .attr("height", 600)
        .call(zoom);

var g = svg.append("g");

var tooltipDiv = d3.select("body").append("div")	
		.attr("class", "tooltip")
		.style("opacity", 1)
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

            //Tooltip
			.on("mouseover", function(d) {
				tooltipDiv.transition()	
					.duration(200)
					.style("opacity", 1);
				tooltipDiv.html( function() {
					var tooltip = "<font size='4'> " + d.properties.name + "</font>";
					
					var temp = [];
					var x = 0;			        
			        dataset.forEach(function(d2, i) {
			        	if(isNumeric(d2.procent)) {
				        	temp[x++] = {"region": d2.region, "parti": d2.parti, "procent": d2.procent};
				        }
					});
					
			        //Sort array by party precentage
			        function compare(a, b) {
			        	return parseFloat(b.procent) - parseFloat(a.procent);
			        }
			        temp.sort(compare);

			        for(var i = 0; i < temp.length; i++) {
						var region = formatString(temp[i].region);
						var name = formatString(d.properties.name);
						if(region == name) {
							var rgb = partyColor[formatString(temp[i].parti)];
							var hex = rgbToHex(rgb);
							
							if(filterChecked && formatString(partyToFilter) == formatString(temp[i].parti))
								tooltip += "<br><font color=" + hex + "> " + temp[i].parti +  " : " + temp[i].procent + "%</font>";
							else if(filterChecked && formatString(partyToFilter) != formatString(temp[i].parti))
								tooltip += "<br>" + temp[i].parti +  " : " + temp[i].procent + "%";
							else
								tooltip += "<br><font color=" + hex + "> " + temp[i].parti +  " : " + temp[i].procent + "%</font>";
						}
					}

					return tooltip;
				})
				.style("left", (d3.event.pageX + 10) + "px")		
                .style("top", (d3.event.pageY - 28) + "px")
            })
			.on("mouseout", function(d) {
				tooltipDiv.transition().style("opacity", 0);		
			})
};

function drawFiltered(d, i) {

	//Test log: Seems correct comparing to the excell
	//console.log("index = " + i + ", name = " + d.properties.name + ", percent = " + filteredPartyPercentList[i]);
	
	//get the percentage from the list created n filterparty
	var colorPercent = filteredPartyPercentList[i] / 100;
	
	//Multply color values with election percentages
	var colorString =   partyColor[ partyToFilter.toLowerCase()];
    var colorsOnly = colorString.substring(colorString.indexOf('(') + 1, colorString.lastIndexOf(')')).split(/,\s*/);
    var red 	= Math.floor( colorsOnly[0] * colorPercent );
    var green = Math.floor( colorsOnly[1] * colorPercent );
	var blue 	= Math.floor( colorsOnly[2] * colorPercent );
	
	//Normalize the color values
	red		= Math.floor( (red / maxRed) * 255);
	green 	= Math.floor( (green / maxGreen) * 255);
	blue 	= Math.floor( (blue / maxBlue) * 255);
	
	//reconvert the color to a rgb string
	var resColor = "rgb(" + red + "," + green + "," + blue + ")";

	//return the color
	return  resColor;
}

function drawMajority(d) {
	var tempMaj = "";
	
	//some string formating is done n order to compaare region name
	var nameReplaced = replaceSpecialChars( d.properties.name ).toLowerCase();
	
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
