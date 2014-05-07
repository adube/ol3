// NOCOMPILE
// This example uses the GMapx v3 API, which we do not have an exports file for.
goog.require('ol.Map');
goog.require('ol.View2D');
goog.require('ol.control.GoogleMapsAddresses');
goog.require('ol.control.GoogleMapsCurrentPosition');
goog.require('ol.control.GoogleMapsDirections');
goog.require('ol.control.GoogleMapsDirectionsPanel');
goog.require('ol.interaction');
goog.require('ol.interaction.DragPan');
goog.require('ol.interaction.DragStyleCursor');
goog.require('ol.layer.Vector');
goog.require('ol.proj');
goog.require('ol.source.GeoJSON');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');
goog.require('ol.style.Icon');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');
goog.require('ol.style.Text');



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

var createDetourIconStyle = function() {
  return function(resolution) {
    var style = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({color: 'white'}),
        stroke: new ol.style.Stroke({color: 'black', width: 2})
      }),
      text: new ol.style.Text({
        fill: new ol.style.Fill({color: 'red'}),
        font: 'bold 14px Arial',
        offsetX: 8,
        offsetY: -3,
        stroke: new ol.style.Stroke({color: 'black', width: 2}),
        text: this.getProperties().myLabel,
        textAlign: 'left',
        textBaseline: 'bottom'
      })
    });
    return [style];
  };
};

var olCurrentPosition = new ol.control.GoogleMapsCurrentPosition({
  'geocoderComponentRestrictions': {'country': 'CA'},
  'currentPositionText': 'Ma position'
});

var olAdresses = new ol.control.GoogleMapsAddresses({
  'enableCurrentPosition': false,
  'getURL': 'data/cadus/addresses.json'
});

var directionsPanel = new ol.control.GoogleMapsDirectionsPanel({
  'target': 'gmaps-directions-panel',
  'arroundText': 'environ',
  'suggestedRoutesText': 'Routes suggérées',
  'totalDistanceText': 'Distance Totale',
  'copyrightText': 'Données cartographiques ©2014 Google'
});

var directions = new ol.control.GoogleMapsDirections({
  'gmap': gmap,
  'target': 'gmaps-directions',
  'addressesControl': olAdresses,
  'enableCurrentPosition': true,
  'enableDetours': true,
  'currentPositionControl': olCurrentPosition,
  'geocoderComponentRestrictions': {'country': 'CA'},
  'getURL': 'data/cadus/addresses.json',
  'addWaypointButtonText': 'Ajouter un point',
  'currentPositionText': 'Ma position',
  'searchButtonText': 'Rechercher',
  'clearButtonText': 'Effacer',
  'reverseButtonText': 'Inverser',
  'removeButtonText': 'Supprimer',
  'myAddressesText': 'Mes adresses',
  'myTravelModesText': 'Mes modes de transport',
  'lineStyle': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: [80, 140, 255, 0.6],
      width: 6
    })
  }),
  'iconStyles': new Array(
      new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: 'data/icon1.png'
        }))
      }),
      new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: 'data/icon2.png'
        }))
      }),
      new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: 'data/icon3.png'
        }))
      }),
      new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: 'data/icon4.png'
        }))
      }),
      new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: 'data/icon5.png'
        }))
      }),
      new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: 'data/icon6.png'
        }))
      }),
      new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: 'data/icon7.png'
        }))
      }),
      new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: 'data/icon8.png'
        }))
      }),
      new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: 'data/icon9.png'
        }))
      }),
      new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: 'data/icon10.png'
        }))
      })
  ),
  'detourLabelProperty': 'myLabel',
  'detourIconStyle': createDetourIconStyle(),
  'directionsPanel': directionsPanel,
  'popupPixelBuffer': 150
});
map.addControl(directions);
