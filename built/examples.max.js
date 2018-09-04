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
define("examples/index", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        var l = window.location;
        var path = "" + l.origin + l.pathname + "?run=examples/";
        var labs = "\n    ags-discovery\n    ags-webmap\n    layerswitcher\n    accessibility\n\n    index\n    ";
        document.writeln("\n    <p>\n    Watch the console output for failed assertions (blank is good).\n    </p>\n    ");
        document.writeln(labs
            .split(/ /)
            .map(function (v) { return v.trim(); })
            .filter(function (v) { return !!v; })
            .sort()
            .map(function (lab) { return "<a href=" + path + lab + "&debug=1>" + lab + "</a>"; })
            .join("<br/>"));
    }
    exports.run = run;
    ;
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
    function toggle(e, className, toggle) {
        if (toggle === void 0) { toggle = false; }
        !toggle ? e.classList.remove(className) : e.classList.add(className);
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
        var _this = this;
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
                    func.apply(_this, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                func.call(_this, args);
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
define("node_modules/ol3-fun/ol3-fun/navigation", ["require", "exports", "openlayers", "node_modules/ol3-fun/ol3-fun/common"], function (require, exports, ol, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function zoomToFeature(map, feature, options) {
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
                duration: duration
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
define("node_modules/ol3-fun/index", ["require", "exports", "node_modules/ol3-fun/ol3-fun/common", "node_modules/ol3-fun/ol3-fun/navigation", "node_modules/ol3-fun/ol3-fun/parse-dms"], function (require, exports, common, navigation, dms) {
    "use strict";
    var index = common.defaults(common, {
        dms: dms,
        navigation: navigation
    });
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
        tipLabel: 'Layers',
        openOnMouseOver: false,
        closeOnMouseOut: false,
        openOnClick: true,
        closeOnClick: true,
        className: 'layer-switcher',
        target: null
    };
    var LayerSwitcher = (function (_super) {
        __extends(LayerSwitcher, _super);
        function LayerSwitcher(options) {
            var _this = this;
            options = index_1.defaults(options || {}, exports.DEFAULT_OPTIONS);
            _this = _super.call(this, options) || this;
            _this.afterCreate(options);
            return _this;
        }
        LayerSwitcher.prototype.afterCreate = function (options) {
            var _this = this;
            this.hiddenClassName = "ol-unselectable ol-control " + options.className;
            this.shownClassName = this.hiddenClassName + ' shown';
            var element = document.createElement('div');
            element.className = this.hiddenClassName;
            var button = this.button = document.createElement('button');
            button.setAttribute('title', options.tipLabel);
            element.appendChild(button);
            this.panel = document.createElement('div');
            this.panel.className = 'panel';
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
                button.addEventListener('click', function (e) {
                    _this.isVisible() ? options.closeOnClick && _this.hidePanel() : options.openOnClick && _this.showPanel();
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
            var ul = document.createElement('ul');
            this.panel.appendChild(ul);
            this.state = [];
            var map = this.getMap();
            var view = map.getView();
            this.renderLayers(map, ul);
            {
                var doit = function () {
                    var res = view.getResolution();
                    _this.state.filter(function (s) { return !!s.input; }).forEach(function (s) {
                        var min = s.layer.getMinResolution();
                        var max = s.layer.getMaxResolution();
                        s.input.disabled = !(min <= res && (max === 0 || res < max));
                    });
                };
                var h_1 = view.on("change:resolution", doit);
                doit();
                this.unwatch.push(function () { return ol.Observable.unByKey(h_1); });
            }
        };
        ;
        LayerSwitcher.prototype.ensureTopVisibleBaseLayerShown = function () {
            var visibleBaseLyrs = allLayers(this.getMap()).filter(function (l) { return l.get('type') === 'base' && l.getVisible(); });
            if (visibleBaseLyrs.length)
                this.setVisible(visibleBaseLyrs.shift(), true);
        };
        ;
        LayerSwitcher.prototype.setVisible = function (lyr, visible) {
            var _this = this;
            if (lyr.getVisible() !== visible) {
                if (visible && lyr.get('type') === 'base') {
                    allLayers(this.getMap()).filter(function (l) { return l !== lyr && l.get('type') === 'base' && l.getVisible(); }).forEach(function (l) { return _this.setVisible(l, false); });
                }
                lyr.setVisible(visible);
                this.dispatchEvent({
                    type: visible ? "show-layer" : "hide-layer",
                    layer: lyr
                });
            }
        };
        ;
        LayerSwitcher.prototype.renderLayer = function (lyr, container) {
            var _this = this;
            var result;
            var li = document.createElement('li');
            container.appendChild(li);
            var lyrTitle = lyr.get('title');
            var label = document.createElement('label');
            label.htmlFor = index_1.uuid();
            lyr.on('load:start', function () { return li.classList.add("loading"); });
            lyr.on('load:end', function () { return li.classList.remove("loading"); });
            index_1.toggle(li, "loading", true === lyr.get("loading"));
            if ('getLayers' in lyr && !lyr.get('combine')) {
                if (!lyr.get('label-only')) {
                    var input_1 = result = document.createElement('input');
                    input_1.id = label.htmlFor;
                    input_1.type = 'checkbox';
                    input_1.checked = lyr.getVisible();
                    input_1.addEventListener('change', function () {
                        index_1.toggle(ul_1, 'hide-layer-group', !input_1.checked);
                        _this.setVisible(lyr, input_1.checked);
                        var childLayers = lyr.getLayers();
                        _this.state.filter(function (s) { return s.container === ul_1 && s.input && s.input.checked; }).forEach(function (state) {
                            _this.setVisible(state.layer, input_1.checked);
                        });
                    });
                    li.appendChild(input_1);
                }
                li.classList.add('group');
                label.innerHTML = lyrTitle;
                li.appendChild(label);
                var ul_1 = document.createElement('ul');
                result && index_1.toggle(ul_1, 'hide-layer-group', !result.checked);
                li.appendChild(ul_1);
                this.renderLayers(lyr, ul_1);
            }
            else {
                li.classList.add('layer');
                var input_2 = result = document.createElement('input');
                input_2.id = label.htmlFor;
                if (lyr.get('type') === 'base') {
                    input_2.classList.add('basemap');
                    input_2.type = 'radio';
                    input_2.addEventListener("change", function () {
                        if (input_2.checked) {
                            index_1.asArray(_this.panel.getElementsByClassName("basemap")).filter(function (i) { return i.tagName === "INPUT"; }).forEach(function (i) {
                                if (i.checked && i !== input_2)
                                    i.checked = false;
                            });
                        }
                        _this.setVisible(lyr, input_2.checked);
                    });
                }
                else {
                    input_2.type = 'checkbox';
                    input_2.addEventListener("change", function () {
                        _this.setVisible(lyr, input_2.checked);
                    });
                }
                input_2.checked = lyr.get('visible');
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
            var lyrs = map.getLayers().getArray().slice().reverse();
            return lyrs.filter(function (l) { return !!l.get('title'); }).forEach(function (l) { return _this.renderLayer(l, elm); });
        };
        return LayerSwitcher;
    }(ol.control.Control));
    exports.LayerSwitcher = LayerSwitcher;
});
define("examples/accessibility", ["require", "exports", "openlayers", "ol3-layerswitcher/ol3-layerswitcher"], function (require, exports, ol, ol3_layerswitcher_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        var map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Group({
                    'title': 'Base maps',
                    layers: [
                        new ol.layer.Group({
                            'title': 'OSM and Water Color',
                            'label-only': true,
                            layers: [
                                new ol.layer.Tile({
                                    title: 'Water color',
                                    type: 'base',
                                    visible: false,
                                    source: new ol.source.Stamen({
                                        layer: 'watercolor'
                                    })
                                }),
                                new ol.layer.Tile({
                                    title: 'OSM',
                                    type: 'base',
                                    visible: true,
                                    source: new ol.source.OSM()
                                })
                            ]
                        })
                    ]
                }),
                new ol.layer.Group({
                    title: 'Overlays',
                    layers: [
                        new ol.layer.Group({
                            title: "Countries",
                            layers: [
                                new ol.layer.Tile({
                                    title: 'Countries',
                                    source: new ol.source.TileWMS({
                                        url: 'http://localhost:8080/geoserver/IPS860/wms',
                                        params: { 'LAYERS': 'IPS860:addresses' },
                                        serverType: 'geoserver'
                                    })
                                })
                            ]
                        })
                    ]
                })
            ],
            view: new ol.View({
                center: ol.proj.transform([-85, 35], 'EPSG:4326', 'EPSG:3857'),
                zoom: 6
            })
        });
        var layerSwitcher = new ol3_layerswitcher_1.LayerSwitcher({
            tipLabel: 'Layers',
            openOnMouseOver: false,
            closeOnMouseOut: false,
            openOnClick: true,
            closeOnClick: true,
            target: null
        });
        layerSwitcher.on("show-layer", function (args) {
            console.log("show layer:", args.layer.get("title"));
        });
        layerSwitcher.on("hide-layer", function (args) {
            console.log("hide layer:", args.layer.get("title"));
        });
        map.addControl(layerSwitcher);
    }
    exports.run = run;
});
define("ol3-layerswitcher/extras/ajax", ["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    var Ajax = (function () {
        function Ajax(url) {
            this.url = url;
            this.options = {
                use_json: true,
                use_cors: true
            };
        }
        Ajax.prototype.jsonp = function (args, url) {
            if (url === void 0) { url = this.url; }
            var d = $.Deferred();
            args["callback"] = "define";
            var uri = url + "?" + Object.keys(args).map(function (k) { return k + "=" + args[k]; }).join('&');
            require([uri], function (data) { return d.resolve(data); });
            return d;
        };
        Ajax.prototype.ajax = function (method, args, url) {
            if (url === void 0) { url = this.url; }
            var isData = method === "POST" || method === "PUT";
            var isJson = this.options.use_json;
            var isCors = this.options.use_cors;
            var d = $.Deferred();
            var client = new XMLHttpRequest();
            if (isCors)
                client.withCredentials = true;
            var uri = url;
            var data = null;
            if (args) {
                if (isData) {
                    data = JSON.stringify(args);
                }
                else {
                    uri += '?';
                    var argcount = 0;
                    for (var key in args) {
                        if (args.hasOwnProperty(key)) {
                            if (argcount++) {
                                uri += '&';
                            }
                            uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                        }
                    }
                }
            }
            client.open(method, uri, true);
            if (isData && isJson)
                client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            client.send(data);
            client.onload = function () {
                console.log("content-type", client.getResponseHeader("Content-Type"));
                if (client.status >= 200 && client.status < 300) {
                    isJson = isJson || 0 === client.getResponseHeader("Content-Type").indexOf("application/json");
                    d.resolve(isJson ? JSON.parse(client.response) : client.response);
                }
                else {
                    d.reject(client.statusText);
                }
            };
            client.onerror = function () { return d.reject(client.statusText); };
            return d;
        };
        Ajax.prototype.get = function (args) {
            return this.ajax('GET', args);
        };
        Ajax.prototype.post = function (args) {
            return this.ajax('POST', args);
        };
        Ajax.prototype.put = function (args) {
            return this.ajax('PUT', args);
        };
        Ajax.prototype.delete = function (args) {
            return this.ajax('DELETE', args);
        };
        return Ajax;
    }());
    return Ajax;
});
define("ol3-layerswitcher/extras/ags-catalog", ["require", "exports", "ol3-layerswitcher/extras/ajax"], function (require, exports, Ajax) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function defaults(a) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        b.filter(function (b) { return !!b; }).forEach(function (b) {
            Object.keys(b).filter(function (k) { return a[k] === undefined; }).forEach(function (k) { return a[k] = b[k]; });
        });
        return a;
    }
    var Catalog = (function () {
        function Catalog(url) {
            this.ajax = new Ajax(url);
        }
        Catalog.prototype.about = function (data) {
            var req = defaults({
                f: "pjson"
            }, data);
            return this.ajax.jsonp(req);
        };
        Catalog.prototype.aboutFolder = function (folder) {
            var ajax = new Ajax(this.ajax.url + "/" + folder);
            var req = {
                f: "pjson"
            };
            return ajax.jsonp(req);
        };
        Catalog.prototype.aboutFeatureServer = function (name) {
            var ajax = new Ajax(this.ajax.url + "/" + name + "/FeatureServer");
            var req = {
                f: "pjson"
            };
            return defaults(ajax.jsonp(req), { url: ajax.url });
        };
        Catalog.prototype.aboutMapServer = function (name) {
            var ajax = new Ajax(this.ajax.url + "/" + name + "/MapServer");
            var req = {
                f: "pjson"
            };
            return defaults(ajax.jsonp(req), { url: ajax.url });
        };
        Catalog.prototype.aboutLayer = function (layer) {
            var ajax = new Ajax(this.ajax.url + "/" + layer);
            var req = {
                f: "pjson"
            };
            return ajax.jsonp(req);
        };
        return Catalog;
    }());
    exports.Catalog = Catalog;
});
define("ol3-layerswitcher/extras/ags-webmap", ["require", "exports", "ol3-layerswitcher/extras/ajax"], function (require, exports, Ajax) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DEFAULT_URLS = [
        "https://www.arcgis.com/sharing/rest/content/items/204d94c9b1374de9a21574c9efa31164/data?f=json",
        "https://www.arcgis.com/sharing/rest/content/items/a193c5459e6e4fd99ebf09d893d65cf0/data?f=json"
    ];
    var WebMap = (function () {
        function WebMap() {
        }
        WebMap.prototype.get = function (url) {
            if (url === void 0) { url = DEFAULT_URLS[1]; }
            var service = new Ajax(url);
            return service.get();
        };
        return WebMap;
    }());
    exports.WebMap = WebMap;
});
define("ol3-layerswitcher/extras/ags-layer-factory", ["require", "exports", "openlayers"], function (require, exports, ol) {
    "use strict";
    function asRes(scale, dpi) {
        if (dpi === void 0) { dpi = 90.71428571428572; }
        var inchesPerFoot = 12.0;
        var inchesPerMeter = (inchesPerFoot / ol.proj.METERS_PER_UNIT["ft"]);
        var dotsPerUnit = dpi * inchesPerMeter;
        return scale / dotsPerUnit;
    }
    var VectorLayer = (function (_super) {
        __extends(VectorLayer, _super);
        function VectorLayer(options) {
            return _super.call(this, options) || this;
        }
        return VectorLayer;
    }(ol.layer.Vector));
    var AgsLayerFactory = (function () {
        function AgsLayerFactory() {
        }
        AgsLayerFactory.prototype.asExtent = function (appInfo) {
        };
        AgsLayerFactory.prototype.asEvented = function (layer) {
            var loadCount = 0;
            var source = layer.getSource();
            if (source.on && layer.dispatchEvent) {
                source.on("tileloadstart", function () {
                    if (0 === loadCount++)
                        layer.dispatchEvent("load:start");
                    layer.set("loading", true);
                });
                source.on("tileloadend", function () {
                    if (0 === --loadCount)
                        layer.dispatchEvent("load:end");
                    layer.set("loading", false);
                });
            }
            return layer;
        };
        AgsLayerFactory.prototype.asAgsLayer = function (layerInfo, appInfo) {
            switch (layerInfo.layerType) {
                case "ArcGISFeatureLayer":
                    if (layerInfo.featureCollection)
                        return this.asFeatureCollection(layerInfo, appInfo);
                    return this.asEvented(this.asArcGISFeatureLayer(layerInfo, appInfo));
                case "ArcGISTiledMapServiceLayer":
                    return this.asEvented(this.asArcGISTiledMapServiceLayer(layerInfo, appInfo));
                default:
                    debugger;
                    break;
            }
        };
        AgsLayerFactory.prototype.asArcGISTiledMapServiceLayer = function (layerInfo, appInfo) {
            var srs = layerInfo.spatialReference || appInfo.spatialReference;
            var srsCode = !srs ? "3857" : (typeof srs === "string") ? srs : (srs.latestWkid || srs.wkid);
            var source = new ol.source.XYZ({
                url: layerInfo.url + '/tile/{z}/{y}/{x}',
                projection: "EPSG:" + srsCode
            });
            var tileOptions = {
                id: layerInfo.id,
                title: layerInfo.title || layerInfo.id,
                type: 'base',
                visible: false,
                source: source
            };
            var layer = new ol.layer.Tile(tileOptions);
            return layer;
        };
        AgsLayerFactory.prototype.asFeatureCollection = function (layerInfo, appInfo) {
            var _this = this;
            var source = new ol.source.Vector();
            var layer = new VectorLayer({
                title: layerInfo.id,
                source: source
            });
            var style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "red"
                })
            });
            layer.setStyle(function (feature, resolution) {
                debugger;
                return style;
            });
            layer.setVisible(true);
            layerInfo.featureCollection.layers.forEach(function (l) {
                switch (l.featureSet.geometryType) {
                    case "esriGeometryPolygon":
                        var features = _this.asEsriGeometryPolygon(l.featureSet);
                        debugger;
                        features.forEach(function (f) { return source.addFeature(f); });
                        break;
                }
            });
            return layer;
        };
        AgsLayerFactory.prototype.asEsriGeometryPolygon = function (featureSet) {
            console.assert(featureSet.geometryType === "esriGeometryPolygon");
            return featureSet.features.map(function (f) { return new ol.Feature({
                attributes: f.attributes,
                geometry: new ol.geom.Polygon(f.geometry.rings)
            }); });
        };
        AgsLayerFactory.prototype.asArcGISFeatureLayer = function (layerInfo, appInfo) {
            layerInfo.url = layerInfo.url.replace("FeatureServer", "MapServer");
            layerInfo.id = layerInfo.url.substring(1 + layerInfo.url.lastIndexOf("/"));
            layerInfo.url = layerInfo.url.substring(0, layerInfo.url.lastIndexOf("/"));
            var source = new ol.source.TileArcGISRest({
                url: layerInfo.url,
                params: {
                    layers: "show:" + layerInfo.id
                }
            });
            var tileOptions = {
                id: layerInfo.id,
                title: layerInfo.title,
                visible: false,
                source: source
            };
            if (appInfo) {
                if (appInfo.minScale)
                    tileOptions.maxResolution = asRes(appInfo.minScale);
                if (appInfo.maxScale)
                    tileOptions.minResolution = asRes(appInfo.maxScale);
            }
            var layer = new ol.layer.Tile(tileOptions);
            return layer;
        };
        return AgsLayerFactory;
    }());
    return AgsLayerFactory;
});
define("examples/ags-discovery", ["require", "exports", "openlayers", "ol3-layerswitcher/ol3-layerswitcher", "ol3-layerswitcher/extras/ags-catalog", "proj4", "ol3-layerswitcher/extras/ags-layer-factory"], function (require, exports, ol, ol3_layerswitcher_2, AgsDiscovery, proj4, AgsLayerFactory) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        ol.proj.proj4.register(proj4);
        function asRes(scale, dpi) {
            if (dpi === void 0) { dpi = 90.71428571428572; }
            var inchesPerFoot = 12.0;
            var inchesPerMeter = (inchesPerFoot / ol.proj.METERS_PER_UNIT["ft"]);
            var dotsPerUnit = dpi * inchesPerMeter;
            return scale / dotsPerUnit;
        }
        proj4.defs("EPSG:4269", "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs");
        var agsLayerFactory = new AgsLayerFactory();
        var map = new ol.Map({
            target: 'map',
            layers: [],
            view: new ol.View({
                center: ol.proj.transform([-85, 35], 'EPSG:4326', 'EPSG:3857'),
                zoom: 6
            })
        });
        var layerSwitcher = new ol3_layerswitcher_2.LayerSwitcher({
            openOnMouseOver: true
        });
        layerSwitcher.on("show-layer", function (args) {
            console.log("show layer:", args.layer.get("title"));
            if (args.layer.get("extent")) {
                var view = map.getView();
                var extent = args.layer.get("extent");
                var currentExtent = view.calculateExtent(map.getSize());
                if (!ol.extent.intersects(currentExtent, extent)) {
                    view.fit(extent, { size: map.getSize() });
                }
            }
        });
        layerSwitcher.on("hide-layer", function (args) {
            console.log("hide layer:", args.layer.get("title"));
        });
        map.addControl(layerSwitcher);
        function discover(url) {
            var rootGroup = new ol.layer.Group({
                title: "sampleserver1",
                visible: false,
                layers: []
            });
            map.addLayer(rootGroup);
            var service = new AgsDiscovery.Catalog("" + (location.protocol === 'file:' ? 'http:' : location.protocol) + url);
            service
                .about()
                .then(function (value) {
                false && value.services.filter(function (s) { return s.type === "FeatureServer"; }).forEach(function (s) {
                    service.aboutFeatureServer(s.name).then(function (s) { return console.log("featureServer", s); });
                });
                false && value.services.filter(function (s) { return s.type === "MapServer"; }).forEach(function (s) {
                    service.aboutMapServer(s.name).then(function (s) { return console.log("MapServer", s); });
                });
                var addFolders = function (group, folders) {
                    folders.forEach(function (f) {
                        var folderGroup = new ol.layer.Group({
                            title: f,
                            visible: false,
                            layers: []
                        });
                        service.aboutFolder(f).then(function (folderInfo) {
                            var folders = folderInfo.folders;
                            var services = folderInfo.services.filter(function (serviceInfo) { return serviceInfo.type === "MapServer"; });
                            if (!folders.length && !services.length)
                                return;
                            rootGroup.getLayers().push(folderGroup);
                            addFolders(folderGroup, folders);
                            services.forEach(function (serviceInfo) {
                                var p = service.aboutMapServer(serviceInfo.name);
                                p.then(function (s) {
                                    var inSrs = "EPSG:4326";
                                    var extent = null;
                                    [s.initialExtent, s.fullExtent].some(function (agsExtent) {
                                        var olExtent = ol.proj.transformExtent([agsExtent.xmin, agsExtent.ymin, agsExtent.xmax, agsExtent.ymax], inSrs, 'EPSG:3857');
                                        if (olExtent.every(function (v) { return !isNaN(v); })) {
                                            extent = olExtent;
                                            return true;
                                        }
                                    });
                                    if (s.spatialReference) {
                                        if (s.spatialReference.wkid) {
                                            inSrs = "EPSG:" + s.spatialReference.wkid;
                                        }
                                        if (s.spatialReference.wkt) {
                                            inSrs = proj4.Proj(s.spatialReference.wkt).srsCode;
                                            proj4.defs(inSrs, s.spatialReference.wkt);
                                        }
                                    }
                                    if (s.singleFusedMapCache) {
                                        var layer = agsLayerFactory.asArcGISTiledMapServiceLayer({
                                            id: serviceInfo.name,
                                            layerType: "ArcGISTiledMapServiceLayer",
                                            url: p.url,
                                            visibility: false,
                                            opacity: 1,
                                            title: serviceInfo.name,
                                            spatialReference: inSrs
                                        });
                                        folderGroup.getLayers().push(layer);
                                    }
                                    else {
                                        s.layers.forEach(function (layerInfo) {
                                            var source = new ol.source.TileArcGISRest({
                                                url: p.url,
                                                params: {
                                                    layers: "show:" + layerInfo.id
                                                }
                                            });
                                            var tileOptions = {
                                                id: serviceInfo.name + "/" + layerInfo.id,
                                                title: layerInfo.name,
                                                visible: false,
                                                extent: extent,
                                                source: source
                                            };
                                            if (layerInfo.minScale)
                                                tileOptions.maxResolution = asRes(layerInfo.minScale);
                                            if (layerInfo.maxScale)
                                                tileOptions.minResolution = asRes(layerInfo.maxScale);
                                            var layer = new ol.layer.Tile(tileOptions);
                                            folderGroup.getLayers().push(layer);
                                            {
                                                var loadCount_1 = 0;
                                                source.on("tileloadstart", function () {
                                                    if (0 === loadCount_1++)
                                                        layer.dispatchEvent("load:start");
                                                    layer.set("loading", true);
                                                });
                                                source.on("tileloadend", function () {
                                                    if (0 === --loadCount_1)
                                                        layer.dispatchEvent("load:end");
                                                    layer.set("loading", false);
                                                });
                                            }
                                        });
                                    }
                                });
                            });
                        });
                    });
                };
                addFolders(rootGroup, value.folders);
            });
        }
        discover("//sampleserver1.arcgisonline.com/arcgis/rest/services");
    }
    exports.run = run;
});
define("examples/ags-webmap", ["require", "exports", "openlayers", "ol3-layerswitcher/ol3-layerswitcher", "ol3-layerswitcher/extras/ags-webmap", "ol3-layerswitcher/extras/ags-layer-factory"], function (require, exports, ol, ol3_layerswitcher_3, WebMap, AgsLayerFactory) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        function asRes(scale, dpi) {
            if (dpi === void 0) { dpi = 90.71428571428572; }
            var inchesPerFoot = 12.0;
            var inchesPerMeter = (inchesPerFoot / ol.proj.METERS_PER_UNIT["ft"]);
            var dotsPerUnit = dpi * inchesPerMeter;
            return scale / dotsPerUnit;
        }
        var agsLayerFactory = new AgsLayerFactory();
        var map = new ol.Map({
            target: 'map',
            layers: [],
            view: new ol.View({
                center: ol.proj.transform([-85, 35], 'EPSG:4326', 'EPSG:3857'),
                zoom: 6
            })
        });
        var layerSwitcher = new ol3_layerswitcher_3.LayerSwitcher({
            openOnMouseOver: true
        });
        layerSwitcher.on("show-layer", function (args) {
            console.log("show layer:", args.layer.get("title"));
            if (args.layer.get("extent")) {
                var view = map.getView();
                var extent = args.layer.get("extent");
                var currentExtent = view.calculateExtent(map.getSize());
                if (!ol.extent.intersects(currentExtent, extent)) {
                    view.fit(extent, { size: map.getSize() });
                }
            }
        });
        layerSwitcher.on("hide-layer", function (args) {
            console.log("hide layer:", args.layer.get("title"));
        });
        map.addControl(layerSwitcher);
        function webmap(options) {
            var webmap = new WebMap.WebMap();
            var webmapGroup = new ol.layer.Group({
                title: "WebMap",
                visible: false,
                layers: []
            });
            map.addLayer(webmapGroup);
            options.url = options.url || "https://www.arcgis.com/sharing/rest/content/items/" + options.appid + "/data?f=json";
            webmap.get(options.url).then(function (result) {
                if (result.baseMap) {
                    var baseLayers_1 = new ol.layer.Group({
                        title: "Basemap Layers",
                        visible: false,
                        layers: []
                    });
                    webmapGroup.getLayers().push(baseLayers_1);
                    result.baseMap.baseMapLayers.forEach(function (l) {
                        var opLayer = agsLayerFactory.asArcGISTiledMapServiceLayer(l, result);
                        baseLayers_1.getLayers().push(opLayer);
                    });
                }
                if (result.operationalLayers) {
                    var opLayers_1 = new ol.layer.Group({
                        title: "Operational Layers",
                        visible: false,
                        layers: []
                    });
                    webmapGroup.getLayers().push(opLayers_1);
                    result.operationalLayers.forEach(function (l) {
                        var opLayer = agsLayerFactory.asAgsLayer(l, result);
                        opLayers_1.getLayers().push(opLayer);
                    });
                }
            });
        }
        webmap({
            url: "http://infor1.maps.arcgis.com/sharing/rest/content/items/313b7327133f4802affee46893b4bec7/data?f=json"
        });
    }
    exports.run = run;
});
define("examples/layerswitcher", ["require", "exports", "openlayers", "ol3-layerswitcher/ol3-layerswitcher"], function (require, exports, ol, ol3_layerswitcher_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function run() {
        var map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Group({
                    'title': 'Base maps',
                    layers: [
                        new ol.layer.Group({
                            'title': 'OSM and Water Color',
                            'label-only': true,
                            layers: [
                                new ol.layer.Tile({
                                    title: 'Water color',
                                    type: 'base',
                                    visible: false,
                                    source: new ol.source.Stamen({
                                        layer: 'watercolor'
                                    })
                                }),
                                new ol.layer.Tile({
                                    title: 'OSM',
                                    type: 'base',
                                    visible: true,
                                    source: new ol.source.OSM()
                                })
                            ]
                        })
                    ]
                }),
                new ol.layer.Group({
                    title: 'Overlays',
                    layers: [
                        new ol.layer.Group({
                            title: "Countries",
                            layers: [
                                new ol.layer.Tile({
                                    title: 'Countries',
                                    source: new ol.source.TileWMS({
                                        url: 'http://demo.opengeo.org/geoserver/wms',
                                        params: { 'LAYERS': 'ne:ne_10m_admin_1_states_provinces_lines_shp' },
                                        serverType: 'geoserver'
                                    })
                                })
                            ]
                        })
                    ]
                })
            ],
            view: new ol.View({
                center: ol.proj.transform([-85, 35], 'EPSG:4326', 'EPSG:3857'),
                zoom: 6
            })
        });
        var layerSwitcher = new ol3_layerswitcher_4.LayerSwitcher({
            tipLabel: 'Layers',
            openOnMouseOver: true,
            closeOnMouseOut: true,
            openOnClick: false,
            closeOnClick: true,
            target: null
        });
        layerSwitcher.on("show-layer", function (args) {
            console.log("show layer:", args.layer.get("title"));
        });
        layerSwitcher.on("hide-layer", function (args) {
            console.log("hide layer:", args.layer.get("title"));
            return true;
        });
        map.addControl(layerSwitcher);
    }
    exports.run = run;
});
define("examples/data/webmap1", ["require", "exports"], function (require, exports) {
    "use strict";
    return {
        "layers": [
            {
                "id": 34,
                "showLegend": false,
                "popupInfo": {
                    "title": "Predominant Population in {SF1_States_STATE_NAME}",
                    "fieldInfos": [
                        {
                            "fieldName": "OBJECTID",
                            "label": "OBJECTID",
                            "isEditable": false,
                            "visible": false
                        },
                        {
                            "fieldName": "Shape",
                            "label": "Shape",
                            "isEditable": false,
                            "visible": false
                        },
                        {
                            "fieldName": "SF1_States_ID",
                            "label": "ID",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "SF1_States_STATE_NAME",
                            "label": "STATE_NAME",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "SF1_States_ST_ABBREV",
                            "label": "ST_ABBREV",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "SF1_States_TOTPOP10",
                            "label": "TOTPOP10",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_States_PctWhite",
                            "label": "Percent White 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_States_PctBlack",
                            "label": "Percent Black 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_States_PctAmerInd",
                            "label": "Percent American Indian 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_States_PctPacific",
                            "label": "Percent Pacific Islander 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_States_PctOther",
                            "label": "Percent Other 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_States_PctHispanic",
                            "label": "Percent Hispanic i2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_States_Pct2Races",
                            "label": "Percent 2 or more races 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "PredominantRaceEthnicity",
                            "label": "PredominantRaceEthnicity",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "Shape_Length",
                            "label": "Shape_Length",
                            "isEditable": false,
                            "visible": false,
                            "format": {
                                "places": 2,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "Shape_Area",
                            "label": "Shape_Area",
                            "isEditable": false,
                            "visible": false,
                            "format": {
                                "places": 2,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "DOMINANCE_VALUE",
                            "label": "Level of Predominance",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_States_Pct2Asian",
                            "label": "Percent Asian 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        }
                    ],
                    "description": "In {SF1_States_STATE_NAME}, the total population is {SF1_States_TOTPOP10}. The predominant population group is {PredominantRaceEthnicity}, and the difference between it and the second largest group is {DOMINANCE_VALUE}% \n        ",
                    "showAttachments": false,
                    "mediaInfos": [
                        {
                            "title": "Breakdown",
                            "type": "piechart",
                            "caption": "Predominant racial or ethnic groups in the U.S.A. by county and tract, and the extent to which they predominant. Touch or mouse over the pie graph to see the actual values.",
                            "value": {
                                "fields": [
                                    "SF1_States_PctWhite",
                                    "SF1_States_PctBlack",
                                    "SF1_States_PctAmerInd",
                                    "SF1_States_PctPacific",
                                    "SF1_States_PctOther",
                                    "SF1_States_PctHispanic",
                                    "SF1_States_Pct2Races",
                                    "SF1_States_Pct2Asian"
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "id": 33,
                "showLegend": false,
                "popupInfo": {
                    "title": "Predominant Population in {SF1_Counties_NAME}, {SF1_Counties_STATE_NAME}",
                    "fieldInfos": [
                        {
                            "fieldName": "OBJECTID",
                            "label": "OBJECTID",
                            "isEditable": false,
                            "visible": false
                        },
                        {
                            "fieldName": "Shape",
                            "label": "Shape",
                            "isEditable": false,
                            "visible": false
                        },
                        {
                            "fieldName": "SF1_Counties_TOTPOP10",
                            "label": "TOTPOP10",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Counties_PctWhite",
                            "label": "Percent White 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Counties_PctBlack",
                            "label": "Percent Black 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Counties_PctAmerInd",
                            "label": "Percent American Indian 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Counties_PctPacific",
                            "label": "Percent Pacific Islander 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Counties_PctOther",
                            "label": "Percent Other 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Counties_PctHispanic",
                            "label": "Percent Hispanic 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "Dominance_Primary",
                            "label": "Dominance_Primary",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "Dominance_Primary_numbers",
                            "label": "Dominance_Primary_numbers",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "Dominance_secondary_numbers",
                            "label": "Dominance_secondary_numbers",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 2,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "Dominance_Secondary",
                            "label": "Dominance_Secondary",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "DOMINANCE_VALUE",
                            "label": "Level of predominance",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Counties_NAME",
                            "label": "NAME",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "SF1_Counties_STATE_NAME",
                            "label": "STATE_NAME",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "SF1_Counties_ST_ABBREV",
                            "label": "ST_ABBREV",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "SF1_Counties_AREA",
                            "label": "AREA",
                            "isEditable": false,
                            "visible": false,
                            "format": {
                                "places": 2,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "Shape_Length",
                            "label": "Shape_Length",
                            "isEditable": false,
                            "visible": false,
                            "format": {
                                "places": 2,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "Shape_Area",
                            "label": "Shape_Area",
                            "isEditable": false,
                            "visible": false,
                            "format": {
                                "places": 2,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Counties_Pct2Asian",
                            "label": "Percent Asian 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        }
                    ],
                    "description": "In {SF1_Counties_NAME}, the total population is {SF1_Counties_TOTPOP10}. The predominant population group is {Dominance_Primary}, and the difference between it and the second largest group is {DOMINANCE_VALUE}% \n        ",
                    "showAttachments": false,
                    "mediaInfos": [
                        {
                            "title": "Breakdown",
                            "type": "piechart",
                            "caption": "The percentage of the total population represented by each racial or ethnic group in 2010. Touch or mouse over the pie graph to see the actual values.",
                            "value": {
                                "fields": [
                                    "SF1_Counties_PctWhite",
                                    "SF1_Counties_PctBlack",
                                    "SF1_Counties_PctAmerInd",
                                    "SF1_Counties_PctPacific",
                                    "SF1_Counties_PctOther",
                                    "SF1_Counties_PctHispanic",
                                    "SF1_Counties_Pct2Asian"
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "id": 32,
                "showLegend": false,
                "popupInfo": {
                    "title": "{COUNTY}, {SF1_Tracts_STATE_NAME} tract {SF1_Tracts_ID}",
                    "fieldInfos": [
                        {
                            "fieldName": "OBJECTID",
                            "label": "OBJECTID",
                            "isEditable": false,
                            "visible": false
                        },
                        {
                            "fieldName": "Shape",
                            "label": "Shape",
                            "isEditable": false,
                            "visible": false
                        },
                        {
                            "fieldName": "SF1_Tracts_ID",
                            "label": "ID",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "SF1_Tracts_NAME",
                            "label": "NAME",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "SF1_Tracts_STATE_NAME",
                            "label": "STATE_NAME",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "SF1_Tracts_ST_ABBREV",
                            "label": "ST_ABBREV",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "SF1_Tracts_TOTPOP10",
                            "label": "TOTPOP10",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Tracts_PctWhite",
                            "label": "Percent White 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Tracts_PctBlack",
                            "label": "Percent Black 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Tracts_PctAmerInd",
                            "label": "Percent American Indian 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Tracts_PctPacific",
                            "label": "Percent Pacific Islander 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Tracts_PctOther",
                            "label": "Percent Other 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Tracts_PctHispanic",
                            "label": "Percent Hispanic 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Tracts_Pct2Races",
                            "label": "Percent 2 or more races 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "Dominance_Primary",
                            "label": "Dominance_Primary",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "Dominance_Primary_numbers",
                            "label": "Dominance_Primary_numbers",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "Dominance_secondary_numbers",
                            "label": "Dominance_secondary_numbers",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "Dominance_Secondary",
                            "label": "Dominance_Secondary",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "DOMINANCE_VALUE",
                            "label": "DOMINANCE_VALUE",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "COUNTY_NAME",
                            "label": "COUNTY_NAME",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "COUNTY_SUFFIX",
                            "label": "COUNTY_SUFFIX",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "COUNTY",
                            "label": "COUNTY",
                            "isEditable": false,
                            "visible": true,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "Shape_Length",
                            "label": "Shape_Length",
                            "isEditable": false,
                            "visible": false,
                            "format": {
                                "places": 2,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "Shape_Area",
                            "label": "Shape_Area",
                            "isEditable": false,
                            "visible": false,
                            "format": {
                                "places": 2,
                                "digitSeparator": true
                            }
                        },
                        {
                            "fieldName": "SF1_Tracts_Pct2Asian",
                            "label": "Percent Asian 2010",
                            "isEditable": false,
                            "visible": true,
                            "format": {
                                "places": 1,
                                "digitSeparator": true
                            }
                        }
                    ],
                    "description": "In this tract, the total population is {SF1_Tracts_TOTPOP10}. The predominant population group is {Dominance_Primary}, and the difference between it and the second largest group is {DOMINANCE_VALUE}% \n        ",
                    "showAttachments": false,
                    "mediaInfos": [
                        {
                            "title": "Breakdown",
                            "type": "piechart",
                            "caption": "The percentage of the total population represented by each racial or ethnic group in 2010. Touch or mouse over the pie graph to see the actual values.",
                            "value": {
                                "fields": [
                                    "SF1_Tracts_PctWhite",
                                    "SF1_Tracts_PctBlack",
                                    "SF1_Tracts_PctAmerInd",
                                    "SF1_Tracts_PctPacific",
                                    "SF1_Tracts_PctOther",
                                    "SF1_Tracts_PctHispanic",
                                    "SF1_Tracts_Pct2Races",
                                    "SF1_Tracts_Pct2Asian"
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "id": 1,
                "showLegend": false
            }
        ],
        "minScale": 147914382,
        "maxScale": 72223
    };
});
define("examples/data/webmap2", ["require", "exports"], function (require, exports) {
    "use strict";
    return {
        "operationalLayers": [
            {
                "id": "operations_1603",
                "layerType": "ArcGISFeatureLayer",
                "url": "https://sampleserver3.arcgisonline.com/arcgis/rest/services/HomelandSecurity/operations/FeatureServer/2",
                "visibility": true,
                "opacity": 1,
                "mode": 1,
                "title": "operations - Incident Areas",
                "popupInfo": {
                    "title": "Incident Areas: {ftype}",
                    "fieldInfos": [
                        {
                            "fieldName": "objectid",
                            "label": "Object ID",
                            "isEditable": false,
                            "tooltip": "",
                            "visible": false,
                            "format": null,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "permanent_identifier",
                            "label": "Permanent_Identifier",
                            "isEditable": false,
                            "tooltip": "",
                            "visible": false,
                            "format": null,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "lifecyclestatus",
                            "label": "Lifecycle Status",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "incident_number",
                            "label": "Incident Number",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "ftype",
                            "label": "Category",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "fcode",
                            "label": "Sub Category",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "collection_time",
                            "label": "Collection Date",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "dateFormat": "longMonthDayYear"
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "description",
                            "label": "Description",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "textbox"
                        }
                    ],
                    "description": null,
                    "showAttachments": true,
                    "mediaInfos": []
                }
            },
            {
                "id": "operations_503",
                "layerType": "ArcGISFeatureLayer",
                "url": "https://sampleserver3.arcgisonline.com/arcgis/rest/services/HomelandSecurity/operations/FeatureServer/1",
                "visibility": true,
                "opacity": 1,
                "mode": 1,
                "title": "operations - Incident Lines",
                "popupInfo": {
                    "title": "Incident Lines: {ftype}",
                    "fieldInfos": [
                        {
                            "fieldName": "objectid",
                            "label": "Object ID",
                            "isEditable": false,
                            "tooltip": "",
                            "visible": false,
                            "format": null,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "permanent_identifier",
                            "label": "Permanent_Identifier",
                            "isEditable": false,
                            "tooltip": "",
                            "visible": false,
                            "format": null,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "lifecyclestatus",
                            "label": "Lifecycle Status",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "incident_number",
                            "label": "Incident Number",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "ftype",
                            "label": "Category",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "fcode",
                            "label": "Sub Category",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "collection_time",
                            "label": "Collection Date",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "dateFormat": "longMonthDayYear"
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "description",
                            "label": "Description",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "textbox"
                        }
                    ],
                    "description": null,
                    "showAttachments": true,
                    "mediaInfos": []
                }
            },
            {
                "id": "operations_4913",
                "layerType": "ArcGISFeatureLayer",
                "url": "https://sampleserver3.arcgisonline.com/arcgis/rest/services/HomelandSecurity/operations/FeatureServer/0",
                "visibility": true,
                "opacity": 1,
                "mode": 1,
                "title": "operations - Incident Points",
                "popupInfo": {
                    "title": "Incident Points: {ftype}",
                    "fieldInfos": [
                        {
                            "fieldName": "objectid",
                            "label": "Object ID",
                            "isEditable": false,
                            "tooltip": "",
                            "visible": false,
                            "format": null,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "permanent_identifier",
                            "label": "Permanent_Identifier",
                            "isEditable": false,
                            "tooltip": "",
                            "visible": false,
                            "format": null,
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "lifecyclestatus",
                            "label": "Lifecycle Status",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "incident_number",
                            "label": "Incident Number",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "ftype",
                            "label": "Category",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "fcode",
                            "label": "Sub Category",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "places": 0,
                                "digitSeparator": true
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "collection_time",
                            "label": "Collection Date",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": {
                                "dateFormat": "longMonthDayYear"
                            },
                            "stringFieldOption": "textbox"
                        },
                        {
                            "fieldName": "description",
                            "label": "Description",
                            "isEditable": true,
                            "tooltip": "",
                            "visible": true,
                            "format": null,
                            "stringFieldOption": "textbox"
                        }
                    ],
                    "description": null,
                    "showAttachments": true,
                    "mediaInfos": []
                }
            }
        ],
        "baseMap": {
            "baseMapLayers": [
                {
                    "id": "World_Street_Map_1643",
                    "layerType": "ArcGISTiledMapServiceLayer",
                    "url": "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
                    "visibility": true,
                    "opacity": 1,
                    "title": "World_Street_Map"
                }
            ],
            "title": "Streets"
        },
        "spatialReference": {
            "wkid": 102100,
            "latestWkid": 3857
        },
        "authoringApp": "WebMapViewer",
        "authoringAppVersion": "4.1",
        "version": "2.4",
        "bookmarks": [
            {
                "extent": {
                    "spatialReference": {
                        "wkid": 102100
                    },
                    "xmax": -8575213.244615981,
                    "xmin": -8577439.473064845,
                    "ymax": 4706557.285830588,
                    "ymin": 4705169.476035749
                },
                "name": "Reflecting Pool"
            },
            {
                "extent": {
                    "spatialReference": {
                        "wkid": 102100
                    },
                    "xmax": -8575063.95354517,
                    "xmin": -8576177.067769477,
                    "ymax": 4706787.194079695,
                    "ymin": 4706093.289182352
                },
                "name": "The Ellipse"
            },
            {
                "extent": {
                    "spatialReference": {
                        "wkid": 102100
                    },
                    "xmax": -8574893.16456016,
                    "xmin": -8576006.278784467,
                    "ymax": 4704868.505236806,
                    "ymin": 4704174.600339463
                },
                "name": "Jefferson Memorial"
            },
            {
                "extent": {
                    "spatialReference": {
                        "wkid": 102100
                    },
                    "xmax": -8571845.238057353,
                    "xmin": -8572958.35228166,
                    "ymax": 4706931.707836159,
                    "ymin": 4706237.802938815
                },
                "name": "Union Station"
            }
        ],
        "applicationProperties": {
            "viewing": {
                "routing": {
                    "enabled": true
                },
                "basemapGallery": {
                    "enabled": true
                },
                "measure": {
                    "enabled": true
                }
            }
        },
        "MapItems": null,
        "Slides": null
    };
});
//# sourceMappingURL=examples.max.js.map