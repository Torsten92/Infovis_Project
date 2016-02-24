//Load data
function loadData(value) {
    //console.log(value);
    var dataset = "Data/Swedish_Election_" + value + ".csv";
    var population = "Data/population.csv";
    var income = "Data/income.csv";
    var education = "Data/education.csv";

    d3.csv(dataset, function(data) {
        createMajorityList(data);
    });

    //Load the topojson data with "svenska kommuner"
    d3.json("data/swe_mun.topojson", function(error, sweden) {
        var mun = topojson.feature(sweden, sweden.objects.swe_mun).features;
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
		region = region.toLowerCase();
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