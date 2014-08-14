goog.provide('ol.control.MTSearch');

goog.require('goog.Uri.QueryData');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.json');
goog.require('goog.net.EventType');
goog.require('goog.net.XhrIo');
goog.require('ol.Collection');
goog.require('ol.Feature');
goog.require('ol.control.Control');
goog.require('ol.control.GoogleMapsDirectionsPanel');
goog.require('ol.extent');
goog.require('ol.geom.LineString');
goog.require('ol.geom.Point');
goog.require('ol.layer.Vector');
goog.require('ol.proj');
goog.require('ol.source.Vector');



/**
 * @classdesc
 * Todo
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.MTSearchOptions=} opt_options Options.
 * @api
 */
ol.control.MTSearch = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  // i18n

  /**
   * i18n - noRouteText
   * @type {string}
   */
  this.noRouteText = goog.isDef(options.noRouteText) ?
      options.noRouteText : 'Your search did not return any route';

  /**
   * i18n - unexpectedErrorText
   * @type {string}
   */
  this.unexpectedErrorText = goog.isDef(options.unexpectedErrorText) ?
      options.unexpectedErrorText : 'An unexpected error occured';


  /**
   * @type {string}
   * @private
   */
  this.classPrefix_ = 'ol-mts';

  var classPrefix = this.classPrefix_;

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + ' ' + ol.css.CLASS_UNSELECTABLE
  });


  /**
   * @type {ol.control.GoogleMapsDirectionsPanel}
   * @private
   */
  this.directionsPanel_ = options.directionsPanel;


  /**
   * The error message currently on
   * @type {?string}
   * @private
   */
  this.error_ = null;


  /**
   * @type {Object}
   * @private
   */
  this.headers_ = goog.isDef(options.headers) ? options.headers : {};


  /**
   * @type {Array.<string>}
   * @private
   */
  this.iconImages_ = options.iconImages;


  /**
   * @type {Array.<ol.style.Style>}
   * @private
   */
  this.iconStyles_ = options.iconStyles;



  /**
   * User provided style for lines.
   * @type {Array.<(null|ol.style.Style)>|null|ol.feature.FeatureStyleFunction|ol.style.Style}
   * @private
   */
  this.lineStyle_ = options.lineStyle;


  /**
   * A collection of the marker to also add to the vector layer.  The
   * collection itself contains arrays of ol.Feature in the same order
   * of the routes.
   * @type {ol.Collection}
   * @private
   */
  this.markerFeatures_ = new ol.Collection();


  /**
   * @type {number}
   * @private
   */
  this.pixelBuffer_ = 30;


  /**
   * @type {ol.Collection}
   * @private
   */
  this.routeFeatures_ = new ol.Collection();


  /**
   * @type {ol.Collection}
   * @private
   */
  this.selectedRouteFeatures_ = new ol.Collection();


  /**
   * @type {string}
   * @private
   */
  this.url_ = options.url;


  /**
   * @type {boolean}
   * @private
   */
  this.usePostMethod_ = goog.isDef(options.usePostMethod) ?
      options.usePostMethod : true;


  /**
   * @type {?ol.layer.Vector}
   * @private
   */
  this.vectorLayer_ = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: []
    })
  });


  goog.base(this, {
    element: element,
    target: options.target
  });


  // Event listeners

  goog.events.listen(
      this.directionsPanel_,
      ol.control.GoogleMapsDirectionsPanel.EventType.SELECT,
      this.handleSelectionChanged_, false, this);

  goog.events.listen(
      this.directionsPanel_,
      ol.control.GoogleMapsDirectionsPanel.EventType.UNSELECT,
      this.handleSelectionCleared_, false, this);

};
goog.inherits(ol.control.MTSearch, ol.control.Control);


/**
 * @enum {string}
 */
ol.control.MTSearch.EventType = {
  ERROR: goog.events.getUniqueId('error')
};


/**
 * Public method used to clear the control
 */
ol.control.MTSearch.prototype.clear = function() {
  this.clear_();
};


/**
 * @return {?string}
 */
ol.control.MTSearch.prototype.getError = function() {
  return this.error_;
};


/**
 * @inheritDoc
 */
ol.control.MTSearch.prototype.setMap = function(map) {

  var myMap = this.getMap();
  if (goog.isNull(map) && !goog.isNull(myMap)) {
    myMap.removeLayer(this.vectorLayer_);
    myMap.removeControl(this.directionsPanel_);
  }

  goog.base(this, 'setMap', map);

  if (!goog.isNull(map)) {
    map.addLayer(this.vectorLayer_);
    map.addControl(this.directionsPanel_);
  }
};


/**
 * Public method used to manually trigger a route request.
 */
ol.control.MTSearch.prototype.triggerRequest = function() {
  this.clear_();
  this.request_();
};


/**
 * @private
 */
ol.control.MTSearch.prototype.clear_ = function() {

  this.markerFeatures_.clear();
  this.routeFeatures_.clear();
  this.selectedRouteFeatures_.clear();

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);
  vectorSource.clear();

  this.directionsPanel_.clearDirections();
};


/**
 * Draw the selected route
 * @private
 */
ol.control.MTSearch.prototype.drawRoute_ = function() {

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);

  var features = [];

  var selectedRouteFeatures = this.selectedRouteFeatures_;

  // add selected route features.  There can be one or zero.
  selectedRouteFeatures.forEach(function(feature) {
    features.push(feature);
  }, this);

  // add features to layer
  vectorSource.addFeatures(features);
};


/**
 * Fix map view extent to route.
 * @private
 */
ol.control.MTSearch.prototype.fitViewExtentToRoute_ = function() {
  var map = this.getMap();

  var size = map.getSize();
  goog.asserts.assertArray(size);

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);
  var extent = vectorSource.getExtent();

  var resolution = view.getResolutionForExtent(extent, size);
  var pixelBuffer = this.pixelBuffer_;
  var buffer = resolution * pixelBuffer;
  extent = ol.extent.buffer(extent, buffer);

  view.fitExtent(extent, size);
};


/**
 * @param {google.maps.DirectionsResult|Object} response
 * @param {google.maps.DirectionsStatus} status
 * @private
 */
ol.control.MTSearch.prototype.handleDirectionsResult_ = function(
    response, status) {

  this.directionsPanel_.toggleWorkInProgress(false);

  var map = this.getMap();

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));

  var projection = view.getProjection();

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);

  var lat, location, lng, transformedCoordinate;
  var feature;
  var coordinates;
  var coordinate;
  var geometry;

  var routeFeatures = this.routeFeatures_;
  var markerFeatures = this.markerFeatures_;
  var routeMarkerFeatures;
  var routeMarkerFeature;
  var lastLeg;
  var iIconStyle;

  this.setError_(null);

  if (status == google.maps.DirectionsStatus.OK) {
    goog.array.forEach(response.routes, function(route) {
      geometry = null;
      routeMarkerFeatures = [];

      if (goog.isDefAndNotNull(route.overview_path)) {
        coordinates = [];
        goog.array.forEach(route.overview_path, function(location) {
          lng = location.lng();
          lat = location.lat();
          transformedCoordinate = ol.proj.transform(
              [lng, lat], 'EPSG:4326', projection.getCode());
          coordinates.push(transformedCoordinate);
        }, this);
        geometry = new ol.geom.LineString(coordinates);
      } else if (goog.isDef(route.geometry)) {
        geometry = route.geometry;
      } else if (goog.isDef(route.coordinates)) {
        geometry = new ol.geom.LineString(route.coordinates);
      }

      if (goog.isNull(geometry)) {
        // todo - manage error
        return;
      }

      feature = new ol.Feature(geometry);
      feature.setStyle(this.lineStyle_);
      routeFeatures.push(feature);


      // collect the markers to use with the route
      iIconStyle = 0;
      goog.array.forEach(route.legs, function(leg) {
        var coordinate;
        if (goog.isDefAndNotNull(leg.start_coordinate)) {
          coordinate = leg.start_coordinate;
        } else {
          lng = leg.start_location.lng();
          lat = leg.start_location.lat();
          coordinate = ol.proj.transform(
              [lng, lat], 'EPSG:4326', projection.getCode());
        }
        routeMarkerFeature = new ol.Feature(new ol.geom.Point(coordinate));
        routeMarkerFeature.setStyle(this.iconStyles_[iIconStyle++]);
        routeMarkerFeatures.push(routeMarkerFeature);
      }, this);

      lastLeg = route.legs[route.legs.length - 1];
      if (goog.isDefAndNotNull(lastLeg.end_coordinate)) {
        coordinate = lastLeg.end_coordinate;
      } else {
        lng = lastLeg.end_location.lng();
        lat = lastLeg.end_location.lat();
        coordinate = ol.proj.transform(
            [lng, lat], 'EPSG:4326', projection.getCode());
      }
      routeMarkerFeature = new ol.Feature(new ol.geom.Point(coordinate));
      routeMarkerFeature.setStyle(this.iconStyles_[iIconStyle++]);
      routeMarkerFeatures.push(routeMarkerFeature);

      markerFeatures.push(routeMarkerFeatures);
    }, this);

    if (routeFeatures.getLength()) {
      // set directions in panel
      this.directionsPanel_.setDirections(
          response, this.iconImages_);
    } else {
      this.setError_(this.noRouteText);
    }
  }else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
    this.setError_(this.noRouteText);
  } else {
    this.setError_(this.unexpectedErrorText);
  }
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.MTSearch.prototype.handleSelectionChanged_ = function(
    event) {

  var index = this.directionsPanel_.getSelectedRouteIndex();
  if (!goog.isNull(index)) {
    this.selectRoute_(index);
  }
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.MTSearch.prototype.handleSelectionCleared_ = function(
    event) {
  var index = this.directionsPanel_.getSelectedRouteIndex();
  if (!goog.isNull(index)) {
    this.unselectRoute_(index);
  }
};


/**
 * @private
 */
ol.control.MTSearch.prototype.request_ = function() {

  var request = new goog.net.XhrIo();
  var url = this.url_;
  var headers = this.headers_;
  var method = (this.usePostMethod_ === true) ? 'POST' : 'GET';

  var data = new goog.Uri.QueryData();
  data.add('json', goog.json.serialize(this.getProperties()));

  // listen once to 'complete' event
  goog.events.listenOnce(request, goog.net.EventType.COMPLETE, function(event) {
    var request = event.currentTarget;
    if (request.isSuccess()) {
      var response = request.getResponseJson();
      this.handleDirectionsResult_(response, google.maps.DirectionsStatus.OK);
    } else {
      this.handleDirectionsResult_(
          null, google.maps.DirectionsStatus.UNKNOWN_ERROR);
    }
  }, undefined, this);

  this.directionsPanel_.toggleWorkInProgress(true);

  request.send(url, method, data.toString(), headers);
};


/**
 * Select the route at the specified location in the collection.  Here,
 * the selection is merely a matter of getting the route feature at the specific
 * index and draw the routes.
 * @param {number} index
 * @private
 */
ol.control.MTSearch.prototype.selectRoute_ = function(index) {
  var routeFeatures = this.routeFeatures_;
  var selectedRouteFeatures = this.selectedRouteFeatures_;
  var routeFeature = routeFeatures.item(index);
  var routeMarkerFeatures = this.markerFeatures_.item(index);
  goog.asserts.assertArray(routeMarkerFeatures);

  if (goog.isNull(routeFeature)) {
    // todo - manage error
    return;
  }

  // add the new route
  selectedRouteFeatures.push(routeFeature);

  // add the markers as well
  selectedRouteFeatures.extend(routeMarkerFeatures);

  // draw
  this.drawRoute_();

  // fit extent
  this.fitViewExtentToRoute_();
};


/**
 * @param {?string} error
 * @private
 */
ol.control.MTSearch.prototype.setError_ = function(error) {
  if (!goog.isNull(error) || !goog.isNull(this.error_)) {
    this.error_ = error;

    goog.events.dispatchEvent(this,
        ol.control.MTSearch.EventType.ERROR);
  }
};


/**
 * Clear the unselected route from the map.
 * @param {number} index
 * @private
 */
ol.control.MTSearch.prototype.unselectRoute_ = function(index) {
  var selectedRouteFeatures = this.selectedRouteFeatures_;

  // clear previously selected route
  selectedRouteFeatures.clear();

  // clear vector layer
  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);
  vectorSource.clear();
};
