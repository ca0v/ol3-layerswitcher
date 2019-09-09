import { slowloop } from "ol3-fun/tests/base";
import { ILayerSwitcher } from "../../ol3-layerswitcher/ol3-layerswitcher";

/**
 * Unless the pointer moves within the map...
 * @param popup destroy this and associated map
 * @param delay after this many milliseconds
 */
export function kill(target: ol.Map | ILayerSwitcher, delay = 1000) {
	let cancel = false;
	let control = target as ILayerSwitcher;
	let map = target as ol.Map;

	if (control.getMap) map = control.getMap();
	else control = null;

	map.once("pointermove", () => {
		cancel = true;
	});

	return () => {
		if (cancel) throw "cancelled by user via pointermove";
		return slowloop(
			[
				() => {
					if (cancel) throw "cancelled by user via pointermove";
					(map.getTarget() as HTMLElement).remove();
					map.setTarget(null);
					control && control.destroy();
				}
			],
			delay
		);
	};
}
