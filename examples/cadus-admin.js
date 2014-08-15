goog.require('goog.events');
// NOCOMPILE
// This example uses the GMapx v3 API, which we do not have an exports file for.
goog.require('ol.Feature');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.control.LayerSwitcher');
goog.require('ol.control.SingleDraw');
goog.require('ol.extent');
goog.require('ol.geom.Point');
goog.require('ol.geom.Polygon');
goog.require('ol.interaction');
goog.require('ol.interaction.DragPan');
goog.require('ol.layer.Vector');
goog.require('ol.proj');
goog.require('ol.source.Vector');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');


var generateRandomFeatures = function(numFeatures, extent) {
  var bottomLeft = ol.extent.getBottomLeft(extent);
  var topRight = ol.extent.getTopRight(extent);
  var left = bottomLeft[0];
  var bottom = bottomLeft[1];
  var right = topRight[0];
  var top = topRight[1];

  var deltaX = right - left;
  var deltaY = top - bottom;

  var x, y;
  var features = [];

  for (var i = 0; i < numFeatures; i++) {
    x = left + (Math.random() * deltaX);
    y = bottom + (Math.random() * deltaY);
    features.push(new ol.Feature(new ol.geom.Point([x, y])));
  }

  return features;
};


var gmap = new google.maps.Map(document.getElementById('gmap'), {
  disableDefaultUI: true,
  keyboardShortcuts: false,
  draggable: false,
  disableDoubleClickZoom: true,
  scrollwheel: false,
  streetViewControl: false
});

var view = new ol.View({
  maxZoom: 21 // to fix google maps num zoom levels
});
view.on('change:center', function() {
  var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
  gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
});
view.on('change:resolution', function() {
  gmap.setZoom(view.getZoom());
});

var extentForPoints = [-7987726, 6145555, -7832711, 6206704];
var numFeatures = 50;

var styleDep = new ol.style.Style({
  fill: new ol.style.Fill({color: 'rgba(0, 170, 0, 0.2)'}),
  stroke: new ol.style.Stroke({color: '#00AA00', width: 1})
});

var styleArr = new ol.style.Style({
  fill: new ol.style.Fill({color: 'rgba(255, 0, 0, 0.2)'}),
  stroke: new ol.style.Stroke({color: '#FF0000', width: 1})
});

var sourceOne = new ol.source.Vector();
sourceOne.addFeatures(generateRandomFeatures(numFeatures, extentForPoints));
var vectorOne = new ol.layer.Vector({
  source: sourceOne,
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: styleDep.getFill(),
      stroke: styleDep.getStroke()
    })
  })
});

//Layer will not show up in layer switcher if name is not defined.
vectorOne.set('name', 'Vector one');

var sourceTwo = new ol.source.Vector();
sourceTwo.addFeatures(generateRandomFeatures(numFeatures, extentForPoints));
var vectorTwo = new ol.layer.Vector({
  source: sourceTwo,
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: styleArr.getFill(),
      stroke: styleArr.getStroke()
    })
  })
});

//Layer will not show up in layer switcher if name is not defined.
vectorTwo.set('name', 'Vector two');

var olMapDiv = document.getElementById('olmap');
var map = new ol.Map({
  layers: [vectorOne, vectorTwo],
  interactions: ol.interaction.defaults({
    altShiftDragRotate: false,
    dragPan: false,
    touchRotate: false
  }).extend([
    new ol.interaction.DragPan({kinetic: false})
  ]),
  renderer: 'canvas',
  target: olMapDiv,
  view: view
});
view.setCenter([-7910219, 6176130]);
view.setZoom(10);

olMapDiv.parentNode.removeChild(olMapDiv);
gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);

map.addControl(new ol.control.LayerSwitcher({
  className: 'ol-layerswitcher',
  layers: [vectorOne, vectorTwo]
}));

var singleDraws = [];
var styles = [styleDep, styleArr];

for (var i = 0; i < 2; i++) {
  singleDraws[i] = new ol.control.SingleDraw({
    style: styles[i],
    className: 'ol-singledraw-' + (i + 1),
    interaction: 'polygon'
  });

  map.addControl(singleDraws[i]);
  this.singleDraws[i].on(
      ol.control.SingleDraw.EventType.ACTIVATED,
      disableOtherSingleDraw
  );
}

function disableOtherSingleDraw(evt) {
  if (evt.target == singleDraws[0])
    singleDraws[1].stopDrawing();
  else
    singleDraws[0].stopDrawing();
}

function loadPolygon() {
  var extent = extentForPoints;
  var geometry = new ol.geom.Polygon([[
    ol.extent.getBottomLeft(extent),
    ol.extent.getTopLeft(extent),
    ol.extent.getTopRight(extent),
    ol.extent.getBottomRight(extent)
  ]]);
  singleDraws[0].loadPolygon(geometry);
}
