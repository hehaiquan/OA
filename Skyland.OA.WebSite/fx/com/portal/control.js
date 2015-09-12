define(function (resetPWD) {
    return new function () {//Portal页
        //$.fn.iwfPortal = function (options) {
        var root;
        var opts;
        var me = this;
        var portalJson;
        var defaults = {
            css: {
                portal: 'iwf-portal',
                column: 'iwf-portal-column',
                portlet: 'panel panel-default',
                empty: 'iwf-portal-portlet-empty',
                move: 'iwf-portal-portlet-move',
                portletTitle: 'panel-heading',
                portletBody: 'panel-body'
            },
            template: '<div></div>',
            onDrop: function (columns) { },
            buttonClick: function (sender, content) { }
        }

        function checkPointInContent(x, y, left, top, width, height) {
            if (x > left && x < (left + width) && y > top && y < (top + height)) {
                return true;
            }
            return false;
        }

        var current = { portlet: null, width: 100, height: 100 };

        function titleMouseUp(e) {
            current.portlet.insertBefore(current.empty);
            current.portlet.show();
            current.empty.hide();
            current.tportlet.hide();
            if (opts.onDrop) opts.onDrop(getJson());
        }

        function getJson() {
            var itemJSONS = [];
            for (var i = 0; i < root.children("." + opts.css.column).length; i++) {
                var col = root.children("." + opts.css.column).eq(i);
                $.each(col.children(), function (index, item) {
                    var title = $(item).children('.' + opts.css.portletTitle);
                    var content = $(item).children('.' + opts.css.portletBody);

                    var ij = { id: content.attr('id'), column: i };
                    $.each(portalJson, function (i, item) {
                        if (ij.id == item.id) {
                            ij.title = item.title;
                            ij.closable = item.closable;
                            ij.fold = item.fold;
                            ij.model = item.model;
                            ij.params = item.params;
                        }
                    });
                    //if (title.has("a[key='remove']").length > 0) ij.closable = true;
                    //if (title.has("a[key='fold']").length > 0) ij.fold = true;
                    //ij.title = title.children("span").text() || title.text();
                    itemJSONS.push(ij);
                });
            }
            portalJson = itemJSONS;
            return itemJSONS;
        }

        function titleMouseDown(e) {

            current.portlet = e.data;
            current.width = current.portlet.width();
            current.height = current.portlet.height();

            if (!current.tportlet) {
                current.tportlet = $('<div class="' + opts.css.portlet + ' ' + opts.css.move + '"></div>').appendTo(root).hide();
                var tempTitle = $('<div class="' + opts.css.portletTitle + ' iwf-portal-heading"></div>').appendTo(current.tportlet);
                //tempTitle.bind('mouseup', titleMouseUp);
                current.tportlet.bind('mouseup', titleMouseUp);
                current.empty = $('<div class="' + opts.css.empty + '"></div>');
            }


            $(this).bind('mousemove', function (em) {
                current.empty.height(current.height - 2).show().insertBefore(current.portlet);
                current.portlet.hide();
                current.tportlet.show().css({ width: current.width, height: current.height, left: e.clientX - (current.width / 2), top: e.clientY - 20 });
                $(this).unbind('mousemove');
            }).bind('mouseup', function (eu) { $(this).unbind('mousemove'); });
        }

        function titleLinkClick(sender) {
            var key = $(this).attr('key');
            switch (key) {
                case 'remove':
                    sender.data.remove();
                    if (opts.onRemove) opts.onRemove(getJson());
                    break;
                case 'fold':
                    var content = sender.data.find(".content");
                    if (content.is(":hidden")) content.show();
                    else content.hide();
                    break;
                default:
                    opts.buttonClick(this, sender.data);
            }
        }
        //加载HTML模板
        this.add = function (html, index) {
            index = (index) ? index : 0;
            var item = $(html).appendTo(root.children().eq(index)).addClass(opts.css.portlet);
            var title = item.find("." + opts.css.portletTitle).bind('mousedown', item, titleMouseDown);
            title.find("a").bind('mousedown', item, titleLinkClick);
            title.bind('mouseover', function (em) {
                // title.addClass('iwf-portal-portlet .title a:hover');
                title.find("a").css("display", "block");
            });

            title.bind('mouseout', function (em) {
                // title.removeClass('iwf-portal-portlet .title a:hover');
                title.find("a").css("display", "none");
            });
        }

        //加载json
        this.loadJSON = function (json) {
            portalJson = json;
            $.each(portalJson, function (i, item) {
                var portlet = $('<div></div>').appendTo(root.children().eq(item.column || 0)).addClass(opts.css.portlet);
                if (item.title) {
                    var portletTitleCss = opts.css.portletTitle;
                    if (item.titleCss)
                        portletTitleCss = item.titleCss;
                    var title;
                    if (item.url) {
                         title = $('<div class="' + portletTitleCss + ' iwf-portal-heading"><a href="'+item.url+'">' + item.title + '</a></div>').appendTo(portlet);
                    } else {
                        title = $('<div class="' + portletTitleCss + ' iwf-portal-heading"><span>' + item.title + '</span></div>').appendTo(portlet);
                    }
                    title.bind('mousedown', portlet, titleMouseDown);
                    //title.bind('mouseover', function (em) {
                    //    //  title.addClass('iwf-portal-portlet .title a:hover');
                    //    title.find("a").css("display", "block");
                    //});

                    //title.bind('mouseout', function (em) {
                    //    //  title.removeClass('iwf-portal-portlet .title a:hover');
                    //    title.find("a").css("display", "none");
                    //});
                    if (item.closable) {
                        $('<button key="remove" href="javascript:void(0)"><i class="fa fa-times"></i></button>').appendTo(title).bind('mousedown', portlet, titleLinkClick);
                    }
                    if (item.fold) {
                        $('<button key="fold" href="javascript:void(0)"><i class="fa fa-minus"></i></button>').appendTo(title).bind('mousedown', portlet, titleLinkClick);
                    }
                }
                var content = $('<div id="' + item.id + '"></div>').appendTo(portlet).addClass(opts.css.portletBody);

                var model = $.iwf.getModel(item.model, function (model) {
                    model.show({ params: item.params }, content);
                });

            });
        }

        this.show = function (options, div) {

            opts = $.extend(defaults, options);
            root = $(div).addClass(opts.css.portal);

            root.bind('mousemove', function (e) {
                if (current.tportlet && current.tportlet.is(":visible")) {
                    current.tportlet.css({ left: e.clientX - (current.width / 2), top: e.clientY - 20 });
                    //是否在原来的位置上
                    if (checkPointInContent(e.clientX, e.clientY, current.empty.offset().left, current.empty.offset().top, current.empty.width(), current.empty.height())) {
                        return;
                    }
                    //是否在某个portlet上
                    var isIsert = false;
                    var cls = root.children("." + opts.css.column).children();
                    for (var i = 0; i < cls.length; i++) {
                        var item = $(cls[i]);
                        if (checkPointInContent(e.clientX, e.clientY, item.offset().left, item.offset().top, item.width(), item.height())) {
                            if (e.clientY > (item.offset().top + item.height() / 2)) {
                                current.empty.insertAfter(item);
                            } else {
                                current.empty.insertBefore(item);
                            }
                            isIsert = true;
                            break;
                        }
                    }
                    //插入空列
                    if (!isIsert) {
                        var columns = root.children("." + opts.css.column);
                        $.each(columns, function (i, column) {
                            if ($(column).children().length == 0) {
                                current.empty.appendTo($(column));
                            }
                        });
                        //current.empty.appendTo(column);
                    }
                }
            })

            root.append(opts.template).children().addClass(opts.css.column);
            $.each(root.children().children(), function (i, child) {
                var item = $(child).addClass(opts.css.portlet);
                var title = item.find("." + opts.css.portletTitle).bind('mousedown', item, titleMouseDown);
                title.find("a").bind('mousedown', item, titleLinkClick);
            });
        };



        return me;
    }
});