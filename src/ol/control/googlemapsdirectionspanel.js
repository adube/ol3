goog.provide('ol.control.GoogleMapsDirectionsPanel');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.string');
goog.require('ol.control.Control');



/**
 * Todo
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.GoogleMapsDirectionsPanelOptions=} opt_options Options.
 */
ol.control.GoogleMapsDirectionsPanel = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  var classPrefix = 'ol-gmdp';

  /**
   * @type {string}
   * @private
   */
  this.classPrefix_ = classPrefix;

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + ' ' + ol.css.CLASS_UNSELECTABLE
  });

  goog.base(this, {
    element: element,
    target: options.target
  });

};
goog.inherits(ol.control.GoogleMapsDirectionsPanel, ol.control.Control);


/**
 * i18n - around
 * @type {string}
 */
ol.control.GoogleMapsDirectionsPanel.prototype.aroundText = 'environ';


/**
 * i18n - copyright
 * @type {string}
 */
ol.control.GoogleMapsDirectionsPanel.prototype.copyrightText =
    'Données cartographiques ©2014 Google';


/**
 * Build the direction panel content using the passed direction results.
 * @param {google.maps.DirectionsResult} directionsResult
 */
ol.control.GoogleMapsDirectionsPanel.prototype.setDirections = function(
    directionsResult) {

  var element = this.element;
  var routeEl;
  var classPrefix = this.classPrefix_;

  // remove routes
  // todo: manage inner components
  goog.dom.removeChildren(element);

  // add routes
  goog.array.forEach(directionsResult.routes, function(route) {
    routeEl = this.createRouteElement_(route);
    goog.dom.appendChild(element, routeEl);
  }, this);

  // copyright
  var copyright = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-copyright'
  });
  goog.dom.appendChild(element, copyright);
  var copyrightText = goog.dom.createTextNode(this.copyrightText);
  goog.dom.appendChild(copyright, copyrightText);

};


/**
 * Create all elements required for a route
 * @param {google.maps.DirectionsRoute} route
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createRouteElement_ =
    function(route) {

  var legEl;
  var tailEl;
  var classPrefix = this.classPrefix_;

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-route'
  });

  // legs
  goog.array.forEach(route.legs, function(leg) {
    legEl = this.createLegElement_(leg);
    goog.dom.appendChild(element, legEl);
  }, this);

  // tail
  var lastLeg = goog.array.peek(route.legs);
  goog.asserts.assertObject(lastLeg);
  tailEl = this.createTailElement_(lastLeg);
  goog.dom.appendChild(element, tailEl);

  return element;
};


/**
 * Create all elements required for a leg
 * @param {Object} leg
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createLegElement_ =
    function(leg) {

  var stepEl;
  var classPrefix = this.classPrefix_;

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-leg'
  });

  // header
  goog.dom.appendChild(element, this.createLegHeaderElement_(leg, true));

  // summary
  var summaryEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-leg-summary'
  });
  goog.dom.appendChild(element, summaryEl);
  var summaryText = goog.dom.createTextNode(
      leg.distance.text + ' - ' + this.aroundText + ' ' + leg.duration.text);
  goog.dom.appendChild(summaryEl, summaryText);

  // steps
  var table = goog.dom.createDom(goog.dom.TagName.TABLE, {
    'class': classPrefix + '-steps'
  });
  goog.dom.appendChild(element, table);

  goog.array.forEach(leg.steps, function(step, index) {
    stepEl = this.createStepElement_(step, index);
    goog.dom.appendChild(table, stepEl);
  }, this);

  return element;
};


/**
 * Create the header for a leg
 * @param {Object} leg
 * @param {boolean} start Whether to use the start address or not (use end)
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createLegHeaderElement_ =
    function(leg, start) {

  var classPrefix = this.classPrefix_;

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-leg-header'
  });

  // icon - todo

  // text
  var textEl = goog.dom.createDom(goog.dom.TagName.DIV, {});
  goog.dom.appendChild(element, textEl);
  var text = (start) ? leg.start_address : leg.end_address;
  goog.dom.appendChild(textEl, goog.dom.createTextNode(text));

  return element;
};


/**
 * Create all elements required for a tail, which is the last leg of a route
 * @param {Object} leg
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createTailElement_ =
    function(leg) {

  var classPrefix = this.classPrefix_;

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-tail'
  });

  // header
  goog.dom.appendChild(element, this.createLegHeaderElement_(leg, false));

  return element;
};


/**
 * Create all elements required for a step
 * @param {google.maps.DirectionsStep} step
 * @param {number} index Index of step
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createStepElement_ =
    function(step, index) {

  var classPrefix = this.classPrefix_;

  var element = goog.dom.createDom(goog.dom.TagName.TR, {
    'class': classPrefix + '-step'
  });

  // maneuver
  var maneuverEl = goog.dom.createDom(goog.dom.TagName.TD, {
    'class': classPrefix + '-step-maneuver'
  });
  if (goog.isDefAndNotNull(step.maneuver)) {
    goog.dom.classes.add(maneuverEl,
        classPrefix + '-step-maneuver-' + step.maneuver);
  }
  goog.dom.appendChild(element, maneuverEl);

  // num
  var numEl = goog.dom.createDom(goog.dom.TagName.TD, {
    'class': classPrefix + '-step-num'
  });
  numEl.innerHTML = goog.string.makeSafe(index + 1 + '.');
  goog.dom.appendChild(element, numEl);

  // instructions
  var instructionsEl = goog.dom.createDom(goog.dom.TagName.TD, {
    'class': classPrefix + '-step-instructions'
  });
  instructionsEl.innerHTML = step.instructions;
  goog.dom.appendChild(element, instructionsEl);

  // distance
  var distanceEl = goog.dom.createDom(goog.dom.TagName.TD, {
    'class': classPrefix + '-step-distance'
  });
  distanceEl.innerHTML = step.distance.text;
  goog.dom.appendChild(element, distanceEl);

  return element;
};
