/// <reference types="jquery" />
declare module "node_modules/ol3-fun/ol3-fun/common" {
    export function uuid(): string;
    export function asArray<T extends HTMLInputElement>(list: NodeList): T[];
    export function toggle(e: HTMLElement, className: string, force?: boolean): boolean;
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
    export function range(n: number): number[];
    export function shuffle<T>(array: T[]): T[];
}
declare module "node_modules/ol3-fun/ol3-fun/navigation" {
    import * as ol from "openlayers";
    export function zoomToFeature(map: ol.Map, feature: ol.Feature, options?: {
        duration?: number;
        padding?: number;
        minResolution?: number;
    }): JQuery.Deferred<any, any, any>;
}
declare module "node_modules/ol3-fun/ol3-fun/parse-dms" {
    export function parse(dmsString: string): {
        lon: number;
        lat: number;
    } | number;
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
    import { GlobalObject } from "openlayers";
    export interface ILayerSwitcherOptions {
        tipLabel?: string;
        openOnMouseOver?: boolean;
        closeOnMouseOut?: boolean;
        openOnClick?: boolean;
        closeOnClick?: boolean;
        className?: string;
        target?: HTMLElement;
    }
    export const DEFAULT_OPTIONS: ILayerSwitcherOptions;
    export interface ILayerSwitcher {
        on(type: "show-layer", listener: any): any;
        on(type: (string | string[]), listener: ol.EventsListenerFunctionType, opt_this?: GlobalObject): (ol.EventsKey | ol.EventsKey[]);
    }
    export class LayerSwitcher extends ol.control.Control implements ILayerSwitcher {
        private state;
        private unwatch;
        private options;
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
    import { LayerSwitcher, DEFAULT_OPTIONS, ILayerSwitcherOptions } from "ol3-layerswitcher/ol3-layerswitcher";
    import { LayerTileOptions as LTO, LayerVectorOptions as LVO } from "./ol3-layerswitcher/@types/LayerTileOptions";
    import { LayerGroupOptions as LGO } from "./ol3-layerswitcher/@types/LayerGroupOptions";
    export type LayerTileOptions = LTO;
    export type LayerGroupOptions = LGO;
    export type LayerVectorOptions = LVO;
    export { LayerSwitcher, ILayerSwitcherOptions, DEFAULT_OPTIONS };
}
