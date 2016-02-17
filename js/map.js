var zoom = d3.behavior.zoom()
.scaleExtent([0.5, 8])
.on("zoom", move);

//Assings the svg canvas to the map div
var svg = d3.select("#map").append("svg")
        .attr("width", 400)
        .attr("height", 600)
        .call(zoom);

var g = svg.append("g");

//Sets the map projection
var projection = d3.geo.mercator()
        .center([40, 62.5])
        .scale(700);

//Creates a new geographic path generator and assing the projection        
var path = d3.geo.path().projection(projection);

//Load data
function loadData(value) {
    //console.log(value);
    var dataset = "Data/Swedish_Election_" + value + ".csv";
    d3.csv(dataset, function(data) {
        createMajorityList(data);
    });

    //Load the topojson data with "svenska kommuner"
    d3.json("data/swe_mun.topojson", function(error, sweden) {
        var mun = topojson.feature(sweden, sweden.objects.swe_mun).features;
        //console.log(mun);
        draw(mun);
    });
}

//stores region and it's majority party
var majParty = [];

//Build a list  with the region name, and which party has majority there, plus the percentage
function createMajorityList(data) {
	
    majParty = [];
	var k = 0;
	var listIndex = 0;
	
	while (k < data.length) {
	
		var majority = data[k].parti;
		var votePerc = parseFloat(data[k].procent);
		var region = data[k].region;
		
		region = replaceSpecialChars(region);
		//console.log(region);
	
		for (var i = k; i < k+11; i++) {
			
			if(parseFloat(data[i].procent) > votePerc) {	
				majority = data[i].parti;
				votePerc = data[i].procent;
			}
		}
		
		//remove the numbers in the region name
		region = region.substring(5, region.length);
		
		majParty[listIndex] = {region, majority, votePerc};
		
		k += 11;
		listIndex++;
	}
}

function replaceSpecialChars (str) {
	str = str.replace(/�/g, "8"); 
	str = str.replace(/å/g, "8");  
	str = str.replace(/ä/g, "8");  
	str = str.replace(/ö/g, "8"); 
	str = str.replace(/Å/g, "8"); 
	str = str.replace(/Ä/g, "8"); 
	str = str.replace(/Ö/g, "8"); 
	return str;
}

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
				
				//Seach through majParty  until region names match, use the maj-party to set color
				for (var i = 0; i < majParty.length; i++) {
				
					//compare region names					
					if( replaceSpecialChars( d.properties.name ) == majParty[i].region) {
						
						tempMaj = majParty[i].majority;
						tempMaj = tempMaj.toLowerCase();
						break;
					}
				}
				
				//return color depending on leading party
				switch (tempMaj) {
					
					case "socialdemokraterna":
						return "red";
					break;
					
					case "moderaterna":
						return "blue";
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