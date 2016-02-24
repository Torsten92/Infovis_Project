
var partyColor = { "socialdemokraterna": "red", "moderaterna": "blue","centerpartiet": "green",
					"folkpartiet": "green", "kristdemokraterna": "green", "miljöpartiet": "green", 
					"vänsterpartiet": "green", "sverigedemokraterna": "yellow"};

//dataset might be different depending on the slider position. It will be initialized on startup in loadData()
var dataset;

var population = "Data/population.csv";
var income = "Data/income.csv";
var education = "Data/education.csv";

function replaceSpecialChars (str) {
	str = str.replace(/�/g, "Q"); 
	str = str.replace(/å/g, "Q");  
	str = str.replace(/ä/g, "Q");  
	str = str.replace(/ö/g, "Q"); 
	str = str.replace(/Å/g, "Q"); 
	str = str.replace(/Ä/g, "Q"); 
	str = str.replace(/Ö/g, "Q"); 
	return str;
}

function isNumeric(str) {
  return !isNaN(parseFloat(str)) && isFinite(str);
}

function formatString(str) {
	str = replaceSpecialChars(str);
	str = str.toLowerCase();
	if(isNumeric(str[0]))
		str = str.substring(5, str.length);
	return str;
}