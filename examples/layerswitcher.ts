import ol = require("openlayers");
import { LayerSwitcher } from "../ol3-layerswitcher/ol3-layerswitcher";
import { LayerGroupOptions } from "../ol3-layerswitcher/@types/LayerGroupOptions";
import { LayerTileOptions } from "../ol3-layerswitcher/@types/LayerTileOptions";

export function run() {
	let map = new ol.Map({
		target: "map",
		layers: [
			new ol.layer.Group(<LayerGroupOptions>{
				title: "Base maps",
				layers: [
					new ol.layer.Group(<LayerGroupOptions>{
						title: "OSM and Water Color",
						"label-only": true,
						layers: [
							new ol.layer.Tile(<LayerTileOptions>{
								title: "Water color",
								type: "base",
								visible: false,
								source: new ol.source.Stamen({
									layer: "watercolor"
								})
							}),
							new ol.layer.Tile(<LayerTileOptions>{
								title: "OSM",
								type: "base",
								visible: true,
								source: new ol.source.OSM()
							})
						]
					})
				]
			}),
			new ol.layer.Group(<LayerGroupOptions>{
				title: "Overlays",
				layers: [
					new ol.layer.Group(<LayerGroupOptions>{
						title: "Marine Regions",
						layers: [
							new ol.layer.Tile(<LayerTileOptions>{
								title: "The World Marine Heritage Sites",
								source: new ol.source.TileWMS({
									url: "http://geo.vliz.be/geoserver/MarineRegions/wms",
									params: {
										LAYERS: "MarineRegions:worldheritagemarineprogramme"
									},
									serverType: "geoserver"
								})
							})
						]
					})
				]
			})
		],
		view: new ol.View({
			center: ol.proj.transform([-85, 35], "EPSG:4326", "EPSG:3857"),
			zoom: 6
		})
	});

	let layerSwitcher = LayerSwitcher.create({
		map: map,
		tipLabel: "Layers",
		openOnMouseOver: true,
		closeOnMouseOut: true,
		openOnClick: false,
		closeOnClick: true,
		target: null
	});

	layerSwitcher.on("show-layer", (args: any) => {
		console.log("show layer:", args.layer.get("title"));
	});

	layerSwitcher.on("hide-layer", (args: any) => {
		console.log("hide layer:", args.layer.get("title"));
		return true;
	});
}
