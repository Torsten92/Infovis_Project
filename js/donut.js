
function createDonut(dataParty, dataPercent) {

    
    var pie = d3.layout.pie()
        .sort(function(a, b) { return b - a; });

    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(50);

    var svg = d3.select("#donut");
    var width = document.getElementById("donut").offsetWidth;
    var height = document.getElementById("info").offsetHeight;	//Base donut window height on info height
    
    //+10 pixels for margin
    svg.style("height", height+10 + "px");
    svg = svg.append("svg")
        .attr("class", "donut")
        .append("g")
        .attr("transform", "translate(" + (width/2) + ", " + 100 + ")");

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
