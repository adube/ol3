goog.provide('ol.control.GoogleMapsDirections');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('ol.Object');
goog.require('ol.control.Control');
goog.require('ol.control.GoogleMapsGeocoder');
goog.require('ol.css');
goog.require('ol.style.Style');



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
 * @inheritDoc
 */
ol.control.GoogleMapsDirections.prototype.setMap = function(map) {
  goog.base(this, 'setMap', map);
  if (!goog.isNull(map)) {
    map.addControl(this.startGeocoder_);
    map.addControl(this.endGeocoder_);
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
 * @param {google.maps.LatLng} start Location
 * @param {google.maps.LatLng} end Location
 * @private
 */
ol.control.GoogleMapsDirections.prototype.route_ = function(start, end) {

  var me = this;
  var service = this.directionsService_;

  var request = {
    origin: start,
    destination: end,
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

  if (status == google.maps.DirectionsStatus.OK) {
    alert(response.routes.length);
  }
};


/**
 * @private
 */
ol.control.GoogleMapsDirections.prototype.clear_ = function() {
};
