var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("node_modules/ol3-fun/ol3-fun/slowloop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function slowloop(functions, interval, cycles) {
        if (interval === void 0) { interval = 1000; }
        if (cycles === void 0) { cycles = 1; }
        var d = $.Deferred();
        var index = 0;
        if (!functions || 0 >= cycles) {
            d.resolve();
            return d;
        }
        var h = setInterval(function () {
            if (index === functions.length) {
                index = 0;
                cycles--;
                if (cycles <= 0) {
                    d.resolve();
                    return;
                }
            }
            functions[index++]();
        }, interval);
        d.done(function () { return clearInterval(h); });
        return d;
    }
    exports.slowloop = slowloop;
});
define("node_modules/ol3-fun/tests/base", ["require", "exports", "node_modules/ol3-fun/ol3-fun/slowloop"], function (require, exports, slowloop_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.slowloop = slowloop_1.slowloop;
    function describe(title, fn) {
        console.log(title || "undocumented test group");
        return window.describe(title, fn);
    }
    exports.describe = describe;
    function it(title, fn) {
        console.log(title || "undocumented test");
        return window.it(title, fn);
    }
    exports.it = it;
    function should(result, message) {
        console.log(message || "undocumented assertion");
        if (!result)
            throw message;
    }
    exports.should = should;
    function shouldEqual(a, b, message) {
        if (a != b)
            console.warn("\"" + a + "\" <> \"" + b + "\"");
        should(a == b, message);
    }
    exports.shouldEqual = shouldEqual;
    function stringify(o) {
        return JSON.stringify(o, null, "\t");
    }
    exports.stringify = stringify;
});
define("node_modules/ol3-fun/ol3-fun/common", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    exports.uuid = uuid;
    function asArray(list) {
        var result = new Array(list.length);
        for (var i = 0; i < list.length; i++) {
            result[i] = list[i];
        }
        return result;
    }
    exports.asArray = asArray;
    function toggle(e, className, force) {
        var exists = e.classList.contains(className);
        if (exists && force !== true) {
            e.classList.remove(className);
            return false;
        }
        ;
        if (!exists && force !== false) {
            e.classList.add(className);
            return true;
        }
        return exists;
    }
    exports.toggle = toggle;
    function parse(v, type) {
        if (typeof type === "string")
            return v;
        if (typeof type === "number")
            return parseFloat(v);
        if (typeof type === "boolean")
            return (v === "1" || v === "true");
        if (Array.isArray(type)) {
            return (v.split(",").map(function (v) { return parse(v, type[0]); }));
        }
        throw "unknown type: " + type;
    }
    exports.parse = parse;
    function getQueryParameters(options, url) {
        if (url === void 0) { url = window.location.href; }
        var opts = options;
        Object.keys(opts).forEach(function (k) {
            doif(getParameterByName(k, url), function (v) {
                var value = parse(v, opts[k]);
                if (value !== undefined)
                    opts[k] = value;
            });
        });
    }
    exports.getQueryParameters = getQueryParameters;
    function getParameterByName(name, url) {
        if (url === void 0) { url = window.location.href; }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    exports.getParameterByName = getParameterByName;
    function doif(v, cb) {
        if (v !== undefined && v !== null)
            cb(v);
    }
    exports.doif = doif;
    function mixin(a, b) {
        Object.keys(b).forEach(function (k) { return a[k] = b[k]; });
        return a;
    }
    exports.mixin = mixin;
    function defaults(a) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        b.forEach(function (b) {
            Object.keys(b).filter(function (k) { return a[k] === undefined; }).forEach(function (k) { return a[k] = b[k]; });
        });
        return a;
    }
    exports.defaults = defaults;
    function cssin(name, css) {
        var id = "style-" + name;
        var styleTag = document.getElementById(id);
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = id;
            styleTag.type = "text/css";
            document.head.appendChild(styleTag);
            styleTag.appendChild(document.createTextNode(css));
        }
        var dataset = styleTag.dataset;
        dataset["count"] = parseInt(dataset["count"] || "0") + 1 + "";
        return function () {
            dataset["count"] = parseInt(dataset["count"] || "0") - 1 + "";
            if (dataset["count"] === "0") {
                styleTag.remove();
            }
        };
    }
    exports.cssin = cssin;
    function debounce(func, wait, immediate) {
        if (wait === void 0) { wait = 50; }
        if (immediate === void 0) { immediate = false; }
        var timeout;
        return (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var later = function () {
                timeout = null;
                if (!immediate)
                    func.apply({}, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = window.setTimeout(later, wait);
            if (callNow)
                func.apply({}, args);
        });
    }
    exports.debounce = debounce;
    function html(html) {
        var a = document.createElement("div");
        a.innerHTML = html;
        return (a.firstElementChild || a.firstChild);
    }
    exports.html = html;
    function pair(a1, a2) {
        var result = new Array(a1.length * a2.length);
        var i = 0;
        a1.forEach(function (v1) { return a2.forEach(function (v2) { return result[i++] = [v1, v2]; }); });
        return result;
    }
    exports.pair = pair;
    function range(n) {
        var result = new Array(n);
        for (var i = 0; i < n; i++)
            result[i] = i;
        return result;
    }
    exports.range = range;
    function shuffle(array) {
        var currentIndex = array.length;
        var temporaryValue;
        var randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    exports.shuffle = shuffle;
});
define("node_modules/ol3-fun/ol3-fun/navigation", ["require", "exports", "openlayers", "jquery", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, ol, $, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function zoomToFeature(map, feature, options) {
        var promise = $.Deferred();
        options = common_1.defaults(options || {}, {
            duration: 1000,
            padding: 256,
            minResolution: 2 * map.getView().getMinResolution()
        });
        var view = map.getView();
        var currentExtent = view.calculateExtent(map.getSize());
        var targetExtent = feature.getGeometry().getExtent();
        var doit = function (duration) {
            view.fit(targetExtent, {
                size: map.getSize(),
                padding: [options.padding, options.padding, options.padding, options.padding],
                minResolution: options.minResolution,
                duration: duration,
                callback: function () { return promise.resolve(); },
            });
        };
        if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            doit(options.duration);
        }
        else if (ol.extent.containsExtent(currentExtent, targetExtent)) {
            doit(options.duration);
        }
        else {
            var fullExtent = ol.extent.createEmpty();
            ol.extent.extend(fullExtent, currentExtent);
            ol.extent.extend(fullExtent, targetExtent);
            var dscale = ol.extent.getWidth(fullExtent) / ol.extent.getWidth(currentExtent);
            var duration = 0.5 * options.duration;
            view.fit(fullExtent, {
                size: map.getSize(),
                padding: [options.padding, options.padding, options.padding, options.padding],
                minResolution: options.minResolution,
                duration: duration
            });
            setTimeout(function () { return doit(0.5 * options.duration); }, duration);
        }
        return promise;
    }
    exports.zoomToFeature = zoomToFeature;
});
define("node_modules/ol3-fun/ol3-fun/parse-dms", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function decDegFromMatch(m) {
        var signIndex = {
            "-": -1,
            "N": 1,
            "S": -1,
            "E": 1,
            "W": -1
        };
        var latLonIndex = {
            "-": "",
            "N": "lat",
            "S": "lat",
            "E": "lon",
            "W": "lon"
        };
        var degrees, minutes, seconds, sign, latLon;
        sign = signIndex[m[2]] || signIndex[m[1]] || signIndex[m[6]] || 1;
        degrees = Number(m[3]);
        minutes = m[4] ? Number(m[4]) : 0;
        seconds = m[5] ? Number(m[5]) : 0;
        latLon = latLonIndex[m[1]] || latLonIndex[m[6]];
        if (!inRange(degrees, 0, 180))
            throw 'Degrees out of range';
        if (!inRange(minutes, 0, 60))
            throw 'Minutes out of range';
        if (!inRange(seconds, 0, 60))
            throw 'Seconds out of range';
        return {
            decDeg: sign * (degrees + minutes / 60 + seconds / 3600),
            latLon: latLon
        };
    }
    function inRange(value, a, b) {
        return value >= a && value <= b;
    }
    function parse(dmsString) {
        var _a;
        dmsString = dmsString.trim();
        var dmsRe = /([NSEW])?(-)?(\d+(?:\.\d+)?)[°º:d\s]?\s?(?:(\d+(?:\.\d+)?)['’‘′:]\s?(?:(\d{1,2}(?:\.\d+)?)(?:"|″|’’|'')?)?)?\s?([NSEW])?/i;
        var dmsString2;
        var m1 = dmsString.match(dmsRe);
        if (!m1)
            throw 'Could not parse string';
        if (m1[1]) {
            m1[6] = undefined;
            dmsString2 = dmsString.substr(m1[0].length - 1).trim();
        }
        else {
            dmsString2 = dmsString.substr(m1[0].length).trim();
        }
        var decDeg1 = decDegFromMatch(m1);
        var m2 = dmsString2.match(dmsRe);
        var decDeg2 = m2 && decDegFromMatch(m2);
        if (typeof decDeg1.latLon === 'undefined') {
            if (!isNaN(decDeg1.decDeg) && decDeg2 && isNaN(decDeg2.decDeg)) {
                return decDeg1.decDeg;
            }
            else if (!isNaN(decDeg1.decDeg) && decDeg2 && !isNaN(decDeg2.decDeg)) {
                decDeg1.latLon = 'lat';
                decDeg2.latLon = 'lon';
            }
            else {
                throw 'Could not parse string';
            }
        }
        if (typeof decDeg2.latLon === 'undefined') {
            decDeg2.latLon = decDeg1.latLon === 'lat' ? 'lon' : 'lat';
        }
        return _a = {},
            _a[decDeg1.latLon] = decDeg1.decDeg,
            _a[decDeg2.latLon] = decDeg2.decDeg,
            _a;
    }
    exports.parse = parse;
});
define("node_modules/ol3-fun/index", ["require", "exports", "node_modules/ol3-fun/ol3-fun/common", "node_modules/ol3-fun/ol3-fun/navigation", "node_modules/ol3-fun/ol3-fun/parse-dms", "node_modules/ol3-fun/ol3-fun/slowloop"], function (require, exports, common_2, navigation_1, parse_dms_1, slowloop_2) {
    "use strict";
    var index = {
        asArray: common_2.asArray,
        cssin: common_2.cssin,
        debounce: common_2.debounce,
        defaults: common_2.defaults,
        doif: common_2.doif,
        getParameterByName: common_2.getParameterByName,
        getQueryParameters: common_2.getQueryParameters,
        html: common_2.html,
        mixin: common_2.mixin,
        pair: common_2.pair,
        parse: common_2.parse,
        range: common_2.range,
        shuffle: common_2.shuffle,
        toggle: common_2.toggle,
        uuid: common_2.uuid,
        slowloop: slowloop_2.slowloop,
        dms: {
            parse: parse_dms_1.parse,
        },
        navigation: {
            zoomToFeature: navigation_1.zoomToFeature,
        },
    };
    return index;
});
define("ol3-layerswitcher/ol3-layerswitcher", ["require", "exports", "openlayers", "node_modules/ol3-fun/index"], function (require, exports, ol, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function allLayers(lyr) {
        var result = [];
        lyr.getLayers().forEach(function (lyr, idx, a) {
            result.push(lyr);
            if ("getLayers" in lyr) {
                result = result.concat(allLayers(lyr));
            }
        });
        return result;
    }
    exports.DEFAULT_OPTIONS = {
        tipLabel: "Layers",
        openOnMouseOver: false,
        closeOnMouseOut: false,
        openOnClick: true,
        closeOnClick: true,
        className: "layer-switcher",
        target: null
    };
    var LayerSwitcher = (function (_super) {
        __extends(LayerSwitcher, _super);
        function LayerSwitcher(options) {
            var _this = this;
            options = index_1.defaults(options || {}, exports.DEFAULT_OPTIONS);
            _this = _super.call(this, options) || this;
            _this.options = options;
            _this.afterCreate();
            return _this;
        }
        LayerSwitcher.prototype.afterCreate = function () {
            var _this = this;
            var options = this.options;
            this.hiddenClassName = "ol-unselectable ol-control " + options.className;
            this.shownClassName = this.hiddenClassName + " shown";
            var element = document.createElement("div");
            element.className = this.hiddenClassName;
            var button = (this.button = document.createElement("button"));
            button.setAttribute("title", options.tipLabel);
            element.appendChild(button);
            this.panel = document.createElement("div");
            this.panel.className = "panel";
            element.appendChild(this.panel);
            this.unwatch = [];
            this.element = element;
            this.setTarget(options.target);
            if (options.openOnMouseOver) {
                element.addEventListener("mouseover", function () { return _this.showPanel(); });
            }
            if (options.closeOnMouseOut) {
                element.addEventListener("mouseout", function () { return _this.hidePanel(); });
            }
            if (options.openOnClick || options.closeOnClick) {
                button.addEventListener("click", function (e) {
                    _this.isVisible()
                        ? options.closeOnClick && _this.hidePanel()
                        : options.openOnClick && _this.showPanel();
                    e.preventDefault();
                });
            }
        };
        LayerSwitcher.prototype.isVisible = function () {
            return this.element.className != this.hiddenClassName;
        };
        LayerSwitcher.prototype.showPanel = function () {
            if (this.element.className != this.shownClassName) {
                this.element.className = this.shownClassName;
                this.renderPanel();
            }
        };
        LayerSwitcher.prototype.hidePanel = function () {
            this.element.className = this.hiddenClassName;
            this.unwatch.forEach(function (f) { return f(); });
        };
        LayerSwitcher.prototype.renderPanel = function () {
            var _this = this;
            this.ensureTopVisibleBaseLayerShown();
            while (this.panel.firstChild) {
                this.panel.removeChild(this.panel.firstChild);
            }
            var ul = document.createElement("ul");
            this.panel.appendChild(ul);
            this.state = [];
            var map = this.getMap();
            if (!map) {
                this.options.target.appendChild(this.element);
                return;
            }
            this.renderLayers(map, ul);
            {
                var view_1 = map && map.getView();
                var doit = function () {
                    var res = view_1.getResolution();
                    if (typeof res === "undefined")
                        return;
                    _this.state.filter(function (s) { return !!s.input; }).forEach(function (s) {
                        var min = s.layer.getMinResolution();
                        var max = s.layer.getMaxResolution();
                        s.input.disabled = !(min <= res && (max === 0 || res < max));
                    });
                };
                var h_1 = view_1.on("change:resolution", doit);
                doit();
                this.unwatch.push(function () { return ol.Observable.unByKey(h_1); });
            }
        };
        LayerSwitcher.prototype.ensureTopVisibleBaseLayerShown = function () {
            if (!this.getMap())
                return;
            var visibleBaseLyrs = allLayers(this.getMap()).filter(function (l) { return l.get("type") === "base" && l.getVisible(); });
            if (visibleBaseLyrs.length)
                this.setVisible(visibleBaseLyrs.shift(), true);
        };
        LayerSwitcher.prototype.setVisible = function (lyr, visible) {
            var _this = this;
            if (lyr.getVisible() !== visible) {
                if (visible && lyr.get("type") === "base") {
                    allLayers(this.getMap())
                        .filter(function (l) { return l !== lyr && l.get("type") === "base" && l.getVisible(); })
                        .forEach(function (l) { return _this.setVisible(l, false); });
                }
                lyr.setVisible(visible);
                this.dispatchEvent({
                    type: visible ? "show-layer" : "hide-layer",
                    layer: lyr
                });
            }
        };
        LayerSwitcher.prototype.renderLayer = function (lyr, container) {
            var _this = this;
            var result;
            var li = document.createElement("li");
            container.appendChild(li);
            var lyrTitle = lyr.get("title");
            var label = document.createElement("label");
            label.htmlFor = index_1.uuid();
            lyr.on("load:start", function () { return li.classList.add("loading"); });
            lyr.on("load:end", function () { return li.classList.remove("loading"); });
            index_1.toggle(li, "loading", true === lyr.get("loading"));
            if ("getLayers" in lyr && !lyr.get("combine")) {
                if (!lyr.get("label-only")) {
                    var input_1 = (result = document.createElement("input"));
                    input_1.id = label.htmlFor;
                    input_1.type = "checkbox";
                    input_1.checked = lyr.getVisible();
                    input_1.addEventListener("change", function () {
                        index_1.toggle(ul_1, "hide-layer-group", !input_1.checked);
                        _this.setVisible(lyr, input_1.checked);
                        var childLayers = lyr.getLayers();
                        _this.state
                            .filter(function (s) { return s.container === ul_1 && s.input && s.input.checked; })
                            .forEach(function (state) {
                            _this.setVisible(state.layer, input_1.checked);
                        });
                    });
                    li.appendChild(input_1);
                }
                li.classList.add("group");
                label.innerHTML = lyrTitle;
                li.appendChild(label);
                var ul_1 = document.createElement("ul");
                result && index_1.toggle(ul_1, "hide-layer-group", !result.checked);
                li.appendChild(ul_1);
                this.renderLayers(lyr, ul_1);
            }
            else {
                li.classList.add("layer");
                var input_2 = (result = document.createElement("input"));
                input_2.id = label.htmlFor;
                if (lyr.get("type") === "base") {
                    input_2.classList.add("basemap");
                    input_2.type = "radio";
                    input_2.addEventListener("change", function () {
                        if (input_2.checked) {
                            index_1.asArray(_this.panel.getElementsByClassName("basemap"))
                                .filter(function (i) { return i.tagName === "INPUT"; })
                                .forEach(function (i) {
                                if (i.checked && i !== input_2)
                                    i.checked = false;
                            });
                        }
                        _this.setVisible(lyr, input_2.checked);
                    });
                }
                else {
                    input_2.type = "checkbox";
                    input_2.addEventListener("change", function () {
                        _this.setVisible(lyr, input_2.checked);
                    });
                }
                input_2.checked = lyr.get("visible");
                li.appendChild(input_2);
                label.innerHTML = lyrTitle;
                li.appendChild(label);
            }
            this.state.push({
                container: container,
                input: result,
                layer: lyr
            });
        };
        LayerSwitcher.prototype.renderLayers = function (map, elm) {
            var _this = this;
            var lyrs = map
                .getLayers()
                .getArray()
                .slice()
                .reverse();
            return lyrs.filter(function (l) { return !!l.get("title"); }).forEach(function (l) { return _this.renderLayer(l, elm); });
        };
        return LayerSwitcher;
    }(ol.control.Control));
    exports.LayerSwitcher = LayerSwitcher;
});
define("index", ["require", "exports", "ol3-layerswitcher/ol3-layerswitcher"], function (require, exports, ol3_layerswitcher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LayerSwitcher = ol3_layerswitcher_1.LayerSwitcher;
    exports.DEFAULT_OPTIONS = ol3_layerswitcher_1.DEFAULT_OPTIONS;
});
define("tests/spec/layerswitcher", ["require", "exports", "openlayers", "node_modules/ol3-fun/tests/base", "index", "node_modules/ol3-fun/index"], function (require, exports, ol, base_1, index_2, index_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base_1.describe("LayerSwitcher Tests", function () {
        base_1.it("LayerSwitcher", function () {
            base_1.should(!!index_2.LayerSwitcher, "LayerSwitcher");
        });
        base_1.it("DEFAULT_OPTIONS", function () {
            var options = index_2.DEFAULT_OPTIONS;
            checkDefaultInputOptions(options);
        });
        base_1.it("Renders in DOM", function (done) {
            var cssout = index_3.cssin("map", ".map {width:16em;height:12em;border:1pt solid}");
            var target = document.createElement("div");
            target.className = "map";
            document.body.appendChild(target);
            var map = new ol.Map({
                controls: [],
                interactions: [],
                layers: [],
                target: target,
            });
            var switcher = new index_2.LayerSwitcher({});
            var refresh = function (msg) {
                console.log("refresh", msg);
                switcher.hidePanel();
                switcher.showPanel();
            };
            var tiles = ["Bing", "OSM"].map(function (n) {
                return new ol.layer.Tile({
                    title: "Tile " + n,
                    visible: n === "Bing",
                    type: "base",
                    source: new ol.source.Tile({ projection: "EPSG:3857" }),
                });
            });
            var groupLayers = new ol.Collection();
            var group1 = new ol.layer.Group({
                title: "Basemaps",
                visible: true,
                layers: groupLayers,
            });
            var vectors = ["Parcel", "Addresses", "Streets"].map(function (n) {
                return new ol.layer.Vector({
                    title: n,
                    visible: n === "Addresses",
                    source: new ol.source.Vector({}),
                });
            });
            var mapLayers = map.getLayers();
            vectors.forEach(function (t) { return t.on("change:visible", function (args) { return refresh("" + args.target.get("title")); }); });
            tiles.forEach(function (t) { return t.on("change:visible", function (args) { return refresh("" + args.target.get("title")); }); });
            [group1].forEach(function (t) { return t.on("change:visible", function (args) { return refresh("" + args.target.get("title")); }); });
            groupLayers.on("add", function (args) { return refresh("add " + args.target.get("title")); });
            mapLayers.on("add", function (args) { return refresh("add " + args.target.get("title")); });
            mapLayers.on("remove", function (args) { return refresh("remove " + args.target.get("title")); });
            switcher.setMap(map);
            index_3.slowloop([
                function () {
                    switcher.showPanel();
                    base_1.shouldEqual(switcher.isVisible(), true, "Panel is visible");
                },
                function () { return mapLayers.insertAt(0, group1); },
                function () { return groupLayers.insertAt(0, tiles[0]); },
                function () { return groupLayers.insertAt(1, tiles[1]); },
                function () { return tiles[0].setVisible(!tiles[0].getVisible()); },
                function () { return tiles[0].setVisible(!tiles[0].getVisible()); },
                function () { return tiles[1].setVisible(!tiles[1].getVisible()); },
                function () { return tiles[1].setVisible(!tiles[1].getVisible()); },
                function () { return group1.setVisible(!group1.getVisible()); },
                function () { return group1.setVisible(!group1.getVisible()); },
                function () { return mapLayers.insertAt(1, vectors[0]); },
                function () { return mapLayers.insertAt(2, vectors[1]); },
                function () { return mapLayers.insertAt(0, vectors[2]); },
                function () { return vectors[0].setVisible(!vectors[0].getVisible()); },
                function () { return vectors[0].setVisible(!vectors[0].getVisible()); },
                function () { return vectors[1].setVisible(!vectors[1].getVisible()); },
                function () { return vectors[1].setVisible(!vectors[1].getVisible()); },
                function () { return switcher.hidePanel(); },
                function () { return switcher.showPanel(); },
                function () { return mapLayers.remove(vectors[2]); },
                function () { return mapLayers.insertAt(0, vectors[2]); },
                function () { return vectors[2].setVisible(true); },
            ], 100).then(function () {
                base_1.shouldEqual(vectors[0].getVisible(), false, "Parcel is hidden");
                vectors[0].setVisible(true);
                base_1.shouldEqual(vectors[1].getVisible(), true, "Address is visible");
                base_1.shouldEqual(vectors[2].getVisible(), true, "Address is visible");
                base_1.shouldEqual(tiles[0].getVisible(), true, "Bing is visible");
                base_1.shouldEqual(tiles[1].getVisible(), false, "OSM is hidden");
                tiles[1].setVisible(true);
                base_1.shouldEqual(tiles[1].getVisible(), true, "OSM is now visible");
                base_1.shouldEqual(tiles[0].getVisible(), true, "Bing is still visible");
                base_1.shouldEqual(switcher.isVisible(), true, "Panel is visible");
                done();
            });
        }).timeout(20 * 200);
    });
    function checkDefaultInputOptions(options) {
        base_1.should(!!options, "options");
        base_1.shouldEqual(options.className, "layer-switcher", "className");
        base_1.shouldEqual(options.closeOnClick, true, "closeOnClick");
        base_1.shouldEqual(options.closeOnMouseOut, false, "closeOnMouseOut");
        base_1.shouldEqual(options.openOnClick, true, "openOnClick");
        base_1.shouldEqual(options.openOnMouseOver, false, "openOnMouseOver");
        base_1.shouldEqual(options.target, undefined, "target");
        base_1.shouldEqual(options.tipLabel, "Layers", "tipLabel");
    }
});
define("tests/index", ["require", "exports", "tests/spec/layerswitcher"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=index.js.map