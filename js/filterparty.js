
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
	partyToFilter = e.options[e.selectedIndex].text.toString().toLowerCase();
	
	//Enable/disable drop menu
	e.disabled = !checkbox.checked;
	
	//set start index in data set
	startIndex = startIndexList[ partyToFilter ];
	
	//create list of percentage per region
	createList(startIndex);
	
	//find max rgb in order to normalize colors
	findMaxRGB();
	
	//redraw map
	draw(mun);
	
	if(!e.disabled)
		filtertextDiv.transition()
			.duration(200)
			.style("opacity", 1);
		else
			filtertextDiv.transition()
				.duration(200)
				.style("opacity", 0);
		
	filtertextDiv.html(partyToFilter + " had its highest voting percentage in Norrköping with 666%!");

}

//called when drop down menu is changed
function changeFilterParty() {
	var e = document.getElementById("dropmenu");
	partyToFilter = e.options[e.selectedIndex].text.toString().toLowerCase();
	
	//set start index in data set
	startIndex = startIndexList[ partyToFilter ];
	
	//create list of percentage per region
	createList(startIndex);
	
	//find max rgb in order to normalize colors
	findMaxRGB();
	
	//redraw map
	draw(mun);
	
	filtertextDiv.html(partyToFilter + " had its highest voting percentage in Norrköping with 666%!");
}

//fill a list with the filtered parties percentages for each region
function createList(index) {
	var listIndex = 0;	
	while (dataset[index]) {
		
		filteredPartyPercentList[listIndex] = [dataset[index].region,  dataset[index].procent];
		
		index += 11;
		listIndex++;
	}
}

//Find max RGB values in order to later normalize
function findMaxRGB() {
	
	//reset
	maxRed = 1;
	maxGreen = 1;
	maxBlue = 1;
	
	for (var i = 0; i < filteredPartyPercentList.length; i++) {

		//get the percentage from the list created n filterparty
		var colorPercent = filteredPartyPercentList[i][1] / 100;

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
