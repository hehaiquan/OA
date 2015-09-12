//选择用户常用语的model，就是弹出窗口的内容

define(function () {
    return new function () {


        var selectCallback;
        var selectNodes = [];
        var root;
        var selectData = { userid: "", username: "" };

        var inputUserid;
        var inputUserName;
        //var opt ;//获取是否多选值
        var json;

        var items;

        var serviceurl = "/IWorkRoleManage.data?action=FindAllRoleGroup";

        function showTree() {
            root.empty();

            items.data = json.data;

            var usermenu = $("<div></div>").appendTo(root).listView2(items);
        }


        this.show = function (module, div) {

            root = div;

            if (root.children().length != 0) return;
            selectCallback = module.onClick;  //选择单位回调
            var opt = module.multi;

            //  div.css("height", "100%");
            $.fxPost(serviceurl, {}, function (result) {

                json = result;

                for (key in json.data) {
                    if (json.data[key].children) {
                        json.data[key].expand = true;
                        json.data[key].unselectable = true;
                        json.data[key].css = "list-group-item treeview-bar";

                    }
                }

                items = {
                    //data: json.data,
                    expandbyClick: true,  //是否点击父节点展开
                    expandable: true,
                    //css: {
                    //    item: "treeview-item btn btn-default"
                    //},
                    //expend: false,
                    itemclick: function (item, element) {
                        if (item.children.length > 0) return;
                        if (opt) {//如果是多选 
                            element.toggleClass('active');
                            if (!item.check) {
                                selectData.push(item);
                            }
                            else {
                                //删除
                                for (var i = 0; i < selectData.length; i++) {
                                    if (selectData[i].id == item.id) selectData.splice(i, 1);
                                }
                            }

                            if (selectCallback) selectCallback(selectData);

                        } else {//单选
                            selectData = item;
                            if (selectCallback) selectCallback(item);
                        }
                        item.check = !item.check;
                    }
                };


                showTree();

            });

        }

        this.refresh = function () {

            $.fxPost(serviceurl, {}, function (result) {

                json = result;

                for (key in json.data) {
                    if (json.data[key].children) {
                        json.data[key].expand = true;
                        json.data[key].unselectable = true;
                        json.data[key].css = "list-group-item treeview-bar";

                    }
                }
                showTree();
            });
        }

        this.set = function (data) {

            $.each(data, function (i, userid) {

                root.find("[data-id=" + userid + "]").addClass("active");
            })
        };




        this.get = function () {
            return selectData;
        };
    }

});
