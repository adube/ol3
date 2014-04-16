goog.provide('ol.control.GoogleMapsCurrentPosition');

goog.require('ol.control.Control');



/**
 * Todo
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.GoogleMapsCurrentPositionOptions=} opt_options Options.
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
   * @type {number}
   */
  this.currentPositionDelay = goog.isDef(options.currentPositionDelay) ?
      options.currentPositionDelay : 60000;

  /**
   * @private
   * @type {?number} timeout
   */
  this.currentPositionTimeout_ = null;


  /**
   * @private
   * @type {Object}
   */
  this.currentPosition_ = null;

  /**
   * @private
   * @type {google.maps.Geocoder}
   */
  this.geocoder_ = new google.maps.Geocoder();
};
goog.inherits(ol.control.GoogleMapsCurrentPosition, ol.control.Control);


/**
 * @param {Function} callback
 * @param {boolean} force
 */
ol.control.GoogleMapsCurrentPosition.prototype.setCurrentPosition = function(
    callback, force) {
  var me = this;
  force = goog.isDefAndNotNull(force) && force === true;

  if ((goog.isNull(this.currentPosition_) ||
      goog.isNull(this.currentPosition_.geometry)) ||
      force === true) {

    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;

      var geocoder = me.geocoder_;
      var latlng = new google.maps.LatLng(lat, lon);

      geocoder.geocode(
          {
            'latLng': latlng
          },
          function(results, status) {
            if (status == 'OK') {
              var currentPosition = {
                'formatted_address': results[0].formatted_address,
                'text': me.currentPositionText_,
                'geometry': {
                  'location': new google.maps.LatLng(lat, lon)
                }
              };

              me.cacheCurrentPosition_.call(me, currentPosition);

              if (goog.isDefAndNotNull(callback)) {
                callback.call(me, currentPosition);
              }
            }
          }
      );
    });
  }
};


/**
 * @return {Object} position
 */
ol.control.GoogleMapsCurrentPosition.prototype.getCurrentPosition = function() {
  return this.currentPosition_;
};


/**
 * @param {Object} currentPosition
 * @private
 */
ol.control.GoogleMapsCurrentPosition.prototype.cacheCurrentPosition_ = function(
    currentPosition) {
  var me = this;

  this.currentPosition_ = currentPosition;

  if (this.currentPositionTimeout_) {
    clearTimeout(this.currentPositionTimeout_);
  }

  if (!goog.isNull(this.currentPositionDelay)) {
    this.currentPositionTimeout_ = setTimeout(function() {
      me.currentPosition_ = {
        'formatted_address': me.currentPositionText_,
        'geometry': null
      };
    }, this.currentPositionDelay);
  }
};
