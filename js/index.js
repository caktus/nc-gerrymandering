var RATIO = 200 / 490;
var X_TRANSLATE_SCALE = 0.575;
var COLORS = d3.schemeCategory20;

var _color = new Backbone.Model({
  selected: COLORS[0]
});

var $container = d3.select('#map-container');
var $map = d3.select('#map-mount').append('svg');
var $palette = d3.select('#palette-mount').append('svg');
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
    .translate([dimensions.width * X_TRANSLATE_SCALE, dimensions.height * 0.95]);
}

function resizeMapSVG () {
  var dimensions = getDimensions();
  $map
    .attr('width', dimensions.width)
    .attr('height', dimensions.width * RATIO);
}

function drawMap (features) {
  $map.selectAll('path')
    .data(features)
      .attr('d', path)
    .enter()
      .append('path')
      .attr('d', path);
}

function addPalette () {
  $palette
    .append('g')
      .attr('transform', 'translate(0, 24)')
    .selectAll('rect')
      .data(COLORS)
      .enter()
        .append('rect')
        .on('click', function (d) {
          _color.set('selected', d)
        });

  _color.on('change:selected', refreshPalette);
  
  refreshPalette(_color, _color.get('selected'));
}

function refreshPalette (model, selected) {
  $palette
    .selectAll('rect')
      .data(COLORS)
      .attr('width', 24)
      .attr('height', 24)
      .attr('x', function (d, i) { return (i % 5) * 28 })
      .attr('y', function (d, i) { return Math.floor(i / 5) * 28})
      .attr('fill', function (d) { return d; })
      .attr('stroke', function (d) {
        if (d === selected) {
          return 'black';
        } else {
          return null;
        }
      });
}

document.addEventListener('DOMContentLoaded', function () {
  /***
   * Once the DOM content has loaded, initialize the SVGs with
   * appropriate dimensions.
   */
  resizeMapSVG();
  refreshProjection();
  addPalette();

  d3.queue()
    .defer(d3.json, 'data/2011.geojson')
    .defer(d3.json, 'data/2016.geojson')
    .await(function (err, data2011, data2016) {
      /***
       * Wait until data has loaded, then draw map elements.
       */
      drawMap(data2016.features);

      window.addEventListener('resize', function () {
        resizeMapSVG();
        refreshProjection();
        drawMap(data2016.features);
      });
  });
});
