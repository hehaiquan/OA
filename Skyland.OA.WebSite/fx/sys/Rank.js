define(function () {
    return new function () {
        var self = this;
        this.options = { key: 'MaxRankManage' };

        this.DepartMange = {
            tree: "",
            contextmenu: "",
            rootdom: "",
            init: function () {
                var me = this;

                jQuery.PackResult("IWorkUserManage.data?action=FindAllDepartment", {}, function (data) {

                    me.tree.frametree({
                        treesource: data,
                        checkbox: false,
                        IsPreventOutSide: true, //无法接受外部拖拽的节点
                        //IshasContextmenu: true,
                        //contextmenu: me.contextmenu,
                        IsOnlyTarget_EndLI_AppendCommonLI: true,
                        drag: true,
                        node_click: function (event, data) {
                            if (data.level == 0) { me.rootdom.find("[iwftype=UserToolBar]").show(); return; }
                            else me.rootdom.find("[iwftype=UserToolBar]").show();
                            jQuery.PackResult("IWorkUserManage.data?action=FindUserByDPID", { "DPID": data.id, "DPName": data.name }, function (data) {
                                self.DepartMange.UserTree.frametree({
                                    treesource: data,
                                    checkbox: false,
                                    IsPreventOutSide: true, //无法接受外部拖拽的节点
                                    IsOnlyTarget_EndLI_AppendCommonLI: true,
                                    drag: true
                                });
                            });
                        }
                    });



                });

            }
        }
        function DepartmentMange(dom) {

            self.DepartMange.tree = dom.find("[treetype=FX_Department]");
            self.DepartMange.UserTree = dom.find("[treetype=user]");
            self.DepartMange.rootdom = dom;


            dom.find("[iwftype=SaveDepart]").bind("click", function () {
                var arr = self.DepartMange.tree.frametree("GetSchemaEndNodes").PickByField("id");
                jQuery.PackResult("IWorkUserManage.data?action=SaveDepartmentRank", { "ID": JSON.stringify(arr) }, function (data) { alert("保存成功"); });
            });
            dom.find("[iwftype=SaveUser]").bind("click", function () {
                var arr = self.DepartMange.UserTree.frametree("GetSchemaEndNodes").PickByField("id");
                jQuery.PackResult("IWorkUserManage.data?action=SaveUserRank", { "ID": JSON.stringify(arr) }, function (data) { alert("保存成功"); });

            });
            self.DepartMange.init();
        }


        this.show = function (module, root) {


            if (root.children().length == 0) {

                root.load("fx/sys/UserList.html", function () {
                    DepartmentMange(root);

                });
            }
        };
    }
});