import { olx } from "openlayers";
export type LayerTileOptions = olx.layer.TileOptions & Partial<{
    id: string;
    title: string;
    type: string;
}>;