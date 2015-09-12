define(function () {
    return new function () {
        var root;

        this.height = function () {
            if (root.is(":hidden")) return 0;
            return root.height();
        }

        this.resize = function (size) {

        }

        this.init = function (r) {
            root = r;
            if ($("#login-userinfo").length > 0) {
                $("#login-userinfo").attr("href", "javascript:void(0);");
                $.iwf.getModel('fx/ui/usermenu', function (model) {
                    model.show($("#login-userinfo"));
                })
            }

            $("#iwf-closeModuleBtn").bind("click", function () {
                //$.iwf.onmoduleclose(jQuery.iwf.nav.getCurModule().module);
                //$.iwf.urlBack();
                history.back();
            });
            var w = (window.screen.width < 650) ? window.screen.width - 200 : 350;

            $("#iwf-frame-top-title").width(w);
            //todo
            $.iwf.hideHead = function () {
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
            };

        }


        this.show = function (module) {
            //显示主菜单还是返回！！
            var beclosed = true;
            if ($.iwf.userinfo.UINav) {
                $.each($.iwf.userinfo.UINav, function (i, item) {
                    if (item.module == module.module) { beclosed = false; return false; }
                })
            }

            if (beclosed) {
                $("#iwf-startMenu").hide();
                $("#iwf-closeModuleBtn").show()
            } else {
                $("#iwf-startMenu").show();
                $("#iwf-closeModuleBtn").hide();
            }


            if ($("#iwf-frame-top-title").length == 0) return;

            var json = eval("({" + module.params + "})");
            var tit
            if (json.title)
                tit = json.title;
            else if ($.iwf.curModel && $.iwf.curModel.options && $.iwf.curModel.options.title)
                tit = $.iwf.curModel.options.title;
            else
                tit = module.model;

            $("#iwf-frame-top-title").empty();
            $("#iwf-frame-top-title").text(tit);

        };


    }();

})