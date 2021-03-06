import ol = require("openlayers");
import { asArray, defaults, toggle, uuid, mixin, pair, range, cssin, loadCss } from "ol3-fun/index";
import { GlobalObject } from "openlayers";

const olcss = {
	CLASS_CONTROL: "ol-control",
	CLASS_UNSELECTABLE: "ol-unselectable",
	CLASS_UNSUPPORTED: "ol-unsupported",
	CLASS_HIDDEN: "ol-hidden"
};

/**
 * Creates an array containing all sub-layers
 */
function allLayers(lyr: ol.Map | ol.layer.Group) {
	let result = <Array<ol.layer.Base>>[];
	lyr.getLayers().forEach(function(lyr, idx, a) {
		result.push(lyr);
		if ("getLayers" in lyr) {
			result = result.concat(allLayers(<ol.layer.Group>lyr));
		}
	});
	return result;
}

const eventNames = {
	dispose: "dispose",
	hide: "hide",
	show: "show"
};

export interface ILayerSwitcherOptions {
	map?: ol.Map;
	tipLabel?: string;
	openOnMouseOver?: boolean;
	closeOnMouseOut?: boolean;
	openOnClick?: boolean;
	closeOnClick?: boolean;
	className?: string;
	position?: string;
	expanded?: boolean;
	target?: HTMLElement;
}

export const DEFAULT_OPTIONS: ILayerSwitcherOptions = {
	tipLabel: "Layers",
	openOnMouseOver: false,
	closeOnMouseOut: false,
	openOnClick: true,
	closeOnClick: true,
	className: "layer-switcher",
	position: "bottom-2 right-2",
	expanded: false,
	target: <HTMLElement>null
};

export interface ILayerSwitcher extends ol.control.Control {
	on(type: "show-layer", listener: any): any;
	on(
		type: string | string[],
		listener: ol.EventsListenerFunctionType,
		opt_this?: GlobalObject
	): ol.EventsKey | ol.EventsKey[];
	destroy(): void;
}

export class LayerSwitcher extends ol.control.Control implements ILayerSwitcher {
	private state: Array<{ container: HTMLElement; input: HTMLInputElement; layer: ol.layer.Base }>;
	private unwatch: Array<() => void>;
	private options: ILayerSwitcherOptions;

	hiddenClassName: string;
	shownClassName: string;
	panel: HTMLDivElement;
	element: HTMLElement;
	button: HTMLButtonElement;

	static create(options?: ILayerSwitcherOptions) {
		loadCss({ name: "ol3-layerswitcher", url: "../ol3-layerswitcher/css/ol3-layerswitcher.css" });
		return new LayerSwitcher(options);
	}

	constructor(options?: ILayerSwitcherOptions) {
		options = defaults(options || {}, DEFAULT_OPTIONS);
		super(options);
		this.options = options;
		this.unwatch = [];
		this.afterCreate();
	}

	destroy() {
		this.hidePanel();
		this.unwatch = [];
		this.getMap() && this.getMap().removeControl(this);
		this.dispatchEvent(eventNames.dispose);
		this.setTarget(null);
	}

	setPosition(position: string) {
		this.options.position.split(" ").forEach(k => this.options.target.classList.remove(k));

		position.split(" ").forEach(k => this.options.target.classList.add(k));

		this.options.position = position;
	}

	cssin() {
		let className = this.options.className;
		let positions = pair("top left right bottom".split(" "), range(24)).map(
			pos => `.${className}.${pos[0] + (-pos[1] || "")} { ${pos[0]}:${0.5 + pos[1]}em; }`
		);
		cssin(className, positions.join("\n"));
	}

	private afterCreate() {
		let options = this.options;
		this.hiddenClassName = `${options.className} ${options.position} ${olcss.CLASS_UNSELECTABLE} ${
			olcss.CLASS_CONTROL
		}`;
		this.shownClassName = this.hiddenClassName + " shown";
		this.cssin();

		let element = document.createElement("div");
		element.className = this.hiddenClassName;

		let button = (this.button = document.createElement("button"));
		button.setAttribute("title", options.tipLabel);
		element.appendChild(button);

		this.panel = document.createElement("div");
		this.panel.className = "panel";
		element.appendChild(this.panel);

		this.element = element;
		this.setTarget(options.target);

		if (options.openOnMouseOver) {
			element.addEventListener("mouseover", () => this.showPanel());
		}
		if (options.closeOnMouseOut) {
			element.addEventListener("mouseout", () => this.hidePanel());
		}
		if (options.openOnClick || options.closeOnClick) {
			button.addEventListener("click", e => {
				this.isVisible() ? options.closeOnClick && this.hidePanel() : options.openOnClick && this.showPanel();
				e.preventDefault();
			});
		}
		options.map && this.setMap(options.map);
	}

	isVisible() {
		return this.element.className != this.hiddenClassName;
	}

	/**
	 * Show the layer panel.
	 */
	showPanel() {
		if (this.element.className != this.shownClassName) {
			this.element.className = this.shownClassName;
			this.renderPanel();
		}
	}

	/**
	 * Hide the layer panel.
	 */
	hidePanel() {
		this.element.className = this.hiddenClassName;
		this.unwatch.forEach(f => f());
		this.unwatch = [];
	}

	/**
	 * Re-draw the layer panel to represent the current state of the layers.
	 */
	renderPanel() {
		this.ensureTopVisibleBaseLayerShown();

		while (this.panel.firstChild) {
			this.panel.removeChild(this.panel.firstChild);
		}

		var ul = document.createElement("ul");
		this.panel.appendChild(ul);

		this.state = [];

		let map = this.getMap();
		if (!map) {
			this.options.target.appendChild(this.element);
			return;
		}

		this.renderLayers(map, ul);

		// update when resolution changes..should be using debounce here
		{
			let view = map && map.getView();
			let doit = () => {
				let res = view.getResolution();
				if (typeof res === "undefined") return;
				this.state.filter(s => !!s.input).forEach(s => {
					let min = s.layer.getMinResolution();
					let max = s.layer.getMaxResolution();
					s.input.disabled = !(min <= res && (max === 0 || res < max));
				});
			};
			let h = view.on("change:resolution", doit);
			doit();

			this.unwatch.push(() => ol.Observable.unByKey(h));
		}
	}

	/**
	 * Ensure only the top-most base layer is visible if more than one is visible.
	 */
	private ensureTopVisibleBaseLayerShown() {
		if (!this.getMap()) return;
		let visibleBaseLyrs = allLayers(this.getMap()).filter(l => l.get("type") === "base" && l.getVisible());
		if (visibleBaseLyrs.length) this.setVisible(visibleBaseLyrs.shift(), true);
	}

	/**
	 * Toggle the visible state of a layer.
	 * Takes care of hiding other layers in the same exclusive group if the layer
	 * is toggle to visible.
	 */
	private setVisible(lyr: ol.layer.Base, visible: boolean) {
		if (lyr.getVisible() !== visible) {
			if (visible && lyr.get("type") === "base") {
				// Hide all other base layers regardless of grouping
				allLayers(this.getMap())
					.filter(l => l !== lyr && l.get("type") === "base" && l.getVisible())
					.forEach(l => this.setVisible(l, false));
			}
			lyr.setVisible(visible);
			this.dispatchEvent({
				type: visible ? "show-layer" : "hide-layer",
				layer: lyr
			});
		}
	}

	/**
	 * Render all layers that are children of a group.
	 */
	private renderLayer(lyr: ol.layer.Base & { getVisible: Function }, container: HTMLElement) {
		let result: HTMLInputElement;

		let li = document.createElement("li");
		container.appendChild(li);

		let lyrTitle = lyr.get("title");

		let label = document.createElement("label");
		label.htmlFor = uuid();

		lyr.on("load:start", () => li.classList.add("loading"));
		lyr.on("load:end", () => li.classList.remove("loading"));
		toggle(li, "loading", true === lyr.get("loading"));

		if ("getLayers" in lyr && !lyr.get("combine")) {
			if (!lyr.get("label-only")) {
				let input = (result = document.createElement("input"));
				input.id = label.htmlFor;
				input.type = "checkbox";
				input.checked = lyr.getVisible();

				input.addEventListener("change", () => {
					toggle(ul, "hide-layer-group", !input.checked);
					this.setVisible(lyr, input.checked);
					let childLayers = (<ol.layer.Group>lyr).getLayers();
					this.state.filter(s => s.container === ul && s.input && s.input.checked).forEach(state => {
						this.setVisible(state.layer, input.checked);
					});
				});
				li.appendChild(input);
			}

			li.classList.add("group");
			label.innerHTML = lyrTitle;
			li.appendChild(label);
			let ul = document.createElement("ul");
			result && toggle(ul, "hide-layer-group", !result.checked);
			li.appendChild(ul);

			this.renderLayers(<ol.layer.Group>lyr, ul);
		} else {
			li.classList.add("layer");
			let input = (result = document.createElement("input"));
			input.id = label.htmlFor;

			if (lyr.get("type") === "base") {
				input.classList.add("basemap");
				input.type = "radio";
				input.addEventListener("change", () => {
					if (input.checked) {
						asArray<HTMLInputElement>(this.panel.getElementsByClassName("basemap"))
							.filter(i => i.tagName === "INPUT")
							.forEach(i => {
								if (i.checked && i !== input) i.checked = false;
							});
					}
					this.setVisible(lyr, input.checked);
				});
			} else {
				input.type = "checkbox";
				input.addEventListener("change", () => {
					this.setVisible(lyr, input.checked);
				});
			}
			input.checked = lyr.get("visible");
			li.appendChild(input);

			label.innerHTML = lyrTitle;
			li.appendChild(label);
		}

		this.state.push({
			container: container,
			input: result,
			layer: lyr
		});
	}

	/**
	 * Render all layers that are children of a group.
	 */
	private renderLayers(map: ol.Map | ol.layer.Group, elm: HTMLElement) {
		var lyrs = map
			.getLayers()
			.getArray()
			.slice()
			.reverse();
		return lyrs.filter(l => !!l.get("title")).forEach(l => this.renderLayer(l, elm));
	}

	addLayer(layer: ol.layer.Layer, title: string) {
		layer.set("title", title);
	}
}
