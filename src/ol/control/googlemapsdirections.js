goog.provide('ol.control.GoogleMapsDirections');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('ol.Collection');
goog.require('ol.Feature');
goog.require('ol.Object');
goog.require('ol.View2D');
goog.require('ol.control.Control');
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
 * a route request that includes a new waypoint.
 */
ol.control.GOOGLEMAPSDIRECTIONS_NEW_WAYPOINT_DELAY = 300;


/**
 * @define {number} The maximum allowed waypoints.  Maps API for Business
 * customers are allowed 23 waypoints.
 */
ol.control.GOOGLEMAPSDIRECTIONS_MAX_WAYPOINTS = 8;



/**
 * Todo
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.GoogleMapsDirectionsOptions=} opt_options Options.
 */
ol.control.GoogleMapsDirections = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  var className = 'ol-google-maps-directions';

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': className + ' ' + ol.css.CLASS_UNSELECTABLE
  });

  var startGeocoderElement = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': 'ol-google-maps-directions-geocoder-start'
  });
  goog.dom.appendChild(element, startGeocoderElement);

  var endGeocoderElement = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': 'ol-google-maps-directions-geocoder-end'
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
   * User provided style for waypoint icons.
   * @type {Array.<(null|ol.style.Style)>|null|ol.feature.FeatureStyleFunction|ol.style.Style}
   * @private
   */
  this.waypointIconStyle_ = options.waypointIconStyle;


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
  this.newWaypointTimerId_ = null;


  /**
   * @type {Array}
   * @private
   */
  this.waypoints_ = [];


  /**
   * @type {number}
   * @private
   */
  this.newWaypointDelay_ = goog.isDef(options.newWaypointDelay) ?
      options.newWaypointDelay :
      ol.control.GOOGLEMAPSDIRECTIONS_NEW_WAYPOINT_DELAY;


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

  goog.events.listen(
      this.dryModify_,
      ol.interaction.DryModify.EventType.DRAG,
      this.handleDryModifyDrag_, false, this);
};
goog.inherits(ol.control.GoogleMapsDirections, ol.control.Control);


/**
 * @inheritDoc
 */
ol.control.GoogleMapsDirections.prototype.setMap = function(map) {
  goog.base(this, 'setMap', map);
  if (!goog.isNull(map)) {
    map.addLayer(this.vectorLayer_);
    map.addControl(this.startGeocoder_);
    map.addControl(this.endGeocoder_);
    map.addInteraction(this.dryModify_);
  }
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleLocationChanged_ =
    function(event) {

  var currentGeocoder = event.target;
  var startGeocoder = this.startGeocoder_;
  var endGeocoder = this.endGeocoder_;
  var otherGeocoder = (currentGeocoder === startGeocoder) ?
      endGeocoder : startGeocoder;

  var currentLocation = currentGeocoder.getLocation();
  var otherLocation = otherGeocoder.getLocation();

  if (goog.isDefAndNotNull(currentLocation)) {
    currentGeocoder.disableReverseGeocoding();
    if (goog.isDefAndNotNull(otherLocation)) {
      this.route_(currentLocation, otherLocation);
    } else {
      otherGeocoder.enableReverseGeocoding();
      this.clear_();
      this.fitViewExtentToCoordinate_(currentGeocoder.getCoordinate());
    }
  } else {
    this.clear_();
    if (goog.isDefAndNotNull(otherLocation)) {
      currentGeocoder.enableReverseGeocoding();
    } else {
      startGeocoder.enableReverseGeocoding();
      endGeocoder.disableReverseGeocoding();
    }
  }

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

  var reqWaypoints = [];
  var waypoints = this.waypoints_;

  goog.array.forEach(waypoints, function(waypoint) {
    reqWaypoints.push({
      location: waypoint,
      stopover: true
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
  var features = [];
  var coordinates;

  var routeFeatures = this.routeFeatures_;

  var waypoints = this.waypoints_;
  var dryModify = this.dryModify_;

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
      features.push(feature);
      routeFeatures.push(feature);

      // for each 'legs' except the last, pick the destination as waypoint icon
      goog.array.forEach(route.legs, function(leg, index, legs) {
        // break on last leg
        if (index == legs.length - 1) {
          return true;
        }

        lng = leg.end_location.lng();
        lat = leg.end_location.lat();
        transformedCoordinate = ol.proj.transform(
            [lng, lat], 'EPSG:4326', projection.getCode());

        var feature = new ol.Feature(new ol.geom.Point(transformedCoordinate));
        feature.setStyle(this.waypointIconStyle_);

        features.push(feature);
      }, this);
    }, this);

    // fit extent
    this.fitViewExtentToRoute_();

    // if limit of waypoints is reached, disable dryModify interaction
    if (waypoints.length >= this.maxWaypoints_) {
      map.removeInteraction(dryModify);
    }

    // add features to layer
    vectorSource.addFeatures(features);
  }

};


/**
 * @private
 */
ol.control.GoogleMapsDirections.prototype.clear_ = function() {
  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);
  vectorSource.clear();

  var routeFeatures = this.routeFeatures_;
  routeFeatures.clear();
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
 * @param {Object|goog.events.Event|null|string} evt
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleDryModifyDrag_ = function(evt) {

  var me = this;
  var dryModify = evt.target;
  var coordinate = dryModify.coordinate_;

  if (goog.isDefAndNotNull(this.newWaypointTimerId_)) {
    window.clearTimeout(this.newWaypointTimerId_);
  }

  this.newWaypointTimerId_ = window.setTimeout(function() {
    me.createWaypoint_(coordinate);
  }, this.newWaypointDelay_);

};


/**
 * @param {ol.Coordinate} coordinate
 * @private
 */
ol.control.GoogleMapsDirections.prototype.createWaypoint_ = function(
    coordinate) {

  var waypoints = this.waypoints_;

  if (waypoints.length >= this.maxWaypoints_) {
    // todo, throw error;
    return;
  }

  var map = this.getMap();

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var projection = view2D.getProjection();

  var transformedCoordinate = ol.proj.transform(
      coordinate, projection.getCode(), 'EPSG:4326');

  var latLng = new google.maps.LatLng(
      transformedCoordinate[1], transformedCoordinate[0]);

  waypoints.push(latLng);

  this.clear_();
  this.route_(null, null);
};
