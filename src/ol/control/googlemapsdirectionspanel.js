goog.provide('ol.control.GoogleMapsDirectionsPanel');

goog.require('goog.Uri.QueryData');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.json');
goog.require('goog.net.EventType');
goog.require('goog.net.XhrIo');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.style');
goog.require('ol.Collection');
goog.require('ol.MapBrowserEvent.EventType');
goog.require('ol.Overlay');
goog.require('ol.OverlayPositioning');
goog.require('ol.control.Control');
goog.require('ol.extent');
goog.require('ol.format.GeoJSON');
goog.require('ol.geom.LineString');
goog.require('ol.proj');


/**
 * @define {number} Default xize in pixels of the top-left, top-right,
 * bottom-left and bottom-right corners where a popup position should never
 * be.  This should set around half the size of the popup.
 */
ol.control.GOOGLEMAPSDIRECTIONSPANEL_CORNER_PIXEL_SIZE = 100;


/**
 * @define {number} Default buffer size in pixels to apply to the map view
 * extent when checking if a coordinate is in the extent.
 */
ol.control.GOOGLEMAPSDIRECTIONSPANEL_PIXEL_BUFFER = 30;



/**
 * @classdesc
 * Todo
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.GoogleMapsDirectionsPanelOptions=} opt_options Options.
 * @api
 */
ol.control.GoogleMapsDirectionsPanel = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  /**
   * i18n - around
   * @type {string}
   */
  this.aroundText = goog.isDef(options.aroundText) ?
      options.aroundText : 'about';

  /**
   * i18n - contact
   * @type {string}
   */
  this.contactText = goog.isDef(options.contactText) ?
      options.contactText : 'Contact';

  /**
   * i18n - copyright
   * @type {string}
   */
  this.copyrightText = goog.isDef(options.copyrightText) ?
      options.copyrightText : '©2014 Google';

  /**
   * i18n - detour
   * @type {string}
   */
  this.detourText = goog.isDef(options.detourText) ?
      options.detourText : 'Detour';

  /**
   * i18n - from
   * @type {string}
   */
  this.fromText = goog.isDef(options.fromText) ? options.fromText : 'From';

  /**
   * i18n - go
   * @type {string}
   */
  this.goText = goog.isDef(options.goText) ?
      options.goText : 'Go';

  /**
   * i18n - hideDetails
   * @type {string}
   */
  this.hideDetailsText = goog.isDef(options.hideDetailsText) ?
      options.hideDetailsText : 'Hide details';

  /**
   * i18n - pathDetails
   * @type {string}
   */
  this.pathDetailsText = goog.isDef(options.pathDetailsText) ?
      options.pathDetailsText : 'Path details';

  /**
   * i18n - anonymousContactMessage
   * @type {string}
   */
  this.anonymousContactMessage = goog.isDef(options.anonymousContactMessage) ?
      options.anonymousContactMessage :
          'You must be connected to contact users.';
  /**
   * i18n - privateContactMessage
   * @type {string}
   */
  this.privateContactMessage = goog.isDef(options.privateContactMessage) ?
      options.privateContactMessage :
          'This user does not wish to share his email.';


  /**
   * i18n - ponctual
   * @type {string}
   */
  this.ponctualText = goog.isDef(options.ponctualText) ?
      options.ponctualText : 'Ponctual';

  /**
   * i18n - recurring
   * @type {string}
   */
  this.recurringText = goog.isDef(options.recurringText) ?
      options.recurringText : 'Recurring';

  /**
   * i18n - return
   * @type {string}
   */
  this.returnText = goog.isDef(options.returnText) ?
      options.returnText : 'Return';

  /**
   * i18n - showDetails
   * @type {string}
   */
  this.showDetailsText = goog.isDef(options.showDetailsText) ?
      options.showDetailsText : 'Show details';

  /**
   * i18n - showMore
   * @type {string}
   */
  this.showMoreText = goog.isDef(options.showMoreText) ?
      options.showMoreText : 'Show more';

  /**
   * i18n - suggestedRoutes
   * @type {string}
   */
  this.suggestedRoutesText = goog.isDef(options.suggestedRoutesText) ?
      options.suggestedRoutesText : 'Suggested Routes';

  /**
   * i18n - to
   * @type {string}
   */
  this.toText = goog.isDef(options.toText) ? options.toText : 'To';

  /**
   * i18n - totalDistance
   * @type {string}
   */
  this.totalDistanceText = goog.isDef(options.totalDistanceText) ?
      options.totalDistanceText : 'Total distance';

  /**
   * i18n - totalDuration
   * @type {string}
   */
  this.totalDurationText = goog.isDef(options.totalDurationText) ?
      options.totalDurationText : 'Total duration';

  /**
   * i18n - correspondance
   * @type {string}
   */
  this.correspondanceText = goog.isDef(options.correspondanceText) ?
      options.correspondanceText :
      'Désolé aucun résultat correspondant à votre recherche ' +
      'n\'a été trouvé, ' + 'voici quelques résultats qui pourraient ' +
      'tout de même vous intéresser.';

  /**
   * i18n - distance
   * @type {string}
   */
  this.distanceText = goog.isDef(options.distanceText) ?
      options.distanceText : 'Distance';

  /**
   * i18n - duration
   * @type {string}
   */
  this.durationText = goog.isDef(options.durationText) ?
      options.durationText : 'Duration';

  /**
   * i18n - addBookmarkAnother
   * @type {string}
   */
  this.addBookmarkAnotherText = goog.isDef(options.addBookmarkAnotherText) ?
      options.addBookmarkAnotherText :
      'This result is already in your bookmarks for an other route';

  /**
   * i18n - addBookmarkNone
   * @type {string}
   */
  this.addBookmarkNoneText = goog.isDef(options.addBookmarkNoneText) ?
      options.addBookmarkNoneText : 'Add bookmark';

  /**
   * i18n - addBookmarkThis
   * @type {string}
   */
  this.addBookmarkThisText = goog.isDef(options.addBookmarkThisText) ?
      options.addBookmarkThisText :
      'This result is already in your bookmarks';


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
  this.cornerPixelSize_ = goog.isDefAndNotNull(options.cornerPixelSize) ?
      options.cornerPixelSize :
      ol.control.GOOGLEMAPSDIRECTIONSPANEL_CORNER_PIXEL_SIZE;


  /**
   * @type {number}
   * @private
   */
  this.pixelBuffer_ = goog.isDefAndNotNull(options.pixelBuffer) ?
      options.pixelBuffer : ol.control.GOOGLEMAPSDIRECTIONSPANEL_PIXEL_BUFFER;


  /**
   * @type {number} The maximum number of results to show at a time.  If
   *     more results are returned, then a 'show more' button is added
   *     at the end to show 'limit' more.  Only used when mode is 'complex'.
   * @private
   */
  this.limit_ = goog.isDef(options.limit) ? options.limit : 0;


  /**
   * @type {number} The page counter used to keep track of the results shown
   *     and when to show/hide the 'show more' button
   * @private
   */
  this.limitPageCounter_ = 0;


  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + ' ' + ol.css.CLASS_UNSELECTABLE
  });

  /**
   * @type {Element}
   * @private
   */
  this.workInProgressEl_ = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-work-in-progress'
  });
  goog.dom.appendChild(element, this.workInProgressEl_);
  this.toggleWorkInProgress(false);

  /**
   * @type {Element}
   * @private
   */
  this.correspondingEl_ = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-correspondance'
  });
  goog.dom.appendChild(
      this.correspondingEl_,
      goog.dom.createTextNode(this.correspondanceText)
  );
  goog.dom.appendChild(element, this.correspondingEl_);
  this.toggleCorrespondingEl(false);

  /**
   * The container element for the route selector
   * @type {Element}
   * @private
   */
  this.routeSelectorEl_ = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-selector'
  });
  goog.dom.appendChild(element, this.routeSelectorEl_);

  var routeSelectorToggleEl = goog.dom.createDom(goog.dom.TagName.A, {
    'id': classPrefix + '-selector-toggle',
    'style': 'display:none',
    'class': classPrefix + '-selector-toggle-opened'
  });
  goog.events.listen(
      routeSelectorToggleEl,
      ol.MapBrowserEvent.EventType.CLICK,
      this.handleToggleElementPress_, false, this);

  goog.dom.appendChild(routeSelectorToggleEl, goog.dom.createTextNode(
      this.suggestedRoutesText));
  goog.dom.appendChild(this.routeSelectorEl_, routeSelectorToggleEl);


  var listHeaderEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-selector-header'
  });
  goog.dom.appendChild(listHeaderEl, goog.dom.createTextNode(
      this.suggestedRoutesText));
  goog.dom.appendChild(this.routeSelectorEl_, listHeaderEl);


  /**
   * The container element for route to select
   * @type {Element}
   * @private
   */
  this.routeSelectorListEl_ = goog.dom.createDom(goog.dom.TagName.OL, {
    'class': classPrefix + '-selector-list'
  });
  goog.dom.appendChild(this.routeSelectorEl_, this.routeSelectorListEl_);


  /**
   * A collection of route selector elements
   * @type {ol.Collection}
   * @private
   */
  this.clickableSelectorElements_ = new ol.Collection();


  /**
   * The container element for routes
   * @type {Element}
   * @private
   */
  this.routesEl_ = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-routes'
  });
  goog.dom.appendChild(element, this.routesEl_);


  /**
   * A collection of LegHeader, Tail and Step that can be clicked to show
   * a popup on the map.  Keep track of them in order to listen and unlisten
   * to browser events accordingly.
   * @type {ol.Collection}
   * @private
   */
  this.clickableDirectionElements_ = new ol.Collection();


  var popupEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-popup ' + ol.css.CLASS_UNSELECTABLE
  });


  /**
   * @type {ol.Collection}
   * @private
   */
  this.iconImageElements_ = new ol.Collection();


  /**
   * @type {ol.Collection}
   * @private
   */
  this.routes_ = new ol.Collection();


  /**
   * @type {?number}
   * @private
   */
  this.selectedRouteIndex_ = null;

  /**
   * How this widget behave when parsing the json response in setDirection
   * Possible values are:
   *  - 'simple': Directions panel will show basic route information
   *              with road summary of the selected route. First route
   *              is selected by default.
   *  - 'complex': Directions panel will show avalaible offer with the
   *               road summary if the more detail link is selected.
   * @type {string}
   * @private
   */
  this.mode_ = goog.isDef(options.mode) ?
      options.mode : ol.control.GoogleMapsDirectionsPanel.Mode.SIMPLE;


  /**
   * @type {ol.Overlay}
   * @private
   */
  this.popup_ = new ol.Overlay({
    element: popupEl,
    positioning: ol.OverlayPositioning.BOTTOM_CENTER,
    stopEvent: false
  });

  /**
   * @type {string}
   * @private
   */
  this.popupPlacement_ = 'top';

  /**
   * @type {?Element}
   * @private
   */
  this.showMoreButtonEl_ = null;

  /**
   * @type {?Element}
   * @private
   */
  this.showDetailsButtonEl_ = null;

  if (this.mode_ === ol.control.GoogleMapsDirectionsPanel.Mode.SIMPLE) {
    this.showDetailsButtonEl_ = goog.dom.createDom(goog.dom.TagName.BUTTON, {
      'class': classPrefix + '-show-details-button button gris'
    });
    goog.dom.appendChild(this.showDetailsButtonEl_, goog.dom.createTextNode(
        this.showDetailsText));
    goog.dom.appendChild(element, this.showDetailsButtonEl_);

    goog.events.listen(this.showDetailsButtonEl_, [
      goog.events.EventType.CLICK
    ], this.handleShowDetailsButtonPress_, false, this);

    // details are hidden by default
    this.toogleDetailsVisibility_(false);
  }

  /**
   * The flag used to determine if this control is on read-only mode or not.
   * @type {boolean}
   * @private
   */
  this.readOnlyEnabled_ = false;


  /**
   * @type {Object}
   * @private
   */
  this.bookmarkHeaders_ = goog.isDef(options.bookmarkHeaders) ?
      options.bookmarkHeaders : {};


  /**
   * @type {boolean}
   * @private
   */
  this.bookmarkUsePostMethod_ = goog.isDef(options.bookmarkUsePostMethod) ?
      options.bookmarkUsePostMethod : true;


  /**
   * Flag used to 'pause' the contact request (i.e. when a user click on
   * the contact link) to make sure the according route has been saved
   * as bookmark first.
   * @type {boolean}
   * @private
   */
  this.contactRequestPending_ = false;


  /**
   * Hash of properties stored when a user clicks the contact link.
   * @type {?mtx.format.ContactInfo}
   * @private
   */
  this.contactInfo_ = null;


  goog.base(this, {
    element: element,
    target: options.target
  });

  // hide itself
  this.toggleSelfVisibility_(false);

};
goog.inherits(ol.control.GoogleMapsDirectionsPanel, ol.control.Control);


/**
 * @enum {number}
 */
ol.control.GoogleMapsDirectionsPanel.Ambiance = {
  TALK: 1,
  MUSIC: 2,
  RADIO: 3
};


/**
 * @enum {string}
 */
ol.control.GoogleMapsDirectionsPanel.BookmarkStatus = {
  ANOTHER: 'another',
  NONE: 'none',
  THIS: 'this'
};


/**
 * @enum {string}
 */
ol.control.GoogleMapsDirectionsPanel.EventType = {
  CLEAR: goog.events.getUniqueId('CLEAR'),
  CONTACT: goog.events.getUniqueId('CONTACT'),
  HOVER: goog.events.getUniqueId('HOVER'),
  UNHOVER: goog.events.getUniqueId('UNHOVER'),
  SELECT: goog.events.getUniqueId('SELECT'),
  SET: goog.events.getUniqueId('SET'),
  UNSELECT: goog.events.getUniqueId('UNSELECT')
};


/**
 * @enum {string}
 */
ol.control.GoogleMapsDirectionsPanel.Mode = {
  SIMPLE: 'simple',
  COMPLEX: 'complex'
};


/**
 * Calculate route travel mode.  Can either come from mt_travel_mode at
 * the route level (if it comes from the multimodal service), else it is
 * calculated using the steps.  The first occurence of bicycling, transit
 * or driving is immediately used.  Only if all occurences of travel_mode
 * in the steps are walking that the travel mode gets returned as walking.
 *
 * @param {google.maps.DirectionsRoute} route
 * @return {google.maps.TravelMode.<(number|string)>|number|string}
 */
ol.control.GoogleMapsDirectionsPanel.prototype.calculateRouteTravelMode =
    function(route) {
  var travelMode;

  // if already set, use it
  if (goog.isDef(route.mt_travel_mode)) {
    travelMode = route.mt_travel_mode;
  } else {
    // calculate travel mode, then save
    goog.array.every(route.legs, function(leg) {
      goog.array.every(leg.steps, function(step) {
        if (step.travel_mode === google.maps.TravelMode.BICYCLING ||
            step.travel_mode === google.maps.TravelMode.DRIVING ||
            step.travel_mode === google.maps.TravelMode.TRANSIT) {
          travelMode = step.travel_mode;
        }
        return !goog.isDefAndNotNull(travelMode);
      }, this);
      return !goog.isDefAndNotNull(travelMode);
    });

    if (!goog.isDefAndNotNull(travelMode)) {
      travelMode = google.maps.TravelMode.WALKING;
    }

    route.mt_travel_mode = travelMode;
  }

  return travelMode;
};


/**
 * Calculate a route weight.  This is done by browsing each step of each
 * leg. Their duration is then used to calculate the weight depending on
 * the step travel mode. If already set as route.mt_weight, use it instead.
 *
 * @param {google.maps.DirectionsRoute} route
 * @return {number}
 */
ol.control.GoogleMapsDirectionsPanel.prototype.calculateRouteWeight =
    function(route) {

  var weight;
  var hasDriving = false;

  // if already set, use it
  if (goog.isDef(route.mt_weight)) {
    weight = route.mt_weight;
  } else {
    // calculate. then save
    weight = 0;
    goog.array.forEach(route.legs, function(leg) {
      goog.array.forEach(leg.steps, function(step) {
        if (step.travel_mode === google.maps.TravelMode.BICYCLING ||
            step.travel_mode === google.maps.TravelMode.TRANSIT ||
            step.travel_mode === google.maps.TravelMode.WALKING) {
          weight += step.duration.value;
        } else {
          weight += step.duration.value * 3;
          hasDriving = true;
        }
      }, this);
    });

    // if the route uses driving travel mode, add 6 minutes to weight
    if (hasDriving) {
      weight += 360;
    }

    route.mt_weight = weight;
  }

  return weight;
};


/**
 * Clear the current directions.
 */
ol.control.GoogleMapsDirectionsPanel.prototype.clearDirections = function() {

  // browse LegHeader, Tail and Step elements that had events listeners
  // to unlisten them
  this.clickableDirectionElements_.forEach(function(element) {
    goog.events.unlisten(element, [
      goog.events.EventType.CLICK
    ], this.handleElementPress_, false, this);
  }, this);
  this.clickableDirectionElements_.clear();

  // unlisten selector elements too
  this.clickableSelectorElements_.forEach(function(element) {
    goog.events.unlisten(element, [
      goog.events.EventType.CLICK
    ], this.handleSelectorElementPress_, false, this);
  }, this);
  this.clickableSelectorElements_.clear();

  // destroy 'show more' button
  this.destroyShowMoreButton_();

  // remove children
  goog.dom.removeChildren(this.routesEl_);
  goog.dom.removeChildren(this.routeSelectorListEl_);

  // destroy popup
  this.destroyPopup_();

  // clear routes and selected route
  this.routes_.clear();
  this.selectedRouteIndex_ = null;

  // clear icon images
  this.iconImageElements_.clear();

  //Hide suggested routes link and corresponding text
  //this.selectorVisible_(false);
  this.toggleCorrespondingEl(false);

  // reset limit page counter
  this.limitPageCounter_ = 0;

  // hide itself
  this.toggleSelfVisibility_(false);

  goog.events.dispatchEvent(this,
      ol.control.GoogleMapsDirectionsPanel.EventType.CLEAR);
};


/**
 * Build the direction panel content using the passed direction results.
 * @param {google.maps.DirectionsResult|Object} directionsResult
 * @param {Array.<string>} imageSrc
 */
ol.control.GoogleMapsDirectionsPanel.prototype.setDirections = function(
    directionsResult, imageSrc) {

  var routesEl = this.routesEl_;
  var routeSelectorListEl = this.routeSelectorListEl_;
  var routeEl;
  var offerEl;
  var containerEl;
  var classPrefix = this.classPrefix_;
  var routeObj;

  // first, clear any previous direction infos
  this.clearDirections();

  if (directionsResult.mt_corresponding == 0) {
    this.toggleCorrespondingEl(true);
  }

  // add routes
  goog.array.forEach(directionsResult.routes, function(route, index) {
    routeObj = {};
    routeObj.result = route;

    if (this.mode_ == ol.control.GoogleMapsDirectionsPanel.Mode.SIMPLE) {
      routeEl = this.createRouteElement_(route, index, imageSrc);
      goog.dom.appendChild(routesEl, routeEl);

      goog.dom.appendChild(
          routeSelectorListEl,
          this.createRouteSelectorItemElement_(route, index)
      );
    }
    else {
      containerEl = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': classPrefix + '-offer-result',
        'data-route-index': index,
        'data-route-weight': this.calculateRouteWeight(route)
      });

      offerEl = this.createOfferElement_(route, index);
      goog.dom.appendChild(containerEl, offerEl);

      routeEl = this.createRouteElement_(route, index, imageSrc);
      goog.dom.appendChild(containerEl, routeEl);

      goog.dom.appendChild(routesEl, containerEl);
    }

    routeObj.directionEl = routeEl;

    this.routes_.push(routeObj);
  }, this);

  // add 'show more' button
  if (this.mode_ == ol.control.GoogleMapsDirectionsPanel.Mode.COMPLEX &&
      this.limit_) {
    this.createShowMoreButton_(routesEl);
    this.toggleComplexModeResults_();
  }

  // copyright
  var copyright = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-copyright'
  });
  goog.dom.appendChild(routesEl, copyright);
  if (goog.isDefAndNotNull(this.copyrightText)) {
    var copyrightText = goog.dom.createTextNode(this.copyrightText);
    goog.dom.appendChild(copyright, copyrightText);
  }

  if (this.mode_ == ol.control.GoogleMapsDirectionsPanel.Mode.SIMPLE) {
    // set first route as default selection
    if (this.routes_.getLength()) {
      this.select_(0);
    }
    // Display the Suggested routes button
    //this.selectorVisible_(true);
  }

  // show itself
  this.toggleSelfVisibility_(true);

  goog.events.dispatchEvent(this,
      ol.control.GoogleMapsDirectionsPanel.EventType.SET);
};


/**
 * Get contact info.
 * @return {?mtx.format.ContactInfo}
 */
ol.control.GoogleMapsDirectionsPanel.prototype.getContactInfo = function() {
  return this.contactInfo_;
};


/**
 * Select a route, which displays its direction details.  Unselect any
 * previously selected route too.
 * @param {number} index Index of the route to select
 */
ol.control.GoogleMapsDirectionsPanel.prototype.select = function(index) {
  this.select_(index);
};


/**
 * Returns the currently selected route legs, each as GeoJSON.
 *
 * How it's done: the leg steps 'path' locations are transformed and collected
 * all together for each leg, then written as GeoJSON. If the 'path' is not
 * set, then GoogleMaps didn't return the object, so we check the step
 * 'coordinates' property instead.
 * @return {Array.<GeoJSONObject>}
 */
ol.control.GoogleMapsDirectionsPanel.prototype.getSelectedRouteLegsAsGeoJSON =
    function() {

  var geojson = [];
  var legCoordinates;
  var format = new ol.format.GeoJSON();

  var route = this.getSelectedRoute();
  if (route) {
    goog.array.forEach(route.legs, function(leg) {
      legCoordinates = [];
      goog.array.forEach(leg.steps, function(step, index) {
        legCoordinates = goog.array.concat(legCoordinates, step.coordinates);
      }, this);

      geojson.push(
          format.writeGeometry(
              new ol.geom.LineString(legCoordinates)
          )
      );
    });
  }

  return geojson;
};


/**
 * Returns the currently selected route total distance, in meters.
 *
 * @return {number}
 */
ol.control.GoogleMapsDirectionsPanel.prototype.getSelectedRouteDistanceValue =
    function() {

  var distance = 0;
  var route = this.getSelectedRoute();

  route && goog.array.forEach(route.legs, function(leg) {
    distance += leg.distance.value;
  }, this);

  return distance;
};


/**
 * Returns the currently selected route total duration, in seconds.
 *
 * @return {number}
 */
ol.control.GoogleMapsDirectionsPanel.prototype.getSelectedRouteDurationValue =
    function() {

  var duration = 0;
  var route = this.getSelectedRoute();

  route && goog.array.forEach(route.legs, function(leg) {
    duration += leg.duration.value;
  }, this);

  return duration;
};


/**
 * Returns the selected route results.  Useful for 'save' purpose.
 * @return {Object|boolean}
 */
ol.control.GoogleMapsDirectionsPanel.prototype.getSelectedRoute = function() {
  var routeResults = false;

  if (!goog.isNull(this.selectedRouteIndex_)) {
    routeResults = this.routes_.item(this.selectedRouteIndex_).result;
  }

  return routeResults;
};


/**
 * Returns the selected route index
 * @return {?number}
 */
ol.control.GoogleMapsDirectionsPanel.prototype.getSelectedRouteIndex =
    function() {
  return this.selectedRouteIndex_;
};


/**
 * Change all icon images src that are currently in DOM with those sent
 * @param {Array.<string>} iconImages The list of icons to use
 */
ol.control.GoogleMapsDirectionsPanel.prototype.setIconImages =
    function(iconImages) {

  var iconImage;

  this.iconImageElements_.forEach(function(iconImageEl, index) {
    iconImage = iconImages[index];
    if (goog.isDefAndNotNull(iconImage)) {
      iconImageEl.src = iconImage;
    }
  }, this);
};


/**
 * Show or hide the corresponding text div element
 * @param {boolean} noCorresponding Whether to show the 'no corresponding' div
 * element or not
 */
ol.control.GoogleMapsDirectionsPanel.prototype.toggleCorrespondingEl =
    function(noCorresponding) {
  var display = (noCorresponding === true) ? '' : 'none';
  goog.style.setStyle(this.correspondingEl_, 'display', display);
};


/**
 * Enable/Disable the read-only mode.
 * @param {boolean} readOnly Whether to enable or disable the read-only mode.
 */
ol.control.GoogleMapsDirectionsPanel.prototype.toggleReadOnly = function(
    readOnly) {

  if (readOnly === this.readOnlyEnabled_) {
    return;
  }

  var classPrefix = this.classPrefix_;
  var readOnlyClass = classPrefix + '-read-only';

  this.readOnlyEnabled_ = readOnly;

  if (readOnly === true) {
    goog.dom.classes.add(this.element, readOnlyClass);
  } else {
    goog.dom.classes.remove(this.element, readOnlyClass);
  }
};


/**
 * Show or hide the work in progress div element
 * @param {boolean} inProgress Whether to show the in progress element or not
 */
ol.control.GoogleMapsDirectionsPanel.prototype.toggleWorkInProgress =
    function(inProgress) {
  var display = (inProgress === true) ? '' : 'none';
  goog.style.setStyle(this.workInProgressEl_, 'display', display);

  if (inProgress === true) {
    this.toggleSelfVisibility_(true);
  }
};


/**
 * Create all elements required for a route
 * @param {google.maps.DirectionsRoute} route
 * @param {number} index
 * @param {Array.<string>} imgSrc
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createRouteElement_ =
    function(route, index, imgSrc) {

  var legEl;
  var tailEl;
  var classPrefix = this.classPrefix_;

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-route',
    'style': 'display: none;',
    'data-route-index': index
  });

  if (goog.isDef(route.mt_usager)) {
    goog.dom.classes.add(element, classPrefix + '-route-mt');
  }

  // total distance
  var totalDistanceText = this.totalDistanceText + ': ' +
      this.calculateRouteTotalDistance_(route);
  var totalDistanceEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-route-total-distance'
  });
  goog.dom.appendChild(element, totalDistanceEl);
  goog.dom.appendChild(
      totalDistanceEl, goog.dom.createTextNode(totalDistanceText));

  // total duration
  var totalDurationText = this.totalDurationText + ': ' +
      this.aroundText + ' ' + this.calculateRouteTotalDuration_(route);
  var totalDurationEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-route-total-duration'
  });
  goog.dom.appendChild(element, totalDurationEl);
  goog.dom.appendChild(
      totalDurationEl, goog.dom.createTextNode(totalDurationText));

  var legCounter = 0;

  // legs
  goog.array.forEach(route.legs, function(leg) {
    legEl = this.createLegElement_(leg, imgSrc[legCounter]);
    goog.dom.appendChild(element, legEl);
    legCounter++;
  }, this);

  // tail
  var lastLeg = route.legs[route.legs.length - 1];
  tailEl = this.createTailElement_(lastLeg, imgSrc[legCounter]);
  goog.dom.appendChild(element, tailEl);

  return element;
};


/**
 * Create all element required for an offer
 * @param {google.maps.DirectionsRoute} route
 * @param {number} index
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createOfferElement_ =
    function(route, index) {

  var classPrefix = this.classPrefix_;

  var elementClasses = [];
  elementClasses.push(classPrefix + '-offer');
  if (index % 2 === 0) {
    elementClasses.push(classPrefix + '-offer-even');
  } else {
    elementClasses.push(classPrefix + '-offer-odd');
  }
  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': elementClasses.join(' ')
  });

  // numEl
  var numEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-offer-num'
  });
  goog.dom.appendChild(element, numEl);
  goog.dom.appendChild(numEl, goog.dom.createTextNode(index + 1));

  // bookmarkEl (link or span)
  if (goog.isDef(route.mt_favori)) {
    var statusList = ol.control.GoogleMapsDirectionsPanel.BookmarkStatus;
    var bookmarkEl;
    if (route.mt_favori.mt_status == statusList.NONE) {
      bookmarkEl = goog.dom.createDom(goog.dom.TagName.A, {
        'href': route.mt_favori.mt_url,
        'data-route-index': index,
        'class': [
          classPrefix + '-bookmark',
          classPrefix + '-bookmark-none'
        ].join(' '),
        'title': this.addBookmarkNoneText
      });
      goog.events.listen(bookmarkEl, [
        goog.events.EventType.CLICK
      ], this.handleBookmarkElementPress_, false, this);
      goog.dom.appendChild(element, this.createBookmarkInactiveElement_(false));
    } else if (route.mt_favori.mt_status == statusList.ANOTHER) {
      bookmarkEl = goog.dom.createDom(goog.dom.TagName.A, {
        'href': route.mt_favori.mt_url,
        'data-route-index': index,
        'class': [
          classPrefix + '-bookmark',
          classPrefix + '-bookmark-another'
        ].join(' '),
        'title': this.addBookmarkAnotherText
      });
      goog.events.listen(bookmarkEl, [
        goog.events.EventType.CLICK
      ], this.handleBookmarkElementPress_, false, this);
      goog.dom.appendChild(element, this.createBookmarkInactiveElement_(false));
    } else {
      bookmarkEl = this.createBookmarkInactiveElement_(true);
    }
    goog.dom.appendChild(element, bookmarkEl);
  }

  // left and right containers creation
  var leftCtnEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-offer-left'
  });
  goog.dom.appendChild(element, leftCtnEl);

  var rightCtnEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-offer-right'
  });
  goog.dom.appendChild(element, rightCtnEl);

  // if route has any 'mt_*' property, that means the response comes
  // from the multimodal service
  if (goog.isDef(route.mt_usager)) {
    goog.dom.classes.add(element, classPrefix + '-offer-mt');

    // == LEFT START ==

    // -- user picture, is embedded in an anchor if mt_url is set --
    var userPic = goog.dom.createDom(goog.dom.TagName.IMG, {
      'src': route.mt_usager.mt_photo,
      'class': classPrefix + '-offer-user-pic'
    });
    if (goog.isDef(route.mt_usager.mt_url) && route.mt_usager.mt_url != '') {
      var userPicAnchor = goog.dom.createDom(goog.dom.TagName.A, {
        'href': route.mt_usager.mt_url,
        'class': classPrefix + '-offer-user-pic-anchor'
      });
      goog.dom.appendChild(userPicAnchor, userPic);
      goog.dom.appendChild(leftCtnEl, userPicAnchor);
    } else {
      goog.dom.appendChild(leftCtnEl, userPic);
    }

    // -- user full name, is an anchor if mt_url is set --
    var userFullNameEl;
    if (goog.isDef(route.mt_usager.mt_url) && route.mt_usager.mt_url != '') {
      userFullNameEl = goog.dom.createDom(goog.dom.TagName.A, {
        'href': route.mt_usager.mt_url,
        'class': [
          classPrefix + '-offer-header',
          classPrefix + '-offer-user-fullname'
        ].join(' ')
      });
    } else {
      userFullNameEl = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': classPrefix + '-offer-header'
      });
    }
    goog.dom.appendChild(leftCtnEl, userFullNameEl);
    var userFullNameText = route.mt_usager.mt_first_name + ' ' +
        route.mt_usager.mt_last_name;
    goog.dom.appendChild(userFullNameEl, goog.dom.createTextNode(
        userFullNameText));

    // -- user eval --
    if (goog.isDef(route.mt_usager.mt_evaluation)) {
      var userEvalClasses = [];
      userEvalClasses.push(classPrefix + '-offer-user-eval');
      userEvalClasses.push(classPrefix + '-offer-user-eval-' +
          route.mt_usager.mt_evaluation);
      var userEvalEl = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': userEvalClasses.join(' ')
      });
      goog.dom.appendChild(userEvalEl, goog.dom.createTextNode(' '));
      goog.dom.appendChild(leftCtnEl, userEvalEl);
    }

    // small icons
    if (goog.isDef(route.mt_offre)) {
      goog.dom.appendChild(leftCtnEl, this.createOfferIconElement_(
          'driver', route.mt_offre.mt_est_conducteur));
      goog.dom.appendChild(leftCtnEl, this.createOfferIconElement_(
          'seats', route.mt_offre.mt_places_dispo));
      goog.dom.appendChild(leftCtnEl, this.createOfferIconElement_(
          'smoking', route.mt_offre.mt_fume));
      // ambiance icons
      var offreAmbiance = route.mt_offre.mt_atmosphere;
      var ambiance = ol.control.GoogleMapsDirectionsPanel.Ambiance;
      var talkAmbiance = (offreAmbiance === ambiance.TALK) ? '1' : '0';
      goog.dom.appendChild(leftCtnEl, this.createOfferIconElement_(
          'talk', talkAmbiance));
      var musicAmbiance = (offreAmbiance === ambiance.MUSIC) ? '1' : '0';
      goog.dom.appendChild(leftCtnEl, this.createOfferIconElement_(
          'music', musicAmbiance));
      var radioAmbiance = (offreAmbiance === ambiance.RADIO) ? '1' : '0';
      goog.dom.appendChild(leftCtnEl, this.createOfferIconElement_(
          'radio', radioAmbiance));
    }

    // -- clear left --
    var clearEl = goog.dom.createDom(goog.dom.TagName.DIV, {
      'class': classPrefix + '-clear-left'
    });
    goog.dom.appendChild(leftCtnEl, clearEl);

    // == LEFT END ==

    // == RIGHT START ==

    // -- schedule --
    if (goog.isDef(route.mt_offre)) {
      if (route.mt_offre.mt_horaire_ponctuelle === 1) {
        // ---- schedule ponctual ----
        var firstLineEl = goog.dom.createDom(goog.dom.TagName.DIV, {});
        goog.dom.appendChild(rightCtnEl, firstLineEl);

        var offerTypeText = (route.mt_offre.mt_horaire_ponctuelle === 1) ?
            this.ponctualText : this.recurringText;
        var offerTypeEl = goog.dom.createDom(goog.dom.TagName.SPAN, {});
        goog.dom.appendChild(firstLineEl, offerTypeEl);
        goog.dom.appendChild(
            offerTypeEl,
            goog.dom.createTextNode(offerTypeText)
        );

        goog.dom.appendChild(firstLineEl, this.createOfferPipeElement_());

        var dateText = route.mt_offre.mt_date;
        var dateEl = goog.dom.createDom(goog.dom.TagName.SPAN, {
          'class': classPrefix + '-offer-header'
        });
        goog.dom.appendChild(firstLineEl, dateEl);
        goog.dom.appendChild(dateEl, goog.dom.createTextNode(dateText));

        goog.dom.appendChild(firstLineEl, this.createOfferPipeElement_());

        var hourText = route.mt_offre.mt_heure;
        var hourEl = goog.dom.createDom(goog.dom.TagName.SPAN, {
          'class': classPrefix + '-offer-header'
        });
        goog.dom.appendChild(firstLineEl, hourEl);
        goog.dom.appendChild(hourEl, goog.dom.createTextNode(hourText));
      } else {
        // ---- schedule reccuring ----

        // ------ 'aller' - mandatory
        var firstLineEl = goog.dom.createDom(goog.dom.TagName.DIV, {});
        goog.dom.appendChild(rightCtnEl, firstLineEl);

        var goPrefixEl = goog.dom.createDom(goog.dom.TagName.SPAN, {
          'class': classPrefix + '-offer-header'
        });
        goog.dom.appendChild(firstLineEl, goPrefixEl);
        goog.dom.appendChild(
            goPrefixEl, goog.dom.createTextNode(this.goText + ': '));

        var goValueElOptions = {};
        var goTagName;
        if (route.mt_offre.mt_horaire_aller_reg === true) {
          goTagName = goog.dom.TagName.SPAN;
        } else {
          goTagName = goog.dom.TagName.A;
          goValueElOptions['href'] = route.mt_offre.mt_horaire_irr_url;
          goValueElOptions['class'] = classPrefix + '-offer-schedule-irregular';
        }
        var goValueEl = goog.dom.createDom(
            goTagName,
            goValueElOptions,
            route.mt_offre.mt_horaire_aller
            );
        goog.dom.appendChild(firstLineEl, goValueEl);

        // ------ 'retour' - optional
        var returnValueText = route.mt_offre.mt_horaire_retour;
        if (returnValueText != '') {
          var secondLineEl = goog.dom.createDom(goog.dom.TagName.DIV, {});
          goog.dom.appendChild(rightCtnEl, secondLineEl);

          var returnPrefixEl = goog.dom.createDom(goog.dom.TagName.SPAN, {
            'class': classPrefix + '-offer-header'
          });
          goog.dom.appendChild(secondLineEl, returnPrefixEl);
          goog.dom.appendChild(
              returnPrefixEl, goog.dom.createTextNode(this.returnText + ': '));

          var returnValueElOptions = {};
          var returnTagName;
          if (route.mt_offre.mt_horaire_retour_reg === true) {
            returnTagName = goog.dom.TagName.SPAN;
          } else {
            returnTagName = goog.dom.TagName.A;
            returnValueElOptions['href'] = route.mt_offre.mt_horaire_irr_url;
            returnValueElOptions['class'] =
                classPrefix + '-offer-schedule-irregular';
          }
          var returnValueEl = goog.dom.createDom(
              returnTagName,
              returnValueElOptions,
              returnValueText
              );
          goog.dom.appendChild(secondLineEl, returnValueEl);
        }
      }

      // from
      /*
      var fromAddressText = route.legs[0].start_address;
      var fromEl = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': classPrefix + '-offer-address'
      });
      goog.dom.appendChild(rightCtnEl, fromEl);

      var fromHeaderEl = goog.dom.createDom(goog.dom.TagName.SPAN, {
        'class': classPrefix + '-offer-header'
      });
      goog.dom.appendChild(fromEl, fromHeaderEl);
      goog.dom.appendChild(fromHeaderEl,
          goog.dom.createTextNode(this.fromText + ' : '));

      var fromAddressEl = goog.dom.createDom(goog.dom.TagName.SPAN);
      goog.dom.appendChild(fromEl, fromAddressEl);
      goog.dom.appendChild(fromAddressEl,
          goog.dom.createTextNode(fromAddressText));

      // to
      var toAddressText = route.legs[route.legs.length - 1].end_address;
      var toEl = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': classPrefix + '-offer-address'
      });
      goog.dom.appendChild(rightCtnEl, toEl);

      var toHeaderEl = goog.dom.createDom(goog.dom.TagName.SPAN, {
        'class': classPrefix + '-offer-header'
      });
      goog.dom.appendChild(toEl, toHeaderEl);
      goog.dom.appendChild(toHeaderEl,
          goog.dom.createTextNode(this.toText + ' : '));

      var toAddressEl = goog.dom.createDom(goog.dom.TagName.SPAN);
      goog.dom.appendChild(toEl, toAddressEl);
      goog.dom.appendChild(toAddressEl,
          goog.dom.createTextNode(toAddressText));
      */

      // price
      var priceText = route.mt_offre.mt_prix;
      var priceEl = goog.dom.createDom(goog.dom.TagName.DIV, {
        'class': [
          classPrefix + '-offer-header',
          classPrefix + '-offer-price'
        ].join(' ')
      });
      goog.dom.appendChild(rightCtnEl, priceEl);
      goog.dom.appendChild(priceEl, goog.dom.createTextNode(priceText));

      // mt_duration_diff, i.e. the difference in duration
      if (goog.isDef(route.mt_offre.mt_duration_diff)) {
        var durationDiffEl = goog.dom.createDom(goog.dom.TagName.DIV);
        goog.dom.appendChild(rightCtnEl, durationDiffEl);

        var durationDiffTextEl = goog.dom.createDom(goog.dom.TagName.SPAN, {
          'class': classPrefix + '-offer-header'
        });
        goog.dom.appendChild(
            durationDiffTextEl,
            goog.dom.createTextNode(this.detourText + ': ')
        );
        goog.dom.appendChild(durationDiffEl, durationDiffTextEl);

        var durationDiffValue = this.formatDuration_(
            route.mt_offre.mt_duration_diff);
        var durationDiffValueEl = goog.dom.createDom(goog.dom.TagName.SPAN, {
          'class': classPrefix + '-offer-duration-diff'
        });
        goog.dom.appendChild(
            durationDiffValueEl, goog.dom.createTextNode(durationDiffValue));
        goog.dom.appendChild(durationDiffEl, durationDiffValueEl);
      }
    }

    // organisation - only display the first one, if any
    var organisation = route.mt_organisations[0];
    if (goog.isDefAndNotNull(organisation)) {
      var orgEl;
      if (organisation.mt_url != '') {
        orgEl = goog.dom.createDom(goog.dom.TagName.A, {
          'class': classPrefix + '-offer-group',
          'href': organisation.mt_url
        });
      } else {
        orgEl = goog.dom.createDom(goog.dom.TagName.DIV, {
          'class': classPrefix + '-offer-group'
        });
      }
      goog.dom.appendChild(rightCtnEl, orgEl);

      // add logo (if set), else add name only
      if (organisation.mt_logo != '') {
        goog.dom.appendChild(
            orgEl,
            goog.dom.createDom(goog.dom.TagName.IMG, {
              'src': organisation.mt_logo,
              'class': classPrefix + '-offer-group-logo',
              'title': organisation.mt_name
            })
        );
      } else {
        goog.dom.appendChild(
            orgEl,
            goog.dom.createDom(goog.dom.TagName.SPAN, {
              'class': classPrefix + '-offer-group-name'
            }, organisation.mt_name)
        );
      }

      // add status (if set)
      if (organisation.mt_status != '') {
        var statusText = (organisation.mt_logo != '') ?
            organisation.mt_status : ', ' + organisation.mt_status;
        goog.dom.appendChild(
            orgEl,
            goog.dom.createDom(goog.dom.TagName.SPAN, {
              'class': classPrefix + '-offer-group-status'
            }, statusText)
        );
      }
    }
  }
  // else, the response comes from Google Maps.  Style accordingly
  else {

    // == LEFT START ==

    // travel mode picture
    var travelModePic;
    var travelMode = this.calculateRouteTravelMode(route);

    switch (travelMode) {

      case google.maps.TravelMode.BICYCLING:
        travelModePic = goog.dom.createDom(goog.dom.TagName.DIV, {
          'class': [
            classPrefix + '-offer-travelmode-pic',
            classPrefix + '-offer-travelmode-pic-bicycling'
          ].join(' ')
        });
        break;

      case google.maps.TravelMode.DRIVING:
        travelModePic = goog.dom.createDom(goog.dom.TagName.DIV, {
          'class': [
            classPrefix + '-offer-travelmode-pic',
            classPrefix + '-offer-travelmode-pic-driving'
          ].join(' ')
        });
        break;

      case google.maps.TravelMode.TRANSIT:
        travelModePic = goog.dom.createDom(goog.dom.TagName.DIV, {
          'class': [
            classPrefix + '-offer-travelmode-pic',
            classPrefix + '-offer-travelmode-pic-transit'
          ].join(' ')
        });
        break;

      case google.maps.TravelMode.WALKING:
      default:
        travelModePic = goog.dom.createDom(goog.dom.TagName.DIV, {
          'class': [
            classPrefix + '-offer-travelmode-pic',
            classPrefix + '-offer-travelmode-pic-walking'
          ].join(' ')
        });
        break;
    }

    goog.dom.appendChild(leftCtnEl, travelModePic);

    // summary
    var summaryEl = goog.dom.createDom(goog.dom.TagName.DIV, {
      'class': classPrefix + '-offer-header'
    });
    goog.dom.appendChild(leftCtnEl, summaryEl);
    goog.dom.appendChild(summaryEl,
        goog.dom.createTextNode(route.summary));

    // -- clear left --
    var clearEl = goog.dom.createDom(goog.dom.TagName.DIV, {
      'class': classPrefix + '-clear-left'
    });
    goog.dom.appendChild(leftCtnEl, clearEl);

    // == LEFT END ==

    // == RIGHT START ==

    // total distance
    var totalDistanceEl = goog.dom.createDom(goog.dom.TagName.DIV);
    goog.dom.appendChild(rightCtnEl, totalDistanceEl);
    goog.dom.appendChild(
        totalDistanceEl,
        goog.dom.createDom(goog.dom.TagName.SPAN, {
          'class': classPrefix + '-offer-header'
        }, this.distanceText + ': ')
    );
    goog.dom.appendChild(
        totalDistanceEl,
        goog.dom.createDom(goog.dom.TagName.SPAN, {
        }, this.calculateRouteTotalDistance_(route))
    );

    // total duration
    var totalDistanceEl = goog.dom.createDom(goog.dom.TagName.DIV);
    goog.dom.appendChild(rightCtnEl, totalDistanceEl);
    goog.dom.appendChild(
        totalDistanceEl,
        goog.dom.createDom(goog.dom.TagName.SPAN, {
          'class': classPrefix + '-offer-header'
        }, this.durationText + ': ')
    );
    goog.dom.appendChild(
        totalDistanceEl,
        goog.dom.createDom(goog.dom.TagName.SPAN, {
        }, this.calculateRouteTotalDuration_(route))
    );

    // == RIGHT END ==
  }

  // -- clear left --
  var clearEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-clear-left'
  });
  goog.dom.appendChild(element, clearEl);

  // detail link
  var detailLink = goog.dom.createDom(goog.dom.TagName.A, {
    'class': classPrefix + '-offer-details-link',
    'href': '#',
    'data-selector-index': index
  });
  goog.dom.appendChild(leftCtnEl, detailLink);
  goog.dom.appendChild(detailLink,
      goog.dom.createTextNode(this.pathDetailsText));

  // contact link
  if (goog.isDef(route.mt_usager) && goog.isDef(route.mt_offre)) {
    var contactLink = null;
    if (route.mt_anonymous) {
      contactLink = goog.dom.createDom(goog.dom.TagName.A, {
        'class': classPrefix + '-offer-contact-link disabled',
        'title': this.anonymousContactMessage,
        'href': '#'
      });
    }
    else if (route.mt_usager.mt_contact == null) {
      contactLink = goog.dom.createDom(goog.dom.TagName.A, {
        'class': classPrefix + '-offer-contact-link disabled',
        'title': this.privateContactMessage,
        'href': '#'
      });
    }else {
      contactLink = goog.dom.createDom(goog.dom.TagName.A, {
        'class': classPrefix + '-offer-contact-link',
        'href': route.mt_usager.mt_contact,
        'data-bookmark-add-url': route.mt_favori.mt_url,
        'data-startAddress': route.mt_offre.mt_start_address,
        'data-endAddress': route.mt_offre.mt_end_address,
        'data-deplacementNom': route.mt_offre.mt_offer_name,
        'data-route-index': index
      });
      goog.events.listen(contactLink, [
        goog.events.EventType.CLICK
      ], this.handleContactLinkPress_, false, this);
    }
    goog.dom.appendChild(leftCtnEl, contactLink);
    goog.dom.appendChild(contactLink,
        goog.dom.createTextNode(this.contactText));
  }

  // event listeners
  goog.events.listen(detailLink, [
    goog.events.EventType.CLICK
  ], this.handleSelectorElementPress_, false, this);

  return element;
};


/**
 * Create a simple pipe element for the offer
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createOfferPipeElement_ =
    function() {

  var classPrefix = this.classPrefix_;

  var pipeEl = goog.dom.createDom(goog.dom.TagName.SPAN, {
    'class': classPrefix + '-offer-pipe'
  });
  goog.dom.appendChild(pipeEl, goog.dom.createTextNode('|'));

  return pipeEl;
};


/**
 * Create an offer icon element
 * @param {string} name Name of the property
 * @param {string} value Value
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createOfferIconElement_ =
    function(name, value) {

  var classPrefix = this.classPrefix_;

  var iconClasses = [];
  iconClasses.push(classPrefix + '-offer-icon');
  iconClasses.push(classPrefix + '-offer-icon-' + name + '-' + value);

  var iconEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': iconClasses.join(' ')
  });

  return iconEl;
};


/**
 * Create an 'inactive' bookmark element, i.e. a <span> instead of a link
 * @param {boolean} visible Whether to create the element visible or not
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createBookmarkInactiveElement_ =
    function(visible) {
  var display = visible ? '' : 'none';
  var classPrefix = this.classPrefix_;
  var element = goog.dom.createDom(goog.dom.TagName.SPAN, {
    'class': [
      classPrefix + '-bookmark',
      classPrefix + '-bookmark-this'
    ].join(' '),
    'title': this.addBookmarkThisText
  });
  goog.style.setStyle(element, 'display', display);
  return element;
};


/**
 * Create all elements required for a route for the selector list.
 * @param {google.maps.DirectionsRoute} route
 * @param {number} index
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createRouteSelectorItemElement_ =
    function(route, index) {

  var classPrefix = this.classPrefix_;

  var element = goog.dom.createDom(goog.dom.TagName.LI, {
    'class': classPrefix + '-selector-item',
    'data-selector-index': index
  });

  // info
  var infoEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-selector-item-info'
  });
  goog.dom.appendChild(element, infoEl);

  // total distance
  var totalDistanceEl = goog.dom.createDom(goog.dom.TagName.SPAN);
  goog.dom.appendChild(totalDistanceEl,
      goog.dom.createTextNode(this.calculateRouteTotalDistance_(route)));
  goog.dom.appendChild(infoEl, totalDistanceEl);

  goog.dom.appendChild(infoEl, goog.dom.createTextNode(', '));

  // total duration
  var totalDurationEl = goog.dom.createDom(goog.dom.TagName.SPAN);
  goog.dom.appendChild(totalDurationEl,
      goog.dom.createTextNode(this.calculateRouteTotalDuration_(route)));
  goog.dom.appendChild(infoEl, totalDurationEl);

  // summary
  if (goog.isDefAndNotNull(route.summary)) {
    var summaryEl = goog.dom.createDom(goog.dom.TagName.DIV, {
      'class': classPrefix + '-selector-item-summary'
    });
    goog.dom.appendChild(element, summaryEl);
    goog.dom.appendChild(summaryEl, goog.dom.createTextNode(route.summary));
  }

  // event listeners
  goog.events.listen(element, [
    goog.events.EventType.CLICK
  ], this.handleSelectorElementPress_, false, this);

  goog.events.listen(element, [
    goog.events.EventType.MOUSEOVER
  ], this.handleSelectorElementHover_, false, this);

  goog.events.listen(element, [
    goog.events.EventType.MOUSEOUT
  ], this.handleSelectorElementUnhover_, false, this);



  this.clickableSelectorElements_.push(element);

  return element;
};


/**
 * Create all elements required for a leg
 * @param {google.maps.DirectionsLeg} leg
 * @param {string} imgSrc
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createLegElement_ =
    function(leg, imgSrc) {

  var stepEl;
  var classPrefix = this.classPrefix_;

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-leg'
  });

  // header
  goog.dom.appendChild(element,
      this.createLegHeaderElement_(leg, true, imgSrc));

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
 * @param {google.maps.DirectionsLeg} leg
 * @param {boolean} start Whether to use the start address or not (use end)
 * @param {string} imgSrc
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createLegHeaderElement_ =
    function(leg, start, imgSrc) {

  var classPrefix = this.classPrefix_;

  var map = this.getMap();

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));

  var projection = view.getProjection();

  // create start and end coordinates from start and end locations if
  // not existant to be able to use them later for save purpose
  if (goog.isDefAndNotNull(leg.start_location)) {
    // start
    var startLat = leg.start_location.lat();
    var startLng = leg.start_location.lng();
    leg.start_coordinate = ol.proj.transform(
        [startLng, startLat], 'EPSG:4326', projection.getCode());

    // end
    var endLat = leg.end_location.lat();
    var endLng = leg.end_location.lng();
    leg.end_coordinate = ol.proj.transform(
        [endLng, endLat], 'EPSG:4326', projection.getCode());
  }
  var coordinate = (start) ? leg.start_coordinate : leg.end_coordinate;

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-leg-header',
    'data-x': coordinate[0],
    'data-y': coordinate[1],
    'data-instructions': (start) ? leg.start_address : leg.end_address
  });

  // text
  var textEl = goog.dom.createDom(goog.dom.TagName.DIV, {});
  goog.dom.appendChild(element, textEl);

  var iconEl = goog.dom.createDom(goog.dom.TagName.IMG, {
    'src': imgSrc,
    'class': classPrefix + '-leg-icon'
  });
  goog.dom.appendChild(textEl, iconEl);
  this.iconImageElements_.push(iconEl);

  var text = (start) ? leg.start_address : leg.end_address;
  goog.dom.appendChild(textEl, goog.dom.createTextNode(text));

  // event listeners
  goog.events.listen(element, [
    goog.events.EventType.CLICK
  ], this.handleElementPress_, false, this);

  this.clickableDirectionElements_.push(element);

  return element;
};


/**
 * Create all elements required for a tail, which is the last leg of a route
 * @param {google.maps.DirectionsLeg} leg
 * @param {string} imgSrc
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createTailElement_ =
    function(leg, imgSrc) {

  var classPrefix = this.classPrefix_;

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-tail'
  });

  // header
  goog.dom.appendChild(element,
      this.createLegHeaderElement_(leg, false, imgSrc));

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

  var projection = view.getProjection();

  // coordinate
  var coordinate;
  if (goog.isDefAndNotNull(step.start_location)) {
    var lat = step.start_location.lat();
    var lng = step.start_location.lng();
    coordinate = ol.proj.transform(
        [lng, lat], 'EPSG:4326', projection.getCode());
    // keep transformed coordinate for further saving purpose
    step.start_coordinate = coordinate;
  } else if (goog.isDefAndNotNull(step.start_coordinate)) {
    coordinate = step.start_coordinate;
  }

  // coordinates
  var coordinates = [];
  if (goog.isDefAndNotNull(step.path)) {
    goog.asserts.assertArray(step.path);
    goog.array.forEach(step.path, function(location) {
      coordinates.push(
          ol.proj.transform(
              [location.lng(), location.lat()],
              'EPSG:4326',
              projection.getCode()
          )
      );
    }, this);
    step.coordinates = coordinates;
  }

  goog.asserts.assertArray(step.coordinates);

  var element = goog.dom.createDom(goog.dom.TagName.TR, {
    'class': classPrefix + '-step',
    'data-x': coordinate[0],
    'data-y': coordinate[1],
    'data-instructions': step.instructions
  });

  // maneuver
  var maneuverTDEl = goog.dom.createDom(goog.dom.TagName.TD);
  goog.dom.appendChild(element, maneuverTDEl);
  var maneuverEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-step-maneuver'
  });
  if (goog.isDefAndNotNull(step.maneuver) && step.maneuver !== '') {
    goog.dom.classes.add(maneuverEl,
        classPrefix + '-step-maneuver-' + step.maneuver);
  }
  goog.dom.appendChild(maneuverTDEl, maneuverEl);

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
    goog.events.EventType.CLICK
  ], this.handleElementPress_, false, this);

  this.clickableDirectionElements_.push(element);

  return element;
};


/**
 * Select a route, which displays its direction details.  Unselect any
 * previously selected route too.
 * @param {number} index Index of the route to select
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.select_ = function(index) {

  var route;

  // unselect first, if required
  if (!goog.isNull(this.selectedRouteIndex_) &&
      this.selectedRouteIndex_ != index) {
    //console.log("unselect: " + this.selectedRouteIndex_);

    // todo - set style to selector

    route = this.routes_.item(this.selectedRouteIndex_);

    // hide direction details
    goog.style.setStyle(route.directionEl, 'display', 'none');

    goog.events.dispatchEvent(this,
        ol.control.GoogleMapsDirectionsPanel.EventType.UNSELECT);

    this.destroyPopup_();

    this.selectedRouteIndex_ = null;
  }

  // select, if not already selected
  if (goog.isNull(this.selectedRouteIndex_) ||
      this.selectedRouteIndex_ != index) {
    //console.log("select: " + index);

    route = this.routes_.item(index);

    // todo - set style to selector

    // show direction details
    goog.style.setStyle(route.directionEl, 'display', '');

    this.selectedRouteIndex_ = index;

    goog.events.dispatchEvent(this,
        ol.control.GoogleMapsDirectionsPanel.EventType.SELECT);
  }
  else if (!goog.isNull(this.selectedRouteIndex_) &&
      this.selectedRouteIndex_ == index &&
      this.mode_ == ol.control.GoogleMapsDirectionsPanel.Mode.COMPLEX) {
    route = this.routes_.item(index);

    //toggle off the current direction detail
    goog.style.setStyle(route.directionEl, 'display', 'none');

    goog.events.dispatchEvent(this,
        ol.control.GoogleMapsDirectionsPanel.EventType.UNSELECT);

    this.destroyPopup_();

    //reset the selected route index
    this.selectedRouteIndex_ = null;
  }

  if (this.mode_ == ol.control.GoogleMapsDirectionsPanel.Mode.SIMPLE)
    this.selectSelectorItem_(index);
};


/**
 * @param {ol.Coordinate} coordinate Coordinate used to position the popup
 * @param {string} content Content of the popup, can be html
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createPopup_ = function(
    coordinate, content) {

  var popup = this.popup_;
  var popupEl = popup.getElement();

  // destroy old one first
  $(popupEl).popover('destroy');

  // set position
  popup.setPosition(coordinate);

  // set content and show using popover (requires bootstrap)
  jQuery(popupEl).popover({
    'animation': false,
    'placement': this.popupPlacement_,
    'html': true,
    'content': content
  });

  window.setTimeout(function() {
    jQuery(popupEl).popover('show');
  }, 50);
};


/**
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.destroyPopup_ = function() {
  var popup = this.popup_;
  var popupEl = popup.getElement();
  jQuery(popupEl).popover('destroy');
};


/**
 * Check if a popup can be safely shown at the specified coordinate.
 * It can't if:
 *  - it's outside the extent of the view of the map, including a buffer
 *  - it's in one of the 4 corner extents where there wouldn't be enough
 *    space to show the popup.
 * @param {ol.Coordinate} coordinate in map view projection
 * @return {boolean}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.coordinateIsPopupSafe_ =
    function(coordinate) {

  var map = this.getMap();

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));

  var size = map.getSize();
  goog.asserts.assertArray(size);

  var extent = view.calculateExtent(size);

  var resolution = view.getResolutionForExtent(extent, size);
  var pixelBuffer = this.pixelBuffer_;
  var buffer = resolution * pixelBuffer;

  var smallExtent = ol.extent.buffer(extent, buffer * -1);

  // popup is not safe if too close to the edge of the map, which is
  // calculated using buffer
  if (!ol.extent.containsCoordinate(smallExtent, coordinate)) {
    return false;
  }

  var cornerPixelSize = this.cornerPixelSize_;
  var cornerSize = resolution * cornerPixelSize;

  var outerBottomLeft = ol.extent.getBottomLeft(extent);
  var outerTopRight = ol.extent.getTopRight(extent);

  var outerLeft = outerBottomLeft[0];
  var outerBottom = outerBottomLeft[1];
  var outerRight = outerTopRight[0];
  var outerTop = outerTopRight[1];

  var innerLeft = outerLeft + cornerSize;
  var innerBottom = outerBottom + cornerSize;
  var innerRight = outerRight - cornerSize;
  var innerTop = outerTop - cornerSize;

  var topLeftCorner = ol.extent.createOrUpdate(
      outerLeft, innerTop, innerLeft, outerTop);

  var topRightCorner = ol.extent.createOrUpdate(
      innerRight, innerTop, outerRight, outerTop);

  var bottomLeftCorner = ol.extent.createOrUpdate(
      outerLeft, outerBottom, innerLeft, innerBottom);

  var bottomRightCorner = ol.extent.createOrUpdate(
      innerRight, outerBottom, outerRight, innerBottom);

  // popup is not safe if coordinate is inside one of the 4 corners of the map
  if (ol.extent.containsCoordinate(topLeftCorner, coordinate) ||
      ol.extent.containsCoordinate(topRightCorner, coordinate) ||
      ol.extent.containsCoordinate(bottomLeftCorner, coordinate) ||
      ol.extent.containsCoordinate(bottomRightCorner, coordinate)) {
    return false;
  }

  return true;
};


/**
 * Calculate and set the best possible positioning of the popup given a
 * specific coordinate.
 * @param {ol.Coordinate} coordinate in map view projection
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.calculatePopupPositioning_ =
    function(coordinate) {

  var map = this.getMap();

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));

  var size = map.getSize();
  goog.asserts.assertArray(size);

  var extent = view.calculateExtent(size);

  var resolution = view.getResolutionForExtent(extent, size);

  var cornerPixelSize = this.cornerPixelSize_;
  var cornerSize = resolution * cornerPixelSize;

  var outerBottomLeft = ol.extent.getBottomLeft(extent);
  var outerTopRight = ol.extent.getTopRight(extent);

  var outerLeft = outerBottomLeft[0];
  var outerBottom = outerBottomLeft[1];
  var outerRight = outerTopRight[0];
  var outerTop = outerTopRight[1];

  var innerLeft = outerLeft + cornerSize;
  var innerRight = outerRight - cornerSize;
  var innerTop = outerTop - cornerSize;

  // Here's a preview of the 4 extents, i.e. 'zones'.
  // The bottom one is bigger to have highest priority for popups with the
  // arrow pointing down in most cases
  //
  // -------------
  // | |___t___| |
  // |l|       |r|
  // | |   b   | |
  // -------------

  var bottomExtent = ol.extent.createOrUpdate(
      innerLeft, outerBottom, innerRight, innerTop);

  var topExtent = ol.extent.createOrUpdate(
      innerLeft, innerTop, innerRight, outerTop);

  var leftExtent = ol.extent.createOrUpdate(
      outerLeft, outerBottom, innerLeft, outerTop);

  var rightExtent = ol.extent.createOrUpdate(
      innerRight, outerBottom, outerRight, outerTop);

  if (ol.extent.containsCoordinate(bottomExtent, coordinate)) {
    this.popupPlacement_ = 'top';
    this.popup_.setPositioning(ol.OverlayPositioning.BOTTOM_CENTER);
  } else if (ol.extent.containsCoordinate(topExtent, coordinate)) {
    this.popupPlacement_ = 'bottom';
    this.popup_.setPositioning(ol.OverlayPositioning.TOP_CENTER);
  } else if (ol.extent.containsCoordinate(leftExtent, coordinate)) {
    this.popupPlacement_ = 'right';
    this.popup_.setPositioning(ol.OverlayPositioning.CENTER_LEFT);
  } else if (ol.extent.containsCoordinate(rightExtent, coordinate)) {
    this.popupPlacement_ = 'left';
    this.popup_.setPositioning(ol.OverlayPositioning.CENTER_RIGHT);
  } else {
    this.resetPopupPositioning_();
  }

};


/**
 * Calculate and returns the total distance of a route as plain text.
 * @param {google.maps.DirectionsRoute} route
 * @return {string}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.calculateRouteTotalDistance_ =
    function(route) {

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

  return totalDistanceText;
};


/**
 * Calculate and returns the total duration of a route as plain text.
 * @param {google.maps.DirectionsRoute} route
 * @return {string}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.calculateRouteTotalDuration_ =
    function(route) {

  var duration = 0;

  goog.array.forEach(route.legs, function(leg) {
    duration += leg.duration.value;
  }, this);

  return this.formatDuration_(duration);
};


/**
 * Format in plain text the hours and minutes of a given duration in seconds.
 * @param {number} duration Duration in seconds
 * @return {string}
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.formatDuration_ = function(
    duration) {

  var remainingDuration = 0;
  var durationContent = [];

  if (duration < 30) {
    // todo - i18n
    durationContent.push('Moins d\'une minute');
  } else {

    if (duration > 3600) {
      var hours = Math.floor(duration / 3600);
      remainingDuration = duration - hours * 3600;
      durationContent.push(hours);

      // todo - i18n
      var hoursSuffix = 'heure';
      hoursSuffix += (hours > 1) ? 's' : '';
      durationContent.push(hoursSuffix);
    } else {
      remainingDuration = duration;
    }

    var minutes = Math.floor(remainingDuration / 60);
    if (minutes > 0 || remainingDuration >= 30) {
      if (remainingDuration - minutes * 60 >= 30) {
        minutes++;
      }
      durationContent.push(minutes);

      // todo - i18n
      var minutesSuffix = 'minute';
      minutesSuffix += (minutes > 1) ? 's' : '';
      durationContent.push(minutesSuffix);
    }
  }

  return goog.string.makeSafe(durationContent.join(' '));
};


/**
 * Reset the popup positioning to the default values.
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.resetPopupPositioning_ =
    function() {
  this.popupPlacement_ = 'top';
  this.popup_.setPositioning(ol.OverlayPositioning.BOTTOM_CENTER);
};


/**
 * @inheritDoc
 */
ol.control.GoogleMapsDirectionsPanel.prototype.setMap = function(map) {

  var myMap = this.getMap();
  if (goog.isNull(map) && !goog.isNull(myMap)) {
    myMap.removeOverlay(this.popup_);

    goog.events.unlisten(
        myMap,
        ol.MapBrowserEvent.EventType.SINGLECLICK,
        this.handleMapSingleClick_, false, this);

    this.clearDirections();
  }

  goog.base(this, 'setMap', map);

  if (!goog.isNull(map)) {
    map.addOverlay(this.popup_);

    goog.events.listen(
        map,
        ol.MapBrowserEvent.EventType.SINGLECLICK,
        this.handleMapSingleClick_, false, this);
  }
};


/**
 * Called when the contact link is clicked. Make sure the route has been
 * saved as bookmark before doing any further action.
 * @param {goog.events.BrowserEvent} event Browser event.
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.handleContactLinkPress_ =
    function(event) {
  event.preventDefault();

  var element = event.currentTarget;
  goog.asserts.assertInstanceof(element, Element);
  var bookmarkId = element.getAttribute('data-bookmark-id');
  var classPrefix = this.classPrefix_;

  if (!goog.isNull(bookmarkId)) {
    this.setContactInfo_(element);
    goog.events.dispatchEvent(this,
        ol.control.GoogleMapsDirectionsPanel.EventType.CONTACT);
  } else {
    this.contactRequestPending_ = true;
    var routeIndex = parseInt(element.getAttribute('data-route-index'), 10);
    var route = this.routes_.item(routeIndex);
    goog.asserts.assertInstanceof(route, Object);
    var url = element.getAttribute('data-bookmark-add-url');
    var parent = goog.dom.getParentElement(goog.dom.getParentElement(element));
    var bookmarkLinkEl = goog.dom.getElementByClass(
        classPrefix + '-bookmark-none', parent);
    if (!bookmarkLinkEl) {
      bookmarkLinkEl = goog.dom.getElementByClass(
          classPrefix + '-bookmark-another', parent);
    }
    this.issueBookmarkAddRequest_(route, url, bookmarkLinkEl);
  }
};


/**
 * Get contact info.
 * @param {Element} element The contact link
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.setContactInfo_ =
    function(element) {
  var data = $(element).data();
  goog.asserts.assertInstanceof(data, Object);
  var href = element.href;
  goog.asserts.assertString(href);
  this.contactInfo_ = {
    'data': data,
    'href': href
  };
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.handleElementPress_ =
    function(browserEvent) {

  browserEvent.preventDefault();

  var element = browserEvent.currentTarget;
  var map, view;

  // get coordinate from element
  var coordinate = [
    parseFloat(element.getAttribute('data-x')),
    parseFloat(element.getAttribute('data-y'))
  ];

  if (this.coordinateIsPopupSafe_(coordinate)) {
    this.calculatePopupPositioning_(coordinate);
  } else {
    this.resetPopupPositioning_();

    map = this.getMap();

    view = map.getView();
    goog.asserts.assert(goog.isDef(view));

    view.setCenter(coordinate);
  }

  this.createPopup_(coordinate, element.getAttribute('data-instructions'));
};


/**
 * @param {Object} route Route object
 * @param {string} url Url
 * @param {Element} element The bookmark link element
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.issueBookmarkAddRequest_ =
    function(route, url, element) {
  var request = new goog.net.XhrIo();
  var headers = this.bookmarkHeaders_;
  var method = (this.bookmarkUsePostMethod_ === true) ? 'POST' : 'GET';

  var data = {};

  // One of 'offre_id' or 'recherche_id' is set at the app level, and is
  // optionnal (when editing an 'offre' or 'recherche').  The foreign key,
  // which is one of 'offre_id' or 'recherche_id' is set __here__
  goog.object.extend(data, this.getProperties());

  var resultModeOffre = route.result.mt_offre.mt_mode_offre;
  var legs = route.result.legs;
  // use result user full name as title
  var bookmarkTitle = [
    route.result.mt_usager.mt_first_name,
    route.result.mt_usager.mt_last_name
  ].join(' ');
  goog.object.extend(data, {
    'adresse_destination': legs[legs.length - 1].end_address,
    'adresse_origine': legs[0].start_address,
    'resultat_mode_offre': resultModeOffre,
    'resultat_raw_data': route.result,
    'resultat_usager_id': route.result.mt_usager.mt_id,
    'titre': bookmarkTitle
  });

  // __here__
  var resultatId = route.result.mt_offre.mt_id;
  if (resultModeOffre) {
    goog.object.extend(data, {'offre_id': resultatId});
  } else {
    goog.object.extend(data, {'recherche_id': resultatId});
  }

  // listen once to 'complete' event
  goog.events.listenOnce(request, goog.net.EventType.COMPLETE, function(event) {
    var self = this.self;
    var classPrefix = self.classPrefix_;
    var element = /** @type {Element} */ (this.element);
    var request = event.currentTarget;
    if (request.isSuccess()) {
      var response = /** @type {mtx.format.ResponseJson} */
          (request.getResponseJson());
      // TODO - manage error
      if (response.errors.length) {
        window.console.log(response.errors.join(' '));
      } else {
        goog.style.setStyle(element, 'display', 'none');
        var parent = goog.dom.getParentElement(element);
        var inactive = goog.dom.getElementByClass(
            classPrefix + '-bookmark-this', parent);
        goog.style.setStyle(inactive, 'display', '');

        // save id in contact link
        var id = response.id;
        //classPrefix + '-offer-contact-link'
        var contactLink = goog.dom.getElementByClass(
            classPrefix + '-offer-contact-link', parent);
        contactLink.setAttribute('data-bookmark-id', parseInt(id, 10));

        if (self.contactRequestPending_) {
          contactLink.setAttribute(
              'data-bookmark-while-contact-request-pending', true);
          self.setContactInfo_(contactLink);
          goog.events.dispatchEvent(self,
              ol.control.GoogleMapsDirectionsPanel.EventType.CONTACT);
          self.contactRequestPending_ = false;
        }
      }
    } else {
      // TODO - manage error
      window.console.log(
          'Error - an unknown error occured when adding the bookmark.');
    }
  }, undefined, {self: this, element: element});

  request.send(url, method, goog.json.serialize(data), headers);
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.handleBookmarkElementPress_ =
    function(event) {
  event.preventDefault();

  var element = event.currentTarget;
  goog.asserts.assertInstanceof(element, Element);
  var url = element.href;
  var routeIndex = parseInt(element.getAttribute('data-route-index'), 10);
  var route = this.routes_.item(routeIndex);
  goog.asserts.assertInstanceof(route, Object);
  this.issueBookmarkAddRequest_(route, url, element);
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.handleMapSingleClick_ =
    function(event) {

  this.destroyPopup_();
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.handleSelectorElementHover_ =
    function(browserEvent) {

  browserEvent.preventDefault();
  var element = browserEvent.currentTarget;
  var index = parseInt(element.getAttribute('data-selector-index'), 10);

  this.hover_(index);
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.handleSelectorElementUnhover_ =
    function(browserEvent) {

  browserEvent.preventDefault();

  this.unhover_();
};


/**
 * Hovers a route, displaying it temporarly on the map.
 * @param {number} index Index of the route to select
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.hover_ = function(index) {

  goog.events.dispatchEvent(this,
      ol.control.GoogleMapsDirectionsPanel.EventType.HOVER);
};


/**
 * Removes all temp routes on the map
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.unhover_ = function() {
  goog.events.dispatchEvent(this,
      ol.control.GoogleMapsDirectionsPanel.EventType.UNHOVER);
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.handleSelectorElementPress_ =
    function(browserEvent) {

  browserEvent.preventDefault();

  if (this.readOnlyEnabled_ === true) {
    return;
  }

  var element = browserEvent.currentTarget;
  var index = parseInt(element.getAttribute('data-selector-index'), 10);

  this.select_(index);
};


/**
 * Selects the selector item
 * @param {number} index of the route
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.selectSelectorItem_ =
    function(index) {
  // Set the selected style to the element, and remove it from siblings
  var itemClass = this.classPrefix_ + '-selector-item';
  var selectedClass = this.classPrefix_ + '-selector-item-selected';
  var items = goog.dom.getElementsByClass(itemClass);
  if (items.length > 0) {
    for (var i = 0; i < items.length; i++) {
      goog.dom.classes.remove(items.item(i), selectedClass);
      if (items.item(i).getAttribute('data-selector-index') == index)
        goog.dom.classes.add(items.item(i), selectedClass);
    }
  }

};


/**
 * Hide or display the suggested routes link.
 * @param {boolean} visible parameter. Omit if you wish to toggle.
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.selectorVisible_ =
    function(visible) {
  var element = document.getElementById(this.classPrefix_ + '-selector-toggle');
  if (typeof(visible) == 'undefined') {
    if (element.style.display == 'block')
      visible = false;
    else visible = true;
  }
  if (visible)
    element.style.display = 'block';
  else
    element.style.display = 'none';
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.handleShowMoreButtonPress_ =
    function(browserEvent) {
  browserEvent.preventDefault();
  this.toggleComplexModeResults_();
};


/**
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.handleToggleElementPress_ =
    function() {
  var element = document.getElementById(this.classPrefix_ + '-selector-toggle');
  var open = true;
  if (goog.dom.classes.has(element, this.classPrefix_ +
      '-selector-toggle-opened')) {
    goog.dom.classes.swap(element, this.classPrefix_ +
        '-selector-toggle-opened',
        this.classPrefix_ + '-selector-toggle-closed');
    open = false;
  }else {
    goog.dom.classes.swap(element, this.classPrefix_ +
        '-selector-toggle-closed',
        this.classPrefix_ + '-selector-toggle-opened');
  }
  this.selectorOpened_(open);
};


/**
 * @private
 * @param {boolean} open parameter. Call to open or close the selector panel.
 */
ol.control.GoogleMapsDirectionsPanel.prototype.selectorOpened_ =
    function(open) {
  var display = 'none';
  if (open) {
    display = 'block';
  }

  var itemClass = this.classPrefix_ + '-selector-item';
  var items = goog.dom.getElementsByClass(itemClass);
  if (items.length > 0) {
    for (var i = 0; i < items.length; i++) {
      items.item(i).style.display = display;
    }
  }
};


/**
 * Only used when mode is 'complex' and 'limit' is set.  Loop throught the
 * results and hide the results exceeding the limit.  Show the button if some
 * remain hidden.
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.toggleComplexModeResults_ =
    function() {

  var limit = this.limit_;
  var mode = this.mode_;
  var counter = this.limitPageCounter_;
  var total = this.routes_.getLength();

  if (mode !== ol.control.GoogleMapsDirectionsPanel.Mode.COMPLEX ||
      !limit || !this.showMoreButtonEl_) {
    return;
  }

  var end = (counter + 1) * limit;

  for (var i = 0; i < total; i++) {
    if (i < end) {
      goog.style.setStyle(this.routesEl_.childNodes[i], 'display', '');
    } else {
      goog.style.setStyle(this.routesEl_.childNodes[i], 'display', 'none');
    }
  }

  if (end >= total) {
    goog.style.setStyle(this.showMoreButtonEl_, 'display', 'none');
  }

  this.limitPageCounter_++;
};


/**
 * Create a new show more button,  register listeners and append to parent set
 * @param {Element} parent Parent to append the button to
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.createShowMoreButton_ =
    function(parent) {

  if (this.showMoreButtonEl_) {
    return;
  }

  var classPrefix = this.classPrefix_;

  this.showMoreButtonEl_ = goog.dom.createDom(goog.dom.TagName.BUTTON, {
    'class': 'button blue ' + classPrefix + '-show-more-button'
  });
  goog.dom.appendChild(this.showMoreButtonEl_, goog.dom.createTextNode(
      this.showMoreText));
  goog.dom.appendChild(parent, this.showMoreButtonEl_);

  goog.events.listen(this.showMoreButtonEl_, [
    goog.events.EventType.CLICK
  ], this.handleShowMoreButtonPress_, false, this);
};


/**
 * Destroy the show more button and unregister listeners
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.destroyShowMoreButton_ =
    function() {

  if (!this.showMoreButtonEl_) {
    return;
  }

  goog.events.unlisten(this.showMoreButtonEl_, [
    goog.events.EventType.CLICK
  ], this.handleShowMoreButtonPress_, false, this);

  this.showMoreButtonEl_ = null;
};


/**
 * Toggle self visibility
 * @param {boolean} show Whether to show the control or hide it
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.toggleSelfVisibility_ =
    function(show) {
  var display = (show === true) ? '' : 'none';
  goog.style.setStyle(this.element, 'display', display);
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.handleShowDetailsButtonPress_ =
    function(browserEvent) {

  browserEvent.preventDefault();

  this.toogleDetailsVisibility_(null);
};


/**
 * @param {?boolean} show Show Whether to show or hide the details
 * @private
 */
ol.control.GoogleMapsDirectionsPanel.prototype.toogleDetailsVisibility_ =
    function(show) {

  var display;

  // if 'show' is not set, reverse visibility
  if (goog.isNull(show)) {
    display =
        (goog.style.getStyle(this.routesEl_, 'display') == '') ? 'none' : '';
  } else {
    display = (show === true) ? '' : 'none';
  }

  // show/hide routes
  goog.style.setStyle(this.routesEl_, 'display', display);

  // change button text
  if (display === 'none') {
    this.showDetailsButtonEl_.innerHTML = this.showDetailsText;
  } else {
    this.showDetailsButtonEl_.innerHTML = this.hideDetailsText;
  }
};
