var RATIO = 200 / 490;

function getContainerWidth () {
  return d3.select('#map-container')
    .node()
    .getBoundingClientRect()
    .width;
}

document.addEventListener('DOMContentLoaded', function () {
  var width = getContainerWidth();
  var height = width * RATIO;
  var colors = d3.schemeCategory20;
  var projection = d3.geoConicConformal()
  .parallels([34 + 20 / 60, 36 + 10 / 60])
  .rotate([79, -33 - 45 / 60])
  .scale(width * 6)
  .translate([width * 0.575, height]);
  var path = d3.geoPath().projection(projection);

  var $svg = d3.select('#mount')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

  d3.queue()
  .defer(d3.json, 'data/2011.geojson')
  .defer(d3.json, 'data/2016.geojson')
  .await(function (err, data2011, data2016) {
    var features = data2011.features;

    window.f = data2011.features;

    var $districts = $svg.selectAll('path')
    .data(features)
    .enter()
    .append('path')
    .attr('d', path);
  });
});

jQuery.getJSON('data/gerrymandering-facts.json', function (data) {
  localStorage.setItem("record", 0);
  localStorage.setItem("jsonData", JSON.stringify(data));
  $("#facts").html(data[0]["FIELD3"]);
  window.setInterval(function(){

    data = JSON.parse(localStorage.getItem("jsonData"));
    current = parseInt(localStorage.getItem("record"));
    if (current==10) {
      current = 0;
    }
    else {
      current+=1;
    }
    $("#facts").fadeOut();
    $("#facts").html(data[current]["FIELD3"]);
    $("#facts").fadeIn("slow");
    localStorage.setItem("record", current);
  }, 10000);
});