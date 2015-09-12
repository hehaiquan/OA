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
            $.fxPost("/IWorkRoleManage.data?action=FindAllRoleGroup", {}, function (result) {

                json = result;

                for (key in json.data) {
                    if (json.data[key].children) {
                        json.data[key].expand = false;
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
                   // flowlayout:300,       //子节点的宽度
                    itemclick: function (item, element) {
                        if (item.children.length > 0) return;
                        if (opt) {//如果是多选 
                            if (!item.check) {

                                selectNodes.push({ id: item.id, name: item.name });
                            }
                            else {
                                element.children().remove("i");
                                //删除
                                for (var i = 0; i < selectNodes.length; i++) {
                                    if (selectNodes[i].id == item.id) selectNodes.splice(i, 1);
                                }
                            }
                            var useridStr = "";
                            var usernameStr = "";
                            for (var i = 0; i < selectNodes.length; i++) {
                                useridStr += selectNodes[i].id + ";";
                                usernameStr += selectNodes[i].name + ";";
                            }

                            selectData = { userid: useridStr, username: usernameStr };
                            if (selectCallback) selectCallback(selectData);

                        } else {//单选
                            selectData = { name: item.name, id: item.id };
                            if (selectCallback) selectCallback(item);
                        }
                        item.check = !item.check;
                    }
                };


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
