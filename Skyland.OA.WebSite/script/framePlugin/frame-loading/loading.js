/* 插件类型：统一应用级别插件
 * 作者：彭博
 * 参考：//无
 * 最后更新时间：2013-06-27 17:50
 * 依赖：jquery，
 */
(function ($, undefined) {
    function getJSpath(Name) {
        var js = document.scripts;
        var jsPath;
        for (var i = js.length; i > 0; i--) {
            if (js[i - 1].src.indexOf(Name) > -1) {
                jsPath = js[i - 1].src.substring(0, js[i - 1].src.lastIndexOf("/") + 1);
            }
        }
        return jsPath;
    }

    var jsName = "frame-loading";
    var CssName = "loading.css";
    var ImgSrc = getJSpath(jsName) + "images/5-121204194103.gif";
    var CssPath = getJSpath(jsName) + CssName;
    document.write('<link href="' + CssPath + '" rel="stylesheet" />');
    $.fn.frameloading = function (flag) {
        var Overlay = this.Overlay = "";
        var LoadingLay = this.LoadingLay = "";
        var self = this;
        self.flag = flag;
        //开启效果
        this.open = function (text) {
            if (this.frameloadingflag) return;
            Overlay = $("<div></div>").addClass("Overlay").css("opacity", 0.2);
            var Width = $(self).outerWidth();
            var Height = $(self).outerHeight();
            var pos = $(self).offset();
            Overlay.outerWidth(Width);
            Overlay.outerHeight(Height);
            Overlay.css("margin-top", -Height + "px");
            var str = '<div class="InnerProgressBar"><table><tr><td><img src="' + ImgSrc + '" /></td></tr><tr><td><div>加载中</div></td></tr></table></div>';
            LoadingLay = $(str);
            LoadingLay.find("div").text(text);
            LoadingLay.css("margin-top", -Height + "px");
            $(self).after(Overlay);
            $(Overlay).after(LoadingLay);

            LoadingLay.css({
                top: Height / 2 - (LoadingLay.outerHeight()) / 2,
                left: Width / 2 - (LoadingLay.find("table").outerWidth()) / 2
            });
            if (self.flag == false) LoadingLay.hide();
            this.frameloadingflag = true;
        };

        //关闭效果
        this.close = function () {
            Overlay.remove();
            LoadingLay.remove();
            this.frameloadingflag = false;
        };

        return this;
    };
    $.frameloading = function (flag) {
        var Overlay = this.Overlay = "";
        var LoadingLay = this.LoadingLay = "";
        var self = this;
        var self = this;
        self.flag = flag;
        //开启效果
        this.open = function (value) {
            if (this.frameloadingflag) return;
            Overlay = $("<div></div>").addClass("bodyOverlay");
            Overlay.css("opacity", 0.2);
            $("body").append(Overlay);
            var Width = Overlay.outerWidth();
            var Height = Overlay.outerHeight();
            var pos = Overlay.offset();
            Overlay.outerWidth(Width);
            Overlay.outerHeight(Height);

            var str = '<div class="bodyInnerProgressBar"><table><tr><td><img src="' + ImgSrc + '" /></td></tr><tr><td><div>加载中</div></td></tr></table></div>';

            LoadingLay = $(str);
            $('body').append(LoadingLay);
            LoadingLay.css({
                top: Height / 2 - (LoadingLay.outerHeight()) / 2,
                left: Width / 2 - (LoadingLay.find("table").outerWidth()) / 2
            });
            if (value) LoadingLay.find("div").text(value);
            if (self.flag == false) LoadingLay.hide();
            this.frameloadingflag = true;
        };
        //关闭效果
        this.close = function () {
            Overlay.remove();
            LoadingLay.remove();
            this.frameloadingflag = false;
        };
        return this;
    };
})(jQuery);