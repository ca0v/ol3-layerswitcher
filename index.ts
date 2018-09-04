import { LayerSwitcher, DEFAULT_OPTIONS, ILayerSwitcherOptions } from "./ol3-layerswitcher/ol3-layerswitcher";
import { LayerTileOptions as LTO, LayerVectorOptions as LVO } from "./ol3-layerswitcher/@types/LayerTileOptions";
import { LayerGroupOptions as LGO } from "./ol3-layerswitcher/@types/LayerGroupOptions";

export type LayerTileOptions = LTO;
export type LayerGroupOptions = LGO;
export type LayerVectorOptions = LVO;
export { LayerSwitcher, ILayerSwitcherOptions, DEFAULT_OPTIONS };

