/**
 * Just shows a map...move mouse over it to prevent it's destruction
 */
import ol = require("openlayers");
export function setText(feature: ol.Feature, text: string) {
	feature.set("text", text);
	let style = feature.getStyle() as ol.style.Style;
	style.getText().setText(text);
}
export function createFeature(layer: ol.layer.Vector) {
	let feature = new ol.Feature();
	let geom = new ol.geom.Point([0, 0]);
	feature.setGeometry(geom);
	layer.getSource().addFeature(feature);
	feature.setStyle(
		new ol.style.Style({
			image: new ol.style.RegularShape({
				points: 5,
				radius1: 20,
				radius2: 10,
				stroke: new ol.style.Stroke({
					color: "white",
					width: 2
				}),
				fill: new ol.style.Fill({ color: "black" })
			}),
			text: new ol.style.Text({
				stroke: new ol.style.Stroke({
					color: "white",
					width: 2
				}),
				fill: new ol.style.Fill({ color: "black" }),
				text: "Click The Map"
			})
		})
	);
	feature.set("layer", layer);
	return feature;
}
export function createVectorLayer(map: ol.Map) {
	let layer = new ol.layer.Vector();
	let source = new ol.source.Vector();
	layer.setSource(source);
	map.addLayer(layer);
	return layer;
}
export function createMap(target: HTMLMapElement) {
	return new ol.Map({
		target,
		view: new ol.View({
			center: [0, 0],
			zoom: 10
		})
	});
}
export function createMapTarget() {
	let target = document.createElement("map");
	target.id = target.className = "map";
	document.body.appendChild(target);
	return target;
}
