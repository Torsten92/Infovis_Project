
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

var population = "Data/population.csv";
var income = "Data/income.csv";
var education = "Data/education.csv";

var filterChecked = false;
var partyToFilter = "socialdemokraterna";

var regionIsFiltered = false;

//stores region and it's majority party
var majParty = [];

function isNumeric(str) {
  return !isNaN(parseFloat(str)) && isFinite(str);
}

function formatString(str, toLower) {	
	if(toLower)
		str = str.toLowerCase();
	if(isNumeric(str[0]))
		str = str.substring(5, str.length);
	return str;
}


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(str) {

	var colorsOnly = str.substring(str.indexOf('(') + 1, str.lastIndexOf(')')).split(/,\s*/);
    var red = Math.floor( colorsOnly[0] );
    var green = Math.floor( colorsOnly[1] );
	var blue = Math.floor( colorsOnly[2] );

    return "#" + componentToHex(red) + componentToHex(green) + componentToHex(blue);
}

function onResize() {
	var width = document.getElementById("map").clientWidth - 5;
	var height = document.getElementById("map").clientHeight - 5;
	svg = d3.selectAll(".svg")
        .attr("width", width)
        .attr("height", height);
};

function showDetails(kommun) {
	var details = d3.select("#details");

	details.html("<font size='5'>" + kommun.properties.name + "</font> <br>" + 
		"mer info kommer inom kort..."
		);
}