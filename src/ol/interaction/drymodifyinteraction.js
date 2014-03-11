goog.provide('ol.interaction.DryModify');
goog.require('ol.interaction.Modify');



/**
 * @constructor
 * @extends {ol.interaction.Modify}
 * @param {olx.interaction.DryModifyOptions} options Options.
 */
ol.interaction.DryModify = function(options) {

  goog.base(this, options);

};
goog.inherits(ol.interaction.DryModify, ol.interaction.Modify);


/**
 * @inheritDoc
 */
ol.interaction.DryModify.prototype.handleDragStart = function(evt) {};


/**
 * @inheritDoc
 */
ol.interaction.DryModify.prototype.handleDrag = function(evt) {};


/**
 * @inheritDoc
 */
ol.interaction.DryModify.prototype.handleDragEnd = function(evt) {};
