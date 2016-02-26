
var partyColor = { 	"socialdemokraterna": 	"rgb(255, 0, 0)", 
					"moderaterna": 			"rgb(0, 0, 255)",
					"centerpartiet": 		"rgb(150, 0, 0)",
					"folkpartiet": 			"rgb(0, 0, 150)", 
					"kristdemokraterna": 	"rgb(150, 150, 255)", 
					"miljöpartiet": 		"rgb(0, 255, 0)", 
					"vänsterpartiet": 		"rgb(255, 150, 150)", 
					"sverigedemokraterna": 	"rgb(150, 150, 0)",

					"vqnsterpartiet": 		"rgb(255, 150, 150)",
					"miljqpartiet": 		"rgb(0, 255, 0)",
					"qvriga partier": 		"rgb(0, 255, 0)",
				};

//Used for displaying text while the "Filter by specific party" is checked
var filtertextDiv = d3.select("#map").append("div")
		.attr("class", "filteredPartyText")
		.style("opacity", 0);

//dataset might be different depending on the slider position. It will be initialized on startup in loadData()
var dataset;

var population = "Data/population.csv";
var income = "Data/income.csv";
var education = "Data/education.csv";

var filterChecked = false;
var partyToFilter = "socialdemokraterna";


function replaceSpecialChars (str) {
	str = str.replace(/�/g, "q"); 
	str = str.replace(/å/g, "q");  
	str = str.replace(/ä/g, "q");  
	str = str.replace(/ö/g, "q"); 
	str = str.replace(/Å/g, "q"); 
	str = str.replace(/Ä/g, "q"); 
	str = str.replace(/Ö/g, "q"); 
	return str;
}

function isNumeric(str) {
  return !isNaN(parseFloat(str)) && isFinite(str);
}

function formatString(str, toLower) {
	str = replaceSpecialChars(str);
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
