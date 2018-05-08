export default {
    "version": 0.1,    
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
        "layers": [
            {
                "name": "standaard",
                "urlname": "brtachtergrondkaart"                
            },
            {
                "name": "grijs",
                "urlname": "brtachtergrondkaartgrijs"
            },
            {
                "name": "pastel",
                "urlname": "brtachtergrondkaartpastel"
            },{
                "name": "luchtfoto",
                "urlname": "2016_ortho25",
                "url": "https://geodata.nationaalgeoregister.nl/luchtfoto/rgb",
                "format": "jpeg"
            }
        ]
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
        "layers": [
            {
                "name": "gebouwen",
                "workSpaceName": "bag",
                "layerName": "pand"
            },
            {
                "name": "percelen",
                "workSpaceName": "bkadastralekaartv3ag",
                "layerName": "kadastralekaart"
            },
            {
                "name": "drone-no-fly-zones",
                "workSpaceName": "dronenoflyzones",
                "layerName": "luchtvaartgebieden,landingsite"
            },
            {
                "name": "hoogte",
                "workSpaceName": "ahn2",
                "layerName": "ahn2_05m_int",
                "styleName": "ahn2:ahn2_05m_detail"
            },
            {
                "name": "gemeenten",
                "workSpaceName": "bestuurlijkegrenzen",
                "layerName": "gemeenten",
                "styleName": "bestuurlijkegrenzen:bestuurlijkegrenzen_gemeentegrenzen"
            },
            {
                "name": "provincies",
                "workSpaceName": "bestuurlijkegrenzen",
                "layerName": "provincies",
                "styleName": "bestuurlijkegrenzen:bestuurlijkegrenzen_provinciegrenzen"
            }
        ]
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
        "extent": [-180,-90,180,90]
    },
    "marker": {
      "url": "./assets/img/marker_icon.svg",
      "iconSize": [64, 64],
      "iconAnchor": [63, 32]
    },
    "classnames": {
        'geocoderContainer': ['embed-search'], //nlmaps-geocoder-control-container
        'geocoderSearch': ['invoer'], // nlmaps-geocoder-control-search
        'geocoderButton': ['primary','action','embed-search__button'], //nlmaps-geocoder-control-button
        'geocoderResultList': ['embed-search__auto-suggest'], //nlmaps-geocoder-result-list 
        'geocoderResultItem' : ['embed-search__auto-suggest__item'] //nlmaps-geocoder-result-item
    }
}
