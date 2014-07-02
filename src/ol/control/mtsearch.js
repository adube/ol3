goog.provide('ol.control.MTSearch');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('ol.control.Control');



/**
 * Todo
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.MTSearchOptions=} opt_options Options.
 */
ol.control.MTSearch = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  /**
   * @type {string}
   * @private
   */
  this.classPrefix_ = 'ol-mts';

  var classPrefix = this.classPrefix_;

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': classPrefix + ' ' + ol.css.CLASS_UNSELECTABLE
  });

  goog.base(this, {
    element: element,
    target: options.target
  });

};
goog.inherits(ol.control.MTSearch, ol.control.Control);
