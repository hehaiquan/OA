/// <reference path="framework/common.js" />
/// <reference path= />
require.config({
    baseUrl: './',
    //define paths to where all of our dependencies live
    paths: {
        'css': 'script/css.min',
        "jquery": "script/jquery/jquery-1.11.3",
        "jquerytmpl": "script/jquery/jquery.tmpl",
        "jqueryui": "script/jquery-ui-1.11.4.custom/jquery-ui",
        "knockout": "script/knockout/knockout-3.2.0",
        "knockout.mapping": "script/knockout/knockout.mapping-latest",
        'localforage': 'script/localforage',

        'leaflet': 'script/leaflet/leaflet',
        'leaflet-label': 'script/leaflet/leaflet.label',
        'leaflet-MakiMarkers': 'script/leaflet/Leaflet.MakiMarkers',
        'leaflet-cluster': 'script/leaflet/MarkerCluster/leaflet.markercluster-src',
        'leaflet-awesome': 'script/leaflet/leaflet.awesome-markers',
        'javascript-util': 'script/gis/javascript.util',
        'jst': 'script/gis/jsts',
        'leaflet-awesome-css': 'script/leaflet/leaflet.awesome-markers',
        'leaflet-css': 'script/leaflet/leaflet',
        'leaflet-label-css': 'script/leaflet/leaflet.label',
        'leaflet-mc-css': 'script/leaflet/MarkerCluster/MarkerCluster',
        'leaflet-mc-default-css': 'script/leaflet/MarkerCluster/MarkerCluster.Default'
    },
    shim: {//非AMD插件库的依赖
        'jst': {
            deps: ['javascript-util']
        },
        'leaflet': {
            deps: ['css!leaflet-css']
        },
        'leaflet-label': {
            deps: ['css!leaflet-label-css']
        },
        'leaflet-cluster': {
            deps: ['css!leaflet-mc-css', 'css!leaflet-mc-default-css']
        },
        'leaflet-awesome': {
            deps: ['css!leaflet-awesome-css']
        }
    }
});
var ko;
require(['jquery', 'knockout', "jqueryui", "knockout.mapping"], function ($, knockout, jqueryui, maping) {

    ko = knockout;
    ko.mapping = maping;
    //if ($.Gis == undefined) $.Gis = { workSpaces: [] }

    //向下兼容原来的模块注册方式！ 以后删除
    $.iwf = {
        models: {},
        // 模块管理 register注册模型模块 //getModel通过key取得模型
        register: function (model) {
            var key = model.options.key;
            if ($.iwf.models[key])
                alert("系统已经添加此键值对应的模型:" + key);
            else
                $.iwf.models[key] = model;
        }
    };


    $(document).ready(function () {
        require(["config/config.js", "jquerytmpl", "script/prototpye.js", "script/bootstrap.js",
            "framework/jquery.iworkflow.js", "fx/core", "fx/offline/service",
            "framework/fxControl.js",
        "script/framePlugin/frame-weboffice/frameWeboffice.js",
        "script/commonwords/ajaxfileupload.js",
        'script/fullcalendar/fullcalendar.min.js',
        "script/framePlugin/frame-supertree/supertree.js",
        "script/fckeditor/ckeditor.js",
        "script/sightrureControl.js", "script/ztree/jquery.ztree.all-3.5.js","framework/common.js"], function () {

            $.get("IWorkPackageFile.data?action=models&debug=true", function (s, s1) {
                //   alert(s);
                var modellists = s.split(",");
                modellists.push("Forms/Config.js");
                require(modellists, function () { });
            });
            jQuery.Biz = {};

            $.CheckOnline(function (isOnline) {

                $.iwf.login();
                $.iwf.online = isOnline;
                $(document).attr("title", appConfig.appName);

                $.iwf.getModel('fx/ui/index', function (model) { model.show(); });
            });
        });

    });
});