"use strict";function err(e){throw e}function mergeConfig(e,t){return Object.assign({},e,t)}function parseBase(e){var t=mergeConfig(CONFIG.BASE_DEFAULTS,e.defaults);(!e.layers||e.layers.length<0)&&err("no basemap defined, please define a basemap in the configuration"),e.layers.forEach(function(e){e.name&&void 0===CONFIG.BASEMAP_PROVIDERS[e.name]||err("basemap names need to be defined and unique: "+e.name),CONFIG.BASEMAP_PROVIDERS[e.name]=formatBasemapUrl(mergeConfig(t,e))})}function parseWMS(e){var t=mergeConfig(CONFIG.WMS_DEFAULTS,e.defaults);e.layers&&e.layers.forEach(function(e){e.name&&void 0===CONFIG.WMS_PROVIDERS[e.name]||err("wms names need to be defined and unique: "+e.name),CONFIG.WMS_PROVIDERS[e.name]=applyTemplate(mergeConfig(t,e))})}function parseGeocoder(e){CONFIG.GEOCODER.lookupUrl=e.lookupUrl,CONFIG.GEOCODER.suggestUrl=e.suggestUrl,CONFIG.GEOCODER.placeholder=e.placeholder}function parseMap(e){CONFIG.MAP=mergeConfig(CONFIG.MAP,e)}function formatBasemapUrl(e){switch(e.type){case"wmts":e.url=e.url+"/"+e.type+"/"+e.layerName+"/"+e.crs+"/{z}/{x}/{y}."+e.format;break;case"tms":e.url=e.url+"/"+e.layerName+"/{z}/{x}/{y}."+e.format;break;default:e.url=e.url+"/"+e.type+"/"+e.layerName+"/"+e.crs+"/{z}/{x}/{y}."+e.format}return e}function applyTemplate(e){var t=e.url.indexOf("{");if(t>-1){var o=e.url.indexOf("}");"workspacename"===e.url.slice(t+1,o).toLowerCase()?e.url=e.url.slice(0,t)+e.workSpaceName+e.url.slice(o+1,-1):err("only workspacename templates are supported for now")}return e}function parseFeatureQuery(e){CONFIG.FEATUREQUERYBASEURL=e}function parseClasses(e){CONFIG.CLASSNAMES=mergeConfig(CONFIG.CLASSNAMES,e)}function parseMarker(e){CONFIG.MARKER=e}function httpGetAsync(e){return new Promise(function(t,o){var r=new XMLHttpRequest;r.onreadystatechange=function(){4==r.readyState&&200==r.status&&t(JSON.parse(r.responseText))},r.open("GET",e,!0),r.send(null)})}function wktPointToGeoJson(e){if(!e.includes("POINT"))throw TypeError("Provided WKT geometry is not a point.");var t=e.split("(")[1].split(")")[0];return{type:"Point",coordinates:[parseFloat(t.split(" ")[0]),parseFloat(t.split(" ")[1])]}}function parseClasses$1(e,t){t.forEach(function(t){e.classList.add(t)})}function getMarker(){return CONFIG.MARKER}function getProvider(e){if(e in CONFIG.BASEMAP_PROVIDERS){var t=CONFIG.BASEMAP_PROVIDERS[e];return t.deprecated&&console&&console.warn&&console.warn(e+" is a deprecated style; it will be redirected to its replacement. For performance improvements, please change your reference."),t}console.error("NL Maps error: You asked for a style which does not exist! Available styles: "+Object.keys(PROVIDERS).join(", "))}function getWmsProvider(e,t){var o=void 0;return e in CONFIG.WMS_PROVIDERS?(o=CONFIG.WMS_PROVIDERS[e]).deprecated&&console&&console.warn&&console.warn(e+" is a deprecated wms; it will be redirected to its replacement. For performance improvements, please change your reference."):(o=Object.assign({},CONFIG.WMS_DEFAULTS,t),console.log("NL Maps: You asked for a wms which does not exist! Available wmses: "+Object.keys(CONFIG.WMS_PROVIDERS).join(", ")+". Provide an options object to make your own WMS.")),o}function AttributionControl(e,t){if("object"===("undefined"==typeof google?"undefined":_typeof(google))&&"object"===_typeof(google.maps)){var o=document.createElement("div");o.style.backgroundColor="#fff",o.style.opacity="0.7",o.style.border="2px solid #fff",o.style.cursor="pointer",e.appendChild(o);var r=document.createElement("div");return r.style.color="rgb(25,25,25)",r.style.fontFamily="Roboto,Arial,sans-serif",r.style.fontSize="10px",r.innerHTML=t,o.appendChild(r),e.index=1,e}throw"google is not defined"}function geoLocatorControl(e,t){var o=document.createElement("div");return o.id="nlmaps-geolocator-control",o.style.backgroundColor="#fff",o.style.cursor="pointer",o.style.boxShadow="0 1px 5px rgba(0, 0, 0, 0.65)",o.style.height="26px",o.style.width="26px",o.style.borderRadius="26px 26px",o.style.margin=".5em",o.addEventListener("click",function(){e.start()},this),e.on("position",function(e){t.setCenter({lat:e.coords.latitude,lng:e.coords.longitude})}),o}function zoomTo(e,t){t.setCenter({lat:e.coordinates[1],lng:e.coordinates[0]}),t.setZoom(18)}function indexOfMapControl(e,t){return e.getArray().indexOf(t)}function toggleAttrControl(e,t){var o=t.getMapTypeId(),r=t.controls[google.maps.ControlPosition.BOTTOM_RIGHT],n=indexOfMapControl(r,e);"roadmap"===o||"hybrid"===o||"sattelite"===o?n>-1&&r.removeAt(n):-1===n&&r.push(e)}function makeGoogleAttrControl(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e,t=arguments[1],o=new AttributionControl(document.createElement("div"),t);e.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(o),e.addListener("maptypeid_changed",function(){return toggleAttrControl(o,e)})}function makeGoogleLayerOpts(e){return{getTileUrl:function(t,o){var r=e.url,n={z:o,x:t.x,y:t.y};for(var a in n)r=r.replace("{"+a+"}",n[a]);return r},tileSize:new google.maps.Size(256,256),isPng:!0,name:e.name,maxZoom:e.maxZoom,minZoom:e.minZoom}}function getWmsTiledOptions(e){return{baseUrl:e.url,layers:e.layerName,styles:e.styleName,format:e.format,transparent:e.transparent,opacity:.7}}function bgLayer(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"standaard";if("object"===("undefined"==typeof google?"undefined":_typeof(google))&&"object"===_typeof(google.maps)){var o=getProvider(t),r=makeGoogleLayerOpts(o),n=new google.maps.ImageMapType(r),a=e||this.map||"undefined";return void 0!==a&&makeGoogleAttrControl(a,o.attribution),n}throw"google is not defined"}function toMercator(e){var t=e.lat(),o=e.lng();if(!(Math.abs(o)>180||Math.abs(t)>90)){var r=.017453292519943295*t;return{x:6378137*(.017453292519943295*o),y:3189068.5*Math.log((1+Math.sin(r))/(1-Math.sin(r)))}}}function WMSTiled(e,t){var o={getTileUrl:function(o,r){var n=e.getProjection(),a=Math.pow(2,r),s=n.fromPointToLatLng(new google.maps.Point(256*o.x/a,256*o.y/a)),l=n.fromPointToLatLng(new google.maps.Point(256*(o.x+1)/a,256*(o.y+1)/a)),i=toMercator(s),c=toMercator(l),d=i.x+","+c.y+","+c.x+","+i.y,u=t.baseUrl;return u+="SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG:3857",u+="&WIDTH=256",u+="&HEIGHT=256",u+="&LAYERS="+t.layers,u+="&STYLES="+t.styles,u+="&BBOX="+d,u+="&FORMAT="+t.format,u+="&TRANSPARENT="+t.transparent},tileSize:new google.maps.Size(256,256),isPng:!0},r=new google.maps.ImageMapType(o);return r.setOpacity(t.opacity),e.overlayMapTypes.push(r)}function overlayLayer(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e,t=new WMSTiled(e,getWmsTiledOptions(getWmsProvider(arguments[1],arguments[2])));return t.name="wms",t}function markerLayer(e){var t=void 0,o=void 0;if(void 0===e){var r=getMapCenter(map);t=r.latitude,o=r.longitude}else t=e.latitude,o=e.longitude;var n=new google.maps.LatLng(t,o);return new google.maps.Marker({title:"marker",position:n,icon:getMarker().url})}function getMapCenter(e){return{latitude:e.getCenter().lat(),longitude:e.getCenter().lng()}}function geocoderControl(e,t){var o=geocoder.createControl(zoomTo,e,t);e.getDiv().appendChild(o)}Object.defineProperty(exports,"__esModule",{value:!0});var config={version:.2,basemaps:{defaults:{crs:"EPSG:3857",attribution:"Kaartgegevens &copy; <a href='https://www.kadaster.nl'>Kadaster</a> |             <a href='https://www.verbeterdekaart.nl'>Verbeter de kaart</a>",minZoom:6,maxZoom:19,type:"wmts",format:"png",url:"https://geodata.nationaalgeoregister.nl/tiles/service"},layers:[{name:"standaard",layerName:"brtachtergrondkaart"},{name:"grijs",layerName:"brtachtergrondkaartgrijs"},{name:"pastel",layerName:"brtachtergrondkaartpastel"},{name:"luchtfoto",layerName:"2016_ortho25",url:"https://geodata.nationaalgeoregister.nl/luchtfoto/rgb",format:"jpeg"}]},wms:{defaults:{url:"https://geodata.nationaalgeoregister.nl/{workSpaceName}/wms?",version:"1.1.1",transparent:!0,format:"image/png",minZoom:0,maxZoom:24},layers:[{name:"gebouwen",workSpaceName:"bag",layerName:"pand"},{name:"percelen",workSpaceName:"bkadastralekaartv3ag",layerName:"kadastralekaart"},{name:"drone-no-fly-zones",workSpaceName:"dronenoflyzones",layerName:"luchtvaartgebieden,landingsite"},{name:"hoogte",workSpaceName:"ahn2",layerName:"ahn2_05m_int",styleName:"ahn2:ahn2_05m_detail"},{name:"gemeenten",workSpaceName:"bestuurlijkegrenzen",layerName:"gemeenten",styleName:"bestuurlijkegrenzen:bestuurlijkegrenzen_gemeentegrenzen"},{name:"provincies",workSpaceName:"bestuurlijkegrenzen",layerName:"provincies",styleName:"bestuurlijkegrenzen:bestuurlijkegrenzen_provinciegrenzen"}]},geocoder:{suggestUrl:"https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?",lookupUrl:"https://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup?",placeholder:"Zoomen naar adres ..."},map:{style:"standaard",center:{latitude:52.093249,longitude:5.111994},zoom:8,attribution:!0,extent:[-180,-90,180,90],zoomposition:"topright"},marker:{url:"./assets/img/marker_icon.svg",iconSize:[64,64],iconAnchor:[63,32]},classnames:{geocoderContainer:["nlmaps-geocoder-control-container"],geocoderSearch:["nlmaps-geocoder-control-search"],geocoderButton:["nlmaps-geocoder-control-button"],geocoderResultList:["nlmaps-geocoder-result-list"],geocoderResultItem:["nlmaps-geocoder-result-item"],geocoderResultSelected:["nlmaps-geocoder-result-selected"]}},CONFIG={};CONFIG.BASE_DEFAULTS={crs:"EPSG:3857",attr:"",minZoom:0,maxZoom:19,type:"wmts",format:"png",url:""},CONFIG.WMS_DEFAULTS={url:"",version:"1.1.1",transparent:!0,format:"image/png",minZoom:0,maxZoom:24,styleName:""},CONFIG.BASEMAP_PROVIDERS={},CONFIG.WMS_PROVIDERS={},CONFIG.GEOCODER={},CONFIG.MAP={zoomposition:"bottomleft"},CONFIG.MARKER={},CONFIG.CLASSNAMES={geocoderContainer:["nlmaps-geocoder-control-container"],geocoderSearch:["nlmaps-geocoder-control-search"],geocoderButton:["nlmaps-geocoder-control-button"],geocoderResultList:["nlmaps-geocoder-result-list"],geocoderResultItem:["nlmaps-geocoder-result-item"]},.2!==config.version&&err("unsupported config version"),void 0!==config.featureQuery&&parseFeatureQuery(config.featureQuery.baseUrl),void 0!==config.map&&parseMap(config.map),parseBase(config.basemaps),void 0!==config.wms&&parseWMS(config.wms),void 0!==config.geocoder&&parseGeocoder(config.geocoder),void 0!==config.marker&&parseMarker(config.marker),void 0!==config.classnames&&parseClasses(config.classnames);var geocoder=CONFIG.GEOCODER;geocoder.resultList=[],geocoder.selectedResult=-1,geocoder.doSuggestRequest=function(e){return httpGetAsync(this.suggestUrl+"q="+encodeURIComponent(e))},geocoder.doLookupRequest=function(e){return httpGetAsync(this.lookupUrl+"id="+encodeURIComponent(e)).then(function(e){var t=e.response.docs[0];return t.centroide_ll=wktPointToGeoJson(t.centroide_ll),t.centroide_rd=wktPointToGeoJson(t.centroide_rd),t})},geocoder.createControl=function(e,t,o){var r=this;this.zoomTo=e,this.map=t,this.nlmaps=o;var n=document.createElement("div"),a=document.createElement("form"),s=document.createElement("input"),l=document.createElement("button"),i=document.createElement("div");return parseClasses$1(n,CONFIG.CLASSNAMES.geocoderContainer),parseClasses$1(a,CONFIG.CLASSNAMES.geocoderSearch),n.addEventListener("click",function(e){return e.stopPropagation()}),n.addEventListener("dblclick",function(e){return e.stopPropagation()}),s.id="nlmaps-geocoder-control-input",s.placeholder=geocoder.placeholder,s.setAttribute("aria-label",geocoder.placeholder),s.setAttribute("type","text"),s.setAttribute("autocapitalize","off"),s.setAttribute("autocomplete","off"),s.setAttribute("autocorrect","off"),s.setAttribute("spellcheck","false"),s.addEventListener("keydown",function(e){var t=r.resultList;r.resultList.length>0&&("ArrowDown"!==e.code&&40!==e.keyCode||(r.selectedResult<r.resultList.length-1&&r.selectedResult++,r.showLookupResult(t[r.selectedResult])),"ArrowUp"!==e.code&&38!==e.keyCode||(r.selectedResult>0&&r.selectedResult--,r.showLookupResult(t[r.selectedResult])),"Escape"===e.code&&r.clearSuggestResults(!0))}),s.addEventListener("input",function(e){r.suggest(e.target.value)}),s.addEventListener("focus",function(e){r.suggest(e.target.value)}),l.setAttribute("type","submit"),a.addEventListener("submit",function(e){e.preventDefault(),r.resultList.length>0&&r.lookup(r.resultList[r.selectedResult<0?0:r.selectedResult].id)}),l.setAttribute("aria-label",geocoder.placeholder),parseClasses$1(l,CONFIG.CLASSNAMES.geocoderButton),i.id="nlmaps-geocoder-control-results",parseClasses$1(i,CONFIG.CLASSNAMES.geocoderResultList),i.classList.add("nlmaps-hidden"),n.appendChild(a),a.appendChild(s),a.appendChild(l),n.appendChild(i),n},geocoder.suggest=function(e){var t=this;if(e.length<3)return void this.clearSuggestResults();this.doSuggestRequest(e).then(function(e){t.resultList=e.response.docs,t.showSuggestResults(t.resultList)})},geocoder.lookup=function(e){var t=this;this.doLookupRequest(e).then(function(e){t.zoomTo(e.centroide_ll,t.map),t.nlmaps.emit("search-select",{location:e.weergavenaam,latlng:e.centroide_ll,resultObject:e}),t.showLookupResult(e),t.clearSuggestResults()})},geocoder.clearSuggestResults=function(e){this.selectedResult=-1,e&&(document.getElementById("nlmaps-geocoder-control-input").value=""),document.getElementById("nlmaps-geocoder-control-results").innerHTML="",document.getElementById("nlmaps-geocoder-control-results").classList.add("nlmaps-hidden")},geocoder.showLookupResult=function(e){var t=document.getElementsByClassName(CONFIG.CLASSNAMES.geocoderResultItem);Array.prototype.map.call(t,function(e){return e.classList.remove(CONFIG.CLASSNAMES.geocoderResultSelected)});var o=document.getElementById(e.id);o&&o.classList.add(CONFIG.CLASSNAMES.geocoderResultSelected),document.getElementById("nlmaps-geocoder-control-input").value=e.weergavenaam},geocoder.showSuggestResults=function(e){var t=this;if(this.clearSuggestResults(),e.length>0){var o=document.createElement("ul");e.forEach(function(e){var r=document.createElement("li"),n=document.createElement("a");n.innerHTML=e.weergavenaam,n.id=e.id,parseClasses$1(n,CONFIG.CLASSNAMES.geocoderResultItem),n.setAttribute("href","#"),n.addEventListener("click",function(e){e.preventDefault(),t.lookup(e.target.id)}),r.appendChild(n),o.appendChild(r)}),document.getElementById("nlmaps-geocoder-control-results").classList.remove("nlmaps-hidden"),document.getElementById("nlmaps-geocoder-control-results").appendChild(o)}};var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};exports.bgLayer=bgLayer,exports.overlayLayer=overlayLayer,exports.markerLayer=markerLayer,exports.getMapCenter=getMapCenter,exports.geoLocatorControl=geoLocatorControl,exports.geocoderControl=geocoderControl;
//# sourceMappingURL=nlmaps-googlemaps.cjs.js.map
