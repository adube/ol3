goog.provide('ol.control.GoogleMapsGeocoder');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
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


  goog.base(this, {
    element: element,
    target: options.target
  });
};
goog.inherits(ol.control.GoogleMapsGeocoder, ol.control.Control);
