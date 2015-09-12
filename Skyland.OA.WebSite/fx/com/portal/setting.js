
define(function () {
    return new function () {
        this.options = { key: 'portalSetting' };
        var root;

        this.show = function (module, r) {
            root = r;

            var portalConfigfile = appConfig.curUISetting.portalConfig;
            if (portalConfigfile == undefined || portalConfigfile == "") portalConfigfile = "PortalConfig.json";


            $.post("UIMakeUp.data?action=GetportalUIConfig", { ttt: Math.random(), uimode: portalConfigfile, isDebug: appConfig.isDebug }, function (s) {
                commonPortalconfig = eval('(' + s + ')');

                toolDiv = $('<div data-id="toolbar" class="pageTitle iwf-toolbar"> </div>').appendTo(root);
                treeRoot = root.append('<div style="height:100%;"></div>').children().last();


                var portalusersetting = undefined;
                try {
                    var uijsonstring = $.Com.getCookies('portalusersetting');
                    portalusersetting = eval('(' + uijsonstring + ')');
                } catch (e)
                { }

                var items = {
                    data: [{ id: 0, text: '', type: 'group', css: 'gridmodel-bar', handler: function () { return; }, unselectable: true, children: [] }],
                    flowlayout: 222,
                    expandable: false,
                    expandbyClick: false,
                    itemclick: function (node, element) {
                        //个性化设置界面json
                        if (portalusersetting) {
                            $.each(portalusersetting, function (i, item) {
                                if (item.id == node.id) {
                                    if (item.column < 0) {
                                        item.column = 0;
                                        element.prepend("<i class='fa fa-check-square-o fa-lg' style='margin-right:5px'></i>");

                                    }
                                    else {
                                        item.column = -1;
                                        element.children().remove("i");
                                    }
                                }
                            });
                        }
                        // newMenu.hide();
                    }
                };

                if (portalusersetting) {
                    $.each(portalusersetting, function (i, item) {
                        if (item.column == -1) {
                            $.each(commonPortalconfig.porlet, function (j, item2) {
                                if (item.id == item2.id) {
                                    var node = { id: item2.id, text: item2.title };
                                    // if (itm.icon) item.iconCls = item.icon;, css: 'gridmodel-new-item'
                                    items.data[0].children.push(node)
                                    //   return false;
                                }
                            });
                        }
                    });
                }

                if (items.data[0].children.length > 0) {

                    var toolData = [
                        {
                            title: '保存', text: '保存', iconCls: 'fa fa-retweet', handler: function (data) {
                                var uisetting = JSON.stringify(portalusersetting);
                                $.Com.setCookies('portalusersetting', uisetting);
                                $.Com.showMsg("保存成功，请刷新页面！");
                            }
                        },
                        { type: 'split' },
                        {
                            title: '恢复默认设置', text: '恢复默认设置', iconCls: 'fa fa-undo', handler: function (data) {
                                $.Com.delCookies('portalusersetting');
                                $.Com.showMsg("保存成功，请刷新页面！");
                            }
                        },
                    ];

                    toolDiv.iwfToolbar({ data: toolData });



                    treeRoot.listView2(items);


                }
                else
                    $.Com.showMsg("无隐藏门户功能！");
            });
        }
    }
});
