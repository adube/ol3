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
goog.require('ol.View2D');
goog.require('ol.control.Control');
goog.require('ol.control.GoogleMapsDirectionsPanel');
goog.require('ol.geom.LineString');
goog.require('ol.layer.Vector');
goog.require('ol.proj');
goog.require('ol.source.Vector');



/**
 * Todo
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.MTSearchOptions=} opt_options Options.
 */
ol.control.MTSearch = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

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
   * @type {Object}
   * @private
   */
  this.headers_ = goog.isDef(options.headers) ? options.headers : {};


  /**
   * User provided style for lines.
   * @type {Array.<(null|ol.style.Style)>|null|ol.feature.FeatureStyleFunction|ol.style.Style}
   * @private
   */
  this.lineStyle_ = options.lineStyle;


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

};
goog.inherits(ol.control.MTSearch, ol.control.Control);


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

  this.routeFeatures_.clear();
  this.selectedRouteFeatures_.clear();

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);
  vectorSource.clear();

  this.directionsPanel_.clearDirections();

  // FIXME - should an event be dispatched ?
  //goog.events.dispatchEvent(this,
  //    ol.control.GoogleMapsDirections.EventType.CLEAR);
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
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var projection = view2D.getProjection();

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);

  var lat, location, lng, transformedCoordinate;
  var feature;
  var coordinates;
  var geometry;

  var routeFeatures = this.routeFeatures_;

  this.setError_(null);

  if (status == google.maps.DirectionsStatus.OK) {
    goog.array.forEach(response.routes, function(route) {
      geometry = null;

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
    }, this);

    if (routeFeatures.getLength()) {
      // set directions in panel
      // FIXME - there should be images here...
      this.directionsPanel_.setDirections(
          response, []);
    } else {
      // FIXME
      //this.setError_(this.noRouteText);
      this.setError_('');
    }
  }else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
    // FIXME - todo
    //this.setError_(this.noRouteText);
    this.setError_('');
  } else {
    // FIXME - todo
    //this.setError_(this.unexpectedErrorText);
    this.setError_('');
  }

  // FIXME - should we trigger an event here ?
  /*
  if (this.loading_ === false) {
    goog.events.dispatchEvent(this,
        ol.control.GoogleMapsDirections.EventType.ROUTECOMPLETE);
  }
  */

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
      // todo - manage error
    }
  }, undefined, this);

  this.directionsPanel_.toggleWorkInProgress(true);

  request.send(url, method, data.toString(), headers);
};


/**
 * @param {?string} error
 * @private
 */
ol.control.MTSearch.prototype.setError_ = function(error) {
  // FIXME - todo
  /*
  if (!goog.isNull(error) || !goog.isNull(this.error_)) {
    this.error_ = error;

    // FIXME - is this useful ?
    //goog.events.dispatchEvent(this,
    //    ol.control.GoogleMapsDirections.EventType.ERROR);
  }
  */
};
