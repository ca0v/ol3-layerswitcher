import ol = require("openlayers");
import LayerSwitcher = require("../src/ol3-layerswitcher");

let map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Group({
            'title': 'Base maps',
            layers: [
                new ol.layer.Group({
                    'title': 'OSM and Water Color',
                    'label-only': true,
                    layers: [
                        new ol.layer.Tile({
                            title: 'Water color',
                            type: 'base',
                            visible: false,
                            source: new ol.source.Stamen({
                                layer: 'watercolor'
                            })
                        }),
                        new ol.layer.Tile({
                            title: 'OSM',
                            type: 'base',
                            visible: false,
                            source: new ol.source.OSM()
                        })
                    ]
                }),
                new ol.layer.Group({
                    title: 'Satellite Views',
                    combine: false,
                    visible: false,
                    layers: [
                        new ol.layer.Tile({
                            title: 'Satellite',
                            type: 'base',
                            visible: false,
                            source: new ol.source.MapQuest({ layer: 'sat' })
                        }),
                        new ol.layer.Tile({
                            title: 'Hybrid',
                            type: 'base',
                            visible: false,
                            source: new ol.source.MapQuest({ layer: 'hyb' })
                        })
                    ]
                }),
                new ol.layer.Tile({
                    title: 'Roads',
                    type: 'base',
                    visible: true,
                    source: new ol.source.MapQuest({ layer: 'osm' })
                })
            ]
        }),
        new ol.layer.Group({
            title: 'Overlays',
            layers: [
                new ol.layer.Group({
                    title: "Countries",
                    layers: [
                        new ol.layer.Tile({
                            title: 'Countries',
                            source: new ol.source.TileWMS({
                                url: 'http://demo.opengeo.org/geoserver/wms',
                                params: { 'LAYERS': 'ne:ne_10m_admin_1_states_provinces_lines_shp' },
                                serverType: 'geoserver'
                            })
                        })
                    ]
                })
            ]
        })
    ],
    view: new ol.View({
        center: ol.proj.transform([-85, 35], 'EPSG:4326', 'EPSG:3857'),
        zoom: 6
    })
});

let layerSwitcher = new LayerSwitcher({
    openOnMouseOver: true
});

layerSwitcher.on("show-layer", (args: { layer: ol.layer.Base }) => {
    console.log("show layer:", args.layer.get("title"));
});

layerSwitcher.on("hide-layer", (args: { layer: ol.layer.Base }) => {
    console.log("hide layer:", args.layer.get("title"));
});

map.addControl(layerSwitcher);
