define(function () {
    return new function () {

        var newMenu;

        var nodes = {
            data: [],
            flowlayout: 180,
            expandable: false,
            expandbyClick: false,
            itemclick: function (item) {
                $.iwf.onmodulechange(item.url);

                newMenu.hide();
            }
        };

        //备用菜单
        function addStartBtn() {
            var tabModule = {
                text: "开始",
                title: "新建业务或功能调用",
                closable: false,
                id: "startbtn",
                iconCls: 'fa fa-file'

            };

            nav.add(tabModule);

            var items = {
                data: [{ id: 0, text: '', type: 'group', css: 'gridmodel-bar', handler: function () { return; }, unselectable: true, children: [] }],
                flowlayout: 200,
                expandable: false,
                expandbyClick: false,
                itemclick: function (item) {
                    var param = { creater: $.iwf.userinfo.UserID, flowid: item.id, actid: "A001", caseid: "", title: "新建：" + item.text };
                    param.state = "doingcase";
                    var now = new Date();
                    $.iwf.onmodulechange(param.flowid + now.getMilliseconds() + "New.fx/com/wf/form:" + JSON.stringify(param));
                    newMenu.hide();
                }
            };
            var modelService = 'engine.data?action=getstartmodelkey';
            $.fxPost(modelService, { userid: $.iwf.userinfo.UserID }, function (json) {

                $.each(json, function (index, itm) {
                    var item = { id: itm.ID, text: itm.Name, css: 'gridmodel-new-item' };
                    if (itm.icon) item.iconCls = itm.icon;
                    items.data[0].children.push(item)
                });
                var usermenu = $("<div style='width:450px;height:400px;'></div>").appendTo(root).listView2(items);
                root.find("[data-id='startbtn']").children().addClass("btn btn-primary");
                newMenu = root.find("[data-id='startbtn']").children().DropdownMenu({ content: usermenu });


            });


        }


        this.show = function ($menu) {


            $.each($.iwf.userinfo.UINav, function (i, item) {

                //if (item.closable != true) return true;
                var newtype = { id: item.module, text: item.text, type: 'group', css: 'list-group-item  treeview-bar', handler: function () { return; }, unselectable: true, children: [] };

                $.each(item.children, function (j, itm) {


                    var node = { id: itm.key, text: itm.text, css: 'treeview-item btn btn-default panel-body', url: itm.url };
                    if (itm.iconCls)
                        node.iconCls = itm.iconCls;
                    else
                        node.iconCls = "fa fa-share-square-o fa-lg";
                    node.unselectable = true;
                    newtype.children.push(node)

                });
                if (newtype.children.length > 0) nodes.data.push(newtype);
            });
            var w = (window.screen.width < 640) ? window.screen.width-10 : 650;
            var h = (window.screen.height < 740) ? window.screen.height-55 : 800;

            var usermenu = $("<div style='width:" + w + "px;max-height:" + h + "px;overflow-y:auto'></div>").appendTo("body").listView2(nodes);
            newMenu = $menu.DropdownMenu({ content: usermenu });
        }
    }
});