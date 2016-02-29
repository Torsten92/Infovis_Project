
var mun;

//Load data
function loadData(value) {
    dataset = "data/Swedish_Election_" + value + ".csv";
	year = value;

    d3.csv(dataset, function(data) {
		dataset = data;
        createMajorityList(data);
        dataset = data;
    });
    
	//Load the topojson data with "svenska kommuner"
	d3.json("data/swe_mun.topojson", function(error, sweden) {
		mun = topojson.feature(sweden, sweden.objects.swe_mun).features;
		
		var filterParty = document.getElementById("checkbox1");
		if(filterParty.checked)
	   		filterByParty(filterParty);
		else
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
		var region = formatString(data[k].region, true);
	
		for (var i = k; i < k+11; i++) {
			
			if(parseFloat(data[i].procent) > votePerc) {	
				majority = data[i].parti;
				votePerc = data[i].procent;
			}
		}
		
		majParty[listIndex] = {region, majority, votePerc};
		
		k += 11;
		listIndex++;
	}
}

//create a list with the party name, and in which region it has its highest voting percentage
function createRegionList(data){
	
	var majRegion = [];
	var numberOfParties = 8;
	var k = 0;
	var listIndex = 0;

	for(var i = 0; i < numberOfParties; i++){

		k = i;

		var highest = formatString(data[k].region, false);
		var votePerc = parseFloat(data[k].procent);
		var party = data[k].parti;
		
		while(k < data.length){

			if(parseFloat(data[k].procent) > votePerc){

				highest = formatString(data[k].region, false);
				votePerc = data[k].procent;	
			}

			k += 11;
		}

		party = data[i].parti;
		
		majRegion[listIndex] = {party, highest, votePerc};
		listIndex++;
	} 
	return majRegion;
}

function getRegion(party){

	var partyList = [];
	partyList = createRegionList(dataset);
	for(var i = 0; i < partyList.length; i++)
	{
		if(formatString(partyList[i].party, true) == formatString(party, true))
			return partyList[i].highest;
	}
	return "";
}

function getPercent(party){

	var partyList = [];
	partyList = createRegionList(dataset);
	for(var i = 0; i < partyList.length; i++)
	{
		if(formatString(partyList[i].party, true) == formatString(party, true))
			return partyList[i].votePerc;
	}
	return "";
}