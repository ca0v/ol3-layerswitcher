import { should, shouldEqual } from "../base";
import { describe, it } from "mocha";
import { ILayerSwitcherOptions, LayerSwitcher, DEFAULT_OPTIONS } from "../../ol3-layerswitcher/ol3-layerswitcher";

describe("LayerSwitcher Tests", () => {
    it("LayerSwitcher", () => {
        should(!!LayerSwitcher, "LayerSwitcher");
    });

    it("DEFAULT_OPTIONS", () => {
        let options = DEFAULT_OPTIONS;
        checkDefaultInputOptions(options);
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
