
var partyColor = { 	
	"socialdemokraterna": 	"rgb(224, 0, 36)", 
	"moderaterna": 			"rgb(0, 139, 206)",
	"centerpartiet": 		"rgb(5, 155, 65)",
	"folkpartiet": 			"rgb(137, 192, 233)", 
	"kristdemokraterna": 	"rgb(34, 86, 169)", 
	"miljöpartiet": 		"rgb(0, 255, 0)", 
	"vänsterpartiet": 		"rgb(189, 0, 28)", 
	"sverigedemokraterna": 	"rgb(234, 224, 13)",
	"vänsterpartiet": 		"rgb(255, 150, 150)",
	"miljöpartiet": 		"rgb(0, 132, 59)",
	"övriga partier": 		"rgb(100, 100, 100)",
};

//dataset might be different depending on the slider position. It will be initialized on startup in loadData()
var dataset;

//Stores the current election year used
var year;

//Stores the current selected municipality
var selectedMunicipality;

//Initialize data containing detailed information
var population = "Data/population.csv";
var income = "Data/income.csv";
var education = "Data/education.csv";
d3.csv(population, function(data) { population = data; });
d3.csv(income, function(data) { income = data; });
d3.csv(education, function(data) { education = data; });


var filterChecked = false;
var partyToFilter = "socialdemokraterna";
var regionIsFiltered = false;

//stores region and it's majority party
var majParty = [];

//Return true if a string contains only numbers
function isNumeric(str) {
  return !isNaN(parseFloat(str)) && isFinite(str);
}

//Format a string according to the specific datasets used in this application
function formatString(str, toLower) {	
	if(toLower)
		str = str.toLowerCase();
	if(isNumeric(str[0]))
		str = str.substring(5, str.length);
	return str;
}

//Used in rgbToHex
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

//Converts a string of the form "rgb(???, ???, ???) into its hexadecimal component e.g. of the form "#??????"
function rgbToHex(str) {

	var colorsOnly = str.substring(str.indexOf('(') + 1, str.lastIndexOf(')')).split(/,\s*/);
    var red = Math.floor( colorsOnly[0] );
    var green = Math.floor( colorsOnly[1] );
	var blue = Math.floor( colorsOnly[2] );

    return "#" + componentToHex(red) + componentToHex(green) + componentToHex(blue);
}

function splitYears(str) {
	return str.split(" ");	
}

//Called when the user resizes the window
function onResize() {
	var width = document.getElementById("map").clientWidth - 5;
	var height = document.getElementById("map").clientHeight - 5;
	svg = d3.selectAll(".svg")
        .attr("width", width)
        .attr("height", height);

        var details = d3.select("#details");
        details.style("height", function() {
		if(document.getElementById("details").offsetWidth > 530) return "420px";
		else return "600px";
	})
	.attr("transform", "translate(" + width + ", 100)");
};

//Contains functionality for the detailed information box
function showDetails(kommun) {
	var details = d3.select("#details");
	var detailsInfo = d3.select("#detailsInfo");
	var detailsDonut = d3.select("#detailsDonut");
	var detailsBelow = d3.select("#detailsBelow");
	var width = document.getElementById("details").offsetWidth;

	selectedMunicipality = kommun;

	//Erase old information
	details.selectAll("#startup").remove();
	detailsInfo.selectAll(".info").remove();
	detailsDonut.selectAll(".donut").remove();
	detailsBelow.selectAll(".info").remove();

	var tempProcent = [], tempParti = [], tempPop = [], tempEdu = [], tempInc = [];
	var popSum = 0;
	
	var x = 0;

	population.forEach(function(d, i) {
		if(formatString(kommun.properties.name, true) == formatString(d.region, true)) {
			var temp = splitYears(d.år);

			switch(year) {
				case "2002":
					temp = temp[0];
					break;
				case "2006":
					temp = temp[1];
					break;
				case "2010":
					temp = temp[2];
					break;
				case "2014":
					temp = temp[3];
					break;
			}

			popSum += parseFloat(temp);
			tempPop[x] = { "ålder": d.ålder, "år": temp };
			x++;
		}
	});

	x = 0;
	education.forEach(function(d, i) {
		if(formatString(kommun.properties.name, true) == formatString(d.region, true)) {
			var temp = splitYears(d.år);
			
			switch(year) {
				case "2002":
					temp = temp[0];
					break;
				case "2006":
					temp = temp[1];
					break;
				case "2010":
					temp = temp[2];
					break;
				case "2014":
					temp = temp[3];
					break;
			}

			tempEdu[x] = { "utbildningsnivå": d.utbildningsnivå, "år": temp };
			x++;
		}
	});

	x = 0;
	income.forEach(function(d, i) {
		if(formatString(kommun.properties.name, true) == formatString(d.region, true)) {
			var temp = splitYears(d.år);
			
			switch(year) {
				case "2002":
					temp = temp[0];
					break;
				case "2006":
					temp = temp[1];
					break;
				case "2010":
					temp = temp[2];
					break;
				case "2014":
					temp = temp[3];
					break;	
			}

			tempInc[x] = { "ålder": d.ålder, "år": temp };
			x++;
		}
	});

	x = 0;
    dataset.forEach(function(d, i) {
    	if(formatString(kommun.properties.name, true) == formatString(d.region, true) && isNumeric(d.procent)) {
    		tempParti[x] = d.parti;
        	tempProcent[x] = d.procent;
        	x++;
        }
	});

    detailsInfo.append("div")	
		.attr("class", "info")
		.style("float", "left")
		.style("opacity", 1.0)
		.html( printParties(kommun) );

    createDonut(tempParti, tempProcent);
	
	details.style("height", function() {
		if(width > 530) return "300px";
		else return "400px";
	});

	var popStr = "<font size='3'>Population:</font><br>";
	for(var i = 0; i < tempPop.length; i++) {
		popStr += tempPop[i].ålder + ": " + tempPop[i].år + "<br>";
	}
	popStr += "Sammanlagt: " + popSum

	var eduStr = "<font size='3'>Utbildningsnivå:</font><br>";
	for(var i = 0; i < tempEdu.length; i++) {
		eduStr += tempEdu[i].utbildningsnivå + ": " + tempEdu[i].år + "<br>";
	}

	var incStr = "<font size='3'>Inkomst:</font><br>";
	for(var i = 0; i < tempInc.length; i++) {
		incStr += tempInc[i].ålder + ": " + tempInc[i].år + "<br>";
	}

    //var detailsBelowDiv = detailsBelow.append("div").style("border-style", "solid");

    detailsBelow.append("div")
		.attr("class", "info")
		.style("float", "left")
		.style("width", "30%")
		.style("opacity", 1.0)
		.html( popStr);
	detailsBelow.append("div")	
		.attr("class", "info")
		.style("float", "left")
		.style("width", "30%")
		.style("opacity", 1.0)
		.html( eduStr);
	detailsBelow.append("div")	
		.attr("class", "info")
		.style("float", "left")
		.style("width", "30%")
		.style("opacity", 1.0)
		.html( incStr);
}

//Prints a list of the parties for a municipality. Currently used by tooltip and the detailed information box.
function printParties(d, filterChecked) {

	var tooltip = "<font size='5'> " + d.properties.name + "</font>";
	
	var temp = [];
	var x = 0;			        
    dataset.forEach(function(d2, i) {
    	if(isNumeric(d2.procent)) {
        	temp[x++] = {"region": d2.region, "parti": d2.parti, "procent": d2.procent};
        }
	});
	
    //Sort array by party precentage
    temp.sort( function(a, b) { return parseFloat(b.procent) - parseFloat(a.procent); });

    for(var i = 0; i < temp.length; i++) {
		var region = formatString(temp[i].region, true);
		var name = formatString(d.properties.name, true);
		if(region == name) {

			var rgb = partyColor[ formatString(temp[i].parti, true) ];
			var hex = rgbToHex(rgb);
			
			if(filterChecked && formatString(partyToFilter, true) == formatString(temp[i].parti, true))
				tooltip += "<br><font color=" + hex + "> " + temp[i].parti +  " : " + temp[i].procent + "%</font>";
			else if(filterChecked && formatString(partyToFilter, true) != formatString(temp[i].parti,true))
				tooltip += "<br>" + temp[i].parti +  " : " + temp[i].procent + "%";
			else
				tooltip += "<br><font color=" + hex + "> " + temp[i].parti +  " : " + temp[i].procent + "%</font>";
		}
	}
	
	return tooltip;
}