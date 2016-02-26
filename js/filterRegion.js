var filteredRegionName = "";

var useRegionFilter = false;

function searchUpdate(entry) {
	
	redrawNoFilter();

	entry = entry.toLowerCase();
	
	if( entry != "" )
		redrawWithFilter(entry, false);
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

				showDetails(d);

				return d3.select(this).style;
			});
}
