import { olx } from "openlayers";

export type ExtendedOptions = Partial<{
    id: string;
    title: string;
    type: "base" | "overlay";
}>;

export type LayerTileOptions = olx.layer.TileOptions & ExtendedOptions;

export type LayerVectorOptions = olx.layer.VectorOptions & ExtendedOptions;