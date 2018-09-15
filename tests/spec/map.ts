import { describe, it, slowloop } from "ol3-fun/tests/base";
import { kill } from "../extras/kill";
import { once } from "../extras/once";
import { createMapTarget, createMap, createVectorLayer, createFeature, setText } from "../extras/setText";

describe("spec/map", () => {
	it("shows a map", () => {
		let target = createMapTarget();
		let map = createMap(target);
		let layer = createVectorLayer(map);
		let textFeature = createFeature(layer);
		let startTicks = Date.now();
		return once(map, "postrender", () =>
			slowloop(
				[
					() => {
						let ticks = Math.round((4000 - (Date.now() - startTicks)) / 100) / 10;
						setText(textFeature, `map will self-destruct in ${ticks} seconds`);
					}
				],
				200,
				20
			)
				.then(kill(map, 0))
				.catch()
		);
	});
});
