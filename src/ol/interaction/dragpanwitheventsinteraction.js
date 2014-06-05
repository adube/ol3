// FIXME works for View2D only
goog.provide('ol.interaction.DragPanWithEvents');

goog.require('goog.events');
goog.require('ol.interaction.DragPan');



/**
 * Allows the user to pan the map by dragging the map.
 * @constructor
 * @extends {ol.interaction.DragPan}
 * @param {olx.interaction.DragPanOptions=} opt_options Options.
 * @todo api
 */
ol.interaction.DragPanWithEvents = function(opt_options) {
  goog.base(this, opt_options);
};
goog.inherits(ol.interaction.DragPanWithEvents, ol.interaction.DragPan);


/**
 * @enum {string}
 */
ol.interaction.DragPanWithEvents.EventType = {
  POINTERUP: 'pointerup'
};


/**
 * @inheritDoc
 */
ol.interaction.DragPanWithEvents.prototype.handlePointerUp =
    function(mapBrowserEvent) {
  ol.interaction.DragPan.prototype.handlePointerUp.call(this, mapBrowserEvent);
  goog.events.dispatchEvent(
      this,
      ol.interaction.DragPanWithEvents.EventType.POINTERUP);
};
