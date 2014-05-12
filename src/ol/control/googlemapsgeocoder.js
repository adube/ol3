goog.provide('ol.control.GoogleMapsGeocoder');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.ui.IdGenerator');
goog.require('ol.Feature');
goog.require('ol.MapBrowserEvent.EventType');
goog.require('ol.View2D');
goog.require('ol.control.Control');
goog.require('ol.css');
goog.require('ol.geom.Point');
goog.require('ol.layer.Vector');
goog.require('ol.proj');
goog.require('ol.source.Vector');
goog.require('ol.style.Style');



/**
 * Todo
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.GoogleMapsGeocoderOptions=} opt_options Options.
 */
ol.control.GoogleMapsGeocoder = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  /**
   * @type {boolean}
   * @private
   */
  if (goog.isDefAndNotNull(options.enableReverseGeocoding) &&
      goog.isBoolean(options.enableReverseGeocoding)) {
    this.enableReverseGeocoding_ = options.enableReverseGeocoding;
  } else {
    this.enableReverseGeocoding_ = false;
  }

  /**
   * @type {Object}
   * @private
   */
  this.geocoderComponentRestrictions_ = goog.isDef(
      options.geocoderComponentRestrictions) ?
      options.geocoderComponentRestrictions : {};

  /**
   * @type {?string}
   * @private
   */
  this.iconImage_ = goog.isDef(options.iconImage) ? options.iconImage : null;

  /**
   * @type {ol.style.Style}
   * @private
   */
  this.iconStyle_ = options.iconStyle;

  /**
   * @type {boolean}
   * @private
   */
  this.removable_ = goog.isDef(options.removable) ? options.removable : false;

  /**
   * @type {boolean}
   * @private
   */
  this.renderAsListItem_ = goog.isDef(options.renderAsListItem) ?
      options.renderAsListItem : false;

  /**
   * @type {?ol.layer.Vector}
   * @private
   */
  this.vectorLayer_ = null;


  /**
   * The error message currently on
   * @type {?string}
   * @private
   */
  this.error_ = null;


  /**
   * i18n - clearButton
   * @type {string}
   */
  this.clearButtonText = goog.isDef(options.clearButtonText) ?
      options.clearButtonText : 'Clear';

  /**
   * i18n - noResultFound
   * @type {string}
   */
  this.noResultFoundText = goog.isDef(options.noResultFoundText) ?
      options.noResultFoundText : 'No result found';

  /**
   * i18n - removeButton
   * @type {string}
   */
  this.removeButtonText = goog.isDef(options.removeButtonText) ?
      options.removeButtonText : 'Remove';

  /**
   * i18n - searchButton
   * @type {string}
   */
  this.searchButtonText = goog.isDef(options.searchButtonText) ?
      options.searchButtonText : 'Search';


  // === UI COMPONENTS ===
  var classPrefix = 'ol-gmg';
  var id = classPrefix + goog.ui.IdGenerator.getInstance().getNextUniqueId();

  var elementTagName = (this.renderAsListItem_ === true) ?
      goog.dom.TagName.LI : goog.dom.TagName.DIV;

  var element = goog.dom.createDom(elementTagName, {
    'id': id,
    'class': classPrefix + ' ' + ol.css.CLASS_UNSELECTABLE
  });

  var iconImageEl = null;
  if (!goog.isNull(this.iconImage_)) {
    iconImageEl = goog.dom.createDom(goog.dom.TagName.IMG, {
      'src': this.iconImage_,
      'class': classPrefix + '-icon-image'
    });
  }

  var input = goog.dom.createDom(goog.dom.TagName.INPUT, {
    'class': classPrefix + '-input-text',
    'type': 'text'
  });

  var resultsList = goog.dom.createDom(goog.dom.TagName.OL, {
    'class': classPrefix + '-results',
    'style': 'display: none;'
  });

  var searchButton = goog.dom.createDom(goog.dom.TagName.BUTTON, {
    'class': classPrefix + '-search-button'
  });
  var searchButtonText = goog.dom.createTextNode(this.searchButtonText);
  goog.dom.appendChild(searchButton, searchButtonText);

  var clearButton = goog.dom.createDom(goog.dom.TagName.BUTTON, {
    'class': classPrefix + '-clear-button'
  });
  var clearButtonText = goog.dom.createTextNode(this.clearButtonText);
  goog.dom.appendChild(clearButton, clearButtonText);

  var removeButton = goog.dom.createDom(goog.dom.TagName.BUTTON, {
    'class': classPrefix + '-remove-button'
  });
  var removeButtonText = goog.dom.createTextNode(this.removeButtonText);
  goog.dom.appendChild(removeButton, removeButtonText);

  if (!goog.isNull(iconImageEl)) {
    goog.dom.appendChild(element, iconImageEl);
  }
  goog.dom.appendChild(element, input);
  goog.dom.appendChild(element, resultsList);
  goog.dom.appendChild(element, searchButton);
  goog.dom.appendChild(element, clearButton);
  goog.dom.appendChild(element, removeButton);

  goog.events.listen(searchButton, [
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.CLICK
  ], this.handleSearchButtonPress_, false, this);

  goog.events.listen(clearButton, [
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.CLICK
  ], this.handleClearButtonPress_, false, this);

  goog.events.listen(removeButton, [
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.CLICK
  ], this.handleRemoveButtonPress_, false, this);

  goog.events.listen(input, [
    goog.events.EventType.KEYPRESS
  ], this.handleInputKeypress_, false, this);

  goog.events.listen(input, [
    goog.events.EventType.INPUT
  ], this.handleInputInput_, false, this);

  var win = goog.dom.getWindow();
  goog.events.listen(win, [
    goog.events.EventType.CLICK
  ], this.handleWindowClick_, false, this);

  goog.base(this, {
    element: element,
    target: options.target
  });

  /**
   * @type {?Element}
   * @private
   */
  this.iconImageEl_ = iconImageEl;

  /**
   * @private
   * @type {string}
   */
  this.id_ = id;

  /**
   * @private
   * @type {Element}
   */
  this.input_ = input;

  /**
   * @private
   * @type {Element}
   */
  this.resultsList_ = resultsList;

  /**
   * @private
   * @type {Array}
   */
  this.clickableResultElements_ = [];

  /**
   * @private
   * @type {google.maps.Geocoder}
   */
  this.geocoder_ = new google.maps.Geocoder();

  /**
   * @type {Array}
   */
  if (goog.isDefAndNotNull(options['additionalAddresses']) &&
      goog.isArray(options['additionalAddresses'])) {

    this.additionalAddresses = options['additionalAddresses'];
  } else {
    this.additionalAddresses = [];
  }

  /**
   * @private
   * @type {Array}
   */
  this.results_ = [];

  /**
   * @private
   * @type {boolean}
   */
  this.allowSearching_ = true;

  /**
   * @private
   * @type {boolean}
   */
  this.characters_ = goog.isDef(options.characters) ? options.characters : 2;

  /**
   * @type {number}
   */
  this.searchingDelay = goog.isDef(options.searchingDelay) ?
      options.searchingDelay : 300;

  /**
   * @private
   * @type {?number} timeout
   */
  this.searchingTimeout_ = null;

  /**
   * @private
   * @type {ol.control.GoogleMapsCurrentPosition}
   */
  this.currentPositionControl_ = goog.isDefAndNotNull(
      options.currentPositionControl) ?
      options.currentPositionControl : null;

  /**
   * @type {boolean}
   * @private
   */
  if (goog.isDefAndNotNull(options.enableCurrentPosition) &&
      goog.isBoolean(options.enableCurrentPosition) &&
      navigator.geolocation &&
      goog.isDefAndNotNull(this.currentPositionControl_)) {

    this.enableCurrentPosition_ = true;
    this.currentPositionControl_.setCurrentPosition(null, false);
  } else {
    this.enableCurrentPosition_ = false;
  }


  /**
   * @private
   * @type {Element}
   */
  this.removeButton_ = removeButton;

  if (this.removable_) {
    this.showRemoveButton();
  } else {
    this.hideRemoveButton();
  }

};
goog.inherits(ol.control.GoogleMapsGeocoder, ol.control.Control);


/**
 * @enum {string}
 */
ol.control.GoogleMapsGeocoder.EventType = {
  ERROR: goog.events.getUniqueId('error'),
  REMOVE: goog.events.getUniqueId('remove')
};


/**
 * @enum {string}
 */
ol.control.GoogleMapsGeocoder.Property = {
  LOCATION: 'location'
};


/**
 * @param {Object} address address
 */
ol.control.GoogleMapsGeocoder.prototype.addAdditionalAddress =
    function(address) {
  this.additionalAddresses.push(address);
};


/**
 * @return {?string}
 */
ol.control.GoogleMapsGeocoder.prototype.getError = function() {
  return this.error_;
};


/**
 * @return {string}
 */
ol.control.GoogleMapsGeocoder.prototype.getId = function() {
  return this.id_;
};


/**
 * @return {google.maps.LatLng|undefined} Location
 */
ol.control.GoogleMapsGeocoder.prototype.getLocation = function() {
  return /** @type {google.maps.LatLng|undefined} */ (
      this.get(ol.control.GoogleMapsGeocoder.Property.LOCATION));
};
goog.exportProperty(
    ol.control.GoogleMapsGeocoder.prototype,
    'getLocation',
    ol.control.GoogleMapsGeocoder.prototype.getLocation);


/**
 * Returns the location transformed in the map view projection.
 * @return {ol.Coordinate|undefined} Coordinate
 */
ol.control.GoogleMapsGeocoder.prototype.getCoordinate = function() {
  var location = this.getLocation();

  if (!goog.isDefAndNotNull(location)) {
    return null;
  }

  var lat = location.lat();
  var lng = location.lng();

  var map = this.getMap();

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var projection = view2D.getProjection();

  var transformedCoordinate = ol.proj.transform(
      [lng, lat], 'EPSG:4326', projection.getCode()
      );

  return transformedCoordinate;
};
goog.exportProperty(
    ol.control.GoogleMapsGeocoder.prototype,
    'getCoordinate',
    ol.control.GoogleMapsGeocoder.prototype.getCoordinate);


/**
 * Change the icon image to a new one, changing the image element src
 * accordingly.
 * @param {string} image Image
 */
ol.control.GoogleMapsGeocoder.prototype.setIconImage = function(image) {
  this.iconImage_ = image;
  this.iconImageEl_.src = image;
};


/**
 * @inheritDoc
 */
ol.control.GoogleMapsGeocoder.prototype.setMap = function(map) {

  if (goog.isNull(map)) {
    var myMap = this.getMap();
    if (!goog.isNull(myMap)) {

      // disable reverse geocoding, if needed
      if (this.enableReverseGeocoding_ === true) {
        goog.events.unlisten(myMap, [
          ol.MapBrowserEvent.EventType.SINGLECLICK
        ], this.handleMapSingleClick_, false, this);
      }

      myMap.removeLayer(this.vectorLayer_);
    }
  }

  goog.base(this, 'setMap', map);

  if (!goog.isNull(map)) {

    // enable reverse geocoding, if needed
    if (this.enableReverseGeocoding_ === true) {
      goog.events.listen(map, [
        ol.MapBrowserEvent.EventType.SINGLECLICK
      ], this.handleMapSingleClick_, false, this);
    }

    // create vector layer
    this.vectorLayer_ = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: []
      })
    });
    map.addLayer(this.vectorLayer_);

  }
};


/**
 * Disable reverse geocoding.
 */
ol.control.GoogleMapsGeocoder.prototype.disableReverseGeocoding = function() {
  var map;

  if (this.enableReverseGeocoding_ === true) {
    this.enableReverseGeocoding_ = false;
    map = this.getMap();
    goog.events.unlisten(map, [
      ol.MapBrowserEvent.EventType.SINGLECLICK
    ], this.handleMapSingleClick_, false, this);
  }
};


/**
 * Enable reverse geocoding.
 */
ol.control.GoogleMapsGeocoder.prototype.enableReverseGeocoding = function() {
  var map;

  if (this.enableReverseGeocoding_ === false) {
    this.enableReverseGeocoding_ = true;
    map = this.getMap();
    goog.events.listen(map, [
      ol.MapBrowserEvent.EventType.SINGLECLICK
    ], this.handleMapSingleClick_, false, this);
  }
};


/**
 * Method used to manually load a response object, i.e. this is the public
 * equivalent of the handleGeocode_ method.
 * @param {Array} results
 */
ol.control.GoogleMapsGeocoder.prototype.load = function(results) {
  this.handleGeocode_(results, null, true);
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.handleInputKeypress_ = function(
    browserEvent) {

  if (browserEvent.keyCode == goog.events.KeyCodes.ENTER) {
    this.handleSearchButtonPress_(browserEvent);
  }
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.handleInputInput_ = function(
    browserEvent) {

  var input = this.input_;
  var value = input.value;

  if (!goog.string.isEmptySafe(value)) {
    if (value.length >= this.characters_) {
      if (this.allowSearching_) {
        var additionalAddresses = this.filterAddresses_(
            this.additionalAddresses, value);

        this.geocodeByAddress_(value, false, additionalAddresses);
        this.allowSearching_ = false;
      }

      this.resetSearchingTimeout_();
    }

    this.currentPositionControl_.setCurrentPosition(null, false);
  } else {
    this.clear();
  }
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.handleSearchButtonPress_ = function(
    browserEvent) {

  browserEvent.preventDefault();

  var input = this.input_;
  var value = input.value;
  if (!goog.string.isEmptySafe(value)) {
    this.clearGeocodeResults_();
    this.geocodeByAddress_(value, true, null);
  }
};


/**
 * @param {String} address The address to search
 * @param {boolean} addToMap Set to true if the first result be added to map
 * @param {Array} additionalAddresses array of optional results
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.geocodeByAddress_ = function(
    address, addToMap, additionalAddresses) {

  additionalAddresses = goog.isDefAndNotNull(additionalAddresses) ?
      additionalAddresses : [];

  var me = this;
  var geocoder = this.geocoder_;

  geocoder.geocode(
      {
        'address': address,
        'componentRestrictions': this.geocoderComponentRestrictions_
      },
      function(results, status) {
        results = goog.isDefAndNotNull(results) ? results : [];
        results = additionalAddresses.concat(results);
        me.handleGeocode_(results, status, addToMap);
      }
  );
};


/**
 * @param {ol.Coordinate} coordinate ready for use with GoogleMaps Geocoder,
 *     i.e. in LatLng projection.
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.geocodeByCoordinate_ = function(
    coordinate) {

  var me = this;
  var geocoder = this.geocoder_;
  var lat = coordinate[1];
  var lng = coordinate[0];
  var latlng = new google.maps.LatLng(lat, lng);

  geocoder.geocode(
      {
        'latLng': latlng
      },
      function(results, status) {
        me.handleGeocode_(results, status, true);
      }
  );
};


/**
 * @param {Array} results
 * @param {number|string|null} status
 * @param {boolean} addToMap
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.handleGeocode_ = function(
    results, status, addToMap) {

  addToMap = goog.isDef(addToMap) ? addToMap : false;

  this.results_ = results;
  this.clearGeocodeResults_();
  this.setError_(null);

  // TODO: handle status but consider that there may still be some results

  if (addToMap) {
    //If the first result should be added to the map right away
    var formatted_address, result, location;
    var input = this.input_;

    if (results.length) {
      // TODO: support multiple results
      result = results[0];

      formatted_address = result.formatted_address;
      // set returned value
      input.value = formatted_address;

      if (goog.isDefAndNotNull(result.geometry.location)) {
        location = result.geometry.location;
      } else if (goog.isDefAndNotNull(result.geometry.coordinate)) {

        var map = this.getMap();

        var view = map.getView();
        goog.asserts.assert(goog.isDef(view));
        var view2D = view.getView2D();
        goog.asserts.assertInstanceof(view2D, ol.View2D);

        var projection = view2D.getProjection();

        var transformedCoordinate = ol.proj.transform(
            result.geometry.coordinate, projection.getCode(), 'EPSG:4326');

        location = new google.maps.LatLng(
            transformedCoordinate[1], transformedCoordinate[0]);
      }
      this.displayLocation_(location);
    } else {
      this.setError_(this.noResultFoundText);
    }
  } else {
    //If not, then display the results in a clickable list
    this.displayGeocodeResults_();
  }
};


/**
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.displayGeocodeResults_ = function() {
  var me = this;

  goog.array.forEach(this.results_, function(result, index) {
    var text;

    if (goog.isDefAndNotNull(result)) {
      if (goog.isDefAndNotNull(result.text)) {
        text = result.text;
      } else {
        text = result.formatted_address;
      }


      var resultOption = goog.dom.createDom(goog.dom.TagName.LI, {
        'data-result': index
      },
      text);
      me.clickableResultElements_.push(resultOption);

      goog.dom.appendChild(me.resultsList_, resultOption);

      goog.events.listen(resultOption, [
        goog.events.EventType.TOUCHEND,
        goog.events.EventType.CLICK
      ], me.handleResultOptionPress_, false, me);
    }
  });

  goog.style.setStyle(this.resultsList_, 'display', '');
};


/**
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.clearGeocodeResults_ = function() {
  goog.style.setStyle(this.resultsList_, 'display', 'none');
  //Unlisten to the results click event
  this.clickableResultElements_.forEach(function(element) {
    goog.events.unlisten(element, [
      goog.events.EventType.TOUCHEND,
      goog.events.EventType.CLICK
    ], this.handleResultOptionPress_, false, this);
  }, this);
  goog.dom.removeChildren(this.resultsList_);

  this.clickableResultElements_ = [];
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.handleWindowClick_ = function(
    browserEvent) {
  this.clearGeocodeResults_();
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.handleResultOptionPress_ = function(
    browserEvent) {

  this.clearGeocodeResults_();
  browserEvent.stopPropagation();

  var me = this;
  var element = browserEvent.currentTarget;
  var index = element.getAttribute('data-result');
  var result = this.results_[index];
  if (goog.isDefAndNotNull(result)) {
    this.input_.value = result.formatted_address;
  }

  var currentPosition = this.currentPositionControl_.getCurrentPosition();

  if (this.enableCurrentPosition_ &&
      (goog.isNull(currentPosition) ||
      goog.isNull(currentPosition.geometry) ||
      goog.isNull(result) || goog.isNull(result.geometry)) &&
      index === 0) {

    this.currentPositionControl_.setCurrentPosition(
        function(position) {

          me.displayLocation_(position.geometry.location);
        }, true);
  } else {
    this.displayLocation_(result.geometry.location);
  }
};


/**
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.resetSearchingTimeout_ = function() {
  var me = this;

  if (this.searchingTimeout_) {
    clearTimeout(this.searchingTimeout_);
  }

  this.searchingTimeout_ = setTimeout(function() {
    me.allowSearching_ = true;
    var input = me.input_;
    var value = input.value;
    var additionalAddresses = me.filterAddresses_(
        me.additionalAddresses, value);

    me.geocodeByAddress_(value, false, additionalAddresses);
  }, this.searchingDelay);
};


/**
 * @param {ol.MapBrowserEvent} mapBrowserEvent Map browser singleclick event.
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.handleMapSingleClick_ = function(
    mapBrowserEvent) {

  var map = this.getMap();

  var coordinate = mapBrowserEvent.coordinate;

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var projection = view2D.getProjection();

  var transformedCoordinate = ol.proj.transform(
      coordinate, projection.getCode(), 'EPSG:4326'
      );

  this.geocodeByCoordinate_(transformedCoordinate);
};


/**
 * @param {google.maps.LatLng} location
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.displayLocation_ = function(location) {
  var lat, lng;
  var map = this.getMap();

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var projection = view2D.getProjection();

  lng = location.lng();
  lat = location.lat();

  // clear vector feature
  this.clearVector_();

  // transform received coordinate (which is in lat, lng) into
  // map projection
  var transformedCoordinate = ol.proj.transform(
      [lng, lat], 'EPSG:4326', projection.getCode());

  var feature = new ol.Feature({
    geometry: new ol.geom.Point(transformedCoordinate)
  });
  feature.setStyle(this.iconStyle_);

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);
  vectorSource.addFeature(feature);

  this.setValues({'location': location});
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.handleClearButtonPress_ = function(
    browserEvent) {

  browserEvent.preventDefault();
  this.clear();
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.handleRemoveButtonPress_ = function(
    browserEvent) {

  browserEvent.preventDefault();

  goog.events.dispatchEvent(this,
      ol.control.GoogleMapsGeocoder.EventType.REMOVE);
};


/**
 * Show the remove button
 */
ol.control.GoogleMapsGeocoder.prototype.showRemoveButton = function() {
  this.removable_ = true;
  goog.style.setStyle(this.removeButton_, 'display', '');
};


/**
 * Hide the remove button
 */
ol.control.GoogleMapsGeocoder.prototype.hideRemoveButton = function() {
  this.removable_ = false;
  goog.style.setStyle(this.removeButton_, 'display', 'none');
};


/**
 * Clear layer and inputs
 */
ol.control.GoogleMapsGeocoder.prototype.clear = function() {
  this.clearVector_();
  this.setValues({'location': null});
  this.clearGeocodeResults_();
  this.input_.value = '';
};


/**
 * Clears the vector layer of any feature it may have.
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.clearVector_ = function() {
  var location = this.getLocation();

  if (goog.isDefAndNotNull(location)) {
    var vectorSource = this.vectorLayer_.getSource();
    goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);
    vectorSource.clear();
  }
};


/**
 * @param {Array} addresses
 * @param {?string} value Filter value
 * @return {Array} array of filtered adresses
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.filterAddresses_ = function(
    addresses, value) {

  var me = this;
  var results = [];
  var description, add;

  if (this.enableCurrentPosition_) {
    var currentPosition = this.currentPositionControl_.getCurrentPosition();
    results.push(currentPosition);
  }

  if (goog.isDefAndNotNull(value)) {
    value = value.toLowerCase();

    addresses.forEach(function(address) {
      description = address.description.toLowerCase();
      add = address.text.toLowerCase();

      if (description.indexOf(value) >= 0 || add.indexOf(value) >= 0) {
        results.push(me.formatAdress_(address));
      }
    });
  } else {
    addresses.forEach(function(address) {
      results.push(me.formatAdress_(address));
    });

  }

  return results;
};


/**
 * @param {Object} address
 * @return {Object} formatted address that fit the geocoding
 *  results format
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.formatAdress_ = function(
    address) {
  /*jshint -W069 */
  /*Disable Warning Justification:
    Using bracket notation so Google Closure Compiler
    ADVANCED_OPTIMIZATIONS will keep the original property names. */
  return {
    'formatted_address': address['description'],
    'geometry': {
      'location': new google.maps.LatLng(address['lat'],
          address['lon'])
    }
    /*jshint +W069 */
  };
};


/**
 * @return {?string} input value
 *  results format
 */
ol.control.GoogleMapsGeocoder.prototype.getInputValue = function() {
  return !goog.string.isEmptySafe(this.input_.value) ?
      this.input_.value : null;
};


/**
 * @param {ol.style.Style} styleObject
 */
ol.control.GoogleMapsGeocoder.prototype.setIconStyle = function(styleObject) {
  this.iconStyle_ = styleObject;

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);

  var sourceFeatures = vectorSource.getFeatures();

  for (var i = 0; i < sourceFeatures.length; i++)
    sourceFeatures[i].setStyle(this.iconStyle_);

};


/**
 * @param {?string} error
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.setError_ = function(error) {
  if (!goog.isNull(error) || !goog.isNull(this.error_)) {
    this.error_ = error;
    goog.events.dispatchEvent(this,
        ol.control.GoogleMapsGeocoder.EventType.ERROR);
  }
};


/**
 * @param {string} value
 */
ol.control.GoogleMapsGeocoder.prototype.setInputValue = function(value) {
  this.input_.value = value;
};


/**
 * @param {?google.maps.LatLng} location
 */
ol.control.GoogleMapsGeocoder.prototype.setLocation = function(location) {
  if (goog.isDefAndNotNull(location)) {
    this.displayLocation_(location);
  }
};
