define(function () {
    return new function () {

        var me = this, ModuleList = {};
        var root;
        var nav;


        function clickItem(id) {
            //查看历史记录
            var hash = $.iwf.getHashbyModule(id);
            if (hash == null) {
                var d = ModuleList[id];
                if (d == undefined)
                    me.firstSelect();
                else if (d.model == undefined) {
                    $.iwf.onmodulechange(d.url);
                }
                else
                    $.iwf.onmodulechange(d.module + "." + d.model + ":{" + d.params + "}");
            }
            else
                $.iwf.onmodulechange(hash.module + "." + hash.model + "");

            //if ($(".sysMenu").length > 0) {
            //    $.iwf.top.hideMenu();
            //}
        }

        function closeItem(id) {
            $.iwf.onmoduleclose(id); return true;
        }

        this.getCurModule = function () {
            return curModule;
        }

        this.firstSelect = function () {
            for (id in ModuleList) {
                var d = ModuleList[id];
                $.iwf.onmodulechange(d.module + "." + d.model + ":{" + d.params + "}");
                break;
            }
        }

        this.close = function (id) {
            var data = ModuleList[id];
            if (data) delete ModuleList[id];
            nav.close(id);
            if (nav.getSelectedID() == id) {
                do {
                    var hash = $.iwf.urlBack()
                    if (hash == undefined || hash.module == null) {
                        // me.firstSelect();
                        history.back();
                    }
                    else if (hash.module != id) {
                        $.iwf.onmodulechange(hash.module + "." + hash.model + ":{" + hash.params + "}");
                        break;
                    }
                } while (hash != null)
            }
        }

        this.add = function (moduleItem) {
            var tabModule = ModuleList[moduleItem.module];
            if (!tabModule) {
                tabModule = {
                    module: moduleItem.module,
                    model: moduleItem.model || "default", params: moduleItem.params,// || "id:0"被PB去掉了,因为有Bug
                    text: moduleItem.text || moduleItem.module,
                    title: moduleItem.text,
                    closable: (moduleItem.closable == undefined || moduleItem.closable),
                    id: moduleItem.module,
                    iconCls: moduleItem.iconCls,
                    click: clickItem,
                    close: closeItem
                };

                ModuleList[moduleItem.module] = tabModule;
                nav.add(tabModule);
                nav.setSelectedbyID(tabModule.id);
                return true;
            } else {
                if (moduleItem.text) {
                    tabModule.text = moduleItem.text;
                    //root.find("#" + tabModule.guid).children("span").text(moduleItem.text);
                }
                nav.setSelectedbyID(tabModule.id);
                if (moduleItem.model) tabModule.model = moduleItem.model;
                if (moduleItem.params) tabModule.params = moduleItem.params;
                return false;
            }

        }

        this.resize = function (size) {
            nav.resize();
        }


        this.init = function (r) {
            root = r;// $("#iwf-navigation");
            nav = root.Navigation();

            $.each($.iwf.userinfo.UINav, function (index, item) {
                var moduleItem;
                if (item.children[0].url == undefined || item.children[0].url == '') {
                    if (item.children[0].children && item.children[0].children[0].url) {
                        item.children[0].expand = true;
                        moduleItem = jQuery.iwf.gethash("#" + item.children[0].children[0].url);
                    } else
                        moduleItem = jQuery.iwf.gethash("#" + item.children[1].url);
                } else
                    moduleItem = jQuery.iwf.gethash("#" + item.children[0].url);
                var json = eval("({" + moduleItem.params + "})");

                //彭博修正
                if (item.children.length > 1) moduleItem.text = item.text || json.title;
                else moduleItem.text = json.title || item.text;


                moduleItem.title = moduleItem.text;
                moduleItem.closable = item.closable;
                if (item.iconCls != null) moduleItem.iconCls = item.iconCls;
                if (!item.hidden) me.add(moduleItem);
            });

        };


        this.show = function (moduleItem) {
            var json = eval("({" + moduleItem.params + "})");
            moduleItem.text = json.title;
            me.add(moduleItem);
            curModule = ModuleList[moduleItem.module];
        }


    }();
})