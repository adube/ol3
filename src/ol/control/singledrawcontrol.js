goog.provide('ol.control.SingleDraw');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('ol.Feature');
goog.require('ol.control.Control');
goog.require('ol.geom.GeometryType');
goog.require('ol.interaction.DragBox');
goog.require('ol.interaction.Draw');
goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');
goog.require('ol.style.Fill');
goog.require('ol.style.Style');



/**
 * @classdesc
 * Todo
 *
 * @constructor
 * @extends {ol.control.Control}
 * @param {olx.control.SingleDrawOptions=} opt_options Options.
 * @api
 */
ol.control.SingleDraw = function(opt_options) {
  /**
   * State of the control
   * Disabled - Can't draw, map is clear
   * Drawing - Can draw, map is clear
   * Finished - Can't draw, there is a drawing on the map
   * @type {string}
   * @private
   */
  this.state_ = 'Disabled';

  /**
   * Current drawing
   * @type {ol.geom.Geometry}
   */
  this.drawing = null;

  /**
   * The control's layer
   * @type {ol.layer.Vector}
   * @private
   */
  this.layer_ = null;

  var options = goog.isDef(opt_options) ? opt_options : {};

  var style = null;
  if (goog.isDef(options.style)) style = options.style;
  else {
    style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: '#D0F46B'
      })
    });
  }

  /**
   * The dragboxinteraction for this control
   * @type {ol.interaction.DragBox|ol.interaction.Draw}
   * @private
   */
  this.interaction_ = null;

  var className = goog.isDef(options.className) ?
      options.className : 'ol-singledraw';

  var icon = goog.dom.createDom(goog.dom.TagName.SPAN, {
    'class': 'icon-pencil'
  });

  /**
   * The control's button
   * @type {Element}
   * @private
   */
  this.element_ = goog.dom.createDom(goog.dom.TagName.DIV, {
    'class': className + ' btn'
  }, icon);

  goog.events.listen(this.element_,
      goog.events.EventType.CLICK,
      this.handleButtonPress_,
      false,
      this
  );

  this.layer_ = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: style
  });

  goog.base(this, {
    element: this.element_,
    target: options.target
  });

  var interactionChoice = goog.isDefAndNotNull(options.interaction) ?
      options.interaction : 'box';

  switch (interactionChoice) {
    case 'box':
      this.interaction_ = new ol.interaction.DragBox({
        style: style
      });
      this.interaction_.on('boxend', this.handleDrawingEnd_, this);
      break;
    case 'draw':
    case 'polygon':
      var source = this.layer_.getSource();
      goog.asserts.assertInstanceof(source, ol.source.Vector);

      this.interaction_ = new ol.interaction.Draw({
        type: ol.geom.GeometryType.POLYGON,
        source: source
      });
      this.interaction_.on('drawend', this.handleDrawingEnd_, this);
      break;
  }
};
goog.inherits(ol.control.SingleDraw, ol.control.Control);


/**
 * SingleDraw events
 * @enum {string}
 */
ol.control.SingleDraw.EventType = {
  ACTIVATED: goog.events.getUniqueId('activated'),
  DEACTIVATED: goog.events.getUniqueId('deactivated'),
  DRAWINGSTOPPED: goog.events.getUniqueId('drawingstopped'),
  BEFOREDRAWINGERASE: goog.events.getUniqueId('beforedrawingerase'),
  AFTERDRAWINGERASE: goog.events.getUniqueId('afterdrawingerase')
};


/**
 * Handle up events.
 * @private
 * @param {goog.events.BrowserEvent} browserEvent Browser event.
 */
ol.control.SingleDraw.prototype.handleButtonPress_ = function(browserEvent) {
  switch (this.state_) {
    case 'Disabled':
      this.changeState_('Drawing');
      break;
    case 'Drawing':
    case 'Finished':
      this.changeState_('Disabled');
      break;
  }
};
/**
 * Change the control's state to the on passed in params.
 * Updates the control's button to reflect the new state.
 * @private
 * @param {string} state The state to change to
 */

ol.control.SingleDraw.prototype.changeState_ = function(state) {
  var iconClass = this.element_.firstChild.className;
  var elementClass = this.element_.className;
  switch (state) {
    case 'Drawing':
      // We can't start drawing from any other state
      if (this.state_ == 'Disabled') {
        this.state_ = 'Drawing';
        elementClass += ' btn-success';
        this.startDrawing_();
        goog.events.dispatchEvent(this,
            ol.control.SingleDraw.EventType.ACTIVATED);
      }else {
        throw 'Drawing cannot be enabled from ' + this.state_ + ' state';
      }
      break;
    case 'Disabled':
      if (this.state_ == 'Finished') {
        iconClass = iconClass.replace('icon-trash', 'icon-pencil');
        elementClass = elementClass.replace('btn-danger', '');
      }else if (this.state_ == 'Drawing') {
        elementClass = elementClass.replace('btn-success', '');
      }
      this.eraseDrawing_();
      this.state_ = 'Disabled';

      goog.events.dispatchEvent(this,
          ol.control.SingleDraw.EventType.DEACTIVATED);
      break;
    case 'Finished':
      // We can't stop drawing from any other state
      if (this.state_ == 'Drawing') {
        this.state_ = 'Finished';
        elementClass = elementClass.replace('btn-success', 'btn-danger');
        iconClass = iconClass.replace('icon-pencil', 'icon-trash');
      }else {
        throw 'Finished cannot be enabled from ' + this.state_ + ' state';
      }
      break;
  }
  this.element_.firstChild.className = iconClass;
  this.element_.className = elementClass;
};


/**
 * Starts drawing
 * @private
 */
ol.control.SingleDraw.prototype.startDrawing_ = function() {
  this.getMap().addInteraction(this.interaction_);
  this.getMap().addLayer(this.layer_);
};


/**
 * Drawing stops
 * @param {ol.DragBoxEvent} evt
 * @private
 */
ol.control.SingleDraw.prototype.handleDrawingEnd_ = function(evt) {
  if (typeof(evt.target.getGeometry) !== 'undefined')
    this.drawing = evt.target.getGeometry();
  else {
    var source = this.layer_.getSource();
    goog.asserts.assertInstanceof(source, ol.source.Vector);

    this.drawing = source.getFeatures()[0].getGeometry() || null;
  }

  var f = new ol.Feature(this.drawing);
  var source = this.layer_.getSource();
  goog.asserts.assertInstanceof(source, ol.source.Vector);
  source.addFeatures([f]);

  this.getMap().removeInteraction(this.interaction_);

  this.changeState_('Finished');

  goog.events.dispatchEvent(this,
      ol.control.SingleDraw.EventType.DRAWINGSTOPPED);
};


/**
 * Erase existing drawing
 * @private
 */
ol.control.SingleDraw.prototype.eraseDrawing_ = function() {
  goog.events.dispatchEvent(this,
      ol.control.SingleDraw.EventType.BEFOREDRAWINGERASE);

  this.drawing = null;

  var source = this.layer_.getSource();
  goog.asserts.assertInstanceof(source, ol.source.Vector);
  source.clear();
  this.getMap().removeLayer(this.layer_);
  this.getMap().removeInteraction(this.interaction_);

  goog.events.dispatchEvent(this,
      ol.control.SingleDraw.EventType.AFTERDRAWINGERASE);
};


/**
 * Public function to disable the control.
 */
ol.control.SingleDraw.prototype.stopDrawing = function() {
  if (this.state_ == 'Drawing')
    this.changeState_('Disabled');
};


/**
 * Public function to erase the drawing
 */
ol.control.SingleDraw.prototype.eraseDrawing = function() {
  this.changeState_('Disabled');
};
