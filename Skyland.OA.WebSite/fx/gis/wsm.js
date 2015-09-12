define(['config/config.js'], function () {
    var map = $.Gis.map;
    if (map == null) throw new error("地图还未初始化!");
    return new function () {
        var self = this;

        var root = null;
        var nav = null;
        var haveSetCenter = false;
        var curWs = null;

        var app_config = appConfig.gisModelConfig = appConfig.gisModelConfig || {};
        if (!app_config.wsBase) {
            app_config.wsBase = { path: 'fx/gis/base', iconCls: 'fa fa-home', title: '地图' }
        }

        var refresh = function (params) {
            if (params.ws) {
                var ws = params.ws;
                if (!curWs || ws != curWs.key) {
                    if (nav && nav.haveid) {
                        if (nav.haveid(ws))
                            self.loadWS(ws);
                        else
                            self.addWS(ws);
                    } else
                        self.loadWS(ws);
                }
            }
            if (curWs && curWs.refresh) curWs.refresh();
            if (!haveSetCenter && params.z && params.x && params.y) map.setView([params.x, params.y], params.z);
            //避免死循环！！
            haveSetCenter = false;
        };

        var setUrl = function (id) {
            var hash = $.iwf.gethash();
            var params = eval('({' + hash.params + '})');
            if (id) params.ws = id;
            var c = map.getCenter();
            params.x = c.lat;
            params.y = c.lng;
            params.z = map.getZoom();

            var moduleconfig = getmoduleconfig(hash, params);
            $.Com.Go(moduleconfig);
            refresh(params);
            haveSetCenter = true;
        }

        var getmoduleconfig = function (hash, params) {
            return hash.module + '.' + hash.model + ':' + JSON.stringify(params);
        }

        this.workSpaces = {};

        this.getCurrentWs = function () {
            return curWs;
        };

        this.loadWS = function (key) {
            if (this.workSpaces[key]) {
                curWs = this.workSpaces[key];
                curWs.key = key;
                showWS();
            }
            else {
                require([app_config[key].path], function (model) {
                    self.workSpaces[key] = model;
                    curWs = model;
                    curWs.key = key;
                    showWS();
                });
            }
            function showWS() {
                if (UIMode == "mouse") {
                    nav.setSelectedbyID(key);
                    root.find("[data-id='subtitle']").empty();
                    if (app_config[key].subtitle) root.find("[data-id='subtitle']").text(app_config[key].subtitle);
                }
                else {
                    var tt = "地理信息 -- ";

                    if (app_config[key].iconCls) tt += "<i class='" + app_config[key].iconCls + "' style='margin-right:5px;'></i>";
                    $("#TopTitle").html(tt + app_config[key].title);
                }
                $toolDiv = root.find("[data-id='toolbar']");
                $toolDiv.children().hide();
                var $wsDiv = $toolDiv.children("[data-id='" + key + "']");
                if ($wsDiv.length == 0) {
                    $wsDiv = $('<div data-id="' + key + '"></div>').appendTo($toolDiv);
                    curWs.show($wsDiv);
                }
                else
                    $wsDiv.show();
                if(UIMode&&UIMode!=="mouse") $wsDiv.find('.dropdown').removeClass('dropdown').addClass("btn-group dropup");
            }
        };

        this.addWS = function (key, homekey) {
            var ws = null;
            if (this.workSpaces[key]) {
                ws = this.workSpaces[key];
                showWS();
            }
            else {
                if (!app_config[key]) {
                    alert(key + "专题不存在！");
                    return;
                }
                require([app_config[key].path], function (model) {
                    self.workSpaces[key] = model;
                    ws = model;
                    showWS();
                });
            }
            function showWS() {
                if (!nav.haveid(key)) {
                    var tab = {
                        text: app_config[key].title,
                        id: key,
                        closable: app_config[key].closable,
                        close: function (key) {
                            var curws = self.workSpaces[key];
                            curws.unload();
                            root.find("[data-id='toolbar']").children("[data-id='" + key + "']").remove();
                            if (homekey)
                                nav.toggleClickByID(homekey);
                            else {
                                for (var k in app_config) {
                                    if (app_config[k].hidden != true) {
                                        nav.toggleClickByID(k);
                                        return
                                    }
                                }
                            }
                        },
                        iconCls: app_config[key].iconCls,
                        click: function (id) { setUrl(id); }
                    };
                    nav.add(tab);
                }
                nav.toggleClickByID(key);
            }

        };

        this.init = function (ele, opts, callback) {
            curWs = null;
            root = ele;

            map.on('moveend', function () { setUrl(); }, this);

            function titlebarphone() {
                var titlebar = $("#modelsMenuBtn");
                if (titlebar.length < 1) return;
                titlebar.show();

                var items = {
                    data: [],
                    itemclick: function (item) {
                        if (curWs && curWs.unload) curWs.unload();
                        setUrl(item.id);
                        wsmenu.parent().parent().hide();
                    }
                };
                var tabs = getTabs();
                for (var i = 0, len = tabs.length; i < len; i++) {
                    items.data.push({
                        text: tabs[i].text,
                        id: tabs[i].id,
                        unselectable: true
                    });
                }
                $("#iwf-frame-left").empty();
                var wsmenu = $("<div></div>").appendTo($("#iwf-frame-left")).listView2(items);
                nav = wsmenu;
                $.iwf.left.visible(true);
            }

            function titlebarpc() {
                var tp_nav = root.find("[data-id='gismenu']").Navigation(),
                    tabs = getTabs();
                for (var i = 0, len = tabs.length; i < len; i++) {
                    tp_nav.add(tabs[i]);
                }
                nav = tp_nav;
            }

            function getTabs() {
                var all_tabs = [];
                for (var key in app_config) {
                    var item = app_config[key];
                    if (item.hidden == true) continue;
                    var tab = {
                        text: item.title,
                        id: key,
                        closable: item.closable,
                        close: function (key) {
                            var curws = self.workSpaces[key];
                            if (curws.unload) curws.unload();
                            root.find("[data-id='toolbar']").children("[data-id='" + key + "']").remove();
                        },
                        iconCls: item.iconCls,
                        click: function (id) { setUrl(id); }
                    };
                    if (key === "wsBase") all_tabs.unshift(tab);
                    else all_tabs.push(tab);
                }
                return all_tabs;
            }

            function loadModels(callback) {//为了加快加载速度进行了延迟加载
                for (var key in app_config) {
                    if (!app_config.hasOwnProperty(key)) { delete app_config[key]; continue; }
                    if (app_config[key].path == null) { delete app_config[key]; continue; }
                }
                if (callback) callback();

            }

            loadModels(function () {
                if (UIMode == "mouse")
                    titlebarpc();
                else
                    titlebarphone();

                if (opts.ws) refresh(opts);
                else self.loadWS('wsBase');

                //折叠标题栏
                if (jQuery.iwf.top) {
                    jQuery.iwf.topinitheight = jQuery.iwf.top.height();
                    $("#iwf-hideTitle").bind("click", function () {
                        $("#iwf-hideTitle").children('i').toggleClass('fa-rotate-180');
                        if (jQuery.iwf.top.height() == 0) {
                            $("#iwf-frame-top").show();
                            jQuery.iwf.top.height(jQuery.iwf.topinitheight);
                            var fxSize = {
                                width: document.documentElement.clientWidth,
                                height: document.documentElement.clientHeight,
                                topHeight: jQuery.iwf.top.height()
                            };
                            $.iwf.main.resize(fxSize);
                        } else {
                            $("#iwf-frame-top").hide();
                            jQuery.iwf.top.height(0);
                            var fxSize = {
                                width: document.documentElement.clientWidth,
                                height: document.documentElement.clientHeight,
                                topHeight: jQuery.iwf.top.height()
                            };
                            $.iwf.main.resize(fxSize);
                        }
                    });
                } else {
                    $("#iwf-hideTitle").remove();
                }

                if (callback && typeof (callback) == 'function') {
                    callback();
                }
            });
        }
    }
});