
function createDonut(dataParty, dataPercent) {

    var width = document.getElementById("details").offsetWidth;

    if(width > 530) width = 150;
    else width = 100;

    var pie = d3.layout.pie()
        .sort(function(a, b) { return b - a; });

    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(50);

    var svg = d3.select("#detailsDonut").append("svg")
        .attr("class", "donut")
        .append("g")
        .attr("transform", "translate(" + width + ", 100)");

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