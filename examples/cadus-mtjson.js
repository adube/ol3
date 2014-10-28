// NOCOMPILE
// This example uses the GMapx v3 API, which we do not have an exports file for.
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.control.GoogleMapsAddresses');
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

var view = new ol.View();
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

var directionsPanel = new ol.control.GoogleMapsDirectionsPanel({
  'target': 'gmaps-directions-panel',
  'arroundText': 'environ',
  'suggestedRoutesText': 'Routes suggérées',
  'totalDistanceText': 'Distance Totale',
  'copyrightText': 'Données cartographiques ©2014 Google'
});

var olAdresses = new ol.control.GoogleMapsAddresses({
  'enableCurrentPosition': false,
  'getURL': 'data/cadus/addresses.json'
});

var directions = new ol.control.GoogleMapsDirections({
  'gmap': gmap,
  'target': 'gmaps-directions',
  'addressesControl': olAdresses,
  'geocoderComponentRestrictions': {'country': 'CA'},
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

var directionEl = document.getElementById('directions-json');
var queryParamsEl = document.getElementById('queryparams-json');
directions.on(
    ol.control.GoogleMapsDirections.EventType.CLEAR,
    function(evt) {
      directionEl.value = '';
      queryParamsEl.value = '';
    }
);
directions.on(
    ol.control.GoogleMapsDirections.EventType.ROUTECOMPLETE,
    function(evt) {
      directionEl.value = directions.save();
    }
);
directions.on(
    ol.control.GoogleMapsDirections.EventType.SELECT,
    function(evt) {
      directionEl.value = directions.save();
    }
);
directions.on(
    ol.control.GoogleMapsDirections.EventType.QUERYPARAMSCHANGE,
    function(evt) {
      queryParamsEl.value = directions.saveQueryParams();
    }
);

var load = function() {
  var config = {
    'r': [
      {
        's': 'Dummy route',
        'c': [[-7913421, 6176034], [-7907554, 6177486]],
        'o': [1, 0],
        'l': [
          {
            'd': {'v': 10, 't': '10m'},
            'r': {'v': 540, 't': '9 minutes'},
            's': [-7913421, 6176034],
            'e': [-7907554, 6177486],
            't': 'Start Address',
            'n': 'End Address',
            'p': [
              {
                'c': [[-7913421, 6176034], [-7913421, 6176034]],
                's': [-7913421, 6176034],
                'i': 'Turn left on this street',
                'm': 'turn-left',
                'd': {'v': 5, 't': '5m'}
              },
              {
                'c': [[-7907554, 6177486], [-7907554, 6177486]],
                's': [-7907554, 6177486],
                'i': 'Arrival',
                'm': '',
                'd': {'v': 4, 't': '4m'}
              }
            ]
          }
        ]
      }
    ],
    's': {
      'n': 'Mon point de départ',
      'c': [-7913421, 6176034]
    },
    'e': {
      'n': 'Mon point d\'arrivée',
      'c': [-7907554, 6177486]
    },
    'w': [
      {
        'n': 'Un waypoint',
        'c': [-7911921, 6175661]
      },
      {
        'n': 'Un second waypoint',
        'c': [-7911185, 6177906]
      }
    ],
    'd': [
      [-7911233, 6178604]
    ],
    'm': ['driving', 'carpooling', 'walking']
  };

  directions.load(config);
};

var save = function() {
  var serializedJSON = directions.save();
  if (goog.isDefAndNotNull(serializedJSON)) {
    window.console.log(serializedJSON);
  }
};

var loadQueryParams = function() {
  var config = {
    'r': [],
    's': {
      'n': 'Mon point de départ',
      'c': [-7913421, 6176034]
    },
    'e': {
      'n': 'Mon point d\'arrivée',
      'c': [-7907554, 6177486]
    },
    'w': [
      {
        'n': 'Un waypoint',
        'c': [-7911921, 6175661]
      },
      {
        'n': 'Un second waypoint',
        'c': [-7911185, 6177906]
      }
    ],
    'd': [
      [-7911233, 6178604]
    ],
    'm': ['driving', 'carpooling', 'walking']
  };

  directions.loadQueryParams(config);
};

var saveQueryParams = function() {
  var serializedJSON = directions.saveQueryParams();
  if (goog.isDefAndNotNull(serializedJSON)) {
    window.console.log(serializedJSON);
  }
};

var loadRoute = function() {

  var config = {
    'mt_favori': {
      'mt_status': 'none',
      'mt_url': '/trajet/favori/ajouter'
    },
    'mt_usager': {
      'mt_last_name': 'Dubé Conducteur',
      'mt_id': 25,
      'mt_contact': '/usager/communiquer/25/',
      'mt_photo': '/static/img/defaut_photo.jpg',
      'mt_first_name': 'Alexandre',
      'mt_evaluation': 4,
      'mt_url': '/usager/afficher/25/'
    },
    'mt_anonymous': false,
    'mt_offre': {
      'mt_fume': 0,
      'mt_prix': '0,00 $',
      'mt_duration_diff': 0.09322191451270656,
      'mt_distance_diff': '',
      'mt_heure': '',
      'mt_horaire_retour_reg': true,
      'mt_horaire_ponctuelle': 0,
      'mt_places_dispo': 1,
      'mt_end_address': '1000 Boulevard Talbot, Chicoutimi, QC G7H, Canada',
      'mt_mode_offre': true,
      'mt_id': 142,
      'mt_horaire_aller': 'Lun à ven de 08:00:00',
      'mt_offer_name': 'carrière-stroch',
      'mt_date': '',
      'mt_horaire_aller_reg': true,
      'mt_atmosphere': 0,
      'mt_horaire_irr_url': '',
      'mt_start_address': '130 Rue Gilbert, Chicoutimi, QC G7J 1R7, Canada',
      'mt_est_conducteur': 1,
      'mt_horaire_retour': 'Lun à ven de 17:00:00'
    },
    'mt_organisations': [
      {
        'mt_logo': '',
        'mt_name': 'test',
        'mt_status': '',
        'mt_url': '/organisation/afficher/17/'
      },
      {
        'mt_logo': '',
        'mt_name': 'test2',
        'mt_status': '',
        'mt_url': '/organisation/afficher/18/'
      }
    ],
    'coordinates': [
      [
        -7911826.31566098,
        6177519.71212946
      ],
      [
        -7911842.21803173,
        6177518.9569751
      ],
      [
        -7911868.40037597,
        6177520.58409544
      ],
      [
        -7911918.66112606,
        6177523.7376904
      ],
      [
        -7911973.59729477,
        6177535.68110314
      ],
      [
        -7912006.16937777,
        6177558.91377276
      ],
      [
        -7912042.87141389,
        6177535.68110314
      ],
      [
        -7912116.4758612,
        6177541.5521689
      ],
      [
        -7912123.53351692,
        6177502.40062389
      ],
      [
        -7912124.07898242,
        6177468.80156215
      ],
      [
        -7912121.69674532,
        6177432.97165517
      ],
      [
        -7912104.9765578,
        6177406.68642122
      ],
      [
        -7912093.34367101,
        6177399.10447983
      ],
      [
        -7912003.15261957,
        6177340.3446627
      ],
      [
        -7911987.62355061,
        6177359.45036526
      ],
      [
        -7911958.95878173,
        6177377.36514546
      ],
      [
        -7911880.1334503,
        6177386.92641995
      ],
      [
        -7911828.29196343,
        6177371.9974171
      ],
      [
        -7911816.25832648,
        6177362.97293143
      ],
      [
        -7911749.03248599,
        6177314.94873804
      ],
      [
        -7911709.79236548,
        6177299.4830931
      ],
      [
        -7911673.9586214,
        6177285.37616811
      ],
      [
        -7911388.91393327,
        6177259.0410674
      ],
      [
        -7911244.39897032,
        6177246.96385096
      ],
      [
        -7911071.60885672,
        6177232.53830931
      ],
      [
        -7910436.09701573,
        6177175.80926476
      ],
      [
        -7910344.20277608,
        6177153.13117159
      ],
      [
        -7910270.40908563,
        6177119.31542872
      ],
      [
        -7910218.08892496,
        6177080.63548252
      ],
      [
        -7910177.13448429,
        6177035.1456749
      ],
      [
        -7910035.66967539,
        6176815.98616078
      ],
      [
        -7910032.36348652,
        6176810.283325
      ],
      [
        -7909830.66370115,
        6176462.36723775
      ],
      [
        -7909823.00492018,
        6176449.15063113
      ],
      [
        -7909813.38691618,
        6176433.01566451
      ],
      [
        -7909793.21582445,
        6176447.65789384
      ],
      [
        -7909734.53932085,
        6176501.69850429
      ],
      [
        -7909731.23313197,
        6176505.67357203
      ],
      [
        -7909698.36048634,
        6176545.07212841
      ],
      [
        -7909675.45093513,
        6176582.72651695
      ],
      [
        -7909604.75192653,
        6176524.57613469
      ],
      [
        -7909593.28601898,
        6176511.19170711
      ],
      [
        -7909538.82852408,
        6176444.32020132
      ],
      [
        -7909526.40526891,
        6176444.32020132
      ],
      [
        -7909451.87686983,
        6176473.94017154
      ],
      [
        -7909427.9877071,
        6176492.08790515
      ],
      [
        -7909344.62054045,
        6176602.2162925
      ],
      [
        -7909163.39240944,
        6176481.48774552
      ],
      [
        -7909058.83001173,
        6176411.9329111
      ],
      [
        -7908944.30451961,
        6176334.74733266
      ],
      [
        -7909352.51208009,
        6175741.37672016
      ]
    ],
    'summary': 'Alexandre Dubé Conducteur',
    'waypoint_order': [],
    'mt_corresponding': 1,
    'legs': [
      {
        'distance': {
          'text': '3.3 km',
          'value': 3340.19417939006
        },
        'start_coordinate': [
          -7911826.31566098,
          6177519.71212946
        ],
        'end_address': '1000 Boulevard Talbot, Chicoutimi, QC G7H, Canada',
        'end_coordinate': [
          -7909352.51208009,
          6175741.37672016
        ],
        'start_address': '130 Rue Gilbert, Chicoutimi, QC G7J 1R7, Canada',
        'steps': [
          {
            'distance': {
              'text': '3.3 km',
              'value': 3340.19417939006
            },
            'start_coordinate': [
              -7911826.31566098,
              6177519.71212946
            ],
            'maneuver': '',
            'coordinates': [
              [
                -7911826.31566098,
                6177519.71212946
              ],
              [
                -7909352.51208009,
                6175741.37672016
              ]
            ],
            'travel_mode': 'carpooling',
            'instructions': 'Prenez le covoiturage en direction de 1000...'
          }
        ],
        'duration': {
          'text': '203 secondes',
          'value': 203
        }
      }
    ],
    'mt_weight': 1205.0582538170179,
    'mt_org': [
      'test',
      'test2'
    ]
  };

  directions.loadRoute(config);
};
