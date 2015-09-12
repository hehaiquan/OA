// 用户界面风格设置 lyq

define(function (resetPWD) {
    return new function () {


        this.options = { key: 'usertheme' };
        var root;

        function callback() {


            if (appConfig.themes.PCLayout.length > 0) {
                var ctn2 = $("<div class='panel panel-default'><div  class='panel-heading'>界面主题</div><div class='panel-body'></div></div>").appendTo(root.find("[data-id='container']"));
                root.find("[data-id='inline2']").tmpl(appConfig.themes.PCLayout).appendTo(ctn2.children(".panel-body"));
            }




            $('.iwf-theme-image').bind("mousemove", function () {
                divmove(this)
            });

            $('.iwf-theme-image').bind("mouseout", function () {
                divout(this)
            });

            $('.iwf-theme-image').bind("click", function () {
                aClick(this)
            });


        }

        function divmove(obj) {
            $(obj).css("border", '3px solid #1291A9');
            $(obj).parent().siblings().children("img").css("border", '3px solid white');

            root.find("[data-id='popmenu']").text("");
            root.find("[data-id='popmenu']").append("<img src='" + $(obj).attr("src") + "' class='iwf-theme-largeimage'/>");

            var menu = root.find("[data-id='popmenu']")[0];
            e = event ? event : window.event;

            menu.style.left = getPointerX(e) > 400 ? getPointerX(e) - 400 : getPointerX(e) + "px";
            menu.style.top = getPointerY(e) + 8 + "px";
            menu.style.display = "block";
        }
        function divout(obj) {
            root.find("[data-id='popmenu']").text("");
        }

        function getPointerX(event) {
            return event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
        }
        function getPointerY(event) {
            return event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
        }


        function aClick(obj) {
            var uisetting = $(obj).parent().find('input[name=uisetting]').val();

            var exdate = new Date();
            exdate.setDate(exdate.getDate() + 120);

            document.cookie = "uisetting=" + uisetting + ";expires=" + exdate.toGMTString();


            $.Com.showMsg("样式设置成功，请刷新，或在您下次登录时应用！");
        }

        this.show = function (module, r) {
            root = r;
            if (root.children().length == 0) {
                root.load("fx/com/org/userTheme.html", callback);
            }
        }
    }
});