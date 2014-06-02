goog.provide('ol.control.SingleDraw');

goog.require('goog.dom');
goog.require('ol.control.Control');



/**
 * Todo
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.SingleDrawOptions=} opt_options Options.
 */
ol.control.SingleDraw = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  var className = goog.isDef(options.className) ?
    options.className : 'ol-singledraw';

  var element = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': className
  });

  goog.base(this, {
    element: element,
    target: options.target
  });
};
goog.inherits(ol.control.SingleDraw, ol.control.Control);
