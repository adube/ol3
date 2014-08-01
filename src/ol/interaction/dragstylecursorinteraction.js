goog.provide('ol.interaction.DragStyleCursor');

goog.require('goog.asserts');
goog.require('ol.interaction.Pointer');



/**
 * @classdesc
 * Allows the user to pan the map by dragging the map.
 *
 * @constructor
 * @extends {ol.interaction.Pointer}
 * @api
 */
ol.interaction.DragStyleCursor = function() {

  goog.base(this);

};
goog.inherits(ol.interaction.DragStyleCursor, ol.interaction.Pointer);


/**
 * @inheritDoc
 */
ol.interaction.DragStyleCursor.prototype.handlePointerUp =
    function(mapBrowserEvent) {
  var map = mapBrowserEvent.map;
  map.getTarget().style.cursor = '';
  return true;
};


/**
 * @inheritDoc
 */
ol.interaction.DragStyleCursor.prototype.handlePointerDown =
    function(mapBrowserEvent) {
  var map = mapBrowserEvent.map;
  map.getTarget().style.cursor = 'move';
  return true;
};
