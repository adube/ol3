goog.provide('ol.control.LayerSwitcher');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('ol.control.Control');



/**
 * @classdesc
 * Todo
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.LayerSwitcherOptions=} opt_options Options.
 * @api
 */
ol.control.LayerSwitcher = function(opt_options) {

  var options = goog.isDef(opt_options) ? opt_options : {};

  /**
   * Layers controlled by this control
   * @type {Array.<ol.layer.Vector>}
   * @private
   */
  this.layers_ = goog.isDef(options.layers) ? options.layers : [];

  /**
   * This object's classname
   * @type {string}
   * @private
   */
  this.className_ = goog.isDef(options.className) ?
      options.className : 'ol-layerswitcher';

  var elements = [];
  var layer;
  for (var i in this.layers_) {
    layer = this.layers_[i];
    if (layer.get('name')) {
      var checkbox = goog.dom.createDom(goog.dom.TagName.INPUT, {
        'id' : this.className_ + '-list-layer-element-' + i,
        'type': 'checkbox',
        'checked': (layer.getVisible()) ? 'checked' : ''
      });
      goog.events.listen(
          checkbox,
          goog.events.EventType.CHANGE,
          this.handleCheckboxChange_,
          false,
          this
      );
      elements.push(checkbox);

      var layerName = layer.get('name');
      goog.asserts.assertString(layerName);
      var labelEl = goog.dom.createDom(goog.dom.TagName.LABEL, {
        'class' : this.className_ + '-list-layer-element',
        'for' : this.className_ + '-list-layer-element-' + i
      }, layerName);

      elements.push(labelEl);
    }
  }
  /**
   * The collapsible div with the list of the layers
   * @type {Element}
   * @private
   */
  this.listLayerDiv_ = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': this.className_ + '-list-layer-div'
  }, elements);

  var icon = goog.dom.createDom(goog.dom.TagName.SPAN, {
    'class': 'icon-chevron-down'
  });

  var button = goog.dom.createDom(goog.dom.TagName.SPAN, {
    'class': this.className_ + '-button btn'
  }, icon);

  goog.events.listen(button,
      goog.events.EventType.CLICK,
      this.handleButtonPress_,
      false,
      this
  );

  /**
   * The control's div
   * @type {Element}
   * @private
   */
  this.element_ = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': this.className_
  }, button, this.listLayerDiv_);

  goog.base(this, {
    element: this.element_,
    target: options.target
  });

};
goog.inherits(ol.control.LayerSwitcher, ol.control.Control);


/**
 * Handles when the layer list is collapsed.
 * Sprinkled with jquery for animations.
 * @private
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 */
ol.control.LayerSwitcher.prototype.handleButtonPress_ = function(browserEvent) {
  var button = '.' + this.className_ + '-button';
  var div = '.' + this.className_ + '-list-layer-div';
  if ($(div).is(':visible')) {
    $(button + ' span').removeClass('icon-chevron-down');
    $(button + ' span').addClass('icon-chevron-up');
    $(div).slideUp();
  }else {
    $(button + ' span').removeClass('icon-chevron-up');
    $(button + ' span').addClass('icon-chevron-down');
    $(div).slideDown();
  }
};


/**
 * Handle whenever a checkbox is checked
 * @private
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 */
ol.control.LayerSwitcher.prototype.handleCheckboxChange_ =
    function(browserEvent) {
  var rawid = browserEvent.target.id;
  var id = rawid.replace(this.className_ + '-list-layer-element-', '');
  this.layers_[id].setVisible(browserEvent.target.checked);
};
