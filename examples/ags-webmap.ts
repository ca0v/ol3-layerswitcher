import ol = require("openlayers");
import { LayerSwitcher } from "../ol3-layerswitcher/ol3-layerswitcher";
import WebMap = require("../ol3-layerswitcher/extras/ags-webmap");
import { AgsLayerFactory } from "../ol3-layerswitcher/extras/ags-layer-factory";

// obviously we don't want everything to be red, there's all this still to consider....
// layerInfo.featureCollection.layers[0].layerDefinition.drawingInfo.renderer.uniqueValueInfos[0].symbol.color;
const DEFAULT_STYLE = new ol.style.Style({
	image: new ol.style.Circle({
		radius: 5,
		stroke: new ol.style.Stroke({
			color: "black",
			width: 2
		}),
		fill: new ol.style.Fill({
			color: "red"
		})
	}),
	stroke: new ol.style.Stroke({
		color: "black",
		width: 2
	}),
	fill: new ol.style.Fill({
		color: "red"
	})
});

export function run() {
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

	let agsLayerFactory = new AgsLayerFactory();

	let map = new ol.Map({
		target: "map",
		layers: [],
		controls: [new ol.control.MousePosition(), new ol.control.Zoom()],
		view: new ol.View({
			center: ol.proj.transform([-85, 35], "EPSG:4326", "EPSG:3857"),
			zoom: 6
		})
	});

	let layerSwitcher = LayerSwitcher.create({ map: map });

	layerSwitcher.on("show-layer", (args: ol.events.Event & { layer: ol.layer.Base }) => {
		console.log("show layer:", args.layer.get("title"));
		if (args.layer.get("extent")) {
			let view = map.getView();
			let extent = <ol.Extent>args.layer.get("extent");
			let currentExtent = view.calculateExtent(map.getSize());
			if (!ol.extent.intersects(currentExtent, extent)) {
				view.fit(extent, { size: map.getSize() });
			}
		}
	});

	layerSwitcher.on("hide-layer", (args: ol.events.Event & { layer: ol.layer.Base }) => {
		console.log("hide layer:", args.layer.get("title"));
	});

	function webmap(options: { appid?: string; url?: string }) {
		let webmap = new WebMap.WebMap();

		let webmapGroup = new ol.layer.Group(<any>{
			title: "WebMap",
			visible: true,
			layers: []
		});
		map.addLayer(webmapGroup);

		options.url = options.url || `https://www.arcgis.com/sharing/rest/content/items/${options.appid}/data?f=json`;

		webmap.get(options.url).then(result => {
			if (result.baseMap) {
				let baseLayers = new ol.layer.Group(<any>{
					title: "Basemap Layers",
					visible: false,
					layers: []
				});
				webmapGroup.getLayers().push(baseLayers);

				result.baseMap.baseMapLayers.forEach(l => {
					let opLayer = agsLayerFactory.asArcGISTiledMapServiceLayer(l, result);
					baseLayers.getLayers().push(opLayer);
				});
			}

			if (result.operationalLayers) {
				let opLayers = new ol.layer.Group(<any>{
					title: "Operational Layers",
					visible: true,
					layers: []
				});
				webmapGroup.getLayers().push(opLayers);

				result.operationalLayers.forEach(l => {
					let opLayer = agsLayerFactory.asAgsLayer(l, result);
					if (opLayer instanceof ol.layer.Vector) {
						opLayer.setStyle((feature: ol.Feature) => {
							let size = feature.get("Total_people_involved") as number;
							let style = DEFAULT_STYLE.clone();
							if (size) {
								(style.getImage() as ol.style.Circle).setRadius(Math.max(4, Math.min(100, size)));
								let text = new ol.style.Text({
									text: size + "",
									fill: new ol.style.Fill({ color: "white" }),
									stroke: new ol.style.Stroke({
										width: 1,
										color: "black"
									})
								});
								style.setText(text);
							}
							feature.setStyle(style);
							return style;
						});
					}
					opLayers.getLayers().push(opLayer);
				});
			}
		});
	}

	webmap({
		url: "https://infor1.maps.arcgis.com/sharing/rest/content/items/313b7327133f4802affee46893b4bec7/data?f=json"
	});
}
