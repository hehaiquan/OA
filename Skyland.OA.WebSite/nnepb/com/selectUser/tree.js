//选择用户常用语的model，就是弹出窗口的内容

define(function () {
    return function (el, valueAccessor) {


        el = $(el);
        var selectCallback;
        var selectNodes = [];
        var inputUserid = valueAccessor.userid;
        var inputUserName = valueAccessor.username;
        var opt = valueAccessor.opt;//获取是否多选值
        var div;
        var selectData = { userid: "", username: "" };
        var checkImage = "<i class='fa fa-check-square-o fa-lg' style='margin-right:5px'></i>";
        this.show = function (module, root) {
            if (root.children().length != 0) return;
            selectCallback = module.callback;  //选择单位回调

            div = root;
            //  div.css("height", "100%");
            $.fxPost("/IWorkUserManage.data?action=FindAllUser&ttt=" + Math.random(), {}, function (json) {
                for (key in json.data) {
                    if (json.data[key].children) {
                        json.data[key].expand = false;
                        json.data[key].unselectable = true;
                        json.data[key].css = "list-group-item treeview-bar";

                    }
                }

                var items = {
                    data: json.data,
                    expandbyClick: true,  //是否点击父节点展开
                    expandable: true,
                    css: {
                        item: "treeview-item btn btn-default"
                    },
                    //expend: false,
                    flowlayout: 130,       //子节点的宽度
                    itemclick: function (item, element) {
                        if (item.children.length > 0) return;
                        if (opt) {//如果是多选 
                            if (!item.check) {
                                element.prepend(checkImage);
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

                            if (inputUserid) selectData = { userid: useridStr, username: usernameStr };

                        } else {//单选
                            if (inputUserid != null) inputUserid(item.id);
                            inputUserName(item.name);//设置用户名
                            selectCallback({ username: item.name, userid: item.id });
                        }
                        item.check = !item.check;
                    }
                };

                if (div) {
                    var usermenu = $("<div></div>").appendTo(div).listView2(items);

                } else {
                    var usermenu = $("<div></div>").appendTo(el.parent()).listView2(items);
                    usermenu.css("overflow", "auto");
                    el.parent().DropdownMenu({ content: usermenu });
                }
            });

        }
        this.getData = function () {
            return selectData;
        }
    }
});
