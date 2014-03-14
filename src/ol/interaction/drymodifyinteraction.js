goog.provide('ol.interaction.DryModify');

goog.require('goog.events');
goog.require('ol.interaction.Modify');



/**
 * @constructor
 * @extends {ol.interaction.Modify}
 * @param {olx.interaction.DryModifyOptions} options Options.
 */
ol.interaction.DryModify = function(options) {

  goog.base(this, options);

  /**
   * @type {ol.Coordinate|undefined}
   * @private
   */
  this.coordinate_ = null;

};
goog.inherits(ol.interaction.DryModify, ol.interaction.Modify);


/**
 * @enum {string}
 */
ol.interaction.DryModify.EventType = {
  DRAG: goog.events.getUniqueId('drag'),
  DRAGEND: goog.events.getUniqueId('dragend')
};


/**
 * @return {ol.Coordinate|undefined} Coordinate
 */
ol.interaction.DryModify.prototype.getCoordinate = function() {
  return this.coordinate_;
};
goog.exportProperty(
    ol.interaction.DryModify.prototype,
    'getCoordinate',
    ol.interaction.DryModify.prototype.getCoordinate);


/**
 * @inheritDoc
 */
ol.interaction.DryModify.prototype.handlePointerDown = function(evt) {
  return this.isModifiable();
};


/**
 * @inheritDoc
 */
ol.interaction.DryModify.prototype.handlePointerDrag = function(evt) {
  var vertex = evt.coordinate;
  this.createOrUpdateVertexFeature(vertex);

  this.coordinate_ = vertex;

  goog.events.dispatchEvent(this, ol.interaction.DryModify.EventType.DRAG);
};


/**
 * @inheritDoc
 */
ol.interaction.DryModify.prototype.handlePointerUp = function(evt) {
  this.removeVertexFeature_();
  goog.events.dispatchEvent(this, ol.interaction.DryModify.EventType.DRAGEND);
  return false;
};


/**
 * @private
 */
ol.interaction.Modify.prototype.removeVertexFeature_ = function() {
  if (!goog.isNull(this.vertexFeature_)) {
    this.overlay_.removeFeature(this.vertexFeature_);
    this.vertexFeature_ = null;
  }
};
