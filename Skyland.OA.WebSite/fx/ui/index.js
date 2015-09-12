define(['fx/ui/control'], function () {
    return new function () {

        //根据分辨率及用户设置，获取界面配置项，包括样式及界面模板 设置appConfig.curUISetting
        //如果没有设置，或设置不适合当前分辨率，自动选择最合适的界面样式
        function getUIsetting() {
            var uiid = $.Com.getCookies("uisetting");
            if (uiid) {
                appConfig.curUISetting = appConfig.themes.PCLayout.Find(function (item) {
                    return item.id == uiid;
                });
            }
            var winWidth = window.screen.width;

            if (appConfig.curUISetting == undefined || appConfig.curUISetting.maxWidth < winWidth || appConfig.curUISetting.minWidth > winWidth) {

                appConfig.curUISetting = appConfig.themes.PCLayout.Find(function (item) {
                    return item.maxWidth >= winWidth && item.minWidth <= winWidth;
                });
            }

            var cssfile = appConfig.curUISetting.CssFile;
            if (!cssfile) cssfile = "v3/css/bootstrap.css";
            $.Com.addStyle("resources/" + cssfile);

            var uiConfig = appConfig.curUISetting.uiConfig;
            if (uiConfig == undefined || uiConfig == "") appConfig.curUISetting.uiConfig = "AdminUIConfig.json";

            UIMode = appConfig.curUISetting.uiMode;
        };

        this.show = function () {

            getUIsetting();

            var htmlfile = appConfig.curUISetting.TempFile;
            var uiConfig = appConfig.curUISetting.uiConfig;
            // if (!$.iwf.online) uiConfig = appConfig.offlineUINav;

            if (uiConfig == undefined || uiConfig == "") uiConfig = "AdminUIConfig.json";

            //初始化界面
            $("body").load(htmlfile, function () {

                $(".Apptitle").text(appConfig.appName);
                $.fxPost("UIMakeUp.data?action=GetframeUIConfig", { uimode: uiConfig, isDebug: appConfig.isDebug }, function (FinalNav) {
                    if (!FinalNav) { $.Com.confirm("界面配置获取失败，是否重新登录", $.iwf.logout); return; }

                    //根据cookie重新配置用户界面
                    function getuiconfig(uinav) {
                        var uiusersetting = undefined;
                        try {
                            var uijsonstring = $.Com.getCookies('uiusersetting');
                            uiusersetting = eval('(' + uijsonstring + ')');
                        } catch (e)
                        { }
                        //个性化设置界面json
                        if (uiusersetting) {
                            for (var key in uiusersetting) {
                                var curnode = undefined;
                                $.each(uinav, function (index, item) {
                                    if (item.children && item.children.length > 0) {
                                        $.each(item.children, function (index2, item2) {
                                            if (item2.text == key) {
                                                //item2.text = key + ":" + uiusersetting[key];
                                                curnode = item2;
                                                return false;

                                            }
                                        });
                                    }
                                    if (curnode != undefined) return false;
                                });
                                if (curnode != undefined) {
                                    if (uiusersetting[key] == " 默认打开") {
                                        var newnode = {
                                            module: 'Muser' + uinav.length, model: '', text: '', param: '', closable: false, children: [
                                               { url: 'Muser' + uinav.length + curnode.url, text: curnode.text }]
                                        };
                                        if (curnode.iconCls) newnode.iconCls = curnode.iconCls;
                                        uinav.push(newnode);
                                    }
                                    else if (uiusersetting[key] == " 加入首页") {
                                        var newnode = { url: curnode.url, text: curnode.text };
                                        if (curnode.iconCls) newnode.iconCls = curnode.iconCls;
                                        $.each(uinav, function (index, item) {
                                            if (index > 1) return false;
                                            if (item.children.length > 1) {
                                                item.children.push(newnode);
                                                return false;
                                            }
                                        });
                                    }

                                }
                            };
                        }

                        return uinav
                    }

                    //处理异步加载 main / left / nav
                    var haveInitcount = 0, needInitcount = 0;

                    function afterInit() {
                        haveInitcount++;
                        if (haveInitcount < needInitcount) return;
                        $.iwf.onresize();
                        $.iwf.onhashchange();
                    }

                    $.iwf.userinfo.UINav = getuiconfig(FinalNav);

                    //开始菜单
                    if ($("#iwf-startMenu").length > 0) {
                        $.iwf.getModel('fx/ui/startmenu', function (model) {
                            model.show($("#iwf-startMenu"));
                        })
                    }

                    //消息推送
                    if ($("#iwf-message").length > 0 && appConfig.messageInterval)
                        $.iwf.getModel('fx/ui/message', function (model) {
                            model.init($("#iwf-message"));
                            $.iwf.Message = model;
                        })

                    if ($("#iwf-navigation").length > 0) {
                        needInitcount++;
                        $.iwf.getModel('fx/ui/nav', function (model) {
                            model.init($("#iwf-navigation"));
                            $.iwf.nav = model;
                            afterInit();
                        })
                    }

                    //查询类
                    if ($("#navSearch").length > 0) {
                        $.iwf.search = new function () {
                            var me = $("#navSearch");
                            //me.iwfSearch().search(function(keyword)
                            //{
                            //    $.iwf.gethash().model.search({ "keyword": keyword });
                            //});
                            var keyword = "";
                            me.bind("keydown", function (event) {
                                if (event.keyCode == 13) {
                                    if (keyword != me.val()) {
                                        if ($.iwf.curModel && $.iwf.curModel.search) $.iwf.curModel.search({ "keyword": me.val() });
                                    }
                                    keyword = me.val();
                                }
                            });
                        }();
                    }

                    //框架头部
                    if ($("#iwf-frame-top").length > 0) {
                        needInitcount++;
                        $.iwf.getModel('fx/ui/top', function (model) {
                            model.init($("#iwf-frame-top"));
                            $.iwf.top = model;
                            afterInit();
                        })
                    }

                    //主框架
                    if ($("#iwf-frame-main").length > 0) {
                        needInitcount++;
                        $.iwf.getModel('fx/ui/main', function (model) {
                            model.init($("#iwf-frame-main"));
                            $.iwf.main = model;
                            afterInit();
                        })
                    }

                    //左边导航
                    if ($("#iwf-frame-left").length > 0) {
                        needInitcount++;
                        $.iwf.getModel('fx/ui/left', function (model) {
                            model.init($("#iwf-frame-left"));
                            $.iwf.left = model;
                            afterInit();
                        })
                    }

                    //主框架
                    if ($("#iwf-main").length > 0) {
                        needInitcount++;
                        $.iwf.getModel('fx/ui/mainMini', function (model) {
                            model.init($("#iwf-main"));
                            $.iwf.main = model;
                            afterInit();
                        })
                    }
                });
            });
        }
    }
})