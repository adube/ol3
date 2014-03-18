goog.provide('ol.control.GoogleMapsDirectionsPanel');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.string');
goog.require('ol.View2D');
goog.require('ol.control.Control');
goog.require('ol.extent');
goog.require('ol.proj');


/**
 * @define {number} Default buffer size in pixels to apply to the map view
 * extent when checking if a coordinate is in the extent.
 */
ol.control.GOOGLEMAPSDIRECTIONSPANEL_PIXEL_BUFFER = 30;



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

  /**
   * @type {number}
   * @private
   */
  this.pixelBuffer_ = goog.isDefAndNotNull(options.pixelBuffer) ?
      options.pixelBuffer : ol.control.GOOGLEMAPSDIRECTIONSPANEL_PIXEL_BUFFER;


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
 * i18n - copyright
 * @type {string}
 */
ol.control.GoogleMapsDirectionsPanel.prototype.totalDistanceText =
    'Distance Totale';


/**
 * Clear the current directions.
 */
ol.control.GoogleMapsDirectionsPanel.prototype.clearDirections = function() {

  var element = this.element;

  // todo - at some point, we may want to browse all children to unlisten
  // events
  goog.dom.removeChildren(element);

};


/**
 * Build the direction panel content using the passed direction results.
 * @param {google.maps.DirectionsResult} directionsResult
 */
ol.control.GoogleMapsDirectionsPanel.prototype.setDirections = function(
    directionsResult) {

  var element = this.element;
  var routeEl;
  var classPrefix = this.classPrefix_;

  // first, clear any previous direction infos
  this.clearDirections();

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

  // total distance
  var totalDistance = 0;
  var totalDistanceText;
  goog.array.forEach(route.legs, function(leg) {
    totalDistance += leg.distance.value;
  }, this);
  if (totalDistance > 100) {
    // todo - add i18n related formats for numbers
    totalDistanceText = goog.string.makeSafe(
        Math.round(totalDistance / 1000 * 10) / 10 + ' km');
  } else {
    totalDistanceText = goog.string.makeSafe(totalDistance + ' m');
  }
  totalDistanceText = this.totalDistanceText + ': ' + totalDistanceText;
  var totalDistanceEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-route-total-distance'
  });
  goog.dom.appendChild(element, totalDistanceEl);
  goog.dom.appendChild(
      totalDistanceEl, goog.dom.createTextNode(totalDistanceText));

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

  var map = this.getMap();

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var projection = view2D.getProjection();

  var lat = step.start_location.lat();
  var lng = step.start_location.lng();
  var transformedCoordinate = ol.proj.transform(
      [lng, lat], 'EPSG:4326', projection.getCode());

  var element = goog.dom.createDom(goog.dom.TagName.TR, {
    'class': classPrefix + '-step',
    'data-x': transformedCoordinate[0],
    'data-y': transformedCoordinate[1]
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

  // event listeners
  goog.events.listen(element, [
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.CLICK
  ], this.handleStepElementPress_, false, this);

  return element;
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.handleStepElementPress_ =
    function(browserEvent) {

  browserEvent.preventDefault();

  var element = browserEvent.currentTarget;
  var coordinate = [
    window.parseFloat(element.getAttribute('data-x')),
    window.parseFloat(element.getAttribute('data-y'))
  ];

  this.fitViewExtentToCoordinate_(coordinate);

  // todo: create popup
  window.console.log('create popup');

};


/**
 * Fix map view extent to include coordinate if coordinate is outside
 * extent.
 * @param {ol.Coordinate} coordinate in map view projection
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.fitViewExtentToCoordinate_ =
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
