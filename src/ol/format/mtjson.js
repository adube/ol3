goog.provide('ol.format.MTJSON');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.json');
goog.require('ol.geom.LineString');


/**
 * @define {string} the key for routes array in mtjson
 */
ol.control.MTJSON_ROUTES = 'r';


/**
 * @define {string} the key for a route coordinates in mtjson
 */
ol.control.MTJSON_ROUTE_COORDINATES = 'c';


/**
 * @define {string} the key for a route legs in mtjson
 */
ol.control.MTJSON_ROUTE_LEGS = 'l';


/**
 * @define {string} the key for a leg distance object in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_DISTANCE = 'd';


/**
 * @define {string} the key for a leg distance value in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_DISTANCE_VALUE = 'v';


/**
 * @define {string} the key for a leg distance text in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_DISTANCE_TEXT = 't';


/**
 * @define {string} the key for a leg duration object in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_DURATION = 'r';


/**
 * @define {string} the key for a leg duration value in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_DURATION_VALUE = 'v';


/**
 * @define {string} the key for a leg duration text in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_DURATION_TEXT = 't';


/**
 * @define {string} the key for a leg start coordinate in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_START_COORDINATE = 's';


/**
 * @define {string} the key for a leg end coordinate in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_END_COORDINATE = 'e';


/**
 * @define {string} the key for a leg start address in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_START_ADDRESS = 't';


/**
 * @define {string} the key for a leg end address in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_END_ADDRESS = 'n';


/**
 * @define {string} the key for a leg steps in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_STEPS = 'p';


/**
 * @define {string} the key for a step start coordinate in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_STEP_START_COORDINATE = 's';


/**
 * @define {string} the key for a step instructions in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_STEP_INSTRUCTIONS = 'i';


/**
 * @define {string} the key for a step maneuver in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_STEP_MANEUVER = 'm';


/**
 * @define {string} the key for a step distance object in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_STEP_DISTANCE = 'd';


/**
 * @define {string} the key for a step distance value in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_STEP_DISTANCE_VALUE = 'v';


/**
 * @define {string} the key for a step distance text in mtjson
 */
ol.control.MTJSON_ROUTE_LEG_STEP_DISTANCE_TEXT = 't';


/**
 * @define {string} the key for the start object in mtjson
 */
ol.control.MTJSON_START = 's';


/**
 * @define {string} the key for the start name in mtjson
 */
ol.control.MTJSON_START_NAME = 'n';


/**
 * @define {string} the key for the start coordinate in mtjson
 */
ol.control.MTJSON_START_COORDINATE = 'v';


/**
 * @define {string} the key for the end object in mtjson
 */
ol.control.MTJSON_END = 's';


/**
 * @define {string} the key for the end name in mtjson
 */
ol.control.MTJSON_END_NAME = 'n';


/**
 * @define {string} the key for the end coordinate in mtjson
 */
ol.control.MTJSON_END_COORDINATE = 'v';


/**
 * @define {string} the key for the waypoints array in mtjson
 */
ol.control.MTJSON_WAYPOINTS = 'w';


/**
 * @define {string} the key for a waypoint name in mtjson
 */
ol.control.MTJSON_WAYPOINT_NAME = 'n';


/**
 * @define {string} the key for a waypoint coordinate in mtjson
 */
ol.control.MTJSON_WAYPOINT_COORDINATE = 'v';


/**
 * @define {string} the key for the detours array in mtjson
 */
ol.control.MTJSON_DETOURS = 'd';



/**
 * Todo
 * @constructor
 */
ol.format.MTJSON = function() {
};


/**
 * Read a json or object and return the read object.
 * @param {Object|string} source Source json string or object
 * @return {Object} read object
 */
ol.format.MTJSON.prototype.read = function(source) {
  var object = {};
  var sourceObj;

  if (goog.isString(source)) {
    sourceObj = goog.json.parse(source);
  } else {
    sourceObj = source;
  }

  var routes = sourceObj[ol.control.MTJSON_ROUTES];
  if (goog.isDefAndNotNull(routes) && goog.asserts.assertArray(routes)) {
    object.routes = this.readRoutes_(routes);
  }

  return object;
};


/**
 * Todo
 * @param {Object} source Source json string or object
 * @return {Object}
 */
ol.format.MTJSON.prototype.write = function(source) {
  window.console.log('write');

  var object = {};
  return object;
};


/**
 * @param {Array.<Object>} sourceRoutes
 * @return {Array.<Object>}
 * @private
 */
ol.format.MTJSON.prototype.readRoutes_ = function(sourceRoutes) {
  var routes = [];
  goog.array.forEach(sourceRoutes, function(sourceRoute) {
    routes.push(this.readRoute_(sourceRoute));
  }, this);
  return routes;
};


/**
 * @param {Object} sourceRoute
 * @return {Object}
 * @private
 */
ol.format.MTJSON.prototype.readRoute_ = function(sourceRoute) {
  var route = {};

  var coordinates = sourceRoute[ol.control.MTJSON_ROUTE_COORDINATES];
  if (goog.isDefAndNotNull(coordinates) &&
      goog.asserts.assertArray(coordinates)) {
    route.geometry = new ol.geom.LineString(coordinates);
  }

  var legs = sourceRoute[ol.control.MTJSON_ROUTE_LEGS];
  if (goog.isDefAndNotNull(legs) &&
      goog.asserts.assertArray(legs)) {
    route.legs = this.readLegs_(legs);
  }

  return route;
};


/**
 * @param {Array.<Object>} sourceLegs
 * @return {Array.<Object>}
 * @private
 */
ol.format.MTJSON.prototype.readLegs_ = function(sourceLegs) {
  var legs = [];
  goog.array.forEach(sourceLegs, function(sourceLeg) {
    legs.push(this.readLeg_(sourceLeg));
  }, this);
  return legs;
};


/**
 * @param {Object} sourceLeg
 * @return {Object}
 * @private
 */
ol.format.MTJSON.prototype.readLeg_ = function(sourceLeg) {
  var leg = {};

  // distance
  var distance, distanceText, distanceValue;
  distance = sourceLeg[ol.control.MTJSON_ROUTE_LEG_DISTANCE];
  if (goog.isDefAndNotNull(distance) && goog.asserts.assertObject(distance)) {
    distanceText = distance[ol.control.MTJSON_ROUTE_LEG_DISTANCE_TEXT];
    distanceValue = distance[ol.control.MTJSON_ROUTE_LEG_DISTANCE_VALUE];

    if (goog.isNumber(distanceValue) && goog.isString(distanceText)) {
      leg.distance = {'value': distanceValue, 'text': distanceText};
    }
  }

  // duration
  var duration, durationText, durationValue;
  duration = sourceLeg[ol.control.MTJSON_ROUTE_LEG_DURATION];
  if (goog.isDefAndNotNull(duration) && goog.asserts.assertObject(duration)) {
    durationText = duration[ol.control.MTJSON_ROUTE_LEG_DURATION_TEXT];
    durationValue = duration[ol.control.MTJSON_ROUTE_LEG_DURATION_VALUE];

    if (goog.isNumber(durationValue) && goog.isString(durationText)) {
      leg.duration = {'value': durationValue, 'text': durationText};
    }
  }

  // start coordinate
  var start = sourceLeg[ol.control.MTJSON_ROUTE_LEG_START_COORDINATE];
  if (goog.isDefAndNotNull(start) && goog.asserts.assertArray(start)) {
    leg.start_coordinate = start;
  }

  // end coordinate
  var end = sourceLeg[ol.control.MTJSON_ROUTE_LEG_END_COORDINATE];
  if (goog.isDefAndNotNull(end) && goog.asserts.assertArray(end)) {
    leg.end_coordinate = end;
  }

  // start address
  var startAddress = sourceLeg[ol.control.MTJSON_ROUTE_LEG_START_ADDRESS];
  if (goog.isDefAndNotNull(startAddress) && goog.isString(startAddress)) {
    leg.start_address = startAddress;
  }

  // end address
  var endAddress = sourceLeg[ol.control.MTJSON_ROUTE_LEG_END_ADDRESS];
  if (goog.isDefAndNotNull(endAddress) && goog.isString(endAddress)) {
    leg.end_address = endAddress;
  }

  // steps
  var steps = sourceLeg[ol.control.MTJSON_ROUTE_LEG_STEPS];
  if (goog.isDefAndNotNull(steps) && goog.asserts.assertArray(steps)) {
    leg.steps = this.readSteps_(steps);
  }

  return leg;
};


/**
 * @param {Array.<Object>} sourceSteps
 * @return {Array.<Object>}
 * @private
 */
ol.format.MTJSON.prototype.readSteps_ = function(sourceSteps) {
  var steps = [];
  goog.array.forEach(sourceSteps, function(sourceStep) {
    steps.push(this.readStep_(sourceStep));
  }, this);
  return steps;
};


/**
 * @param {Object} sourceStep
 * @return {Object}
 * @private
 */
ol.format.MTJSON.prototype.readStep_ = function(sourceStep) {
  var step = {};

  // start coordinate
  var start = sourceStep[ol.control.MTJSON_ROUTE_LEG_STEP_START_COORDINATE];
  if (goog.isDefAndNotNull(start) && goog.asserts.assertArray(start)) {
    step.start_coordinate = start;
  }

  // instructions
  var instructions = sourceStep[ol.control.MTJSON_ROUTE_LEG_STEP_INSTRUCTIONS];
  if (goog.isDefAndNotNull(instructions) && goog.isString(instructions)) {
    step.instructions = instructions;
  }

  // maneuver
  var maneuver = sourceStep[ol.control.MTJSON_ROUTE_LEG_STEP_MANEUVER];
  if (goog.isDefAndNotNull(maneuver) && goog.isString(maneuver)) {
    step.maneuver = maneuver;
  }

  // distance
  var distance, distanceText, distanceValue;
  distance = sourceStep[ol.control.MTJSON_ROUTE_LEG_STEP_DISTANCE];
  if (goog.isDefAndNotNull(distance) && goog.asserts.assertObject(distance)) {
    distanceText = distance[ol.control.MTJSON_ROUTE_LEG_STEP_DISTANCE_TEXT];
    distanceValue = distance[ol.control.MTJSON_ROUTE_LEG_STEP_DISTANCE_VALUE];

    if (goog.isNumber(distanceValue) && goog.isString(distanceText)) {
      step.distance = {'value': distanceValue, 'text': distanceText};
    }
  }

  return step;
};
