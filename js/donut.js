
var tooltipDonut = d3.select("body").append("div")    
        .attr("class", "tooltip")
        .style("opacity", 1.0);

function createDonut(kommun) {
	var dataPercent = [], dataParty = [];
	var x = 0;
    dataset.forEach(function(d, i) {
    	if(formatString(kommun.properties.name, true) == formatString(d.region, true) && isNumeric(d.procent)) {
    		dataParty[x] = d.parti;
			dataPercent[x] = d.procent;
        	x++;
        }
	});
    
    var pie = d3.layout.pie()
        .sort(function(a, b) { return b - a; });

    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(50);

    var svg = d3.select("#detailDonutContent");
    var width = document.getElementById("detailDonutContent").offsetWidth;
    
    var height = document.getElementById("detailDonutContent").offsetHeight;

    svg = svg.append("svg")
        .attr("class", "donut")
        .append("g")
        .attr("transform", "translate(" + (width/2) + ", " + 100 + ")")

        //Tooltip
        .on("mouseover", function() {
            tooltipDonut.transition() 
                .duration(200)
                .style("opacity", 0.9);
            tooltipDonut.html( printParties(kommun, false, false) )
                .style("left", (d3.event.pageX + 50) + "px")        
                .style("top", (d3.event.pageY - 100) + "px");
            console.log("mouseover");
        })
        .on("mouseout", function() {
            tooltipDonut.transition().style("opacity", 0);        
        });

    var path = svg.selectAll("path")
        .data(pie(dataPercent))
        .enter().append("path")
        .attr("fill", function(d, i) {
            var rgb = partyColor[ formatString(dataParty[i], true) ];
            var hex = rgbToHex(rgb);
            return hex;
        })
        .attr("d", arc);
}
