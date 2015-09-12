(function ($, undefined) {
    var JSFileName = "frameAutoinput";
    if ($.pb && $.pb[JSFileName]) return;
    var global = {
        identynum: 0,
        browser: function () {
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/(msie\s|trident.*rv:)([\w.]+)/)) { Sys.ie = ua.match(/(msie\s|trident.*rv:)([\w.]+)/)[2]; return Sys; }//是否为IE
            if (ua.match(/firefox\/([\d.]+)/)) { Sys.firefox = true; return Sys; }//是否为firefox
            if (ua.match(/chrome\/([\d.]+)/)) { Sys.chrome = true; return Sys; }//是否为chrome
            if (ua.match(/opera.([\d.]+)/)) { Sys.opera = true; return Sys; }//是否为opera
            if (ua.match(/version\/([\d.]+).*safari/)) { Sys.safari = true; return Sys; }//是否为safari
            return Sys;
        }(),
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核                
                presto: u.indexOf('Presto') > -1, //opera内核                
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核                
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核                
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端                
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端                
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器                
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器                
                iPad: u.indexOf('iPad') > -1, //是否iPad                
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部            
            };
        }(),
        _Curpath: (function (keyword, me) {
            var script = document.getElementsByTagName('script');
            var l = script.length;
            for (i = 0; i < l; i++) {
                me = !!document.querySelector ?
                    script[i].src : script[i].getAttribute('src', 4);

                if (me.substr(me.lastIndexOf('/')).indexOf(keyword) !== -1)
                    break;
            }
            return me.substr(0, me.lastIndexOf('/') + 1);
        })(JSFileName),
        CurrentDoc: document,
        QuoteJS: function (url) { document.write('<script src="' + url + '"></script>'); },
        QuoteCSS: function (url) { document.write('<link href="' + url + '" rel="stylesheet" />'); },
        GetMousePos: function (e) {
            var x, y;
            return {
                x: e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                y: e.clientY + document.body.scrollTop + document.documentElement.scrollTop
            };
        },
        NewUnique: function () {
            var me = this;
            var value = ++me.identynum;
            var str = "Unique" + value;
            return str;
        }
    };

    if (!$.widget) { alert("未引用jquery-ui的$.widget"); return; }
    if ($.pb && $.pb[JSFileName]) { alert(JSFileName + "已经引用"); return; }
    //预备引用样式集
    global.QuoteCSS(global._Curpath + "Autoinput.css");

    $.widget("pb.frameAutoinput", {
        options: {
            maxHeight: 100,
            mode: "default",
            isfilter: false,
            textArray: ["新建权限组", "编辑权限组", "删除权限组"]
        },
        _create: function () {
            var self = this;
            var o = this.options;
            var div = $('<div class="frameAutoinput" style="overflow-y:auto; position: absolute;background-color:#FFF;border: 1px solid #808080;z-index:100"></div>');
            div.css("max-height", o.maxHeight.toString() + "px").hide();
            self.element.parent().append(div);

            self.element.focus(function () {
                div.css({
                    left: self.element.position().left,
                    top: self.element.position().top + self.element.outerHeight(),
                    width: self.element.outerWidth()
                });
                div.show();
            });

            //按键弹起


            $(document).bind("mousedown", function (e) {
                if (e.target == div[0] || e.target == self.element[0] || $.contains(div[0], e.target)) { }
                else div.hide();
            });

            if (o.mode == "default") {
                var ul = $('<ul class="AutoinputMenu"></ul');
                $.each(o.textArray, function (index, ent) {
                    ul.append('<li>' + ent + '</li>');
                });
                div.append(ul);
                self.element.bind("keyup", function () {
                    var keyword = $.trim($(this).val());
                    if (keyword == "") ul.children().show();
                    else {
                        ul.children().hide();
                        ul.children("li:contains('" + keyword + "')").show();
                    }
                });
                ul.children("li").bind("mousedown", function () {
                    self.element.val($(this).text());
                    div.hide();
                    self._trigger("change", $(this), $(this).text());
                });
            }

        }
    });
})(jQuery);