var filterChecked = false;
var partyToFilter = "Socialdemokraterna";

function filterByParty( checkbox ) {
	
	if( checkbox.checked )
		console.log("Redraw with filter");
	
}

function drawWithFilter(party) {
	switch (party) {
		case "Socialdemokraterna":
			return "red";
			break;
		case Moderaterna:
			return "blue";
			break;
		case Vänsterpartiet:
			return "dark-red";
			break;
		case Centerpartiet:
			return "light-red";
			break;
		case Folkpartiet:
			return "dark-blue";
			break;
		case Miljöpartiet:
			return "green";
			break;
		case Sverigedemokraterna:
				return "yellow";
			break;
		case Kristdemokraterna:
			return "light-blue";
			break;
	}
	
}