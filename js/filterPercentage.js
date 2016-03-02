var filterByPercent = false;
var filterPercentValue = 100;

//Calls when checkbox is updated
function filterPercentCheckChange(checkbox) {
	filterByPercent = checkbox.checked;	
	
	if(filterByPercent) {
		filterPercentValue = document.getElementById("percentSlider").value;
	
		redrawWithPercentFilter();	
	}
	else
		redrawNoFilter();
}

//Calls when slider is updated
function filterPercentSliderChange(slider) {
	filterPercentValue = slider.value;
	
	if(filterByPercent) {	
		redrawWithPercentFilter();
	}
}

//calls when slider gets input (continuosly)
function updatePercentFilterText(slider) {
	document.getElementById("filterPercentText").innerHTML  = "" + slider.value + "%";
}

//Redraw map with the percent filter
function redrawWithPercentFilter() {
	
	redrawNoFilter(); //make sure the right colors are used
	
	g.selectAll(".country")    
	.style("fill", function(d, i) {
	
		//Do this if filter party view is active
		if(filterChecked) {
			for(var k = 0; k < filteredPartyPercentList.length; k++) {
				if( formatString( d.properties.name, true ) == formatString( filteredPartyPercentList[k][0], true ) 
						&& Number( filteredPartyPercentList[k][1] ) >= Number( filterPercentValue) ) {		
					return d3.select(this).style;
				}
			}
		}
		
		//else use the majParty list
		else {
			for(var k = 0; k < majParty.length; k++) {
				if( formatString( d.properties.name, true ) == formatString( majParty[k].region, true ) 
						&& Number( majParty[k].votePerc ) >= Number( filterPercentValue) ) {		
					return d3.select(this).style;
				}
			}
		}
		
		//if  threshold was bigger than vote percentage, set color as gray
		return "rgb(0,0,0)";
	})
}