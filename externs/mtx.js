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
 * @typedef {{href: (string|undefined),
 *     data: (Object|undefined)}}
 */
mtx.format.ContactInfo;


/**
 * @type {string|undefined}
 */
mtx.format.ContactInfo.prototype.href;


/**
 * @type {Object|undefined}
 */
mtx.format.ContactInfo.prototype.data;


/**
 * @typedef {{errors: (Array.<string>),
 *     status: (string),
 *     data: (Array|undefined),
 *     id: (number|undefined)}}
 */
mtx.format.ResponseJson;


/**
 * @type {Array.<string>}
 */
mtx.format.ResponseJson.prototype.errors;


/**
 * @type {string}
 */
mtx.format.ResponseJson.prototype.status;


/**
 * @type {Array|undefined}
 */
mtx.format.ResponseJson.prototype.data;


/**
 * @type {number|undefined}
 */
mtx.format.ResponseJson.prototype.id;


/**
 * @type {string}
 */
google.maps.prototype.mt_corresponding

/**
 * @type {Array.<number>}
 */
google.maps.DirectionsLeg.prototype.end_coordinate;


/**
 * @type {Array.<number>}
 */
google.maps.DirectionsLeg.prototype.start_coordinate;


/**
 * @type {Array.<Array.<number>>}
 */
google.maps.DirectionsStep.prototype.coordinates;


/**
 * @type {string}
 */
google.maps.DirectionsStep.prototype.maneuver;


/**
 * @type {string}
 */
google.maps.DirectionsRoute.prototype.summary;


/**
 * @type {Object}
 */
google.maps.DirectionsRoute.prototype.mt_usager;


/**
 * @type {number}
 */
google.maps.mt_usager.prototype.mt_id;


/**
 * @type {string}
 */
google.maps.mt_usager.prototype.mt_last_name;


/**
 * @type {string}
 */
google.maps.mt_usager.prototype.mt_first_name;


/**
 * @type {string}
 */
google.maps.mt_usager.prototype.mt_contact;

/**
 * @type {string}
 */
google.maps.mt_usager.prototype.mt_anonymous;

/**
 * @type {string}
 */
google.maps.mt_usager.prototype.mt_photo;


/**
 * @type {number}
 */
google.maps.mt_usager.prototype.mt_evaluation;


/**
 * @type {number}
 */
google.maps.mt_usager.prototype.mt_group_approved;


/**
 * @type {string}
 */
google.maps.mt_usager.prototype.mt_group_name;


/**
 * @type {string}
 */
google.maps.mt_usager.prototype.mt_url;


/**
 * @type {Object}
 */
google.maps.DirectionsRoute.prototype.mt_offre;


/**
 * @type {number}
 */
google.maps.mt_offre.prototype.mt_id;


/**
 * @type {boolean}
 */
google.maps.mt_offre.prototype.mt_mode_offre;


/**
 * @type {boolean}
 */
google.maps.mt_offre.prototype.mt_vehicule;


/**
 * @type {number}
 */
google.maps.mt_offre.prototype.mt_est_conducteur;


/**
 * @type {number}
 */
google.maps.mt_offre.prototype.mt_places_dispo;


/**
 * @type {string}
 */
google.maps.mt_offre.prototype.mt_end_address;

/**
 * @type {number}
 */
google.maps.mt_offre.prototype.mt_fume;


/**
 * @type {number}
 */
google.maps.mt_offre.prototype.mt_atmosphere;


/**
 * @type {number}
 */
google.maps.mt_offre.prototype.mt_distance_diff;


/**
 * @type {number}
 */
google.maps.mt_offre.prototype.mt_duration_diff;


/**
 * @type {string}
 */
google.maps.mt_offre.prototype.mt_prix;


/**
 * @type {string}
 */
google.maps.mt_offre.prototype.mt_date;


/**
 * @type {string}
 */
google.maps.mt_offre.prototype.mt_heure;


/**
 * @type {string}
 */
google.maps.mt_offre.prototype.mt_horaire_aller;


/**
 * @type {boolean}
 */
google.maps.mt_offre.prototype.mt_horaire_aller_reg;


/**
 * @type {boolean}
 */
google.maps.mt_offre.prototype.mt_horaire_irr_url;


/**
 * @type {number}
 */
google.maps.mt_offre.prototype.mt_horaire_ponctuelle;


/**
 * @type {string}
 */
google.maps.mt_offre.prototype.mt_horaire_retour;


/**
 * @type {?boolean}
 */
google.maps.mt_offre.prototype.mt_horaire_retour_reg;


/**
 * @type {string}
 */
google.maps.mt_offre.prototype.mt_start_address;


/**
 * @type {string}
 */
google.maps.mt_offre.prototype.mt_offer_name;


/**
 * @type {string}
 */
google.maps.mt_offre.prototype.mt_favori;


/**
 * @type {Array.<Object>}
 */
google.maps.DirectionsRoute.prototype.mt_organisations;


/**
 * @type {google.maps.TravelMode.<(number|string)>|number|string}
 */
google.maps.DirectionsRoute.prototype.mt_travel_mode;


/**
 * @type {number}
 */
google.maps.DirectionsRoute.prototype.mt_weight;


/**
 * @type {string}
 */
google.maps.mt_organisations.prototype.mt_logo;


/**
 * @type {string}
 */
google.maps.mt_organisations.prototype.mt_name;


/**
 * @type {string}
 */
google.maps.mt_organisations.prototype.mt_status;


/**
 * @type {Array.<Object>}
 */
google.maps.DirectionsRoute.prototype.mt_favoris;


/**
 * @type {string}
 */
google.maps.mt_favoris.prototype.mt_status;


/**
 * @type {string}
 */
google.maps.mt_favoris.prototype.mt_url;


/**
 * @type {string}
 */
google.maps.mt_organisations.prototype.mt_url;


/**
 * @param {string|Object.<string,*>=} opt_option
 * @return {!jQuery}
 */
jQuery.prototype.disableSelection = function(opt_option) {};


/**
 * @param {string|Object.<string,*>=} opt_option
 * @return {!jQuery}
 */
jQuery.prototype.sortable = function(opt_option) {};
