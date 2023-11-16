/**
 * Example that can be used to produce the list of resolutions
 * per zoom level for each projection supported in eVouala.
 *
 * The list of projection definitions can be found in:
 * evouala-proj-defs.js
 */

import { defaults as interactionDefaults } from '../src/ol/interaction/defaults.js';
import InteractionMouseWheelZoom from '../src/ol/interaction/MouseWheelZoom.js'
import Map from '../src/ol/Map.js';
import OSM from '../src/ol/source/OSM.js';
import TileLayer from '../src/ol/layer/Tile.js';
import View from '../src/ol/View.js';
import { getCenter as getExtentCenter } from '../src/ol/extent.js';
import proj4 from 'proj4';
import {register} from '../src/ol/proj/proj4.js';
import { get as getProj } from '../src/ol/proj.js';

// =========================== //
//  Edit these variables START //
// =========================== //

// Get from: http://localhost:6543/api/proj4?code=EPSG:32198
const code = 'EPSG:32198'
const def = '+proj=lcc +lat_1=60 +lat_2=46 +lat_0=44 +lon_0=-68.5 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs'
const geodeticExtent = [-79.85,44.99,-57.1,62.62]
const projectedExtent = [-893275.48,181371.95,586959.6,2112794.12]
const displayExtent = [-1100000,-100000,1100000,2300000]

// ========================= //
//  Edit these variables END //
// ========================= //


proj4.defs(code, def)
register(proj4);

let center
const olProj = getProj(code);
var olProjExtent = displayExtent || projectedExtent
if (olProjExtent) {
  olProj.setExtent(olProjExtent);
  center = getExtentCenter(projectedExtent)
}

if (!olProj.getWorldExtent()) {
  olProj.setWorldExtent(geodeticExtent);
}

if (!center) {
  center = [0, 0]
}

const view = new View({
  center: center,
  constrainResolution: true,
  extent: olProj.getExtent(),
  multiWorld: false,
  projection: code,
  showFullExtent: true,
  zoom: 0,
})

const map = new Map({
  interactions: interactionDefaults({
    altShiftDragRotate: false,
    pinchRotate: false,
    mouseWheelZoom: false,
  }).extend([
    new InteractionMouseWheelZoom({
      constrainResolution: true,
    }),
  ]),
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  target: 'map',
  view: view,
});

const epsg3857DefaultMinResolution = 0.03732276771737122 // a.k.a. default max zoom
const epsg3857MinResolution = 0.00029158412279196264


const resolutions = []

let defaultMaxZoom = null
let zoom = 0

while (true) {
  const resolution = view.getResolutionForZoom(zoom)
  if (resolution < epsg3857DefaultMinResolution && defaultMaxZoom === null) {
    defaultMaxZoom = zoom - 1
  }
  if (resolution < epsg3857MinResolution) {
    break
  }
  resolutions.push(resolution)
  zoom++
}
console.log('Resolutions:', resolutions);
console.log('Default min zoom:', 1);
console.log('Default max zoom:', defaultMaxZoom);

const resolutionEl = document.getElementById('resolution');
const zoomEl = document.getElementById('zoom');
map.on('moveend', () => {
  const view = map.getView();
  resolutionEl.value = view.getResolution();
  zoomEl.value = view.getZoom();
})
