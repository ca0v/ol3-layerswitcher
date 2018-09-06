(function() {
    function loadCss(url) {
        let link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    let localhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    loadCss("../ol3-layerswitcher/css/ol3-layerswitcher.css");
    loadCss(
        localhost
            ? "../node_modules/ol3-fun/static/ol/v5.1.3/ol.css"
            : "https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.1.3/css/ol.css",
    );

    requirejs.config({
        shim: {
            // no need to wrap ol in a define method when using a shim
            // build this using the "npm run build-legacy" (see ol package.json)
            openlayers: {
                deps: [], // no dependencies, needs path to indicate where to find "openlayers"
                exports: "ol", // tell requirejs which global this library defines
            },
        },

        paths: {
            openlayers: localhost
                ? "../../node_modules/ol3-fun/static/ol/v5.1.3/ol"
                : "https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.1.3/build/ol",
        },

        packages: [
            {
                name: "proj4",
                location: localhost
                    ? "../../node_modules/proj4/dist"
                    : "https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.5.0",
                main: "proj4",
            },
            {
                name: "jquery",
                location: localhost
                    ? "../../node_modules/jquery/dist"
                    : "https://cdn.rawgit.com/jquery/jquery-dist/3.1.1/dist",
                main: "jquery.min",
            },
        ],

        deps: ["../examples.max"],

        callback: () => requirejs([getParameterByName("run") || "examples/index"], (test) => test.run()),
    });
})();
