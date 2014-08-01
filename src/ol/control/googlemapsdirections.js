goog.provide('ol.control.GoogleMapsDirections');

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
goog.require('goog.structs.Map');
goog.require('ol.Collection');
goog.require('ol.Feature');
goog.require('ol.MapBrowserEvent.EventType');
goog.require('ol.Object');
goog.require('ol.View2D');
goog.require('ol.control.Control');
goog.require('ol.control.GoogleMapsDirectionsPanel');
goog.require('ol.control.GoogleMapsGeocoder');
goog.require('ol.css');
goog.require('ol.extent');
goog.require('ol.format.MTJSON');
goog.require('ol.geom.LineString');
goog.require('ol.geom.Point');
goog.require('ol.interaction.DryModify');
goog.require('ol.layer.Vector');
goog.require('ol.proj');
goog.require('ol.source.Vector');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');


/**
 * @define {number} Default buffer size in pixels to apply to the extent of
 * the route or single geolocation when recentering the map view to it.
 */
ol.control.GOOGLEMAPSDIRECTIONS_PIXEL_BUFFER = 30;


/**
 * @define {number} Default number of milliseconds to wait before launching
 * a route request that includes waypoint that has been dragged, whether
 * to add a new detour or to modify an existing waypoint of any type.
 */
ol.control.GOOGLEMAPSDIRECTIONS_ROUTE_DELAY_ON_WAYPOINT_DRAG = 300;


/**
 * @define {number} The maximum allowed waypoints.  Maps API for Business
 * customers are allowed 23 waypoints.
 */
ol.control.GOOGLEMAPSDIRECTIONS_MAX_WAYPOINTS = 8;


/**
 * @define {string} Default property name to use as label for detour features
 */
ol.control.GOOGLEMAPSDIRECTIONS_DETOUR_LABEL_PROPERTY = 'label';



/**
 * Todo
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.GoogleMapsDirectionsOptions=} opt_options Options.
 */
ol.control.GoogleMapsDirections = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  /**
   * i18n - waypointButton
   * @type {?string|undefined}
   */
  this.addWaypointButtonText =
      goog.isDefAndNotNull(options.addWaypointButtonText) ?
          options.addWaypointButtonText : 'Add Waypoint';

  /**
   * i18n - searchButton
   * @type {?string|undefined}
   */
  this.searchButtonText = goog.isDefAndNotNull(options.searchButtonText) ?
      options.searchButtonText : undefined;

  /**
   * i18n - clearButton
   * @type {?string|undefined}
   */
  this.clearButtonText = goog.isDefAndNotNull(options.clearButtonText) ?
      options.clearButtonText : undefined;

  /**
   * i18n - removeButton
   * @type {?string|undefined}
   */
  this.removeButtonText = goog.isDefAndNotNull(options.removeButtonText) ?
      options.removeButtonText : undefined;

  /**
   * i18n - myAddresses
   * @type {string}
   */
  this.myAddressesText = goog.isDefAndNotNull(options.myAddressesText) ?
      options.myAddressesText : 'My addresses';

  /**
   * i18n - myTravelModes
   * @type {string}
   */
  this.myTravelModesText = goog.isDefAndNotNull(options.myTravelModesText) ?
      options.myTravelModesText : 'My travel modes';

  /**
   * i18n - bicycling
   * @type {string}
   */
  this.bicyclingText = goog.isDef(options.bicyclingText) ?
      options.bicyclingText : 'Bicycling';

  /**
   * i18n - carpooling
   * @type {string}
   */
  this.carpoolingText = goog.isDef(options.carpoolingText) ?
      options.carpoolingText : 'Carpooling';

  /**
   * i18n - driving
   * @type {string}
   */
  this.drivingText = goog.isDef(options.drivingText) ?
      options.drivingText : 'Driving';

  /**
   * i18n - transit
   * @type {string}
   */
  this.transitText = goog.isDef(options.transitText) ?
      options.transitText : 'Transit';

  /**
   * i18n - walking
   * @type {string}
   */
  this.walkingText = goog.isDef(options.walkingText) ?
      options.walkingText : 'Walking';


  /**
   * Travel modes that should be checked by default.  Values can be:
   * 'bicycling', 'carpooling', 'driving', 'transit', 'walking'.
   * @type {Array.<string>}
   * @private
   */
  this.defaultTravelModes_ = goog.isDef(options.defaultTravelModes) ?
      options.defaultTravelModes :
      [ol.control.GoogleMapsDirections.TravelMode.DRIVING];


  /**
   * Collection of travel mode input elements
   * @type {ol.Collection}
   * @private
   */
  this.travelModeInputElements_ = new ol.Collection();


  /**
   * Collection of travel mode checkbox-like link elements
   * @type {ol.Collection}
   * @private
   */
  this.travelModeCheckboxLinkElements_ = new ol.Collection();

  /**
   * @type {string}
   * @private
   */
  this.classPrefix_ = 'ol-gmds';
  var classPrefix = this.classPrefix_;


  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + ' ' + ol.css.CLASS_UNSELECTABLE
  });

  /**
   * How this widget should behave when more than one travel mode is selected.
   * Possible values are:
   *  - 'single': only one travel mode will be used in the request. The one with
   *              the highest priority will be used
   *  - 'multiple': all travel modes will be used in the request.  Requires a
   *                multimodalUrl to be set to work properly.
   * @type {string}
   * @private
   */
  this.mode_ = goog.isDef(options.mode) ?
      options.mode : ol.control.GoogleMapsDirections.Mode.SINGLE;


  /**
   * Collection of travel modes ordered (added) by the highest priority to use
   * in a request in 'single'
   * @type {Array.<string>}
   * @private
   */
  this.travelModesByPriority_ = [
    ol.control.GoogleMapsDirections.TravelMode.DRIVING,
    ol.control.GoogleMapsDirections.TravelMode.TRANSIT,
    ol.control.GoogleMapsDirections.TravelMode.BICYCLING,
    ol.control.GoogleMapsDirections.TravelMode.WALKING
  ];


  /**
   * @type {?string}
   * @private
   */
  this.multimodalUrl_ = goog.isDef(options.multimodalUrl) ?
      options.multimodalUrl : null;

  /**
   * @type {Object}
   * @private
   */
  this.multimodalHeaders_ = goog.isDef(options.multimodalHeaders) ?
      options.multimodalHeaders : {};


  /**
   * @type {boolean}
   * @private
   */
  this.multimodalUsePostMethod_ = goog.isDef(options.multimodalUsePostMethod) ?
      options.multimodalUsePostMethod : true;

  var firstContainer = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-container ' + classPrefix + '-container-1'
  });
  goog.dom.appendChild(element, firstContainer);

  var secondContainer = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-container ' + classPrefix + '-container-2'
  });
  goog.dom.appendChild(element, secondContainer);

  // DOM components - travel modes
  var travelModes = [
    ol.control.GoogleMapsDirections.TravelMode.DRIVING,
    ol.control.GoogleMapsDirections.TravelMode.WALKING,
    ol.control.GoogleMapsDirections.TravelMode.BICYCLING,
    ol.control.GoogleMapsDirections.TravelMode.TRANSIT,
    ol.control.GoogleMapsDirections.TravelMode.CARPOOLING
  ];

  var fieldsetEl = goog.dom.createDom(goog.dom.TagName.FIELDSET, {
    'class': classPrefix + '-fieldset'
  });
  goog.dom.appendChild(firstContainer, fieldsetEl);

  var myTravelModesLabelEl = goog.dom.createDom(goog.dom.TagName.LABEL, {
    'class': classPrefix + '-label'
  });
  goog.dom.appendChild(myTravelModesLabelEl,
      goog.dom.createTextNode(this.myTravelModesText + ': '));
  goog.dom.appendChild(firstContainer, myTravelModesLabelEl);


  var checkboxLinkContainerEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-checkbox-link-container'
  });
  goog.dom.appendChild(firstContainer, checkboxLinkContainerEl);

  goog.array.forEach(travelModes, function(travelMode) {
    var labelText = '';
    switch (travelMode) {
      case ol.control.GoogleMapsDirections.TravelMode.BICYCLING:
        labelText = this.bicyclingText;
        break;
      case ol.control.GoogleMapsDirections.TravelMode.CARPOOLING:
        labelText = this.carpoolingText;
        break;
      case ol.control.GoogleMapsDirections.TravelMode.DRIVING:
        labelText = this.drivingText;
        break;
      case ol.control.GoogleMapsDirections.TravelMode.TRANSIT:
        labelText = this.transitText;
        break;
      case ol.control.GoogleMapsDirections.TravelMode.WALKING:
        labelText = this.walkingText;
        break;
    }

    // == input ==
    var inputOptions = {
      'type': 'checkbox',
      'name': travelMode
    };

    if (goog.array.indexOf(this.defaultTravelModes_, travelMode) != -1) {
      inputOptions.checked = 'checked';
    }

    var inputEl = goog.dom.createDom(goog.dom.TagName.INPUT, inputOptions);
    goog.dom.appendChild(fieldsetEl, inputEl);

    this.travelModeInputElements_.push(inputEl);

    var labelEl = goog.dom.createDom(goog.dom.TagName.LABEL, {
    });
    goog.dom.appendChild(fieldsetEl, labelEl);
    goog.dom.appendChild(labelEl, goog.dom.createTextNode(labelText));

    // == checkbox-like link ==
    var checkboxLinkClass = [];
    checkboxLinkClass.push(classPrefix + '-checkbox-link');
    checkboxLinkClass.push(classPrefix + '-checkbox-link-' + travelMode);

    if (goog.array.indexOf(this.defaultTravelModes_, travelMode) != -1) {
      checkboxLinkClass.push(classPrefix + '-checkbox-link-checked');
    }

    var checkboxLinkOptions = {
      'class': checkboxLinkClass.join(' '),
      'title': labelText,
      'data-travel-mode': travelMode
    };

    var checkboxLinkEl = goog.dom.createDom(goog.dom.TagName.A,
        checkboxLinkOptions);

    goog.dom.appendChild(checkboxLinkContainerEl, checkboxLinkEl);
    this.travelModeCheckboxLinkElements_.push(checkboxLinkEl);

    goog.events.listen(checkboxLinkEl, [
      goog.events.EventType.TOUCHEND,
      goog.events.EventType.CLICK
    ], this.handleCheckboxLinkElPress_, false, this);

  }, this);

  var separatorEl = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-checkbox-link-end-separator'
  });
  goog.dom.appendChild(checkboxLinkContainerEl, separatorEl);

  var myAddressesLabelEl = goog.dom.createDom(goog.dom.TagName.LABEL, {
    'class': classPrefix + '-label'
  });
  goog.dom.appendChild(
      myAddressesLabelEl, goog.dom.createTextNode(this.myAddressesText + ': '));
  goog.dom.appendChild(secondContainer, myAddressesLabelEl);

  // DOM components - add waypoint
  var addGeocoderButton = goog.dom.createDom(goog.dom.TagName.BUTTON, {
    'class': classPrefix + '-add-waypoint-button'
  });
  var addGeocoderButtonText =
      goog.dom.createTextNode(this.addWaypointButtonText);
  goog.dom.appendChild(addGeocoderButton, addGeocoderButtonText);
  goog.dom.appendChild(secondContainer, addGeocoderButton);
  goog.events.listen(addGeocoderButton, [
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.CLICK
  ], this.handleAddWPGeocoderButtonPress_, false, this);

  // DOM components - waypoint geocoders
  var geocodersContainer = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-geocoders'
  });
  goog.dom.appendChild(secondContainer, geocodersContainer);


  /**
   * @type {Object}
   * @private
   */
  this.geocoderComponentRestrictions_ = goog.isDef(
      options.geocoderComponentRestrictions) ?
      options.geocoderComponentRestrictions : {};


  /**
   * @type {Array}
   * @private
   */
  this.iconStyles_ = options.iconStyles;

  /**
   * @type {Array}
   * @private
   */
  this.iconImages_ = [];

  for (var i = 0; i < this.iconStyles_.length; i++)
  {
    this.iconImages_.push(this.iconStyles_[i].getImage().getSrc());
  }

  /**
   * User provided style for lines.
   * @type {Array.<(null|ol.style.Style)>|null|ol.feature.FeatureStyleFunction|ol.style.Style}
   * @private
   */
  this.lineStyle_ = options.lineStyle;


  /**
   * User provided style for detour icons.
   * @type {Array.<(null|ol.style.Style)>|null|ol.feature.FeatureStyleFunction|ol.style.Style}
   * @private
   */
  this.detourIconStyle_ = options.detourIconStyle;


  /**
   * @type {ol.Collection}
   * @private
   */
  this.geocoders_ = new ol.Collection();


  /**
   * @type {Element}
   * @private
   */
  this.geocodersContainer_ = geocodersContainer;


  /**
   * @type {?ol.layer.Vector}
   * @private
   */
  this.vectorLayer_ = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: []
    })
  });


  /**
   * @type {number}
   * @private
   */
  this.pixelBuffer_ = goog.isDefAndNotNull(options.pixelBuffer) ?
      options.pixelBuffer : ol.control.GOOGLEMAPSDIRECTIONS_PIXEL_BUFFER;


  /**
   * @type {ol.Collection}
   * @private
   */
  this.routeFeatures_ = new ol.Collection();


  /**
   * @type {ol.Collection}
   * @private
   */
  this.selectedRouteFeatures_ = new ol.Collection();


  /**
   * Whether to automatically send routing request when the minimum
   * query parameters are set or not. Defaults to true.
   * @type {boolean}
   * @private
   */
  this.enableAutoRouting_ = goog.isDef(options.enableAutoRouting) ?
      options.enableAutoRouting : true;


  /**
   * Whether to enable detours or not. Defaults to false.
   * @type {boolean}
   * @private
   */
  this.enableDetours_ = goog.isDef(options.enableDetours) ?
      options.enableDetours : false;


  /**
   * @type {?number}
   * @private
   */
  this.newDetourTimerId_ = null;


  /**
   * @type {ol.Collection}
   * @private
   */
  this.detourFeatures_ = new ol.Collection();


  /**
   * @type {number}
   * @private
   */
  this.routeDelayOnWaypointDrag_ =
      goog.isDef(options.routeDelayOnWaypointDrag) ?
      options.routeDelayOnWaypointDrag :
      ol.control.GOOGLEMAPSDIRECTIONS_ROUTE_DELAY_ON_WAYPOINT_DRAG;


  /**
   * @type {number}
   * @private
   */
  this.maxWaypoints_ = goog.isDef(options.maxWaypoints) ?
      options.maxWaypoints :
      ol.control.GOOGLEMAPSDIRECTIONS_MAX_WAYPOINTS;


  /**
   * @type {?ol.interaction.DryModify}
   * @private
   */
  this.dryModify_ = null;
  if (this.enableDetours_ === true) {
    this.dryModify_ = new ol.interaction.DryModify({
      features: this.selectedRouteFeatures_,
      pixelTolerance: goog.isDef(options.modifyPixelTolerance) ?
          options.modifyPixelTolerance : 8,
      style: [
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({color: 'white'}),
            stroke: new ol.style.Stroke({color: 'black', width: 2})
          })
        })
      ]
    });
  }


  /**
   * @type {boolean}
   * @private
   */
  this.createNewDetour_ = true;


  /**
   * @type {?ol.Feature}
   * @private
   */
  this.lastDetourFeatureOverPointer_ = null;


  /**
   * @type {string}
   * @private
   */
  this.detourLabelProperty_ = goog.isDef(options.detourLabelProperty) ?
      options.detourLabelProperty :
      ol.control.GOOGLEMAPSDIRECTIONS_DETOUR_LABEL_PROPERTY;


  /**
   * @type {ol.control.GoogleMapsDirectionsPanel}
   * @private
   */
  this.directionsPanel_ = options.directionsPanel;

  goog.events.listen(
      this.directionsPanel_,
      ol.control.GoogleMapsDirectionsPanel.EventType.SELECT,
      this.handleSelectionChanged_, false, this);

  goog.events.listen(
      this.directionsPanel_,
      ol.control.GoogleMapsDirectionsPanel.EventType.UNSELECT,
      this.handleSelectionCleared_, false, this);

  goog.events.listen(
      this.directionsPanel_,
      ol.control.GoogleMapsDirectionsPanel.EventType.HOVER,
      this.handleHover_, false, this);

  goog.events.listen(
      this.directionsPanel_,
      ol.control.GoogleMapsDirectionsPanel.EventType.UNHOVER,
      this.handleHoverStopped_, false, this);


  /**
   * @type {ol.format.MTJSON}
   * @private
   */
  this.format_ = new ol.format.MTJSON();


  /**
   * Is set to 'true' while loading, which prevents some events to apply.
   * @type {boolean}
   * @private
   */
  this.loading_ = false;


  goog.base(this, {
    element: element,
    target: options.target
  });


  /**
   * @type {google.maps.DirectionsService}
   * @private
   */
  this.directionsService_ = new google.maps.DirectionsService();

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
      navigator.geolocation) {

    this.enableCurrentPosition_ = true;
  } else {
    this.enableCurrentPosition_ = false;
  }

  /**
   * @private
   * @type {string}
   */
  this.getURL_ = goog.isDefAndNotNull(options.getURL) ?
      options.getURL : null;

  // FIXME - remove this
  if (!goog.isNull(this.getURL_)) {
    window.console.log(this.getURL_);
  }

};
goog.inherits(ol.control.GoogleMapsDirections, ol.control.Control);


/**
 * @enum {string}
 */
ol.control.GoogleMapsDirections.EventType = {
  CLEAR: goog.events.getUniqueId('clear'),
  QUERYPARAMSCHANGE: goog.events.getUniqueId('queryparamchange'),
  ROUTECOMPLETE: goog.events.getUniqueId('routecomplete'),
  SELECT: goog.events.getUniqueId('select')
};


/**
 * Determines how this widget should behave with the travel modes selected.
 * @enum {string}
 */
ol.control.GoogleMapsDirections.Mode = {
  MULTIPLE: 'multiple',
  SINGLE: 'single'
};


/**
 * @enum {string}
 */
ol.control.GoogleMapsDirections.TravelMode = {
  BICYCLING: 'bicycling',
  CARPOOLING: 'carpooling',
  DRIVING: 'driving',
  TRANSIT: 'transit',
  WALKING: 'walking'
};


/**
 * Returns an array of objects containing information about the geocoders
 * that currently have locations.
 * @return {Array}
 */
ol.control.GoogleMapsDirections.prototype.getGeocoderInfo = function() {
  var info = [];

  var geocoders = this.collectGeocoders_();
  var startGeocoder = geocoders.start;
  var endGeocoder = geocoders.end;
  var waypointGeocoders = geocoders.waypoints;

  // start
  var startCoordinate = startGeocoder.getCoordinate();
  var startAddress = startGeocoder.getInputValue();
  if (!goog.isNull(startCoordinate) && !goog.isNull(startAddress)) {
    info.push({
      'address': startAddress,
      'coordinates': startCoordinate,
      'type': 'start'
    });
  }

  // end
  var endCoordinate = endGeocoder.getCoordinate();
  var endAddress = endGeocoder.getInputValue();
  if (!goog.isNull(endCoordinate) && !goog.isNull(endAddress)) {
    info.push({
      'address': endAddress,
      'coordinates': endCoordinate,
      'type': 'end'
    });
  }

  // waypoints
  var waypointCoordinate;
  var waypointAddress;
  waypointGeocoders.forEach(function(geocoder) {
    waypointCoordinate = geocoder.getCoordinate();
    waypointAddress = geocoder.getInputValue();
    if (!goog.isNull(waypointCoordinate) && !goog.isNull(waypointAddress)) {
      info.push({
        'address': waypointAddress,
        'coordinates': waypointCoordinate,
        'type': 'waypoint'
      });
    }
  }, this);

  // detours
  this.detourFeatures_.forEach(function(detourFeature) {
    info.push({
      'address': '',
      'coordinates': detourFeature.getGeometry().getCoordinates(),
      'type': 'detour'
    });
  }, this);

  return info;
};


/**
 * Read the given source object then load its element as query parameters
 * and results (routes)
 * @param {Object} source
 */
ol.control.GoogleMapsDirections.prototype.load = function(source) {
  this.loadAll_(source, true);
};


/**
 * Read the given source object then load its query parameters elements only
 * @param {Object} source
 */
ol.control.GoogleMapsDirections.prototype.loadQueryParams = function(source) {
  this.loadAll_(source, false);
};


/**
 * Collect and return the query parameters AND result (routes) as MTJSON
 * @return {string} serialized json ready for save
 */
ol.control.GoogleMapsDirections.prototype.save = function() {
  return this.saveAll_(true);
};


/**
 * Collect and return the query parameters only as MTJSON
 * @return {string} serialized json ready for save
 */
ol.control.GoogleMapsDirections.prototype.saveQueryParams = function() {
  return this.saveAll_(false);
};


/**
 * @inheritDoc
 */
ol.control.GoogleMapsDirections.prototype.setMap = function(map) {

  var myMap = this.getMap();
  if (goog.isNull(map) && !goog.isNull(myMap)) {
    myMap.removeLayer(this.vectorLayer_);
    myMap.removeControl(this.directionsPanel_);

    goog.events.unlisten(
        myMap,
        ol.MapBrowserEvent.EventType.POINTERMOVE,
        this.handleMapPointerMove_, false, this);

    goog.events.unlisten(
        myMap,
        ol.MapBrowserEvent.EventType.SINGLECLICK,
        this.handleMapSingleClick_, false, this);

    this.removeAllGeocoders_();
  }

  goog.base(this, 'setMap', map);

  if (!goog.isNull(map)) {
    map.addLayer(this.vectorLayer_);
    map.addControl(this.directionsPanel_);
    this.addGeocoder_();
    this.addGeocoder_();
    this.manageNumWaypoints_();

    goog.events.listen(
        map,
        ol.MapBrowserEvent.EventType.POINTERMOVE,
        this.handleMapPointerMove_, false, this);

    goog.events.listen(
        map,
        ol.MapBrowserEvent.EventType.SINGLECLICK,
        this.handleMapSingleClick_, false, this);
  }
};


/**
 * Public method used to manually trigger a route request.
 */
ol.control.GoogleMapsDirections.prototype.triggerRouteRequest = function() {
  this.clear_();
  this.route_();
};


/**
 * Create and return a new waypoint geocoder, which is also added to the
 * inner geocoders.
 * @return {?ol.control.GoogleMapsGeocoder}
 * @private
 */
ol.control.GoogleMapsDirections.prototype.addGeocoder_ = function() {

  var geocoder = null;
  var geocoders = this.geocoders_;
  var iconStyles = this.iconStyles_;

  if (!this.canAddAnOtherWaypoint_()) {
    // todo - show 'too many waypoints' message
    return geocoder;
  }

  var map = this.getMap();
  var container = this.geocodersContainer_;

  var numGeocoders = geocoders.getLength();
  var iconStyle = iconStyles[numGeocoders];

  if (!goog.isDefAndNotNull(iconStyle)) {
    // todo - throw error: "Not enough icon styles set"
    return geocoder;
  }

  geocoder = new ol.control.GoogleMapsGeocoder({
    'enableReverseGeocoding': false,
    'target': container,
    'enableCurrentPosition': this.enableCurrentPosition_,
    'currentPositionControl': this.currentPositionControl_,
    // FIXME
    'additionalAddresses': [],
    //'additionalAddresses': this.startGeocoder_.additionalAddresses,
    'searchButtonText': this.searchButtonText,
    'clearButtonText': this.clearButtonText,
    'removeButtonText': this.removeButtonText,
    'geocoderComponentRestrictions': this.geocoderComponentRestrictions_,
    'iconStyle': iconStyle
  });

  map.addControl(geocoder);

  goog.events.listen(
      geocoder,
      ol.Object.getChangeEventType(
          ol.control.GoogleMapsGeocoder.Property.LOCATION
      ),
      this.handleLocationChanged_, false, this);

  goog.events.listen(
      geocoder,
      ol.control.GoogleMapsGeocoder.EventType.REMOVE,
      this.handleGeocoderRemove_, false, this);

  geocoders.push(geocoder);

  this.toggleGeocoderReverseGeocodings_();

  this.manageNumWaypoints_();

  this.manageNumGeocoders_();

  return geocoder;
};


/**
 * @private
 * @return {boolean}
 */
ol.control.GoogleMapsDirections.prototype.canAddAnOtherWaypoint_ = function() {
  var max = this.maxWaypoints_;
  var detourFeatures = this.detourFeatures_;
  var geocoders = this.geocoders_;

  // 2 -> to exclude the start and end geocoders
  var total = detourFeatures.getLength() + geocoders.getLength() - 2;

  return (total < max);
};


/**
 * Returns whether we can or can't use the multimodal routing service, i.e.
 * using the user-custom multimodal url
 * @return {boolean}
 * @private
 */
ol.control.GoogleMapsDirections.prototype.canUseMultimodalService_ =
    function() {
  return !goog.isNull(this.multimodalUrl_);
};


/**
 * @private
 */
ol.control.GoogleMapsDirections.prototype.clear_ = function() {

  this.routeFeatures_.clear();
  this.selectedRouteFeatures_.clear();

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);
  vectorSource.clear();

  this.directionsPanel_.clearDirections();

  goog.events.dispatchEvent(this,
      ol.control.GoogleMapsDirections.EventType.CLEAR);
};


/**
 * Return an array of icon images corresponding to the geocoders that have
 * a location set.
 * @return {Array.<string>}
 * @private
 */
ol.control.GoogleMapsDirections.prototype.collectGeocoderIconImages_ =
    function() {

  var iconImages = this.iconImages_;
  var collectedIconImages = [];

  var geocoder;
  var index;
  var location;
  var iconImage;

  this.geocoders_.forEach(function(geocoder, index) {
    location = geocoder.getLocation();
    iconImage = iconImages[index];
    if (goog.isDefAndNotNull(location) && goog.isDefAndNotNull(iconImage)) {
      collectedIconImages.push(iconImage);
    }
  }, this);

  return collectedIconImages;
};


/**
 * Return an object of geocoders organized in a way that we know which ones
 * should act as 'start', 'end' and 'waypoints'.
 * @return {Object}
 * @private
 */
ol.control.GoogleMapsDirections.prototype.collectGeocoders_ = function() {
  var geocoders = {
    'end': null,
    'start': null,
    'waypoints': []
  };

  var geocodersWithLocations = new ol.Collection();

  this.geocoders_.forEach(function(geocoder) {
    if (goog.isDefAndNotNull(geocoder.getLocation())) {
      geocodersWithLocations.push(geocoder);
    }
  }, this);

  // at least 2 geocoders is required in order to have a 'start' and 'end'
  if (geocodersWithLocations.getLength() >= 2) {
    geocoders.start = geocodersWithLocations.removeAt(0);
    geocoders.end = geocodersWithLocations.pop();
    geocoders.waypoints = geocodersWithLocations.getArray();
  }

  return geocoders;
};


/**
 * @param {ol.Coordinate} coordinate
 * @param {boolean} shouldRoute Whether the creation or update of the detour
 * should trigger a new route update or not (not being when a detour is
 * manually added, on loading)
 * @private
 */
ol.control.GoogleMapsDirections.prototype.createOrUpdateDetour_ = function(
    coordinate, shouldRoute) {

  var detourFeatures = this.detourFeatures_;
  var numDetourFeatures = detourFeatures.getLength();

  if (!this.canAddAnOtherWaypoint_()) {
    // todo - throw error
    return;
  }

  var feature = new ol.Feature({
    geometry: new ol.geom.Point(coordinate)
  });
  feature.setStyle(this.detourIconStyle_);

  if (this.createNewDetour_ === true) {
    this.createNewDetour_ = false;
  } else {
    detourFeatures.removeAt(numDetourFeatures - 1);
  }

  detourFeatures.push(feature);

  goog.events.dispatchEvent(this,
      ol.control.GoogleMapsDirections.EventType.QUERYPARAMSCHANGE);

  if (shouldRoute === true) {
    this.clear_();
    this.route_();
  }

  this.manageNumWaypoints_();
};


/**
 * Disable all geocoder reverse geocoding.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.disableGeocoderReverseGeocodings_ =
    function() {
  this.geocoders_.forEach(function(geocoder) {
    geocoder.disableReverseGeocoding();
  }, this);

};


/**
 * Draw the selected route and all detour features.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.drawRoute_ = function() {

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);

  var features = [];

  var selectedRouteFeatures = this.selectedRouteFeatures_;
  var detourFeatures = this.detourFeatures_;

  // add selected route features.  There can be one or zero.
  selectedRouteFeatures.forEach(function(feature) {
    features.push(feature);
  }, this);

  // add detour features
  detourFeatures.forEach(function(feature) {
    features.push(feature);
  }, this);

  // add features to layer
  vectorSource.addFeatures(features);
};


/**
 * Fix map view extent to include coordinate if coordinate is outside
 * extent.
 * @param {ol.Coordinate} coordinate in map view projection
 * @private
 */
ol.control.GoogleMapsDirections.prototype.fitViewExtentToCoordinate_ =
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


/**
 * Fix map view extent to route.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.fitViewExtentToRoute_ = function() {
  var map = this.getMap();

  var size = map.getSize();
  goog.asserts.assertArray(size);

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);
  var extent = vectorSource.getExtent();

  var resolution = view2D.getResolutionForExtent(extent, size);
  var pixelBuffer = this.pixelBuffer_;
  var buffer = resolution * pixelBuffer;
  extent = ol.extent.buffer(extent, buffer);

  view2D.fitExtent(extent, size);
};


/**
 * Returns the list of currently checked travel mode ids.
 *
 * 'transit' - has to be temporarly ignored when checked because it is not
 *     yet available in Google Maps.
 * @param {boolean} includeIgnored Whether to include the ignored checked
 *     elements or not
 * @return {Array.<string>}
 * @private
 */
ol.control.GoogleMapsDirections.prototype.getCheckedTravelModes_ =
    function(includeIgnored) {
  var elements = [];

  this.travelModeInputElements_.forEach(function(inputEl) {
    if (inputEl.checked === true) {
      // todo - ENABLE_TRANSIT - remove this when transit become available
      if (includeIgnored ||
          inputEl.name != ol.control.GoogleMapsDirections.TravelMode.TRANSIT) {
        elements.push(inputEl.name);
      }
    }
  }, this);

  return elements;
};


/**
 * Returns the according google maps travel mode property using a given
 * inner travel mode.
 * @param {string} innerTravelMode
 * @return {google.maps.TravelMode.<(number|string)>|string}
 * @private
 */
ol.control.GoogleMapsDirections.prototype.getGoogleMapsTravelMode_ = function(
    innerTravelMode) {
  var googleMapsTravelMode = '';

  switch (innerTravelMode) {
    case ol.control.GoogleMapsDirections.TravelMode.BICYCLING:
      googleMapsTravelMode = google.maps.TravelMode.BICYCLING;
      break;
    case ol.control.GoogleMapsDirections.TravelMode.DRIVING:
      googleMapsTravelMode = google.maps.TravelMode.DRIVING;
      break;
    case ol.control.GoogleMapsDirections.TravelMode.TRANSIT:
      googleMapsTravelMode = google.maps.TravelMode.TRANSIT;
      break;
    case ol.control.GoogleMapsDirections.TravelMode.WALKING:
      googleMapsTravelMode = google.maps.TravelMode.WALKING;
      break;
  }

  return googleMapsTravelMode;
};


/**
 * @param {ol.Pixel} pixel Pixel.
 * @return {?ol.Feature}
 * @private
 */
ol.control.GoogleMapsDirections.prototype.getDetourFeatureAtPixel_ = function(
    pixel) {

  var map = this.getMap();
  var detourFeaturesArray = this.detourFeatures_.getArray();
  var feature = map.forEachFeatureAtPixel(
      pixel, function(feature, layer) {
        if (detourFeaturesArray.indexOf(feature) != -1) {
          return feature;
        }
      });

  return feature;
};


/**
 * @param {Array.<string>} travelModes Travel modes in which to find the one
 *     with the highest priority.
 * @return {string}
 * @private
 */
ol.control.GoogleMapsDirections.prototype.getHighestPriorityTravelMode_ =
    function(travelModes) {

  var highestPriorityTravelMode = '';
  var index;

  goog.array.some(
      this.travelModesByPriority_,
      /** @return {boolean} */
      function(travelMode) {
        index = goog.array.indexOf(travelModes, travelMode);
        if (index != -1) {
          highestPriorityTravelMode = travelModes[index];
          return true;
        } else {
          return false;
        }
      },
      this);

  // highest priority is 'driving' by default
  if (highestPriorityTravelMode === '') {
    highestPriorityTravelMode =
        ol.control.GoogleMapsDirections.TravelMode.DRIVING;
  }

  return highestPriorityTravelMode;
};


/**
 * @param {string} travelMode Travel mode
 * @return {Element}
 * @private
 */
ol.control.GoogleMapsDirections.prototype.getInputElByTravelMode_ =
    function(travelMode) {
  var foundInputEl;

  goog.array.some(this.travelModeInputElements_.getArray(), function(inputEl) {
    if (inputEl.name === travelMode) {
      foundInputEl = inputEl;
      return true;
    } else {
      return false;
    }
  });

  return foundInputEl;
};


/**
 * @param {goog.events.Event} browserEvent Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleAddWPGeocoderButtonPress_ =
    function(browserEvent) {

  browserEvent.preventDefault();
  this.addGeocoder_();
};


/**
 * @param {goog.events.Event} browserEvent Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleCheckboxLinkElPress_ =
    function(browserEvent) {

  browserEvent.preventDefault();

  var linkEl = browserEvent.target;
  goog.asserts.assertInstanceof(linkEl, Node);

  var travelMode = linkEl.getAttribute('data-travel-mode');
  var inputEl = this.getInputElByTravelMode_(travelMode);

  this.toggleTravelMode_(inputEl, linkEl, !inputEl.checked);

  this.clear_();

  // dispatch the event only when the user clicked on a checkbox link
  // instead of in the toggleTravelMode_ method since the latter can be
  // used programmatically and we don't need the event triggerered when that
  // happens
  goog.events.dispatchEvent(this,
      ol.control.GoogleMapsDirections.EventType.QUERYPARAMSCHANGE);

  if (this.enableAutoRouting_ === true) {
    this.route_();
  }
};


/**
 * @param {google.maps.DirectionsResult|Object} response
 * @param {google.maps.DirectionsStatus} status
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleDirectionsResult_ = function(
    response, status) {

  var map = this.getMap();

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var projection = view2D.getProjection();

  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);

  var lat, location, lng, transformedCoordinate;
  var feature;
  var coordinates;
  var geometry;

  var routeFeatures = this.routeFeatures_;

  if (status == google.maps.DirectionsStatus.OK) {
    goog.array.forEach(response.routes, function(route) {
      geometry = null;

      if (goog.isDefAndNotNull(route.overview_path)) {
        coordinates = [];
        goog.array.forEach(route.overview_path, function(location) {
          lng = location.lng();
          lat = location.lat();
          transformedCoordinate = ol.proj.transform(
              [lng, lat], 'EPSG:4326', projection.getCode());
          coordinates.push(transformedCoordinate);
        }, this);
        geometry = new ol.geom.LineString(coordinates);
      } else if (goog.isDef(route.geometry)) {
        geometry = route.geometry;
      } else if (goog.isDef(route.coordinates)) {
        geometry = new ol.geom.LineString(route.coordinates);
      }

      if (goog.isNull(geometry)) {
        // todo - manage error
        return;
      }

      feature = new ol.Feature(geometry);
      feature.setStyle(this.lineStyle_);
      routeFeatures.push(feature);
    }, this);

    if (routeFeatures.getLength()) {
      // set directions in panel
      this.directionsPanel_.setDirections(
          response, this.collectGeocoderIconImages_());
    }
  }

  if (this.loading_ === false) {
    goog.events.dispatchEvent(this,
        ol.control.GoogleMapsDirections.EventType.ROUTECOMPLETE);
  }

};


/**
 * @param {Object|goog.events.Event|null|string} evt
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleDryModifyDrag_ = function(evt) {

  var me = this;
  var dryModify = evt.target;
  var coordinate = dryModify.coordinate_;

  if (goog.isDefAndNotNull(this.newDetourTimerId_)) {
    window.clearTimeout(this.newDetourTimerId_);
  }

  this.newDetourTimerId_ = window.setTimeout(function() {
    me.createOrUpdateDetour_(coordinate, true);
  }, this.routeDelayOnWaypointDrag_);

};


/**
 * @param {Object|goog.events.Event|null|string} evt
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleDryModifyDragEnd_ = function(
    evt) {
  this.createNewDetour_ = true;
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleGeocoderRemove_ = function(
    event) {

  var geocoder = event.target;
  goog.asserts.assertInstanceof(geocoder, ol.control.GoogleMapsGeocoder);

  this.removeGeocoder_(geocoder);

  this.manageNumWaypoints_();

  this.toggleGeocoderReverseGeocodings_();

  var geocoderLocation = geocoder.getLocation();

  // trigger a new routing request only if the removed geocoder had a location
  // and if there's a start and an end
  if (goog.isDefAndNotNull(geocoderLocation)) {

    this.clear_();

    goog.events.dispatchEvent(this,
        ol.control.GoogleMapsDirections.EventType.QUERYPARAMSCHANGE);

    if (this.enableAutoRouting_ === true) {
      this.route_();
    }
  }
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleLocationChanged_ =
    function(event) {

  // ignore this callback while loading
  if (this.loading_ === true) {
    return;
  }

  var geocoders = this.collectGeocoders_();
  var startGeocoder = geocoders.start;
  var endGeocoder = geocoders.end;

  var currentGeocoder = event.target;
  var currentLocation = currentGeocoder.getLocation();

  this.clear_();
  this.toggleGeocoderReverseGeocodings_();

  goog.events.dispatchEvent(this,
      ol.control.GoogleMapsDirections.EventType.QUERYPARAMSCHANGE);

  if (goog.isDefAndNotNull(startGeocoder) &&
      goog.isDefAndNotNull(endGeocoder) &&
      this.enableAutoRouting_ === true) {
    this.route_();
  } else {
    if (goog.isDefAndNotNull(currentLocation)) {
      this.fitViewExtentToCoordinate_(currentGeocoder.getCoordinate());
    }
  }

};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleMapPointerMove_ = function(
    event) {

  var map = this.getMap();
  var detourFeatures = this.detourFeatures_;

  if (detourFeatures.getLength() > 0) {
    var pixel = map.getEventPixel(event.originalEvent);
    this.toggleDetourFeatureRemoveSymbol_(pixel);
  }
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleMapSingleClick_ = function(
    event) {

  this.removeDetourFeature_(event.pixel);
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleSelectionChanged_ = function(
    event) {

  var index = this.directionsPanel_.getSelectedRouteIndex();
  if (!goog.isNull(index)) {
    this.selectRoute_(index);
  }
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleSelectionCleared_ = function(
    event) {
  var index = this.directionsPanel_.getSelectedRouteIndex();
  if (!goog.isNull(index)) {
    this.unselectRoute_(index);
  }
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleHover_ = function(
    event) {

  var index = this.directionsPanel_.getSelectedRouteIndex();
  if (!goog.isNull(index)) {
    //this.hoverRoute_(index);
  }
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.handleHoverStopped_ = function(
    event) {

  //this.unhoverRoutes_();
};


/**
 * Check whether the travel mode is supported by GoogleMaps Directions API
 * or not.
 * @param {string} travelMode
 * @return {boolean}
 * @private
 */
ol.control.GoogleMapsDirections.prototype.isTravelModeSupportedByGoogleMaps_ =
    function(travelMode) {

  var tm = ol.control.GoogleMapsDirections.TravelMode;

  // todo - ENABLE_TRANSIT - add TRANSIT here when available

  return travelMode === tm.BICYCLING || travelMode === tm.DRIVING ||
      travelMode === tm.WALKING;
};


/**
 * Read the given source object then load its element as query parameters
 * and results (routes)
 * @param {Object} source
 * @param {boolean} includeRoutes Whether to load the included routes (results)
 *     or not.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.loadAll_ = function(
    source, includeRoutes) {

  this.loading_ = true;
  this.disableGeocoderReverseGeocodings_();
  this.clear_();

  // read
  var format = this.format_;
  var object = format.read(source);

  // begin with detours, as they are drawn at the same time the route is
  // generated
  this.detourFeatures_.clear();
  if (goog.isDefAndNotNull(object.detours)) {
    goog.array.forEach(object.detours, function(detour) {
      this.createOrUpdateDetour_(detour, false);
    }, this);
  }

  // travel modes
  this.toggleTravelModes_(object.travel_modes);

  // routes
  if (includeRoutes === true) {
    this.handleDirectionsResult_(object, google.maps.DirectionsStatus.OK);
  }

  this.removeAllGeocoders_();
  var geocoder;

  // start
  if (goog.isDefAndNotNull(object.start)) {
    geocoder = this.addGeocoder_();
    geocoder.load([object.start]);
  }

  // waypoints
  if (goog.isDefAndNotNull(object.waypoints)) {
    goog.array.forEach(object.waypoints, function(waypoint) {
      geocoder = this.addGeocoder_();
      geocoder.load([waypoint]);
    }, this);
  }

  // end
  if (goog.isDefAndNotNull(object.end)) {
    geocoder = this.addGeocoder_();
    geocoder.load([object.end]);
  }

  this.loading_ = false;
  this.manageNumWaypoints_();

  if (includeRoutes === true) {
    goog.events.dispatchEvent(this,
        ol.control.GoogleMapsDirections.EventType.ROUTECOMPLETE);
  }
};


/**
 * This method takes care of setting properties related to the number
 * of geocoders currently
 * @private
 */
ol.control.GoogleMapsDirections.prototype.manageNumGeocoders_ = function() {
  var geocoders = this.geocoders_;
  var numGeocoders = geocoders.getLength();

  if (numGeocoders > 2) {
    geocoders.forEach(function(geocoder) {
      geocoder.showRemoveButton();
      // FIXME - hide 'reverse' button
    }, this);
  } else {
    geocoders.forEach(function(geocoder) {
      geocoder.hideRemoveButton();
      // FIXME - show 'reverse' button
    }, this);
  }
};


/**
 * @private
 */
ol.control.GoogleMapsDirections.prototype.manageNumWaypoints_ = function() {
  var map = this.getMap();
  var dryModify = this.dryModify_;

  if (goog.isNull(dryModify)) {
    return;
  }

  if (this.canAddAnOtherWaypoint_()) {
    goog.events.listen(
        this.dryModify_,
        ol.interaction.DryModify.EventType.DRAG,
        this.handleDryModifyDrag_, false, this);
    goog.events.listen(
        this.dryModify_,
        ol.interaction.DryModify.EventType.DRAGEND,
        this.handleDryModifyDragEnd_, false, this);

    if (!goog.isDefAndNotNull(dryModify.getMap())) {
      map.addInteraction(dryModify);
    }
  } else {
    goog.events.unlisten(
        this.dryModify_,
        ol.interaction.DryModify.EventType.DRAG,
        this.handleDryModifyDrag_, false, this);
    goog.events.unlisten(
        this.dryModify_,
        ol.interaction.DryModify.EventType.DRAGEND,
        this.handleDryModifyDragEnd_, false, this);
  }
};


/**
 * FIXME - check if we should really remove all geocoders...
 * @private
 */
ol.control.GoogleMapsDirections.prototype.removeAllGeocoders_ =
    function() {
  var geocoder;
  while (this.geocoders_.getLength() > 0) {
    geocoder = this.geocoders_.getAt(0);
    goog.asserts.assertInstanceof(geocoder, ol.control.GoogleMapsGeocoder);
    this.removeGeocoder_(geocoder);
  }
};


/**
 * @param {ol.Pixel} pixel Pixel.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.removeDetourFeature_ =
    function(pixel) {

  var feature = this.getDetourFeatureAtPixel_(pixel);
  var detourFeatures = this.detourFeatures_;

  if (goog.isDefAndNotNull(feature)) {
    detourFeatures.remove(feature);
    this.lastDetourFeatureOverPointer_ = null;
    this.clear_();
    this.toggleGeocoderReverseGeocodings_();
    goog.events.dispatchEvent(this,
        ol.control.GoogleMapsDirections.EventType.QUERYPARAMSCHANGE);
    this.route_();
  }

};


/**
 * @param {ol.control.GoogleMapsGeocoder} geocoder Waypoint geocoder to remove.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.removeGeocoder_ = function(geocoder) {

  var map = this.getMap();

  map.removeControl(geocoder);

  goog.events.unlisten(
      geocoder,
      ol.Object.getChangeEventType(
          ol.control.GoogleMapsGeocoder.Property.LOCATION
      ),
      this.handleLocationChanged_, false, this);

  goog.events.unlisten(
      geocoder,
      ol.control.GoogleMapsGeocoder.EventType.REMOVE,
      this.handleGeocoderRemove_, false, this);

  this.geocoders_.remove(geocoder);

  this.manageNumGeocoders_();

  this.setGeocoderIconStyles_();
};


/**
 * @private
 */
ol.control.GoogleMapsDirections.prototype.route_ = function() {

  var geocoders = this.collectGeocoders_();
  var startGeocoder = geocoders.start;
  var endGeocoder = geocoders.end;
  var waypointGeocoders = geocoders.waypoints;

  if (goog.isNull(startGeocoder) ||
      goog.isNull(endGeocoder)) {
    // todo: throw error
    return;
  }

  // fetch travel modes
  var travelModes = this.getCheckedTravelModes_(false);
  if (!travelModes.length) {
    // force 'driving' travel mode if none was selected
    travelModes.push(ol.control.GoogleMapsDirections.TravelMode.DRIVING);
  }

  if (this.mode_ === ol.control.GoogleMapsDirections.Mode.MULTIPLE) {
    if (travelModes.length === 1 &&
        this.isTravelModeSupportedByGoogleMaps_(travelModes[0])) {
      this.routeWithGoogleMapsService_(
          startGeocoder, endGeocoder, travelModes[0], waypointGeocoders);
    } else {
      if (this.canUseMultimodalService_()) {
        this.routeWithMultimodalService_(
            startGeocoder, endGeocoder, travelModes, waypointGeocoders);
      } else {
        // todo - throw an error
        window.console.log(
            'Error: No multimodal service set.  Mode: ' +
            this.mode_
        );
      }
    }
  } else {
    var travelMode = this.getHighestPriorityTravelMode_(travelModes);
    this.routeWithGoogleMapsService_(
        startGeocoder, endGeocoder, travelMode, waypointGeocoders);
  }
};


/**
 * @param {ol.control.GoogleMapsGeocoder} startGeocoder Start geocoder
 * @param {ol.control.GoogleMapsGeocoder} endGeocoder End geocoder
 * @param {Array.<string>} travelModes Travel modes
 * @param {Array.<ol.control.GoogleMapsGeocoder>} waypointGeocoders Waypoint
 *     waypointGeocoders
 * @private
 */
ol.control.GoogleMapsDirections.prototype.routeWithMultimodalService_ =
    function(startGeocoder, endGeocoder, travelModes, waypointGeocoders) {

  var request = new goog.net.XhrIo();
  var url = this.multimodalUrl_;
  var headers = this.multimodalHeaders_;
  var method = (this.multimodalUsePostMethod_ === true) ? 'POST' : 'GET';

  // get start and end coordinates
  var startCoordinate = startGeocoder.getCoordinate();
  var endCoordinate = endGeocoder.getCoordinate();

  // fetch waypoints
  var waypointCoordinate;
  var reqWaypoints = [];
  waypointGeocoders.forEach(function(geocoder) {
    waypointCoordinate = geocoder.getCoordinate();
    if (goog.isDefAndNotNull(waypointCoordinate)) {
      reqWaypoints.push(waypointCoordinate);
    }
  }, this);

  var data = goog.Uri.QueryData.createFromMap(
      new goog.structs.Map({
        start_coordinate: goog.json.serialize(startCoordinate),
        end_coordinate: goog.json.serialize(endCoordinate),
        waypoints: goog.json.serialize(reqWaypoints),
        travelModes: goog.json.serialize(travelModes)
      }));

  // listen once to 'complete' event
  goog.events.listenOnce(request, goog.net.EventType.COMPLETE, function(event) {
    var request = event.currentTarget;
    if (request.isSuccess()) {
      var response = request.getResponseJson();
      this.handleDirectionsResult_(response, google.maps.DirectionsStatus.OK);
    } else {
      // todo - manage error
    }
  }, undefined, this);

  request.send(url, method, data.toString(), headers);
};


/**
 * Use the GoogleMaps Directions service to launch a route request. Only
 * support unimodal requests.
 * @param {ol.control.GoogleMapsGeocoder} startGeocoder Start geocoder
 * @param {ol.control.GoogleMapsGeocoder} endGeocoder End geocoder
 * @param {string} travelMode Inner travel mode, i.e. not a GoogleMaps one
 * @param {Array.<ol.control.GoogleMapsGeocoder>} waypointGeocoders Waypoint
 *     waypointGeocoders
 * @private
 */
ol.control.GoogleMapsDirections.prototype.routeWithGoogleMapsService_ =
    function(startGeocoder, endGeocoder, travelMode, waypointGeocoders) {

  var me = this;
  var service = this.directionsService_;
  var googleMapsTravelMode = this.getGoogleMapsTravelMode_(travelMode);

  // get start and end locations
  var startLocation = startGeocoder.getLocation();
  var endLocation = endGeocoder.getLocation();

  var map = this.getMap();

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var projection = view2D.getProjection();

  var reqWaypoints = [];
  var detourFeatures = this.detourFeatures_;
  var detourLocation;
  var waypointLocation;

  waypointGeocoders.forEach(function(geocoder) {
    waypointLocation = geocoder.getLocation();
    if (goog.isDefAndNotNull(waypointLocation)) {
      reqWaypoints.push({
        location: waypointLocation,
        stopover: true
      });
    }
  }, this);

  detourFeatures.forEach(function(feature) {
    detourLocation = ol.proj.transform(
        feature.getGeometry().getCoordinates(),
        projection.getCode(), 'EPSG:4326');
    reqWaypoints.push({
      location: new google.maps.LatLng(detourLocation[1], detourLocation[0]),
      stopover: false
    });
  }, this);

  var request = {
    origin: startLocation,
    destination: endLocation,
    waypoints: reqWaypoints,
    optimizeWaypoints: false,
    travelMode: googleMapsTravelMode,
    provideRouteAlternatives: true
  };

  service.route(request, function(response, status) {
    me.handleDirectionsResult_(response, status);
  });
};


/**
 * Collect the elements to save, write them as MTJSON then save.
 * @param {boolean} includeRoutes Whether to include the results (routes) or not
 * @return {string} serialized json ready for save
 * @private
 */
ol.control.GoogleMapsDirections.prototype.saveAll_ = function(includeRoutes) {
  var format = this.format_;

  var source = {};

  // travel modes
  source.travel_modes = this.getCheckedTravelModes_(true);

  var geocoders = this.collectGeocoders_();
  var startGeocoder = geocoders.start;
  var endGeocoder = geocoders.end;
  var waypointGeocoders = geocoders.waypoints;

  // routes, if included
  if (includeRoutes === true) {
    var selectedRoute = this.directionsPanel_.getSelectedRoute();
    if (selectedRoute === false) {
      // todo - throw/manage error
      return '';
    }

    if (!goog.isDefAndNotNull(selectedRoute.geometry)) {
      selectedRoute.geometry =
          this.selectedRouteFeatures_.getAt(0).getGeometry();
    }

    source.routes = [selectedRoute];
  } else {
    source.routes = [];
  }

  // start
  var startCoordinate = startGeocoder.getCoordinate();
  var startAddress = startGeocoder.getInputValue();
  if (goog.isNull(startCoordinate) || goog.isNull(startAddress)) {
    // todo - throw/manage error
    return '';
  }
  source.start_location = {
    'formatted_address': startAddress,
    'geometry': {'coordinate': startCoordinate}
  };


  // end
  var endCoordinate = endGeocoder.getCoordinate();
  var endAddress = endGeocoder.getInputValue();
  if (goog.isNull(endCoordinate) || goog.isNull(endAddress)) {
    // todo - throw/manage error
    return '';
  }
  source.end_location = {
    'formatted_address': endAddress,
    'geometry': {'coordinate': endCoordinate}
  };


  // waypoints
  source.waypoints = [];
  var waypointCoordinate;
  var waypointAddress;
  waypointGeocoders.forEach(function(geocoder) {
    waypointCoordinate = geocoder.getCoordinate();
    waypointAddress = geocoder.getInputValue();
    if (!goog.isNull(waypointCoordinate) && !goog.isNull(waypointAddress)) {
      source.waypoints.push({
        'formatted_address': waypointAddress,
        'geometry': {'coordinate': waypointCoordinate}
      });
    }
  }, this);

  // detours
  source.detours = [];
  this.detourFeatures_.forEach(function(detourFeature) {
    source.detours.push(detourFeature.getGeometry().getCoordinates());
  }, this);

  var result = format.write(source, true);
  goog.asserts.assertString(result);

  return result;
};


/**
 * Select the route at the specified location in the collection.  Here,
 * the selection is merely a matter of getting the route feature at the specific
 * index and draw the routes.
 * @param {number} index
 * @private
 */
ol.control.GoogleMapsDirections.prototype.selectRoute_ = function(index) {
  var routeFeatures = this.routeFeatures_;
  var selectedRouteFeatures = this.selectedRouteFeatures_;
  var routeFeature = routeFeatures.getAt(index);

  if (goog.isNull(routeFeature)) {
    // todo - manage error
    return;
  }

  // add the new route
  selectedRouteFeatures.push(routeFeature);

  // draw
  this.drawRoute_();

  // fit extent
  this.fitViewExtentToRoute_();

  // dispatch event
  goog.events.dispatchEvent(this,
      ol.control.GoogleMapsDirections.EventType.SELECT);
};


/**
 * FIXME - should also set the DOM icons, next to the input text
 * Loops in all current geocoders and set the appropriate icon style
 * @private
 */
ol.control.GoogleMapsDirections.prototype.setGeocoderIconStyles_ =
    function() {

  var geocoders = this.geocoders_;
  var iconStyles = this.iconStyles_;

  var geocoder;
  var index;
  var iconStyle;

  geocoders.forEach(function(geocoder, index) {
    iconStyle = iconStyles[index];
    if (goog.isDefAndNotNull(iconStyle)) {
      geocoder.setIconStyle(iconStyle);
    } else {
      // todo - throw error "Too few icon styles set"
    }
  }, this);
};


/**
 * Clear the unselected route from the map.
 * @param {number} index
 * @private
 */
ol.control.GoogleMapsDirections.prototype.unselectRoute_ = function(index) {
  var selectedRouteFeatures = this.selectedRouteFeatures_;

  // clear previously selected route
  selectedRouteFeatures.clear();

  // clear vector layer
  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);
  vectorSource.clear();
};


/**
 * @param {ol.Pixel} pixel Pixel.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.toggleDetourFeatureRemoveSymbol_ =
    function(pixel) {

  var labelProperty = this.detourLabelProperty_;
  var feature = this.getDetourFeatureAtPixel_(pixel);
  var lastFeature = this.lastDetourFeatureOverPointer_;

  // clear last label, if required
  if (goog.isDefAndNotNull(lastFeature) &&
      (!goog.isDefAndNotNull(feature) || feature != lastFeature)) {
    lastFeature.set(labelProperty, '');
    this.lastDetourFeatureOverPointer_ = null;

    // re-enable reverse geocoding
    this.toggleGeocoderReverseGeocodings_();
  }

  // set new label, if required
  if (goog.isDefAndNotNull(feature) && !goog.isDefAndNotNull(lastFeature)) {
    feature.set(labelProperty, 'X');
    this.lastDetourFeatureOverPointer_ = feature;

    // mouse is over a detour feature, temporarly disable reverse geocoding
    this.disableGeocoderReverseGeocodings_();
  }
};


/**
 * Enable the reverse geocoding of the first geocoder that returns a null
 * location.  Disable all the others.
 * @private
 */
ol.control.GoogleMapsDirections.prototype.toggleGeocoderReverseGeocodings_ =
    function() {

  var geocoders = this.geocoders_;
  var location;
  var nullLocationFound = false;

  geocoders.forEach(function(geocoder) {
    location = geocoder.getLocation();
    if (!goog.isDefAndNotNull(location) && !nullLocationFound) {
      nullLocationFound = true;
      geocoder.enableReverseGeocoding();
    } else {
      geocoder.disableReverseGeocoding();
    }
  }, this);

};


/**
 * Toggle travel mode input checkbox element AND link element.
 * @param {Node} inputEl Input
 * @param {Node} linkEl Link
 * @param {boolean} check
 * @private
 */
ol.control.GoogleMapsDirections.prototype.toggleTravelMode_ =
    function(inputEl, linkEl, check) {

  var classPrefix = this.classPrefix_;

  if (check) {
    inputEl.checked = true;
    goog.dom.classes.add(linkEl, classPrefix + '-checkbox-link-checked');
  } else {
    inputEl.checked = false;
    goog.dom.classes.remove(linkEl, classPrefix + '-checkbox-link-checked');
  }

};


/**
 * Browse each travel mode input element.  Check or uncheck accordingly.
 * @param {Array.<string>} travelModesToCheck Travel modes to check
 * @private
 */
ol.control.GoogleMapsDirections.prototype.toggleTravelModes_ =
    function(travelModesToCheck) {

  var travelMode;
  var inputEl;

  this.travelModeCheckboxLinkElements_.forEach(function(linkEl) {
    travelMode = linkEl.getAttribute('data-travel-mode');
    inputEl = this.getInputElByTravelMode_(travelMode);

    if (goog.array.indexOf(travelModesToCheck, inputEl.name) != -1) {
      this.toggleTravelMode_(inputEl, linkEl, true);
    } else {
      this.toggleTravelMode_(inputEl, linkEl, false);
    }
  }, this);

};
