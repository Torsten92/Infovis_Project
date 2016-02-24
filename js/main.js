
var partyColor = { 	"socialdemokraterna": 	"rgb(255, 0, 0)", 
								"moderaterna": 				"rgb(0, 0, 255)",
								"centerpartiet": 				"rgb(150, 0, 0)",
								"folkpartiet": 					"rgb(0, 0, 150)", 
								"kristdemokraterna": 		"rgb(150, 150, 255)", 
								"miljöpartiet": 					"rgb(0, 255, 0)", 
								"vänsterpartiet": 				"rgb(255, 150, 150)", 
								"sverigedemokraterna": 	"rgb(150, 150, 0)"};

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