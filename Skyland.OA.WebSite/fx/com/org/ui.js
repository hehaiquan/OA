
define(function (resetPWD) {
    return new function () {


        this.options = { key: 'userUISet' };

        var selItem;
        var content;

        var jsonTree = {
            flowlayout: 200,
            data: [],
            itemclick: function (item) {
                //alert("click; " +  item.id);
                selItem = item;
            }
        };

        function getuiconfig(uinav) {


            //Json.data;
            var uiusersetting = undefined;
            try {
                var uijsonstring = $.Com.getCookies('uiusersetting');
                uiusersetting = eval('(' + uijsonstring + ')');
            } catch (e)
            { }
            //个性化设置界面json
            if (uiusersetting) {
                for (var key in uiusersetting) {
                    $.each(uinav, function (index, item) {
                        if (item.children && item.children.length > 0) {
                            $.each(item.children, function (index2, item2) {
                                if (item2.text == key) {
                                    item2.text = key + ":" + uiusersetting[key];
                                }
                            });
                        }
                    });
                };
            }

            return uinav
        }

        function saveuiconfig() {
            var uisetting = '{';
            $.each(jsonTree.data, function (index, item) {
                if (item.children && item.children.length > 0) {
                    $.each(item.children, function (index2, item2) {
                        if (item2.text.indexOf(":") > 0) {
                            uisetting += "'" + item2.text.replace(":", "':'") + "',";
                        }
                    });
                }
            });

            uisetting = uisetting.substr(0, uisetting.length - 1) + '}';
            $.Com.setCookies('uiusersetting', uisetting);

            alert("保存成功！");
        }

        function setNew() {
            if (selItem.text.indexOf(":") > 0) {
                selItem.text = selItem.text.substr(0, selItem.text.indexOf(":"));
            }
            else {
                selItem.text = selItem.text + ": 默认打开";
            }
            content.empty();
            var tree = content.listView2(jsonTree);
            tree.setSelectedbyID(selItem.id);
        }

        function setInex() {
            if (selItem.text.indexOf(":") > 0) {
                selItem.text = selItem.text.substr(0, selItem.text.indexOf(":"));
            }
            else {
                selItem.text = selItem.text + ": 加入首页";
            }
            content.empty();
            var tree = content.listView2(jsonTree);
            tree.setSelectedbyID(selItem.id);

        }

        this.show = function (module, root) {
            if (root.children().length == 0) {
                var tools = [
                    { title: '保存', text: '保存', iconCls: 'fa fa-save', handler: saveuiconfig, css: 'btn-primary' },
                    { type: 'split' },
                    {
                        title: '恢复默认设置', text: '恢复默认设置', handler: function () {
                            $.Com.delCookies('uiusersetting');
                            $.Com.showMsg("已恢复默认界面设置，请刷新页面！");

                        }
                    },
                    { type: 'split' },
                    { title: '默认打开', text: '默认打开', iconCls: 'fa fa-file', handler: setNew },
                     //{ type: 'split' },
                    {
                        title: '添加到首页菜单', text: '首页菜单', handler: setInex
                    }
                ];
                var tools = root.append('<div style="margin:0px 0px 10px 0px"></div>').children().last().iwfToolbar({ data: tools });
                content = root.append('<div style="margin:30px"></div>').children().last();

                var uiConfig = appConfig.curUISetting.uiConfig;
                if (uiConfig == undefined || uiConfig == "") uiConfig = "AdminUIConfig.json";

                $.fxPost("UIMakeUp.data?action=GetframeUIConfig", { ttt: Math.random(), uimode: uiConfig }, function (data) {
                    //var Json;
                    //try {
                    //    Json = eval('(' + res + ')');
                    //} catch (e) {
                    //    $.iwf.logout();
                    //}
                    //if (Json.success == false) {
                    //    alert("界面配置文件加载失败，请联系管理员！" + Json.msg);
                    //} else {
                    //根据cookie设置界面
                    data = getuiconfig(data);

                    $.each(data, function (index, item) {
                        item.id = "id" + index;
                        item.type = 'group';
                        if (item.children && item.children.length > 0) {
                            item.css = "list-group-item treeview-bar";
                            item.unselectable = true;
                            $.each(item.children, function (index2, item2) {
                                item2.id = "id" + index + "-" + index2;
                                if (item2.children && item2.children.length > 0) {
                                    item2.css = "list-group-item treeview-bar";
                                    item2.unselectable = true;

                                    $.each(item2.children, function (index3, item3) {
                                        item3.id = "id" + index + "-" + index2 + "-" + index3;
                                        item3.css = "treeview-item btn btn-default";
                                    });
                                } else
                                    item2.css = "treeview-item btn btn-default";

                            });
                        }
                    });
                    jsonTree.data = data;
                    //jsonTree.css = {
                    //    item:"btn"
                    //};
                    content.listView2(jsonTree);

                    //}
                });
            }

        }

    }
});
