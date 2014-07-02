// NOCOMPILE
// This example uses the GMapx v3 API, which we do not have an exports file for.
goog.require('ol.Map');
goog.require('ol.View2D');
goog.require('ol.control.GoogleMapsDirectionsPanel');
goog.require('ol.control.MTSearch');
goog.require('ol.interaction');
goog.require('ol.interaction.DragPan');
goog.require('ol.interaction.DragStyleCursor');
goog.require('ol.layer.Vector');
goog.require('ol.proj');
goog.require('ol.source.GeoJSON');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');



var gmap = new google.maps.Map(document.getElementById('gmap'), {
  disableDefaultUI: true,
  keyboardShortcuts: false,
  draggable: false,
  disableDoubleClickZoom: true,
  scrollwheel: false,
  streetViewControl: false
});

var view = new ol.View2D();
view.on('change:center', function() {
  var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
  gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
});
view.on('change:resolution', function() {
  gmap.setZoom(view.getZoom());
});

var vector = new ol.layer.Vector({
  source: new ol.source.GeoJSON(({
    object: {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3857'
        }
      },
      'features': []
    }
  })),
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.6)'
    }),
    stroke: new ol.style.Stroke({
      color: '#319FD3',
      width: 1
    })
  })
});

var olMapDiv = document.getElementById('olmap');
var map = new ol.Map({
  layers: [vector],
  interactions: ol.interaction.defaults({
    altShiftDragRotate: false,
    dragPan: false,
    touchRotate: false
  }).extend([
    new ol.interaction.DragPan({kinetic: false}),
    new ol.interaction.DragStyleCursor()
  ]),
  renderer: 'canvas',
  target: olMapDiv,
  view: view
});
view.setCenter([-7910219, 6176130]);
view.setZoom(14);

olMapDiv.parentNode.removeChild(olMapDiv);
gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);

var directionsPanel = new ol.control.GoogleMapsDirectionsPanel({
  'limit': 2,
  'mode': ol.control.GoogleMapsDirectionsPanel.Mode.COMPLEX,
  'target': 'gmaps-directions-panel',
  'arroundText': 'environ',
  'contactText': 'Contacter',
  'copyrightText': 'Données cartographiques ©2014 Google',
  'fromText': 'De',
  'pathDetailsText': 'Détail du trajet',
  'ponctualText': 'Ponctuel',
  'recurringText': 'Récurrent',
  'showMoreText': 'Voir plus de résultats',
  'suggestedRoutesText': 'Routes suggérées',
  'toText': 'À',
  'totalDistanceText': 'Distance Totale'
});

var mtSearch = new ol.control.MTSearch({
  'target': 'gmaps-directions'
});
map.addControl(mtSearch);

var triggerRequest = function() {
  //directions.triggerRouteRequest();
};
