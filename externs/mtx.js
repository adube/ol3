/**
 * @type {Object}
 */
var mtx;


/**
 * @typedef {{description: (number),
 *     id: (number),
 *     lat: (number),
 *     lon: (number),
 *     text: (string)}}
 */
mtx.format.Address;


/**
 * @type {string}
 */
mtx.format.Address.prototype.description;


/**
 * @type {number}
 */
mtx.format.Address.prototype.id;


/**
 * @type {number}
 */
mtx.format.Address.prototype.lat;


/**
 * @type {number}
 */
mtx.format.Address.prototype.lon;


/**
 * @type {string}
 */
mtx.format.Address.prototype.text;


/**
 * @type {Array.<number>}
 */
google.maps.DirectionsLeg.prototype.end_coordinate;


/**
 * @type {Array.<number>}
 */
google.maps.DirectionsLeg.prototype.start_coordinate;


/**
 * @type {string}
 */
google.maps.DirectionsStep.prototype.maneuver;
