define(['css!leaflet-css','css!leaflet-label-css','css!leaflet-mc-css','css!leaflet-mc-default-css', 'css!leaflet-awesome-css',
     'leaflet-label', 'leaflet-MakiMarkers', 'leaflet-awesome', 'leaflet-cluster'], function () {
        $.Gis = {
            root: null,

            workSpaces: {},

            layers: {},

            map: null,

            curWs: undefined,

            setRadar: (function () { //波纹函数接口
                var radarLayer = null,//去除gisFx刚加载对leaflet的依赖问题
                    icon = null,
                    marker = null;
                return function (latlng, show) {
                    if (show === false) { if (marker) $.Gis.map.removeLayer(marker); marker = null; return; }
                    if (show === true) {
                        if (marker == null) marker = L.circleMarker(latlng, { radius: 6, stroke: false, fillColor: "#800000", fillOpacity: 1 });
                        else marker.setLatLng(latlng);
                        if (!$.Gis.map.hasLayer(marker)) $.Gis.map.addLayer(marker);
                    }
                    if (!radarLayer) {
                        icon = L.divIcon({ className: '', html: '<div class="radar"></div>', iconAnchor: [20, 20] });
                        radarLayer = L.marker(latlng, { icon: icon, zIndexOffset: -1 });
                        $.Gis.map.addLayer(radarLayer);
                    }
                    else
                        radarLayer.setLatLng(latlng).setIcon(icon);
                }
            }()),

            gpsMarker: null,

            nav: null,

            loadWS: function (ws) {
                $.Gis.curWs = $.Gis.workSpaces[ws];
                $.Gis.curWs.key = ws;
                if (UIMode == "mouse") {
                    $.Gis.nav.setSelectedbyID(ws);
                    $.Gis.root.find("[data-id='subtitle']").empty();
                    if ($.Gis.curWs.options.subtitle) $.Gis.root.find("[data-id='subtitle']").text($.Gis.curWs.options.subtitle);
                }
                else {
                    var tt = "地理信息 -- ";

                    if ($.Gis.curWs.options.icon) tt += "<i class='" + $.Gis.curWs.options.icon + "' style='margin-right:5px;'></i>";
                    $("#TopTitle").html(tt + $.Gis.curWs.options.title);
                }
                $toolDiv = $.Gis.root.find("[data-id='toolbar']");
                $toolDiv.children().hide();
                $wsDiv = $toolDiv.children("[data-id='" + ws + "']");
                if ($wsDiv.length == 0) {
                    $wsDiv = $('<div data-id="' + ws + '"></div>').appendTo($toolDiv);
                    $.Gis.curWs.show($wsDiv);
                }
                else
                    $wsDiv.show();
            },

            refresh: function (params) {
                if (params.ws) {
                    var ws = params.ws;
                    if ((!$.Gis.curWs || ws != $.Gis.curWs.key) && ws in $.Gis.workSpaces) {
                        if ($.Gis.nav && $.Gis.nav.haveid) {
                            if ($.Gis.nav.haveid(ws))
                                $.Gis.loadWS(ws);
                            else
                                $.Gis.addWS(ws);
                        } else
                            $.Gis.loadWS(ws);
                    }
                }
                if ($.Gis.curWs && $.Gis.curWs.refresh) $.Gis.curWs.refresh();
                if (!$.Gis.haveSetCenter && params.z && params.x && params.y) $.Gis.map.setView([params.x, params.y], params.z);
                //避免死循环！！
                $.Gis.haveSetCenter = false;

            },

            haveSetCenter: false,

            setUrl: function (id) {
                //根据url地址获得当前界面设置 hash { module:'' , model:'' , params:''  }

                function getmoduleconfig(hash, params) {
                    return hash.module + '.' + hash.model + ':{' + hash.params + '}:' + JSON.stringify(params);
                }
                var hash = $.iwf.gethash();
                //if (hash.model != "gismodel") return;
                var params = (hash.state) ? JSON.parse(hash.state) : {};
                if (id) params.ws = id;
                var c = $.Gis.map.getCenter();
                params.x = c.lat;
                params.y = c.lng;
                params.z = $.Gis.map.getZoom();
                var moduleconfig = getmoduleconfig(hash, params);
                $.Com.Go(moduleconfig);
                this.refresh(params);
                $.Gis.haveSetCenter = true;
            },

            init: function (root, opts, opts2, callback) {
                $.Gis.root = root;
                $.Gis.map = null;
                $.Gis.curWs = undefined;

                var htmlTemplate = "config/UIHtml/gisphone.html"
                if (UIMode == "mouse") htmlTemplate = "config/UIHtml/gispc.html";

                function titlebarphone() {
                    var titlebar = $("#modelsMenuBtn");
                    if (titlebar.length < 1) return;
                    titlebar.show();

                    var items = {
                        data: [],
                        itemclick: function (item) {
                            if ($.Gis.curWs && $.Gis.curWs.unload) $.Gis.curWs.unload();
                            $.Gis.setUrl(item.id);
                            wsmenu.parent().parent().hide();
                        }
                    };
                    var tabs = getSortedWorkspace();
                    for (var i = 0, len = tabs.length; i < len; i++) {
                        items.data.push({
                            text: tabs[i].text,
                            id: tabs[i].id,
                            unselectable: true
                        });
                    }
                    $("#iwf-frame-left").empty();
                    var wsmenu = $("<div></div>").appendTo($("#iwf-frame-left")).listView2(items);
                    $.Gis.nav = wsmenu;
                    $.iwf.left.visible(true);
                }

                function titlebarpc() {
                    var nav = $.Gis.root.find("[data-id='gismenu']").Navigation(),
                        tabs = getSortedWorkspace();
                    for (var i = 0, len = tabs.length; i < len; i++) {
                        nav.add(tabs[i]);
                    }
                    $.Gis.nav = nav;
                }

                var keys = [];

                //获取排序的Gis工作空间 
                function getSortedWorkspace() {
                    keys.unshift("wsBase");
                    var all_tabs = [];
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var ws = $.Gis.workSpaces[key];
                        if (ws.options.hidden == true) continue;
                        var tab = {
                            text: ws.options.title,
                            id: key,
                            closable: ws.options.closable,
                            close: function (key) {
                                var curws = $.Gis.workSpaces[key];
                                curws.unload();
                                $.Gis.root.find("[data-id='toolbar']").children("[data-id='" + key + "']").remove();
                                $.Gis.nav.toggleClickByID(firstkey);
                            },
                            iconCls: ws.options.icon,
                            click: function (id) { $.Gis.setUrl(id); }
                        };
                        all_tabs.push(tab);
                    }
                    return all_tabs;
                }

                function loadModels(callback) {
                    var app_config = appConfig.gisModelConfig || {};
                    var paths = [];
                    for (var key in app_config) {
                        if (!app_config.hasOwnProperty(key)) continue;
                        if (app_config[key].path == null) continue;
                        paths.push(app_config[key].path);
                        keys.push(key);
                    }
                    if (paths.length == 0) {
                        if (callback) callback();
                        return;
                    }
                    require(paths, function () {
                        for (var i = 0; i < arguments.length; i++) {
                            arguments[i].options = $.extend({}, arguments[i].options || {}, app_config[keys[i]]);
                            $.Gis.workSpaces[keys[i]] = arguments[i];
                        }
                        if (callback) callback();
                    });
                }

                root.load(htmlTemplate, function () {
                    loadModels(function () {
                        if (UIMode == "mouse")
                            titlebarpc();
                        else
                            titlebarphone();

                        $.Gis.loadWS("wsBase");

                        $.Gis.gisWin.init();

                        if (opts2) $.Gis.refresh(opts2);

                        //折叠标题栏
                        if (jQuery.iwf.top) {
                            jQuery.iwf.topinitheight = jQuery.iwf.top.height();
                            $("#iwf-hideTitle").bind("click", function () {
                                //$.Gis.map._updatePathViewport();
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
                });
            },

            addWS: function (key, homekey) {
                var ws = $.Gis.workSpaces[key];
                if (ws == undefined) {
                    alert(key + "专题不存在！");
                    return;
                }
                if (!$.Gis.nav.haveid(key)) {
                    var tab = {
                        text: ws.options.title,
                        id: key,
                        closable: ws.options.closable,
                        close: function (key) {
                            var curws = $.Gis.workSpaces[key];
                            curws.unload();
                            $.Gis.root.find("[data-id='toolbar']").children("[data-id='" + key + "']").remove();
                            if (homekey)
                                $.Gis.nav.toggleClickByID(homekey);
                            else {
                                for (var k in $.Gis.workSpaces) {
                                    if ($.Gis.workSpaces[k].options.hidden != true) {
                                        $.Gis.nav.toggleClickByID(k);
                                        return
                                    }
                                }
                            }
                        },
                        iconCls: ws.options.icon,
                        click: function (id) { $.Gis.setUrl(id); }
                    };

                    $.Gis.nav.add(tab);
                }
                $.Gis.nav.toggleClickByID(key);

            }

        };

         //gis服务对象
        (function () {
            $.Gis.GisSer = {
                ComSerUrl: "gis.data"
                //获取GeojsonFeature数据
                    , GeojsonFeature: {
                        /*
                        *获取点Point数据
                        *参数说明：
                        *options-参数可选项（TableName:表名；LatFieldName：纬度坐标坐标字段名称；LngFieldName：经度坐标字段名称；PropertiesFields:指定的字段（默认全部返回，如果IsExceptFields为true，则为排除的字段，其他字段信息都返回，且字段名为大写形式返回）；IsExceptFields:是否排除指定的字段）；Where:过滤条件（默认全部获取）
                        *isAsync-是否异步（默认false）；
                        *callback-回调函数（参数：成功返回geoson格式数据，否则返回false）
                        *返回值：成功返回geoson格式数据，否则返回false
                        */
                        GetPoint: function (options, isAsync, callback) {
                            var defaultOpts = { TableName: null, LatFieldName: "Y", LngFieldName: "X", PropertiesFields: null, IsExceptFields: false, Where: null };
                            var opts = $.extend(defaultOpts, options);
                            isAsync = isAsync == null ? false : isAsync;//默认非异步
                            var retVal = false;
                            $.ajax({
                                type: "post", url: $.Gis.GisSer.ComSerUrl + "?action=GetGisPoint", data: { queryInfo: JSON.stringify(opts) }, async: isAsync, success: function (res) {
                                    var data = eval('(' + res + ')');
                                    if (data != null && data.success != null && data.success == false) {
                                        alert(data.msg);
                                    }
                                    else {
                                        retVal = data;
                                    }
                                    if (typeof callback == "function") {
                                        callback(retVal);
                                    }
                                }
                            });
                            return retVal;
                        }
                        /*
                        *获取线LineString数据
                        *参数说明：
                        *options-参数可选项（TableName：表名；PropertiesFields：指定的字段（默认全部返回，如果IsExceptFields为true，则为排除的字段，其他字段信息都返回，且字段名为大写形式返回）；IsExceptFields：是否排除指定的字段；；PointsFieldName-坐标点字段名称；CustomConvertFun-自定义转换函数(返回值格式：[[-87.359296, 35.00118],[-85.606675, 34.984749]])；Where:过滤条件（默认全部获取））；
                        *isAsync-是否异步（默认false）；
                        *callback-回调函数（参数：成功返回geoson格式数据，否则返回false）
                        *返回值：成功返回geoson格式数据，否则返回false
                        */
                        , GetLineString: function (options, isAsync, callback) {
                            var defaultOpts = { TableName: null, PropertiesFields: null, IsExceptFields: false, PointsFieldName: null, CustomConvertFun: null, IsExceptFields: false };
                            var opts = $.extend(defaultOpts, options);
                            isAsync = isAsync == null ? false : isAsync;//默认非异步
                            if (opts.PointsFieldName == null) {
                                alert("请提供线点坐标字段名【PointsFieldName】！");
                                return false;
                            }

                            opts.PropertiesFields = $.Gis.GisSer.Utility.ArrayToUpperCase(opts.PropertiesFields); opts.PointsFieldName = opts.PointsFieldName.toUpperCase();
                            //无论什么情况下，都要返回PointsFieldName字段
                            var isGetAllField = (opts.PropertiesFields == null || opts.PropertiesFields.length < 1);//是否获取所有字段
                            if (!isGetAllField) {
                                var isPointFieldInPropertiesFields = $.inArray(opts.PointsFieldName, opts.PropertiesFields) > -1;//点字段是否在指定字段里
                                if (opts.IsExceptFields && isPointFieldInPropertiesFields) {//排除字段
                                    opts.PropertiesFields.pop(opts.PointsFieldName);
                                } else if (!opts.IsExceptFields && !isPointFieldInPropertiesFields && opts.PropertiesFields != null) {//指定字段
                                    opts.PropertiesFields.push(opts.PointsFieldName);
                                }
                            }

                            var retVal = false;
                            //gis记录转换为Geojson格式数据
                            function _getGeojson(gisRecords) {
                                var FeaCol = [];
                                for (var i = 0; i < gisRecords.length; i++) {
                                    var curRecord = gisRecords[i];
                                    var feature = {
                                        "type": "Feature",
                                        "properties": null,
                                        "geometry": {
                                            "type": "LineString",
                                            "coordinates": []
                                        }
                                    }

                                    //获取字段属性
                                    var properties = {};
                                    for (var item in curRecord) {
                                        properties[item] = curRecord[item];
                                    }
                                    if (!isGetAllField) {
                                        if ((opts.IsExceptFields && isPointFieldInPropertiesFields) || (!opts.IsExceptFields && !isPointFieldInPropertiesFields)) {//去除点属性
                                            delete properties[opts.PointsFieldName];
                                        }
                                    }

                                    //点字段转换为坐标点数组
                                    //var coordinates = [];
                                    var latlngCol = [];
                                    var points = curRecord[opts.PointsFieldName.toUpperCase()]
                                    if (typeof opts.CustomConvertFun == "function") {//自定义转换
                                        latlngCol = opts.CustomConvertFun(points);
                                    } else {//默认转换
                                        var pointCol = [];
                                        pointCol = points.split(' ');
                                        for (var j = 0; j < pointCol.length; j++) {
                                            var ll = pointCol[j].split(',');
                                            latlngCol.push([Number(ll[0]), (ll[1])]);
                                        }
                                    }

                                    feature.properties = properties;
                                    feature.geometry.coordinates = latlngCol;

                                    FeaCol.push(feature);
                                }
                                return FeaCol;
                            };

                            var gisRecords = $.Gis.GisSer.GetGisRecord(opts, isAsync, function (data) {
                                if (data !== false) {
                                    retVal = _getGeojson(data);
                                }
                                if (typeof callback == "function") {
                                    callback(retVal);
                                }
                            });

                            return retVal;
                        }
                        /*
                        *获取面Polygon数据
                        *参数说明：
                        *options-参数可选项（TableName：表名；PropertiesFields：指定的字段（默认全部返回，如果IsExceptFields为true，则为排除的字段，其他字段信息都返回，且字段名为大写形式返回）；IsExceptFields：是否排除指定的字段；PointsFieldName-坐标点字段名称；CustomConvertFun-自定义转换函数(返回值格式：[[-87.359296, 35.00118],[-85.606675, 34.984749]])；Where:过滤条件（默认全部获取））；
                        *isAsync-是否异步（默认false）；
                        *callback-回调函数（参数：成功返回geoson格式数据，否则返回false）
                        *返回值：成功返回geoson格式数据，否则返回false
                        */
                        , GetPolygon: function (options, isAsync, callback) {
                            var defaultOpts = { TableName: null, PropertiesFields: null, IsExceptFields: false, PointsFieldName: null, CustomConvertFun: null };
                            var opts = $.extend(defaultOpts, options);
                            isAsync = isAsync == null ? false : isAsync;//默认非异步
                            if (opts.PointsFieldName == null) {
                                alert("请提供面坐标字段名【PointsFieldName】！");
                                return false;
                            }

                            opts.PropertiesFields = $.Gis.GisSer.Utility.ArrayToUpperCase(opts.PropertiesFields); opts.PointsFieldName = opts.PointsFieldName.toUpperCase();
                            //无论什么情况下，都要返回PointsFieldName字段
                            var isGetAllField = (opts.PropertiesFields == null || opts.PropertiesFields.length < 1);//是否获取所有字段
                            if (!isGetAllField) {
                                var isPointFieldInPropertiesFields = $.inArray(opts.PointsFieldName, opts.PropertiesFields) > -1;//点字段是否在指定字段里
                                if (opts.IsExceptFields && isPointFieldInPropertiesFields) {//排除字段
                                    opts.PropertiesFields.pop(opts.PointsFieldName);
                                } else if (!opts.IsExceptFields && !isPointFieldInPropertiesFields && opts.PropertiesFields != null) {//指定字段
                                    opts.PropertiesFields.push(opts.PointsFieldName);
                                }
                            }

                            var retVal = false;
                            //gis记录转换为Geojson格式数据
                            function _getGeojson(gisRecords) {

                                var FeaCol = {
                                    "type": "FeatureCollection", "features": []
                                };
                                for (var i = 0; i < gisRecords.length; i++) {
                                    var curRecord = gisRecords[i];

                                    var feature = {
                                        "type": "Feature",// "id": "01",
                                        "properties": null,//{ "name": "Alabama", "density": 94.65 },
                                        "geometry": {
                                            "type": "Polygon",
                                            "coordinates": []//node format:[[-87.359296, 35.00118],[-85.606675, 34.984749]]
                                        }
                                    };
                                    //获取字段属性
                                    var properties = {};
                                    for (var item in curRecord) {
                                        properties[item] = curRecord[item];
                                    }
                                    if (!isGetAllField) {
                                        if ((opts.IsExceptFields && isPointFieldInPropertiesFields) || (!opts.IsExceptFields && !isPointFieldInPropertiesFields)) {//去除点属性
                                            delete properties[opts.PointsFieldName];
                                        }
                                    }

                                    //点字段转换为坐标点数组
                                    //var coordinates = [];
                                    var latlngCol = [];
                                    var points = curRecord[opts.PointsFieldName.toUpperCase()]
                                    if (typeof opts.CustomConvertFun == "function") {//自定义转换
                                        latlngCol = opts.CustomConvertFun(points);
                                    } else {//默认转换
                                        var pointCol = [];
                                        pointCol = points.split(' ');
                                        for (var j = 0; j < pointCol.length; j++) {
                                            var ll = pointCol[j].split(',');
                                            latlngCol.push([Number(ll[0]), (ll[1])]);
                                        }
                                    }
                                    //coordinates.push(latlngCol);

                                    feature.properties = properties;
                                    feature.geometry.coordinates.push(latlngCol);

                                    FeaCol.features.push(feature);
                                }

                                return FeaCol;
                            }

                            var gisRecords = $.Gis.GisSer.GetGisRecord(opts, isAsync, function (data) {
                                if (data !== false) {
                                    retVal = _getGeojson(data);
                                }
                                if (typeof callback == "function") {
                                    callback(retVal);
                                }
                            });

                            return retVal;



                        }
                    }
                /*
                *获取GIS记录
                *参数说明：
                *options-参数可选项（TableName：表名；PropertiesFields：指定的字段（默认全部返回，如果IsExceptFields为true，则为排除的字段，其他字段信息都返回，且字段名为大写形式返回）；IsExceptFields：是否排除指定的字段；Where:过滤条件（默认全部获取））；
                *isAsync-是否异步（默认false）；
                *callback-回调函数（参数：成功返回gis记录数组，否则返回false）
                *返回值：成功返回gis记录数组，否则返回false
                */
                    , GetGisRecord: function (options, isAsync, callback) {
                        var defaultOpts = { TableName: null, PropertiesFields: null, IsExceptFields: false, Where: null };
                        var opts = $.extend(defaultOpts, options);
                        isAsync = isAsync == null ? false : isAsync;//默认非异步
                        var retVal = false;
                        $.ajax({
                            type: "post", url: $.Gis.GisSer.ComSerUrl + "?action=GetGisRecord", data: { queryInfo: JSON.stringify(opts) }, async: isAsync, success: function (res) {
                                var data = eval('(' + res + ')');
                                if (data != null && data.success != null && data.success == false) {
                                    alert(data.msg);
                                }
                                else {
                                    retVal = data;
                                }
                                if (typeof callback == "function") {
                                    callback(retVal);
                                }
                            }
                        });
                        return retVal;
                    }
                //一些通用功能函数
                , Utility: {
                    //字符串数组转换为大写形式
                    ArrayToUpperCase: function (array) {
                        if (array == null || array.length == 0)
                            return array;
                        for (var i = 0; i < array.length; i++)
                            array[i] = array[i].toUpperCase();
                        return array;
                    }
                    //获取url参数
                    , GetQueryString: function (name) {
                        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                        var r = window.location.search.substr(1).match(reg);
                        if (r != null) return unescape(r[2]); return null;
                    }
                }
            }
        })();

        //gis窗体对象
        $.Gis.gisWin = {
            $toggle: null,//显示/隐藏列表按钮

            toggleBtn: new function () {
                var beshow = false;
                var beOpen = true;
                this.show = function () {
                    $.Gis.gisWin.$toggle.show();
                    beshow = true;
                };
                this.open = function () {
                    $.Gis.gisWin.$toggle.show();
                    if (beOpen) return;
                    $.Gis.gisWin.$toggle.addClass("winToggleShow");
                    $.Gis.gisWin.$toggle.children().removeClass("fa-rotate-180");
                    beOpen = true;
                };
                this.close = function () {
                    $.Gis.gisWin.$toggle.show();
                    if (!beOpen) return;
                    $.Gis.gisWin.$toggle.removeClass("winToggleShow");
                    $.Gis.gisWin.$toggle.children().addClass("fa-rotate-180");
                    beOpen = false;
                }
                this.hide = function () {
                    $.Gis.gisWin.$toggle.hide();
                    beshow = false;
                }
                this.toggle = function () {
                    if (beOpen)
                        this.close();
                    else
                        this.open();
                }
            },

            $container: null,//窗口容器

            init: function () {//初始化右侧窗口
                $.Gis.gisWin.$toggle = $.Gis.root.find("[data-id='winToggle']");
                $.Gis.gisWin.$container = $.Gis.root.find("[data-id='winContainer']");
                $.Gis.gisWin.$container.css("max-height", (parseInt($.Gis.root.css("height")) - 90) + "px");

                $.Gis.gisWin.$toggle.click(function () {
                    $.Gis.gisWin.$container.toggle();
                    $.Gis.gisWin.toggleBtn.toggle();

                });
                $.Gis.root.find("[data-id='btnlayermanager']").click(function () {
                    if ($.Gis.gisWin.wins['laymgr'] == undefined) $.Gis.gisWin.add($.Gis.LayerManager).show();
                });
            },

            wins: {},//创建的窗口所有对象

            //获取窗口（通过窗口ID获取）
            get: function (id) {
                return this.wins[id];
            },

            //移除窗口
            remove: function (id) {
                $.Gis.gisWin.$container.find("[itemid=" + id + "]").remove();
                delete this.wins[id];
                if (UIMode != "mouse") $.Gis.gisWin.$container.hide();
            },

            //显示窗口
            show: function (id) {
                $.Gis.gisWin.$container.find("[itemid=" + id + "]").show();
                $.Gis.gisWin.$container.show();
            },

            add: function (winItem) {
                if (this.wins.hasOwnProperty(winItem.options.key)) {
                    alert("窗口创建失败，key:" + winItem.options.key + "已被使用！");
                    return false;
                }
                var curWin = {};
                curWin.id = winItem.options.key;
                curWin.title = winItem.options.title;
                curWin.closeCallback = winItem.closeCallback;
                curWin.gisWin = this;
                curWin.close = function () {
                    if (UIMode == "mouse") {
                        //没有返回值或true时移除
                        var isClose = typeof this.closeCallback == 'function' ? this.closeCallback() : true;
                        if (isClose || isClose == null) {
                            this.gisWin.remove(this.id);
                        }
                    } else {
                        this.gisWin.remove(this.id);
                    }
                };
                curWin.remove = function () {
                    this.gisWin.remove(this.id);
                };
                curWin.show = function () {
                    //$.Gis.gisWin.show(this.id);
                    this.gisWin.show(this.id);
                };
                curWin.hide = function () {
                    //$.Gis.gisWin.hide(this.id);
                    this.gisWin.hide(this.id);
                };

                var itemTemplate = '<div class="win-item panel panel-default">'
                    + '<div class="item-head panel-heading"><span class="title">这里是标题</span>'
                    + '<button type="button" class="item-close close" aria-hidden="true" title="关闭">&times;</button>'
                    + '<button type="button" class="item-toggle close" title="展开/折叠" aria-hidden="true"><i class="fa fa-caret-down"></i></button></div>'
                    + '<div class="item-content panel-body"></div>'
                    + '</div>';
                var $item = $(itemTemplate);
                $item.attr("itemid", winItem.options.key);
                $item.find(".title").text(curWin.title);
                if (winItem.options.icon) {
                    //加入对图标的支持
                }
                winItem.show($item.find(".item-content"));
                if (UIMode != "mouse") {
                    $item.find(".item-toggle").hide();
                }
                else {
                    $item.find('.item-toggle').bind('click', function () {
                        $item.find(".item-content").toggle();
                        $(this).find(".fa-caret-down").toggleClass("fa-rotate-180");
                    });
                }

                $item.find('.item-close').bind('click', function () { $.Gis.gisWin.get(curWin.id).close(); });

                //解决一个图标bug
                if (!$.Gis.gisWin.$toggle.children().hasClass("fa-rotate-180")) {
                    //$.Gis.gisWin.$toggle.trigger('click');
                    $.Gis.gisWin.$container.show();
                }
                $.Gis.gisWin.$container.append($item);

                this.wins[curWin.id] = curWin;
                return curWin;
            }

        };
        (function () {
            $.Gis.Com = {
                RemoveAllLayer: function () {//移除地图所有图层
                    $.Gis.map.eachLayer(function (layer) {
                        if (!layer._url)
                            $.Gis.map.removeLayer(layer);
                    });
                },
                SearchData: function () {
                    var address = $.Gis.root.find("[data-id='txtGisSearch']").val().trim();
                    if (!address) return;
                    this.searchByAddress(address, function (result) {
                        if (result.success && result.result.length > 0) {
                            $.Gis.map.setView(result.result, 18);
                            /*水波纹*/
                            $.Gis.setRadar(result.result);
                        }
                    });
                },
                /*
                *创建通用窗口 createComWin:
                *参数说明：
                *options-参数可选项
                （layer：工作区的图层组；id:窗口ID(在所有工作区中不能重复)；title:窗口标题；
                content：窗口内容；closeCallback：窗口关闭回调函数（返回false时则不会关闭,自己做处理（如：隐藏窗口）；label_property：显示的属性）
                */
                QueryWin: function (options) {
                    var defaultOpts = { layer: null, id: null, title: null, content: '<div></div>', closeCallback: null, label_property: null };
                    var opts = $.extend(defaultOpts, options);

                    this.options = { key: opts.id, title: opts.title, icon: undefined };

                    this.show = function (root) {
                        //列表框
                        var $ul = $('<ul class="com-ul"></ul>');
                        var layer = opts.layer;
                        //循环添加该图层上的layer
                        for (var i = 0; i < layer.length; i++) {
                            var curL = layer[i];
                            var pro = curL.feature.properties;
                            var label = pro[opts.label_property];
                            var $li = $("<li></li>").appendTo($ul);
                            var $label = $('<span class="li-label"></span>').appendTo($li);
                            $label.append(label == null ? "&nbsp;" : label);
                            var $oper = $('<span class="oper"></span>').appendTo($li);
                            var $li = $(' <li><span class="li-label">名称</span><span class="oper"><span class="icon-map-marker"></span></span></li>');
                            var $setView = $('<span class="icon-map-marker" title="定位"></span>').appendTo($oper).bind('click', curL, function (eventData) {
                                var ll = eventData.data;
                                //var center = ll.getLatLng();
                                //$.Gis.map.setView(center); 
                                ll.openPopup();
                                if (UIMode != "mouse") {
                                    $.Gis.gisWin.$container.hide();
                                }
                            });
                        }

                        //搜索框
                        var $search_container = $('<div class="com-search"></div>');
                        var $search_text = $('<input />').appendTo($search_container);
                        $search_text.bind('keyup blur', function () {
                            var keyword = $.trim($(this).val());
                            //alert(keyword);
                            if (keyword == "")
                                $ul.find("li").show();
                            else {
                                $ul.find("li .li-label").each(function (index, element) {
                                    var curElem = $(element);
                                    var curLi = curElem.closest("li");
                                    var labelVal = curElem.text();
                                    if (labelVal.indexOf(keyword) > -1)
                                        curLi.show();
                                    else
                                        curLi.hide();
                                });
                            }
                        });

                        root.append($search_container);

                        root.append($ul);
                    }
                },
                GCJ102_to_BD09: function (lat, lng) {
                    var x_pi = 3.14159265358979324 * 3000.0 / 180.0,
                   x = lng,
                   y = lat,
                   z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi),
                   theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
                    lng = z * Math.cos(theta) + 0.0065;
                    lat = z * Math.sin(theta) + 0.006;
                    return { lat: lat, lng: lng };
                },
                BD09_to_GCJ102: function (lat, lng) {
                    var x_pi = 3.14159265358979324 * 3000.0 / 180.0,
                    x = lng - 0.0065,
                    y = lat - 0.006,
                    z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi),
                    theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
                    lng = z * Math.cos(theta);
                    lat = z * Math.sin(theta);
                    return { lat: lat, lng: lng };
                },
                searchByAddress: function (address, callback) {
                    $.ajax({
                        url: 'http://api.map.baidu.com/geocoder/v2/',
                        dataType: 'jsonp',
                        data: {
                            address: address,
                            output: 'json',
                            ak: '2nT1fbMClBbsQm8xHuEGkfIL'    //zjl bd services 100w/天
                        },
                        success: function (result) {
                            if (result.status == 1) {
                                if (callback) {
                                    callback({ success: false, result: [] }); return;
                                }
                            }
                            var location = result.result.location;
                            location = $.Gis.Com.BD09_to_GCJ102(location.lat, location.lng);
                            var latlng = [location.lat, location.lng];
                            if (callback) callback({ success: true, result: latlng });
                        },
                        error: function (code) {
                            if (callback) callback({ success: false, result: [] });
                        }
                    });
                },
                searchByLocation: function (latlng, callback) {
                    var str_p = '';
                    if (latlng instanceof Array) str_p = latlng[0] + ',' + latlng[1];
                    else str_p = latlng.lat + ',' + latlng.lng;
                    $.ajax({
                        url: 'http://api.map.baidu.com/geocoder/v2/',
                        dataType: 'jsonp',
                        data: {
                            output: 'json',
                            coordtype: 'wgs84ll',
                            location: str_p,
                            ak: '2nT1fbMClBbsQm8xHuEGkfI' //zjl bd services 100w/天
                        },
                        success: function (result) {
                            if (result.status !== 0) {
                                if (callback) {
                                    callback({ success: false, result: null });
                                    return;
                                }
                            }
                            if (callback) callback({ success: true, result: result });
                        },
                        error: function (code) {
                            if (callback) callback({ success: false, result: null });
                        }
                    });
                }
            };
        })();

        $.Gis.workSpaces.wsBase = new function () {
            var self = this;
            var mapOpacity = 1;
            this.options = { title: "地图" };
            var streetMapLayer = null;
            var baidu = null;
            var mapcenter = (appConfig.mapCenter) ? appConfig.mapCenter : [23.137519, 113.263839];//默认地图中心坐标 nanning
            var sellatlng = null;

            function addLayer() {
                if ($.Gis.map == null) {
                    $.Gis.map = L.map($.Gis.root.find("[data-id='map']")[0], {
                        zoomControl: false,
                        attributionControl: false
                    }).setView(mapcenter, 11);
                    self.changeMap();

                    //点击地图获取经纬度
                    $.Gis.map.on('click', function (e) {
                        sellatlng = e.latlng;
                        var showele = $("[data-id='selectedlatlng']");
                        if (showele)
                            showele.html(sellatlng.lat + "，" + sellatlng.lng);
                    });

                    //查询
                    $($.Gis.root.find("[data-id='btnGisSearch']")).click(function () {
                        $.Gis.Com.SearchData();
                    });
                }
            }

            //var streetMapUrl = 'gis.data?action=tile&z={z}&y={y}&x={x}';
            //var streetMapUrl = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
            //var streetMapUrl = 'http://mt0.google.cn/vt/lyrs=m@209000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galileo'; //google
            //var streetMapUrl = 'http://mt0.google.cn/vt/lyrs=m@209000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galileo'; //google
            //var streetMapUrl2 = 'https://mts1.google.com/vt/lyrs=s@151&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galil'; //google
            //var streetMapUrl = 'http://api.map.baidu.com/staticimage?center=116.403874,39.914888&width=300&height=200&zoom=11'; //baidu
            //var streetMapUrl = 'http://p1.go2map.com/seamless1/0/174/713/63/{z}/{y}_{x}.png?v=2014819'; //sogou

            this.changeMap = function (mapType) {

                //for bing
                function quadkey(zyx) {
                    var result = '';
                    for (var i = zyx.z; i > 0; i--) {
                        var digit = 0;
                        var mask = 1 << (i - 1);
                        if ((zyx.x & mask) != 0) {
                            digit++;
                        }
                        if ((zyx.y & mask) != 0) {
                            digit++;
                            digit++;
                        }
                        result += digit;
                    }
                    return result;
                }

                function quadkey2(zyx) {

                    var x = zyx.x;
                    var y = zyx.y;
                    var z = zyx.z;

                    y = Math.pow(2, z) - 1 - y;
                    var url = z + "/" + Math.floor(x / 16.0) + "/" + Math.floor(y / 16.0) + "/" + x + "_" + y + "";
                    return url;

                    //int x = 214130;  
                    //int y = 114212;  
                    //int z = 18;  
                    //y = int.Parse( Math.Pow(2, z).ToString()) - 1 - y;  
                    //string url = z.ToString() + "/" + Math.Floor(x / 16.0).ToString() + "/"   
                    //    + Math.Floor(y / 16.0).ToString()  + "/" + x.ToString() + "_"   
                    //    + y.ToString() + ".png"; //计算结果：18/13383/9245/214130_147931.png  
                }

                var streetMapUrl = 'http://p3.map.gtimg.com/maptilesv2/{quadkey2}.png?version=20130701';

                if (mapType) {
                    if (mapType == "yx") streetMapUrl = 'https://mts1.google.com/vt/lyrs=s@151&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galil'; //google
                    if (mapType == "txyx") streetMapUrl = 'http://p1.map.gtimg.com/sateTiles/{quadkey2}.jpg?version=20130701';    //腾讯影像
                    $.Gis.layers["baseLayer"].setUrl(streetMapUrl);
                    return;
                }
                streetMapLayer = new L.TileLayer(streetMapUrl, { maxZoom: 18, attribution: '云景', quadkey: quadkey, quadkey2: quadkey2 });
                streetMapLayer.addTo($.Gis.map);
                $.Gis.layers["baseLayer"] = streetMapLayer;
            }

            this.show = function (element, opts) {
                var tools = [{
                    type: 'group', children: [
                        {
                            type: 'radio', name: 'bj', id: 'bj-001', text: '地图', handler: function () {
                                self.changeMap('txdt');
                            }
                        }
                        ,
                        {
                            type: 'radio', name: 'bj', id: 'bj-002', text: '影像', handler: function () {
                                self.changeMap('txyx');
                            }
                        }
                    ]
                },
                { type: 'split' },
                {
                    type: 'group', handler: function () { }, children: [
                    { id: 'dh-001', css: 'fa fa-globe' },
                    { id: 'dh-002', css: 'fa fa-arrow-left' },
                    { id: 'dh-003', css: 'fa fa-arrow-right' }
                    ]
                },
                { type: 'split' },
                {
                    type: 'group', children: [
                         {
                             title: '在地图上点击获取位置', css: 'fa fa-hand-o-up', text: '取点', handler: function () { $.Gis.gistools.draw("point"); }
                         },
                         {
                             title: '距离量算', css: 'fa fa-expand', text: '测量', handler: function () {
                                 $.Gis.gistools.draw("polyline");
                             }
                         }
                         ,
                         {
                             title: '面积量算', css: 'fa fa-star', text: '面积', handler: function () {
                                 $.Gis.gistools.draw("polygon");
                             }
                         },
                         {
                             title: '半径量算', css: 'fa fa-circle-thin', text: '半径', handler: function () {
                                 $.Gis.gistools.draw("circle");
                             }
                         }
                         ,
                         {
                             title: '清除', css: 'fa fa-trash-o', text: '清除', handler: function () {
                                 $.Gis.gistools.clear();
                             }
                         }]
                },
                { type: 'split' },
                 {
                     title: '设置背景亮度', text: '蒙版', handler: function (element) {
                         if (mapOpacity == 1)
                             mapOpacity = 0.5;
                         else
                             mapOpacity = 1;

                         streetMapLayer.setOpacity(mapOpacity);

                         $(element).toggleClass("active");
                     }
                 },
                 {
                     title: '图层管理', text: '图层管理', css: 'hidden-xs', iconCls: "fa fa-list-ul", handler: function () {
                         if ($.Gis.gisWin.wins['laymgr'] == undefined) $.Gis.gisWin.add($.Gis.LayerManager).show();
                     }
                 },
                 { css: 'hidden-xs', type: 'split' },
                 {
                     title: '定位', text: '', iconCls: 'fa fa-map-marker', type: 'circle', handler: function () { //formSetting.delNode();
                         if (!$.Gis.map.hasEventListeners("locationfound")) {
                             $.Gis.map.on("locationfound", function (e) {
                                 //alert("locationfound");
                                 var latlng = e.latlng;
                                 if ($.Gis.gpsMarker == null) {
                                     $.Gis.gpsMarker = L.marker(latlng).addTo($.Gis.map);
                                 }
                                 else {
                                     $.Gis.gpsMarker.addTo($.Gis.map);
                                 }
                                 var $content = $("<div>当前位置&nbsp;&nbsp;&nbsp;</div>");
                                 var $remove = $("<button href='#' class='btn btn-default btn-xs' title='移除标记'>移除</button>").click(function () { $.Gis.map.removeLayer($.Gis.gpsMarker) }).appendTo($content);

                                 $.Gis.gpsMarker.setLatLng(latlng).bindPopup($content[0]).openPopup();
                                 $.Gis.map.setView(latlng);
                             });
                         }
                         var locateOptions = { watch: false, setView: false, maxZoom: 15, enableHighAccuracy: true };
                         $.Gis.map.locate(locateOptions);
                     }
                 }
                ];
                var toolBar = element.append('<div style="margin:0px 0px 10px 0px"></div>').children().last().iwfToolbar({ data: tools });
                addLayer();
                $.Gis.map.on('moveend', function () { $.Gis.setUrl(); });
                L.NavBar.onAdd($.Gis.map, [element.find("[data-id='dh-001']")[0], element.find("[data-id='dh-003']")[0], element.find("[data-id='dh-002']")[0]]);
                $.Gis.gistools.addTo($.Gis.map, false);

            }

            //this.getLatLng = function (callback) {
            //    var t_fn = function (e) {
            //        if (callback) callback(e.latlng);
            //        $.Gis.map.off('click', t_fn);
            //    }
            //    $.Gis.map.on('click', t_fn);
            //};

            this.getSelectedLatLng = function () {
                return sellatlng;
            };
        }

        $.Gis.LayerManager = new function () {
            var self = this;
            this.options = { key: 'laymgr', title: '图层管理', icon: 'fa fa-list-ul' };
            this.layers = {};
            var $treeDiv;

            function setBJ(root) {
                root.append('<div style="width:100%"><div title="" class="btn-group btn-group-justified"><div title="地形图" class="btn btn-default" data-id="bj-001"><span style="margin-right: 5px; margin-left: 5px;" unselectable="on">地图</span></div><div title="卫星影像" class="btn btn-default" data-id="bj-002"><span style="margin-right: 5px; margin-left: 5px;" unselectable="on"> 影像 </span></div></div></div>');
                root.find("[data-id='bj-001']").bind('click', function () {
                    $.Gis.root.find("[data-id='bj-001']").addClass("active");
                    $.Gis.root.find("[data-id='bj-002']").removeClass("active");
                    $.Gis.workSpaces.wsBase.changeMap('txdt');
                    return false;
                });
                root.find("[data-id='bj-002']").bind('click', function () {
                    $.Gis.root.find("[data-id='bj-002']").addClass("active");
                    $.Gis.root.find("[data-id='bj-001']").removeClass("active");
                    $.Gis.workSpaces.wsBase.changeMap('txyx');
                    return false;
                });
            }

            this.show = function (root) {
                $treeDiv = root;
                $treeDiv.empty();
                var data = {
                    expandbyClick: true,
                    expandable: true,
                    data: [
                    {
                        title: '背景切换', text: '背景图层', id: 'l001', css: "list-group-item treeview-item"
                    }
                    ]
                };
                root.listView2(data);

                setBJ(root.find("[data-id='l001']"));
                for (var key in self.layers) {
                    var tt = self.layers[key];
                    if (tt) self.addLayer(tt.layer, tt.opts);
                }
            }

            this.addLayer = function (lyr, Opts) {
                if (self.layers[Opts.id] != undefined) self.removeLayer(Opts.id);
                self.layers[Opts.id] = { 'layer': lyr, 'opts': Opts };
                if ($treeDiv == undefined) { //解决初次加载时加入图层开关时的bug
                    $.Gis.root.find("[data-id='btnlayermanager']").trigger('click');
                    $.Gis.gisWin.wins[this.options.key].close();
                }
                var $group = $treeDiv;
                if (Opts.groupname) {
                    $group = $treeDiv.find("[data-ul='" + Opts.groupid + "']");
                    if ($group.length < 1) {
                        var a = $(' <a class="list-group-item  treeview-bar" style="cursor:pointer;" data-id="' + Opts.groupid + '" unselectable="on">' + Opts.groupname + ' </a>').appendTo($treeDiv);
                        $group = $('<div style="margin: 0px 0px 0px 3px;"  class="list-group" data-ul="' + Opts.groupid + '"></div>').appendTo($treeDiv);

                        var btnHind = $('<div class="badge btn"><span data-hind="' + Opts.groupid + '" unselectable="on" class="fa fa-caret-down  fa-lg" style="width:8px;height:12px;"></span></div>').appendTo(a);

                        a.bind('click', function (e) {
                            if (btnHind.children().hasClass("fa fa-caret-down")) {
                                btnHind.children().removeClass("fa fa-caret-down");
                                btnHind.children().addClass("fa fa-caret-left");
                                $group.hide();

                            } else {
                                btnHind.children().removeClass("fa fa-caret-left");
                                btnHind.children().addClass("fa fa-caret-down");
                                $group.show();
                            }
                            return false;
                        });

                    }
                }
                var checkIcon = 'fa-check-square-o';
                if (Opts.visible == false) checkIcon = 'fa-square-o';

                var $li = $('<a  class="list-group-item" style="border-width:0 0 1px 0;" data-id="' + Opts.id + '" unselectable="on"><span style="cursor:pointer"><i class="fa ' + checkIcon + '" style="width:22px;"></i> ' + Opts.name + '</span></a>').appendTo($group);

                $li.children("span").bind('click', function (e) {
                    var $icon = $li.children("span").children("i");
                    if ($icon.hasClass("fa-square-o")) {
                        $.Gis.map.addLayer(lyr);
                        $icon.removeClass("fa-square-o")
                        $icon.addClass("fa-check-square-o");
                    } else {
                        $.Gis.map.removeLayer(lyr);
                        $icon.removeClass("fa-check-square-o")
                        $icon.addClass("fa-square-o")
                    }
                    // $li.toggleClass("disabled");
                    return false;
                });

                var $delLayer = $('<span class="badge" title="删除图层"><span aria-hidden="true">&times;</span></span>').appendTo($li).bind('click', function () {
                    $.Gis.map.removeLayer(lyr);
                    self.removeLayer(Opts.id);
                    return false;
                });

                if (Opts.showControl) {
                    Opts.showControl($('<div style="width:100%"></div>').appendTo($li));

                }


            };

            this.removeLayer = function (id) {
                if ($treeDiv) {
                    delete self.layers[id];

                    var $li = $treeDiv.find("[data-id='" + id + "']");
                    if ($li.parent().children().length == 1) {
                        $li.parent().prev().remove();
                        $li.parent().remove();
                    } else
                        $li.remove();
                }
            };

            this.setLayer = function (id, opts) {
                if ($treeDiv) {
                    if (opts.visible == true) {
                        var $icon = $treeDiv.find("[data-id='" + id + "']").children("span").children("i");
                        $icon.removeClass("fa-square-o")
                        $icon.addClass("fa-check-square-o");
                    }
                    if (opts.visible == false) {
                        var $icon = $treeDiv.find("[data-id='" + id + "']").children("span").children("i");
                        $icon.removeClass("fa-check-square-o")
                        $icon.addClass("fa-square-o")
                    }
                }
            }
        }();

        //自助定位
        $.Gis.SelfLocation = new function () {
            //获取经纬度
            this.getLatLng = function (root, callback) {
                $.Gis.init(root, null, null, callback);
            };
        }();
    });


