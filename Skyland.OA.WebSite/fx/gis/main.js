define(["fx/gis/map"], function (mapObject) {
    return new function () {
        var self = this;
        $.Gis = {
            map: null,
            root: null
        };
        this.show = function (module, root) {
            var json = module.params.replace(/"/g, "'");
            var params = eval('({' + json + '})');
            if (root.html() != "") {
                return;
            }
            else {
                var callback = module.callback || null;
                root.css('position', 'relative');
            }
            $.Gis.root = root;

            var htmlTemplate = "config/UIHtml/gisphone.html"
            if (UIMode == "mouse") htmlTemplate = "config/UIHtml/gispc.html";

            root.load(htmlTemplate, function () {
                //初始化地图，其他各类插件依赖地图
                mapObject.show(params, root.find('[data-id="map"]')[0]);
                $.Gis.map = mapObject.map;
                $.Gis.setRadar = mapObject.setRadar;
                $.Gis.selectByLocation = mapObject.selectByLocation;

                //加载GIS各种全局插件
                var key_actions = {
                    'fx/gis/wsm': function (widget) { //工作空间管理
                        widget.init(root, params, callback);
                        $.extend($.Gis, widget);
                    },
                    'fx/gis/gisWin': function (widget) {
                        widget.init(root);
                        $.Gis.gisWin = widget;
                        self.resize = function (w, h) {//添加一个监听事件
                            widget.$container.css("max-height", (h - 90) + "px");
                        }
                    },
                    'fx/gis/mgr': function (widget) { //图层管理
                        $.Gis.LayerManager = widget;
                        widget.removeCallback = function () {
                            var count = 0;
                            for (var key in widget.layers) { count++; }
                            if (count == 0 && $.Gis.gisWin) { var win = $.Gis.gisWin.get(widget.options.key); if (win != null) win.close(); }
                        };
                        root.find("[data-id='btnlayermanager']").click(function () {
                            $(this).toggleClass('active');
                            if ($.Gis.gisWin) {
                                if ($.Gis.gisWin.wins[widget.options.key] == null) $.Gis.gisWin.add(widget).show();
                                else $.Gis.gisWin.get(widget.options.key).close();
                            }

                        });
                    },
                    'fx/gis/info': function (widget) {
                        $.Gis.createLegend = widget.createLegend;
                        $.Gis.showInfo = widget.showInfo;
                    },
                    'fx/gis/event': function (widget) {
                        $.Gis.Event = widget;
                    },
                    'fx/gis/geocode': function (widget) {
                        $.Gis.geocode = widget;
                        root.find("[data-id='btnGisSearch']").click(function () {
                            var address = root.find("[data-id='txtGisSearch']").val().trim();
                            if (!address) return;
                            widget.searchByAddress(address, function (res) {
                                if (res.success == false) return;
                                $.Gis.setRadar(res.result);
                                $.Gis.map.setView(res.result, 16);
                            });
                        });
                    },
                    'leaflet-label': null,
                    'leaflet-cluster': null
                };
                var keys = [];
                for (var key in key_actions) keys.push(key);
                if (keys.length === 0) return;
                require(keys, function () {
                    for (var i = 0, len = keys.length; i < len; i++) {
                        if (key_actions[keys[i]] != null && arguments[i] != null)
                            key_actions[keys[i]](arguments[i]);
                    }
                });
            });
        }
    }
});