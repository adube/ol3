goog.provide('ol.control.GoogleMapsAddresses');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventType');
/*goog.require('goog.events.KeyCodes');*/
goog.require('goog.json');
goog.require('goog.net.XhrIo');
/*
goog.require('goog.string');
goog.require('goog.style');
*/
goog.require('ol.Feature');
goog.require('ol.Object');
/*
goog.require('ol.MapBrowserEvent.EventType');
*/
goog.require('ol.View2D');
goog.require('ol.control.Control');
goog.require('ol.control.GoogleMapsGeocoder');
goog.require('ol.css');
goog.require('ol.geom.Point');
goog.require('ol.layer.Vector');
goog.require('ol.proj');
goog.require('ol.source.Vector');
goog.require('ol.style.Style');



/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.GoogleMapsAddressesOptions=} opt_options Options.
 */
ol.control.GoogleMapsAddresses = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  /**
   * i18n - searchButton
   * @type {string}
   */
  this.searchButtonText = goog.isDefAndNotNull(options.searchButtonText) ?
      options.searchButtonText : null;

  /**
   * i18n - clearButton
   * @type {string}
   */
  this.clearButtonText = goog.isDefAndNotNull(options.clearButtonText) ?
      options.clearButtonText : null;

  /**
   * i18n - removeButton
   * @type {string}
   */
  this.removeButtonText = goog.isDefAndNotNull(options.removeButtonText) ?
      options.removeButtonText : 'x';

  /**
   * i18n - addButtonText
   * @type {string}
   */
  this.addButtonText = goog.isDefAndNotNull(options.addButtonText) ?
      options.addButtonText : 'Add address';

  /**
   * Function to call when save is a success
   * @type {Function}
   */
  this.successCallback = goog.isDefAndNotNull(options.successCallback) ?
      options.successCallback : null;

  /**
   * Function to call when save has failed
   * @type {Function}
   */
  this.failCallback = goog.isDefAndNotNull(options.failCallback) ?
      options.failCallback : null;

  var className = 'ol-google-maps-addresses';

  var classPrefix = 'ol-gmads';

  var input = goog.dom.createDom(goog.dom.TagName.INPUT, {
    'class': classPrefix + '-input-text',
    'type': 'text'
  });

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': className + ' ' + ol.css.CLASS_UNSELECTABLE
  });

  var geocoderElement = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + '-geocoder'
  });

  // === UI COMPONENTS ===
  var addButton = goog.dom.createDom(goog.dom.TagName.BUTTON, {
    'class': classPrefix + '-add-button'
  });
  var addButtonText = goog.dom.createTextNode(this.addButtonText);
  goog.dom.appendChild(addButton, addButtonText);

  goog.dom.appendChild(element, input);
  goog.dom.appendChild(element, geocoderElement);
  goog.dom.appendChild(element, addButton);

  goog.events.listen(addButton, [
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.CLICK
  ], this.handleAddButtonPress_, false, this);

  var addressesElement = goog.isDefAndNotNull(options.addressesTarget) ?
      goog.dom.getElement(options.addressesTarget) : null;

  var listElement = goog.dom.createDom(goog.dom.TagName.UL, {
    'class': classPrefix + '-addresses'
  });
  goog.dom.appendChild(addressesElement, listElement);


  /**
   * @type {string}
   */
  this.classPrefix = classPrefix;

  /**
   * @private
   * @type {Element}
   */
  this.addressesList_ = listElement;

  /**
   * @private
   * @type {Array} array of Element
   */
  this.addressElements_ = [];

  /**
   * @private
   * @type {Array} array of Element
   */
  this.removeAddressElements_ = [];

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

  /**
   * @private
   * @type {string}
   */
  this.saveURL_ = goog.isDefAndNotNull(options.saveURL) ?
      options.saveURL : null;

  /**
   * @private
   * @type {Object}
   */
  this.saveHeaders_ = goog.isDefAndNotNull(options.saveHeaders) ?
      options.saveHeaders : {'content-type': 'application/json'};

  /**
   * @private
   * @type {Element}
   */
  this.input_ = input;

  /**
   * @private
   * @type {google.maps.LatLng}
   */
  this.location_ = null;

  /**
   * @type {Object}
   */
  this.addresses = goog.isDefAndNotNull(options.addresses) ?
      options.addresses : [];

  /**
   * @type {Object}
   */
  this.currentAddress = null;

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
   * @type {ol.control.GoogleMapsGeocoder}
   * @private
   */
  this.geocoder_ = new ol.control.GoogleMapsGeocoder({
    'enableReverseGeocoding': true,
    'target': geocoderElement,
    'enableCurrentPosition': this.enableCurrentPosition_,
    'currentPositionControl': this.currentPositionControl_,
    'searchButtonText': this.searchButtonText,
    'clearButtonText': this.clearButtonText,
    'removeButtonText': this.removeButtonText,
    'geocoderComponentRestrictions': this.geocoderComponentRestrictions_,
    'iconStyle': this.iconStyle_
  });

  goog.events.listen(
      this.geocoder_,
      ol.Object.getChangeEventType(
          ol.control.GoogleMapsGeocoder.Property.LOCATION
      ),
      this.handleLocationChanged_, false, this);

  /**
   * @type {?ol.layer.Vector}
   * @private
   */
  this.vectorLayer_ = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: []
    })
  });

  goog.base(this, {
    element: element,
    target: options.target
  });

  /**
   * @this {ol.control.GoogleMapsAddresses}
   * @private
   */
  this.getAddresses_ = function() {
    var me = this;
    var url = this.getURL_;
    var request = new goog.net.XhrIo();
    var response;

    goog.events.listen(request, 'complete', function() {
      if (request.isSuccess()) {
        response = request.getResponseJson();
        goog.asserts.assert(goog.isDef(response));
        me.handleGetAddressesSuccess_(response);
        if (me.successCallback !== null)
          me.successCallback(me, response);
      } else {
        if (me.failCallback !== null)
          me.failCallback(me, response);
        // TODO: handle errors
        // TODO: remove these lines since they are used only for testing
        /*response = {
          'status': 1,
          'addresses': [{
            'id': 2,
            'text': 'Test',
            'description': 'Adresses de test',
            'lat': 46,
            'lon': -72
          }]
        };
        me.handleGetAddressesSuccess_(response);
        */
      }
    });

    request.send(url, 'GET');
  };


  /**
   * @this {ol.control.GoogleMapsAddresses}
   * @param {Object} response response received the request
   * @private
   */
  this.handleGetAddressesSuccess_ = function(response) {
    var me = this;

    if (response.status == 1) {
      goog.array.forEach(response.addresses, function(address) {
        me.addAddress(address);
      });
    } else {
      // TODO: handle get addresses fail
      //this.handleGetAddressesFail_(response);
    }
  };

  if (goog.isDefAndNotNull(this.getURL_)) {
    this.getAddresses_();
  }

};
goog.inherits(ol.control.GoogleMapsAddresses, ol.control.Control);


/**
 * @inheritDoc
 */
ol.control.GoogleMapsAddresses.prototype.setMap = function(map) {

  var myMap = this.getMap();
  if (goog.isNull(map) && !goog.isNull(myMap)) {
    myMap.removeLayer(this.vectorLayer_);
    myMap.removeControl(this.geocoder_);
  }

  goog.base(this, 'setMap', map);

  if (!goog.isNull(map)) {
    map.addLayer(this.vectorLayer_);
    map.addControl(this.geocoder_);
  }
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.handleAddButtonPress_ = function(
    browserEvent) {

  browserEvent.preventDefault();

  var input = this.input_;
  var geocoder = this.geocoder_;

  var addressText = geocoder.getInputValue();
  var description = input.value;
  var location = this.location_;

  if (goog.isDefAndNotNull(addressText) && goog.isDefAndNotNull(description) &&
      goog.isDefAndNotNull(location)) {

    var address = this.generateAddress_(
        null, addressText, description, location);
    this.saveAddress_(address, 'insert');
  }
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.handleLocationChanged_ =
    function(event) {

  var geocoder = this.geocoder_;
  var location = geocoder.getLocation();
  this.location_ = goog.isDefAndNotNull(location) ? location : null;
};


/**
 * @param {?number} id address id if any
 * @param {string} text
 * @param {string} description
 * @param {google.maps.LatLng} location
 * @return {Object} address
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.generateAddress_ =
    function(id, text, description, location) {

  var lat = location.lat();
  var lon = location.lng();

  var address = {
    'id': id,
    'description': description,
    'text': text,
    'lat': lat,
    'lon': lon
  };

  return address;
};


/**
 * @param {Object} address
 * @param {string} action any of the following values:
 *  insert, update, delete
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.saveAddress_ =
    function(address, action) {

  var me = this;
  var url = this.saveURL_;
  var request = new goog.net.XhrIo();
  var response;

  var data = {
    'address': address,
    'action': action
  };

  goog.events.listen(request, 'complete', function() {
    if (request.isSuccess()) {
      response = request.getResponseJson();
      goog.asserts.assert(goog.isDefAndNotNull(response));
      me.handleSaveAddressSuccess_(response, data);
    } else {
      // TODO: handle errors
      // TODO: remove these lines since they are used only for testing
      /*response = {
        'status': 1,
        'id': 1
      };
      me.handleSaveAddressSuccess_(response, data);
      */
    }
  });

  var headers = this.saveHeaders_;

  request.send(url, 'POST', goog.json.serialize(data),
      headers);
};


/**
 * @param {Object} response response received the request
 * @param {Object} data data sent during the request
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.handleSaveAddressSuccess_ =
    function(response, data) {

  if (response.status == 1) {
    var address = data.address;
    var action = data.action;

    if (response.id) {
      address.id = response.id;
    }

    if (action == 'insert') {
      this.addAddress(address);
    } else if (action == 'update') {
      //this.updateAddress(address);
    } else {
      this.removeAddress(address);
    }
  } else {
    // TODO: handle save address fail
    //this.handleSaveAddressFail_(response, data);
  }
};


/**
 * @param {Object} address address
 */
ol.control.GoogleMapsAddresses.prototype.addAddress = function(address) {
  this.addresses.push(address);
  this.addAddressToList(address);
};


/**
 * @param {Object} address address
 */
ol.control.GoogleMapsAddresses.prototype.removeAddress = function(address) {
  var index = this.getAddressIndexByID_(address.id);

  if (goog.isDefAndNotNull(index)) {
    var removeAddressElement = this.removeAddressElements_[index];
    goog.events.unlisten(removeAddressElement, [
      goog.events.EventType.TOUCHEND,
      goog.events.EventType.CLICK
    ], this.handleRemoveAddressElementPress_, false, this);

    var listElement = this.addressElements_[index];
    goog.events.unlisten(listElement, [
      goog.events.EventType.TOUCHEND,
      goog.events.EventType.CLICK
    ], this.handleAddressElementPress_, false, this);

    goog.dom.removeNode(removeAddressElement);
    goog.dom.removeNode(listElement);

    this.removeAddressElements_.splice(index, 1);
    this.addressElements_.splice(index, 1);
    this.addresses.splice(index, 1);
  }

  if (goog.isDefAndNotNull(this.currentAddress) &&
      this.currentAddress.id == address.id) {

    this.clear_();
    this.currentAddress = null;
  }
};


/**
 * @param {Object} address
 */
ol.control.GoogleMapsAddresses.prototype.addAddressToList = function(
    address) {

  var me = this;

  var addressElement = goog.dom.createDom(goog.dom.TagName.LI, {
    'class': this.classPrefix + '-address',
    'data-result': address.id
  });

  var removeAddressAnchor = goog.dom.createDom(goog.dom.TagName.A, {
    'class': this.classPrefix + '-remove-address',
    'data-result': address.id
  }, this.removeButtonText);
  goog.dom.appendChild(addressElement, removeAddressAnchor);

  var addressDescription = goog.dom.createDom(goog.dom.TagName.SPAN, {
    'class': this.classPrefix + '-description'
  }, address.description);
  goog.dom.appendChild(addressElement, addressDescription);

  var br = goog.dom.createDom(goog.dom.TagName.BR);
  goog.dom.appendChild(addressElement, br);

  var addressText = goog.dom.createDom(goog.dom.TagName.SPAN, {
    'class': this.classPrefix + '-text'
  }, address.text);
  goog.dom.appendChild(addressElement, addressText);

  goog.dom.appendChild(this.addressesList_, addressElement);

  this.addressElements_.push(addressElement);
  this.removeAddressElements_.push(removeAddressAnchor);

  goog.events.listen(addressElement, [
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.CLICK
  ], me.handleAddressElementPress_, false, me);

  goog.events.listen(removeAddressAnchor, [
    goog.events.EventType.TOUCHEND,
    goog.events.EventType.CLICK
  ], me.handleRemoveAddressElementPress_, false, me);
};


/**
 * @private
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 */
ol.control.GoogleMapsAddresses.prototype.handleAddressElementPress_ = function(
    browserEvent) {

  this.clear_();

  var element = browserEvent.currentTarget;
  var id = element.getAttribute('data-result');
  var address = this.getAddressByID_(id);
  this.currentAddress = address;

  this.displayAddress_(address);
};


/**
 * @private
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 */
ol.control.GoogleMapsAddresses.prototype.handleRemoveAddressElementPress_ =
    function(browserEvent) {

  var element = browserEvent.currentTarget;
  var id = element.getAttribute('data-result');
  var address = this.getAddressByID_(id);

  this.saveAddress_(address, 'delete');
};


/**
 * @private
 * @param {number} id
 * @return {Object} address
 */
ol.control.GoogleMapsAddresses.prototype.getAddressByID_ = function(id) {
  var address = null;
  var nAddresses = this.addresses.length;

  for (var i = 0; i < nAddresses; i++) {
    if (this.addresses[i].id == id) {
      address = this.addresses[i];
      break;
    }
  }

  return address;
};


/**
 * @private
 * @param {number} id
 * @return {?number} index
 */
ol.control.GoogleMapsAddresses.prototype.getAddressIndexByID_ = function(id) {
  var index = null;
  var nAddresses = this.addresses.length;

  for (var i = 0; i < nAddresses; i++) {
    if (this.addresses[i].id == id) {
      index = i;
      break;
    }
  }

  return index;
};


/**
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.clear_ = function() {
  var vectorSource = this.vectorLayer_.getSource();
  goog.asserts.assertInstanceof(vectorSource, ol.source.Vector);
  vectorSource.clear();
};


/**
 * @private
 * @param {Object} address
 */
ol.control.GoogleMapsAddresses.prototype.displayAddress_ = function(
    address) {

  var lat = address.lat;
  var lon = address.lon;
  var location = new google.maps.LatLng(lat, lon);
  this.displayLocation_(location);
};


/**
 * @param {google.maps.LatLng} location
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.displayLocation_ = function(location) {
  var lat, lng;
  var map = this.getMap();

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));
  var view2D = view.getView2D();
  goog.asserts.assertInstanceof(view2D, ol.View2D);

  var projection = view2D.getProjection();

  lng = location.lng();
  lat = location.lat();

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
};
