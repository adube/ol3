goog.provide('ol.control.GoogleMapsGeocoder');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.string');
goog.require('ol.control.Control');
goog.require('ol.css');



/**
 * Todo
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.GoogleMapsGeocoderOptions=} opt_options Options.
 */
ol.control.GoogleMapsGeocoder = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  var className = 'ol-google-maps-geocoder';

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': className + ' ' + ol.css.CLASS_UNSELECTABLE
  });

  var input = goog.dom.createDom(goog.dom.TagName.INPUT, {
    'class': ''
  });
  var button = goog.dom.createDom(goog.dom.TagName.BUTTON, {
    'class': ''
  });
  var buttonText = goog.dom.createTextNode('GO');
  goog.dom.appendChild(button, buttonText);


  goog.dom.appendChild(element, input);
  goog.dom.appendChild(element, button);

  goog.events.listen(button, [
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.CLICK
  ], this.handleButtonPress_, false, this);

  goog.events.listen(input, [
    goog.events.EventType.KEYPRESS
  ], this.handleInputKeypress_, false, this);

  goog.base(this, {
    element: element,
    target: options.target
  });

  /**
   * @private
   * @type {Element}
   */
  this.input_ = input;

  /**
   * @private
   * @type {google.maps.Geocoder}
   */
  this.geocoder_ = new google.maps.Geocoder();

};
goog.inherits(ol.control.GoogleMapsGeocoder, ol.control.Control);


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.handleInputKeypress_ = function(
    browserEvent) {

  if (browserEvent.keyCode == goog.events.KeyCodes.ENTER) {
    this.handleButtonPress_(browserEvent);
  }
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.handleButtonPress_ = function(
    browserEvent) {

  browserEvent.preventDefault();

  var input = this.input_;
  var value = input.value;
  if (!goog.string.isEmptySafe(value)) {
    this.geocodeByAddress_(value);
  }
};


/**
 * @param {String} address The address to search
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.geocodeByAddress_ = function(address) {

  var geocoder = this.geocoder_;
  var input = this.input_;

  var formatted_address, x, y;
  var result;
  var tmpOutput = [];


  geocoder.geocode(
      {
        'address': address
      },
      function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          // TODO: support multiple results
          result = results[0];

          formatted_address = result.formatted_address;
          x = result.geometry.location.lng();
          y = result.geometry.location.lat();

          tmpOutput.push(formatted_address);
          tmpOutput.push('\n');
          tmpOutput.push('(');
          tmpOutput.push(x);
          tmpOutput.push(', ');
          tmpOutput.push(y);
          tmpOutput.push(')');

          //alert(tmpOutput.join(''));

          input.value = formatted_address;

        } else {
          // TODO: manage error message
          alert(
              'Geocode was not successful for the following reason: ' +
              status
          );
        }
      }
  );
};
