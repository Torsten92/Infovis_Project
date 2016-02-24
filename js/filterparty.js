
var filteredPartyPercentList = [];

var maxRed = 1, maxGreen = 1, maxBlue = 1;

var startIndex;
var startIndexList = { 	"moderaterna": 0,
						"centerpartiet": 1,
						"folkpartiet": 2, 
						"kristdemokraterna": 3, 
						"miljöpartiet": 4, 
						"socialdemokraterna": 5,
						"vänsterpartiet": 6, 
						"sverigedemokraterna": 7};

//called when filter checkbox is changed
function filterByParty( checkbox ) {
	filterChecked = checkbox.checked;
	
	//get selection from drop down menu
	var e = document.getElementById("dropmenu");
	partyToFilter = e.options[e.selectedIndex].text;
	
	//Enable/disable drop menu
	e.disabled = !e.disabled;
	
	//set start index in data set
	startIndex = startIndexList[ partyToFilter.toString().toLowerCase() ];
	
	//create list of percentage per region
	createList(startIndex);
	
	//find max rgb in order to normalize colors
	findMaxRgb();
	
	//redraw map
	draw(mun);
}

//called when drop down menu is changed
function changeFilterParty() {
	
	var e = document.getElementById("dropmenu");
	partyToFilter = e.options[e.selectedIndex].text;
	
	//set start index in data set
	startIndex = startIndexList[ partyToFilter.toString().toLowerCase() ];
	
	//create list of percentage per region
	createList(startIndex);
	
	//find max rgb in order to normalize colors
	findMaxRgb();
	
	//redraw map
	draw(mun);
}

//fill a list with the filtered parties percentages for each region
function createList(index) {
	
	var listIndex = 0;	
	while (dataset[index]) {
		
		filteredPartyPercentList[listIndex] = dataset[index].procent;
		
		index += 11;
		listIndex++;
	}
}

//Find max RGB values in order to later normalize
function findMaxRgb() {
	
	//reset
	maxRed = 1;
	maxGreen = 1;
	maxBlue = 1;
	
	for (var i = 0; i < filteredPartyPercentList.length; i++) {

		//get the percentage from the list created n filterparty
		var colorPercent = filteredPartyPercentList[i] / 100;

		//Multply color values with election percentages
		var colorString =   partyColor[ partyToFilter.toLowerCase()];
		var colorsOnly = colorString.substring(colorString.indexOf('(') + 1, colorString.lastIndexOf(')')).split(/,\s*/);
		var red 	= Math.floor( colorsOnly[0] * colorPercent );
		var green = Math.floor( colorsOnly[1] * colorPercent );
		var blue 	= Math.floor( colorsOnly[2] * colorPercent );
		
		//check if regions color intensity is bigger than current max, if so replace
		if(red > maxRed)
			maxRed = red;
		if(green > maxGreen)
			maxGreen = green
		if(blue > maxBlue)
			maxBlue = blue;
	}
}