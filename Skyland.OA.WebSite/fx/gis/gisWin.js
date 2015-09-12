define(function () {
    var W = {
        $toggle: null,//显示/隐藏列表按钮
        $container: null,//窗口容器
        toggleBtn: new function () {
            var beshow = false;
            var beOpen = true;
            this.show = function () {
                W.$toggle.show();
                beshow = true;
            };
            this.open = function () {
                W.$toggle.show();
                if (beOpen) return;
                W.$toggle.addClass("winToggleShow");
                W.$toggle.children().removeClass("fa-rotate-180");
                beOpen = true;
            };
            this.close = function () {
                W.$toggle.show();
                if (!beOpen) return;
                W.$toggle.removeClass("winToggleShow");
                W.$toggle.children().addClass("fa-rotate-180");
                beOpen = false;
            }
            this.hide = function () {
                W.$toggle.hide();
                beshow = false;
            }
            this.toggle = function () {
                if (beOpen)
                    this.close();
                else
                    this.open();
            }
        },
        init: function (root) {//初始化右侧窗口
            this.$toggle = root.find("[data-id='winToggle']");
            this.$container = root.find("[data-id='winContainer']");
            this.$container.css("max-height", (parseInt(root.css("height")) - 90) + "px");

            var self = this;
            this.$toggle.click(function () {
                self.$container.toggle();
                self.toggleBtn.toggle();
            });
        },
        wins: {},//创建的窗口所有对象

        get: function (id) {   //获取窗口（通过窗口ID获取）
            return this.wins[id];
        },
        //移除窗口
        remove: function (id) {
            this.$container.find("[itemid=" + id + "]").remove();
            delete this.wins[id];
            if (UIMode != "mouse") this.$container.hide();
        },
        //显示窗口
        show: function (id) {
            if (!this.$toggle.children().hasClass("fa-rotate-180")) {
                this.$container.find("[itemid=" + id + "]").show();
                this.$container.show();
            }
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
                var isClose = typeof this.closeCallback == 'function' ? this.closeCallback() : true;
                if (isClose || isClose == null) {
                    this.gisWin.remove(this.id);
                }
            };
            curWin.show = function () {
                this.gisWin.show(this.id);
            };
            curWin.hide = function () {
                this.gisWin.hide(this.id);
            };

            var itemTemplate = '<div class="win-item panel panel-default">'
                + '<div class="item-head panel-heading" style="border-bottom:none;"><span class="title">这里是标题</span>'
                + '<button type="button" class="item-close close" aria-hidden="true" title="关闭">&times;</button>'
                + '<button type="button" class="item-toggle close" title="展开/折叠" aria-hidden="true"><i class="fa fa-caret-down"></i></button></div>'
                + '<div class="item-content panel-body" style="padding:0px;"></div>'
                + '</div>';
            var $item = $(itemTemplate);
            $item.attr("itemid", curWin.id);
            $item.find(".title").text(curWin.title);
            if (winItem.options.iconCls) {
                $item.find(".title").html('<i class="' + winItem.options.iconCls + '"></i>' + curWin.title);
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

            $item.find('.item-close').bind('click', function () { W.get(curWin.id).close(); });

            //解决一个图标bug
            if (!this.$toggle.children().hasClass("fa-rotate-180")) {
                this.$container.show();
            }
            this.$container.append($item);
            this.wins[curWin.id] = curWin;
            return curWin;
        }
    }
    return W;
});
