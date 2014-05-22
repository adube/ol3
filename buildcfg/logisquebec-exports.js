goog.require('ol.Feature');
goog.require('ol.Map');
goog.require('ol.MapBrowserEvent.EventType');
goog.require('ol.Overlay');
goog.require('ol.OverlayPositioning');
goog.require('ol.View');
goog.require('ol.View2D');
goog.require('ol.extent');
goog.require('ol.geom.Point');
goog.require('ol.interaction');
goog.require('ol.interaction.DragPan');
goog.require('ol.layer.Vector');
goog.require('ol.proj');
goog.require('ol.source.Vector');
goog.require('ol.style.Icon');
goog.require('ol.style.Style');

goog.exportSymbol(
    'ol.Feature',
    ol.Feature);

goog.exportProperty(
    ol.Feature.prototype,
    'getProperties',
    ol.Feature.prototype.getProperties);

goog.exportProperty(
    ol.Feature.prototype,
    'setStyle',
    ol.Feature.prototype.setStyle);


goog.exportSymbol(
    'ol.Map',
    ol.Map);

goog.exportProperty(
    ol.Map.prototype,
    'addOverlay',
    ol.Map.prototype.addOverlay);

goog.exportProperty(
    ol.Map.prototype,
    'forEachFeatureAtPixel',
    ol.Map.prototype.forEachFeatureAtPixel);

goog.exportProperty(
    ol.Map.prototype,
    'getEventPixel',
    ol.Map.prototype.getEventPixel);

goog.exportProperty(
    ol.Map.prototype,
    'on',
    ol.Map.prototype.on);


goog.exportSymbol(
    'ol.MapBrowserEvent',
    ol.MapBrowserEvent);

goog.exportProperty(
    ol.MapBrowserEvent,
    'EventType',
    ol.MapBrowserEvent.EventType);  

goog.exportProperty(
    ol.MapBrowserEvent.EventType,
    'POINTERMOVE',
    ol.MapBrowserEvent.EventType.POINTERMOVE);


goog.exportSymbol(
    'ol.Overlay',
    ol.Overlay);

goog.exportProperty(
    ol.Overlay.prototype,
    'getElement',
    ol.Overlay.prototype.getElement);

goog.exportProperty(
    ol.Overlay.prototype,
    'setPosition',
    ol.Overlay.prototype.setPosition);

goog.exportProperty(
    ol.Overlay.prototype,
    'setPositioning',
    ol.Overlay.prototype.setPositioning);


goog.exportSymbol(
    'ol.View',
    ol.View);

goog.exportProperty(
    ol.View.prototype,
    'getView2D',
    ol.View.prototype.getView2D);


goog.exportSymbol(
    'ol.View2D',
    ol.View2D);

goog.exportProperty(
    ol.View2D.prototype,
    'calculateExtent',
    ol.View2D.prototype.calculateExtent);

goog.exportProperty(
    ol.View2D.prototype,
    'getResolutionForExtent',
    ol.View2D.prototype.getResolutionForExtent);

goog.exportProperty(
    ol.View2D.prototype,
    'getZoom',
    ol.View2D.prototype.getZoom);

goog.exportProperty(
    ol.View2D.prototype,
    'on',
    ol.View2D.prototype.on);

goog.exportProperty(
    ol.View2D.prototype,
    'setCenter',
    ol.View2D.prototype.setCenter);

goog.exportProperty(
    ol.View2D.prototype,
    'setZoom',
    ol.View2D.prototype.setZoom);


goog.exportSymbol(
    'ol.extent.containsCoordinate',
    ol.extent.containsCoordinate);

goog.exportSymbol(
    'ol.extent.createOrUpdate',
    ol.extent.createOrUpdate);

goog.exportSymbol(
    'ol.extent.getBottomLeft',
    ol.extent.getBottomLeft);

goog.exportSymbol(
    'ol.extent.getTopRight',
    ol.extent.getTopRight);


goog.exportSymbol(
    'ol.proj.transform',
    ol.proj.transform);


goog.exportSymbol(
    'ol.layer.Vector',
    ol.layer.Vector);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'getSource',
    ol.layer.Vector.prototype.getSource);


goog.exportSymbol(
    'ol.source.Vector',
    ol.source.Vector);

goog.exportProperty(
    ol.source.Vector.prototype,
    'addFeatures',
    ol.source.Vector.prototype.addFeatures);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getFeatures',
    ol.source.Vector.prototype.getFeatures);


goog.exportSymbol(
    'ol.style.Style',
    ol.style.Style);

goog.exportSymbol(
    'ol.style.Stroke',
    ol.style.Stroke);


goog.exportSymbol(
    'ol.geom.Geometry',
    ol.geom.Geometry);

goog.exportSymbol(
    'ol.geom.Point',
    ol.geom.Point);

goog.exportProperty(
    ol.geom.Point.prototype,
    'getCoordinates',
    ol.geom.Point.prototype.getCoordinates);


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

goog.exportProperty(
    ol.Object.prototype,
    'getProperties',
    ol.Object.prototype.getProperties);

goog.exportSymbol(
    'ol.style.Circle',
    ol.style.Circle);

goog.exportSymbol(
    'ol.style.Fill',
    ol.style.Fill);

goog.exportSymbol(
    'ol.style.Icon',
    ol.style.Icon);

goog.exportProperty(
    ol.Map.prototype,
    'addControl',
    ol.Map.prototype.addControl);
