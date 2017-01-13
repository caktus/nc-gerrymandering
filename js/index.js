var RATIO = 200 / 490;
var X_TRANSLATE_SCALE = 0.575;

var $container = d3.select('#map-container');
var $svg = d3.select('#mount').append('svg');
var projection = d3.geoConicConformal()
  .parallels([34 + 20 / 60, 36 + 10 / 60])
  .rotate([79, -33 - 45 / 60]);
var path = d3.geoPath().projection(projection);

function getContainerWidth () {
  return $container
    .node()
    .getBoundingClientRect()
    .width;
}

function getDimensions () {
  var width = getContainerWidth();
  var height = width * RATIO;
  return {
    width: width,
    height: height
  };
}

function refreshProjection () {
  var dimensions = getDimensions();
  projection
    .scale(dimensions.width * 6)
    .translate([dimensions.width * X_TRANSLATE_SCALE, dimensions.height]);
}

function resizeSVG () {
  var dimensions = getDimensions();
  $svg
    .attr('width', dimensions.width)
    .attr('height', dimensions.width * RATIO);
}

function drawMap (features) {
  $svg.selectAll('path')
    .data(features)
      .attr('d', path)
    .enter()
      .append('path')
      .attr('d', path);
}

document.addEventListener('DOMContentLoaded', function () {
  resizeSVG();
  refreshProjection();

  d3.queue()
    .defer(d3.json, 'data/2011.geojson')
    .defer(d3.json, 'data/2016.geojson')
    .await(function (err, data2011, data2016) {
      drawMap(data2016.features);

      window.addEventListener('resize', function () {
        resizeSVG();
        refreshProjection();
        drawMap(data2016.features);
      });
  });
});
