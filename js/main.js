
var partyColor = { "socialdemokraterna": "red", "moderaterna": "blue","centerpartiet": "green",
					"folkpartiet": "green", "kristdemokraterna": "green", "miljöpartiet": "green", 
					"vänsterpartiet": "green", "sverigedemokraterna": "yellow"};

//dataset might be different depending on the slider position. It will be initialized on startup in loadData()
var dataset;

var population = "Data/population.csv";
var income = "Data/income.csv";
var education = "Data/education.csv";

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