define(function () {
    return new function () {
        var root;
        var me = this;

        var oldmoduleItemmodule = "";

        this.init = function (r) {
            root = r;

        }

        this.setSelectbyID = function (id, root) {
            root.find('a').removeClass('active');
            root.find('[data-id="' + id + '"]').addClass('active');
        }

        this.visible = function (beshow) {
            if (beshow == true) {
                root.show();
                root.css("visibility", "visible");

                //如果通过菜单调用导航
                if ($("#modelsMenuBtn").length == 0) $("#iwf-frame-main").css("margin-left", "200px");

            } else if (beshow == false) {
                root.hide();
                root.css("visibility", "hidden");
                $("#iwf-frame-main").css("margin-left", "0px")
            } else
                return root.css("visibility") == "visible";
        }

        function getNavItem(module) {
            for (var i = 0; i < $.iwf.userinfo.UINav.length; i++) {
                var temp = $.iwf.userinfo.UINav[i];
                if (temp.module == module) return temp.children;
            }
        }

        this.show = function (moduleItem) {
            //如果没有切换tab页就不需要操作
            if (oldmoduleItemmodule == moduleItem.module) return;
            oldmoduleItemmodule = moduleItem.module;

            if ($("#modelsMenuBtn").length > 0) root.parent().hide(); //手机版如果通过菜单调用导航

            var childNav = getNavItem(oldmoduleItemmodule);

            var IsVisibleLeft = function () {
                if (childNav == undefined) return false;//情况一
                if (childNav.length == 1 && (childNav[0].children ? childNav[0].children.length == 0 : true)) return false;//情况二
                return true;
            }();

            if (IsVisibleLeft == false) { me.visible(false); return; }
            me.visible(true);

            //显示已经创建的树
            root.children("div ").hide();
            //当前tab页的导航data-id
            var curModuleDataID = "module_" + oldmoduleItemmodule;
            var $div = root.children("[data-id='" + curModuleDataID + "']");
            if ($div.length > 0) {
                $div.show();
                if (moduleItem.model != '') $.iwf.left.setSelectbyID(moduleItem.model, $div);
                return;
            }

            $div = $("<div data-id='" + curModuleDataID + "'></div> ").appendTo(root);

            var leftTreeItems = {
                data: [],
                itemclick: function (item) {
                    if (item.url == undefined || item.url == null || item.url == '') return;
                    $.iwf.onmodulechange(item.url);
                }
            };

            var curModuleIdDoingCase = false;  //当前tab页是否有待办箱，需要单独处理

            function setLeftItem(NavItem, subTreeItem) {
                $.each(NavItem, function (index, item) {
                    if (item.text == '-') {
                        subTreeItem.push({ type: 'split' });
                    } else {
                        var modelKey = "";
                        if (new RegExp("([^\.]*)\.([^\{]+)\:\{([^\{]*)\}", "i").test(item.url)) modelKey = RegExp.$2;

                        var node = { "title": item.text, "text": item.text, "iconCls": item.iconCls, "id": modelKey, "url": item.url };
                        //如果是待办箱
                        if (modelKey == "fx/com/wf/doingCase" && appConfig.doingCaseConfig != undefined) {
                            node.id = "fx/com/wf/doingCase";
                            node["type"] = "group";
                            node["children"] = new Array();
                            node["children"].push({ id: "", title: "", text: "", "url": "", select: false });
                            curModuleIdDoingCase = true;
                            if (moduleItem.model.indexOf("fx/com/wf/doingCase") < 0) $.iwf.getModel("fx/com/wf/doingCase", function (model) { $.iwf.searchDoingcase(); });
                        }

                        if (item.children && item.children.length > 0) {
                            node["type"] = "group";

                            if (item.url == undefined || item.url == null || item.url == '') {
                                node.css = "list-group-item folder"
                                node.expandbyClick = true;
                                node.unselectable = true;
                            }
                            if (item.expand != undefined) node.expand = item.expand;

                            node.children = [];
                            setLeftItem(item.children, node.children);
                        }
                        subTreeItem.push(node);
                    }
                });
            }
            setLeftItem(childNav, leftTreeItems.data);
            $div.listView2(leftTreeItems);
            $.iwf.left.setSelectbyID(moduleItem.model, $div);
        }

        this.resize = function (s) { };

        //设置收件箱子项
        this.initInbox = function (data, count) {
            if (appConfig.doingCaseConfig == undefined) return;
            if (appConfig.doingCaseConfig.length == 0) return;

            //处理不分组的情况
            var $li = root.find('[data-id="fx/com/wf/doingCase"]');
            var $ul = root.find('[data-ul="fx/com/wf/doingCase"]');
            if (count == 0 || data == undefined) {
                $li.children('div').remove();
                $ul.remove();
                return;
            }
            var $span;
            if ($li.children('span').length == 1)
                $span = $('<span>&nbsp;&nbsp;( <strong>' + count + '</strong> )<span>').appendTo($li);
            else {
                $span = $li.children('strong').last();
                $span.text(count);
            }

            $ul.empty();
            $.each(data, function (index, Ent) {
                var txt = '&nbsp;';
                if (Ent.count != undefined) txt += Ent.count;

                var $a = $('<a title="' + Ent.text + '" class="list-group-item" unselectable="on" data-id="' + Ent.id + '"><div style="width:120px;overflow:hidden;white-space: nowrap;text-overflow:ellipsis;float:left;">' + Ent.text + '</div>' + txt + '</a>').appendTo($ul);
                $a.bind("click", function () {
                    if (Ent.url == undefined || Ent.url == null || Ent.url == '') return;
                    $.iwf.left.setSelectbyID(Ent.id, $li.parent());
                    var module = $.iwf.gethash().module;
                    $.iwf.onmodulechange(module + '.' + Ent.url.replace('doingcase', Ent.id));
                })
            });

            //当刷新是设置正确的选中项
            var tt = $.iwf.gethash().model;
            if (tt) $.iwf.left.setSelectbyID(tt, $li.parent());

        }

    }();
})