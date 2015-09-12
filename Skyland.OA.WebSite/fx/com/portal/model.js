
define(function (resetPWD) {
    return new function () {

        this.options = { key: 'portalmodel',title:'门户' };

        var portal;
        var commonPortalconfig; //原始设置，从服务器获取的
        var columnsSetting;

        var divroot;

        function saveconfig(config) {
            var setting = [];
            $.each(config, function (i, item) {

                setting.push({ id: item.id, column: item.column });

            });

            $.each(commonPortalconfig.porlet, function (i, item) {
                var icolumn = -1;
                $.each(setting, function (j, item2) {
                    if (item2.id == item.id) {
                        icolumn = item2.column;
                    }
                });
                if (icolumn == -1) {
                    setting.push({ id: item.id, column: -1 });
                }
            });


            var uisetting = JSON.stringify(setting);

            $.Com.setCookies('portalusersetting', uisetting);


        }

        var portalConfig = {
            template: '<div style="width:70%"></div><div style="width:30%"></div>',
            buttonClick: function (sender, content) {
                //自定义标题按键单击事件
                alert('自定义按键事件');
            },
            onRemove: function (json) {
                //拖放结束后事件
                saveconfig(json);
            },
            onDrop: function (json) {
                //拖放结束后事件
                // alert();
                // var s = JSON.stringify({ columns: columnsSetting, porlet: json })
                saveconfig(json);

                //$.post("org.data?action=updatePortalConfig", { config: s }, function (res) {
                //    try {
                //        var data = eval("(" + res + ")");
                //    }
                //    catch (err) {
                //        alert("未知错误:" + res + ",请联系管理员！");
                //        return;
                //    }

                //    if (data.success == false) {
                //        alert(data.msg);
                //    }

                //});
            }
        };

        //this.openHideItem = function () {

        //    var portalusersetting = undefined;
        //    try {
        //        var uijsonstring = $.Com.getCookies('portalusersetting');
        //        portalusersetting = eval('(' + uijsonstring + ')');
        //    } catch (e)
        //    { }

        //    var items = {
        //        data: [{ id: 0, text: '', type: 'group', css: 'gridmodel-bar', handler: function () { return; }, unselectable: true, children: [] }],
        //        flowlayout: 222,
        //        expandable: false,
        //        expandbyClick: false,
        //        itemclick: function (node, element) {
        //            //个性化设置界面json
        //            if (portalusersetting) {
        //                $.each(portalusersetting, function (i, item) {
        //                    if (item.id == node.id) {
        //                        if (item.column < 0) {
        //                            item.column = 0;
        //                            element.prepend("<i class='fa fa-check-square-o fa-lg' style='margin-right:5px'></i>");

        //                        }
        //                        else {
        //                            item.column = -1;
        //                            element.children().remove("i");
        //                        }
        //                    }
        //                });
        //            }
        //            // newMenu.hide();
        //        }
        //    };

        //    if (portalusersetting) {
        //        $.each(portalusersetting, function (i, item) {
        //            if (item.column == -1) {
        //                $.each(commonPortalconfig.porlet, function (j, item2) {
        //                    if (item.id == item2.id) {
        //                        var node = { id: item2.id, text: item2.title };
        //                        // if (itm.icon) item.iconCls = item.icon;, css: 'gridmodel-new-item'
        //                        items.data[0].children.push(node)
        //                        //   return false;
        //                    }
        //                });
        //            }
        //        });
        //    }

        //    if (items.data[0].children.length > 0) {
        //        //  newMenu = divroot.children('.iwf-toolbar').find(".btn-circle").DropdownMenu({ content: usermenu });

        //        var win = $('body').iwfWindow({
        //            title: '显示隐藏门户功能',
        //            width: 500,
        //            height: 500,
        //            button: [{
        //                text: '确定', css: 'btn btn-primary', handler: function (data) {


        //                    var uisetting = JSON.stringify(portalusersetting);

        //                    $.Com.setCookies('portalusersetting', uisetting);

        //                    $.Com.showMsg("保存成功，请刷新页面！");

        //                    //  var con = getportalconfig(commonPortalconfig.porlet)

        //                    // portal.loadJSON(con);

        //                    win.close();

        //                }
        //            }, {
        //                text: '恢复默认设置', handler: function () {
        //                    $.Com.delCookies('portalusersetting');
        //                    $.Com.showMsg("保存成功，请刷新页面！");
        //                    win.close();
        //                }
        //            }, {
        //                text: '取消', handler: function () { win.close(); }
        //            }]
        //        });
        //        var usermenu = $("<div style='width:450px;height:300px;'></div>").appendTo(win.content()).listView2(items);


        //    }
        //    else
        //        $.Com.showMsg("无隐藏门户功能！");
        //};

        this.show = function (module, root) {
            divroot = root;
            if (root.children().length == 0) {

                //var tools = [{ title: '设置全部', iconCls: 'fa fa-tasks', type: 'circle', "float": 'right', handler: openHideItem }];

                //root.append('<div style="margin:0px"></div>').children().last().iwfToolbar({ data: tools });
                var portalConfigfile = appConfig.curUISetting.portalConfig;
                if (portalConfigfile == undefined || portalConfigfile == "") portalConfigfile = "PortalConfig.json";

                $.post("UIMakeUp.data?action=GetportalUIConfig", { ttt: Math.random(), uimode: portalConfigfile, isDebug: appConfig.isDebug }, function (s) {
                    json = eval('(' + s + ')');
                    commonPortalconfig = eval('(' + s + ')');
                    if (json.success == false) {
                        $.Com.showMsg("加载门户失败！");
                    } else {
                        json.porlet = getportalconfig(json.porlet);

                        //如果没有设置列，自动为一列；
                        if (!(json.columns) || !(json.columns.length) || json.columns.length == 0) json.columns = [{ width: '100%' }];

                        columnsSetting = json.columns;
                        var porttalcolumns = "";

                        $.each(json.columns, function (index, item) {
                            porttalcolumns += ' <div style="width:' + item.width + '"></div>';
                        });

                        portalConfig.template = porttalcolumns;

                        var content = $('<div></div>').appendTo(root);

                        $.iwf.getModel('fx/com/portal/control', function (model) {

                            model.show(portalConfig,content);

                            model.loadJSON(json.porlet);
                        })
                        //portal = content.iwfPortal(portalConfig);

                        //portal.loadJSON(json.porlet);
                    }
                });
            }


        }

        function getportalconfig(portalconfig) {
            var newconfig = [];
            var portalusersetting = undefined;
            try {
                var uijsonstring = $.Com.getCookies('portalusersetting');
                portalusersetting = eval('(' + uijsonstring + ')');
            } catch (e)
            { }
            //个性化设置界面json
            if (portalusersetting) {
                $.each(portalusersetting, function (i, item) {
                    var curnode = undefined;
                    $.each(portalconfig, function (j, node) {
                        if (node.id == item.id) {
                            node.column = item.column + 8;
                            newconfig.push(node);
                        }
                    });
                });



                $.each(portalconfig, function (i, item) {
                    if (item.column < 6) {
                        newconfig.push(item);
                    }
                });

                var newconfig2 = [];
                $.each(newconfig, function (i, item) {
                    item.column = item.column - 8;
                    if (item.column >= 0) {
                        newconfig2.push(item);
                    }
                });

                return newconfig2;
            } else
                return portalconfig;
        }

    }
});
