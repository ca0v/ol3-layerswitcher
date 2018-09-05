import ol = require("openlayers");
import { describe, it, should, shouldEqual } from "ol3-fun/tests/base";
import {
    ILayerSwitcherOptions,
    LayerSwitcher,
    DEFAULT_OPTIONS,
    LayerTileOptions,
    LayerGroupOptions,
    LayerVectorOptions,
} from "../../index";
import { cssin, slowloop } from "ol3-fun/index";

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
            controls: [],
            interactions: [],
            layers: [],
            target: target,
        });

        let switcher = new LayerSwitcher({});

        let refresh = (msg: string) => {
            console.log("refresh", msg);
            switcher.hidePanel();
            switcher.showPanel(); // refresh
        };

        let tiles = ["Bing", "OSM"].map(
            (n) =>
                new ol.layer.Tile(<LayerTileOptions>{
                    title: `Tile ${n}`,
                    visible: n === "Bing",
                    type: "base",
                    source: new ol.source.Tile({ projection: "EPSG:3857" }),
                }),
        );
        let groupLayers = new ol.Collection<ol.layer.Tile>();
        let group1 = new ol.layer.Group(<LayerGroupOptions>{
            title: "Basemaps",
            visible: true,
            layers: groupLayers,
        });

        let vectors = ["Parcel", "Addresses", "Streets"].map(
            (n) =>
                new ol.layer.Vector(<LayerVectorOptions>{
                    title: n,
                    visible: n === "Addresses",
                    source: new ol.source.Vector({}),
                }),
        );

        let mapLayers = map.getLayers();

        vectors.forEach((t) => t.on("change:visible", (args) => refresh(`${args.target.get("title")}`)));
        tiles.forEach((t) => t.on("change:visible", (args) => refresh(`${args.target.get("title")}`)));
        [group1].forEach((t) => t.on("change:visible", (args) => refresh(`${args.target.get("title")}`)));
        groupLayers.on("add", (args) => refresh(`add ${args.target.get("title")}`));
        mapLayers.on("add", (args) => refresh(`add ${args.target.get("title")}`));
        mapLayers.on("remove", (args) => refresh(`remove ${args.target.get("title")}`));

        switcher.setMap(map);

        slowloop(
            [
                () => {
                    switcher.showPanel();
                    shouldEqual(switcher.isVisible(), true, "Panel is visible");
                },
                () => mapLayers.insertAt(0, group1),
                () => groupLayers.insertAt(0, tiles[0]),
                () => groupLayers.insertAt(1, tiles[1]),
                () => tiles[0].setVisible(!tiles[0].getVisible()),
                () => tiles[0].setVisible(!tiles[0].getVisible()),
                () => tiles[1].setVisible(!tiles[1].getVisible()),
                () => tiles[1].setVisible(!tiles[1].getVisible()),
                () => group1.setVisible(!group1.getVisible()),
                () => group1.setVisible(!group1.getVisible()),
                () => mapLayers.insertAt(1, vectors[0]),
                () => mapLayers.insertAt(2, vectors[1]),
                () => mapLayers.insertAt(0, vectors[2]),
                () => vectors[0].setVisible(!vectors[0].getVisible()),
                () => vectors[0].setVisible(!vectors[0].getVisible()),
                () => vectors[1].setVisible(!vectors[1].getVisible()),
                () => vectors[1].setVisible(!vectors[1].getVisible()),
                () => switcher.hidePanel(),
                () => switcher.showPanel(),
                () => mapLayers.remove(vectors[2]),
                () => mapLayers.insertAt(0, vectors[2]),
                () => vectors[2].setVisible(true),
            ],
            100,
        ).then(() => {
            shouldEqual(vectors[0].getVisible(), false, "Parcel is hidden");
            vectors[0].setVisible(true);
            shouldEqual(vectors[1].getVisible(), true, "Address is visible");
            shouldEqual(vectors[2].getVisible(), true, "Address is visible");
            shouldEqual(tiles[0].getVisible(), true, "Bing is visible");
            shouldEqual(tiles[1].getVisible(), false, "OSM is hidden");
            tiles[1].setVisible(true); // both basemaps are visible...not allowed by control but possible via map API so allow UX to reflect this state
            shouldEqual(tiles[1].getVisible(), true, "OSM is now visible");
            shouldEqual(tiles[0].getVisible(), true, "Bing is still visible");
            shouldEqual(switcher.isVisible(), true, "Panel is visible");
            // map.setTarget(null); // destroy map
            // switcher.hidePanel(); // why not destroy/dispose?
            // switcher.setMap(null);
            // switcher.setTarget(null);
            // cssout();
            done();
        });
    }).timeout(20 * 200);
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
