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
goog.require('ol.View');
goog.require('ol.control.Control');
goog.require('ol.control.GoogleMapsGeocoder');
goog.require('ol.css');
goog.require('ol.extent');
goog.require('ol.geom.Point');
goog.require('ol.layer.Vector');
goog.require('ol.proj');
goog.require('ol.source.Vector');
goog.require('ol.style.Style');



/**
 * @classdesc
 * Todo
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.GoogleMapsAddressesOptions=} opt_options Options.
 * @api
 */
ol.control.GoogleMapsAddresses = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  /**
   * i18n - searchButton
   * @type {string|undefined}
   */
  this.searchButtonText = goog.isDefAndNotNull(options.searchButtonText) ?
      options.searchButtonText : undefined;

  /**
   * i18n - searchButton
   * @type {boolean}
   */
  this.haveAHomeAddress = false;

  /**
   * i18n - clearButton
   * @type {string|undefined}
   */
  this.clearButtonText = goog.isDefAndNotNull(options.clearButtonText) ?
      options.clearButtonText : undefined;

  /**
   * i18n - home address
   * If null or not specified, home address is not required
   * @type {?string}
   */
  this.homeAddressButtonText =
      goog.isDefAndNotNull(options.homeAddressButtonText) ?
      options.homeAddressButtonText : null;
  /**
   * @private
   * @type {Element|undefined}
   */
  this.homeCheck_ = undefined;

  /**
   * i18n - noResultFound
   * @type {string|undefined}
   */
  this.noResultFoundText = goog.isDef(options.noResultFoundText) ?
      options.noResultFoundText : undefined;

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
   * i18n - editButtonText
   * @type {string}
   */
  this.editButtonText = goog.isDefAndNotNull(options.editButtonText) ?
      options.editButtonText : 'Edit address';

  /**
   * i18n - cancelEditButtonText
   * @type {string}
   */
  this.cancelEditButtonText = goog.isDefAndNotNull(
      options.cancelEditButtonText) ?
      options.cancelEditButtonText : 'Cancel edit';

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


  var editButton = goog.dom.createDom(goog.dom.TagName.BUTTON, {
    'class': classPrefix + '-edit-button',
    'style': 'display:none'
  });
  var editButtonText = goog.dom.createTextNode(this.editButtonText);
  goog.dom.appendChild(editButton, editButtonText);

  var cancelButton = goog.dom.createDom(goog.dom.TagName.BUTTON, {
    'class': classPrefix + '-cancel-edit-button',
    'style': 'display:none'
  });
  var cancelEditButtonText = goog.dom.createTextNode(this.cancelEditButtonText);
  goog.dom.appendChild(cancelButton, cancelEditButtonText);


  goog.dom.appendChild(element, input);

  if (this.homeAddressButtonText) {
    goog.dom.appendChild(element, goog.dom.createDom(goog.dom.TagName.LABEL, {
      'class' : classPrefix + '-imput-home-checkbox',
      'for' : classPrefix + '-input-home-checkbox'
    }, this.homeAddressButtonText));

    this.homeCheck_ = goog.dom.createDom(goog.dom.TagName.INPUT, {
      'class': classPrefix + '-input-home-checkbox',
      'id': classPrefix + '-input-home-checkbox',
      'type': 'checkbox',
      'disabled': true,
      'checked': true
    });
    goog.dom.appendChild(element, this.homeCheck_);
  }


  goog.dom.appendChild(element, geocoderElement);
  goog.dom.appendChild(element, addButton);
  goog.dom.appendChild(element, editButton);
  goog.dom.appendChild(element, cancelButton);

  goog.events.listen(addButton, [
    goog.events.EventType.CLICK
  ], this.handleAddButtonPress_, false, this);

  goog.events.listen(editButton, [
    goog.events.EventType.CLICK
  ], this.handleEditButtonPress_, false, this);

  goog.events.listen(cancelButton, [
    goog.events.EventType.CLICK
  ], this.handleCancelEditButtonPress_, false, this);

  var addressesElement = goog.isDefAndNotNull(options.addressesTarget) ?
      goog.dom.getElement(options.addressesTarget) : null;

  var listElement = null;
  if (goog.isDefAndNotNull(addressesElement)) {
    listElement = goog.dom.createDom(goog.dom.TagName.UL, {
      'class': classPrefix + '-addresses'
    });
    goog.dom.appendChild(addressesElement, listElement);
  }

  /**
   * @type {string}
   */
  this.classPrefix = classPrefix;

  /**
   * @private
   * @type {?Element}
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
  this.enableCurrentPosition_ = false;
  if (goog.isDefAndNotNull(options.enableCurrentPosition) &&
      goog.isBoolean(options.enableCurrentPosition) &&
      navigator.geolocation) {

    this.enableCurrentPosition_ = true;
  }

  /**
   * @private
   * @type {?string|undefined}
   */
  this.getURL_ = goog.isDefAndNotNull(options.getURL) ?
      options.getURL : null;

  /**
   * @private
   * @type {?string|undefined}
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
   * @type {Array.<mtx.format.Address>}
   */
  this.addresses = goog.isDefAndNotNull(options.addresses) ?
      options.addresses : [];

  /**
   * @type {Object}
   */
  this.currentAddress = null;

  /**
   * @type {boolean}
   * @private
   */
  this.isEditing_ = false;


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
    'noResultFoundText': this.noResultFoundText,
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

  goog.events.listen(
      this.geocoder_,
      ol.control.GoogleMapsGeocoder.EventType.ERROR,
      this.handleGeocoderError_, false, this);

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
   * The error message currently on
   * @type {?string}
   * @private
   */
  this.error_ = null;

  goog.base(this, {
    element: element,
    target: options.target
  });

  /**
   * @this {ol.control.GoogleMapsAddresses}
   * @private
   */
  this.getAddresses_ = function() {
    var url = this.getURL_;

    if (goog.isDefAndNotNull(url)) {
      var me = this;
      var request = new goog.net.XhrIo();
      var response;
      goog.events.listen(request, 'complete', function() {
        if (request.isSuccess()) {
          response = request.getResponseJson();
          goog.asserts.assert(goog.isDef(response));
          me.handleGetAddressesSuccess_(response);
        } else {
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
    }
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

      goog.events.dispatchEvent(this,
          ol.control.GoogleMapsAddresses.EventType.LOADSUCCESS);
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
 * @enum {string}
 */
ol.control.GoogleMapsAddresses.EventType = {
  ADD: goog.events.getUniqueId('add'),
  ERROR: goog.events.getUniqueId('error'),
  LOADSUCCESS: goog.events.getUniqueId('loadsuccess'),
  REMOVE: goog.events.getUniqueId('remove')
};


/**
 * @return {Array.<Object>}
 */
ol.control.GoogleMapsAddresses.prototype.getAddresses = function() {
  return this.addresses;
};


/**
 * @return {?string}
 */
ol.control.GoogleMapsAddresses.prototype.getError = function() {
  return this.error_;
};


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
  var type = 0;
  if (this.homeAddressButtonText) {
    if (this.homeCheck_.checked) {
      type = 1;
    }
  }

  var addressText = geocoder.getInputValue();
  var description = input.value;
  var location = this.location_;

  if (goog.isDefAndNotNull(addressText) && goog.isDefAndNotNull(description) &&
      goog.isDefAndNotNull(location)) {

    var address = this.generateAddress_(
        null, addressText, description, type, location);
    this.saveAddress_(address, 'insert');
  }
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.handleEditButtonPress_ = function(
    browserEvent) {

  browserEvent.preventDefault();


  var input = this.input_;
  var geocoder = this.geocoder_;
  var type = 0;
  if (this.homeAddressButtonText) {
    if (this.homeCheck_.checked) {
      type = 1;
    }
  }

  var addressText = geocoder.getInputValue();
  var description = input.value;
  var location = this.location_;
  var id = this.currentAddress.id;

  if (goog.isDefAndNotNull(addressText) && goog.isDefAndNotNull(description) &&
      goog.isDefAndNotNull(location)) {

    var address = this.generateAddress_(
        id, addressText, description, type, location);
    this.saveAddress_(address, 'update');
  }
};


/**
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.handleCancelEditButtonPress_ =
    function(browserEvent) {

  browserEvent.preventDefault();
  this.stopEditingAddress_();
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.handleGeocoderError_ = function(
    event) {

  var geocoder = event.target;
  goog.asserts.assertInstanceof(geocoder, ol.control.GoogleMapsGeocoder);

  this.setError_(geocoder.getError());
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
  if (this.location_ !== null) {
    var view = this.getMap().getView();
    goog.asserts.assert(goog.isDef(view));

    var size = this.getMap().getSize();
    goog.asserts.assertArray(size);

    var mapExtent = view.calculateExtent(size);
    var locationExtent = ol.extent.boundingExtent([
      this.geocoder_.getCoordinate()]);
    if (!ol.extent.intersects(mapExtent, locationExtent))
      view.setCenter(this.geocoder_.getCoordinate());
  }
};


/**
 * @param {?number} id address id if any
 * @param {string} text
 * @param {string} description
 * @param {number} type
 * @param {google.maps.LatLng} location
 * @return {Object} address
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.generateAddress_ =
    function(id, text, description, type, location) {

  var lat = location.lat();
  var lon = location.lng();

  var address = {
    'id': id,
    'description': description,
    'text': text,
    'lat': lat,
    'type': type,
    'lon': lon
  };

  return address;
};


/**
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.emptyInputs_ = function() {
  this.input_.value = '';
  this.geocoder_.clear();
};


/**
 * @param {Object} address
 * @param {string} action any of the following values:
 *  insert, update, delete
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.saveAddress_ =
    function(address, action) {

  var url = this.saveURL_;

  if (goog.isDefAndNotNull(url)) {
    var me = this;
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
        if (me.successCallback !== null)
          me.successCallback(me, response);
      } else {
        if (me.failCallback !== null)
          me.failCallback(response, data);
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

    // for dev purpose only
    //request.send(url, 'GET', goog.json.serialize(data), this.saveHeaders_);

    request.send(url, 'POST', goog.json.serialize(data), this.saveHeaders_);
  }
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
      this.emptyInputs_();
    } else if (action == 'update') {
      this.updateAddress(address);
    } else {
      this.removeAddress(address);
    }
  } else {
    if (this.failCallback !== null)
      this.failCallback(response, data);
    // TODO: handle save address fail
    //this.handleSaveAddressFail_(response, data);
  }
};


/**
 * @param {Object} address address
 */
ol.control.GoogleMapsAddresses.prototype.addAddress = function(address) {
  if (this.homeAddressButtonText && address.type == 1) this.addHomeAddress_();

  this.addresses.push(address);

  if (goog.isDefAndNotNull(this.addressesList_)) {
    this.addAddressToList(address);
  }

  goog.events.dispatchEvent(this,
      ol.control.GoogleMapsAddresses.EventType.ADD);
};


/**
 * @param {Object} address address
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.editAddress_ = function(address) {
  this.isEditing_ = true;
  this.input_.value = address.description;
  $('.' + this.classPrefix + '-add-button').hide();
  $('.' + this.classPrefix + '-edit-button').show();
  $('.' + this.classPrefix + '-cancel-edit-button').show();
  $('.' + this.classPrefix + '-geocoder input').val(address.text);
  if (this.homeAddressButtonText) {
    if (address.type == 1) {
      this.homeCheck_.checked = true;
      this.homeCheck_.disabled = true;
    }else {
      this.homeCheck_.checked = false;
      this.homeCheck_.disabled = false;
    }
  }
};


/**
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.stopEditingAddress_ =
    function() {
  this.isEditing_ = false;
  $('.' + this.classPrefix + '-add-button').show();
  $('.' + this.classPrefix + '-edit-button').hide();
  $('.' + this.classPrefix + '-cancel-edit-button').hide();
  if (this.haveAHomeAddress) {
    this.homeCheck_.checked = false;
    this.homeCheck_.disabled = false;
  }
  this.emptyInputs_();
  this.clear_();
};


/**
 * @param {Object} address address
 */
ol.control.GoogleMapsAddresses.prototype.removeAddress = function(address) {
  if (this.homeAddressButtonText && address.type == 1) {
    return;
  }
  var index = this.getAddressIndexByID_(address.id);

  if (goog.isDefAndNotNull(index)) {
    var removeAddressElement = this.removeAddressElements_[index];
    goog.events.unlisten(removeAddressElement, [
      goog.events.EventType.CLICK
    ], this.handleRemoveAddressElementPress_, false, this);

    var listElement = this.addressElements_[index];
    goog.events.unlisten(listElement, [
      goog.events.EventType.CLICK
    ], this.handleAddressElementPress_, false, this);

    goog.dom.removeNode(removeAddressElement);
    goog.dom.removeNode(listElement);

    this.removeAddressElements_.splice(index, 1);
    this.addressElements_.splice(index, 1);
    this.addresses.splice(index, 1);

    goog.events.dispatchEvent(this,
        ol.control.GoogleMapsAddresses.EventType.REMOVE);
  }

  if (goog.isDefAndNotNull(this.currentAddress) &&
      this.currentAddress.id == address.id) {

    this.clear_();
    this.currentAddress = null;
  }
};


/**
 * @param {Object} address address
 */
ol.control.GoogleMapsAddresses.prototype.updateAddress = function(address) {

  var index = this.getAddressIndexByID_(address.id);

  if (goog.isDefAndNotNull(index)) {
    this.addresses[index].description = address.description;
    this.addresses[index].text = address.text;
    this.addresses[index].lon = address.lon;
    this.addresses[index].lat = address.lat;
    this.addresses[index].type = address.type;

    var listElement = this.addressElements_[index];
    $(listElement).find('.' + this.classPrefix + '-description')
       .html(address.description);
    $(listElement).find('.' + this.classPrefix + '-text')
       .html(address.text);

    if (goog.isDefAndNotNull(this.currentAddress) &&
        this.currentAddress.id == address.id) {
      if (this.homeAddressButtonText && address.type == 1) {
        this.addHomeAddress_(this.addresses[index]);
        $(listElement).find('.' + this.classPrefix + '-remove-address')
            .addClass(this.classPrefix + '-remove-address-disabled');
        var homeIcon = goog.dom.createDom(goog.dom.TagName.SPAN, {
          'class': this.classPrefix + '-homeicon'
        });
        $(listElement).find('.' + this.classPrefix + '-text').prepend(homeIcon);
      }

      this.clear_();
      this.currentAddress = null;
    }
  }
  this.stopEditingAddress_();
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
  var removeDisabled = false;

  if (this.homeAddressButtonText && address.type == 1) {
    removeDisabled = true;
  }
  var removeClass = this.classPrefix + '-remove-address ';
  if (removeDisabled)
    removeClass += this.classPrefix + '-remove-address-disabled';

  var removeAddressAnchor = goog.dom.createDom(goog.dom.TagName.A, {
    'class': removeClass,
    'data-result': address.id
  }, this.removeButtonText);
  goog.dom.appendChild(addressElement, removeAddressAnchor);

  var addressDescription = goog.dom.createDom(goog.dom.TagName.SPAN, {
    'class': this.classPrefix + '-description'
  }, address.description);
  goog.dom.appendChild(addressElement, addressDescription);

  var br = goog.dom.createDom(goog.dom.TagName.BR);
  goog.dom.appendChild(addressElement, br);

  if (this.homeAddressButtonText && address.type == 1) {
    var homeIcon = goog.dom.createDom(goog.dom.TagName.SPAN, {
      'class': this.classPrefix + '-homeicon'
    });
    goog.dom.appendChild(addressElement, homeIcon);
  }

  var addressText = goog.dom.createDom(goog.dom.TagName.SPAN, {
    'class': this.classPrefix + '-text'
  }, address.text);
  goog.dom.appendChild(addressElement, addressText);

  goog.dom.appendChild(this.addressesList_, addressElement);

  this.addressElements_.push(addressElement);
  this.removeAddressElements_.push(removeAddressAnchor);

  goog.events.listen(addressElement, [
    goog.events.EventType.CLICK
  ], me.handleAddressElementPress_, false, me);

  goog.events.listen(removeAddressAnchor, [
    goog.events.EventType.CLICK
  ], me.handleRemoveAddressElementPress_, false, me);
};


/**
 * @private
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 */
ol.control.GoogleMapsAddresses.prototype.handleAddressElementPress_ = function(
    browserEvent) {

  browserEvent.preventDefault();

  this.clear_();

  var element = browserEvent.currentTarget;
  var id = element.getAttribute('data-result');
  var address = this.getAddressByID_(id);

  if (!goog.isNull(address)) {
    var oldAddress = this.currentAddress;
    this.currentAddress = address;
    this.displayAddress_(address);
    if (this.isEditing_ && this.currentAddress == oldAddress)
      this.stopEditingAddress_();
    else
      this.editAddress_(address);
  }
};


/**
 * @private
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 */
ol.control.GoogleMapsAddresses.prototype.handleRemoveAddressElementPress_ =
    function(browserEvent) {

  browserEvent.preventDefault();

  var element = browserEvent.currentTarget;
  var id = element.getAttribute('data-result');
  var address = this.getAddressByID_(id);

  this.saveAddress_(address, 'delete');
};


/**
 * @private
 * @param {number} id
 * @return {?mtx.format.Address} address
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
 * @param {mtx.format.Address} address
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

  this.location_ = location;

  var view = map.getView();
  goog.asserts.assert(goog.isDef(view));

  var projection = view.getProjection();

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

  var size = map.getSize();
  goog.asserts.assertArray(size);

  var extent = feature.getGeometry().getExtent();
  extent = ol.extent.buffer(extent, 2000);

  view.fitExtent(extent, size);
};


/**
 * @param {?string} error
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.setError_ = function(error) {
  if (!goog.isNull(error) || !goog.isNull(this.error_)) {
    this.error_ = error;
    goog.events.dispatchEvent(this,
        ol.control.GoogleMapsAddresses.EventType.ERROR);
  }
};


/**
 * Must call before adding a home address.
 * @param {mtx.format.Address=} opt_address
 * @private
 */
ol.control.GoogleMapsAddresses.prototype.addHomeAddress_ =
    function(opt_address) {
  var except = goog.isDefAndNotNull(opt_address) ? opt_address : null;

  this.haveAHomeAddress = true;
  this.homeCheck_.disabled = false;
  this.homeCheck_.checked = false;
  for (var i in this.addresses) {
    if (this.addresses[i].type == 1 && this.addresses[i] != except) {
      this.addresses[i].type = 0;
      this.saveAddress_(this.addresses[i], 'update');
    }
  }
  $('.' + this.classPrefix + '-homeicon').remove();
  $('.' + this.classPrefix + '-remove-address-disabled').removeClass(
      this.classPrefix + '-remove-address-disabled');
};
