/**
 * Example that can be used to produce the list of resolutions
 * per zoom level for each projection supported in eVouala.
 *
 * The list of projection definitions can be found in:
 * evouala-proj-defs.js
 */

import Map from '../src/ol/Map.js';
import OSM from '../src/ol/source/OSM.js';
import TileLayer from '../src/ol/layer/Tile.js';
import View from '../src/ol/View.js';
import { getCenter as getExtentCenter } from '../src/ol/extent.js';
import proj4 from 'proj4';
import {register} from '../src/ol/proj/proj4.js';
import { get as getProj } from '../src/ol/proj.js';
import {eVoualaProjDefs} from './evouala-proj-defs.js';

const minZoom = 0;
const maxZoom = 29;
const defaultCode = 'EPSG:3857';

// Watch the <select> element of projections
const projSelectEl = document.getElementById('proj')
projSelectEl.addEventListener('change', (e) => {
  const projSelectEl = e.target;
  const newCode = projSelectEl.value;

  const newView = eVoualaProjDefCache[newCode].view;
  map.setView(newView);

  const resolutions = [];
  for (var i = minZoom; i <= maxZoom; i++) {
    resolutions.push(newView.getResolutionForZoom(i));
  }
  console.log(`${newCode} resolutions:`);
  console.log(resolutions);
});

// Proj registration and addition to the <select> element
const eVoualaProjDefCache = {}
for (const eVoualaProjDef of eVoualaProjDefs) {
  const code = eVoualaProjDef.code;

  // element
  const optionEl = document.createElement('option');
  optionEl.value = code
  optionEl.textContent = code
  if (code === defaultCode) {
    optionEl.selected = true
  }
  projSelectEl.appendChild(optionEl)

  eVoualaProjDefCache[code] = eVoualaProjDef

  // Add to OL if not defined
  const olProj = getProj(code);
  if (!olProj) {
    proj4.defs(code, eVoualaProjDef.proj4);
  }
}
register(proj4);

// Set extents for each projection, and create an OLView
for (const eVoualaProjDef of eVoualaProjDefs) {
  const code = eVoualaProjDef.code;

  const olProj = getProj(code);
  var projectedExtent = eVoualaProjDef.display_extent || eVoualaProjDef.projected_extent;
  let center;
  if (projectedExtent) {
    // Replace or set the extent with the display_extent or projected_extent
    // if available.
    olProj.setExtent(projectedExtent);
    center = getExtentCenter(projectedExtent)
  }
  if (!olProj.getWorldExtent()) {
    var geodeticExtent = eVoualaProjDef.geodetic_extent;
    olProj.setWorldExtent(geodeticExtent);
  }

  if (!center) {
    center = [0, 0]
  }

  // OL View
  eVoualaProjDefCache[code].view = new View({
    center: center,
    maxZoom: maxZoom,
    minZoom: minZoom,
    projection: code,
    zoom: 0,
  })
}

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  target: 'map',
  view: eVoualaProjDefCache[defaultCode].view
});
