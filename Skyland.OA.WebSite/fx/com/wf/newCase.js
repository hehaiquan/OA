//新建业务
define(function () {
    return new function () {
        var root;
        var self;


        function addNews(btn, gridRoot) {

            var items = {
                data: [],
                flowlayout: 200,
                expandable: false,
                expandbyClick: false,
                itemclick: function (item, el) {
                    newMenu.hide();
                    $(el).removeClass("active");
                    createCase(item.id);

                }
            };
            var modelService = 'engine.data?action=getstartmodelkey';

            $.fxPost(modelService, {}, function (data) {
                CreateMenu(data);
            });

            function CreateMenu(data) {

                if (appConfig.newCaseMenu) {
                    $.each(data, function (index, itm) {
                        $.each(appConfig.newCaseMenu, function (i, group) {
                            $.each(group.children, function (g, itemwf) {
                                if (itemwf.id == itm.ID) {
                                    itemwf.isIn = true;
                                    itm.isIn = true;
                                }
                            });
                        });
                    });
                    $.each(appConfig.newCaseMenu, function (i, group) {
                        var newm = group;
                        newm.children2 = [];
                        $.each(group.children, function (g, itemwf) {
                            if (itemwf.isIn) newm.children2.push(itemwf)
                        });
                        if (newm.children2.length > 0) {
                            newm.children = newm.children2
                            newm.children2 = null;
                            items.data.push(newm);
                        }
                    });

                    var newtype = { id: "notype", text: '&nbsp;', type: 'group', css: 'list-group-item  treeview-bar', handler: function () { return; }, unselectable: true, children: [] };

                    $.each(data, function (index, itm) {
                        if (itm.isIn == undefined) {

                            var item = { id: itm.ID, text: itm.Name, css: 'treeview-item btn btn-default panel-body' };
                            if (itm.icon)
                                item.iconCls = itm.icon;
                            else
                                item.iconCls = "fa fa-share-square-o fa-lg";
                            newtype.children.push(item)
                        }
                    });
                    if (newtype.children.length > 0) items.data.push(newtype);


                } else {
                    var newtype = { id: "notype", text: '&nbsp;', type: 'group', css: 'list-group-item  treeview-bar', handler: function () { return; }, unselectable: true, children: [] };

                    items.data.push(newtype);

                    $.each(data, function (index, itm) {
                        var item = { id: itm.ID, text: itm.Name, css: 'treeview-item btn btn-default panel-body', unselectable: true };
                        if (itm.icon)
                            item.iconCls = itm.icon;
                        else
                            item.iconCls = "fa fa-share-square-o fa-lg";
                        item.unselectable = true;

                        items.data[0].children.push(item)
                    });
                }
                var usermenu = $("<div style='width:450px;height:400px;'></div>").appendTo(gridRoot.parent()).listView2(items);
                newMenu = btn.DropdownMenu({ content: usermenu });
            }

        }

        function createCase(flowid, ExtraParams) {
            $.fxPost('engine.data?action=GetStartActModel', { "flowid": flowid }, function (obj) {
                obj.state = "doingcase";
                var params = $.extend({}, obj, ExtraParams);
                $.iwf.onmodulechange(obj.guid + ".fx/com/wf/form:" + JSON.stringify(params));
            });
        }

        this.show = function (btn, gridRoot) {

            addNews(btn, gridRoot);
        };



    }
})