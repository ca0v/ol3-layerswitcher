import ol = require("openlayers");
import { olx } from "openlayers";

import { stringify } from "ol3-fun/tests/base"; // move to ol3-fun/index
import { PortalForArcGis } from "./ags-webmap";
import { LayerTileOptions, LayerVectorOptions } from "../@types/LayerTileOptions";

/**
 * scale is units per pixel assuming a pixel is a certain size (0.028 cm or 1/90 inches)
 * resolution is how many
 */
function asRes(scale: number, dpi = 90.71428571428572) {
    const inchesPerFoot = 12.0;
    const inchesPerMeter = inchesPerFoot / ol.proj.METERS_PER_UNIT["ft"]; //39.37007874015748;
    const dotsPerUnit = dpi * inchesPerMeter;
    return scale / dotsPerUnit;
}

// obviously we don't want everything to be red, there's all this still to consider....
// layerInfo.featureCollection.layers[0].layerDefinition.drawingInfo.renderer.uniqueValueInfos[0].symbol.color;
const DEFAULT_STYLE = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
            color: "black",
            width: 2,
        }),
        fill: new ol.style.Fill({
            color: "red",
        }),
    }),
    stroke: new ol.style.Stroke({
        color: "black",
        width: 2,
    }),
    fill: new ol.style.Fill({
        color: "red",
    }),
});

class VectorLayer extends ol.layer.Vector {
    constructor(options: olx.layer.VectorOptions & { title: string }) {
        super(options);
    }
}

export class AgsFeatureSource {
    public static create(options: { serviceUrl: string; layer: number }) {
        let esrijsonFormat = new ol.format.EsriJSON();
        let vectorSource = new ol.source.Vector({
            loader: function(extent, resolution, projection) {
                var url = `${options.serviceUrl}/${
                    options.layer
                }/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${encodeURIComponent(
                    stringify({
                        xmin: extent[0],
                        ymin: extent[1],
                        xmax: extent[2],
                        ymax: extent[3],
                        spatialReference: { wkid: 102100 },
                    }),
                )}&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&outSR=102100`;
                $.ajax({
                    url: url,
                    dataType: "jsonp",
                    success: function(response) {
                        if (response.error) {
                            console.error(response.error.message + "\n" + response.error.details.join("\n"));
                        } else {
                            // dataProjection will be read from document
                            var features = esrijsonFormat.readFeatures(response, {
                                featureProjection: projection,
                                dataProjection: projection,
                            });
                            if (features.length > 0) {
                                vectorSource.addFeatures(features);
                            }
                        }
                    },
                });
            },
            strategy: ol.loadingstrategy.tile(
                ol.tilegrid.createXYZ({
                    tileSize: 512,
                }),
            ),
        });
        return vectorSource;
    }
}

export class AgsLayerFactory {
    asExtent(appInfo: PortalForArcGis.WebMap) {
        // not defined?
    }

    // make the layer progress aware
    asEvented(layer: ol.layer.Tile | ol.layer.Vector) {
        let loadCount = 0;
        let source = layer.getSource();
        if (source.on && layer.dispatchEvent) {
            source.on("tileloadstart", () => {
                if (0 === loadCount++) layer.dispatchEvent("load:start");
                layer.set("loading", true);
            });
            source.on("tileloadend", () => {
                if (0 === --loadCount) layer.dispatchEvent("load:end");
                layer.set("loading", false);
            });
        }
        return layer;
    }

    asAgsLayer(layerInfo: PortalForArcGis.OperationalLayer, appInfo: PortalForArcGis.WebMap) {
        switch (layerInfo.layerType) {
            case "ArcGISFeatureLayer":
                if (layerInfo.featureCollection) return this.asFeatureCollection(layerInfo, appInfo);
                return this.asEvented(this.asArcGISFeatureLayer(layerInfo, appInfo));
            case "ArcGISTiledMapServiceLayer":
                return this.asEvented(this.asArcGISTiledMapServiceLayer(layerInfo, appInfo));
            default:
                debugger;
                break;
        }
    }

    asArcGISTiledMapServiceLayer(layerInfo: PortalForArcGis.BaseMapLayer, appInfo?: PortalForArcGis.WebMap) {
        // doesn't seem to care about the projection
        let srs = layerInfo.spatialReference || appInfo.spatialReference;
        let srsCode = !srs ? "3857" : typeof srs === "string" ? srs : srs.latestWkid || srs.wkid;

        let source = new ol.source.XYZ({
            url: layerInfo.url + "/tile/{z}/{y}/{x}",
            projection: `EPSG:${srsCode}`,
        });

        let tileOptions: LayerTileOptions = {
            id: layerInfo.id,
            title: layerInfo.title || layerInfo.id,
            type: "base",
            visible: false,
            source: source,
        };

        let layer = new ol.layer.Tile(tileOptions);

        return layer;
    }

    /**
     * Renders the features of the featureset (can be points, lines or polygons) into a feature layer
     */
    asFeatureCollection(layerInfo: PortalForArcGis.OperationalLayer, appInfo?: PortalForArcGis.WebMap) {
        debugger;
        let source = new ol.source.Vector();
        let layer = new VectorLayer({
            title: layerInfo.id,
            source: source,
        });

        layer.setStyle(DEFAULT_STYLE);
        layer.setVisible(true);

        layerInfo.featureCollection.layers.forEach((l) => {
            switch (l.featureSet.geometryType) {
                case "esriGeometryPoint":
                    this.asEsriGeometryPoint(l.featureSet).forEach((f) => source.addFeature(f));
                    break;
                case "esriGeometryPolygon":
                    this.asEsriGeometryPolygon(l.featureSet).forEach((f) => source.addFeature(f));
                    break;
                case "esriGeometryPolyline":
                    this.asEsriGeometryPolyline(l.featureSet).forEach((f) => source.addFeature(f));
                    break;
                default:
                    throw `unexpected geometry type: ${l.featureSet.geometryType}`;
            }
        });

        return layer;
    }

    /**
     * Creates a polygon feature from esri data
     */
    private asEsriGeometryPolygon(featureSet: PortalForArcGis.FeatureSet) {
        console.assert(featureSet.geometryType === "esriGeometryPolygon");
        return featureSet.features.map(
            (f) =>
                new ol.Feature({
                    attributes: f.attributes,
                    geometry: new ol.geom.Polygon(f.geometry.rings),
                }),
        );
    }

    /**
     * Creates a polygon feature from esri data
     */
    private asEsriGeometryPolyline(featureSet: PortalForArcGis.FeatureSet) {
        console.assert(featureSet.geometryType === "esriGeometryPolyline");
        return featureSet.features.map(
            (f) =>
                new ol.Feature({
                    attributes: f.attributes,
                    geometry: new ol.geom.LineString(f.geometry.paths),
                }),
        );
    }

    /**
     * Creates a polygon feature from esri data
     */
    private asEsriGeometryPoint(featureSet: PortalForArcGis.FeatureSet) {
        console.assert(featureSet.geometryType === "esriGeometryPoint");
        return featureSet.features.map(
            (f) =>
                new ol.Feature({
                    attributes: f.attributes,
                    geometry: new ol.geom.Point([f.geometry.x, f.geometry.y]),
                }),
        );
    }

    asArcGISFeatureLayer(layerInfo: PortalForArcGis.OperationalLayer, appInfo?: PortalForArcGis.WebMap) {
        layerInfo.id = layerInfo.url.substring(1 + layerInfo.url.lastIndexOf("/"));
        layerInfo.url = layerInfo.url.substring(0, layerInfo.url.lastIndexOf("/"));

        let source = AgsFeatureSource.create({ serviceUrl: layerInfo.url, layer: parseInt(layerInfo.id) });

        let layerOptions: LayerVectorOptions = {
            id: layerInfo.id,
            title: layerInfo.title,
            visible: false,
            source: source,
        };

        if (appInfo) {
            if (appInfo.minScale) layerOptions.maxResolution = asRes(appInfo.minScale);
            if (appInfo.maxScale) layerOptions.minResolution = asRes(appInfo.maxScale);
        }

        let layer = new ol.layer.Vector(layerOptions);
        layer.setStyle(DEFAULT_STYLE);
        return layer;
    }
}
