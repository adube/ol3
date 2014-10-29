goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.View');
goog.require('ol.control.GoogleMapsAddresses');
goog.require('ol.control.GoogleMapsCurrentPosition');
goog.require('ol.control.GoogleMapsGeocoder');
goog.require('ol.control.GoogleMapsDirections');
goog.require('ol.control.GoogleMapsDirectionsPanel');
goog.require('ol.control.LayerSwitcher');
goog.require('ol.control.MTSearch');
goog.require('ol.control.SingleDraw');
goog.require('ol.extent');
goog.require('ol.format.GeoJSON');
goog.require('ol.Feature');
goog.require('ol.geom.Point');
goog.require('ol.geom.LineString');
goog.require('ol.geom.Polygon');
goog.require('ol.interaction');
goog.require('ol.interaction.DragPan');
goog.require('ol.interaction.DragStyleCursor');
goog.require('ol.layer.Vector');
goog.require('ol.Object');
goog.require('ol.proj');
goog.require('ol.source.GeoJSON');
goog.require('ol.source.Vector');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');
goog.require('ol.style.Icon');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');
goog.require('ol.style.Text');

goog.exportSymbol(
    'ol.Map',
    ol.Map);

goog.exportProperty(
    ol.Map.prototype,
    'addLayer',
    ol.Map.prototype.addLayer);

goog.exportSymbol(
    'ol.View',
    ol.View);

goog.exportProperty(
    ol.View.prototype,
    'on',
    ol.View.prototype.on);

goog.exportProperty(
    ol.View.prototype,
    'getZoom',
    ol.View.prototype.getZoom);

goog.exportProperty(
    ol.View.prototype,
    'calculateExtent',
    ol.View.prototype.calculateExtent);

goog.exportSymbol(
    'ol.proj.transform',
    ol.proj.transform);

goog.exportSymbol(
    'ol.extent',
    ol.extent);

goog.exportSymbol(
    'ol.layer.Vector',
    ol.layer.Vector);

goog.exportSymbol(
    'ol.Object',
    ol.Object);

goog.exportProperty(
    ol.Object.prototype,
    'set',
    ol.Object.prototype.set);

goog.exportProperty(
    ol.Object.prototype,
    'get',
    ol.Object.prototype.get);

goog.exportProperty(
    ol.Object,
    'getChangeEventType',
    ol.Object.getChangeEventType);


goog.exportSymbol(
    'ol.Feature',
    ol.Feature);

goog.exportProperty(
    ol.Feature.prototype,
    'getGeometry',
    ol.Feature.prototype.getGeometry);


goog.exportProperty(
    ol.extent,
    'getBottomLeft',
    ol.extent.getBottomLeft);

goog.exportProperty(
    ol.extent,
    'getTopRight',
    ol.extent.getTopRight);

goog.exportProperty(
    ol.extent,
    'boundingExtent',
    ol.extent.boundingExtent);

goog.exportProperty(
    ol.extent,
    'createEmpty',
    ol.extent.createEmpty);

goog.exportProperty(
    ol.extent,
    'extendCoordinate',
    ol.extent.extendCoordinate);


goog.exportSymbol(
    'ol.format.GeoJSON',
    ol.format.GeoJSON);

goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'readGeometry',
    ol.format.GeoJSON.prototype.readGeometry);

goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'writeGeometry',
    ol.format.GeoJSON.prototype.writeGeometry);


goog.exportSymbol(
    'ol.geom.Point',
    ol.geom.Point);


goog.exportSymbol(
    'ol.geom.LineString',
    ol.geom.LineString);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'getCoordinates',
    ol.geom.LineString.prototype.getCoordinates);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'getCoordinates',
    ol.geom.LineString.prototype.getCoordinates);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getCoordinates',
    ol.geom.Polygon.prototype.getCoordinates);



goog.exportSymbol(
    'ol.source.GeoJSON',
    ol.source.GeoJSON);

goog.exportProperty(
    ol.source.GeoJSON.prototype,
    'readFeatures',
    ol.source.GeoJSON.prototype.readFeatures);


goog.exportSymbol(
    'ol.source.Vector',
    ol.source.Vector);

goog.exportProperty(
    ol.source.Vector.prototype,
    'addFeatures',
    ol.source.Vector.prototype.addFeatures);

goog.exportSymbol(
    'ol.style.Style',
    ol.style.Style);

goog.exportSymbol(
    'ol.style.Stroke',
    ol.style.Stroke);

goog.exportSymbol(
    'ol.interaction.defaults',
    ol.interaction.defaults);

goog.exportProperty(
    ol.Collection.prototype,
    'extend',
    ol.Collection.prototype.extend);

goog.exportSymbol(
    'ol.interaction.DragPan',
    ol.interaction.DragPan);

goog.exportSymbol(
    'ol.interaction.DragStyleCursor',
    ol.interaction.DragStyleCursor);


goog.exportProperty(
    ol.View.prototype,
    'fitExtent',
    ol.View.prototype.fitExtent);

goog.exportProperty(
    ol.View.prototype,
    'setCenter',
    ol.View.prototype.setCenter);

goog.exportProperty(
    ol.View.prototype,
    'setZoom',
    ol.View.prototype.setZoom);

goog.exportProperty(
    ol.Object.prototype,
    'getProperties',
    ol.Object.prototype.getProperties);

goog.exportSymbol(
    'ol.style.Circle',
    ol.style.Circle);

goog.exportSymbol(
    'ol.style.Text',
    ol.style.Text);

goog.exportSymbol(
    'ol.style.Fill',
    ol.style.Fill);

goog.exportProperty(
    ol.style.Style.prototype,
    'getFill',
    ol.style.Style.prototype.getFill);

goog.exportProperty(
    ol.style.Style.prototype,
    'getStroke',
    ol.style.Style.prototype.getStroke);


goog.exportSymbol(
    'ol.control.GoogleMapsDirectionsPanel',
    ol.control.GoogleMapsDirectionsPanel);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel,
    'EventType',
    ol.control.GoogleMapsDirectionsPanel.EventType);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.EventType,
    'CONTACT',
    ol.control.GoogleMapsDirectionsPanel.EventType.CONTACT);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.EventType,
    'SELECT',
    ol.control.GoogleMapsDirectionsPanel.EventType.SELECT);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.EventType,
    'SET',
    ol.control.GoogleMapsDirectionsPanel.EventType.SET);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.EventType,
    'UNSELECT',
    ol.control.GoogleMapsDirectionsPanel.EventType.UNSELECT);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel,
    'Mode',
    ol.control.GoogleMapsDirectionsPanel.Mode);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.Mode,
    'SIMPLE',
    ol.control.GoogleMapsDirectionsPanel.Mode.SIMPLE);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.Mode,
    'COMPLEX',
    ol.control.GoogleMapsDirectionsPanel.Mode.COMPLEX);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.prototype,
    'getContactInfo',
    ol.control.GoogleMapsDirectionsPanel.prototype.getContactInfo);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.prototype,
    'select',
    ol.control.GoogleMapsDirectionsPanel.prototype.select);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.prototype,
    'getSelectedRouteLegsAsGeoJSON',
    ol.control.GoogleMapsDirectionsPanel.prototype.getSelectedRouteLegsAsGeoJSON);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.prototype,
    'getSelectedRouteDistanceValue',
    ol.control.GoogleMapsDirectionsPanel.prototype.getSelectedRouteDistanceValue);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.prototype,
    'getSelectedRouteDurationValue',
    ol.control.GoogleMapsDirectionsPanel.prototype.getSelectedRouteDurationValue);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.prototype,
    'on',
    ol.control.GoogleMapsDirectionsPanel.prototype.on);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.prototype,
    'toggleReadOnly',
    ol.control.GoogleMapsDirectionsPanel.prototype.toggleReadOnly);


goog.exportSymbol(
    'ol.control.GoogleMapsDirections',
    ol.control.GoogleMapsDirections);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'disableMapEditing',
    ol.control.GoogleMapsDirections.prototype.disableMapEditing);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'enableMapEditing',
    ol.control.GoogleMapsDirections.prototype.enableMapEditing);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'getError',
    ol.control.GoogleMapsDirections.prototype.getError);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'getGeocoderInfo',
    ol.control.GoogleMapsDirections.prototype.getGeocoderInfo);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'getSelectedTravelModes',
    ol.control.GoogleMapsDirections.prototype.getSelectedTravelModes);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'getStartGeocoder',
    ol.control.GoogleMapsDirections.prototype.getStartGeocoder);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'load',
    ol.control.GoogleMapsDirections.prototype.load);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'loadQueryParams',
    ol.control.GoogleMapsDirections.prototype.loadQueryParams);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'loadRoute',
    ol.control.GoogleMapsDirections.prototype.loadRoute);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'on',
    ol.control.GoogleMapsDirections.prototype.on);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'save',
    ol.control.GoogleMapsDirections.prototype.save);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'saveQueryParams',
    ol.control.GoogleMapsDirections.prototype.saveQueryParams);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'setLayerOpacity',
    ol.control.GoogleMapsDirections.prototype.setLayerOpacity);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'setProperties',
    ol.control.GoogleMapsDirections.prototype.setProperties);

goog.exportProperty(
    ol.control.GoogleMapsDirections.prototype,
    'triggerRouteRequest',
    ol.control.GoogleMapsDirections.prototype.triggerRouteRequest);

goog.exportProperty(
    ol.control.GoogleMapsDirections,
    'EventType',
    ol.control.GoogleMapsDirections.EventType);

goog.exportProperty(
    ol.control.GoogleMapsDirections.EventType,
    'CLEAR',
    ol.control.GoogleMapsDirections.EventType.CLEAR);

goog.exportProperty(
    ol.control.GoogleMapsDirections.EventType,
    'ERROR',
    ol.control.GoogleMapsDirections.EventType.ERROR);

goog.exportProperty(
    ol.control.GoogleMapsDirections.EventType,
    'GEOCODERREMOVE',
    ol.control.GoogleMapsDirections.EventType.GEOCODERREMOVE);

goog.exportProperty(
    ol.control.GoogleMapsDirections.EventType,
    'QUERYPARAMSCHANGE',
    ol.control.GoogleMapsDirections.EventType.QUERYPARAMSCHANGE);

goog.exportProperty(
    ol.control.GoogleMapsDirections.EventType,
    'ROUTECOMPLETE',
    ol.control.GoogleMapsDirections.EventType.ROUTECOMPLETE);

goog.exportProperty(
    ol.control.GoogleMapsDirections.EventType,
    'SELECT',
    ol.control.GoogleMapsDirections.EventType.SELECT);

goog.exportProperty(
    ol.control.GoogleMapsDirections,
    'TravelMode',
    ol.control.GoogleMapsDirections.TravelMode);

goog.exportProperty(
    ol.control.GoogleMapsDirections.TravelMode,
    'BICYCLING',
    ol.control.GoogleMapsDirections.TravelMode.BICYCLING);

goog.exportProperty(
    ol.control.GoogleMapsDirections.TravelMode,
    'CARPOOLING',
    ol.control.GoogleMapsDirections.TravelMode.CARPOOLING);

goog.exportProperty(
    ol.control.GoogleMapsDirections.TravelMode,
    'DRIVING',
    ol.control.GoogleMapsDirections.TravelMode.DRIVING);

goog.exportProperty(
    ol.control.GoogleMapsDirections.TravelMode,
    'TRANSIT',
    ol.control.GoogleMapsDirections.TravelMode.TRANSIT);

goog.exportProperty(
    ol.control.GoogleMapsDirections.TravelMode,
    'WALKING',
    ol.control.GoogleMapsDirections.TravelMode.WALKING);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.Mode,
    'SIMPLE',
    ol.control.GoogleMapsDirectionsPanel.Mode.SIMPLE);

goog.exportProperty(
    ol.control.GoogleMapsDirectionsPanel.Mode,
    'COMPLEX',
    ol.control.GoogleMapsDirectionsPanel.Mode.COMPLEX);

goog.exportSymbol(
    'ol.style.Icon',
    ol.style.Icon);

goog.exportProperty(
    ol.Map.prototype,
    'addControl',
    ol.Map.prototype.addControl);


goog.exportSymbol(
    'ol.control.GoogleMapsAddresses',
    ol.control.GoogleMapsAddresses);

goog.exportProperty(
    ol.control.GoogleMapsAddresses,
    'EventType',
    ol.control.GoogleMapsAddresses.EventType);

goog.exportProperty(
    ol.control.GoogleMapsAddresses.EventType,
    'ADD',
    ol.control.GoogleMapsAddresses.EventType.ADD);

goog.exportProperty(
    ol.control.GoogleMapsAddresses.EventType,
    'ERROR',
    ol.control.GoogleMapsAddresses.EventType.ERROR);

goog.exportProperty(
    ol.control.GoogleMapsAddresses.EventType,
    'LOADSUCCESS',
    ol.control.GoogleMapsAddresses.EventType.LOADSUCCESS);

goog.exportProperty(
    ol.control.GoogleMapsAddresses.EventType,
    'REMOVE',
    ol.control.GoogleMapsAddresses.EventType.REMOVE);

goog.exportProperty(
    ol.control.GoogleMapsAddresses.prototype,
    'getAddresses',
    ol.control.GoogleMapsAddresses.prototype.getAddresses);

goog.exportProperty(
    ol.control.GoogleMapsAddresses.prototype,
    'getError',
    ol.control.GoogleMapsAddresses.prototype.getError);

goog.exportProperty(
    ol.control.GoogleMapsAddresses.prototype,
    'on',
    ol.control.GoogleMapsAddresses.prototype.on);


goog.exportSymbol(
    'ol.control.GoogleMapsCurrentPosition',
    ol.control.GoogleMapsCurrentPosition);


goog.exportSymbol(
    'ol.control.GoogleMapsGeocoder',
    ol.control.GoogleMapsGeocoder);

goog.exportProperty(
    ol.control.GoogleMapsGeocoder.prototype,
    'on',
    ol.control.GoogleMapsGeocoder.prototype.on);

goog.exportProperty(
    ol.control.GoogleMapsGeocoder,
    'EventType',
    ol.control.GoogleMapsGeocoder.EventType);

goog.exportProperty(
    ol.control.GoogleMapsGeocoder.EventType,
    'ERROR',
    ol.control.GoogleMapsGeocoder.EventType.ERROR);

goog.exportProperty(
    ol.control.GoogleMapsGeocoder,
    'Property',
    ol.control.GoogleMapsGeocoder.Property);

goog.exportProperty(
    ol.control.GoogleMapsGeocoder.Property,
    'LOCATION',
    ol.control.GoogleMapsGeocoder.Property.LOCATION);

goog.exportProperty(
    ol.control.GoogleMapsGeocoder.prototype,
    'setInputValue',
    ol.control.GoogleMapsGeocoder.prototype.setInputValue);

goog.exportProperty(
    ol.control.GoogleMapsGeocoder.prototype,
    'setLocation',
    ol.control.GoogleMapsGeocoder.prototype.setLocation);


goog.exportSymbol(
    'ol.control.MTSearch',
    ol.control.MTSearch);

goog.exportProperty(
    ol.control.MTSearch,
    'EventType',
    ol.control.MTSearch.EventType);

goog.exportProperty(
    ol.control.MTSearch.EventType,
    'ERROR',
    ol.control.MTSearch.EventType.ERROR);

goog.exportProperty(
    ol.control.MTSearch.prototype,
    'clear',
    ol.control.MTSearch.prototype.clear);

goog.exportProperty(
    ol.control.MTSearch.prototype,
    'getError',
    ol.control.MTSearch.prototype.getError);

goog.exportProperty(
    ol.control.MTSearch.prototype,
    'on',
    ol.control.MTSearch.prototype.on);

goog.exportProperty(
    ol.control.MTSearch.prototype,
    'setProperties',
    ol.control.MTSearch.prototype.setProperties);

goog.exportProperty(
    ol.control.MTSearch.prototype,
    'triggerRequest',
    ol.control.MTSearch.prototype.triggerRequest);


goog.exportSymbol(
    'ol.control.SingleDraw',
    ol.control.SingleDraw);

goog.exportProperty(
    ol.control.SingleDraw.prototype,
    'loadPolygon',
    ol.control.SingleDraw.prototype.loadPolygon);

goog.exportProperty(
    ol.control.SingleDraw.prototype,
    'on',
    ol.control.SingleDraw.prototype.on);

goog.exportProperty(
    ol.control.SingleDraw.prototype,
    'stopDrawing',
    ol.control.SingleDraw.prototype.stopDrawing);

goog.exportProperty(
    ol.control.SingleDraw.prototype,
    'eraseDrawing',
    ol.control.SingleDraw.prototype.eraseDrawing);

goog.exportProperty(
    ol.control.SingleDraw,
    'EventType',
    ol.control.SingleDraw.EventType);

goog.exportProperty(
    ol.control.SingleDraw.EventType,
    'DEACTIVATED',
    ol.control.SingleDraw.EventType.DEACTIVATED);

goog.exportProperty(
    ol.control.SingleDraw.EventType,
    'ACTIVATED',
    ol.control.SingleDraw.EventType.ACTIVATED);

goog.exportProperty(
    ol.control.SingleDraw.EventType,
    'DRAWINGSTOPPED',
    ol.control.SingleDraw.EventType.DRAWINGSTOPPED);

goog.exportProperty(
    ol.control.SingleDraw.EventType,
    'BEFOREDRAWINGERASE',
    ol.control.SingleDraw.EventType.BEFOREDRAWINGERASE);

goog.exportProperty(
    ol.control.SingleDraw.EventType,
    'AFTERDRAWINGERASE',
    ol.control.SingleDraw.EventType.AFTERDRAWINGERASE);

goog.exportSymbol(
    'ol.control.LayerSwitcher',
    ol.control.LayerSwitcher);
