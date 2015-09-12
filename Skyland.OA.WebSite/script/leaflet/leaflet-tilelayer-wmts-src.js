L.TileLayer.WMTS = L.TileLayer.extend({

    defaultWmtsParams: {
        service: 'WMTS',
        request: 'GetTile',
        version: '1.0.0',
        layer: '',
        style: '',
        tilematrixSet: '',
        format: 'image/jpeg'
    },

    initialize: function (url, options) { // (String, Object)
        this._url = url;

        var wmtsParams = L.extend({}, this.defaultWmtsParams),
        tileSize = options.tileSize || this.options.tileSize;
        if (options.detectRetina && L.Browser.retina) {
            wmtsParams.width = wmtsParams.height = tileSize * 2;
        } else {
            wmtsParams.width = wmtsParams.height = tileSize;
        }
        for (var i in options) {
            // all keys that are not TileLayer options go to WMTS params
            if (!this.options.hasOwnProperty(i) && i != "matrixIds") {
                wmtsParams[i] = options[i];
            }
        }
        this.wmtsParams = wmtsParams;
        this.matrixIds = options.matrixIds || this.getDefaultMatrix();
        L.setOptions(this, options);
    },

    onAdd: function (map) {
        L.TileLayer.prototype.onAdd.call(this, map);
        this._oldZoom = this._map.getZoom();
    },

    //getTileUrl: function (tilePoint, zoom) { // (Point, Number) -> String
    //    var map = this._map;
    //    crs = map.options.crs;
    //    tileSize = this.options.tileSize;
    //    nwPoint = tilePoint.multiplyBy(tileSize);
    //    //+/-1 in order to be on the tile
    //    nwPoint.x += 1;
    //    nwPoint.y -= 1;
    //    sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
    //    nw = crs.project(map.unproject(nwPoint, zoom));
    //    se = crs.project(map.unproject(sePoint, zoom));
    //    tilewidth = se.x - nw.x;
    //    zoom = map.getZoom();
    //    ident = this.matrixIds[zoom].identifier;
    //    X0 = this.matrixIds[zoom].topLeftCorner.lng;
    //    Y0 = this.matrixIds[zoom].topLeftCorner.lat;
    //    tilecol = Math.floor((nw.x - X0) / tilewidth);
    //    tilerow = -Math.floor((nw.y - Y0) / tilewidth);
    //    url = L.Util.template(this._url, { s: this._getSubdomain(tilePoint) });
    //    return url + L.Util.getParamString(this.wmtsParams, url) + "&tilematrix=" + ident + "&tilerow=" + tilerow + "&tilecol=" + tilecol;
    //},

    getTileUrl: function (tilePoint, zoom) { // (Point, Number) -> String
        var map = this._map;
        zoom = map.getZoom();
        if (zoom <= 7) return '';
        if (zoom == 9 || zoom == 10) {
            if (zoom > this._oldZoom) {
                this._map.setZoom(11);
            }

            else {
                this._map.setZoom(8);
            }
            this._oldZoom = zoom;
            return;
        }
        tileSize = this.options.tileSize;
        nwPoint = tilePoint.multiplyBy(tileSize);
        //+/-1 in order to be on the tile
        nwPoint.x += 1;
        nwPoint.y -= 1;
        nw = map.unproject(nwPoint, zoom);

        /* 服务网贴出的比例尺 */
        //var zoom_scale = {
        //    0: 2311167.8320312,
        //    1: 288895.97900391,
        //    2: 144447.98950195,
        //    3: 72223.994750977,
        //    4: 36111.997375488,
        //    5: 18055.998687744,
        //    6: 9027.9993438721,
        //    7: 4513.999671936,
        //    8: 2256.999835968,
        //    9: 1128.499917984,
        //    10: 564.249958992
        //};
        /* 国土局给出比例尺  */
        //var zoom_scale = {
        //    0: 2308574.9457714846,
        //    1: 288571.86822143558,
        //    2: 144285.93411071779,
        //    3: 72142.967055358895,
        //    4: 36071.483527679447,
        //    5: 18035.741763839724,
        //    6: 9017.8708819198619,
        //    7: 4508.9354409599309,
        //    8: 2254.4677204799655,
        //    9: 1127.2338602399827,
        //    10: 563.61693011999137
        //};
        /* 国土局给出的分辨率  */
        var res_zoom = {
            0: 0.0054931640625,
            1: 0.0006866455078125,
            2: 0.00034332275390625,
            3: 0.000171661376953125,
            4: 8.58306884765625e-005,
            5: 4.291534423828125e-005,
            6: 2.1457672119140625e-005,
            7: 1.0728836059570313e-005,
            8: 5.3644180297851563e-006,
            9: 2.6822090148925781e-006,
            10: 1.3411045074462891e-006
        };
        var zoomOffset = -1;
        if (zoom == 8)
            zoomOffset = 8;
        else
            zoomOffset = 10;
        ident = this.matrixIds[zoom - zoomOffset].identifier;
        X0 = -180;
        Y0 = 90;
        //var scale = zoom_scale[zoom - zoomOffset]
        // var tp_res = (360 / (2 * 3.1415926 * 6378137) * 0.0254 / 96 * scale * 256);
        var res = res_zoom[zoom - zoomOffset];
        var tp_res = 256 * res;

        tilecol = Math.floor((nw.lng - X0) / tp_res);
        tilerow = Math.floor((Y0 - nw.lat) / tp_res);

        url = L.Util.template(this._url, { s: this._getSubdomain(tilePoint) });
        url = url + L.Util.getParamString(this.wmtsParams, url) + "&tilematrix=" + ident + "&tilerow=" + tilerow + "&tilecol=" + tilecol;
        return url;
    },

    setParams: function (params, noRedraw) {
        L.extend(this.wmtsParams, params);
        if (!noRedraw) {
            this.redraw();
        }
        return this;
    },

    getDefaultMatrix: function () {
        /**
         * the matrix3857 represents the projection 
         * for in the IGN WMTS for the google coordinates.
         */
        var matrixIds3857 = new Array(22);
        for (var i = 0; i < 22; i++) {
            matrixIds3857[i] = {
                identifier: "" + i,
                topLeftCorner: new L.LatLng(20037508.3428, -20037508.3428)
            };
        }
        return matrixIds3857;
    }
});

L.tileLayer.wmts = function (url, options) {
    return new L.TileLayer.WMTS(url, options);
};
