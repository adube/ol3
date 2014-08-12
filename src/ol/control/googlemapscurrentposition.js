goog.provide('ol.control.GoogleMapsCurrentPosition');

goog.require('ol.BrowserFeature');
goog.require('ol.control.Control');



/**
 * @classdesc
 * Todo
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.GoogleMapsCurrentPositionOptions=} opt_options Options.
 * @api
 */
ol.control.GoogleMapsCurrentPosition = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  /**
   * @private
   * i18n - currentPosition
   * @type {?string|undefined}
   */
  this.currentPositionText_ = goog.isDefAndNotNull(
      options.currentPositionText) ?
      options.currentPositionText : 'My position';

  /**
   * @private
   * @type {google.maps.Geocoder}
   */
  this.geocoder_ = new google.maps.Geocoder();

  /**
   * @private
   * @type {?number}
   */
  this.watchId_ = null;

  goog.base(this, {});

  this.activate_();
};
goog.inherits(ol.control.GoogleMapsCurrentPosition, ol.control.Control);


/**
 * @enum {string}
 */
ol.control.GoogleMapsCurrentPosition.Property = {
  ADDRESS: 'address'
};


/**
 * Create and return an empty address
 * @return {Object}
 */
ol.control.GoogleMapsCurrentPosition.prototype.createEmptyAddress = function() {
  return {
    'formatted_address': null,
    'text': this.currentPositionText_,
    'geometry': {
      'location': null
    }
  };
};


/**
 * Activate
 * @private
 */
ol.control.GoogleMapsCurrentPosition.prototype.activate_ = function() {
  if (!ol.BrowserFeature.HAS_GEOLOCATION || !goog.isNull(this.watchId_)) {
    return;
  }

  this.watchId_ = goog.global.navigator.geolocation.watchPosition(
      goog.bind(this.handleGetPositionSuccess_, this),
      goog.bind(this.handleGetPositionError_, this),
      this.getGeolocationPositionOptions_());
};


/**
 * Deactivate and clear any previous address set
 * @private
 */
ol.control.GoogleMapsCurrentPosition.prototype.deactivate_ = function() {
  if (!ol.BrowserFeature.HAS_GEOLOCATION || goog.isNull(this.watchId_)) {
    return;
  }

  goog.global.navigator.geolocation.clearWatch(this.watchId_);
  this.setProperties({'address': false});
};


/**
 * @return {GeolocationPositionOptions}
 * @private
 */
ol.control.GoogleMapsCurrentPosition.prototype.getGeolocationPositionOptions_ =
    function() {
  return /** @type {GeolocationPositionOptions} */ ({
    'enableHighAccuracy': false,
    'maximumAge': 0,
    // 45 secs is enough for timeout when enableHighAccuracy is disabled
    'timeout': 45000
  });
};


/**
 * @param {Object} response Response object of a geolocation get position
 *     success
 * @private
 */
ol.control.GoogleMapsCurrentPosition.prototype.handleGetPositionSuccess_ =
    function(response) {

  var geocoder = this.geocoder_;
  var lat = response.coords.latitude;
  var lon = response.coords.longitude;
  var latlng = new google.maps.LatLng(lat, lon);
  var me = this;

  geocoder.geocode({'latLng': latlng}, function(results, status) {
    me.handleGeocode_(results, status);
  });
};


/**
 * @param {Object} response Response object of a geolocation get position
 *     error
 * @private
 */
ol.control.GoogleMapsCurrentPosition.prototype.handleGetPositionError_ =
    function(response) {

  // FIXME - manage error too
  this.deactivate_();
};


/**
 * @param {Array} results
 * @param {google.maps.GeocoderStatus.<(number|string)>} status
 * @private
 */
ol.control.GoogleMapsCurrentPosition.prototype.handleGeocode_ =
    function(results, status) {

  if (status == 'OK') {
    var currentPosition = {
      'formatted_address': results[0].formatted_address,
      'text': this.currentPositionText_,
      'address': results[0].formatted_address,
      'geometry': {
        'location': results[0].geometry.location
      }
    };

    this.setProperties({'address': currentPosition});

  } else {
    // FIXME - manage error too
    this.deactivate_();
  }
};
