var RATIO = 200 / 490;
var X_TRANSLATE_SCALE = 0.575;
var COLORS = d3.schemeCategory20;

var _color = new Backbone.Model({
  selected: COLORS[0]
});

var $container = d3.select('#map-container');
var $map = d3.select('#map-mount').append('svg');
var $palette = d3.select('#palette-mount').append('svg');
var $tooltip = d3.select('#tooltip');
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
      .attr('d', path)
      .on('click', function () {
        d3.select(this)
          .style('fill', function () { return _color.get('selected'); })
      })
      .on('mouseover', function (d) {
        var district = d.properties.district;
        var x = d3.event.pageX + 5;
        var y = d3.event.pageY + 5;
        $tooltip
          .style('transform', 'translate(' + x + 'px,' + y + 'px)')
          .style('-webkit-transform', 'translate(' + x + 'px,' + y + 'px)')
          .transition()
          .duration(200)
          .style('opacity', 1);
        $tooltip.select('span')
          .html('District ' + d.properties.district);
      })
      .on('mouseout', function (d) {
        $tooltip.transition()
          .duration(200)
          .style('opacity', 0);
      });
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
    .defer(d3.json, 'data/2016.geojson')
    .defer(d3.json, 'data/cities.geojson')
    .await(function (err, data2016, cities) {
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

jQuery.getJSON('data/gerrymandering-facts.json', function (data) {
  localStorage.setItem("record", 0);
  localStorage.setItem("jsonData", JSON.stringify(data));
  $("#facts").html(
    data[0]["FIELD3"] +
    " (<a target='_blank' href='" + data[0]["FIELD4"] + "'>source</a>)");
  window.setInterval(function(){
    data = JSON.parse(localStorage.getItem("jsonData"));
    current = parseInt(localStorage.getItem("record"));
    if (current==10) {
      current = 0;
    }
    else {
      current+=1;
    }
    $("#facts").fadeOut(0,
      $("#facts").html(
        data[current]["FIELD3"] +
        " (<a target='_blank' href='" + data[current]["FIELD4"] + "'>source</a>)"));
    $("#facts").fadeIn(800);
    localStorage.setItem("record", current);
  }, 10000);
});

/* Get voter statistics, do calculations, and put into tables */
jQuery.getJSON('data/voterData.json', function(voterData) {
  /* Do calculations and set the html */
  // Voter affiliation by party, rounded to 1 decimal value
  $('#voter-affiliation-democrat').html(Math.round(1000 * voterData.partyAffiliation.democrat/voterData.partyAffiliation.total) / 10 + '%');
  $('#voter-affiliation-republican').html(Math.round(1000 * voterData.partyAffiliation.republican/voterData.partyAffiliation.total) / 10 + '%');
  $('#voter-affiliation-libertarian').html(Math.round(1000 * voterData.partyAffiliation.libertarian/voterData.partyAffiliation.total) / 10 + '%');
  $('#voter-affiliation-unaffiliated').html(Math.round(1000 * voterData.partyAffiliation.unaffiliated/voterData.partyAffiliation.total) / 10 + '%');
  // Voter representation by party, rounded to 1 decimal value
  $('#voter-representation-democrat').html(Math.round(1000 * voterData.partyRepresentation.democrat/voterData.partyRepresentation.total) / 10 + '%');
  $('#voter-representation-republican').html(Math.round(1000 * voterData.partyRepresentation.republican/voterData.partyRepresentation.total) / 10 + '%');
  $('#voter-representation-libertarian').html(Math.round(1000 * voterData.partyRepresentation.libertarian/voterData.partyRepresentation.total) / 10 + '%');
  $('#voter-representation-unaffiliated').html(Math.round(1000 * voterData.partyRepresentation.unaffiliated/voterData.partyRepresentation.total) / 10 + '%');
  // Voter affiliation by race, rounded to 1 decimal value
  $('#voter-affiliation-white').html(Math.round(1000 * voterData.race.white/voterData.race.total) / 10 + '%');
  $('#voter-affiliation-black').html(Math.round(1000 * voterData.race.black/voterData.race.total) / 10 + '%');
  $('#voter-affiliation-americanindian').html(Math.round(1000 * voterData.race.americanindian/voterData.race.total) / 10 + '%');
  $('#voter-affiliation-hispanic').html(Math.round(1000 * voterData.race.hispanic/voterData.race.total) / 10 + '%');
  $('#voter-affiliation-other').html(Math.round(1000 * voterData.race.other/voterData.race.total) / 10 + '%');
  // Voter representation by race, rounded to 1 decimal value
  $('#voter-representation-white').html(Math.round(1000 * voterData.raceRepresentation.white/voterData.raceRepresentation.total) / 10 + '%');
  $('#voter-representation-black').html(Math.round(1000 * voterData.raceRepresentation.black/voterData.raceRepresentation.total) / 10 + '%');
  $('#voter-representation-americanindian').html(Math.round(1000 * voterData.raceRepresentation.americanindian/voterData.raceRepresentation.total) / 10 + '%');
  $('#voter-representation-hispanic').html(Math.round(1000 * voterData.raceRepresentation.hispanic/voterData.raceRepresentation.total) / 10 + '%');
  $('#voter-representation-other').html(Math.round(1000 * voterData.raceRepresentation.other/voterData.raceRepresentation.total) / 10 + '%');
  // Voter affiliation by sex, rounded to 1 decimal value
  $('#voter-affiliation-male').html(Math.round(1000 * voterData.sex.male/voterData.sex.total) / 10 + '%');
  $('#voter-affiliation-female').html(Math.round(1000 * voterData.sex.female/voterData.sex.total) / 10 + '%');
  // Voter representation by sex, rounded to 1 decimal value
  $('#voter-representation-male').html(Math.round(1000 * voterData.sexRepresentation.male/voterData.sexRepresentation.total) / 10 + '%');
  $('#voter-representation-female').html(Math.round(1000 * voterData.sexRepresentation.female/voterData.sexRepresentation.total) / 10 + '%');
});
