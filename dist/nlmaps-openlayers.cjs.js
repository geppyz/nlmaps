'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var config = {
    "version": 0.2,
    "basemaps": {
        "defaults": {
            "crs": "EPSG:3857",
            "attribution": "Kaartgegevens &copy; <a href='https://www.kadaster.nl'>Kadaster</a> | \
            <a href='https://www.verbeterdekaart.nl'>Verbeter de kaart</a>",
            "minZoom": 6,
            "maxZoom": 19,
            "type": "wmts",
            "format": "png",
            "url": "https://geodata.nationaalgeoregister.nl/tiles/service"
        },
        "layers": [{
            "name": "standaard",
            "layerName": "brtachtergrondkaart"
        }, {
            "name": "grijs",
            "layerName": "brtachtergrondkaartgrijs"
        }, {
            "name": "pastel",
            "layerName": "brtachtergrondkaartpastel"
        }, {
            "name": "luchtfoto",
            "layerName": "2016_ortho25",
            "url": "https://geodata.nationaalgeoregister.nl/luchtfoto/rgb",
            "format": "jpeg"
        }]
    },
    "wms": {
        "defaults": {
            "url": "https://geodata.nationaalgeoregister.nl/{workSpaceName}/wms?",
            "version": "1.1.1",
            "transparent": true,
            "format": "image/png",
            "minZoom": 0,
            "maxZoom": 24
        },
        "layers": [{
            "name": "gebouwen",
            "workSpaceName": "bag",
            "layerName": "pand"
        }, {
            "name": "percelen",
            "workSpaceName": "bkadastralekaartv3ag",
            "layerName": "kadastralekaart"
        }, {
            "name": "drone-no-fly-zones",
            "workSpaceName": "dronenoflyzones",
            "layerName": "luchtvaartgebieden,landingsite"
        }, {
            "name": "hoogte",
            "workSpaceName": "ahn2",
            "layerName": "ahn2_05m_int",
            "styleName": "ahn2:ahn2_05m_detail"
        }, {
            "name": "gemeenten",
            "workSpaceName": "bestuurlijkegrenzen",
            "layerName": "gemeenten",
            "styleName": "bestuurlijkegrenzen:bestuurlijkegrenzen_gemeentegrenzen"
        }, {
            "name": "provincies",
            "workSpaceName": "bestuurlijkegrenzen",
            "layerName": "provincies",
            "styleName": "bestuurlijkegrenzen:bestuurlijkegrenzen_provinciegrenzen"
        }]
    },
    "geocoder": {
        "suggestUrl": "https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?",
        "lookupUrl": "https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup?"
    },
    "map": {
        "style": 'standaard',
        "center": {
            "latitude": 52.093249,
            "longitude": 5.111994
        },
        "zoom": 8,
        "attribution": true,
        "extent": [-180, -90, 180, 90],
        "zoomposition": "topright"
    },
    "marker": {
        "url": "./assets/img/marker_icon.svg",
        "iconSize": [64, 64],
        "iconAnchor": [63, 32]
    },
    "classnames": {
        'geocoderContainer': ['nlmaps-geocoder-control-container'],
        'geocoderSearch': ['nlmaps-geocoder-control-search'],
        'geocoderButton': ['nlmaps-geocoder-control-button'],
        'geocoderResultList': ['nlmaps-geocoder-result-list'],
        'geocoderResultItem': ['nlmaps-geocoder-result-item'],
        'geocoderResultSelected': ['nlmaps-geocoder-result-selected']
    }
};

var CONFIG = {};

CONFIG.BASE_DEFAULTS = {
    crs: "EPSG:3857",
    attr: "",
    minZoom: 0,
    maxZoom: 19,
    type: "wmts",
    format: "png",
    url: ""
};
CONFIG.WMS_DEFAULTS = {
    url: "",
    version: "1.1.1",
    transparent: true,
    format: "image/png",
    minZoom: 0,
    maxZoom: 24,
    styleName: ""
};
CONFIG.BASEMAP_PROVIDERS = {};
CONFIG.WMS_PROVIDERS = {};
CONFIG.GEOCODER = {};
CONFIG.MAP = {
    "zoomposition": "bottomleft"
};
CONFIG.MARKER = {};
CONFIG.CLASSNAMES = {
    'geocoderContainer': ['nlmaps-geocoder-control-container'],
    'geocoderSearch': ['nlmaps-geocoder-control-search'],
    'geocoderButton': ['nlmaps-geocoder-control-button'],
    'geocoderResultList': ['nlmaps-geocoder-result-list'],
    'geocoderResultItem': ['nlmaps-geocoder-result-item']
};

function err(err) {
    throw err;
}

if (config.version !== 0.2) {
    err('unsupported config version');
}

function mergeConfig(defaults, config$$1) {
    return Object.assign({}, defaults, config$$1);
}

function parseBase(basemaps) {
    var defaults = mergeConfig(CONFIG.BASE_DEFAULTS, basemaps.defaults);
    if (!basemaps.layers || basemaps.layers.length < 0) {
        err('no basemap defined, please define a basemap in the configuration');
    }
    basemaps.layers.forEach(function (layer) {
        if (!layer.name || CONFIG.BASEMAP_PROVIDERS[layer.name] !== undefined) {
            err('basemap names need to be defined and unique: ' + layer.name);
        }
        CONFIG.BASEMAP_PROVIDERS[layer.name] = formatBasemapUrl(mergeConfig(defaults, layer));
    });
}
function parseWMS(wms) {
    var defaults = mergeConfig(CONFIG.WMS_DEFAULTS, wms.defaults);
    if (wms.layers) {
        wms.layers.forEach(function (layer) {
            if (!layer.name || CONFIG.WMS_PROVIDERS[layer.name] !== undefined) {
                err('wms names need to be defined and unique: ' + layer.name);
            }
            CONFIG.WMS_PROVIDERS[layer.name] = applyTemplate(mergeConfig(defaults, layer));
        });
    }
}
function parseGeocoder(geocoder) {
    CONFIG.GEOCODER.lookupUrl = geocoder.lookupUrl;
    CONFIG.GEOCODER.suggestUrl = geocoder.suggestUrl;
}
function parseMap(map) {
    CONFIG.MAP = mergeConfig(CONFIG.MAP, map);
}

function formatBasemapUrl(layer) {
    switch (layer.type) {
        case 'wmts':
            layer.url = layer.url + "/" + layer.type + "/" + layer.layerName + "/" + layer.crs + "/{z}/{x}/{y}." + layer.format;
            break;
        case 'tms':
            layer.url = layer.url + "/" + layer.layerName + "/{z}/{x}/{y}." + layer.format;
            break;
        default:
            layer.url = layer.url + "/" + layer.type + "/" + layer.layerName + "/" + layer.crs + "/{z}/{x}/{y}." + layer.format;
    }
    return layer;
}

function applyTemplate(layer) {
    //Check if the url is templated
    var start = layer.url.indexOf('{');
    if (start > -1) {
        var end = layer.url.indexOf('}');
        var template = layer.url.slice(start + 1, end);
        if (template.toLowerCase() === "workspacename") {
            layer.url = layer.url.slice(0, start) + layer.workSpaceName + layer.url.slice(end + 1, -1);
        } else {
            err('only workspacename templates are supported for now');
        }
    }
    return layer;
}

function parseFeatureQuery(baseUrl) {
    CONFIG.FEATUREQUERYBASEURL = baseUrl;
}

function parseClasses(classes) {
    CONFIG.CLASSNAMES = mergeConfig(CONFIG.CLASSNAMES, classes);
}

function parseMarker(marker) {
    CONFIG.MARKER = marker;
}

if (config.featureQuery !== undefined) parseFeatureQuery(config.featureQuery.baseUrl);
if (config.map !== undefined) parseMap(config.map);
parseBase(config.basemaps);
if (config.wms !== undefined) parseWMS(config.wms);
if (config.geocoder !== undefined) parseGeocoder(config.geocoder);
if (config.marker !== undefined) parseMarker(config.marker);
if (config.classnames !== undefined) parseClasses(config.classnames);

var geocoder = CONFIG.GEOCODER;

function httpGetAsync(url) {
    // eslint-disable-next-line no-unused-vars
    return new Promise(function (resolve, reject) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            // eslint-disable-next-line eqeqeq
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                resolve(JSON.parse(xmlHttp.responseText));
            }
        };
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);
    });
}

function wktPointToGeoJson(wktPoint) {
    if (!wktPoint.includes('POINT')) {
        throw TypeError('Provided WKT geometry is not a point.');
    }
    var coordinateTuple = wktPoint.split('(')[1].split(')')[0];
    var x = parseFloat(coordinateTuple.split(' ')[0]);
    var y = parseFloat(coordinateTuple.split(' ')[1]);

    return {
        type: 'Point',
        coordinates: [x, y]
    };
}

geocoder.resultList = [];
geocoder.selectedResult = -1;
/**
 * Make a call to PDOK locatieserver v3 suggest service. This service is meant for geocoder autocomplete functionality. For
 * additional documentation, check https://github.com/PDOK/locatieserver/wiki/API-Locatieserver.
 * @param {string} searchTerm The term which to search for
 */
geocoder.doSuggestRequest = function (searchTerm) {
    return httpGetAsync(this.suggestUrl + 'q=' + encodeURIComponent(searchTerm));
};

/**
 * Make a call to PDOK locatieserver v3 lookup service. This service provides information about objects found through the suggest service. For additional
 * documentation, check: https://github.com/PDOK/locatieserver/wiki/API-Locatieserver
 * @param {string} id The id of the feature that is to be looked up.
 */
geocoder.doLookupRequest = function (id) {
    return httpGetAsync(this.lookupUrl + 'id=' + encodeURIComponent(id)).then(function (lookupResult) {
        // A lookup request should always return 1 result
        var geocodeResult = lookupResult.response.docs[0];
        geocodeResult.centroide_ll = wktPointToGeoJson(geocodeResult.centroide_ll);
        geocodeResult.centroide_rd = wktPointToGeoJson(geocodeResult.centroide_rd);
        return geocodeResult;
    });
};

geocoder.createControl = function (zoomFunction, map, nlmaps) {
    var _this = this;

    this.zoomTo = zoomFunction;
    this.map = map;
    this.nlmaps = nlmaps;
    var container = document.createElement('div');
    var searchDiv = document.createElement('form');
    var input = document.createElement('input');
    var button = document.createElement('button');
    var results = document.createElement('div');

    parseClasses$1(container, CONFIG.CLASSNAMES.geocoderContainer);
    parseClasses$1(searchDiv, CONFIG.CLASSNAMES.geocoderSearch);
    container.addEventListener('click', function (e) {
        return e.stopPropagation();
    });
    container.addEventListener('dblclick', function (e) {
        return e.stopPropagation();
    });

    input.id = 'nlmaps-geocoder-control-input';
    input.placeholder = 'Zoomen naar adres...';

    input.setAttribute('aria-label', 'Zoomen naar adres');
    input.setAttribute('type', 'text');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('spellcheck', 'false');

    input.addEventListener('keydown', function (e) {
        var results = _this.resultList;
        if (_this.resultList.length > 0) {
            if (e.code === 'ArrowDown' || e.keyCode === 40) {
                if (_this.selectedResult < _this.resultList.length - 1) {
                    _this.selectedResult++;
                }
                _this.showLookupResult(results[_this.selectedResult]);
            }
            if (e.code === 'ArrowUp' || e.keyCode === 38) {
                if (_this.selectedResult > 0) {
                    _this.selectedResult--;
                }
                _this.showLookupResult(results[_this.selectedResult]);
            }
            if (e.code === 'Escape') {

                _this.clearSuggestResults(true);
            }
        }
    });
    input.addEventListener('input', function (e) {

        _this.suggest(e.target.value);
    });
    input.addEventListener('focus', function (e) {
        _this.suggest(e.target.value);
    });
    button.setAttribute('type', 'submit');
    searchDiv.addEventListener('submit', function (e) {
        e.preventDefault();
        if (_this.resultList.length > 0) {
            _this.lookup(_this.resultList[_this.selectedResult < 0 ? 0 : _this.selectedResult].id);
        }
    });
    button.setAttribute('aria-label', 'Zoomen naar adres');
    parseClasses$1(button, CONFIG.CLASSNAMES.geocoderButton);

    results.id = 'nlmaps-geocoder-control-results';
    parseClasses$1(results, CONFIG.CLASSNAMES.geocoderResultList);
    results.classList.add('nlmaps-hidden');
    container.appendChild(searchDiv);
    searchDiv.appendChild(input);
    searchDiv.appendChild(button);
    container.appendChild(results);

    return container;
};

geocoder.suggest = function (query) {
    var _this2 = this;

    if (query.length < 3) {
        this.clearSuggestResults();
        return;
    }

    this.doSuggestRequest(query).then(function (results) {
        _this2.resultList = results.response.docs;
        _this2.showSuggestResults(_this2.resultList);
    });
};

geocoder.lookup = function (id) {
    var _this3 = this;

    this.doLookupRequest(id).then(function (result) {
        _this3.zoomTo(result.centroide_ll, _this3.map);
        _this3.nlmaps.emit('search-select', result.centroide_ll);
        _this3.showLookupResult(result);
        _this3.clearSuggestResults();
    });
};

geocoder.clearSuggestResults = function (input) {
    this.selectedResult = -1;
    if (input) document.getElementById('nlmaps-geocoder-control-input').value = '';
    document.getElementById('nlmaps-geocoder-control-results').innerHTML = '';
    document.getElementById('nlmaps-geocoder-control-results').classList.add('nlmaps-hidden');
};

geocoder.showLookupResult = function (result) {
    var resultNodes = document.getElementsByClassName(CONFIG.CLASSNAMES.geocoderResultItem);
    Array.prototype.map.call(resultNodes, function (i) {
        return i.classList.remove(CONFIG.CLASSNAMES.geocoderResultSelected);
    });
    var resultNode = document.getElementById(result.id);
    if (resultNode) resultNode.classList.add(CONFIG.CLASSNAMES.geocoderResultSelected);
    document.getElementById('nlmaps-geocoder-control-input').value = result.weergavenaam;
};

function parseClasses$1(el, classes) {
    classes.forEach(function (classname) {
        el.classList.add(classname);
    });
}

geocoder.showSuggestResults = function (results) {
    var _this4 = this;

    this.clearSuggestResults();
    if (results.length > 0) {
        var resultList = document.createElement('ul');
        results.forEach(function (result) {

            var li = document.createElement('li');
            var a = document.createElement('a');
            a.innerHTML = result.weergavenaam;
            a.id = result.id;
            parseClasses$1(a, CONFIG.CLASSNAMES.geocoderResultItem);
            a.setAttribute('href', '#');
            a.addEventListener('click', function (e) {
                e.preventDefault();
                _this4.lookup(e.target.id);
            });
            li.appendChild(a);
            resultList.appendChild(li);
        });
        document.getElementById('nlmaps-geocoder-control-results').classList.remove('nlmaps-hidden');
        document.getElementById('nlmaps-geocoder-control-results').appendChild(resultList);
    }
};

/*parts copied from maps.stamen.com: https://github.com/stamen/maps.stamen.com/blob/master/js/tile.stamen.js
 * copyright (c) 2012, Stamen Design
 * under BSD 3-Clause license: https://github.com/stamen/maps.stamen.com/blob/master/LICENSE
 */

function getMarker() {
  return CONFIG.MARKER;
}

/*
 * Get the named provider, or throw an exception if it doesn't exist.
 **/
function getProvider(name) {
  if (name in CONFIG.BASEMAP_PROVIDERS) {
    var provider = CONFIG.BASEMAP_PROVIDERS[name];

    // eslint-disable-next-line no-console
    if (provider.deprecated && console && console.warn) {
      // eslint-disable-next-line no-console
      console.warn(name + " is a deprecated style; it will be redirected to its replacement. For performance improvements, please change your reference.");
    }

    return provider;
  } else {
    // eslint-disable-next-line no-console
    console.error('NL Maps error: You asked for a style which does not exist! Available styles: ' + Object.keys(PROVIDERS).join(', '));
  }
}

/*
 * Get the named wmsProvider, or throw an exception if it doesn't exist.
 **/
function getWmsProvider(name, options) {
  var wmsProvider = void 0;
  if (name in CONFIG.WMS_PROVIDERS) {
    wmsProvider = CONFIG.WMS_PROVIDERS[name];

    // eslint-disable-next-line no-console
    if (wmsProvider.deprecated && console && console.warn) {
      // eslint-disable-next-line no-console
      console.warn(name + " is a deprecated wms; it will be redirected to its replacement. For performance improvements, please change your reference.");
    }
  } else {
    wmsProvider = Object.assign({}, CONFIG.WMS_DEFAULTS, options);
    // eslint-disable-next-line no-console
    console.log('NL Maps: You asked for a wms which does not exist! Available wmses: ' + Object.keys(CONFIG.WMS_PROVIDERS).join(', ') + '. Provide an options object to make your own WMS.');
  }
  return wmsProvider;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function bgLayer() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'standaard';

  var provider = getProvider(name);
  //replace leaflet style subdomain to OL style
  if (provider.subdomains) {
    var sub = provider.subdomains;
    provider.url = provider.url.replace('{s}', '{' + sub.slice(0, 1) + '-' + sub.slice(-1) + '}');
  }
  if ((typeof ol === 'undefined' ? 'undefined' : _typeof(ol)) === "object") {
    return new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: provider.url,
        attributions: [new ol.Attribution({
          html: provider.attribution
        })]
      })
    });
  } else {
    throw 'openlayers is not defined';
  }
}
function markerLayer(latLngObject) {
  var markerStyle = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [32, 63],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      src: getMarker().url,
      scale: 1
    })
  });
  var lat = void 0;
  var lng = void 0;

  // eslint-disable-next-line eqeqeq
  if (typeof latLngObject == 'undefined') {
    var mapCenter = getMapCenter(map);
    lat = mapCenter.latitude;
    lng = mapCenter.longitude;
  } else {
    lat = latLngObject.latitude;
    lng = latLngObject.longitude;
  }

  var center = ol.proj.fromLonLat([lng, lat]);

  var markerFeature = new ol.Feature({
    geometry: new ol.geom.Point(center),
    name: 'marker'
  });

  markerFeature.setStyle(markerStyle);

  var markerSource = new ol.source.Vector({
    features: [markerFeature]
  });
  return new ol.layer.Vector({
    source: markerSource
  });
}

function overlayLayer(name, options) {
  var wmsProvider = getWmsProvider(name, options);
  if ((typeof ol === 'undefined' ? 'undefined' : _typeof(ol)) === "object") {
    return new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: wmsProvider.url,
        serverType: 'geoserver',
        params: {
          LAYERS: wmsProvider.layerName,
          VERSION: wmsProvider.version,
          STYLES: wmsProvider.styleName
        }
      })
    });
  } else {
    throw 'openlayers is not defined';
  }
}

function geoLocatorControl(geolocator, map) {
  var myControlEl = document.createElement('div');
  myControlEl.className = 'nlmaps-geolocator-control ol-control';

  myControlEl.addEventListener('click', function () {
    geolocator.start();
  });

  function moveMap(d) {
    var map = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : map;

    var oldZoom = map.getView().getZoom();
    var view = new ol.View({
      center: ol.proj.fromLonLat([d.coords.longitude, d.coords.latitude]),
      zoom: oldZoom
    });
    map.setView(view);
  }
  geolocator.on('position', function (d) {
    moveMap(d, map);
  });
  var control = new ol.control.Control({ element: myControlEl });
  return control;
}

function zoomTo(point, map) {
  var newCenter = ol.proj.fromLonLat(point.coordinates);
  map.getView().setCenter(newCenter);
  map.getView().setZoom(18);
}

function getMapCenter(map) {
  var EPSG3857Coords = map.getView().getCenter();
  var lngLatCoords = ol.proj.toLonLat(EPSG3857Coords);
  return {
    longitude: lngLatCoords[0],
    latitude: lngLatCoords[1]
  };
}

function geocoderControl(map) {
  var control = geocoder.createControl(zoomTo, map);
  control = new ol.control.Control({ element: control });
  map.addControl(control);
}

exports.bgLayer = bgLayer;
exports.overlayLayer = overlayLayer;
exports.markerLayer = markerLayer;
exports.getMapCenter = getMapCenter;
exports.geoLocatorControl = geoLocatorControl;
exports.geocoderControl = geocoderControl;
//# sourceMappingURL=nlmaps-openlayers.cjs.js.map
