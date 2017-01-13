var width = 480;
var height = 250;
var colors = d3.schemeCategory20;
var projection = d3.geoConicConformal()
  .parallels([34 + 20 / 60, 36 + 10 / 60])
  .rotate([79, -33 - 45 / 60])
  .scale(3051.0011479691784)
  .translate([285.2940254217039, 215.89636069700896]);
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
        .attr('d', path)
        .style('fill', function (d, i) { return colors[i]; });
  });
