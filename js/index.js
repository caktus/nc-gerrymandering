var mount = document.getElementById('mount');

d3.queue()
  .defer(d3.json, 'data/2011.geojson')
  .defer(d3.json, 'data/2016.geojson')
  .await(function (err, data2011, data2016) {
    /* geo-magic goes here... */
  });
