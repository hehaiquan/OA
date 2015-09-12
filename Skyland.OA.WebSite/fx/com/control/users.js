//选择用户常用语的model，就是弹出窗口的内容

define(function () {
    return new function () {

        var serviceurl = "/IWorkUserManage.data?action=FindAllUser";
        var selectNodes = [];
        var root;
        var selectData = [];
        var self = this;

        var inputUserid;
        var inputUserName;
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
            var opt = module.multi;

            //  div.css("height", "100%");
            $.fxPost(serviceurl, {}, function (result) {

                json = result;

                for (key in json.data) {
                    if (json.data[key].children) {
                        json.data[key].expand = false;
                        json.data[key].unselectable = true;
                        json.data[key].css = "list-group-item treeview-bar";

                        for (var i = 0; i < json.data[key].children.length; i++) {
                            json.data[key].children[i].checked = false;
                        }
                    }
                }

                items = {
                    //data: json.data,
                    expandbyClick: true,  //是否点击父节点展开
                    expandable: true,
                    css: {
                        item: "treeview-item btn btn-default",
                        selected: 'active'
                    },
                    //expend: false,
                    flowlayout: 130,       //子节点的宽度
                    itemclick: function (item, element) {
                        if (item.children && item.children.length > 0) return;
                        if (opt) {//如果是多选 
                            if (item.checked) {
                                selectData.push(item);
                            }
                            else {
                                //删除
                                for (var i = 0; i < selectData.length; i++) {
                                    if (selectData[i].id == item.id) selectData.splice(i, 1);
                                }
                            }
                            //element.toggleClass(items.css.selected);
                            if (self.onselect) self.onselect(selectData);

                        } else {//单选
                            selectData = item;
                            if (self.onselect) self.onselect(item);
                        }
                       // item.checked = !item.checked;
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
                        json.data[key].expand = false;
                        json.data[key].unselectable = true;
                        json.data[key].css = "list-group-item treeview-bar";

                    }
                }
                showTree();
            });
        }

        this.set = function (data) {
            selectData = [];
            root.find("[data-id]").removeClass("active");

            var bein = false;
            $.each(data, function (i, userid) {
                root.find("[data-id=" + userid + "]").addClass("active");
                bein = false;
                for (key in json.data) {
                    if (json.data[key].children) {
                        for (key0 in json.data[key].children) {
                            if (json.data[key].children[key0].id == userid) {
                                selectData.push(json.data[key].children[key0]);
                                bein = true;
                                break;
                            }
                        }

                    }
                    if (bein) break;
                }
            })
        };

        this.expandAll = function () {

            for (key in json.data) {
                if (json.data[key].children) {
                    json.data[key].expand = true;
                }
            }

            showTree();
        }

        this.unexpandAll = function () {

            for (key in json.data) {
                if (json.data[key].children) {
                    json.data[key].expand = false;
                }
            }

            showTree();
        }


        this.get = function () {
            return selectData.ids;
        };
    }

});
