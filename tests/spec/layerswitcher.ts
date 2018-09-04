import ol = require("openlayers");
import { should, shouldEqual } from "../base";
import { describe, it } from "mocha";
import {
    ILayerSwitcherOptions,
    LayerSwitcher,
    DEFAULT_OPTIONS,
    LayerTileOptions,
    LayerGroupOptions,
    LayerVectorOptions
} from "../../index";
import { cssin } from "ol3-fun/ol3-fun/common";

// move to base
function slowloop(functions: Array<Function>, interval = 1000, cycles = 1) {
    let index = 0;
    if (cycles <= 0) return;
    let h = setInterval(() => {
        if (index === functions.length) {
            index = 0;
            cycles--;
            if (cycles <= 0) {
                clearInterval(h);
                return;
            }
        }
        (functions[index++])();
    }, interval);
    return h;
}

describe("LayerSwitcher Tests", () => {
    it("LayerSwitcher", () => {
        should(!!LayerSwitcher, "LayerSwitcher");
    });

    it("DEFAULT_OPTIONS", () => {
        let options = DEFAULT_OPTIONS;
        checkDefaultInputOptions(options);
    });

    it("Renders in DOM", (done) => {
        let cssout = cssin("map", `.map {width:16em;height:12em;border:1pt solid}`);
        let target = document.createElement("div");
        target.className = "map";

        document.body.appendChild(target);

        let map = new ol.Map({
            target: target
        });

        let switcher = new LayerSwitcher({
        });

        slowloop([
            () => {
                switcher.setMap(map);
                switcher.showPanel();
            },
            () => {
                let tiles = ["Bing", "OSM"].map(n => new ol.layer.Tile(<LayerTileOptions>{
                    title: `Tile ${n}`,
                    visible: n === "Bing",
                    type: "base",
                    source: new ol.source.Tile({ projection: "EPSG:3857" })
                }));
                let group1 = new ol.layer.Group(<LayerGroupOptions>{
                    title: "Basemaps",
                    visible: true,
                    layers: tiles
                });

                //slowloop([() => tiles[1].setVisible(!tiles[1].getVisible())], 1000, 1);
                map.addLayer(group1);
                switcher.hidePanel();
                switcher.showPanel(); // refresh
            },
            () => {
                let vectors = ["Parcel", "Addresses"].map(n => new ol.layer.Vector(<LayerVectorOptions>{
                    title: n,
                    visible: n === "Addresses",
                    source: new ol.source.Vector({})
                }));

                //slowloop([() => tile1.setVisible(!tile1.getVisible())], 1000, 1);
                vectors.forEach(v => map.addLayer(v));
                switcher.hidePanel();
                switcher.showPanel(); // refresh
            },
            () => {
                // map.setTarget(null); // destroy map
                // switcher.hidePanel(); // why not destroy/dispose?
                // switcher.setMap(null);
                // switcher.setTarget(null);
                // cssout();
                done();
            }
        ]);
    });

});

function checkDefaultInputOptions(options: ILayerSwitcherOptions) {
    should(!!options, "options");
    shouldEqual(options.className, "layer-switcher", "className");
    shouldEqual(options.closeOnClick, true, "closeOnClick");
    shouldEqual(options.closeOnMouseOut, false, "closeOnMouseOut");
    shouldEqual(options.openOnClick, true, "openOnClick");
    shouldEqual(options.openOnMouseOver, false, "openOnMouseOver");
    shouldEqual(options.target, undefined, "target");
    shouldEqual(options.tipLabel, "Layers", "tipLabel");
}
