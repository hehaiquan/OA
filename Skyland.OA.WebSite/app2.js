require.config({
    baseUrl: './',
    //define paths to where all of our dependencies live
    paths: {
        'css': 'script/css.min',
        "jquery": "script/jquery/jquery-1.11.2.min",
        "jquerytmpl": "script/jquery/jquery.tmpl",
        "jqueryui": "script/UI/jquery-ui-1.9.1.custom.min",
        "knockout": "script/knockout/knockout-3.2.0",
        "knockout.mapping": "script/knockout/knockout.mapping-latest",
        'localforage': 'script/localforage',


    },
});
var ko;
require(['jquery', 'knockout', "knockout.mapping"], function ($, knockout, maping) {

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
        require(["config/config.js", "jquerytmpl", "jqueryui", "script/prototpye.js", 
            "framework/jquery.iworkflow.js", "fx/core", "fx/offline/service",
            "framework/fxControl.js",
        //"script/Dialog_lhg/lhgdialog.min.js?skin=blue",
        "script/commonwords/ajaxfileupload.js",
        'script/fullcalendar/fullcalendar.min.js',
        "script/fckeditor/ckeditor.js", "script/ztree/jquery.ztree.all-3.5.js"], function () {
            jQuery.Biz = {};

            $.CheckOnline(function (isOnline) {
                var MenuList;
                var bShow = false;
                var objectMenuId;//祖节点
                var syMenuID;
                $.iwf.login();
                $.iwf.online = isOnline;
                $(document).attr("title", appConfig.appName);

                //框架头部
                if ($("#iwf-frame-top").length > 0) {
                    $.iwf.getModel('fx/ui/top', function (model) {
                        model.init($("#iwf-frame-top"));
                        $.iwf.top = model;
                    })
                }

                $.fxPost("/Web_BaseMenuSvc.data?action=GetUserMenu", {}, function (ret) {

                    MenuList = ret.dataList;
                    //找出系统菜单节点MenuId
                    for (var i = 0; i < MenuList.length; i++) {
                        if (MenuList[i].PMenuId == 0) {
                            objectMenuId = MenuList[i].MenuId;
                            break;
                        }
                    }

                    //添加第一级菜单
                    for (var i = 0; i < MenuList.length; i++) {
                        if (MenuList[i].PMenuId == objectMenuId) {
                            if (MenuList[i].htmlId == "sy")
                                syMenuID = MenuList[i].MenuId;
                            var content = "";
                            content += "<li><a id = " + MenuList[i].MenuId;
                            content += MenuList[i].UrlName == null ? "" : " href='" + MenuList[i].UrlName + "'";
                            content += ">" + MenuList[i].name + "</a></li>";
                            $(".menu-list").append(content);
                        }
                    }

                    //添加第二级菜单
                    $(".menu-list").find('a').each(function () {
                        $(this).click(function () {
                            $(".menu-list").find('a').removeClass("menu-li-active");
                            $(this).addClass("menu-li-active");
                            $(".menu-list").find('a').css("background-color", "");
                            $(this).css("background-color", "white");
                            $(".menuList").empty();
                            for (var i = 0; i < MenuList.length; i++) {
                                if (MenuList[i].PMenuId == this.id && this.id != syMenuID) {
                                    var content = "";
                                    content += "<li><a id = " + MenuList[i].MenuId;
                                    content += MenuList[i].UrlName == null ? "" : " href='" + MenuList[i].UrlName + "'";
                                    content += ">" + MenuList[i].name + "</a></li>";
                                    $(".menuList").append(content);
                                    bShow = true;
                                }
                            }
                            $("#menuList").css("left", this.offsetLeft + 30);
                            $("#menuList").show();
                            $("#div-xxwh").hide();
                        })

                        $(this).mouseover(function () {
                            if (!$(this).hasClass("menu-li-active")) {
                                $(this).css("background-color", "RGBA(255,255,255,0.6)");
                                $(this).css("border-bottom", "1px solid RGBA(255,255,255,0.6)");
                            }
                        });

                        $(this).mouseout(function () {
                            if (!$(this).hasClass("menu-li-active")) {
                                $(this).css("background-color", "");
                                $(this).css("border-bottom", "");
                            }
                        });
                    })

                    if ($("#iwf-main").length > 0) {
                        $.iwf.getModel('fx/ui/mainMini', function (model) {
                            model.init($("#iwf-main"));
                            $.iwf.main = model;

                            $.iwf.main.show({ module: "main", model: "nnepb/webDecl/Web_index", params: {} });
                            //$.iwf.curModel = $.iwf.main;
                            //$.iwf.oldhash.model = "nnepb/webDecl/Web_index";
                            //$.iwf.oldhash.models = "fff";
                            //$.iwf.oldhash.params = "title:\"首页\"";
                            //var stateObject = {};
                            //var title = "首页";
                            //var newUrl = window.location.origin + "/page.html#fff.nnepb/webDecl/Web_index:{title:\"首页\"}";
                            //history.pushState(stateObject, title, newUrl);

                            window.onresize = $.iwf.main.resize;
                        })
                    }

                    $(".menu-list a:first").addClass("menu-li-active");

                    //修改企业信息
                    $("#login-userinfo").click(function () {
                        bShow = true;
                        $("#menuList").hide();
                        $("#div-xxwh").show();
                    })

                    $(".cdlb a").click(function () {
                        $("#menuList").hide();
                    })

                    $(".maincontainer").click(function () {
                        if (!bShow) {
                            $("#menuList").hide();
                        }
                        bShow = false;
                    })
                })
            });
        });

    });
});