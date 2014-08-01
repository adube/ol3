<<<<<<< HEAD
goog.require('ol.Feature');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.geom.Point');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Vector');
goog.require('ol.source.Cluster');
=======
goog.require('ol.Map');
goog.require('ol.View2D');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Vector');
>>>>>>> 0ddf0df... preliminary version of clusters
goog.require('ol.source.MapQuest');
goog.require('ol.source.Vector');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');
<<<<<<< HEAD
goog.require('ol.style.Text');


var count = 20000;
var features = new Array(count);
var e = 4500000;
for (var i = 0; i < count; ++i) {
  var coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
  features[i] = new ol.Feature(new ol.geom.Point(coordinates));
}

var source = new ol.source.Vector({
  features: features
});

var clusterSource = new ol.source.Cluster({
  distance: 40,
  source: source
});

var styleCache = {};
var clusters = new ol.layer.Vector({
  source: clusterSource,
  style: function(feature, resolution) {
    var size = feature.get('features').length;
    var style = styleCache[size];
    if (!style) {
      style = [new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          stroke: new ol.style.Stroke({
            color: '#fff'
          }),
          fill: new ol.style.Fill({
            color: '#3399CC'
          })
        }),
        text: new ol.style.Text({
          text: size.toString(),
          fill: new ol.style.Fill({
            color: '#fff'
          })
        })
      })];
      styleCache[size] = style;
    }
    return style;
  }
});

var raster = new ol.layer.Tile({
  source: new ol.source.MapQuest({layer: 'sat'})
});

var raw = new ol.layer.Vector({
  source: source
});

var map = new ol.Map({
  layers: [raster, clusters],
  renderer: 'canvas',
  target: 'map',
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});
=======
goog.require('ol.Cluster')

var raster = new ol.layer.Tile({
  source: new ol.source.MapQuest({layer: 'sat'})
});

var source = new ol.source.Vector();

var clusterSource = new ol.source.Vector();

var vector = new ol.layer.Vector({
  source: source,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33'
      })
    })
  })
});


var clusters = new ol.layer.Vector({
  source: clusterSource,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 12,
      fill: new ol.style.Fill({
        color: 'green'
      })
    })
  })
});

var map = new ol.Map({
  layers: [raster, clusters, vector],
  renderer: 'canvas',
  target: 'map',
  view: new ol.View2D({
    center: [0, 0],
    zoom: 4
  })
});

var resolution = map.getView().getView2D().getResolution();
var size = map.getSize();
var extent = map.getView().getView2D().calculateExtent(size);

var data = [];
for(var i = 0; i < 30; i++) {
  var x = Math.round(Math.random() * (90 - 0) + 0);
  var y = Math.round(Math.random() * (180 - 0) + 0);
  var coords = /** @type {ol.geom.RawPoint} */ ([x * resolution, y * resolution]);
  var geom = new ol.geom.Point(coords);
  var feature = new ol.Feature(geom);
  data.push(feature);
}
var clusterOptions = {
  'data': data
};

goog.events.listen(map, ol.MapEventType.MOVEEND, function(e) {
  window.console.log(e);
});

source.addFeatures(data);
var cluster = new ol.Cluster(clusterOptions);
cluster.cluster(extent, resolution);
window.console.log(cluster.clusters);
window.console.log(cluster.features);
clusterSource.addFeatures(cluster.features);
>>>>>>> 0ddf0df... preliminary version of clusters
