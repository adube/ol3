goog.provide('ol.control.GoogleMapsGeocoder');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.string');
goog.require('goog.style');
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
   * @type {?ol.layer.Vector}
   * @private
   */
  this.vectorLayer_ = null;


  // === UI COMPONENTS ===
  var className = 'ol-google-maps-geocoder';

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': className + ' ' + ol.css.CLASS_UNSELECTABLE
  });

  var input = goog.dom.createDom(goog.dom.TagName.INPUT, {
    'class': ''
  });

  var searchButton = goog.dom.createDom(goog.dom.TagName.BUTTON, {
    'class': ''
  });
  var searchButtonText = goog.dom.createTextNode('Search');
  goog.dom.appendChild(searchButton, searchButtonText);

  var clearButton = goog.dom.createDom(goog.dom.TagName.BUTTON, {
    'class': ''
  });
  var clearButtonText = goog.dom.createTextNode('Clear');
  goog.dom.appendChild(clearButton, clearButtonText);

  var removeButton = goog.dom.createDom(goog.dom.TagName.BUTTON, {
    'class': ''
  });
  var removeButtonText = goog.dom.createTextNode('Remove');
  goog.dom.appendChild(removeButton, removeButtonText);

  goog.dom.appendChild(element, input);
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
  REMOVE: goog.events.getUniqueId('remove')
};


/**
 * @enum {string}
 */
ol.control.GoogleMapsGeocoder.Property = {
  LOCATION: 'location'
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
 * @inheritDoc
 */
ol.control.GoogleMapsGeocoder.prototype.setMap = function(map) {

  if (goog.isNull(map)) {
    var myMap = this.getMap();
    if (!goog.isNull(myMap)) {

      // disable reverse geocoding, if needed
      if (this.enableReverseGeocoding_ == true) {
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
    if (this.enableReverseGeocoding_ == true) {
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

  if (this.enableReverseGeocoding_ == true) {
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

  if (this.enableReverseGeocoding_ == false) {
    this.enableReverseGeocoding_ = true;
    map = this.getMap();
    goog.events.listen(map, [
      ol.MapBrowserEvent.EventType.SINGLECLICK
    ], this.handleMapSingleClick_, false, this);
  }
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
ol.control.GoogleMapsGeocoder.prototype.handleSearchButtonPress_ = function(
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

  var me = this;
  var geocoder = this.geocoder_;

  geocoder.geocode(
      {
        'address': address,
        'componentRestrictions': this.geocoderComponentRestrictions_
      },
      function(results, status) {
        me.handleGeocode_(results, status);
      }
  );
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
        me.handleGeocode_(results, status);
      }
  );
};


/**
 * @param {Array} results
 * @param {number|string} status
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.handleGeocode_ = function(
    results, status) {

  var formatted_address, lat, lng;
  var result;
  var tmpOutput = [];
  var input = this.input_;
  var map = this.getMap();
  var location;

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var projection = view2D.getProjection();

  if (status == google.maps.GeocoderStatus.OK) {
    if (results.length) {
      // TODO: support multiple results
      result = results[0];

      formatted_address = result.formatted_address;
      location = result.geometry.location;
      lng = location.lng();
      lat = location.lat();

      tmpOutput.push(formatted_address);
      tmpOutput.push('\n');
      tmpOutput.push('(');
      tmpOutput.push(lng);
      tmpOutput.push(', ');
      tmpOutput.push(lat);
      tmpOutput.push(')');

      //alert(tmpOutput.join(''));

      // clear first
      this.clear_();

      // set returned value
      input.value = formatted_address;

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


    } else {
      // TODO: manage no results
      alert('No results found');
    }
  } else {
    // TODO: manage error message
    alert(
        'Geocode was not successful for the following reason: ' +
        status
    );
  }
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.handleClearButtonPress_ = function(
    browserEvent) {

  browserEvent.preventDefault();
  this.clear_();
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
 * @private
 */
ol.control.GoogleMapsGeocoder.prototype.clear_ = function() {
  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);
  vectorSource.clear();

  var input = this.input_;
  input.value = '';

  this.setValues({'location': null});
};
