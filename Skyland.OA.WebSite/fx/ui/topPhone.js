
//暂时不用
define(function () {
    return new function (root) {

        var me = $("#iwf-frame-top");
        var showNav = false;

        $("#closemoduleBtn").bind("click", function () {
            $.iwf.onmoduleclose(jQuery.iwf.nav.getCurModule().module);
        });

        // 手机界面
        if ($("#modelsMenuBtn").length > 0) {
            $("#modelsMenuBtn").parent().parent().DropdownMenu({ content: $("#iwf-frame-left") });
            $("#iwf-frame-left").parent().css("right", "10px").css("left", "100px")
        }

        if ($("#login-userinfo").length > 0) {
            $.iwf.getModel('fx/ui/usermenu', function (model) {
                model.show($("#login-userinfo"));
            })
        }

        //$.iwf.showUserMenu($("#login-userinfo"));


        if (appConfig.messageInterval && appConfig.messageInterval > 0) $.iwf.Message($("#iwf-message"));


        this.height = function () {
            if (me.is(":hidden")) return 0;
            return me.height();
        }

        this.resize = function (size) {
        }

        function getNavItem(module) {
            for (var i = 0; i < $.iwf.userinfo.UINav.length; i++) {
                var temp = $.iwf.userinfo.UINav[i];
                if (temp.module == module) return temp.children;
            }
        }

        function setTitleinPhone(text) {
            if ($("#TopTitle").length == 0) return;

            //if (text.length > 16) text = text.substr(0, 14) + "...";
            $("#TopTitle").empty();
            $("#TopTitle").append("<span> " + text + "</span>");
        }

        this.setTitle = function (text) {
            setTitleinPhone(text);
        }

        $("#TopTitle").width(window.innerWidth - 130);

        this.show = function (module) {

            var tit = jQuery.iwf.nav.getCurModule().text;
            if (tit) setTitleinPhone(tit);

            //if (UIMode == "touch") {
            //    if (jQuery.iwf.nav.getCurModule()) {



            if (jQuery.iwf.nav.getCurModule().closable != false)
                $("#closemoduleBtn").show();
            else
                $("#closemoduleBtn").hide();

            var childNav = getNavItem(module.module);


            var IsVisibleLeft;

            IsVisibleLeft = function () {
                if (childNav == undefined) return false;
                if (childNav.length == 1 && (childNav[0].children ? childNav[0].children.length == 0 : true)) return false;
                return true;
            }();


            if (IsVisibleLeft == true) {

                $("#modelsMenuBtn").show();
                $.iwf.left.visible(true);
            }
            else $("#modelsMenuBtn").hide();


        }

        $("#imgsysMenu").bind("click", function () {
            if (showNav) {
                hideMenu2();
            } else {
                showMenu2();

            }
            return false;
        });

        this.hideMenu = function () {
            hideMenu2();
        }

        function hideMenu2() {
            $("#frameworkContent").animate({ left: '-170px' });
            $(".sysMenu").animate({ left: '-170px' });
            $(".iwf-frame-top").animate({ left: '0px' });
            // $("#imgsysMenu").attr("class", "icon-arrow-left-2");
            showNav = false;
            $("#MainframeRight").unbind();
        }

        function showMenu2() {
            $("#frameworkContent").animate({ left: '0px' });
            $(".sysMenu").animate({ left: '0px' });
            $(".iwf-frame-top").animate({ left: '170px' });
            // $("#imgsysMenu").attr("class", "icon-arrow-right-2");
            showNav = true;
            $("#MainframeRight").bind("click", function () {
                hideMenu2();
            });
        }
    }();

})