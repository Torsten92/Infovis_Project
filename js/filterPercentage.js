var filterByPercent = false;

var filterPercentValue = 0;

//Calls when checkbox is updated
function filterPercentCheckChange(checkbox) {
	filterByPercent = checkbox.checked;	
	//redrawWithPercentFilter();
}

//Calls when slider is updated
function filterPercentSliderChange(slider) {
	filterPercentValue = slider.value;
	
}

//Redraw map with the percent filter
function redrawWithPercentFilter() {
	
	//console.log(filteredPartyPercentList);
	
	
	g.selectAll(".country")    
	.style("fill", function(d, i) {
		
		
		//För parti-filter-vy:
		for(var k = 0; k < filteredPartyPercentList.length; k++) {
			
			//hitta partinamn och jämför valsiffra
		}
		
	})	
}