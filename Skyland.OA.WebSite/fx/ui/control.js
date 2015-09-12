//导航栏 //网格 //左右框架

define(function () {
    return new function () {
        $.fn.Navigation = function () {
            var root = $(this);
            var me = this;
            var selectid;

            var defaults = {
                css: {
                    list: 'nav nav-tabs',
                    item: 'list-item',
                    selected: 'active'
                },
                data: []
            }

            //if (root.width() < 350) {
            //    defaults.css = {
            //        list: 'nav nav-pills nav-stacked',
            //        item: 'list-item',
            //        selected: 'active'
            //    };
            //}

            if (root.children("ul").length > 0) {
                defaults.css.list = root.children("ul").attr('class');
                if (root.children("ul").children("li").length > 0) defaults.css.item = root.children("ul").children("li").attr('class');
            }

            root.empty();

            var items = [{ title: '', text: '', iconCls: '', closeable: '', css: '', unselectable: true, handler: null }];

            var ul = $('<ul  class="' + defaults.css.list + '" style="margin:0px;"></ul>').appendTo(root);
            //node:{ title: '', text: '', iconCls: '', closeable: '', css: '', unselectable: true, click: null }
            this.add = function (node) {
                var nodetext = node.text;
                if (node.text.length > 9) {
                    if (!node.title) node.title = node.text;
                    nodetext = node.text.substr(0, 8) + '...';
                }
                var ttt = (node.title) ? ' title="' + node.title + '" ' : '';

                var a = $('<li  data-id="' + node.id + '" class="' + defaults.css.item + '" unselectable="on" ' + ttt + '><a><p style="margin:0; display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"> ' + nodetext + '</p></a></li>').appendTo(ul);
                //手机模式
                if (root.width() < 350) {
                    a.css("width", "166");
                }

                if (window.ActiveXObject) a.children().first().css("float", "left");
                if (node.iconCls) $('<span class="' + node.iconCls + '"  style="margin: 5px 5px 0 0; float: left;"></span>').prependTo(a.children());



                a.bind('click', function (ev) {
                    if (node.click == undefined) return;
                    ev.preventDefault();

                    if (node.click(node.id) == false) return;
                    if (node.unselectable != true) me.setSelectedbyID(node.id);
                });

                if (node.closable == true) {
                    // a.children().css("padding-right", "25px")
                    var btnClose
                    if (root.width() < 350)
                        btnClose = $('<button  data-hind="' + node.id + '" class="close badge pull-right" aria-hidden="true">&times;</button >').appendTo(a.children());
                    else
                        btnClose = $('<button  data-hind="' + node.id + '"  class="badge  close" aria-hidden="true" style="float:right;margin-top:-2px;">&times;</button >').appendTo(a.children());

                    btnClose.bind('click', function (e) {

                        if (node.close(node.id) == false) return false;
                        root.find("[data-id='" + node.id + "']").remove();
                        return false;
                    });
                }
                $('<div class="clear:both" ></div>').appendTo(a);

                // me.resize();
            }

            this.close = function (id) {
                root.find("[data-id='" + id + "']").remove();
            }

            this.haveid = function (id) {
                return root.find("[data-id='" + id + "']").length > 0;
            }

            this.resize = function () {
                if (root.width() < 350)
                    ul.find("a").css("width", "170");
                else {
                    var tabwidth = (root.width()) / ul.children().length - 50;

                    if (tabwidth < 160 && tabwidth > 40)
                        ul.find("p").css("max-width", tabwidth + "px");
                    if (tabwidth <= 40) root.css("min-width", 95 * ul.children().length)
                }
                // ul.find("[href='#']").width(tabwidth);
            }

            this.setSelectedbyID = function (id) {
                root.find("[data-id]").removeClass(defaults.css.selected);
                var a = root.find("[data-id='" + id + "']");
                //if (root.width() < 350)
                //    a.addClass("btn btn-primary");
                //    else
                a.addClass(defaults.css.selected);
                //  a.css("border-bottom-color", a.css("border-top-color"));

                selectid = id;
            }

            this.getSelectedID = function () {
                return selectid;
            }
            //根据ID触发点击事件
            this.toggleClickByID = function (id) {


                root.find("[data-id='" + id + "']").click();
            }

            return this;



        };

        ////左右框架
        $.fn.splitContent = function () {

            var defaults = {
                css: {
                    left: 'iwf-frame-main-left',
                    main: 'iwf-frame-main-center'
                },
            }

            var root = $(this);
            var lid = "iwf-split-tree", cid = "iwf-split-content";

            var lpanel = root.children("[data-id='" + lid + "']");
            var rpanel = root.children("[data-id='" + cid + "']");

            if (lpanel.length == 0) {
                lpanel = $('<div data-id="' + lid + '" class="' + defaults.css.left + '"></div>').appendTo(root);
                rpanel = $('<div data-id="' + cid + '" class="' + defaults.css.main + '" style="overflow:auto;"></div>').appendTo(root);
            }

            this.leftPanel = function () {
                return lpanel;
            }

            this.rightPanel = function () {
                return rpanel;
            }

            return this;
        }


        //网格
        $.fn.iwfGrid = function (options) {

            // var uimodelcss = 'iwf-grid';
            //if (UIMode == "touch") uimodelcss = "iwf-grid-touch";

            var defaults = {
                css: {
                    //  root: uimodelcss,
                    row: 'iwf-grid-row',
                    rowSelected: 'iwf-gird-active',
                    rowSplit: 'treeview-bar'
                },
                data: [],
                fn: {},
                htmlUrl: '',
                rowclick: function (sender, data) { },
                linkclick: function (sender, data) { }
            }

            var opts = $.extend(defaults, options);

            var root = $(this);

            function rowClick() {
                var old = root.find("." + opts.css.rowSelected);
                old.removeClass(opts.css.rowSelected);
                old.find("input").attr({ "checked": false });

                $(this).addClass(opts.css.rowSelected);
                $(this).find("input").attr({ "checked": true });
                opts.rowclick(this, $(this).data().tmplItem.data);
            }

            function linkClick() {
                opts.linkclick(this, $(this).parentsUntil("." + opts.css.row).last().parent().data().tmplItem.data);
            }

            var tb, head, body, splitTpl, dataTpl;

            function callback() {
                tb = root.find(".iwf-grid");
                head = tb.children(".iwf-grid-head");
                body = tb.children(".iwf-grid-body");

                //取得分隔行
                splitTpl = body.children("." + opts.css.rowSplit).clone();
                if (splitTpl.length > 0) splitTpl = splitTpl.wrap("<div></div>").parent();

                //取得数据行
                dataTpl = body.children("." + opts.css.row).clone();
                if (dataTpl.length > 0) dataTpl = dataTpl.wrap("<div></div>").parent();

                bindData(opts.data);
            }

            function bindData(data) {
                body.children().remove();
                if (data.length > 0 && data[0].children) {
                    $.each(data, function (i, group) {
                        //添加分隔行
                        if (group != undefined) {
                            if (splitTpl.length > 0) {
                                var splitDiv = splitTpl.tmpl(group);
                                splitDiv.appendTo(body);
                                splitDiv.bind("click", function () {
                                    $(this).next("div").toggle(100);
                                    $(this).find("i").toggleClass('fa-rotate-270');
                                })
                                var groupDiv = $("<div></div>").appendTo(body);
                                dataTpl.tmpl(group.children, opts.fn).appendTo(groupDiv);//添加数据行
                            } else
                                dataTpl.tmpl(group.children, opts.fn).appendTo(body);//添加数据行
                        }
                    });
                } else {
                    dataTpl.tmpl(data, opts.fn).appendTo(body);
                }
                //绑定事件
                body.find("." + opts.css.row).bind('click', rowClick);
                //绑定链接事件
                body.find("." + opts.css.row).find("a").bind('click', linkClick);

            }

            this.refresh = function (data) {
                bindData(data);
            }

            if (opts.htmlUrl == undefined || opts.htmlUrl == "")
                callback();
            else
                root.load(opts.htmlUrl, callback);

            return this;
        }
    }
});