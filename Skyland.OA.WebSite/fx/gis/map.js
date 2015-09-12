define(['leaflet', 'config/config.js'], function () {
    var dt = 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        yx = 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
    var anno = 'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}';

    var M = function () {

        var self = this;

        var streetMapLayer = null;
        var l_anono = new L.TileLayer(anno, { maxZoom: 18, attribution: '云景', subdomains: '1234' });
        var mapOpacity = 1;

        this.map = null;

        this.show = function (module, root) {
            if (root.children.length > 0) return;
            addLayer(module, root);
        }

        this.setRadar = (function () { //波纹函数接口
            var radarLayer = null,//去除gisFx刚加载对leaflet的依赖问题
                icon = null,
                marker = null;
            return function (latlng, show) {
                if (show === false) { if (marker) self.map.removeLayer(marker); marker = null; return; }
                if (show === true) {
                    if (marker == null) marker = L.circleMarker(latlng, { radius: 6, stroke: false, fillColor: "#800000", fillOpacity: 1 });
                    else marker.setLatLng(latlng);
                    if (!self.map.hasLayer(marker)) self.map.addLayer(marker);
                }
                if (!radarLayer) {
                    icon = L.divIcon({ className: '', html: '<div class="radar"></div>', iconAnchor: [20, 20] });
                    radarLayer = L.marker(latlng, { icon: icon, zIndexOffset: -1 });
                    self.map.addLayer(radarLayer);
                }
                else
                    radarLayer.setLatLng(latlng).setIcon(icon);
            }
        }()),

        this.selectByLocation = function (callback) {
            if (this.map == null) return;
            //考虑如何添加选点
        }

        this.changeMap = function (mapType) {
            var streetMapUrl = dt;
            var subdomains = ['1', '2', '3', '4'];
            if (mapType) {
                if (mapType == "txdt") {
                    if (l_anono) self.map.removeLayer(l_anono);
                    streetMapUrl = dt;
                    streetMapLayer.setUrl(streetMapUrl);
                }
                if (mapType == "txyx") {
                    streetMapUrl = yx;
                    streetMapLayer.setUrl(streetMapUrl);
                    if (l_anono) self.map.addLayer(l_anono);
                }
                return;
            }
            streetMapLayer = L.tileLayer(streetMapUrl, { maxZoom: 18, attribution: '云景', subdomains: subdomains });
            streetMapLayer.addTo(self.map);
        }

        this.setOpacity = function (opacity) {
            mapOpacity = opacity;
            if (streetMapLayer != null) streetMapLayer.setOpacity(mapOpacity);
        }

        this.getOpacity = function () { return mapOpacity; }

        function addLayer(params, root) {
            var hasSetCenter = true;
            var hasSetLevel = true;
            if (!params || !params.x || !params.y) hasSetCenter = false;
            if (!params || !params.z) hasSetLevel = false;
            var center = hasSetCenter ? [+params.x, +params.y] : appConfig.mapCenter || [23.137519, 113.263839];
            self.map = L.map(root, { zoomControl: false, attributionControl: false, minZoom: 3 }).setView(center, hasSetLevel ? +params.z : 11);
            self.changeMap();
        }
    }

    var instance = new M();
    instance.Map = M; //可单独开启窗口初始化一幅地图 new instance.Map();
    return instance;
});