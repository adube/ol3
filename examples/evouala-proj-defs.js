// Generated from eVouala. To re-generate:
// 1) erase the array
// 2) make sure you have all projections installed in eVouala
// 3) visit the Library page in eVouala
// 4) write in the console:
//   `eVoualaSettings.supported_projections_context`
// 5) Right-click on the result, then click "Copy object"
// 6) Paste the result here
export const eVoualaProjDefs =
  [
    {
      "srid": 3005,
      "code": "EPSG:3005",
      "proj4": "+proj=aea +lat_1=50 +lat_2=58.5 +lat_0=45 +lon_0=-126 +x_0=1000000 +y_0=0 +datum=NAD83 +units=m +no_defs ",
      "wkt": "PROJCS[\"NAD83 / BC Albers\",GEOGCS[\"NAD83\",DATUM[\"North_American_Datum_1983\",SPHEROID[\"GRS 1980\",6378137,298.257222101,AUTHORITY[\"EPSG\",\"7019\"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY[\"EPSG\",\"6269\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4269\"]],PROJECTION[\"Albers_Conic_Equal_Area\"],PARAMETER[\"standard_parallel_1\",50],PARAMETER[\"standard_parallel_2\",58.5],PARAMETER[\"latitude_of_center\",45],PARAMETER[\"longitude_of_center\",-126],PARAMETER[\"false_easting\",1000000],PARAMETER[\"false_northing\",0],UNIT[\"metre\",1,AUTHORITY[\"EPSG\",\"9001\"]],AXIS[\"Easting\",EAST],AXIS[\"Northing\",NORTH],AUTHORITY[\"EPSG\",\"3005\"]]",
      "name": "NAD83 / BC Albers",
      "datum": "NAD83",
      "geodetic_extent": [
        -139.05,
        48.3,
        -114.03,
        60
      ],
      "projected_extent": [
        35043.6538,
        440006.8768,
        1885895.3117,
        1735643.8497
      ],
      "display_extent": [
        -400000,
        100000,
        2170000,
        2100000
      ]
    },
    {
      "srid": 3347,
      "code": "EPSG:3347",
      "proj4": "+proj=lcc +lat_1=49 +lat_2=77 +lat_0=63.390675 +lon_0=-91.86666666666666 +x_0=6200000 +y_0=3000000 +datum=NAD83 +units=m +no_defs ",
      "wkt": "PROJCS[\"NAD83 / Statistics Canada Lambert\",GEOGCS[\"NAD83\",DATUM[\"North_American_Datum_1983\",SPHEROID[\"GRS 1980\",6378137,298.257222101,AUTHORITY[\"EPSG\",\"7019\"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY[\"EPSG\",\"6269\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4269\"]],PROJECTION[\"Lambert_Conformal_Conic_2SP\"],PARAMETER[\"standard_parallel_1\",49],PARAMETER[\"standard_parallel_2\",77],PARAMETER[\"latitude_of_origin\",63.390675],PARAMETER[\"central_meridian\",-91.86666666666666],PARAMETER[\"false_easting\",6200000],PARAMETER[\"false_northing\",3000000],UNIT[\"metre\",1,AUTHORITY[\"EPSG\",\"9001\"]],AXIS[\"Easting\",EAST],AXIS[\"Northing\",NORTH],AUTHORITY[\"EPSG\",\"3347\"]]",
      "name": "NAD83 / Statistics Canada Lambert",
      "datum": "NAD83",
      "geodetic_extent": [
        -141.15,
        41.68,
        -48.06,
        85.05
      ],
      "projected_extent": [
        2365553.3321,
        1851486.321,
        9683442.0814,
        5606232.2754
      ],
      "display_extent": [
        1450000,
        0,
        10500000,
        6000000
      ]
    },
    {
      "srid": 3573,
      "code": "EPSG:3573",
      "proj4": "+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs ",
      "wkt": "PROJCS[\"WGS 84 / North Pole LAEA Canada\",GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]],PROJECTION[\"Lambert_Azimuthal_Equal_Area\"],PARAMETER[\"latitude_of_center\",90],PARAMETER[\"longitude_of_center\",-100],PARAMETER[\"false_easting\",0],PARAMETER[\"false_northing\",0],UNIT[\"metre\",1,AUTHORITY[\"EPSG\",\"9001\"]],AXIS[\"X\",EAST],AXIS[\"Y\",NORTH],AUTHORITY[\"EPSG\",\"3573\"]]",
      "name": "WGS 84 / North Pole LAEA Canada",
      "datum": "WGS84",
      "geodetic_extent": [
        -180,
        45,
        180,
        90
      ],
      "projected_extent": [
        -4815054.821,
        -849024.0785,
        0,
        0
      ],
      "display_extent": [
        -4815055,
        -4815055,
        4815055,
        4815055
      ]
    },
    {
      "srid": 3857,
      "code": "EPSG:3857",
      "proj4": "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs",
      "wkt": "PROJCS[\"WGS 84 / Pseudo-Mercator\",GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]],PROJECTION[\"Mercator_1SP\"],PARAMETER[\"central_meridian\",0],PARAMETER[\"scale_factor\",1],PARAMETER[\"false_easting\",0],PARAMETER[\"false_northing\",0],UNIT[\"metre\",1,AUTHORITY[\"EPSG\",\"9001\"]],AXIS[\"X\",EAST],AXIS[\"Y\",NORTH],EXTENSION[\"PROJ4\",\"+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs\"],AUTHORITY[\"EPSG\",\"3857\"]]",
      "name": "WGS 84 / Pseudo-Mercator",
      "datum": "WGS84",
      "geodetic_extent": [
        -180,
        -85.06,
        180,
        85.06
      ],
      "projected_extent": [
        -20037508.342789244,
        -20037508.342789244,
        20037508.342789244,
        20037508.342789244
      ],
      "display_extent": [
        -20037508.342789244,
        -20037508.342789244,
        20037508.342789244,
        20037508.342789244
      ]
    },
    {
      "srid": 3978,
      "code": "EPSG:3978",
      "proj4": "+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs ",
      "wkt": "PROJCS[\"NAD83 / Canada Atlas Lambert\",GEOGCS[\"NAD83\",DATUM[\"North_American_Datum_1983\",SPHEROID[\"GRS 1980\",6378137,298.257222101,AUTHORITY[\"EPSG\",\"7019\"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY[\"EPSG\",\"6269\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4269\"]],PROJECTION[\"Lambert_Conformal_Conic_2SP\"],PARAMETER[\"standard_parallel_1\",49],PARAMETER[\"standard_parallel_2\",77],PARAMETER[\"latitude_of_origin\",49],PARAMETER[\"central_meridian\",-95],PARAMETER[\"false_easting\",0],PARAMETER[\"false_northing\",0],UNIT[\"metre\",1,AUTHORITY[\"EPSG\",\"9001\"]],AXIS[\"Easting\",EAST],AXIS[\"Northing\",NORTH],AUTHORITY[\"EPSG\",\"3978\"]]",
      "name": "NAD83 / Canada Atlas Lambert",
      "datum": "NAD83",
      "geodetic_extent": [
        -141.01,
        38.21,
        -40.72,
        86.46
      ],
      "projected_extent": [
        -3894481.38,
        243795.64,
        371740.59,
        4329826.84
      ],
      "display_extent": [
        -5500000,
        -2350000,
        6000000,
        5200000
      ]
    },
    {
      "srid": 4326,
      "code": "EPSG:4326",
      "proj4": "+proj=longlat +datum=WGS84 +no_defs ",
      "wkt": "GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]]",
      "name": "WGS84",
      "datum": "WGS84",
      "geodetic_extent": [
        -180,
        -90,
        180,
        90
      ],
      "projected_extent": [
        -180,
        -90,
        180,
        90
      ],
      "display_extent": [
        -180,
        -90,
        180,
        90
      ]
    },
    {
      "srid": 27700,
      "code": "EPSG:27700",
      "proj4": "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +datum=OSGB36 +units=m +no_defs ",
      "wkt": "PROJCS[\"OSGB 1936 / British National Grid\",GEOGCS[\"OSGB 1936\",DATUM[\"OSGB_1936\",SPHEROID[\"Airy 1830\",6377563.396,299.3249646,AUTHORITY[\"EPSG\",\"7001\"]],TOWGS84[446.448,-125.157,542.06,0.15,0.247,0.842,-20.489],AUTHORITY[\"EPSG\",\"6277\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4277\"]],PROJECTION[\"Transverse_Mercator\"],PARAMETER[\"latitude_of_origin\",49],PARAMETER[\"central_meridian\",-2],PARAMETER[\"scale_factor\",0.9996012717],PARAMETER[\"false_easting\",400000],PARAMETER[\"false_northing\",-100000],UNIT[\"metre\",1,AUTHORITY[\"EPSG\",\"9001\"]],AXIS[\"Easting\",EAST],AXIS[\"Northing\",NORTH],AUTHORITY[\"EPSG\",\"27700\"]]",
      "name": "British National Grid",
      "datum": "OSGB36",
      "geodetic_extent": [
        -10,
        49,
        2.994,
        60.862
      ],
      "projected_extent": [
        -184816.175,
        -69092.958,
        671196.3657,
        1230275.0454
      ],
      "display_extent": null
    },
    {
      "srid": 32198,
      "code": "EPSG:32198",
      "proj4": "+proj=lcc +lat_1=60 +lat_2=46 +lat_0=44 +lon_0=-68.5 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs ",
      "wkt": "PROJCS[\"NAD83 / Quebec Lambert\",GEOGCS[\"NAD83\",DATUM[\"North_American_Datum_1983\",SPHEROID[\"GRS 1980\",6378137,298.257222101,AUTHORITY[\"EPSG\",\"7019\"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY[\"EPSG\",\"6269\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4269\"]],PROJECTION[\"Lambert_Conformal_Conic_2SP\"],PARAMETER[\"standard_parallel_1\",60],PARAMETER[\"standard_parallel_2\",46],PARAMETER[\"latitude_of_origin\",44],PARAMETER[\"central_meridian\",-68.5],PARAMETER[\"false_easting\",0],PARAMETER[\"false_northing\",0],UNIT[\"metre\",1,AUTHORITY[\"EPSG\",\"9001\"]],AXIS[\"X\",EAST],AXIS[\"Y\",NORTH],AUTHORITY[\"EPSG\",\"32198\"]]",
      "name": "NAD83 / Quebec Lambert",
      "datum": "NAD83",
      "geodetic_extent": [
        -79.85,
        44.99,
        -57.1,
        62.62
      ],
      "projected_extent": [
        -893275.48,
        181371.95,
        586959.6,
        2112794.12
      ],
      "display_extent": [
        -1100000,
        -100000,
        1100000,
        2300000
      ]
    }
  ]
;
