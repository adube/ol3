goog.provide('ol.control.GoogleMapsDirections');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('ol.Collection');
goog.require('ol.Feature');
goog.require('ol.MapBrowserEvent.EventType');
goog.require('ol.Object');
goog.require('ol.View2D');
goog.require('ol.control.Control');
goog.require('ol.control.GoogleMapsDirectionsPanel');
goog.require('ol.control.GoogleMapsGeocoder');
goog.require('ol.css');
goog.require('ol.extent');
goog.require('ol.geom.LineString');
goog.require('ol.geom.Point');
goog.require('ol.interaction.DryModify');
goog.require('ol.layer.Vector');
goog.require('ol.proj');
goog.require('ol.source.Vector');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');


/**
 * @define {number} Default buffer size in pixels to apply to the extent of
 * the route or single geolocation when recentering the map view to it.
 */
ol.control.GOOGLEMAPSDIRECTIONS_PIXEL_BUFFER = 30;


/**
 * @define {number} Default number of milliseconds to wait before launching
 * a route request that includes waypoint that has been dragged, whether
 * to add a new detour or to modify an existing waypoint of any type.
 */
ol.control.GOOGLEMAPSDIRECTIONS_ROUTE_DELAY_ON_WAYPOINT_DRAG = 300;


/**
 * @define {number} The maximum allowed waypoints.  Maps API for Business
 * customers are allowed 23 waypoints.
 */
ol.control.GOOGLEMAPSDIRECTIONS_MAX_WAYPOINTS = 8;


/**
 * @define {string} Default property name to use as label for detour features
 */
ol.control.GOOGLEMAPSDIRECTIONS_DETOUR_LABEL_PROPERTY = 'label';



/**
 * Todo
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.GoogleMapsDirectionsOptions=} opt_options Options.
 */
ol.control.GoogleMapsDirections = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  var classPrefix = 'ol-gmds';

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + ' ' + ol.css.CLASS_UNSELECTABLE
  });

  var addWaypointGeocoderButton = goog.dom.createDom(goog.dom.TagName.BUTTON, {
    'class': classPrefix + '-add-waypoint-button'
  });
  var addWaypointGeocoderButtonText = goog.dom.createTextNode('Add waypoint');
  goog.dom.appendChild(
      addWaypointGeocoderButton, addWaypointGeocoderButtonText);
  goog.dom.appendChild(element, addWaypointGeocoderButton);
  goog.events.listen(addWaypointGeocoderButton, [
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.CLICK
  ], this.handleAddWPGeocoderButtonPress_, false, this);

  var startGeocoderElement = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-geocoder-start'
  });
  goog.dom.appendChild(element, startGeocoderElement);

  var waypointGeocodersContainer = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-geocoder-waypoints'
  });
  goog.dom.appendChild(element, waypointGeocodersContainer);

  var endGeocoderElement = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-geocoder-end'
  });
  goog.dom.appendChild(element, endGeocoderElement);


  /**
   * @type {Object}
   * @private
   */
  this.geocoderComponentRestrictions_ = goog.isDef(
      options.geocoderComponentRestrictions) ?
      options.geocoderComponentRestrictions : {};


  /**
   * @type {ol.style.Style}
   * @private
   */
  this.startIconStyle_ = options.startIconStyle;


  /**
   * @type {ol.style.Style}
   * @private
   */
  this.endIconStyle_ = options.endIconStyle;


  /**
   * User provided style for lines.
   * @type {Array.<(null|ol.style.Style)>|null|ol.feature.FeatureStyleFunction|ol.style.Style}
   * @private
   */
  this.lineStyle_ = options.lineStyle;


  /**
   * User provided style for detour icons.
   * @type {Array.<(null|ol.style.Style)>|null|ol.feature.FeatureStyleFunction|ol.style.Style}
   * @private
   */
  this.detourIconStyle_ = options.detourIconStyle;


  /**
   * @type {ol.Collection}
   * @private
   */
  this.waypointGeocoders_ = new ol.Collection();


  /**
   * @type {Element}
   * @private
   */
  this.waypointGeocodersContainer_ = waypointGeocodersContainer;


  /**
   * @type {?ol.layer.Vector}
   * @private
   */
  this.vectorLayer_ = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: []
    })
  });


  /**
   * @type {number}
   * @private
   */
  this.pixelBuffer_ = goog.isDefAndNotNull(options.pixelBuffer) ?
      options.pixelBuffer : ol.control.GOOGLEMAPSDIRECTIONS_PIXEL_BUFFER;


  /**
   * @type {ol.Collection}
   * @private
   */
  this.routeFeatures_ = new ol.Collection();


  /**
   * @type {?number}
   * @private
   */
  this.newDetourTimerId_ = null;


  /**
   * @type {ol.Collection}
   * @private
   */
  this.detourFeatures_ = new ol.Collection();


  /**
   * @type {number}
   * @private
   */
  this.routeDelayOnWaypointDrag_ =
      goog.isDef(options.routeDelayOnWaypointDrag) ?
      options.routeDelayOnWaypointDrag :
      ol.control.GOOGLEMAPSDIRECTIONS_ROUTE_DELAY_ON_WAYPOINT_DRAG;


  /**
   * @type {number}
   * @private
   */
  this.maxWaypoints_ = goog.isDef(options.maxWaypoints) ?
      options.maxWaypoints :
      ol.control.GOOGLEMAPSDIRECTIONS_MAX_WAYPOINTS;


  /**
   * @type {ol.interaction.DryModify}
   * @private
   */
  this.dryModify_ = new ol.interaction.DryModify({
    features: this.routeFeatures_,
    pixelTolerance: goog.isDef(options.modifyPixelTolerance) ?
        options.modifyPixelTolerance : 8,
    style: [
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({color: 'white'}),
          stroke: new ol.style.Stroke({color: 'black', width: 2})
        })
      })
    ]
  });


  /**
   * @type {boolean}
   * @private
   */
  this.createNewDetour_ = true;


  /**
   * @type {?ol.Feature}
   * @private
   */
  this.lastDetourFeatureOverPointer_ = null;


  /**
   * @type {string}
   * @private
   */
  this.detourLabelProperty_ = goog.isDef(options.detourLabelProperty) ?
      options.detourLabelProperty :
      ol.control.GOOGLEMAPSDIRECTIONS_DETOUR_LABEL_PROPERTY;


  /**
   * @type {ol.control.GoogleMapsDirectionsPanel}
   * @private
   */
  this.directionsPanel_ = new ol.control.GoogleMapsDirectionsPanel({
    target: options.panel,
    pixelBuffer: this.pixelBuffer_,
    cornerPixelSize: goog.isDef(options.cornerPixelSize) ?
        (options.cornerPixelSize) : undefined
  });


  goog.base(this, {
    element: element,
    target: options.target
  });


  /**
   * @type {google.maps.DirectionsService}
   * @private
   */
  this.directionsService_ = new google.maps.DirectionsService();


  /**
   * @type {ol.control.GoogleMapsGeocoder}
   * @private
   */
  this.startGeocoder_ = new ol.control.GoogleMapsGeocoder({
    'enableReverseGeocoding': true,
    'target': startGeocoderElement,
    'geocoderComponentRestrictions': this.geocoderComponentRestrictions_,
    'iconStyle': this.startIconStyle_
  });


  /**
   * @type {ol.control.GoogleMapsGeocoder}
   * @private
   */
  this.endGeocoder_ = new ol.control.GoogleMapsGeocoder({
    'enableReverseGeocoding': false,
    'target': endGeocoderElement,
    'geocoderComponentRestrictions': this.geocoderComponentRestrictions_,
    'iconStyle': this.endIconStyle_
  });

  goog.events.listen(
      this.startGeocoder_,
      ol.Object.getChangeEventType(
          ol.control.GoogleMapsGeocoder.Property.LOCATION
      ),
      this.handleLocationChanged_, false, this);

  goog.events.listen(
      this.endGeocoder_,
      ol.Object.getChangeEventType(
          ol.control.GoogleMapsGeocoder.Property.LOCATION
      ),
      this.handleLocationChanged_, false, this);
};
goog.inherits(ol.control.GoogleMapsDirections, ol.control.Control);


/**
 * Add a new waypoint geocoder to the UI.
 */
ol.control.GoogleMapsDirections.prototype.addWaypointGeocoder = function() {

  if (!this.canAddAnOtherWaypoint_()) {
    // todo - show 'too many waypoints' message
    return;
  }

  var map = this.getMap();
  var container = this.waypointGeocodersContainer_;

  var geocoder = new ol.control.GoogleMapsGeocoder({
    'enableReverseGeocoding': false,
    'target': container,
    'geocoderComponentRestrictions': this.geocoderComponentRestrictions_,
    'iconStyle': this.startIconStyle_,
    'removable': true
  });

  map.addControl(geocoder);

  goog.events.listen(
      geocoder,
      ol.Object.getChangeEventType(
          ol.control.GoogleMapsGeocoder.Property.LOCATION
      ),
      this.handleLocationChanged_, false, this);

  goog.events.listen(
      geocoder,
      ol.control.GoogleMapsGeocoder.EventType.REMOVE,
      this.handleGeocoderRemove_, false, this);

  this.waypointGeocoders_.push(geocoder);

  this.toggleGeocoderReverseGeocodings_();

  this.manageNumWaypoints_();

};


/**
 * @private
 * @return {boolean}
 */
ol.control.GoogleMapsDirections.prototype.canAddAnOtherWaypoint_ = function() {
  var max = this.maxWaypoints_;
  var detourFeatures = this.detourFeatures_;
  var waypointGeocoders = this.waypointGeocoders_;

  var total = detourFeatures.getLength() + waypointGeocoders.getLength();

  return (total < max);
};


/**
 * @private
 */
ol.control.GoogleMapsDirections.prototype.clear_ = function() {

  var routeFeatures = this.routeFeatures_;
  routeFeatures.clear();

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);
  vectorSource.clear();

  this.directionsPanel_.clearDirections();
};


/**
 * @param {ol.Coordinate} coordinate
 * @private
 */
ol.control.GoogleMapsDirections.prototype.createOrUpdateDetour_ = function(
    coordinate) {

  var detourFeatures = this.detourFeatures_;
  var numDetourFeatures = detourFeatures.getLength();

  if (!this.canAddAnOtherWaypoint_()) {
    // todo - throw error
    return;
  }

  var feature = new ol.Feature({
    geometry: new ol.geom.Point(coordinate)
  });
  feature.setStyle(this.detourIconStyle_);

  if (this.createNewDetour_ == true) {
    this.createNewDetour_ = false;
  } else {
    detourFeatures.removeAt(numDetourFeatures - 1);
  }

  detourFeatures.push(feature);

  this.clear_();
  this.route_(null, null);

  this.manageNumWaypoints_();
};


/**
 * @private
 */
ol.control.GoogleMapsDirections.prototype.drawRoute_ = function() {

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);

  var features = [];

  var routeFeatures = this.routeFeatures_;
  var detourFeatures = this.detourFeatures_;

  // add route features
  routeFeatures.forEach(function(feature) {
    features.push(feature);
  }, this);

  // add detour features
  detourFeatures.forEach(function(feature) {
    features.push(feature);
  }, this);

  // add features to layer
  vectorSource.addFeatures(features);
};


/**
 * Fix map view extent to include coordinate if coordinate is outside
 * extent.
 * @param {ol.Coordinate} coordinate in map view projection
 * @private
 */
ol.control.GoogleMapsDirections.prototype.fitViewExtentToCoordinate_ =
    function(coordinate) {

  var map = this.getMap();

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var size = map.getSize();
  goog.asserts.assertArray(size);

  var extent = view2D.calculateExtent(size);

  var resolution = view2D.getResolutionForExtent(extent, size);
  var pixelBuffer = this.pixelBuffer_;
  var buffer = resolution * pixelBuffer;

  var smallExtent = ol.extent.buffer(extent, buffer * -1);

  if (!ol.extent.containsCoordinate(smallExtent, coordinate)) {
    ol.extent.extendCoordinate(extent, coordinate);
    extent = ol.extent.buffer(extent, buffer);
    view2D.fitExtent(extent, size);
  }
};


/**
 * Fix map view extent to route.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.fitViewExtentToRoute_ = function() {
  var map = this.getMap();

  var size = map.getSize();
  goog.asserts.assertArray(size);

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);
  var extent = vectorSource.getExtent();

  var resolution = view2D.getResolutionForExtent(extent, size);
  var pixelBuffer = this.pixelBuffer_;
  var buffer = resolution * pixelBuffer;
  extent = ol.extent.buffer(extent, buffer);

  view2D.fitExtent(extent, size);
};


/**
 * @param {ol.Pixel} pixel Pixel.
 * @return {?ol.Feature}
 * @private
 */
ol.control.GoogleMapsDirections.prototype.getDetourFeatureAtPixel_ = function(
    pixel) {

  var map = this.getMap();
  var detourFeaturesArray = this.detourFeatures_.getArray();
  var feature = map.forEachFeatureAtPixel(
      pixel, function(feature, layer) {
        if (detourFeaturesArray.indexOf(feature) != -1) {
          return feature;
        }
      });

  return feature;
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleAddWPGeocoderButtonPress_ =
    function(event) {
  this.addWaypointGeocoder();
};


/**
 * @param {google.maps.DirectionsResult} response
 * @param {google.maps.DirectionsStatus} status
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleDirectionsResult_ = function(
    response, status) {

  var map = this.getMap();

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var projection = view2D.getProjection();

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);

  var lat, location, lng, transformedCoordinate;
  var feature;
  var coordinates;

  var routeFeatures = this.routeFeatures_;

  if (status == google.maps.DirectionsStatus.OK) {
    goog.array.forEach(response.routes, function(route) {
      coordinates = [];
      goog.array.forEach(route.overview_path, function(location) {
        lng = location.lng();
        lat = location.lat();
        transformedCoordinate = ol.proj.transform(
            [lng, lat], 'EPSG:4326', projection.getCode());
        coordinates.push(transformedCoordinate);
      }, this);
      feature = new ol.Feature(new ol.geom.LineString(coordinates));
      feature.setStyle(this.lineStyle_);
      routeFeatures.push(feature);
    }, this);

    // draw
    this.drawRoute_();

    // fit extent
    this.fitViewExtentToRoute_();

    // set directions in panel
    this.directionsPanel_.setDirections(response);
  }

};


/**
 * @param {Object|goog.events.Event|null|string} evt
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleDryModifyDrag_ = function(evt) {

  var me = this;
  var dryModify = evt.target;
  var coordinate = dryModify.coordinate_;

  if (goog.isDefAndNotNull(this.newDetourTimerId_)) {
    window.clearTimeout(this.newDetourTimerId_);
  }

  this.newDetourTimerId_ = window.setTimeout(function() {
    me.createOrUpdateDetour_(coordinate);
  }, this.routeDelayOnWaypointDrag_);

};


/**
 * @param {Object|goog.events.Event|null|string} evt
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleDryModifyDragEnd_ = function(
    evt) {
  this.createNewDetour_ = true;
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleGeocoderRemove_ = function(
    event) {

  var geocoder = event.target;
  goog.asserts.assertInstanceof(geocoder, ol.control.GoogleMapsGeocoder);

  this.removeWaypointGeocoder_(geocoder);

  this.manageNumWaypoints_();

  this.toggleGeocoderReverseGeocodings_();

  var startGeocoder = this.startGeocoder_;
  var endGeocoder = this.endGeocoder_;

  var startLocation = startGeocoder.getLocation();
  var endLocation = endGeocoder.getLocation();

  var geocoderLocation = geocoder.getLocation();

  // trigger a new routing request only if the removed geocoder had a location
  // and if there's a start and an end
  if (goog.isDefAndNotNull(geocoderLocation) &&
      goog.isDefAndNotNull(startLocation) &&
      goog.isDefAndNotNull(endLocation)) {

    this.clear_();

    this.route_(startLocation, endLocation);
  }
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleLocationChanged_ =
    function(event) {

  var currentGeocoder = event.target;
  var currentLocation = currentGeocoder.getLocation();

  var startGeocoder = this.startGeocoder_;
  var endGeocoder = this.endGeocoder_;

  var startLocation = startGeocoder.getLocation();
  var endLocation = endGeocoder.getLocation();

  this.clear_();
  this.toggleGeocoderReverseGeocodings_();

  if (goog.isDefAndNotNull(startLocation) &&
      goog.isDefAndNotNull(endLocation)) {
    this.route_(startLocation, endLocation);
  } else if (goog.isDefAndNotNull(currentLocation)) {
    this.fitViewExtentToCoordinate_(currentGeocoder.getCoordinate());
  }

};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleMapPointerMove_ = function(
    event) {

  var map = this.getMap();
  var detourFeatures = this.detourFeatures_;

  if (detourFeatures.getLength() > 0) {
    var pixel = map.getEventPixel(event.originalEvent);
    this.toggleDetourFeatureRemoveSymbol_(pixel);
  }
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleMapSingleClick_ = function(
    event) {

  this.removeDetourFeature_(event.pixel);
};


/**
 * @private
 */
ol.control.GoogleMapsDirections.prototype.manageNumWaypoints_ = function() {
  var map = this.getMap();
  var dryModify = this.dryModify_;

  if (this.canAddAnOtherWaypoint_()) {
    goog.events.listen(
        this.dryModify_,
        ol.interaction.DryModify.EventType.DRAG,
        this.handleDryModifyDrag_, false, this);
    goog.events.listen(
        this.dryModify_,
        ol.interaction.DryModify.EventType.DRAGEND,
        this.handleDryModifyDragEnd_, false, this);

    if (!goog.isDefAndNotNull(dryModify.getMap())) {
      map.addInteraction(dryModify);
    }
  } else {
    goog.events.unlisten(
        this.dryModify_,
        ol.interaction.DryModify.EventType.DRAG,
        this.handleDryModifyDrag_, false, this);
    goog.events.unlisten(
        this.dryModify_,
        ol.interaction.DryModify.EventType.DRAGEND,
        this.handleDryModifyDragEnd_, false, this);
  }
};


/**
 * @private
 */
ol.control.GoogleMapsDirections.prototype.removeAllWaypointGeocoders_ =
    function() {
  var geocoder;
  while (this.waypointGeocoders_.getLength() > 0) {
    geocoder = this.waypointGeocoders_.getAt(0);
    goog.asserts.assertInstanceof(geocoder, ol.control.GoogleMapsGeocoder);
    this.removeWaypointGeocoder_(geocoder);
  }
};


/**
 * @param {ol.Pixel} pixel Pixel.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.removeDetourFeature_ =
    function(pixel) {

  var feature = this.getDetourFeatureAtPixel_(pixel);
  var detourFeatures = this.detourFeatures_;

  if (goog.isDefAndNotNull(feature)) {
    detourFeatures.remove(feature);
    this.lastDetourFeatureOverPointer_ = null;
    this.clear_();
    this.toggleGeocoderReverseGeocodings_();
    this.route_(null, null);
  }

};


/**
 * @param {ol.control.GoogleMapsGeocoder} geocoder Waypoint geocoder to remove.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.removeWaypointGeocoder_ = function(
    geocoder) {

  var map = this.getMap();

  map.removeControl(geocoder);

  goog.events.unlisten(
      geocoder,
      ol.Object.getChangeEventType(
          ol.control.GoogleMapsGeocoder.Property.LOCATION
      ),
      this.handleLocationChanged_, false, this);

  goog.events.unlisten(
      geocoder,
      ol.control.GoogleMapsGeocoder.EventType.REMOVE,
      this.handleGeocoderRemove_, false, this);

  this.waypointGeocoders_.remove(geocoder);
};


/**
 * @param {?google.maps.LatLng|undefined} start Location
 * @param {?google.maps.LatLng|undefined} end Location
 * @private
 */
ol.control.GoogleMapsDirections.prototype.route_ = function(start, end) {

  var me = this;
  var service = this.directionsService_;

  start = (goog.isDefAndNotNull(start)) ?
      start : this.startGeocoder_.getLocation();
  end = (goog.isDefAndNotNull(end)) ?
      end : this.endGeocoder_.getLocation();

  if (!goog.isDefAndNotNull(start) || !goog.isDefAndNotNull(end)) {
    // todo: throw error
    return;
  }

  var map = this.getMap();

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var projection = view2D.getProjection();

  var reqWaypoints = [];
  var detourFeatures = this.detourFeatures_;
  var detourLocation;
  var waypointGeocoders = this.waypointGeocoders_;
  var waypointLocation;

  waypointGeocoders.forEach(function(waypointGeocoder) {
    waypointLocation = waypointGeocoder.getLocation();
    if (goog.isDefAndNotNull(waypointLocation)) {
      reqWaypoints.push({
        location: waypointLocation,
        stopover: true
      });
    }
  }, this);

  detourFeatures.forEach(function(feature) {
    detourLocation = ol.proj.transform(
        feature.getGeometry().getCoordinates(),
        projection.getCode(), 'EPSG:4326');
    reqWaypoints.push({
      location: new google.maps.LatLng(detourLocation[1], detourLocation[0]),
      stopover: false
    });
  }, this);

  var request = {
    origin: start,
    destination: end,
    waypoints: reqWaypoints,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING
  };

  service.route(request, function(response, status) {
    me.handleDirectionsResult_(response, status);
  });
};


/**
 * @inheritDoc
 */
ol.control.GoogleMapsDirections.prototype.setMap = function(map) {

  var myMap = this.getMap();
  if (goog.isNull(map) && !goog.isNull(myMap)) {
    myMap.removeLayer(this.vectorLayer_);
    myMap.removeControl(this.startGeocoder_);
    myMap.removeControl(this.endGeocoder_);
    myMap.removeControl(this.directionsPanel_);

    goog.events.unlisten(
        myMap,
        ol.MapBrowserEvent.EventType.POINTERMOVE,
        this.handleMapPointerMove_, false, this);

    goog.events.unlisten(
        myMap,
        ol.MapBrowserEvent.EventType.SINGLECLICK,
        this.handleMapSingleClick_, false, this);

    this.removeAllWaypointGeocoders_();
  }

  goog.base(this, 'setMap', map);

  if (!goog.isNull(map)) {
    map.addLayer(this.vectorLayer_);
    map.addControl(this.startGeocoder_);
    map.addControl(this.endGeocoder_);
    map.addControl(this.directionsPanel_);
    this.manageNumWaypoints_();

    goog.events.listen(
        map,
        ol.MapBrowserEvent.EventType.POINTERMOVE,
        this.handleMapPointerMove_, false, this);

    goog.events.listen(
        map,
        ol.MapBrowserEvent.EventType.SINGLECLICK,
        this.handleMapSingleClick_, false, this);
  }
};


/**
 * @param {ol.Pixel} pixel Pixel.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.toggleDetourFeatureRemoveSymbol_ =
    function(pixel) {

  var labelProperty = this.detourLabelProperty_;
  var feature = this.getDetourFeatureAtPixel_(pixel);
  var lastFeature = this.lastDetourFeatureOverPointer_;

  // clear last label, if required
  if (goog.isDefAndNotNull(lastFeature) &&
      (!goog.isDefAndNotNull(feature) || feature != lastFeature)) {
    lastFeature.set(labelProperty, '');
    this.lastDetourFeatureOverPointer_ = null;
  }

  // set new label, if required
  if (goog.isDefAndNotNull(feature) && !goog.isDefAndNotNull(lastFeature)) {
    feature.set(labelProperty, 'X');
    this.lastDetourFeatureOverPointer_ = feature;
  }
};


/**
 * @private
 */
ol.control.GoogleMapsDirections.prototype.toggleGeocoderReverseGeocodings_ =
    function() {

  var startGeocoder = this.startGeocoder_;
  var endGeocoder = this.endGeocoder_;
  var waypointGeocoders = this.waypointGeocoders_;

  var startLocation = startGeocoder.getLocation();
  var endLocation = endGeocoder.getLocation();
  var waypointLocation;

  var nullWaypointLocationFound = false;

  if (!goog.isDefAndNotNull(startLocation)) {
    // enable start, disable the others
    startGeocoder.enableReverseGeocoding();
    endGeocoder.disableReverseGeocoding();
    waypointGeocoders.forEach(function(waypointGeocoders) {
      waypointGeocoders.disableReverseGeocoding();
    }, this);
  } else if (!goog.isDefAndNotNull(endLocation)) {
    // enable first null waypoint found OR end if none was found, disable
    // all the others
    startGeocoder.disableReverseGeocoding();

    waypointGeocoders.forEach(function(waypointGeocoder) {
      waypointLocation = waypointGeocoder.getLocation();
      if (!goog.isDefAndNotNull(waypointLocation) &&
          !nullWaypointLocationFound) {
        nullWaypointLocationFound = true;
        waypointGeocoder.enableReverseGeocoding();
      } else {
        waypointGeocoder.disableReverseGeocoding();
      }
    }, this);

    if (nullWaypointLocationFound) {
      endGeocoder.disableReverseGeocoding();
    } else {
      endGeocoder.enableReverseGeocoding();
    }

  } else {
    // enable first null waypoint found if one is found, disable
    // all the others
    startGeocoder.disableReverseGeocoding();
    endGeocoder.disableReverseGeocoding();
    waypointGeocoders.forEach(function(waypointGeocoder) {
      waypointLocation = waypointGeocoder.getLocation();
      if (!goog.isDefAndNotNull(waypointLocation) &&
          !nullWaypointLocationFound) {
        nullWaypointLocationFound = true;
        waypointGeocoder.enableReverseGeocoding();
      } else {
        waypointGeocoder.disableReverseGeocoding();
      }
    }, this);
  }

};
