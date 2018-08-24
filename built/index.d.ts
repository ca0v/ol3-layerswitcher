/// <reference types="jquery" />
declare module "node_modules/ol3-fun/ol3-fun/common" {
    export function uuid(): string;
    export function asArray<T extends HTMLInputElement>(list: NodeList): T[];
    export function toggle(e: HTMLElement, className: string, toggle?: boolean): void;
    export function parse<T>(v: string, type: T): T;
    export function getQueryParameters(options: any, url?: string): void;
    export function getParameterByName(name: string, url?: string): string;
    export function doif<T>(v: T, cb: (v: T) => void): void;
    export function mixin<A extends any, B extends any>(a: A, b: B): A & B;
    export function defaults<A extends any, B extends any>(a: A, ...b: B[]): A & B;
    export function cssin(name: string, css: string): () => void;
    export function debounce<T extends Function>(func: T, wait?: number, immediate?: boolean): T;
    export function html(html: string): HTMLElement;
    export function pair<A, B>(a1: A[], a2: B[]): [A, B][];
    export function range(n: number): any[];
    export function shuffle<T>(array: T[]): T[];
}
declare module "node_modules/ol3-fun/ol3-fun/navigation" {
    import ol = require("openlayers");
    export function zoomToFeature(map: ol.Map, feature: ol.Feature, options?: {
        duration?: number;
        padding?: number;
        minResolution?: number;
    }): void;
}
declare module "node_modules/ol3-fun/ol3-fun/parse-dms" {
    export function parse(dmsString: string): number | {
        lon: number;
        lat: number;
    };
}
declare module "node_modules/ol3-fun/index" {
    import common = require("node_modules/ol3-fun/ol3-fun/common");
    import navigation = require("node_modules/ol3-fun/ol3-fun/navigation");
    import dms = require("node_modules/ol3-fun/ol3-fun/parse-dms");
    let index: typeof common & {
        dms: typeof dms;
        navigation: typeof navigation;
    };
    export = index;
}
declare module "ol3-layerswitcher/ol3-layerswitcher" {
    import ol = require("openlayers");
    export interface ILayerSwitcherOptions {
        tipLabel?: string;
        openOnMouseOver?: boolean;
        closeOnMouseOut?: boolean;
        openOnClick?: boolean;
        closeOnClick?: boolean;
        className?: string;
        target?: HTMLElement;
    }
    export class LayerSwitcher extends ol.control.Control {
        private state;
        private unwatch;
        hiddenClassName: string;
        shownClassName: string;
        panel: HTMLDivElement;
        element: HTMLElement;
        button: HTMLButtonElement;
        constructor(options?: ILayerSwitcherOptions);
        private afterCreate;
        isVisible(): boolean;
        showPanel(): void;
        hidePanel(): void;
        renderPanel(): void;
        private ensureTopVisibleBaseLayerShown;
        private setVisible;
        private renderLayer;
        private renderLayers;
    }
}
declare module "index" {
    import LayerSwitcher = require("ol3-layerswitcher/ol3-layerswitcher");
    export = LayerSwitcher;
}
declare module "ol3-layerswitcher/examples/accessibility" {
    export function run(): void;
}
declare module "ol3-layerswitcher/extras/ajax" {
    class Ajax {
        url: string;
        options: {
            use_json: boolean;
            use_cors: boolean;
        };
        constructor(url: string);
        jsonp<T>(args?: any, url?: string): JQuery.Deferred<T, any, any>;
        private ajax;
        get<T>(args?: any): JQuery.Deferred<T, any, any>;
        post<T>(args?: any): JQuery.Deferred<T, any, any>;
        put<T>(args?: any): JQuery.Deferred<T, any, any>;
        delete(args?: any): JQuery.Deferred<{}, any, any>;
    }
    export = Ajax;
}
declare module "ol3-layerswitcher/extras/ags-catalog" {
    export interface Service {
        name: string;
        type: string;
    }
    export interface CatalogInfo {
        currentVersion: number;
        folders: string[];
        services: Service[];
    }
    export interface SpatialReference {
        wkid: number;
        latestWkid: number;
        wkt: string;
    }
    export interface Extent {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
        spatialReference: SpatialReference;
    }
    export interface DocumentInfo {
        Title: string;
        Author: string;
        Comments: string;
        Subject: string;
        Category: string;
        AntialiasingMode: string;
        TextAntialiasingMode: string;
        Keywords: string;
    }
    export interface Layer {
        id: number;
        name: string;
        parentLayerId: number;
        defaultVisibility: boolean;
        subLayerIds?: any;
        minScale: number;
        maxScale: number;
    }
    export interface FeatureServerInfo {
        currentVersion: number;
        serviceDescription: string;
        hasVersionedData: boolean;
        supportsDisconnectedEditing: boolean;
        syncEnabled: boolean;
        supportedQueryFormats: string;
        maxRecordCount: number;
        capabilities: string;
        description: string;
        copyrightText: string;
        spatialReference: SpatialReference;
        initialExtent: Extent;
        fullExtent: Extent;
        allowGeometryUpdates: boolean;
        units: string;
        documentInfo: DocumentInfo;
        layers: Layer[];
        tables: any[];
        enableZDefaults: boolean;
        zDefault: number;
    }
    export interface AdvancedQueryCapabilities {
        supportsPagination: boolean;
        supportsStatistics: boolean;
        supportsOrderBy: boolean;
        supportsDistinct: boolean;
    }
    export interface EsriTSSymbol {
        type: string;
        color: number[];
        backgroundColor?: any;
        borderLineColor?: any;
        borderLineSize?: any;
        verticalAlignment: string;
        horizontalAlignment: string;
        rightToLeft: boolean;
        angle: number;
        xoffset: number;
        yoffset: number;
        kerning: boolean;
        haloColor?: any;
        haloSize?: any;
        font: Font;
    }
    export interface DefaultSymbol {
        type: string;
        url: string;
        imageData: string;
        contentType: string;
        width: number;
        height: number;
        angle: number;
        xoffset: number;
        yoffset: number;
    }
    export interface UniqueValueInfo {
        symbol: DefaultSymbol;
        value: string;
        label: string;
        description: string;
    }
    export interface Renderer {
        type: string;
        field1: string;
        field2?: any;
        field3?: any;
        fieldDelimiter: string;
        defaultSymbol: DefaultSymbol;
        defaultLabel: string;
        uniqueValueInfos: UniqueValueInfo[];
    }
    export interface Font {
        family: string;
        size: number;
        style: string;
        weight: string;
        decoration: string;
    }
    export interface LabelingInfo {
        labelPlacement: string;
        where?: any;
        labelExpression: string;
        useCodedValues: boolean;
        symbol: DefaultSymbol & EsriTSSymbol;
        minScale: number;
        maxScale: number;
    }
    export interface DrawingInfo {
        renderer: Renderer;
        transparency: number;
        labelingInfo: LabelingInfo[];
    }
    export interface CodedValue {
        name: string;
        code: any;
    }
    export interface Domain {
        type: string;
        name: string;
        codedValues: CodedValue[];
        range: number[];
    }
    export interface Field {
        name: string;
        type: string;
        alias: string;
        domain: Domain;
        editable: boolean;
        nullable: boolean;
        length?: number;
    }
    export interface Domains {
        [n: string]: {
            type: string;
        };
    }
    export interface Attributes {
        [n: string]: string;
    }
    export interface Prototype {
        attributes: Attributes;
    }
    export interface Template {
        name: string;
        description: string;
        prototype: Prototype;
        drawingTool: string;
    }
    export interface Type {
        id: string;
        name: string;
        domains: Domains;
        templates: Template[];
    }
    export interface FeatureLayerInfo {
        currentVersion: number;
        id: number;
        name: string;
        type: string;
        description: string;
        copyrightText: string;
        defaultVisibility: boolean;
        editFieldsInfo?: any;
        ownershipBasedAccessControlForFeatures?: any;
        syncCanReturnChanges: boolean;
        relationships: any[];
        isDataVersioned: boolean;
        supportsRollbackOnFailureParameter: boolean;
        supportsStatistics: boolean;
        supportsAdvancedQueries: boolean;
        advancedQueryCapabilities: AdvancedQueryCapabilities;
        geometryType: string;
        minScale: number;
        maxScale: number;
        extent: Extent;
        drawingInfo: DrawingInfo;
        hasM: boolean;
        hasZ: boolean;
        enableZDefaults: boolean;
        zDefault: number;
        allowGeometryUpdates: boolean;
        hasAttachments: boolean;
        htmlPopupType: string;
        objectIdField: string;
        globalIdField: string;
        displayField: string;
        typeIdField: string;
        fields: Field[];
        types: Type[];
        templates: any[];
        maxRecordCount: number;
        supportedQueryFormats: string;
        capabilities: string;
        useStandardizedQueries: boolean;
    }
    export interface Origin {
        x: number;
        y: number;
    }
    export interface Lod {
        level: number;
        resolution: number;
        scale: number;
    }
    export interface TileInfo {
        rows: number;
        cols: number;
        dpi: number;
        format: string;
        compressionQuality: number;
        origin: Origin;
        spatialReference: SpatialReference;
        lods: Lod[];
    }
    export interface InitialExtent {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
        spatialReference: SpatialReference;
    }
    export interface FullExtent {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
        spatialReference: SpatialReference;
    }
    export interface MapServerInfo {
        currentVersion: number;
        serviceDescription: string;
        mapName: string;
        description: string;
        copyrightText: string;
        supportsDynamicLayers: boolean;
        layers: Layer[];
        tables: any[];
        spatialReference: SpatialReference;
        singleFusedMapCache: boolean;
        tileInfo: TileInfo;
        initialExtent: InitialExtent;
        fullExtent: FullExtent;
        minScale: number;
        maxScale: number;
        units: string;
        supportedImageFormatTypes: string;
        documentInfo: DocumentInfo;
        capabilities: string;
        supportedQueryFormats: string;
        exportTilesAllowed: boolean;
        maxRecordCount: number;
        maxImageHeight: number;
        maxImageWidth: number;
        supportedExtensions: string;
    }
    export class Catalog {
        private ajax;
        constructor(url: string);
        about(data?: any): JQuery.Deferred<CatalogInfo, any, any>;
        aboutFolder(folder: string): JQuery.Deferred<CatalogInfo, any, any>;
        aboutFeatureServer(name: string): JQuery.Deferred<FeatureServerInfo, any, any> & {
            url: string;
        };
        aboutMapServer(name: string): JQuery.Deferred<MapServerInfo, any, any> & {
            url: string;
        };
        aboutLayer(layer: number): JQuery.Deferred<FeatureLayerInfo, any, any>;
    }
}
declare module "ol3-layerswitcher/extras/ags-webmap" {
    export namespace PortalForArcGis {
        interface OperationalLayer {
            mode?: number;
            popupInfo?: PopupInfo;
        }
    }
    export namespace PortalForArcGis {
        interface Format {
            places: number;
            digitSeparator: boolean;
            dateFormat: string;
        }
        interface FieldInfo {
            fieldName: string;
            label: string;
            isEditable: boolean;
            tooltip: string;
            visible: boolean;
            format: Format;
            stringFieldOption: string;
        }
        interface Routing {
            enabled: boolean;
        }
        interface BasemapGallery {
            enabled: boolean;
        }
        interface Measure {
            enabled: boolean;
        }
        interface Viewing {
            routing: Routing;
            basemapGallery: BasemapGallery;
            measure: Measure;
        }
        interface ApplicationProperties {
            viewing: Viewing;
        }
        interface Outline {
            style: string;
            color: number[];
            width: number;
            type: string;
        }
        interface Font {
            weight: string;
            style: string;
            family: string;
            size: number;
        }
        interface Symbol {
            style: string;
            color: number[];
            outline: Outline;
            type: string;
            width?: number;
            horizontalAlignment: string;
            verticalAlignment: string;
            font: Font;
            height?: number;
            xoffset?: number;
            yoffset?: number;
            contentType: string;
            url: string;
            size?: number;
        }
        interface UniqueValueInfo {
            symbol: Symbol;
            description: string;
            value: string;
            label: string;
        }
        interface Renderer {
            field1: string;
            type: string;
            uniqueValueInfos: UniqueValueInfo[];
        }
        interface DrawingInfo {
            renderer: Renderer;
        }
        interface Attributes {
            VISIBLE: number;
            TITLE: string;
            TYPEID: number;
        }
        interface Prototype {
            attributes: Attributes;
        }
        interface Template {
            drawingTool: string;
            description: string;
            name: string;
            prototype: Prototype;
        }
        interface Domains {
        }
        interface Type {
            id: number;
            templates: Template[];
            domains: Domains;
            name: string;
        }
        interface Field {
            alias: string;
            name: string;
            type: string;
            editable: boolean;
            length?: number;
        }
        interface SpatialReference {
            wkid: number;
            latestWkid: number;
        }
        interface Extent {
            type: string;
        }
        interface LayerDefinition {
            objectIdField: string;
            templates: any[];
            type: string;
            drawingInfo: DrawingInfo;
            displayField: string;
            visibilityField: string;
            name: string;
            hasAttachments: boolean;
            typeIdField: string;
            capabilities: string;
            types: Type[];
            geometryType: string;
            fields: Field[];
            extent: Extent;
        }
        interface Value {
            fields: string[];
            sourceURL: string;
            linkURL: string;
        }
        interface MediaInfo {
            title: string;
            caption: string;
            value: Value;
            type: string;
        }
        interface PopupInfo {
            fieldInfos: FieldInfo[];
            showAttachments: boolean;
            mediaInfos: MediaInfo[];
            title: string;
            description: string;
        }
        interface Geometry {
            rings: number[][][];
            spatialReference: SpatialReference;
        }
        interface Feature {
            geometry: Geometry;
            attributes: any;
        }
        interface FeatureSet {
            geometryType: string;
            features: Feature[];
        }
        interface Layer {
            id: number;
            showLegend: boolean;
            layerDefinition: LayerDefinition;
            popupInfo: PopupInfo;
            featureSet: FeatureSet;
            nextObjectId: number;
        }
        interface FeatureCollection {
            layers: Layer[];
            showLegend: boolean;
        }
        interface OperationalLayer {
            layerType: string;
            id: string;
            url: string;
            title: string;
            featureCollection: FeatureCollection;
            opacity: number;
            visibility: boolean;
        }
        interface BaseMapLayer {
            isReference?: boolean;
            title: string;
            id: string;
            layerType: string;
            opacity: number;
            visibility: boolean;
            url: string;
        }
        interface BaseMap {
            baseMapLayers: BaseMapLayer[];
            title: string;
        }
        interface Extent {
            spatialReference: SpatialReference;
            xmax: number;
            xmin: number;
            ymax: number;
            ymin: number;
        }
        interface Bookmark {
            extent: Extent;
            name: string;
        }
        interface Title {
            backgroundColor: number[];
            borderColor: number[];
            borderSize: number;
            font: string;
            fontSize: number;
            foregroundColor: number[];
            horizontalAlignment: number;
            opacity: number;
            text: string;
            titleFontStyle: number;
        }
        interface VisibleLayer {
            id: string;
        }
        interface Slide {
            baseMap: BaseMap;
            hidden: boolean;
            extent: Extent;
            title: Title;
            visibleLayers: VisibleLayer[];
        }
        interface Presentation {
            slides: Slide[];
            displayTimeSlider: boolean;
            slideAdvancementInterval: number;
            useTimeExtentOfSlide: boolean;
        }
        interface WebMap {
            layers: Layer[];
            minScale: number;
            maxScale: number;
            authoringApp: string;
            authoringAppVersion: string;
            applicationProperties: ApplicationProperties;
            MapItems?: any;
            Slides?: any;
            operationalLayers: OperationalLayer[];
            baseMap: BaseMap;
            spatialReference: SpatialReference;
            version: string;
            bookmarks: Bookmark[];
            presentation: Presentation;
        }
    }
    export class WebMap {
        get(url?: string): JQuery.Deferred<PortalForArcGis.WebMap, any, any>;
    }
}
declare module "ol3-layerswitcher/extras/ags-layer-factory" {
    import ol = require("openlayers");
    import { PortalForArcGis } from "ol3-layerswitcher/extras/ags-webmap";
    class AgsLayerFactory {
        asExtent(appInfo: PortalForArcGis.WebMap): void;
        asEvented(layer: ol.layer.Tile): ol.layer.Tile;
        asAgsLayer(layerInfo: PortalForArcGis.OperationalLayer, appInfo: PortalForArcGis.WebMap): any;
        asArcGISTiledMapServiceLayer(layerInfo: PortalForArcGis.BaseMapLayer, appInfo?: PortalForArcGis.WebMap): ol.layer.Tile;
        asFeatureCollection(layerInfo: PortalForArcGis.OperationalLayer, appInfo?: PortalForArcGis.WebMap): any;
        private asEsriGeometryPolygon;
        asArcGISFeatureLayer(layerInfo: PortalForArcGis.OperationalLayer, appInfo?: PortalForArcGis.WebMap): ol.layer.Tile;
    }
    export = AgsLayerFactory;
}
declare module "ol3-layerswitcher/examples/ags-webmap" {
    export function run(): void;
}
declare module "ol3-layerswitcher/examples/ags-discovery" {
    export function run(): void;
}
declare module "ol3-layerswitcher/examples/index" {
    export function run(): void;
}
declare module "ol3-layerswitcher/examples/layerswitcher" {
    export function run(): void;
}
declare module "ol3-layerswitcher/examples/data/webmap1" {
    const _default: {
        "layers": ({
            "id": number;
            "showLegend": boolean;
            "popupInfo": {
                "title": string;
                "fieldInfos": ({
                    "fieldName": string;
                    "label": string;
                    "isEditable": boolean;
                    "visible": boolean;
                    "stringFieldOption"?: undefined;
                    "format"?: undefined;
                } | {
                    "fieldName": string;
                    "label": string;
                    "isEditable": boolean;
                    "visible": boolean;
                    "stringFieldOption": string;
                    "format"?: undefined;
                } | {
                    "fieldName": string;
                    "label": string;
                    "isEditable": boolean;
                    "visible": boolean;
                    "format": {
                        "places": number;
                        "digitSeparator": boolean;
                    };
                    "stringFieldOption"?: undefined;
                })[];
                "description": string;
                "showAttachments": boolean;
                "mediaInfos": {
                    "title": string;
                    "type": string;
                    "caption": string;
                    "value": {
                        "fields": string[];
                    };
                }[];
            };
        } | {
            "id": number;
            "showLegend": boolean;
            "popupInfo"?: undefined;
        })[];
        "minScale": number;
        "maxScale": number;
    };
    export = _default;
}
declare module "ol3-layerswitcher/examples/data/webmap2" {
    const _default_1: {
        "operationalLayers": {
            "id": string;
            "layerType": string;
            "url": string;
            "visibility": boolean;
            "opacity": number;
            "mode": number;
            "title": string;
            "popupInfo": {
                "title": string;
                "fieldInfos": ({
                    "fieldName": string;
                    "label": string;
                    "isEditable": boolean;
                    "tooltip": string;
                    "visible": boolean;
                    "format": {
                        "places": number;
                        "digitSeparator": boolean;
                        "dateFormat"?: undefined;
                    };
                    "stringFieldOption": string;
                } | {
                    "fieldName": string;
                    "label": string;
                    "isEditable": boolean;
                    "tooltip": string;
                    "visible": boolean;
                    "format": {
                        "dateFormat": string;
                        "places"?: undefined;
                        "digitSeparator"?: undefined;
                    };
                    "stringFieldOption": string;
                })[];
                "description": any;
                "showAttachments": boolean;
                "mediaInfos": any[];
            };
        }[];
        "baseMap": {
            "baseMapLayers": {
                "id": string;
                "layerType": string;
                "url": string;
                "visibility": boolean;
                "opacity": number;
                "title": string;
            }[];
            "title": string;
        };
        "spatialReference": {
            "wkid": number;
            "latestWkid": number;
        };
        "authoringApp": string;
        "authoringAppVersion": string;
        "version": string;
        "bookmarks": {
            "extent": {
                "spatialReference": {
                    "wkid": number;
                };
                "xmax": number;
                "xmin": number;
                "ymax": number;
                "ymin": number;
            };
            "name": string;
        }[];
        "applicationProperties": {
            "viewing": {
                "routing": {
                    "enabled": boolean;
                };
                "basemapGallery": {
                    "enabled": boolean;
                };
                "measure": {
                    "enabled": boolean;
                };
            };
        };
        "MapItems": any;
        "Slides": any;
    };
    export = _default_1;
}
