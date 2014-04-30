/**
 * @type {Object}
 */
var olx;


/* typedefs for object literals provided by applications */


/**
 * @typedef {{html: string,
 *     tileRanges: (Object.<string, Array.<ol.TileRange>>|undefined)}}
 * @api
 */
olx.AttributionOptions;


/**
 * HTML markup for this attribution.
 * @type {string}
 */
olx.AttributionOptions.prototype.html;


/**
 * Tile ranges (FOR INTERNAL USE ONLY).
 * @type {Object.<string, Array.<ol.TileRange>>|undefined}
 */
olx.AttributionOptions.prototype.tileRanges;


/**
 * @typedef {{loadTilesWhileAnimating: (boolean|undefined),
 *     loadTilesWhileInteracting: (boolean|undefined)}}
 * @api
 */
olx.DeviceOptions;


/**
 * When set to false, no tiles will be loaded while animating, which improves
 * responsiveness on devices with slow memory. Default is `true`.
 * @type {boolean|undefined}
 */
olx.DeviceOptions.prototype.loadTilesWhileAnimating;


/**
 * When set to false, no tiles will be loaded while interacting, which improves
 * responsiveness on devices with slow memory. Default is `true`.
 * @type {boolean|undefined}
 */
olx.DeviceOptions.prototype.loadTilesWhileInteracting;


/**
 * @typedef {{tracking: (boolean|undefined)}}
 * @api
 */
olx.DeviceOrientationOptions;


/**
 * Start tracking. Default is `false`.
 * @type {boolean|undefined}
 */
olx.DeviceOrientationOptions.prototype.tracking;


/**
 * @typedef {{tracking: (boolean|undefined),
 *     trackingOptions: (GeolocationPositionOptions|undefined),
 *     projection: ol.proj.ProjectionLike}}
 * @api
 */
olx.GeolocationOptions;


/**
 * Start Tracking. Default is `false`.
 * @type {boolean|undefined}
 */
olx.GeolocationOptions.prototype.tracking;


/**
 * Tracking options. See
 * {@link http://www.w3.org/TR/geolocation-API/#position_options_interface}.
 * @type {GeolocationPositionOptions|undefined}
 */
olx.GeolocationOptions.prototype.trackingOptions;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.GeolocationOptions.prototype.projection;


/**
 * Object literal with config options for the map logo.
 * @typedef {{href: (string), src: (string)}}
 * @api
 */
olx.LogoOptions;


/**
 * @typedef {{map: (ol.Map|undefined),
 *     maxLines: (number|undefined),
 *     targetSize: (number|undefined)}}
 */
olx.GraticuleOptions;


/**
 * Reference to an `ol.Map` object.
 * @type {ol.Map|undefined}
 */
olx.GraticuleOptions.prototype.map;


/**
 * The maximum number of meridians and parallels from the center of the
 * map. The default value is 100, which means that at most 200 meridians
 * and 200 parallels will be displayed. The default value is appropriate
 * for conformal projections like Spherical Mercator. If you increase
 * the value more lines will be drawn and the drawing performance will
 * decrease.
 * @type {number|undefined}
 */
olx.GraticuleOptions.prototype.maxLines;


/**
 * The target size of the graticule cells, in pixels. Default
 * value is 100 pixels.
 * @type {number|undefined}
 */
olx.GraticuleOptions.prototype.targetSize;


/**
 * Object literal with config options for the map.
 * @typedef {{controls: (ol.Collection|Array.<ol.control.Control>|undefined),
 *     deviceOptions: (olx.DeviceOptions|undefined),
 *     pixelRatio: (number|undefined),
 *     interactions: (ol.Collection|Array.<ol.interaction.Interaction>|undefined),
 *     keyboardEventTarget: (Element|Document|string|undefined),
 *     layers: (Array.<ol.layer.Base>|ol.Collection|undefined),
 *     logo: (boolean|string|olx.LogoOptions|undefined),
 *     overlays: (ol.Collection|Array.<ol.Overlay>|undefined),
 *     renderer: (ol.RendererType|Array.<ol.RendererType|string>|string|undefined),
 *     target: (Element|string|undefined),
 *     view: (ol.View|undefined)}}
 * @api
 */
olx.MapOptions;


/**
 * Controls initially added to the map. If not specified,
 * {@link ol.control.defaults ol.control.defaults()} is used.
 * @type {ol.Collection|Array.<ol.control.Control>|undefined}
 */
olx.MapOptions.prototype.controls;


/**
 * Device options for the map.
 * @type {olx.DeviceOptions|undefined}
 */
olx.MapOptions.prototype.deviceOptions;


/**
 * The ratio between physical pixels and device-independent pixels (dips) on the
 * device. If `undefined` then it gets set by using `window.devicePixelRatio`.
 * @type {number|undefined}
 */
olx.MapOptions.prototype.pixelRatio;


/**
 * Interactions that are initially added to the map. If not specified,
 * {@link ol.interaction.defaults ol.interaction.defaults()} is used.
 * @type {ol.Collection|Array.<ol.interaction.Interaction>|undefined}
 */
olx.MapOptions.prototype.interactions;


/**
 * The element to listen to keyboard events on. This determines when the
 * `KeyboardPan` and `KeyboardZoom` interactions trigger. For example, if this
 * option is set to `document` the keyboard interactions will always trigger. If
 * this option is not specified, the element the library listens to keyboard
 * events on is the map target (i.e. the user-provided div for the map). If this
 * is not `document` the target element needs to be focused for key events to be
 * emitted, requiring that the target element has a `tabindex` attribute.
 * @type {Element|Document|string|undefined}
 */
olx.MapOptions.prototype.keyboardEventTarget;


/**
 * Layers. If this is not defined, a map with no layers will be rendered.
 * @type {Array.<ol.layer.Base>|ol.Collection|undefined}
 */
olx.MapOptions.prototype.layers;


/**
 * The map logo. A logo to be displayed on the map at all times. If a string is
 * provided, it will be set as the image source of the logo. If an object is
 * provided, the `src` property should be the URL for an image and the `href`
 * property should be a URL for creating a link. To disable the map logo, set
 * the option to `false`. By default, the OpenLayers 3 logo is shown.
 * @type {boolean|string|olx.LogoOptions|undefined}
 */
olx.MapOptions.prototype.logo;


/**
 * Overlays initially added to the map. By default, no overlays are added.
 * @type {ol.Collection|Array.<ol.Overlay>|undefined}
 */
olx.MapOptions.prototype.overlays;


/**
 * Renderer. By default, Canvas, DOM and WebGL renderers are tested for support
 * in that order, and the first supported used. Specify a
 * {@link ol.RendererType} here to use a specific renderer.
 * Note that at present only the Canvas renderer supports vector data.
 * @type {ol.RendererType|Array.<ol.RendererType|string>|string|undefined}
 */
olx.MapOptions.prototype.renderer;


/**
 * The container for the map, either the element itself or the `id` of the
 * element. If not specified at construction time, {@link ol.Map#setTarget}
 * must be called for the map to be rendered.
 * @type {Element|string|undefined}
 */
olx.MapOptions.prototype.target;


/**
 * The map's view.  No layer sources will be fetched unless this is specified at
 * construction time or through {@link ol.Map#setView}.
 * @type {ol.View|undefined}
 */
olx.MapOptions.prototype.view;


/**
 * Object literal with config options for the overlay.
 * @typedef {{element: (Element|undefined),
 *     offset: (Array.<number>|undefined),
 *     position: (ol.Coordinate|undefined),
 *     positioning: (ol.OverlayPositioning|string|undefined),
 *     stopEvent: (boolean|undefined),
 *     insertFirst: (boolean|undefined)}}
 * @api
 */
olx.OverlayOptions;


/**
 * The overlay element.
 * @type {Element|undefined}
 */
olx.OverlayOptions.prototype.element;


/**
 * Offsets in pixels used when positioning the overlay. The fist element in the
 * array is the horizontal offset. A positive value shifts the overlay right.
 * The second element in the array is the vertical offset. A positive value
 * shifts the overlay down. Default is `[0, 0]`.
 * @type {Array.<number>|undefined}
 */
olx.OverlayOptions.prototype.offset;


/**
 * The overlay position in map projection.
 * @type {ol.Coordinate|undefined}
 */
olx.OverlayOptions.prototype.position;


/**
 * Defines how the overlay is actually positioned with respect to its `position`
 * property. Possible values are `'bottom-left'`, `'bottom-center'`,
 * `'bottom-right'`, `'center-left'`, `'center-center'`, `'center-right'`,
 * `'top-left'`, `'top-center'`, and `'top-right'`. Default is `'top-left'`.
 * @type {ol.OverlayPositioning|string|undefined}
 */
olx.OverlayOptions.prototype.positioning;


/**
 * Whether event propagation to the map viewport should be stopped. Default is
 * `true`. If `true` the overlay is placed in the same container as that of the
 * controls (CSS class name `ol-overlaycontainer-stopevent`); if `false` it is
 * placed in the container with CSS class name `ol-overlaycontainer`.
 * @type {boolean|undefined}
 */
olx.OverlayOptions.prototype.stopEvent;


/**
 * Whether the overlay is inserted first in the overlay container, or appended.
 * Default is `true`. If the overlay is placed in the same container as that of
 * the controls (see the `stopEvent` option) you will probably set `insertFirst`
 * to `true` so the overlay is displayed below the controls.
 * @type {boolean|undefined}
 */
olx.OverlayOptions.prototype.insertFirst;


/**
 * Object literal with config options for the projection.
 * @typedef {{code: string,
 *     units: (ol.proj.Units|string),
 *     extent: (ol.Extent|undefined),
 *     axisOrientation: (string|undefined),
 *     global: (boolean|undefined),
 *     worldExtent: (ol.Extent|undefined)}}
 * @api
 */
olx.ProjectionOptions;


/**
 * The SRS identifier code, e.g. `EPSG:4326`.
 * @type {string}
 */
olx.ProjectionOptions.prototype.code;


/**
 * Units.
 * @type {ol.proj.Units|string}
 */
olx.ProjectionOptions.prototype.units;


/**
 * The validity extent for the SRS.
 * @type {ol.Extent|undefined}
 */
olx.ProjectionOptions.prototype.extent;


/**
 * The axis orientation as specified in Proj4. The default is `enu`.
 * @type {string|undefined}
 */
olx.ProjectionOptions.prototype.axisOrientation;


/**
 * Whether the projection is valid for the whole globe. Default is `false`.
 * @type {boolean|undefined}
 */
olx.ProjectionOptions.prototype.global;


/**
 * The world extent for the SRS.
 * @type {ol.Extent|undefined}
 */
olx.ProjectionOptions.prototype.worldExtent;


/**
 * Object literal with config options for the view.
 * @typedef {{center: (ol.Coordinate|undefined),
 *     constrainRotation: (boolean|number|undefined),
 *     enableRotation: (boolean|undefined),
 *     extent: (ol.Extent|undefined),
 *     minResolution: (number|undefined),
 *     maxResolution: (number|undefined),
 *     minZoom: (number|undefined),
 *     maxZoom: (number|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     resolution: (number|undefined),
 *     resolutions: (Array.<number>|undefined),
 *     rotation: (number|undefined),
 *     zoom: (number|undefined),
 *     zoomFactor: (number|undefined)}}
 * @api
 */
olx.ViewOptions;


/**
 * The initial center for the view. The coordinate system for the center is
 * specified with the `projection` option. Default is `undefined`, and layer
 * sources will not be fetched if this is not set.
 * @type {ol.Coordinate|undefined}
 */
olx.ViewOptions.prototype.center;


/**
 * Rotation constraint. `false` means no constraint. `true` means no constraint,
 * but snap to zero near zero. A number constraints the rotation to that number
 * of values. For example, `4` will constrain the rotation to 0, 90, 180, and
 * 270 degrees. The default is `true`.
 * @type {boolean|number|undefined}
 */
olx.ViewOptions.prototype.constrainRotation;


/**
 * Enable rotation. Default is `true`.
 * @type {boolean|undefined}
 */
olx.ViewOptions.prototype.enableRotation;


/**
 * The extent that constrains the center, in other words, center cannot be set
 * outside this extent. Default is `undefined`.
 * @type {ol.Extent|undefined}
 */
olx.ViewOptions.prototype.extent;


/**
 * The maximum resolution used to determine the resolution constraint. It is
 * used together with `minResolution` (or `maxZoom`) and `zoomFactor`. If
 * unspecified it is calculated in such a way that the projection's validity
 * extent fits in a 256x256 px tile. If the projection is Spherical Mercator
 * (the default) then `maxResolution` defaults to `40075016.68557849 / 256 =
 * 156543.03392804097`.
 * @type {number|undefined}
 */
olx.ViewOptions.prototype.maxResolution;


/**
 * The minimum resolution used to determine the resolution constraint.  It is
 * used together with `maxResolution` (or `minZoom`) and `zoomFactor`.  If
 * unspecified it is calculated assuming 29 zoom levels (with a factor of 2).
 * If the projection is Spherical Mercator (the default) then `minResolution`
 * defaults to `40075016.68557849 / 256 / Math.pow(2, 28) =
 * 0.0005831682455839253`.
 * @type {number|undefined}
 */
olx.ViewOptions.prototype.minResolution;


/**
 * The maximum zoom level used to determine the resolution constraint. It is
 * used together with `minZoom` (or `maxResolution`) and `zoomFactor`. Default
 * is `28`.  Note that if `minResolution` is also provided, it is given
 * precedence over `maxZoom`.
 * @type {number|undefined}
 */
olx.ViewOptions.prototype.maxZoom;


/**
 * The minimum zoom level used to determine the resolution constraint. It is
 * used together with `maxZoom` (or `minResolution`) and `zoomFactor`. Default
 * is `0`. Note that if `maxResolution` is also provided, it is given
 * precedence over `minZoom`.
 * @type {number|undefined}
 */
olx.ViewOptions.prototype.minZoom;


/**
 * The projection. Default is `EPSG:3857` (Spherical Mercator).
 * @type {ol.proj.ProjectionLike}
 */
olx.ViewOptions.prototype.projection;


/**
 * The initial resolution for the view. The units are `projection` units per
 * pixel (e.g. meters per pixel). An alternative to setting this is to set
 * `zoom`. Default is `undefined`, and layer sources will not be fetched if
 * neither this nor `zoom` are defined.
 * @type {number|undefined}
 */
olx.ViewOptions.prototype.resolution;


/**
 * Resolutions to determine the resolution constraint. If set the
 * `maxResolution`, `minResolution`, `minZoom`, `maxZoom`, and `zoomFactor`
 * options are ignored.
 * @type {Array.<number>|undefined}
 */
olx.ViewOptions.prototype.resolutions;


/**
 * The initial rotation for the view in radians (positive rotation clockwise).
 * Default is `0`.
 * @type {number|undefined}
 */
olx.ViewOptions.prototype.rotation;


/**
 * Only used if `resolution` is not defined. Zoom level used to calculate the
 * initial resolution for the view. The initial resolution is determined using
 * the `ol.View#constrainResolution` method.
 * @type {number|undefined}
 */
olx.ViewOptions.prototype.zoom;


/**
 * The zoom factor used to determine the resolution constraint.  Default is `2`.
 * @type {number|undefined}
 */
olx.ViewOptions.prototype.zoomFactor;


/**
 * @typedef {{resolution: number,
 *     start: (number|undefined),
 *     duration: (number|undefined),
 *     easing: (function(number):number|undefined)}}
 * @api
 */
olx.animation.BounceOptions;


/**
 * The resolution to start the bounce from, typically
 * `map.getView().getResolution()`.
 * @type {number}
 */
olx.animation.BounceOptions.prototype.resolution;


/**
 * The start time of the animation. Default is immediately.
 * @type {number|undefined}
 */
olx.animation.BounceOptions.prototype.start;


/**
 * The duration of the animation in milliseconds. Default is `1000`.
 * @type {number|undefined}
 */
olx.animation.BounceOptions.prototype.duration;


/**
 * The easing function to use. Can be an {@link ol.easing} or a custom function.
 * Default is {@link ol.easing.upAndDown}.
 * @type {function(number):number|undefined}
 */
olx.animation.BounceOptions.prototype.easing;


/**
 * @typedef {{source: ol.Coordinate,
 *     start: (number|undefined),
 *     duration: (number|undefined),
 *     easing: (function(number):number|undefined)}}
 * @api
 */
olx.animation.PanOptions;


/**
 * The location to start panning from, typically `map.getView().getCenter()`.
 * @type {ol.Coordinate}
 */
olx.animation.PanOptions.prototype.source;


/**
 * The start time of the animation. Default is immediately.
 * @type {number|undefined}
 */
olx.animation.PanOptions.prototype.start;


/**
 * The duration of the animation in milliseconds. Default is `1000`.
 * @type {number|undefined}
 */
olx.animation.PanOptions.prototype.duration;


/**
 * The easing function to use. Can be an {@link ol.easing} or a custom function.
 * Default is {@link ol.easing.inAndOut}.
 * @type {function(number):number|undefined}
 */
olx.animation.PanOptions.prototype.easing;


/**
 * @typedef {{rotation: (number|undefined),
 *     anchor: (ol.Coordinate|undefined),
 *     start: (number|undefined),
 *     duration: (number|undefined),
 *     easing: (function(number):number|undefined)}}
 * @api
 */
olx.animation.RotateOptions;


/**
 * The rotation value (in radians) to begin rotating from, typically
 * `map.getView().getRotation()`. If `undefined` then `0` is assumed.
 * @type {number|undefined}
 */
olx.animation.RotateOptions.prototype.rotation;


/**
 * The rotation center/anchor. The map rotates around the center of the view
 * if unspecified.
 * @type {ol.Coordinate|undefined}
 */
olx.animation.RotateOptions.prototype.anchor;


/**
 * The start time of the animation. Default is immediately.
 * @type {number|undefined}
 */
olx.animation.RotateOptions.prototype.start;


/**
 * The duration of the animation in milliseconds. Default is `1000`.
 * @type {number|undefined}
 */
olx.animation.RotateOptions.prototype.duration;


/**
 * The easing function to use. Can be an {@link ol.easing} or a custom function.
 * Default is {@link ol.easing.inAndOut}.
 * @type {function(number):number|undefined}
 */
olx.animation.RotateOptions.prototype.easing;


/**
 * @typedef {{resolution: number,
 *     start: (number|undefined),
 *     duration: (number|undefined),
 *     easing: (function(number):number|undefined)}}
 * @api
 */
olx.animation.ZoomOptions;


/**
 * number The resolution to begin zooming from, typically
 * `map.getView().getResolution()`.
 * @type {number}
 */
olx.animation.ZoomOptions.prototype.resolution;


/**
 * The start time of the animation. Default is immediately.
 * @type {number|undefined}
 */
olx.animation.ZoomOptions.prototype.start;


/**
 * The duration of the animation in milliseconds. Default is `1000`.
 * @type {number|undefined}
 */
olx.animation.ZoomOptions.prototype.duration;


/**
 * The easing function to use. Can be an {@link ol.easing} or a custom function.
 * Default is {@link ol.easing.inAndOut}.
 * @type {function(number):number|undefined}
 */
olx.animation.ZoomOptions.prototype.easing;


/**
 * @typedef {{className: (string|undefined),
 *     target: (Element|undefined)}}
 * @api
 */
olx.control.AttributionOptions;


/**
 * CSS class name. Default is `ol-attribution`.
 * @type {string|undefined}
 */
olx.control.AttributionOptions.prototype.className;


/**
 * Target.
 * @type {Element|undefined}
 */
olx.control.AttributionOptions.prototype.target;


/**
 * Specify if attributions can be collapsed. If you use an OSM source,
 * should be set to `false` — see
 * {@link http://www.openstreetmap.org/copyright OSM Copyright} —
 * Default is `true`.
 * @type {boolean|undefined}
 */
olx.control.AttributionOptions.prototype.collapsible;


/**
 * Specify if attributions should be collapsed at startup. Default is `true`.
 * @type {boolean|undefined}
 */
olx.control.AttributionOptions.prototype.collapsed;


/**
 * Text label to use for the button tip. Default is `Attributions`
 * @type {string|undefined}
 */
olx.control.AttributionOptions.prototype.tipLabel;


/**
 * Text label to use for the collapsed attributions button. Default is `i`
 * @type {string|undefined}
 */
olx.control.AttributionOptions.prototype.label;

/**
 * Text label to use for the expanded attributions button. Default is `»`
 * @type {string|undefined}
 */
olx.control.AttributionOptions.prototype.collapseLabel;

/**
 * @typedef {{element: (Element|undefined),
 *     target: (Element|string|undefined)}}
 * @api
 */
olx.control.ControlOptions;


/**
 * The element is the control's container element. This only needs to be
 * specified if you're developing a custom control.
 * @type {Element|undefined}
 */
olx.control.ControlOptions.prototype.element;


/**
 * Specify a target if you want the control to be rendered outside of the map's
 * viewport.
 * @type {Element|string|undefined}
 */
olx.control.ControlOptions.prototype.target;


/**
 * @typedef {{attribution: (boolean|undefined),
 *     attributionOptions: (olx.control.AttributionOptions|undefined),
 *     zoom: (boolean|undefined),
 *     rotateOptions: (olx.control.RotateOptions|undefined),
 *     zoomOptions: (olx.control.ZoomOptions|undefined)}}
 * @api
 */
olx.control.DefaultsOptions;


/**
 * Attribution. Default is `true`.
 * @type {boolean|undefined}
 */
olx.control.DefaultsOptions.prototype.attribution;


/**
 * Attribution options.
 * @type {olx.control.AttributionOptions|undefined}
 */
olx.control.DefaultsOptions.prototype.attributionOptions;


/**
 * Rotate. Default is `true`.
 * @type {boolean|undefined}
 */
olx.control.DefaultsOptions.prototype.rotate;


/**
 * Rotate options.
 * @type {olx.control.RotateOptions|undefined}
 */
olx.control.DefaultsOptions.prototype.rotateOptions;


/**
 * Zoom. Default is `true`.
 * @type {boolean|undefined}
 */
olx.control.DefaultsOptions.prototype.zoom;


/**
 * Zoom options.
 * @type {olx.control.ZoomOptions|undefined}
 */
olx.control.DefaultsOptions.prototype.zoomOptions;


/**
 * @typedef {{className: (string|undefined),
 *     tipLabel: (string|undefined),
 *     keys: (boolean|undefined),
 *     target: (Element|undefined)}}
 * @api
 */
olx.control.FullScreenOptions;


/**
 * CSS class name. Default is `ol-full-screen`.
 * @type {string|undefined}
 */
olx.control.FullScreenOptions.prototype.className;


/**
 * Text label to use for the button tip. Default is `Toggle full-screen`
 * @type {string|undefined}
 */
olx.control.FullScreenOptions.prototype.tipLabel;


/**
 * Full keyboard access.
 * @type {boolean|undefined}
 */
olx.control.FullScreenOptions.prototype.keys;


/**
 * Target.
 * @type {Element|undefined}
 */
olx.control.FullScreenOptions.prototype.target;


/**
 * @typedef {{addresses: (Object),
 *     addressesTarget: (Element),
 *     currentPositionControl: (ol.control.GoogleMapsCurrentPosition),
 *     enableCurrentPosition: (boolean),
 *     failCallback: (Function),
 *     geocoderComponentRestrictions: (Object),
 *     getURL: (string|undefined),
 *     iconStyle : (ol.style.Style),
 *     saveHeaders: (Object),
 *     saveURL: (string|undefined),
 *     successCallback: (Function),
 *     target: (Element|undefined),
 *     addButtonText: (?string|undefined),
 *     clearButtonText: (?string|undefined),
 *     removeButtonText: (?string|undefined),
 *     searchButtonText: (?string|undefined)}}
 * @todo stability experimental
 */
olx.control.GoogleMapsAddressesOptions;


/**
 * Adresses
 * @type {Object}
 */
olx.control.GoogleMapsAddressesOptions.prototype.addresses;


/**
 * Target for the addresses
 * @type {Element}
 */
olx.control.GoogleMapsAddressesOptions.prototype.addressesTarget;


/**
 * Current position control
 * @type {ol.control.GoogleMapsCurrentPosition}
 */
olx.control.GoogleMapsAddressesOptions.prototype.currentPositionControl;


/**
 * Whether to enable the current position control or not
 * @type {boolean}
 */
olx.control.GoogleMapsAddressesOptions.prototype.enableCurrentPosition;


/**
 * Method called on transaction failure
 * @type {Function}
 */
olx.control.GoogleMapsAddressesOptions.prototype.failCallback;


/**
 * Restrictions
 * @type {Object}
 */
olx.control.GoogleMapsAddressesOptions.prototype.geocoderComponentRestrictions;


/**
 * URL to get the addresses
 * @type {string|undefined}
 */
olx.control.GoogleMapsAddressesOptions.prototype.getURL;


/**
 * Style for the icons
 * @type {ol.style.Style}}
 */
olx.control.GoogleMapsAddressesOptions.prototype.iconStyle;


/**
 * Save headers
 * @type {Object}
 */
olx.control.GoogleMapsAddressesOptions.prototype.saveHeaders;


/**
 * URL to save the addresses
 * @type {string|undefined}
 */
olx.control.GoogleMapsAddressesOptions.prototype.saveURL;


/**
 * Method called on transaction success
 * @type {Function}
 */
olx.control.GoogleMapsAddressesOptions.prototype.successCallback;


/**
 * Target
 * @type {Element|undefined}
 */
olx.control.GoogleMapsAddressesOptions.prototype.target;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsAddressesOptions.prototype.addButtonText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsAddressesOptions.prototype.clearButtonText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsAddressesOptions.prototype.removeButtonText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsAddressesOptions.prototype.searchButtonText;



/**
 * @typedef {{currentPositionText: (?string|undefined)}}
 * @todo stability experimental
 */
olx.control.GoogleMapsCurrentPositionOptions;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsCurrentPositionOptions.prototype.currentPositionText;


/**
 * @typedef {{cornerPixelSize: (number|undefined),
 *     defaultTravelModes: (Array.<string>|undefined),
 *     detourIconStyle: (Array.<(null|ol.style.Style)>|null|ol.feature.FeatureStyleFunction|ol.style.Style),
 *     detourLabelProperty: (string|undefined),
 *     enableAutoRouting: (boolean|undefined),
 *     enableDetours: (boolean|undefined),
 *     geocoderComponentRestrictions: (Object|undefined),
 *     iconStyles: (Array.<ol.style.Style>),
 *     lineStyle: (Array.<(null|ol.style.Style)>|null|ol.feature.FeatureStyleFunction|ol.style.Style),
 *     maxWaypoints: (number|undefined),
 *     mode: (string|undefined),
 *     modifyPixelTolerance: (number|undefined),
 *     multimodalUrl: (string|undefined),
 *     directionsPanel: (ol.control.GoogleMapsDirectionsPanel),
 *     pixelBuffer: (number|undefined),
 *     routeDelayOnWaypointDrag: (number|undefined),
 *     target: (Element|undefined),
 *     addWaypointButtonText: (?string|undefined),
 *     bicyclingText: (string|undefined),
 *     carpoolingText: (string|undefined),
 *     clearButtonText: (?string|undefined),
 *     currentPositionText: (?string|undefined),
 *     drivingText: (string|undefined),
 *     removeButtonText: (?string|undefined),
 *     searchButtonText: (?string|undefined),
 *     transitText: (string|undefined),
 *     walkingText: (string|undefined)}}
 * @todo stability experimental
 */
olx.control.GoogleMapsDirectionsOptions;


/**
 * Size in pixels of the top-left, top-right, bottom-left and bottom-right
 * corners where a popup position should never be.  This should set
 * around half the size of the popup.
 * @type {number|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.cornerPixelSize;


/**
 * Travel modes that should be checked by default.  Values can be:
 * 'bicycling', 'carpooling', 'driving', 'transit', 'walking'.
 * @type {number|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.defaultTravelModes;


/**
 * Style used to symbolize the waypoint detour icons.
 * @type {Array.<(null|ol.style.Style)>|null|ol.feature.FeatureStyleFunction|ol.style.Style}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.detourIconStyle;


/**
 * Property name to use as label for detour features
 * @type {string|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.detourLabelProperty;


/**
 * Whether to automatically send routing request when the minimum
 * query parameters are set or not. Defaults to true.
 * @type {boolean|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.enableAutoRouting;


/**
 * Whether to enable detours or not. Defaults to false.
 * @type {boolean|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.enableDetours;


/**
 * Used to restrict results to a specific area
 * @type {Object|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.geocoderComponentRestrictions;


/**
 * Styles used to symbolize the geocoded locations
 * @type {Array.<ol.style.Style>}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.iconStyles;


/**
 * Style used to symbolize the route
 * @type {Array.<(null|ol.style.Style)>|null|ol.feature.FeatureStyleFunction|ol.style.Style}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.lineStyle;


/**
 * The maximum allowed waypoints.
 * @type {number|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.maxWaypoints;


/**
 * How this widget should behave when more than one travel mode is selected.
 * Possible values are:
 *  - 'single': only one travel mode will be used in the request. The one with
 *              the highest priority will be used
 *  - 'multiple': all travel modes will be used in the request.  Requires a
 *                multimodalUrl to be set to work properly.
 * @type {string|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.mode;


/**
 * Pixel tolerance for considering the pointer close enough to a vertex for
 * editing. Default is 8 pixels.
 * @type {number|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.modifyPixelTolerance;


/**
 * The alternate url to use in case of a request not supported by GoogleMaps,
 * for example a request using TRANSIT as travel mode in Saguenay, or a
 * multimodal request.
 * @type {string|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.multimodalUrl;


/**
 * Directions panel to be embded
 * @type {ol.control.GoogleMapsDirectionsPanel}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.directionsPanel;


/**
 * Buffer size in pixels to apply to the extent of the route or single
 * geolocation when recentering the map view to it.
 * @type {number|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.pixelBuffer;


/**
 * The number of milliseconds to wait before launching a route request that
 * includes waypoint that has been dragged, whether to add a new detour or to
 * modify an existing waypoint of any type.
 * @type {number|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.routeDelayOnWaypointDrag;


/**
 * Target
 * @type {Element|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.target;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.addWaypointButtonText;

/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.bicyclingText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.carpoolingText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.clearButtonText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.currentPositionText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.drivingText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.removeButtonText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.searchButtonText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.transitText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsDirectionsOptions.prototype.walkingText;


/**
 * @typedef {{pixelBuffer: (number|undefined),
 *     target: (Element|undefined),
 *     aroundText: (?string|undefined),
 *     copyrightText: (?string|undefined),
 *     suggestedRoutesText: (?string|undefined),
 *     totalDistanceText: (?string|undefined)}}
 * @todo stability experimental
 */
olx.control.GoogleMapsDirectionsPanelOptions;


/**
 * Buffer size in pixels to apply to the map view extent when checking if
 * a coordinate is in the extent.
 * @type {number|undefined}
 */
olx.control.GoogleMapsDirectionsPanelOptions.prototype.pixelBuffer;


/**
 * Target
 * @type {Element|undefined}
 */
olx.control.GoogleMapsDirectionsPanelOptions.prototype.target;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsDirectionsPanelOptions.prototype.aroundText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsDirectionsPanelOptions.prototype.copyrightText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsDirectionsPanelOptions.prototype.suggestedRoutesText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsDirectionsPanelOptions.prototype.totalDistanceText;


/**
 * @typedef {{currentPositionControl: (ol.control.GoogleMapsCurrentPosition),
 *     enableCurrentPosition: (boolean),
 *     enableReverseGeocoding: (boolean|undefined),
 *     geocoderComponentRestrictions: (Object|undefined),
 *     iconStyle: (ol.style.Style),
 *     removable: (boolean|undefined),
 *     target: (Element|undefined),
 *     clearButtonText: (?string|undefined),
 *     searchButtonText: (?string|undefined),
 *     removeButtonText: (?string|undefined)}}
 * @todo stability experimental
 */
olx.control.GoogleMapsGeocoderOptions;


/**
 * Current position control to set
 * @type {ol.control.GoogleMapsCurrentPosition}
 */
olx.control.GoogleMapsGeocoderOptions.prototype.currentPositionControl;


/**
 * Whether to enable current position or not.
 * @type {boolean}
 */
olx.control.GoogleMapsGeocoderOptions.prototype.enableCurrentPosition;


/**
 * Whether to activate the reverse geocoding, i.e. click on the map to get
 * an address.
 * @type {boolean|undefined}
 */
olx.control.GoogleMapsGeocoderOptions.prototype.enableReverseGeocoding;


/**
 * Used to restrict results to a specific area
 * @type {Object|undefined}
 */
olx.control.GoogleMapsGeocoderOptions.prototype.geocoderComponentRestrictions;


/**
 * Styled used to symbolize the geocoded location found, generally one
 * with an icon image.
 * @type {ol.style.Style}
 */
olx.control.GoogleMapsGeocoderOptions.prototype.iconStyle;


/**
 * Whether the control should show a remove button or not.
 * @type {boolean|undefined}
 */
olx.control.GoogleMapsGeocoderOptions.prototype.removable;


/**
 * Target
 * @type {Element|undefined}
 */
olx.control.GoogleMapsGeocoderOptions.prototype.target;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsGeocoderOptions.prototype.clearButtonText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsGeocoderOptions.prototype.searchButtonText;


/**
 * i18n
 * @type {?string|undefined}
 */
olx.control.GoogleMapsGeocoderOptions.prototype.removeButtonText;


/**
 * @typedef {{className: (string|undefined),
 *     target: (Element|undefined)}}
 * @todo stability experimental
 */
olx.control.LogoOptions;


/**
 * CSS class name. Default is `ol-logo`.
 * @type {string|undefined}
 */
olx.control.LogoOptions.prototype.className;


/**
 * Target.
 * @type {Element|undefined}
 */
olx.control.LogoOptions.prototype.target;


/**
 * @typedef {{className: (string|undefined),
 *     coordinateFormat: (ol.CoordinateFormatType|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     target: (Element|undefined),
 *     undefinedHTML: (string|undefined)}}
 * @api
 */
olx.control.MousePositionOptions;


/**
 * CSS class name. Default is `ol-mouse-position`.
 * @type {string|undefined}
 */
olx.control.MousePositionOptions.prototype.className;


/**
 * Coordinate format.
 * @type {ol.CoordinateFormatType|undefined}
 */
olx.control.MousePositionOptions.prototype.coordinateFormat;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.control.MousePositionOptions.prototype.projection;


/**
 * Target.
 * @type {Element|undefined}
 */
olx.control.MousePositionOptions.prototype.target;


/**
 * Markup for undefined coordinates. Default is `` (empty string).
 * @type {string|undefined}
 */
olx.control.MousePositionOptions.prototype.undefinedHTML;


/**
 * @typedef {{className: (string|undefined),
 *     minWidth: (number|undefined),
 *     target: (Element|undefined),
 *     units: (ol.control.ScaleLineUnits|string|undefined)}}
 * @api
 */
olx.control.ScaleLineOptions;


/**
 * CSS Class name. Default is `ol-scale-line`.
 * @type {string|undefined}
 */
olx.control.ScaleLineOptions.prototype.className;


/**
 * Minimum width in pixels. Default is `64`.
 * @type {number|undefined}
 */
olx.control.ScaleLineOptions.prototype.minWidth;


/**
 * Target.
 * @type {Element|undefined}
 */
olx.control.ScaleLineOptions.prototype.target;


/**
 * Units. Default is `metric`.
 * @type {ol.control.ScaleLineUnits|string|undefined}
 */
olx.control.ScaleLineOptions.prototype.units;


/**
 * @typedef {{duration: (number|undefined),
 *     className: (string|undefined),
 *     label: (string|undefined),
 *     tipLabel: (string|undefined),
 *     target: (Element|undefined),
 *     autoHide: (boolean|undefined)}}
 * @api
 */
olx.control.RotateOptions;


/**
 * CSS class name. Default is `ol-rotate`.
 * @type {string|undefined}
 */
olx.control.RotateOptions.prototype.className;


/**
 * Text label to use for the rotate button. Default is `⇧`
 * @type {string|undefined}
 */
olx.control.RotateOptions.prototype.label;


/**
 * Text label to use for the rotate tip. Default is `Reset rotation`
 * @type {string|undefined}
 */
olx.control.RotateOptions.prototype.tipLabel;


/**
 * Animation duration in milliseconds. Default is `250`.
 * @type {number|undefined}
 */
olx.control.RotateOptions.prototype.duration;


/**
 * Hide the control when rotation is 0. Default is `true`.
 * @type {boolean|undefined}
 */
olx.control.RotateOptions.prototype.autoHide;


/**
 * Target.
 * @type {Element|undefined}
 */
olx.control.RotateOptions.prototype.target;


/**
 * @typedef {{duration: (number|undefined),
 *     className: (string|undefined),
 *     zoomInLabel: (string|undefined),
 *     zoomOutLabel: (string|undefined),
 *     zoomInTipLabel: (string|undefined),
 *     zoomOutTipLabel: (string|undefined),
 *     delta: (number|undefined),
 *     target: (Element|undefined)}}
 * @api
 */
olx.control.ZoomOptions;


/**
 * Animation duration in milliseconds. Default is `250`.
 * @type {number|undefined}
 */
olx.control.ZoomOptions.prototype.duration;


/**
 * CSS class name. Default is `ol-zoom`.
 * @type {string|undefined}
 */
olx.control.ZoomOptions.prototype.className;


/**
 * Text label to use for the zoom-in button. Default is `+`
 * @type {string|undefined}
 */
olx.control.ZoomOptions.prototype.zoomInLabel;


/**
 * Text label to use for the zoom-out button. Default is `-`
 * @type {string|undefined}
 */
olx.control.ZoomOptions.prototype.zoomOutLabel;


/**
 * Text label to use for the button tip. Default is `Zoom in`
 * @type {string|undefined}
 */
olx.control.ZoomOptions.prototype.zoomInTipLabel;


/**
 * Text label to use for the button tip. Default is `Zoom out`
 * @type {string|undefined}
 */
olx.control.ZoomOptions.prototype.zoomOutTipLabel;


/**
 * The zoom delta applied on each click.
 * @type {number|undefined}
 */
olx.control.ZoomOptions.prototype.delta;


/**
 * Target.
 * @type {Element|undefined}
 */
olx.control.ZoomOptions.prototype.target;


/**
 * @typedef {{className: (string|undefined),
 *     maxResolution: (number|undefined),
 *     minResolution: (number|undefined)}}
 * @api
 */
olx.control.ZoomSliderOptions;


/**
 * CSS class name.
 * @type {string|undefined}
 */
olx.control.ZoomSliderOptions.prototype.className;


/**
 * Maximum resolution.
 * @type {number|undefined}
 */
olx.control.ZoomSliderOptions.prototype.maxResolution;


/**
 * Minimum resolution.
 * @type {number|undefined}
 */
olx.control.ZoomSliderOptions.prototype.minResolution;


/**
 * @typedef {{className: (string|undefined),
 *     target: (Element|undefined),
 *     tipLabel: (string|undefined),
 *     extent: (ol.Extent|undefined)}}
 * @api
 */
olx.control.ZoomToExtentOptions;


/**
 * Class name. Default is `ol-zoom-extent`.
 * @type {string|undefined}
 */
olx.control.ZoomToExtentOptions.prototype.className;


/**
 * Target.
 * @type {Element|undefined}
 */
olx.control.ZoomToExtentOptions.prototype.target;


/**
 * Text label to use for the button tip. Default is `Zoom to extent`
 * @type {string|undefined}
 */
olx.control.ZoomToExtentOptions.prototype.tipLabel;


/**
 * The extent to zoom to. If undefined the validity extent of the view
 * projection is used.
 * @type {ol.Extent|undefined}
 */
olx.control.ZoomToExtentOptions.prototype.extent;


/**
 * @typedef {{defaultProjection: ol.proj.ProjectionLike,
 *     geometryName: (string|undefined)}}
 * @api
 */
olx.format.GeoJSONOptions;


/**
 * Default projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.format.GeoJSONOptions.prototype.defaultProjection;


/**
 * Geometry name to use when creating features.
 * @type {string|undefined}
 */
olx.format.GeoJSONOptions.prototype.geometryName;


/**
 * @typedef {{factor: (number|undefined)}}
 * @api
 */
olx.format.PolylineOptions;


/**
 * The factor by which the coordinates values will be scaled.
 * Default is `1e5`.
 */
olx.format.PolylineOptions.prototype.factor;



/**
 * @typedef {{defaultProjection: ol.proj.ProjectionLike}}
 * @api
 */
olx.format.TopoJSONOptions;


/**
 * Default projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.format.TopoJSONOptions.prototype.defaultProjection;


/**
 * @typedef {{altitudeMode: (ol.format.IGCZ|undefined)}}
 * @api
 */
olx.format.IGCOptions;


/**
 * Altitude mode. Possible values are `barometric`, `gps`, and `none`. Default
 * is `none`.
 * @type {ol.format.IGCZ|undefined}
 */
olx.format.IGCOptions.prototype.altitudeMode;


/**
 * @typedef {{defaultStyle: (Array.<ol.style.Style>|undefined)}}
 * @api
 */
olx.format.KMLOptions;


/**
 * Default style. The default default style is the same as Google Earth.
 * @type {Array.<ol.style.Style>|undefined}
 */
olx.format.KMLOptions.prototype.defaultStyle;


/**
 * @typedef {{featureNS: string,
 *     featureType: string,
 *     srsName: string,
 *     surface: (boolean|undefined),
 *     curve: (boolean|undefined),
 *     multiCurve: (boolean|undefined),
 *     multiSurface: (boolean|undefined),
 *     schemaLocation: (string|undefined)}}
 * @api
 */
olx.format.GMLOptions;


/**
 * Feature namespace.
 * @type {string}
 */
olx.format.GMLOptions.prototype.featureNS;


/**
 * Feature type to parse.
 * @type {string}
 */
olx.format.GMLOptions.prototype.featureType;


/**
 * srsName to use when writing geometries.
 * @type {string}
 */
olx.format.GMLOptions.prototype.srsName;


/**
 * Write gml:Surface instead of gml:Polygon elements. This also affects the
 * elements in multi-part geometries. Default is `false`.
 * @type {boolean|undefined}
 */
olx.format.GMLOptions.prototype.surface;


/**
 * Write gml:Curve instead of gml:LineString elements. This also affects the
 * elements in multi-part geometries. Default is `false`.
 * @type {boolean|undefined}
 */
olx.format.GMLOptions.prototype.curve;


/**
 * Write gml:MultiCurve instead of gml:MultiLineString. Since the latter is
 * deprecated in GML 3, the default is `true`.
 * @type {boolean|undefined}
 */
olx.format.GMLOptions.prototype.multiCurve;


/**
 * Write gml:multiSurface instead of gml:MultiPolygon. Since the latter is
 * deprecated in GML 3, the default is `true`.
 * @type {boolean|undefined}
 */
olx.format.GMLOptions.prototype.multiSurface;


/**
 * Optional schemaLocation to use when writing out the GML, this will override
 * the default provided.
 * @type {string|undefined}
 */
olx.format.GMLOptions.prototype.schemaLocation;


/**
 * @typedef {{readExtensions: (function(ol.Feature, Node)|undefined)}}
 * @api
 */
olx.format.GPXOptions;


/**
 * Callback function to process `extensions` nodes.
 * To prevent memory leaks, this callback function must
 * not store any references to the node. Note that the `extensions`
 * node is not allowed in GPX 1.0. Moreover, only `extensions`
 * nodes from `wpt`, `rte` and `trk` can be processed, as those are
 * directly mapped to a feature.
 * @type {function(ol.Feature, Node)}
 */
olx.format.GPXOptions.prototype.readExtensions;


/**
 * @typedef {{featureNS: string,
 *     featureType: string,
 *     schemaLocation: (string|undefined)}}
 * @api
 */
olx.format.WFSOptions;


/**
 * The namespace URI used for features.
 * @type {string}
 */
olx.format.WFSOptions.prototype.featureNS;


/**
 * The feature type to parse. Only used for read operations.
 * @type {string}
 */
olx.format.WFSOptions.prototype.featureType;


/**
 * Optional schemaLocation to use for serialization, this will override the
 * default.
 * @type {string|undefined}
 */
olx.format.WFSOptions.prototype.schemaLocation;


/**
 * @typedef {{featureNS: string,
 *     featurePrefix: string,
 *     featureTypes: Array.<string>,
 *     srsName: (string|undefined),
 *     handle: (string|undefined),
 *     outputFormat: (string|undefined),
 *     maxFeatures: (number|undefined),
 *     geometryName: (string|undefined),
 *     bbox: (ol.Extent|undefined)}}
 * @api
 */
olx.format.WFSWriteGetFeatureOptions;


/**
 * The namespace URI used for features.
 * @type {string}
 */
olx.format.WFSWriteGetFeatureOptions.prototype.featureNS;


/**
 * The prefix for the feature namespace.
 * @type {string}
 */
olx.format.WFSWriteGetFeatureOptions.prototype.featurePrefix;


/**
 * The feature type names.
 * @type {Array.<string>}
 */
olx.format.WFSWriteGetFeatureOptions.prototype.featureTypes;


/**
 * SRS name. No srsName attribute will be set on geometries when this is not
 * provided.
 * @type {string|undefined}
 */
olx.format.WFSWriteGetFeatureOptions.prototype.srsName;


/**
 * Handle.
 * @type {string|undefined}
 */
olx.format.WFSWriteGetFeatureOptions.prototype.handle;


/**
 * Output format.
 * @type {string|undefined}
 */
olx.format.WFSWriteGetFeatureOptions.prototype.outputFormat;


/**
 * Maximum number of features to fetch.
 * @type {number|undefined}
 */
olx.format.WFSWriteGetFeatureOptions.prototype.maxFeatures;


/**
 * Geometry name to use in a BBOX filter.
 * @type {string|undefined}
 */
olx.format.WFSWriteGetFeatureOptions.prototype.geometryName;


/**
 * Extent to use for the BBOX filter.
 * @type {ol.Extent|undefined}
 */
olx.format.WFSWriteGetFeatureOptions.prototype.bbox;


/**
 * @typedef {{featureNS: string,
 *     featurePrefix: string,
 *     featureType: string,
 *     srsName: (string|undefined),
 *     handle: (string|undefined),
 *     nativeElements: Array.<Object>,
 *     gmlOptions: (olx.format.GMLOptions|undefined)}}
 * @api
 */
olx.format.WFSWriteTransactionOptions;


/**
 * The namespace URI used for features.
 * @type {string}
 */
olx.format.WFSWriteTransactionOptions.prototype.featureNS;


/**
 * The prefix for the feature namespace.
 * @type {string}
 */
olx.format.WFSWriteTransactionOptions.prototype.featurePrefix;


/**
 * The feature type name.
 * @type {string}
 */
olx.format.WFSWriteTransactionOptions.prototype.featureType;


/**
 * SRS name. No srsName attribute will be set on geometries when this is not
 * provided.
 * @type {string|undefined}
 */
olx.format.WFSWriteTransactionOptions.prototype.srsName;


/**
 * Handle.
 * @type {string|undefined}
 */
olx.format.WFSWriteTransactionOptions.prototype.handle;


/**
 * Native elements. Currently not supported.
 * @type {Array.<Object>}
 */
olx.format.WFSWriteTransactionOptions.prototype.nativeElements;


/**
 * GML options for the WFS transaction writer.
 * @type {olx.format.GMLOptions|undefined}
 */
olx.format.WFSWriteTransactionOptions.prototype.gmlOptions;


/**
 * @typedef {{splitCollection: (boolean|undefined)}}
 * @api
 */
olx.format.WKTOptions;


/**
 * Whether to split GeometryCollections into
 * multiple features on reading. Default is `false`.
 * @type {boolean|undefined}
 */
olx.format.WKTOptions.prototype.splitCollection;


/**
 * Interactions for the map. Default is `true` for all options.
 * @typedef {{altShiftDragRotate: (boolean|undefined),
 *     doubleClickZoom: (boolean|undefined),
 *     keyboard: (boolean|undefined),
 *     mouseWheelZoom: (boolean|undefined),
 *     shiftDragZoom: (boolean|undefined),
 *     dragPan: (boolean|undefined),
 *     pinchRotate: (boolean|undefined),
 *     pinchZoom: (boolean|undefined),
 *     zoomDelta: (number|undefined),
 *     zoomDuration: (number|undefined)}}
 * @api
 */
olx.interaction.DefaultsOptions;


/**
 * Whether Alt-Shift-drag rotate is desired. Default is `true`.
 * @type {boolean|undefined}
 */
olx.interaction.DefaultsOptions.prototype.altShiftDragRotate;


/**
 * Whether double click zoom is desired. Default is `true`.
 * @type {boolean|undefined}
 */
olx.interaction.DefaultsOptions.prototype.doubleClickZoom;


/**
 * Whether keyboard interaction is desired. Default is `true`.
 * @type {boolean|undefined}
 */
olx.interaction.DefaultsOptions.prototype.keyboard;


/**
 * Whether mousewheel zoom is desired. Default is `true`.
 * @type {boolean|undefined}
 */
olx.interaction.DefaultsOptions.prototype.mouseWheelZoom;


/**
 * Whether Shift-drag zoom is desired. Default is `true`.
 * @type {boolean|undefined}
 */
olx.interaction.DefaultsOptions.prototype.shiftDragZoom;


/**
 * Whether drag pan is desired. Default is `true`.
 * @type {boolean|undefined}
 */
olx.interaction.DefaultsOptions.prototype.dragPan;


/**
 * Whether pinch rotate is desired. Default is `true`.
 * @type {boolean|undefined}
 */
olx.interaction.DefaultsOptions.prototype.pinchRotate;


/**
 * Whether pinch zoom is desired. Default is `true`.
 * @type {boolean|undefined}
 */
olx.interaction.DefaultsOptions.prototype.pinchZoom;


/**
 * Zoom delta.
 * @type {number|undefined}
 */
olx.interaction.DefaultsOptions.prototype.zoomDelta;


/**
 * Zoom duration.
 * @type {number|undefined}
 */
olx.interaction.DefaultsOptions.prototype.zoomDuration;


/**
 * @typedef {{duration: (number|undefined),
 *     delta: (number|undefined)}}
 * @api
 */
olx.interaction.DoubleClickZoomOptions;


/**
 * Animation duration in milliseconds. Default is `250`.
 * @type {number|undefined}
 */
olx.interaction.DoubleClickZoomOptions.prototype.duration;


/**
 * The zoom delta applied on each double click, default is `1`.
 * @type {number|undefined}
 */
olx.interaction.DoubleClickZoomOptions.prototype.delta;


/**
 * @typedef {{formatConstructors: (Array.<function(new: ol.format.Feature)>|undefined),
 *     reprojectTo: ol.proj.ProjectionLike}}
 * @api
 */
olx.interaction.DragAndDropOptions;


/**
 * Format constructors.
 * @type {Array.<function(new: ol.format.Feature)>|undefined}
 */
olx.interaction.DragAndDropOptions.prototype.formatConstructors;


/**
 * Target projection. By default, the map's view's projection is used.
 * @type {ol.proj.ProjectionLike}
 */
olx.interaction.DragAndDropOptions.prototype.reprojectTo;


/**
 * @typedef {{condition: (ol.events.ConditionType|undefined),
 *     style: ol.style.Style}}
 * @api
 */
olx.interaction.DragBoxOptions;


/**
 * A function that takes an {@link ol.MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * Default is {@link ol.events.condition.always}.
 * @type {ol.events.ConditionType|undefined}
 */
olx.interaction.DragBoxOptions.prototype.condition;


/**
 * Style for the box.
 * @type {ol.style.Style}
 */
olx.interaction.DragBoxOptions.prototype.style;


/**
 * @typedef {{kinetic: (ol.Kinetic|undefined)}}
 * @api
 */
olx.interaction.DragPanOptions;


/**
 * Kinetic inertia to apply to the pan.
 * @type {ol.Kinetic|undefined}
 */
olx.interaction.DragPanOptions.prototype.kinetic;


/**
 * @typedef {{condition: (ol.events.ConditionType|undefined)}}
 * @api
 */
olx.interaction.DragRotateAndZoomOptions;


/**
 * A function that takes an {@link ol.MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * Default is {@link ol.events.condition.shiftKeyOnly}.
 * @type {ol.events.ConditionType|undefined}
 */
olx.interaction.DragRotateAndZoomOptions.prototype.condition;


/**
 * @typedef {{condition: (ol.events.ConditionType|undefined)}}
 * @api
 */
olx.interaction.DragRotateOptions;


/**
 * A function that takes an {@link ol.MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * Default is {@link ol.events.condition.altShiftKeysOnly}.
 * @type {ol.events.ConditionType|undefined}
 */
olx.interaction.DragRotateOptions.prototype.condition;


/**
 * @typedef {{condition: (ol.events.ConditionType|undefined),
 *     style: ol.style.Style}}
 * @api
 */
olx.interaction.DragZoomOptions;


/**
 * A function that takes an {@link ol.MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * Default is {@link ol.events.condition.shiftKeyOnly}.
 * @type {ol.events.ConditionType|undefined}
 */
olx.interaction.DragZoomOptions.prototype.condition;


/**
 * Style for the box.
 * @type {ol.style.Style}
 */
olx.interaction.DragZoomOptions.prototype.style;


/**
 * @typedef {{features: (ol.Collection|undefined),
 *     source: (ol.source.Vector|undefined),
 *     snapTolerance: (number|undefined),
 *     type: ol.geom.GeometryType,
 *     minPointsPerRing: (number|undefined),
 *     style: (ol.style.Style|Array.<ol.style.Style>|ol.style.StyleFunction|undefined),
 *     geometryName: (string|undefined),
 *     condition: (ol.events.ConditionType|undefined)}}
 * @api
 */
olx.interaction.DrawOptions;


/**
 * Destination collection for the drawn features.
 * @type {ol.Collection|undefined}
 */
olx.interaction.DrawOptions.prototype.features;


/**
 * Destination source for the drawn features.
 * @type {ol.source.Vector|undefined}
 */
olx.interaction.DrawOptions.prototype.source;


/**
 * Pixel distance for snapping to the drawing finish. Default is `12`.
 * @type {number|undefined}
 */
olx.interaction.DrawOptions.prototype.snapTolerance;


/**
 * Drawing type ('Point', 'LineString', 'Polygon', 'MultiPoint',
 * 'MultiLineString', or 'MultiPolygon').
 * @type {ol.geom.GeometryType}
 */
olx.interaction.DrawOptions.prototype.type;


/**
 * The number of points that must be drawn before a polygon ring can be finished.
 * Default is `3`.
 * @type {number|undefined}
 */
olx.interaction.DrawOptions.prototype.minPointsPerRing;


/**
 * Style for sketch features.
 * @type {ol.style.Style|Array.<ol.style.Style>|ol.style.StyleFunction|undefined}
 */
olx.interaction.DrawOptions.prototype.style;


/**
 * Geometry name to use for features created by the draw interaction.
 * @type {string|undefined}
 */
olx.interaction.DrawOptions.prototype.geometryName;


/**
 * A function that takes an {@link ol.MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * By default {@link ol.events.condition.noModifierKeys} adds a vertex.
 * @type {ol.events.ConditionType|undefined}
 */
olx.interaction.DrawOptions.prototype.condition;


/**
 * @typedef {{condition: (ol.events.ConditionType|undefined),
 *     pixelDelta: (number|undefined)}}
 * @api
 */
olx.interaction.KeyboardPanOptions;


/**
 * A function that takes an {@link ol.MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * Default is {@link ol.events.condition.noModifierKeys} and
 * {@link ol.events.condition.targetNotEditable}.
 * @type {ol.events.ConditionType|undefined}
 */
olx.interaction.KeyboardPanOptions.prototype.condition;


/**
 * Pixel The amount to pan on each key press. Default is `128` pixels.
 * @type {number|undefined}
 */
olx.interaction.KeyboardPanOptions.prototype.pixelDelta;


/**
 * @typedef {{duration: (number|undefined),
 *     condition: (ol.events.ConditionType|undefined),
 *     delta: (number|undefined)}}
 * @api
 */
olx.interaction.KeyboardZoomOptions;


/**
 * Animation duration in milliseconds. Default is `100`.
 * @type {number|undefined}
 */
olx.interaction.KeyboardZoomOptions.prototype.duration;


/**
 * A function that takes an {@link ol.MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * Default is {@link ol.events.condition.targetNotEditable}.
 * @type {ol.events.ConditionType|undefined}
 */
olx.interaction.KeyboardZoomOptions.prototype.condition;


/**
 * The amount to zoom on each key press. Default is `1`.
 * @type {number|undefined}
 */
olx.interaction.KeyboardZoomOptions.prototype.delta;


/**
 * @typedef {{deleteCondition: (ol.events.ConditionType|undefined),
 *     pixelTolerance: (number|undefined),
 *     style: (ol.style.Style|Array.<ol.style.Style>|ol.style.StyleFunction|undefined),
 *     features: ol.Collection}}
 * @api
 */
olx.interaction.ModifyOptions;


/**
 * A function that takes an {@link ol.MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * By default, {@link ol.events.condition.singleClick} with
 * {@link ol.events.condition.noModifierKeys} results in a vertex deletion.
 * @type {ol.events.ConditionType|undefined}
 */
olx.interaction.ModifyOptions.prototype.deleteCondition;


/**
 * Pixel tolerance for considering the pointer close enough to a segment or
 * vertex for editing. Default is `10` pixels.
 * @type {number|undefined}
 */
olx.interaction.ModifyOptions.prototype.pixelTolerance;


/**
 * FeatureOverlay style.
 * @type {ol.style.Style|Array.<ol.style.Style>|ol.style.StyleFunction|undefined}
 */
olx.interaction.ModifyOptions.prototype.style;


/**
 * The features the interaction works on.
 * @type {ol.Collection}
 */
olx.interaction.ModifyOptions.prototype.features;


/**
 * @typedef {{deleteCondition: (ol.events.ConditionType|undefined),
 *     pixelTolerance: (number|undefined),
 *     style: (ol.style.Style|Array.<ol.style.Style>|ol.feature.StyleFunction|undefined),
 *     features: ol.Collection}}
 * @todo stability experimental
 */
olx.interaction.DryModifyOptions;


/**
 * Condition that determines which event results in a vertex deletion. Default
 * is a `singleclick` event with no modifier keys.
 * @type {ol.events.ConditionType|undefined}
 */
olx.interaction.DryModifyOptions.prototype.deleteCondition;


/**
 * Pixel tolerance for considering the pointer close enough to a segment or
 * vertex for editing. Default is 10 pixels.
 * @type {number|undefined}
 */
olx.interaction.DryModifyOptions.prototype.pixelTolerance;


/**
 * FeatureOverlay style.
 * @type {ol.style.Style|Array.<ol.style.Style>|ol.feature.StyleFunction|undefined}
 */
olx.interaction.DryModifyOptions.prototype.style;


/**
 * The features the interaction works on.
 * @type {ol.Collection}
 */
olx.interaction.DryModifyOptions.prototype.features;


/**
 * @typedef {{duration: (number|undefined)}}
 * @api
 */
olx.interaction.MouseWheelZoomOptions;


/**
 * Animation duration in milliseconds. Default is `250`.
 * @type {number|undefined}
 */
olx.interaction.MouseWheelZoomOptions.prototype.duration;


/**
 * @typedef {{threshold: (number|undefined)}}
 * @api
 */
olx.interaction.PinchRotateOptions;


/**
 * Minimal angle in radians to start a rotation. Default is `0.3`.
 * @type {number|undefined}
 */
olx.interaction.PinchRotateOptions.prototype.threshold;


/**
 * @typedef {{duration: (number|undefined)}}
 * @api
 */
olx.interaction.PinchZoomOptions;


/**
 * Animation duration in milliseconds. Default is `400`.
 * @type {number|undefined}
 */
olx.interaction.PinchZoomOptions.prototype.duration;


/**
 * @typedef {{addCondition: (ol.events.ConditionType|undefined),
 *     condition: (ol.events.ConditionType|undefined),
 *     layers: (Array.<ol.layer.Layer>|function(ol.layer.Layer): boolean|undefined),
 *     style: (ol.style.Style|Array.<ol.style.Style>|ol.style.StyleFunction|undefined),
 *     removeCondition: (ol.events.ConditionType|undefined),
 *     toggleCondition: (ol.events.ConditionType|undefined)}}
 * @api
 */
olx.interaction.SelectOptions;


/**
 * A function that takes an {@link ol.MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * By default, this is {@link ol.events.condition.never}. Use this if you want
 * to use different events for add and remove instead of `toggle`.
 * @type {ol.events.ConditionType|undefined}
 */
olx.interaction.SelectOptions.prototype.addCondition;


/**
 * A function that takes an {@link ol.MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * This is the event for the selected features as a whole. By default, this is
 * {@link ol.events.condition.singleClick}. Clicking on a feature selects that
 * feature and removes any that were in the selection. Clicking outside any
 * feature removes all from the selection.
 * See `toggle`, `add`, `remove` options for adding/removing extra features to/
 * from the selection.
 * @type {ol.events.ConditionType|undefined}
 */
olx.interaction.SelectOptions.prototype.condition;


/**
 * A list of layers from which features should be
 * selected. Alternatively, a filter function can be provided. The
 * function will be called for each layer in the map and should return
 * `true` for layers that you want to be selectable. If the option is
 * absent, all visible layers will be considered selectable.
 * @type {Array.<ol.layer.Layer>|function(ol.layer.Layer): boolean|undefined}
 */
olx.interaction.SelectOptions.prototype.layers;


/**
 * Style for the selected features (those in the FeatureOverlay).
 * @type {ol.style.Style|Array.<ol.style.Style>|ol.style.StyleFunction|undefined}
 */
olx.interaction.SelectOptions.prototype.style;


/**
 * A function that takes an {@link ol.MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * By default, this is {@link ol.events.condition.never}. Use this if you want
 * to use different events for add and remove instead of `toggle`.
 * @type {ol.events.ConditionType|undefined}
 */
olx.interaction.SelectOptions.prototype.removeCondition;


/**
 * A function that takes an {@link ol.MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * This is in addition to the `condition` event. By default,
 * {@link ol.events.condition.shiftKeyOnly}, i.e. pressing `shift` as well as
 * the `condition` event, adds that feature to the current selection if it is
 * not currently selected, and removes it if it is.
 * See `add` and `remove` if you want to use different events instead of a
 * toggle.
 * @type {ol.events.ConditionType|undefined}
 */
olx.interaction.SelectOptions.prototype.toggleCondition;


/**
 * @typedef {{brightness: (number|undefined),
 *     contrast: (number|undefined),
 *     hue: (number|undefined),
 *     opacity: (number|undefined),
 *     saturation: (number|undefined),
 *     visible: (boolean|undefined),
 *     extent: (ol.Extent|undefined),
 *     minResolution: (number|undefined),
 *     maxResolution: (number|undefined)}}
 * @api
 */
olx.layer.BaseOptions;


/**
 * Brightness. Default is `0`.
 * @type {number|undefined}
 */
olx.layer.BaseOptions.prototype.brightness;


/**
 * Contrast. Default is `1`.
 * @type {number|undefined}
 */
olx.layer.BaseOptions.prototype.contrast;


/**
 * Hue. Default is `0`.
 * @type {number|undefined}
 */
olx.layer.BaseOptions.prototype.hue;


/**
 * Opacity (0, 1). Default is `1`.
 * @type {number|undefined}
 */
olx.layer.BaseOptions.prototype.opacity;


/**
 * Saturation. Default is `1`.
 * @type {number|undefined}
 */
olx.layer.BaseOptions.prototype.saturation;


/**
 * Visibility. Default is `true`.
 * @type {boolean|undefined}
 */
olx.layer.BaseOptions.prototype.visible;


/**
 * The bounding extent for layer rendering.  The layer will not be rendered
 * outside of this extent.
 * @type {ol.Extent|undefined}
 */
olx.layer.BaseOptions.prototype.extent;


/**
 * The minimum resolution (inclusive) at which this layer will be visible.
 * @type {number|undefined}
 */
olx.layer.BaseOptions.prototype.minResolution;


/**
 * The maximum resolution (exclusive) below which this layer will be visible.
 * @type {number|undefined}
 */
olx.layer.BaseOptions.prototype.maxResolution;


/**
 * @typedef {{brightness: (number|undefined),
 *     contrast: (number|undefined),
 *     hue: (number|undefined),
 *     opacity: (number|undefined),
 *     saturation: (number|undefined),
 *     source: ol.source.Source,
 *     visible: (boolean|undefined),
 *     extent: (ol.Extent|undefined),
 *     minResolution: (number|undefined),
 *     maxResolution: (number|undefined)}}
 * @api
 */
olx.layer.LayerOptions;


/**
 * Brightness. Default is `0`.
 * @type {number|undefined}
 */
olx.layer.LayerOptions.prototype.brightness;


/**
 * Contrast. Default is `1`.
 * @type {number|undefined}
 */
olx.layer.LayerOptions.prototype.contrast;


/**
 * Hue. Default is `0`.
 * @type {number|undefined}
 */
olx.layer.LayerOptions.prototype.hue;


/**
 * Opacity (0, 1). Default is `1`.
 * @type {number|undefined}
 */
olx.layer.LayerOptions.prototype.opacity;


/**
 * Saturation. Default is `1`.
 * @type {number|undefined}
 */
olx.layer.LayerOptions.prototype.saturation;


/**
 * Source for this layer.
 * @type {ol.source.Source}
 */
olx.layer.LayerOptions.prototype.source;


/**
 * Visibility. Default is `true` (visible).
 * @type {boolean|undefined}
 */
olx.layer.LayerOptions.prototype.visible;


/**
 * The bounding extent for layer rendering.  The layer will not be rendered
 * outside of this extent.
 * @type {ol.Extent|undefined}
 */
olx.layer.LayerOptions.prototype.extent;


/**
 * The minimum resolution (inclusive) at which this layer will be visible.
 * @type {number|undefined}
 */
olx.layer.LayerOptions.prototype.minResolution;


/**
 * The maximum resolution (exclusive) below which this layer will be visible.
 * @type {number|undefined}
 */
olx.layer.LayerOptions.prototype.maxResolution;


/**
 * @typedef {{brightness: (number|undefined),
 *     contrast: (number|undefined),
 *     hue: (number|undefined),
 *     opacity: (number|undefined),
 *     saturation: (number|undefined),
 *     visible: (boolean|undefined),
 *     extent: (ol.Extent|undefined),
 *     minResolution: (number|undefined),
 *     maxResolution: (number|undefined),
 *     layers: (Array.<ol.layer.Base>|ol.Collection|undefined)}}
 * @api
 */
olx.layer.GroupOptions;


/**
 * Brightness. Default is `0`.
 * @type {number|undefined}
 */
olx.layer.GroupOptions.prototype.brightness;


/**
 * Contrast. Default is `1`.
 * @type {number|undefined}
 */
olx.layer.GroupOptions.prototype.contrast;


/**
 * Hue. Default is `0`.
 * @type {number|undefined}
 */
olx.layer.GroupOptions.prototype.hue;


/**
 * Opacity (0, 1). Default is `1`.
 * @type {number|undefined}
 */
olx.layer.GroupOptions.prototype.opacity;


/**
 * Saturation. Default is `1`.
 * @type {number|undefined}
 */
olx.layer.GroupOptions.prototype.saturation;


/**
 * Visibility. Default is `true`.
 * @type {boolean|undefined}
 */
olx.layer.GroupOptions.prototype.visible;


/**
 * The bounding extent for layer rendering.  The layer will not be rendered
 * outside of this extent.
 * @type {ol.Extent|undefined}
 */
olx.layer.GroupOptions.prototype.extent;


/**
 * The minimum resolution (inclusive) at which this layer will be visible.
 * @type {number|undefined}
 */
olx.layer.GroupOptions.prototype.minResolution;


/**
 * The maximum resolution (exclusive) below which this layer will be visible.
 * @type {number|undefined}
 */
olx.layer.GroupOptions.prototype.maxResolution;


/**
 * Child layers.
 * @type {Array.<ol.layer.Base>|ol.Collection|undefined}
 */
olx.layer.GroupOptions.prototype.layers;


/**
 * @typedef {{brightness: (number|undefined),
 *     contrast: (number|undefined),
 *     hue: (number|undefined),
 *     gradient: (Array.<string>|undefined),
 *     radius: (number|undefined),
 *     blur: (number|undefined),
 *     shadow: (number|undefined),
 *     weight: (string|function(ol.Feature):number|undefined),
 *     extent: (ol.Extent|undefined),
 *     minResolution: (number|undefined),
 *     maxResolution: (number|undefined),
 *     opacity: (number|undefined),
 *     saturation: (number|undefined),
 *     source: ol.source.Vector,
 *     visible: (boolean|undefined)}}
 * @api
 */
olx.layer.HeatmapOptions;


/**
 * Brightness.
 * @type {number|undefined}
 */
olx.layer.HeatmapOptions.prototype.brightness;


/**
 * Contrast.
 * @type {number|undefined}
 */
olx.layer.HeatmapOptions.prototype.contrast;


/**
 * Hue.
 * @type {number|undefined}
 */
olx.layer.HeatmapOptions.prototype.hue;


/**
 * The color gradient of the heatmap, specified as an array of CSS color
 * strings. Default is `['#00f', '#0ff', '#0f0', '#ff0', '#f00']`.
 * @type {Array.<string>|undefined}
 */
olx.layer.HeatmapOptions.prototype.gradient;


/**
 * Radius size in pixels. Default is `8`.
 * @type {number|undefined}
 */
olx.layer.HeatmapOptions.prototype.radius;


/**
 * Blur size in pixels. Default is `15`.
 * @type {number|undefined}
 */
olx.layer.HeatmapOptions.prototype.blur;


/**
 * Shadow size in pixels. Default is `250`.
 * @type {number|undefined}
 */
olx.layer.HeatmapOptions.prototype.shadow;


/**
 * The feature attribute to use for the weight or a function that returns a
 * weight from a feature. Weight values should range from 0 to 1 (and values
 * outside will be clamped to that range). Default is `weight`.
 * @type {string|function(ol.Feature):number|undefined}
 */
olx.layer.HeatmapOptions.prototype.weight;


/**
 * The bounding extent for layer rendering.  The layer will not be rendered
 * outside of this extent.
 * @type {ol.Extent|undefined}
 */
olx.layer.HeatmapOptions.prototype.extent;


/**
 * The minimum resolution (inclusive) at which this layer will be visible.
 * @type {number|undefined}
 */
olx.layer.HeatmapOptions.prototype.minResolution;


/**
 * The maximum resolution (exclusive) below which this layer will be visible.
 * @type {number|undefined}
 */
olx.layer.HeatmapOptions.prototype.maxResolution;


/**
 * Opacity. 0-1. Default is `1`.
 * @type {number|undefined}
 */
olx.layer.HeatmapOptions.prototype.opacity;


/**
 * Saturation.
 * @type {number|undefined}
 */
olx.layer.HeatmapOptions.prototype.saturation;


/**
 * Source.
 * @type {ol.source.Vector}
 */
olx.layer.HeatmapOptions.prototype.source;


/**
 * Visibility. Default is `true` (visible).
 * @type {boolean|undefined}
 */
olx.layer.HeatmapOptions.prototype.visible;


/**
 * @typedef {{brightness: (number|undefined),
 *     contrast: (number|undefined),
 *     hue: (number|undefined),
 *     opacity: (number|undefined),
 *     preload: (number|undefined),
 *     saturation: (number|undefined),
 *     source: ol.source.Source,
 *     visible: (boolean|undefined),
 *     extent: (ol.Extent|undefined),
 *     minResolution: (number|undefined),
 *     maxResolution: (number|undefined),
 *     useInterimTilesOnError: (boolean|undefined)}}
 * @api
 */
olx.layer.TileOptions;


/**
 * Brightness. Default is `0`.
 * @type {number|undefined}
 */
olx.layer.TileOptions.prototype.brightness;


/**
 * Contrast. Default is `1`.
 * @type {number|undefined}
 */
olx.layer.TileOptions.prototype.contrast;


/**
 * Hue. Default is `0`.
 * @type {number|undefined}
 */
olx.layer.TileOptions.prototype.hue;


/**
 * Opacity (0, 1). Default is `1`.
 * @type {number|undefined}
 */
olx.layer.TileOptions.prototype.opacity;


/**
 * Preload.
 * @type {number|undefined}
 */
olx.layer.TileOptions.prototype.preload;


/**
 * Saturation. Default is `1`.
 * @type {number|undefined}
 */
olx.layer.TileOptions.prototype.saturation;


/**
 * Source for this layer.
 * @type {ol.source.Source}
 */
olx.layer.TileOptions.prototype.source;


/**
 * Visibility. Default is `true` (visible).
 * @type {boolean|undefined}
 */
olx.layer.TileOptions.prototype.visible;


/**
 * The bounding extent for layer rendering.  The layer will not be rendered
 * outside of this extent.
 * @type {ol.Extent|undefined}
 */
olx.layer.TileOptions.prototype.extent;


/**
 * The minimum resolution (inclusive) at which this layer will be visible.
 * @type {number|undefined}
 */
olx.layer.TileOptions.prototype.minResolution;


/**
 * The maximum resolution (exclusive) below which this layer will be visible.
 * @type {number|undefined}
 */
olx.layer.TileOptions.prototype.maxResolution;


/**
 * Use interim tiles on error. Default is `true`.
 * @type {boolean|undefined}
 */
olx.layer.TileOptions.prototype.useInterimTilesOnError;


/**
 * @typedef {{brightness: (number|undefined),
 *     contrast: (number|undefined),
 *     renderOrder: (function(ol.Feature, ol.Feature):number|null|undefined),
 *     hue: (number|undefined),
 *     minResolution: (number|undefined),
 *     maxResolution: (number|undefined),
 *     opacity: (number|undefined),
 *     saturation: (number|undefined),
 *     source: ol.source.Vector,
 *     style: (ol.style.Style|Array.<ol.style.Style>|ol.style.StyleFunction|undefined),
 *     visible: (boolean|undefined)}}
 * @api
 */
olx.layer.VectorOptions;


/**
 * Brightness.
 * @type {number|undefined}
 */
olx.layer.VectorOptions.prototype.brightness;


/**
 * Contrast.
 * @type {number|undefined}
 */
olx.layer.VectorOptions.prototype.contrast;


/**
 * Render order. Function to be used when sorting features before rendering. By
 * default features are drawn in the order that they are created. Use `null` to
 * avoid the sort, but get an undefined draw order.
 * @type {function(ol.Feature, ol.Feature):number|null|undefined}
 */
olx.layer.VectorOptions.prototype.renderOrder;


/**
 * Hue.
 * @type {number|undefined}
 */
olx.layer.VectorOptions.prototype.hue;


/**
 * The bounding extent for layer rendering.  The layer will not be rendered
 * outside of this extent.
 * @type {ol.Extent|undefined}
 */
olx.layer.VectorOptions.prototype.extent;


/**
 * The minimum resolution (inclusive) at which this layer will be visible.
 * @type {number|undefined}
 */
olx.layer.VectorOptions.prototype.minResolution;


/**
 * The maximum resolution (exclusive) below which this layer will be visible.
 * @type {number|undefined}
 */
olx.layer.VectorOptions.prototype.maxResolution;


/**
 * Opacity. 0-1. Default is `1`.
 * @type {number|undefined}
 */
olx.layer.VectorOptions.prototype.opacity;


/**
 * Saturation.
 * @type {number|undefined}
 */
olx.layer.VectorOptions.prototype.saturation;


/**
 * Source.
 * @type {ol.source.Vector}
 */
olx.layer.VectorOptions.prototype.source;


/**
 * Layer style.
 * @type {ol.style.Style|Array.<ol.style.Style>|ol.style.StyleFunction|undefined}
 */
olx.layer.VectorOptions.prototype.style;


/**
 * Visibility. Default is `true` (visible).
 * @type {boolean|undefined}
 */
olx.layer.VectorOptions.prototype.visible;


/**
 * @typedef {{features: (Array.<ol.Feature>|ol.Collection|undefined),
 *     map: (ol.Map|undefined),
 *     style: (ol.style.Style|Array.<ol.style.Style>|ol.style.StyleFunction|undefined)}}
 * @api
 */
olx.FeatureOverlayOptions;


/**
 * Features.
 * @type {Array.<ol.Feature>|ol.Collection|undefined}
 */
olx.FeatureOverlayOptions.prototype.features;


/**
 * Map.
 * @type {ol.Map|undefined}
 */
olx.FeatureOverlayOptions.prototype.map;


/**
 * Feature style.
 * @type {ol.style.Style|Array.<ol.style.Style>|ol.style.StyleFunction|undefined}
 */
olx.FeatureOverlayOptions.prototype.style;


/**
 * @typedef {{culture: (string|undefined),
 *     key: string,
 *     imagerySet: string,
 *     tileLoadFunction: (ol.TileLoadFunctionType|undefined)}}
 * @api
 */
olx.source.BingMapsOptions;


/**
 * Culture code. Default is `en-us`.
 * @type {string|undefined}
 */
olx.source.BingMapsOptions.prototype.culture;


/**
 * Bing Maps API key. Get yours at http://bingmapsportal.com/.
 * @type {string}
 */
olx.source.BingMapsOptions.prototype.key;


/**
 * Type of imagery.
 * @type {string}
 */
olx.source.BingMapsOptions.prototype.imagerySet;


/**
 * Optional function to load a tile given a URL.
 * @type {ol.TileLoadFunctionType|undefined}
 */
olx.source.BingMapsOptions.prototype.tileLoadFunction;

/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     distance: (number|undefined),
 *     extent: (ol.Extent|undefined),
 *     format: (ol.format.Feature|undefined),
 *     logo: (string|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     source: ol.source.Vector}}
 * @api
 */
olx.source.ClusterOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.ClusterOptions.prototype.attributions;


/**
 * Minimum distance in pixels between clusters. Default is `20`.
 * @type {number|undefined}
 */
olx.source.ClusterOptions.prototype.distance;


/**
 * Extent.
 * @type {ol.Extent|undefined}
 */
olx.source.ClusterOptions.prototype.extent;


/**
 * Format.
 * @type {ol.format.Feature|undefined}
 */
olx.source.ClusterOptions.prototype.format;


/**
 * Logo.
 * @type {string|undefined}
 */
olx.source.ClusterOptions.prototype.logo;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.ClusterOptions.prototype.projection;


/**
 * Source.
 * @type {ol.source.Vector}
 */
olx.source.ClusterOptions.prototype.source;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     format: ol.format.Feature,
 *     logo: (string|olx.LogoOptions|undefined),
 *     projection: ol.proj.ProjectionLike}}
 * @api
 */
olx.source.FormatVectorOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.FormatVectorOptions.prototype.attributions;


/**
 * Format.
 * @type {ol.format.Feature}
 */
olx.source.FormatVectorOptions.prototype.format;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.FormatVectorOptions.prototype.logo;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.FormatVectorOptions.prototype.projection;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     defaultProjection: ol.proj.ProjectionLike,
 *     logo: (string|olx.LogoOptions|undefined),
 *     object: (GeoJSONObject|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     text: (string|undefined),
 *     url: (string|undefined),
 *     urls: (Array.<string>|undefined)}}
 * @api
 */
olx.source.GeoJSONOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.GeoJSONOptions.prototype.attributions;


/**
 * Default projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.GeoJSONOptions.prototype.defaultProjection;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.GeoJSONOptions.prototype.logo;


/**
 * Object.
 * @type {GeoJSONObject|undefined}
 */
olx.source.GeoJSONOptions.prototype.object;


/**
 * Destination projection. If provided, features will be transformed to this
 * projection. If not provided, features will not be transformed.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.GeoJSONOptions.prototype.projection;


/**
 * Text.
 * @type {string|undefined}
 */
olx.source.GeoJSONOptions.prototype.text;


/**
 * URL.
 * @type {string|undefined}
 */
olx.source.GeoJSONOptions.prototype.url;


/**
 * URLs.
 * @type {Array.<string>|undefined}
 */
olx.source.GeoJSONOptions.prototype.urls;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     doc: (Document|undefined),
 *     logo: (string|olx.LogoOptions|undefined),
 *     node: (Node|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     text: (string|undefined),
 *     url: (string|undefined),
 *     urls: (Array.<string>|undefined)}}
 * @api
 */
olx.source.GPXOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.GPXOptions.prototype.attributions;


/**
 * Document.
 * @type {Document|undefined}
 */
olx.source.GPXOptions.prototype.doc;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.GPXOptions.prototype.logo;


/**
 * Node.
 * @type {Node|undefined}
 */
olx.source.GPXOptions.prototype.node;


/**
 * Destination projection. If provided, features will be transformed to this
 * projection. If not provided, features will not be transformed.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.GPXOptions.prototype.projection;


/**
 * Text.
 * @type {string|undefined}
 */
olx.source.GPXOptions.prototype.text;


/**
 * URL.
 * @type {string|undefined}
 */
olx.source.GPXOptions.prototype.url;


/**
 * URLs.
 * @type {Array.<string>|undefined}
 */
olx.source.GPXOptions.prototype.urls;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *            crossOrigin: (null|string|undefined),
 *            logo: (string|olx.LogoOptions|undefined),
 *            opaque: (boolean|undefined),
 *            projection: ol.proj.ProjectionLike,
 *            tileClass: (function(new: ol.ImageTile, ol.TileCoord,
 *                                 ol.TileState, string, ?string,
 *                                 ol.TileLoadFunctionType)|undefined),
 *            tileGrid: (ol.tilegrid.TileGrid|undefined),
 *            tileLoadFunction: (ol.TileLoadFunctionType|undefined),
 *            tilePixelRatio: (number|undefined),
 *            tileUrlFunction: (ol.TileUrlFunctionType|undefined)}}
 * @api
 */
olx.source.TileImageOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.TileImageOptions.prototype.attributions;


/**
 * crossOrigin setting for image requests. Default is `null`.
 * @type {null|string|undefined}
 */
olx.source.TileImageOptions.prototype.crossOrigin;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.TileImageOptions.prototype.logo;


/**
 * Whether the layer is opaque.
 * @type {boolean|undefined}
 */
olx.source.TileImageOptions.prototype.opaque;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.TileImageOptions.prototype.projection;


/**
 * tile class
 * @type {function(new: ol.ImageTile, ol.TileCoord,
 *                 ol.TileState, string, ?string,
 *                 ol.TileLoadFunctionType)|undefined}
 */
olx.source.TileImageOptions.prototype.tileClass;


/**
 * Tile grid.
 * @type {ol.tilegrid.TileGrid|undefined}
 */
olx.source.TileImageOptions.prototype.tileGrid;


/**
 * Optional function to load a tile given a URL.
 * @type {ol.TileLoadFunctionType|undefined}
 */
olx.source.TileImageOptions.prototype.tileLoadFunction;


/**
 * The pixel ratio used by the tile service. For example, if the tile
 * service advertizes 256px by 256px tiles but actually sends 512px
 * by 512px images (for retina/hidpi devices) then `tilePixelRatio`
 * should be set to `2`. Default is `1`.
 * @type {number|undefined}
 */
olx.source.TileImageOptions.prototype.tilePixelRatio;


/**
 * Optional function to get tile URL given a tile coordinate and the projection.
 * @type {ol.TileUrlFunctionType|undefined}
 */
olx.source.TileImageOptions.prototype.tileUrlFunction;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     defaultProjection: ol.proj.ProjectionLike,
 *     format: ol.format.Feature,
 *     logo: (string|olx.LogoOptions|undefined),
 *     object: (GeoJSONObject|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     tileGrid: ol.tilegrid.TileGrid,
 *     tileUrlFunction: (ol.TileUrlFunctionType|undefined),
 *     url: (string|undefined),
 *     urls: (Array.<string>|undefined)}}
 * @api
 */
olx.source.TileVectorOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.TileVectorOptions.prototype.attributions;


/**
 * Default projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.TileVectorOptions.prototype.defaultProjection;


/**
 * Format.
 * @type {ol.format.Feature}
 */
olx.source.TileVectorOptions.prototype.format;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.TileVectorOptions.prototype.logo;


/**
 * Object.
 * @type {GeoJSONObject|undefined}
 */
olx.source.TileVectorOptions.prototype.object;


/**
 * Destination projection. If provided, features will be transformed to this
 * projection. If not provided, features will not be transformed.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.TileVectorOptions.prototype.projection;


/**
 * Tile grid.
 * @type {ol.tilegrid.TileGrid}
 */
olx.source.TileVectorOptions.prototype.tileGrid;


/**
 * Optional function to get tile URL given a tile coordinate and the projection.
 * Required if url or urls are not provided.
 * @type {ol.TileUrlFunctionType|undefined}
 */
olx.source.TileVectorOptions.prototype.tileUrlFunction;


/**
 * URL template. Must include `{x}`, `{y}` or `{-y}`, and `{z}` placeholders.
 * @type {string|undefined}
 */
olx.source.TileVectorOptions.prototype.url;


/**
 * An array of URL templates.
 * @type {Array.<string>|undefined}
 */
olx.source.TileVectorOptions.prototype.urls;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     defaultProjection: ol.proj.ProjectionLike,
 *     logo: (string|olx.LogoOptions|undefined),
 *     object: (GeoJSONObject|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     text: (string|undefined),
 *     url: (string|undefined)}}
 * @api
 */
olx.source.TopoJSONOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.TopoJSONOptions.prototype.attributions;


/**
 * Default projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.TopoJSONOptions.prototype.defaultProjection;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.TopoJSONOptions.prototype.logo;


/**
 * Object.
 * @type {GeoJSONObject|undefined}
 */
olx.source.TopoJSONOptions.prototype.object;


/**
 * Destination projection. If provided, features will be transformed to this
 * projection. If not provided, features will not be transformed.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.TopoJSONOptions.prototype.projection;


/**
 * Text.
 * @type {string|undefined}
 */
olx.source.TopoJSONOptions.prototype.text;


/**
 * URL.
 * @type {string|undefined}
 */
olx.source.TopoJSONOptions.prototype.url;


/**
 * @typedef {{altitudeMode: (ol.format.IGCZ|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     text: (string|undefined),
 *     url: (string|undefined),
 *     urls: (Array.<string>|undefined)}}
 * @api
 */
olx.source.IGCOptions;


/**
 * Altitude mode. Possible values are `barometric`, `gps`, and `none`. Default
 * is `none`.
 * @type {ol.format.IGCZ|undefined}
 */
olx.source.IGCOptions.prototype.altitudeMode;


/**
 * Destination projection. If provided, features will be transformed to this
 * projection. If not provided, features will not be transformed.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.IGCOptions.prototype.projection;


/**
 * Text.
 * @type {string|undefined}
 */
olx.source.IGCOptions.prototype.text;


/**
 * URL.
 * @type {string|undefined}
 */
olx.source.IGCOptions.prototype.url;


/**
 * URLs.
 * @type {Array.<string>|undefined}
 */
olx.source.IGCOptions.prototype.urls;


/**
 * @typedef {{url: (string|undefined),
 *     displayDpi: (number|undefined),
 *     metersPerUnit: (number|undefined),
 *     hidpi: (boolean|undefined),
 *     useOverlay: (boolean|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     ratio: (number|undefined),
 *     resolutions: (Array.<number>|undefined),
 *     params: (Object|undefined)}}
 * @api
 */
olx.source.MapGuideOptions;


/**
 * The mapagent url.
 * @type {string|undefined}
 */
olx.source.MapGuideOptions.prototype.url;


/**
 * The display resolution. Default is `96`.
 * @type {number|undefined}
 */
olx.source.MapGuideOptions.prototype.displayDpi;


/**
 * The meters-per-unit value. Default is `1`.
 * @type {number|undefined}
 */
olx.source.MapGuideOptions.prototype.metersPerUnit;


/**
 * Use the `ol.Map#pixelRatio` value when requesting the image from the remote
 * server. Default is `true`.
 * @type {boolean|undefined}
 */
olx.source.MapGuideOptions.prototype.hidpi;


/**
 * If `true`, will use `GETDYNAMICMAPOVERLAYIMAGE`.
 * @type {boolean|undefined}
 */
olx.source.MapGuideOptions.prototype.useOverlay;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.MapGuideOptions.prototype.projection;


/**
 * Ratio. `1` means image requests are the size of the map viewport, `2` means
 * twice the size of the map viewport, and so on. Default is `1`.
 * @type {number|undefined}
 */
olx.source.MapGuideOptions.prototype.ratio;


/**
 * Resolutions. If specified, requests will be made for these resolutions only.
 * @type {Array.<number>|undefined}
 */
olx.source.MapGuideOptions.prototype.resolutions;


/**
 * Additional parameters.
 * @type {Object|undefined}
 */
olx.source.MapGuideOptions.prototype.params;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     defaultStyle: (Array.<ol.style.Style>|undefined),
 *     doc: (Document|undefined),
 *     logo: (string|olx.LogoOptions|undefined),
 *     node: (Node|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     text: (string|undefined),
 *     url: (string|undefined),
 *     urls: (Array.<string>|undefined)}}
 * @api
 */
olx.source.KMLOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.KMLOptions.prototype.attributions;


/**
 * Default style.
 * @type {Array.<ol.style.Style>|undefined}
 */
olx.source.KMLOptions.prototype.defaultStyle;


/**
 * Document.
 * @type {Document|undefined}
 */
olx.source.KMLOptions.prototype.doc;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.KMLOptions.prototype.logo;


/**
 * Node.
 * @type {Node|undefined}
 */
olx.source.KMLOptions.prototype.node;


/**
 * Destination projection. If provided, features will be transformed to this
 * projection. If not provided, features will not be transformed.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.KMLOptions.prototype.projection;


/**
 * Text.
 * @type {string|undefined}
 */
olx.source.KMLOptions.prototype.text;


/**
 * URL.
 * @type {string|undefined}
 */
olx.source.KMLOptions.prototype.url;


/**
 * URLs.
 * @type {Array.<string>|undefined}
 */
olx.source.KMLOptions.prototype.urls;


/**
 * @typedef {{layer: string,
 *     tileLoadFunction: (ol.TileLoadFunctionType|undefined)}}
 * @api
 */
olx.source.MapQuestOptions;


/**
 * Layer. Possible values are `osm`, `sat`, and `hyb`.
 * @type {string}
 */
olx.source.MapQuestOptions.prototype.layer;


/**
 * Optional function to load a tile given a URL.
 * @type {ol.TileLoadFunctionType|undefined}
 */
olx.source.MapQuestOptions.prototype.tileLoadFunction;


/**
 * @typedef {{projection: ol.proj.ProjectionLike,
 *     tileGrid: (ol.tilegrid.TileGrid|undefined)}}
 * @api
 */
olx.source.TileDebugOptions;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.TileDebugOptions.prototype.projection;


/**
 * Tile grid.
 * @type {ol.tilegrid.TileGrid|undefined}
 */
olx.source.TileDebugOptions.prototype.tileGrid;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     crossOrigin: (null|string|undefined),
 *     maxZoom: (number|undefined),
 *     tileLoadFunction: (ol.TileLoadFunctionType|undefined),
 *     url: (string|undefined)}}
 * @api
 */
olx.source.OSMOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.OSMOptions.prototype.attributions;


/**
 * crossOrigin setting for image requests. Default is `anonymous`.
 * @type {null|string|undefined}
 */
olx.source.OSMOptions.prototype.crossOrigin;


/**
 * Max zoom.
 * @type {number|undefined}
 */
olx.source.OSMOptions.prototype.maxZoom;


/**
 * Optional function to load a tile given a URL.
 * @type {ol.TileLoadFunctionType|undefined}
 */
olx.source.OSMOptions.prototype.tileLoadFunction;


/**
 * URL template. Must include `{x}`, `{y}` or `{-y}`, and `{z}` placeholders.
 * Default is `//{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png`.
 * @type {string|undefined}
 */
olx.source.OSMOptions.prototype.url;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     defaultStyle: (Array.<ol.style.Style>|undefined),
 *     doc: (Document|undefined),
 *     logo: (string|olx.LogoOptions|undefined),
 *     node: (Node|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     reprojectTo: ol.proj.ProjectionLike,
 *     text: (string|undefined),
 *     url: (string|undefined),
 *     urls: (Array.<string>|undefined)}}
 * @api
 */
olx.source.OSMXMLOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.OSMXMLOptions.prototype.attributions;


/**
 * Default style.
 * @type {Array.<ol.style.Style>|undefined}
 */
olx.source.OSMXMLOptions.prototype.defaultStyle;


/**
 * Document.
 * @type {Document|undefined}
 */
olx.source.OSMXMLOptions.prototype.doc;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.OSMXMLOptions.prototype.logo;


/**
 * Node.
 * @type {Node|undefined}
 */
olx.source.OSMXMLOptions.prototype.node;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.OSMXMLOptions.prototype.projection;


/**
 * Re-project to.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.OSMXMLOptions.prototype.reprojectTo;


/**
 * Text.
 * @type {string|undefined}
 */
olx.source.OSMXMLOptions.prototype.text;


/**
 * URL.
 * @type {string|undefined}
 */
olx.source.OSMXMLOptions.prototype.url;


/**
 * URLs.
 * @type {Array.<string>|undefined}
 */
olx.source.OSMXMLOptions.prototype.urls;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     canvasFunction: ol.CanvasFunctionType,
 *     logo: (string|olx.LogoOptions|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     ratio: (number|undefined),
 *     resolutions: (Array.<number>|undefined),
 *     state: (ol.source.State|string|undefined)}}
 * @api
 */
olx.source.ImageCanvasOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.ImageCanvasOptions.prototype.attributions;


/**
 * Canvas function. The function returning the canvas element used by the source
 * as an image. The arguments passed to the function are: `{ol.Extent}` the
 * image extent, `{number}` the image resolution, `{number}` the device pixel
 * ratio, `{ol.Size}` the image size, and `{ol.proj.Projection}` the image
 * projection. The canvas returned by this function is cached by the source. If
 * the value returned by the function is later changed then
 * `dispatchChangeEvent` should be called on the source for the source to
 * invalidate the current cached image.
 * @type {ol.CanvasFunctionType}
 */
olx.source.ImageCanvasOptions.prototype.canvasFunction;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.ImageCanvasOptions.prototype.logo;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.ImageCanvasOptions.prototype.projection;


/**
 * Ratio. 1 means canvases are the size of the map viewport, 2 means twice the
 * size of the map viewport, and so on. Default is `1.5`.
 * @type {number|undefined}
 */
olx.source.ImageCanvasOptions.prototype.ratio;


/**
 * Resolutions. If specified, new canvases will be created for these resolutions
 * only.
 * @type {Array.<number>|undefined}
 */
olx.source.ImageCanvasOptions.prototype.resolutions;


/**
 * Source state.
 * @type {ol.source.State|string|undefined}
 */
olx.source.ImageCanvasOptions.prototype.state;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     logo: (string|olx.LogoOptions|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     ratio: (number|undefined),
 *     resolutions: (Array.<number>|undefined),
 *     source: ol.source.Vector,
 *     style: (ol.style.Style|Array.<ol.style.Style>|ol.style.StyleFunction|undefined)}}
 * @api
 */
olx.source.ImageVectorOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.ImageVectorOptions.prototype.attributions;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.ImageVectorOptions.prototype.logo;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.ImageVectorOptions.prototype.projection;


/**
 * Ratio. 1 means canvases are the size of the map viewport, 2 means twice the
 * size of the map viewport, and so on. Default is `1.5`.
 * @type {number|undefined}
 */
olx.source.ImageVectorOptions.prototype.ratio;


/**
 * Resolutions. If specified, new canvases will be created for these resolutions
 * only.
 * @type {Array.<number>|undefined}
 */
olx.source.ImageVectorOptions.prototype.resolutions;


/**
 * The vector source from which the vector features drawn in canvas elements are
 * read.
 * @type {ol.source.Vector}
 */
olx.source.ImageVectorOptions.prototype.source;


/**
 * Style to use when rendering features to the canvas.
 * @type {ol.style.Style|Array.<ol.style.Style>|ol.style.StyleFunction|undefined}
 */
olx.source.ImageVectorOptions.prototype.style;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     crossOrigin: (null|string|undefined),
 *     hidpi: (boolean|undefined),
 *     serverType: (ol.source.wms.ServerType|string|undefined),
 *     logo: (string|olx.LogoOptions|undefined),
 *     params: Object.<string,*>,
 *     projection: ol.proj.ProjectionLike,
 *     ratio: (number|undefined),
 *     resolutions: (Array.<number>|undefined),
 *     url: (string|undefined)}}
 * @api
 */
olx.source.ImageWMSOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.ImageWMSOptions.prototype.attributions;


/**
 * crossOrigin setting for image requests.
 * @type {null|string|undefined}
 */
olx.source.ImageWMSOptions.prototype.crossOrigin;


/**
 * Use the `ol.Map#pixelRatio` value when requesting the image from the remote
 * server. Default is `true`.
 * @type {boolean|undefined}
 */
olx.source.ImageWMSOptions.prototype.hidpi;


/**
 * The type of the remote WMS server: `mapserver`, `geoserver` or `qgis`. Only
 * needed if `hidpi` is `true`. Default is `undefined`.
 * @type {ol.source.wms.ServerType|string|undefined}
 */
olx.source.ImageWMSOptions.prototype.serverType;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.ImageWMSOptions.prototype.logo;


/**
 * WMS request parameters. At least a `LAYERS` param is required. `STYLES` is
 * `''` by default. `VERSION` is `1.3.0` by default. `WIDTH`, `HEIGHT`, `BBOX`
 * and `CRS` (`SRS` for WMS version < 1.3.0) will be set dynamically.
 * @type {Object.<string,*>}
 */
olx.source.ImageWMSOptions.prototype.params;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.ImageWMSOptions.prototype.projection;


/**
 * Ratio. `1` means image requests are the size of the map viewport, `2` means
 * twice the size of the map viewport, and so on. Default is `1.5`.
 * @type {number|undefined}
 */
olx.source.ImageWMSOptions.prototype.ratio;


/**
 * Resolutions. If specified, requests will be made for these resolutions only.
 * @type {Array.<number>|undefined}
 */
olx.source.ImageWMSOptions.prototype.resolutions;


/**
 * WMS service URL.
 * @type {string|undefined}
 */
olx.source.ImageWMSOptions.prototype.url;


/**
 * @typedef {{layer: string,
 *     minZoom: (number|undefined),
 *     maxZoom: (number|undefined),
 *     opaque: (boolean|undefined),
 *     tileLoadFunction: (ol.TileLoadFunctionType|undefined),
 *     url: (string|undefined)}}
 * @api
 */
olx.source.StamenOptions;


/**
 * Layer.
 * @type {string}
 */
olx.source.StamenOptions.prototype.layer;


/**
 * Minimum zoom.
 * @type {number|undefined}
 */
olx.source.StamenOptions.prototype.minZoom;


/**
 * Maximum zoom.
 * @type {number|undefined}
 */
olx.source.StamenOptions.prototype.maxZoom;


/**
 * Whether the layer is opaque.
 * @type {boolean|undefined}
 */
olx.source.StamenOptions.prototype.opaque;


/**
 * Optional function to load a tile given a URL.
 * @type {ol.TileLoadFunctionType|undefined}
 */
olx.source.StamenOptions.prototype.tileLoadFunction;


/**
 * URL template. Must include `{x}`, `{y}` or `{-y}`, and `{z}` placeholders.
 * @type {string|undefined}
 */
olx.source.StamenOptions.prototype.url;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     crossOrigin: (null|string|undefined),
 *     imageExtent: (ol.Extent|undefined),
 *     imageSize: (ol.Size|undefined),
 *     logo: (string|olx.LogoOptions|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     url: string}}
 * @api
 */
olx.source.ImageStaticOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.ImageStaticOptions.prototype.attributions;


/**
 * crossOrigin setting for image requests.
 * @type {null|string|undefined}
 */
olx.source.ImageStaticOptions.prototype.crossOrigin;


/**
 * Extent of the image.
 * @type {ol.Extent|undefined}
 */
olx.source.ImageStaticOptions.prototype.imageExtent;


/**
 * Size of the image.
 * @type {ol.Size|undefined}
 */
olx.source.ImageStaticOptions.prototype.imageSize;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.ImageStaticOptions.prototype.logo;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.ImageStaticOptions.prototype.projection;


/**
 * Url.
 * @type {string}
 */
olx.source.ImageStaticOptions.prototype.url;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     format: ol.format.Feature,
 *     loader: function(this: ol.source.ServerVector, ol.Extent, number, ol.proj.Projection),
 *     strategy: (function(ol.Extent, number): Array.<ol.Extent>|undefined),
 *     logo: (string|olx.LogoOptions|undefined),
 *     projection: ol.proj.ProjectionLike}}
 * @api
 */
olx.source.ServerVectorOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.ServerVectorOptions.prototype.attributions;


/**
 * Format.
 * @type {ol.format.Feature}
 */
olx.source.ServerVectorOptions.prototype.format;


/**
 * Loading function.
 * @type {function(this: ol.source.ServerVector, ol.Extent, number, ol.proj.Projection)}
 */
olx.source.ServerVectorOptions.prototype.loader;


/**
 * Loading strategy. An {@link ol.loadingstrategy} or a custom function.
 * Default is {@link ol.loadingstrategy.bbox}.
 * @type {function(ol.Extent, number): Array.<ol.Extent>|undefined}
 */
olx.source.ServerVectorOptions.prototype.strategy;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.ServerVectorOptions.prototype.logo;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.ServerVectorOptions.prototype.projection;


/**
 * @typedef {{crossOrigin: (null|string|undefined),
 *     tileLoadFunction: (ol.TileLoadFunctionType|undefined),
 *     url: string}}
 * @api
 */
olx.source.TileJSONOptions;


/**
 * crossOrigin setting for image requests.
 * @type {null|string|undefined}
 */
olx.source.TileJSONOptions.prototype.crossOrigin;


/**
 * Optional function to load a tile given a URL.
 * @type {ol.TileLoadFunctionType|undefined}
 */
olx.source.TileJSONOptions.prototype.tileLoadFunction;


/**
 * URL to the TileJSON file.
 * @type {string}
 */
olx.source.TileJSONOptions.prototype.url;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     params: Object.<string,*>,
 *     crossOrigin: (null|string|undefined),
 *     gutter: (number|undefined),
 *     hidpi: (boolean|undefined),
 *     logo: (string|olx.LogoOptions|undefined),
 *     tileGrid: (ol.tilegrid.TileGrid|undefined),
 *     maxZoom: (number|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     serverType: (ol.source.wms.ServerType|string|undefined),
 *     tileLoadFunction: (ol.TileLoadFunctionType|undefined),
 *     url: (string|undefined),
 *     urls: (Array.<string>|undefined)}}
 * @api
 */
olx.source.TileWMSOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.TileWMSOptions.prototype.attributions;


/**
 * WMS request parameters. At least a `LAYERS` param is required. `STYLES` is
 * `''` by default. `VERSION` is `1.3.0` by default. `WIDTH`, `HEIGHT`, `BBOX`
 * and `CRS` (`SRS` for WMS version < 1.3.0) will be set dynamically.
 * @type {Object.<string,*>}
 */
olx.source.TileWMSOptions.prototype.params;


/**
 * crossOrigin setting for image requests.
 * @type {null|string|undefined}
 */
olx.source.TileWMSOptions.prototype.crossOrigin;


/**
 * The size in pixels of the gutter around image tiles to ignore. By setting
 * this property to a non-zero value, images will be requested that are wider
 * and taller than the tile size by a value of `2 x gutter`. Defaults to zero.
 * Using a non-zero value allows artifacts of rendering at tile edges to be
 * ignored. If you control the WMS service it is recommended to address
 * "artifacts at tile edges" issues by properly configuring the WMS service. For
 * example, MapServer has a `tile_map_edge_buffer` configuration parameter for
 * this. See http://mapserver.org/output/tile_mode.html.
 * @type {number|undefined}
 */
olx.source.TileWMSOptions.prototype.gutter;


/**
 * Use the `ol.Map#pixelRatio` value when requesting the image from the remote
 * server. Default is `true`.
 * @type {boolean|undefined}
 */
olx.source.TileWMSOptions.prototype.hidpi;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.TileWMSOptions.prototype.logo;


/**
 * Tile grid. Base this on the resolutions, tilesize and extent supported by the
 * server.
 * If this is not defined, a default grid will be used: if there is a projection
 * extent, the grid will be based on that; if not, a grid based on a global
 * extent with origin at 0,0 will be used.
 * @type {ol.tilegrid.TileGrid|undefined}
 */
olx.source.TileWMSOptions.prototype.tileGrid;


/**
 * Maximum zoom.
 * @type {number|undefined}
 */
olx.source.TileWMSOptions.prototype.maxZoom;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.TileWMSOptions.prototype.projection;


/**
 * The type of the remote WMS server. Currently only used when `hidpi` is
 * `true`. Default is `undefined`.
 * @type {ol.source.wms.ServerType|string|undefined}
 */
olx.source.TileWMSOptions.prototype.serverType;


/**
 * Optional function to load a tile given a URL.
 * @type {ol.TileLoadFunctionType|undefined}
 */
olx.source.TileWMSOptions.prototype.tileLoadFunction;


/**
 * WMS service URL.
 * @type {string|undefined}
 */
olx.source.TileWMSOptions.prototype.url;


/**
 * WMS service urls. Use this instead of `url` when the WMS supports multiple
 * urls for GetMap requests.
 * @type {Array.<string>|undefined}
 */
olx.source.TileWMSOptions.prototype.urls;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     features: (Array.<ol.Feature>|undefined),
 *     logo: (string|olx.LogoOptions|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     state: (ol.source.State|string|undefined)}}
 * @api
 */
olx.source.VectorOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.VectorOptions.prototype.attributions;


/**
 * Features.
 * @type {Array.<ol.Feature>|undefined}
 */
olx.source.VectorOptions.prototype.features;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.VectorOptions.prototype.logo;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.VectorOptions.prototype.projection;


/**
 * State.
 * @type {ol.source.State|string|undefined}
 */
olx.source.VectorOptions.prototype.state;


/**
 * @typedef {{arrayBuffer: (ArrayBuffer|undefined),
 *     attributions: (Array.<ol.Attribution>|undefined),
 *     doc: (Document|undefined),
 *     format: ol.format.Feature,
 *     logo: (string|olx.LogoOptions|undefined),
 *     node: (Node|undefined),
 *     object: (Object|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     text: (string|undefined),
 *     url: (string|undefined),
 *     urls: (Array.<string>|undefined)}}
 * @api
 */
olx.source.StaticVectorOptions;


/**
 * Array buffer.
 * @type {ArrayBuffer|undefined}
 */
olx.source.StaticVectorOptions.prototype.arrayBuffer;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.StaticVectorOptions.prototype.attributions;


/**
 * Document.
 * @type {Document|undefined}
 */
olx.source.StaticVectorOptions.prototype.doc;


/**
 * Format.
 * @type {ol.format.Feature}
 */
olx.source.StaticVectorOptions.prototype.format;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.StaticVectorOptions.prototype.logo;


/**
 * Node.
 * @type {Node|undefined}
 */
olx.source.StaticVectorOptions.prototype.node;


/**
 * Object.
 * @type {Object|undefined}
 */
olx.source.StaticVectorOptions.prototype.object;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.StaticVectorOptions.prototype.projection;


/**
 * Text.
 * @type {string|undefined}
 */
olx.source.StaticVectorOptions.prototype.text;


/**
 * URL.
 * @type {string|undefined}
 */
olx.source.StaticVectorOptions.prototype.url;


/**
 * URLs.
 * @type {Array.<string>|undefined}
 */
olx.source.StaticVectorOptions.prototype.urls;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     crossOrigin: (string|null|undefined),
 *     logo: (string|olx.LogoOptions|undefined),
 *     tileGrid: ol.tilegrid.WMTS,
 *     projection: ol.proj.ProjectionLike,
 *     requestEncoding: (ol.source.WMTSRequestEncoding|undefined),
 *     layer: string,
 *     style: string,
 *     tilePixelRatio: (number|undefined),
 *     version: (string|undefined),
 *     format: (string|undefined),
 *     matrixSet: string,
 *     dimensions: (Object|undefined),
 *     url: (string|undefined),
 *     maxZoom: (number|undefined),
 *     tileLoadFunction: (ol.TileLoadFunctionType|undefined),
 *     urls: (Array.<string>|undefined)}}
 * @api
 */
olx.source.WMTSOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.WMTSOptions.prototype.attributions;


/**
 * crossOrigin setting for image requests.
 * @type {string|null|undefined}
 */
olx.source.WMTSOptions.prototype.crossOrigin;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.WMTSOptions.prototype.logo;


/**
 * Tile grid.
 * @type {ol.tilegrid.WMTS}
 */
olx.source.WMTSOptions.prototype.tileGrid;


/**
 * Projection.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.WMTSOptions.prototype.projection;


/**
 * Request encoding.
 * @type {ol.source.WMTSRequestEncoding|undefined}
 */
olx.source.WMTSOptions.prototype.requestEncoding;


/**
 * Layer.
 * @type {string}
 */
olx.source.WMTSOptions.prototype.layer;


/**
 * Style.
 * @type {string}
 */
olx.source.WMTSOptions.prototype.style;


/**
 * The pixel ratio used by the tile service. For example, if the tile
 * service advertizes 256px by 256px tiles but actually sends 512px
 * by 512px images (for retina/hidpi devices) then `tilePixelRatio`
 * should be set to `2`. Default is `1`.
 * @type {number|undefined}
 */
olx.source.WMTSOptions.prototype.tilePixelRatio;


/**
 * WMTS version. Default is `1.0.0`.
 * @type {string|undefined}
 */
olx.source.WMTSOptions.prototype.version;


/**
 * Image format. Default is `image/jpeg`.
 * @type {string|undefined}
 */
olx.source.WMTSOptions.prototype.format;


/**
 * Matrix set.
 * @type {string}
 */
olx.source.WMTSOptions.prototype.matrixSet;


/**
 * Dimensions.
 * @type {Object|undefined}
 */
olx.source.WMTSOptions.prototype.dimensions;


/**
 * URL.
 * @type {string|undefined}
 */
olx.source.WMTSOptions.prototype.url;


/**
 * Maximum zoom.
 * @type {number|undefined}
 */
olx.source.WMTSOptions.prototype.maxZoom;


/**
 * Optional function to load a tile given a URL.
 * @type {ol.TileLoadFunctionType|undefined}
 */
olx.source.WMTSOptions.prototype.tileLoadFunction;


/**
 * Urls.
 * @type {Array.<string>|undefined}
 */
olx.source.WMTSOptions.prototype.urls;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     crossOrigin: (null|string|undefined),
 *     logo: (string|olx.LogoOptions|undefined),
 *     projection: ol.proj.ProjectionLike,
 *     maxZoom: (number|undefined),
 *     minZoom: (number|undefined),
 *     tileLoadFunction: (ol.TileLoadFunctionType|undefined),
 *     tilePixelRatio: (number|undefined),
 *     tileUrlFunction: (ol.TileUrlFunctionType|undefined),
 *     url: (string|undefined),
 *     urls: (Array.<string>|undefined),
 *     wrapX: (boolean|undefined)}}
 * @api
 */
olx.source.XYZOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.XYZOptions.prototype.attributions;


/**
 * Cross origin setting for image requests.
 * @type {null|string|undefined}
 */
olx.source.XYZOptions.prototype.crossOrigin;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.XYZOptions.prototype.logo;


/**
 * Projection. Default is `EPSG:3857`.
 * @type {ol.proj.ProjectionLike}
 */
olx.source.XYZOptions.prototype.projection;


/**
 * Optional max zoom level. Default is `18`.
 * @type {number|undefined}
 */
olx.source.XYZOptions.prototype.maxZoom;


/**
 * Unsupported (TODO: remove this).
 * @type {number|undefined}
 */
olx.source.XYZOptions.prototype.minZoom;


/**
 * Optional function to load a tile given a URL.
 * @type {ol.TileLoadFunctionType|undefined}
 */
olx.source.XYZOptions.prototype.tileLoadFunction;


/**
 * The pixel ratio used by the tile service. For example, if the tile
 * service advertizes 256px by 256px tiles but actually sends 512px
 * by 512px images (for retina/hidpi devices) then `tilePixelRatio`
 * should be set to `2`. Default is `1`.
 * @type {number|undefined}
 */
olx.source.XYZOptions.prototype.tilePixelRatio;


/**
 * Optional function to get tile URL given a tile coordinate and the projection.
 * Required if url or urls are not provided.
 * @type {ol.TileUrlFunctionType|undefined}
 */
olx.source.XYZOptions.prototype.tileUrlFunction;


/**
 * URL template. Must include `{x}`, `{y}` or `{-y}`, and `{z}` placeholders.
 * @type {string|undefined}
 */
olx.source.XYZOptions.prototype.url;


/**
 * An array of URL templates.
 * @type {Array.<string>|undefined}
 */
olx.source.XYZOptions.prototype.urls;


/**
 * Whether to wrap the world horizontally. Default is `true`.
 * @type {boolean|undefined}
 */
olx.source.XYZOptions.prototype.wrapX;


/**
 * @typedef {{attributions: (Array.<ol.Attribution>|undefined),
 *     crossOrigin: (null|string|undefined),
 *     logo: (string|olx.LogoOptions|undefined),
 *     url: !string,
 *     tierSizeCalculation: (string|undefined),
 *     size: ol.Size}}
 * @api
 */
olx.source.ZoomifyOptions;


/**
 * Attributions.
 * @type {Array.<ol.Attribution>|undefined}
 */
olx.source.ZoomifyOptions.prototype.attributions;


/**
 * Cross origin setting for image requests.
 * @type {null|string|undefined}
 */
olx.source.ZoomifyOptions.prototype.crossOrigin;


/**
 * Logo.
 * @type{string|olx.LogoOptions|undefined}
 */
olx.source.ZoomifyOptions.prototype.logo;


/**
 * Prefix of URL template.
 * @type {!string}
 */
olx.source.ZoomifyOptions.prototype.url;


/**
 * Tier size calculation method: `default` or `truncated`.
 * @type {string|undefined}
 */
olx.source.ZoomifyOptions.prototype.tierSizeCalculation;


/**
 * Size of the image.
 * @type {ol.Size}
 */
olx.source.ZoomifyOptions.prototype.size;


/**
 * @typedef {{fill: (ol.style.Fill|undefined),
 *     radius: number,
 *     snapToPixel: (boolean|undefined),
 *     stroke: (ol.style.Stroke|undefined)}}
 * @api
 */
olx.style.CircleOptions;


/**
 * Fill style.
 * @type {ol.style.Fill|undefined}
 */
olx.style.CircleOptions.prototype.fill;


/**
 * Circle radius.
 * @type {number}
 */
olx.style.CircleOptions.prototype.radius;


/**
 * If `true` integral numbers of pixels are used as the X and Y pixel
 * coordinate when drawing the circle in the output canvas. If `false`
 * fractional numbers may be used. Using `true` allows for "sharp"
 * rendering (no blur), while using `false` allows for "accurate"
 * rendering. Note that accuracy is important if the circle's
 * position is animated. Without it, the circle may jitter noticeably.
 * Default value is `true`.
 * @type {boolean|undefined}
 */
olx.style.CircleOptions.prototype.snapToPixel;


/**
 * Stroke style.
 * @type {ol.style.Stroke|undefined}
 */
olx.style.CircleOptions.prototype.stroke;


/**
 * @typedef {{color: (ol.Color|string|undefined)}}
 * @api
 */
olx.style.FillOptions;


/**
 * Color.
 * @type {ol.Color|string|undefined}
 */
olx.style.FillOptions.prototype.color;


/**
 * @typedef {{anchor: (Array.<number>|undefined),
 *     anchorOrigin: (ol.style.IconOrigin|undefined),
 *     anchorXUnits: (ol.style.IconAnchorUnits|undefined),
 *     anchorYUnits: (ol.style.IconAnchorUnits|undefined),
 *     crossOrigin: (null|string|undefined),
 *     img: (Image|undefined),
 *     offset: (Array.<number>|undefined),
 *     offsetOrigin: (ol.style.IconOrigin|undefined),
 *     scale: (number|undefined),
 *     snapToPixel: (boolean|undefined),
 *     rotateWithView: (boolean|undefined),
 *     rotation: (number|undefined),
 *     size: (ol.Size|undefined),
 *     src: (string|undefined)}}
 * @api
 */
olx.style.IconOptions;


/**
 * Anchor. Default value is `[0.5, 0.5]` (icon center).
 * @type {Array.<number>|undefined}
 */
olx.style.IconOptions.prototype.anchor;


/**
 * Origin of the anchor: `bottom-left`, `bottom-right`, `top-left` or
 * `top-right`. Default is `top-left`.
 * @type {ol.style.IconOrigin|undefined}
 */
olx.style.IconOptions.prototype.anchorOrigin;


/**
 * Units in which the anchor x value is specified. A value of `'fraction'`
 * indicates the x value is a fraction of the icon. A value of `'pixels'`
 * indicates the x value in pixels. Default is `'fraction'`.
 * @type {ol.style.IconAnchorUnits|undefined}
 */
olx.style.IconOptions.prototype.anchorXUnits;


/**
 * Units in which the anchor y value is specified. A value of `'fraction'`
 * indicates the y value is a fraction of the icon. A value of `'pixels'`
 * indicates the y value in pixels. Default is `'fraction'`.
 * @type {ol.style.IconAnchorUnits|undefined}
 */
olx.style.IconOptions.prototype.anchorYUnits;


/**
 * crossOrigin setting for image.
 * @type {null|string|undefined}
 */
olx.style.IconOptions.prototype.crossOrigin;


/**
 * Image object for the icon. If the `src` option is not provided then the
 * provided image must already be loaded.
 * @type {Image|undefined}
 */
olx.style.IconOptions.prototype.img;


/**
 * Offset, which, together with the size and the offset origin,
 * define the sub-rectangle to use from the original icon image. Default value
 * is `[0, 0]`.
 * @type {Array.<number>|undefined}
 */
olx.style.IconOptions.prototype.offset;


/**
 * Origin of the offset: `bottom-left`, `bottom-right`, `top-left` or
 * `top-right`. Default is `top-left`.
 * @type {ol.style.IconOrigin|undefined}
 */
olx.style.IconOptions.prototype.offsetOrigin;


/**
 * Scale.
 * @type {number|undefined}
 */
olx.style.IconOptions.prototype.scale;


/**
 * If `true` integral numbers of pixels are used as the X and Y pixel
 * coordinate when drawing the icon in the output canvas. If `false`
 * fractional numbers may be used. Using `true` allows for "sharp"
 * rendering (no blur), while using `false` allows for "accurate"
 * rendering. Note that accuracy is important if the icon's position
 * is animated. Without it, the icon may jitter noticeably. Default
 * value is `true`.
 * @type {boolean|undefined}
 */
olx.style.IconOptions.prototype.snapToPixel;


/**
 * Whether to rotate the icon with the view. Default is `false`.
 * @type {boolean|undefined}
 */
olx.style.IconOptions.prototype.rotateWithView;


/**
 * Rotation.
 * @type {number|undefined}
 */
olx.style.IconOptions.prototype.rotation;


/**
 * Icon size in pixel.
 * @type {ol.Size|undefined}
 */
olx.style.IconOptions.prototype.size;


/**
 * Image source URI.
 * @type {string}
 */
olx.style.IconOptions.prototype.src;


/**
 * @typedef {{color: (ol.Color|string|undefined),
 *     lineCap: (string|undefined),
 *     lineJoin: (string|undefined),
 *     lineDash: (Array.<number>|undefined),
 *     miterLimit: (number|undefined),
 *     width: (number|undefined)}}
 * @api
 */
olx.style.StrokeOptions;


/**
 * Color.
 * @type {ol.Color|string|undefined}
 */
olx.style.StrokeOptions.prototype.color;


/**
 * Line cap style: `butt`, `round`, or `square`. Default is `round`.
 * @type {string|undefined}
 */
olx.style.StrokeOptions.prototype.lineCap;


/**
 * Line join style: `bevel`, `round`, or `miter`. Default is `round`.
 * @type {string|undefined}
 */
olx.style.StrokeOptions.prototype.lineJoin;


/**
 * Line dash pattern. Default is `undefined` (no dash).
 * @type {Array.<number>|undefined}
 */
olx.style.StrokeOptions.prototype.lineDash;


/**
 * Miter limit. Default is `10`.
 * @type {number|undefined}
 */
olx.style.StrokeOptions.prototype.miterLimit;


/**
 * Width.
 * @type {number|undefined}
 */
olx.style.StrokeOptions.prototype.width;


/**
 * @typedef {{font: (string|undefined),
 *     offsetX: (number|undefined),
 *     offsetY: (number|undefined),
 *     scale: (number|undefined),
 *     rotation: (number|undefined),
 *     text: (string|undefined),
 *     textAlign: (string|undefined),
 *     textBaseline: (string|undefined),
 *     fill: (ol.style.Fill|undefined),
 *     stroke: (ol.style.Stroke|undefined)}}
 * @api
 */
olx.style.TextOptions;


/**
 * Font.
 * @type {string|undefined}
 */
olx.style.TextOptions.prototype.font;


/**
 * Horizontal text offset in pixels. A positive will shift the text right.
 * Default is `0`.
 * @type {number|undefined}
 */
olx.style.TextOptions.prototype.offsetX;


/**
 * Vertical text offset in pixels. A positive will shift the text down. Default
 * is `0`.
 * @type {number|undefined}
 */
olx.style.TextOptions.prototype.offsetY;


/**
 * Scale.
 * @type {number|undefined}
 */
olx.style.TextOptions.prototype.scale;


/**
 * Rotation.
 * @type {number|undefined}
 */
olx.style.TextOptions.prototype.rotation;


/**
 * Text.
 * @type {string|undefined}
 */
olx.style.TextOptions.prototype.text;


/**
 * Text alignment.
 * @type {string|undefined}
 */
olx.style.TextOptions.prototype.textAlign;


/**
 * Text base line.
 * @type {string|undefined}
 */
olx.style.TextOptions.prototype.textBaseline;


/**
 * Fill style.
 * @type {ol.style.Fill|undefined}
 */
olx.style.TextOptions.prototype.fill;


/**
 * Stroke style.
 * @type {ol.style.Stroke|undefined}
 */
olx.style.TextOptions.prototype.stroke;


/**
 * @typedef {{fill: (ol.style.Fill|undefined),
 *     image: (ol.style.Image|undefined),
 *     stroke: (ol.style.Stroke|undefined),
 *     text: (ol.style.Text|undefined),
 *     zIndex: (number|undefined)}}
 * @api
 */
olx.style.StyleOptions;


/**
 * Fill style.
 * @type {ol.style.Fill|undefined}
 */
olx.style.StyleOptions.prototype.fill;


/**
 * Image style.
 * @type {ol.style.Image|undefined}
 */
olx.style.StyleOptions.prototype.image;


/**
 * Stroke style.
 * @type {ol.style.Stroke|undefined}
 */
olx.style.StyleOptions.prototype.stroke;


/**
 * Text style.
 * @type {ol.style.Text|undefined}
 */
olx.style.StyleOptions.prototype.text;


/**
 * Z index.
 * @type {number|undefined}
 */
olx.style.StyleOptions.prototype.zIndex;


/**
 * @typedef {{minZoom: (number|undefined),
 *     origin: (ol.Coordinate|undefined),
 *     origins: (Array.<ol.Coordinate>|undefined),
 *     resolutions: !Array.<number>,
 *     tileSize: (number|undefined),
 *     tileSizes: (Array.<number>|undefined)}}
 * @api
 */
olx.tilegrid.TileGridOptions;


/**
 * Minimum zoom. Default is 0.
 * @type {number|undefined}
 */
olx.tilegrid.TileGridOptions.prototype.minZoom;


/**
 * Origin. Default is null.
 * @type {ol.Coordinate|undefined}
 */
olx.tilegrid.TileGridOptions.prototype.origin;


/**
 * Origins. If given, the array should match the `resolutions` array, i.e.
 * each resolution can have a different origin.
 * @type {Array.<ol.Coordinate>|undefined}
 */
olx.tilegrid.TileGridOptions.prototype.origins;


/**
 * Resolutions.
 * @type {!Array.<number>}
 */
olx.tilegrid.TileGridOptions.prototype.resolutions;


/**
 * Tile size. Default is 256. (Only square tiles are supported.)
 * @type {number|undefined}
 */
olx.tilegrid.TileGridOptions.prototype.tileSize;


/**
 * Tile sizes. If given, the array should match the `resolutions` array, i.e.
 * each resolution can have a different tile size.
 * @type {Array.<number>|undefined}
 */
olx.tilegrid.TileGridOptions.prototype.tileSizes;


/**
 * @typedef {{origin: (ol.Coordinate|undefined),
 *     origins: (Array.<ol.Coordinate>|undefined),
 *     resolutions: !Array.<number>,
 *     matrixIds: !Array.<string>,
 *     tileSize: (number|undefined),
 *     tileSizes: (Array.<number>|undefined)}}
 * @api
 */
olx.tilegrid.WMTSOptions;


/**
 * Origin.
 * @type {ol.Coordinate|undefined}
 */
olx.tilegrid.WMTSOptions.prototype.origin;


/**
 * Origins.
 * @type {Array.<ol.Coordinate>|undefined}
 */
olx.tilegrid.WMTSOptions.prototype.origins;


/**
 * Resolutions.
 * @type {!Array.<number>}
 */
olx.tilegrid.WMTSOptions.prototype.resolutions;


/**
 * matrix IDs.
 * @type {!Array.<string>}
 */
olx.tilegrid.WMTSOptions.prototype.matrixIds;


/**
 * Tile size.
 * @type {number|undefined}
 */
olx.tilegrid.WMTSOptions.prototype.tileSize;


/**
 * Tile sizes.
 * @type {Array.<number>|undefined}
 */
olx.tilegrid.WMTSOptions.prototype.tileSizes;


/**
 * @typedef {{maxZoom: number}}
 * @api
 */
olx.tilegrid.XYZOptions;


/**
 * Maximum zoom.
 * @type {number}
 */
olx.tilegrid.XYZOptions.prototype.maxZoom;


/**
 * @typedef {{resolutions: !Array.<number>}}
 * @api
 */
olx.tilegrid.ZoomifyOptions;


/**
 * Resolutions.
 * @type {!Array.<number>}
 */
olx.tilegrid.ZoomifyOptions.prototype.resolutions;


/**
 * @typedef {{padding: !Array.<number>,
 *     constrainResolution: (boolean|undefined),
 *     nearest: (boolean|undefined),
 *     minResolution: (number|undefined)}}
 * @api
 */
olx.View.fitGeometryOptions;


/**
 * Padding (in pixels) to be cleared inside the view. Values in the array are
 * top, right, bottom and left padding. Default is `[0, 0, 0, 0]`.
 * @type {!Array.<number>}
 */
olx.View.fitGeometryOptions.prototype.padding;


/**
 * Constrain the resolution. Default is `true`.
 * @type {boolean|undefined}
 */
olx.View.fitGeometryOptions.prototype.constrainResolution;


/**
 * Get the nearest extent. Default is `false`.
 * @type {boolean|undefined}
 */
olx.View.fitGeometryOptions.prototype.nearest;


/**
 * Minimum resolution that we zoom to. Default is `0`.
 * @type {number|undefined}
 */
olx.View.fitGeometryOptions.prototype.minResolution;


/**
 * Maximum zoom level that we zoom to. If `minResolution` is given,
 * this property is ignored.
 * @type {number|undefined}
 */
olx.View.fitGeometryOptions.prototype.maxZoom;


/* typedefs for object literals exposed by the library */


/**
 * @typedef {{animate: boolean,
 *     attributions: Object.<string, ol.Attribution>,
 *     coordinateToPixelMatrix: goog.vec.Mat4.Number,
 *     extent: (null|ol.Extent),
 *     focus: ol.Coordinate,
 *     index: number,
 *     layerStates: Object.<number, ol.layer.LayerState>,
 *     layerStatesArray: Array.<ol.layer.LayerState>,
 *     logos: Object.<string, string>,
 *     pixelRatio: number,
 *     pixelToCoordinateMatrix: goog.vec.Mat4.Number,
 *     postRenderFunctions: Array.<ol.PostRenderFunction>,
 *     size: ol.Size,
 *     skippedFeatureUids: Object.<string, boolean>,
 *     tileQueue: ol.TileQueue,
 *     time: number,
 *     usedTiles: Object.<string, Object.<string, ol.TileRange>>,
 *     viewState: olx.ViewState,
 *     viewHints: Array.<number>,
 *     wantedTiles: Object.<string, Object.<string, boolean>>}}
 * @api
 */
olx.FrameState;


/** @type {number} */
olx.FrameState.prototype.pixelRatio;


/** @type {number} */
olx.FrameState.prototype.time;


/** @type {olx.ViewState} */
olx.FrameState.prototype.viewState;


/**
 * @typedef {{center: ol.Coordinate,
 *     projection: ol.proj.Projection,
 *     resolution: number,
 *     rotation: number}}
 * @api
 */
olx.ViewState;


/** @type {ol.Coordinate} */
olx.ViewState.prototype.center;


/** @type {number} */
olx.ViewState.prototype.resolution;


/** @type {number} */
olx.ViewState.prototype.rotation;
