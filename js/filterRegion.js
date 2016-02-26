var filteredRegionName = "";

var useRegionFilter = false;

function searchUpdate(entry) {
	
	redrawNoFilter();
	
	// if(validateEntry(entry)) 
		// redrawWithFilter( filteredRegionName );
	
	entry = entry.toLowerCase();
	
	if( entry != "" )
		redrawWithFilter(entry, false);
}

function validateEntry(entry) {
	
	//dont bother if string is empty
	if(entry == "")
		return;
		
	entry = entry.toLowerCase();
		
	//if match is found, store that region name
	for(var i = 0; i < majParty.length; i++) {
		
		if(entry.localeCompare(majParty[i].region) == 0) {
			filteredRegionName = majParty[i].region;
			return true;
		}
	}
	
	filteredRegionName ="" ;
	return false;
}

function redrawNoFilter() {
	g.selectAll(".country")    
	.style("fill", function(d, i) {
		
		//draw differently if filter checkbox is used
		if( filterChecked ) {
			return drawFiltered(d, i);
		}
		else
			return drawMajority(d);
	})	
}

function redrawWithFilter(region, clickUsed) {
	g.selectAll(".country")
            .style("fill", function(d) {
				
				var thisRegion = d.properties.name;
				thisRegion = thisRegion.toLowerCase();
				
				if(!clickUsed) {
					//contains comparison
					if( thisRegion.indexOf(region) == -1 )
						return "gray";
				}
				else {
					//exact comparison
					if( (d.properties.name).toLowerCase() != region )
						return "gray";
				}
				
				return d3.select(this).style;
			});
}
