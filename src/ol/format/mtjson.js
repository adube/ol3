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
 * @define {string} the key for a route summary in mtjson
 */
ol.control.MTJSON_ROUTE_SUMMARY = 's';


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
 * @define {string} the key for the end object in mtjson
 */
ol.control.MTJSON_END = 'e';


/**
 * @define {string} the key for the waypoints array in mtjson
 */
ol.control.MTJSON_WAYPOINTS = 'w';


/**
 * @define {string} the key for a location (start, end or waypoint) name in
 * mtjson
 */
ol.control.MTJSON_LOCATION_NAME = 'n';


/**
 * @define {string} the key for a location (start, end or waypoint) coordinate
 * in mtjson
 */
ol.control.MTJSON_LOCATION_COORDINATE = 'c';


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

  // routes
  var routes = sourceObj[ol.control.MTJSON_ROUTES];
  goog.asserts.assertArray(routes);
  object.routes = this.readRoutes_(routes);

  // start
  var start = sourceObj[ol.control.MTJSON_START];
  goog.asserts.assertObject(start);
  object.start = this.readLocation_(start);

  // end
  var end = sourceObj[ol.control.MTJSON_END];
  goog.asserts.assertObject(end);
  object.end = this.readLocation_(end);

  // waypoints
  var waypoints = sourceObj[ol.control.MTJSON_WAYPOINTS];
  goog.asserts.assertArray(waypoints);
  object.waypoints = this.readWaypoints_(waypoints);

  // detours
  var detours = sourceObj[ol.control.MTJSON_DETOURS];
  goog.asserts.assertArray(detours);
  object.detours = this.readDetours_(detours);

  return object;
};


/**
 * Todo
 * @param {Object} sourceObj Source json string or object
 * @param {boolean} serialize Whether to serialize the returned object or not
 * @return {Object|string}
 */
ol.format.MTJSON.prototype.write = function(sourceObj, serialize) {
  var object = {};

  // routes
  var routes = sourceObj.routes;
  goog.asserts.assertArray(routes);
  object[ol.control.MTJSON_ROUTES] = this.writeRoutes_(routes);

  // start
  var start = sourceObj.start_location;
  goog.asserts.assertObject(start);
  object[ol.control.MTJSON_START] = this.writeLocation_(start);

  // end
  var end = sourceObj.end_location;
  goog.asserts.assertObject(end);
  object[ol.control.MTJSON_END] = this.writeLocation_(end);

  // waypoints
  var waypoints = sourceObj.waypoints;
  goog.asserts.assertObject(waypoints);
  object[ol.control.MTJSON_WAYPOINTS] = this.writeWaypoints_(waypoints);

  // detours
  var detours = sourceObj.detours;
  goog.asserts.assertArray(detours);
  object[ol.control.MTJSON_DETOURS] = this.writeDetours_(detours);

  if (serialize === true) {
    return goog.json.serialize(object);
  } else {
    return object;
  }
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

  var summary = sourceRoute[ol.control.MTJSON_ROUTE_SUMMARY];
  if (goog.isDefAndNotNull(summary)) {
    route.summary = summary;
  }

  var coordinates = sourceRoute[ol.control.MTJSON_ROUTE_COORDINATES];
  goog.asserts.assertArray(coordinates);
  route.geometry = new ol.geom.LineString(coordinates);

  var legs = sourceRoute[ol.control.MTJSON_ROUTE_LEGS];
  goog.asserts.assertArray(legs);
  route.legs = this.readLegs_(legs);

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
  goog.asserts.assertObject(distance);
  distanceText = distance[ol.control.MTJSON_ROUTE_LEG_DISTANCE_TEXT];
  distanceValue = distance[ol.control.MTJSON_ROUTE_LEG_DISTANCE_VALUE];
  goog.asserts.assertNumber(distanceValue);
  goog.asserts.assertString(distanceText);
  leg.distance = {'value': distanceValue, 'text': distanceText};

  // duration
  var duration, durationText, durationValue;
  duration = sourceLeg[ol.control.MTJSON_ROUTE_LEG_DURATION];
  goog.asserts.assertObject(duration);
  durationText = duration[ol.control.MTJSON_ROUTE_LEG_DURATION_TEXT];
  durationValue = duration[ol.control.MTJSON_ROUTE_LEG_DURATION_VALUE];
  goog.asserts.assertNumber(durationValue);
  goog.asserts.assertString(durationText);
  leg.duration = {'value': durationValue, 'text': durationText};

  // start coordinate
  var start = sourceLeg[ol.control.MTJSON_ROUTE_LEG_START_COORDINATE];
  goog.asserts.assertArray(start);
  leg.start_coordinate = start;

  // end coordinate
  var end = sourceLeg[ol.control.MTJSON_ROUTE_LEG_END_COORDINATE];
  goog.asserts.assertArray(end);
  leg.end_coordinate = end;

  // start address
  var startAddress = sourceLeg[ol.control.MTJSON_ROUTE_LEG_START_ADDRESS];
  goog.asserts.assertString(startAddress);
  leg.start_address = startAddress;

  // end address
  var endAddress = sourceLeg[ol.control.MTJSON_ROUTE_LEG_END_ADDRESS];
  goog.asserts.assertString(endAddress);
  leg.end_address = endAddress;

  // steps
  var steps = sourceLeg[ol.control.MTJSON_ROUTE_LEG_STEPS];
  goog.asserts.assertArray(steps);
  leg.steps = this.readSteps_(steps);

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
  goog.asserts.assertArray(start);
  step.start_coordinate = start;

  // instructions
  var instructions = sourceStep[ol.control.MTJSON_ROUTE_LEG_STEP_INSTRUCTIONS];
  goog.asserts.assertString(instructions);
  step.instructions = instructions;

  // maneuver
  var maneuver = sourceStep[ol.control.MTJSON_ROUTE_LEG_STEP_MANEUVER];
  goog.asserts.assertString(maneuver);
  step.maneuver = maneuver;

  // distance
  var distance, distanceText, distanceValue;
  distance = sourceStep[ol.control.MTJSON_ROUTE_LEG_STEP_DISTANCE];
  goog.asserts.assertObject(distance);
  distanceText = distance[ol.control.MTJSON_ROUTE_LEG_STEP_DISTANCE_TEXT];
  distanceValue = distance[ol.control.MTJSON_ROUTE_LEG_STEP_DISTANCE_VALUE];
  goog.asserts.assertNumber(distanceValue);
  goog.asserts.assertString(distanceText);
  step.distance = {'value': distanceValue, 'text': distanceText};

  return step;
};


/**
 * @param {Object} sourceLocation
 * @return {Object}
 * @private
 */
ol.format.MTJSON.prototype.readLocation_ = function(sourceLocation) {
  var location = {};

  // name
  var name = sourceLocation[ol.control.MTJSON_LOCATION_NAME];
  if (goog.isDefAndNotNull(name)) {
    location.formatted_address = name;
  }

  // coordinate
  var coordinate = sourceLocation[ol.control.MTJSON_LOCATION_COORDINATE];
  goog.asserts.assertArray(coordinate);
  location.geometry = {'coordinate': coordinate};

  return location;
};


/**
 * @param {Array.<Object>} sourceWaypoints
 * @return {Array.<Object>}
 * @private
 */
ol.format.MTJSON.prototype.readWaypoints_ = function(sourceWaypoints) {
  var waypoints = [];
  goog.array.forEach(sourceWaypoints, function(sourceWaypoint) {
    waypoints.push(this.readLocation_(sourceWaypoint));
  }, this);
  return waypoints;
};


/**
 * @param {Array.<Object>} sourceDetours
 * @return {Array.<Object>}
 * @private
 */
ol.format.MTJSON.prototype.readDetours_ = function(sourceDetours) {
  var detours = [];
  goog.array.forEach(sourceDetours, function(sourceDetour) {
    detours.push(sourceDetour);
  }, this);
  return detours;
};


/**
 * @param {Array.<Object>} sourceRoutes
 * @return {Array.<Object>}
 * @private
 */
ol.format.MTJSON.prototype.writeRoutes_ = function(sourceRoutes) {
  var routes = [];
  goog.array.forEach(sourceRoutes, function(sourceRoute) {
    routes.push(this.writeRoute_(sourceRoute));
  }, this);
  return routes;
};


/**
 * @param {Object} sourceRoute
 * @return {Object}
 * @private
 */
ol.format.MTJSON.prototype.writeRoute_ = function(sourceRoute) {
  var route = {};

  var summary = sourceRoute.summary;
  if (goog.isDefAndNotNull(summary)) {
    route[ol.control.MTJSON_ROUTE_SUMMARY] = summary;
  }

  var geometry = sourceRoute.geometry;
  goog.asserts.assertInstanceof(geometry, ol.geom.LineString);
  route[ol.control.MTJSON_ROUTE_COORDINATES] = geometry.getCoordinates();

  var legs = sourceRoute.legs;
  goog.asserts.assertArray(legs);
  route[ol.control.MTJSON_ROUTE_LEGS] = this.writeLegs_(legs);

  return route;
};


/**
 * @param {Array.<Object>} sourceLegs
 * @return {Array.<Object>}
 * @private
 */
ol.format.MTJSON.prototype.writeLegs_ = function(sourceLegs) {
  var legs = [];
  goog.array.forEach(sourceLegs, function(sourceLeg) {
    legs.push(this.writeLeg_(sourceLeg));
  }, this);
  return legs;
};


/**
 * @param {Object} sourceLeg
 * @return {Object}
 * @private
 */
ol.format.MTJSON.prototype.writeLeg_ = function(sourceLeg) {
  var leg = {};
  var key;

  // distance
  var distance, distanceText, distanceValue;
  distance = sourceLeg.distance;
  goog.asserts.assertObject(distance);
  distanceText = distance.text;
  distanceValue = distance.value;
  goog.asserts.assertNumber(distanceValue);
  goog.asserts.assertString(distanceText);
  key = ol.control.MTJSON_ROUTE_LEG_DISTANCE;
  leg[key] = {};
  leg[key][ol.control.MTJSON_ROUTE_LEG_DISTANCE_VALUE] = distanceValue;
  leg[key][ol.control.MTJSON_ROUTE_LEG_DISTANCE_TEXT] = distanceText;

  // duration
  var duration, durationText, durationValue;
  duration = sourceLeg.duration;
  goog.asserts.assertObject(duration);
  durationText = duration.text;
  durationValue = duration.value;
  goog.asserts.assertNumber(durationValue);
  goog.asserts.assertString(durationText);
  key = [ol.control.MTJSON_ROUTE_LEG_DURATION];
  leg[key] = {};
  leg[key][ol.control.MTJSON_ROUTE_LEG_DURATION_VALUE] = durationValue;
  leg[key][ol.control.MTJSON_ROUTE_LEG_DURATION_TEXT] = durationText;

  // start coordinate
  var start = sourceLeg.start_coordinate;
  goog.asserts.assertArray(start);
  leg[ol.control.MTJSON_ROUTE_LEG_START_COORDINATE] = start;

  // end coordinate
  var end = sourceLeg.end_coordinate;
  goog.asserts.assertArray(end);
  leg[ol.control.MTJSON_ROUTE_LEG_END_COORDINATE] = end;

  // start address
  var startAddress = sourceLeg.start_address;
  goog.asserts.assertString(startAddress);
  leg[ol.control.MTJSON_ROUTE_LEG_START_ADDRESS] = startAddress;

  // end address
  var endAddress = sourceLeg.end_address;
  goog.asserts.assertString(endAddress);
  leg[ol.control.MTJSON_ROUTE_LEG_END_ADDRESS] = endAddress;

  // steps
  var steps = sourceLeg.steps;
  goog.asserts.assertArray(steps);
  leg[ol.control.MTJSON_ROUTE_LEG_STEPS] = this.writeSteps_(steps);

  return leg;
};


/**
 * @param {Array.<Object>} sourceSteps
 * @return {Array.<Object>}
 * @private
 */
ol.format.MTJSON.prototype.writeSteps_ = function(sourceSteps) {
  var steps = [];
  goog.array.forEach(sourceSteps, function(sourceStep) {
    steps.push(this.writeStep_(sourceStep));
  }, this);
  return steps;
};


/**
 * @param {Object} sourceStep
 * @return {Object}
 * @private
 */
ol.format.MTJSON.prototype.writeStep_ = function(sourceStep) {
  var step = {};

  // start coordinate
  var start = sourceStep.start_coordinate;
  goog.asserts.assertArray(start);
  step[ol.control.MTJSON_ROUTE_LEG_STEP_START_COORDINATE] = start;

  // instructions
  var instructions = sourceStep.instructions;
  goog.asserts.assertString(instructions);
  step[ol.control.MTJSON_ROUTE_LEG_STEP_INSTRUCTIONS] = instructions;

  // maneuver
  var maneuver = sourceStep.maneuver;
  goog.asserts.assertString(maneuver);
  step[ol.control.MTJSON_ROUTE_LEG_STEP_MANEUVER] = maneuver;

  // distance
  var distance, distanceText, distanceValue;
  var key;
  distance = sourceStep.distance;
  goog.asserts.assertObject(distance);
  distanceText = distance.text;
  distanceValue = distance.value;
  goog.asserts.assertNumber(distanceValue);
  goog.asserts.assertString(distanceText);
  key = [ol.control.MTJSON_ROUTE_LEG_STEP_DISTANCE];
  step[key] = {};
  step[key][ol.control.MTJSON_ROUTE_LEG_STEP_DISTANCE_VALUE] = distanceValue;
  step[key][ol.control.MTJSON_ROUTE_LEG_STEP_DISTANCE_TEXT] = distanceText;
  step.distance = {'value': distanceValue, 'text': distanceText};

  return step;
};


/**
 * @param {Object} sourceLocation
 * @return {Object}
 * @private
 */
ol.format.MTJSON.prototype.writeLocation_ = function(sourceLocation) {
  var location = {};

  // name
  var name = sourceLocation.formatted_address;
  if (goog.isDefAndNotNull(name)) {
    location[ol.control.MTJSON_LOCATION_NAME] = name;
  }

  // coordinate
  var geometry = sourceLocation.geometry;
  goog.asserts.assertObject(geometry);
  var coordinate = geometry.coordinate;
  goog.asserts.assertArray(coordinate);
  location[ol.control.MTJSON_LOCATION_COORDINATE] = coordinate;

  return location;
};


/**
 * @param {Array.<Object>} sourceWaypoints
 * @return {Array.<Object>}
 * @private
 */
ol.format.MTJSON.prototype.writeWaypoints_ = function(sourceWaypoints) {
  var waypoints = [];
  goog.array.forEach(sourceWaypoints, function(sourceWaypoint) {
    waypoints.push(this.writeLocation_(sourceWaypoint));
  }, this);
  return waypoints;
};


/**
 * @param {Array.<Object>} sourceDetours
 * @return {Array.<Object>}
 * @private
 */
ol.format.MTJSON.prototype.writeDetours_ = function(sourceDetours) {
  var detours = [];
  goog.array.forEach(sourceDetours, function(sourceDetour) {
    detours.push(sourceDetour);
  }, this);
  return detours;
};
