
var filteredPartyPercentList = [];

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
	
	//redraw map
	draw(mun);
}

function createList(index) {
	
	var listIndex = 0;	
	while (dataset[index]) {
		
		filteredPartyPercentList[listIndex] = dataset[index].procent;
		
		index += 11;
		listIndex++;
	}
}