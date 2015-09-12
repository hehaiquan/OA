define(function () {
    return new function () {
        var self = this;
        this.options = { key: 'MaxRoleManage' };

        var GetAllUserService = "IWorkUserManage.data?action=FindAllTheStaff";
        var RootDir = "fx/sys/";
        function GetAbsolutePath(path) {
            return RootDir + path;
        }

        this.RoleManage = {
            roletree: "",
            usertree: "",
            menu: null,
            rootdom: "",
            init: function () {
                var me = this;
                jQuery.PackResult("IWorkRoleManage.data?action=FindAllRoleGroup", {}, function (data) {
                    data[0].children.sort(function (a, b) { return a.name.localeCompare(b.name) });//按拼音排序
                    $.each(data[0].children, function (index, item) {
                        if (item.name == "全部人员") {
                            data[0].children.RemoveItem(item);
                            data[0].children.unshift(item);
                        }
                    })
                    me.roletree.frametree({
                        treesource: data,
                        checkbox: false,
                        IshasContextmenu: true,
                        contextmenu: me.menu,
                        node_rightclick: function (event, data) {
                            me.menu.find("li").hide();
                            if (data.level == 0) {
                                me.menu.find("[action=CreateRole]").show();
                            }
                            else {
                                me.menu.find("[action=ReName]").show();
                                me.menu.find("[action=Delete]").show();
                            }
                        },
                        node_click: function (event, data) {
                            var RID = data.id;
                            var RoleName = data.name;
                            if (data.level == 0) {
                                me.usertree.frametree("SetEndLICheckBoxAll", false);
                                me.rootdom.find(".curselect").text("").data("RID", null);
                                return;
                            }
                            me.rootdom.find(".curselect").data("RID", RID);
                            me.rootdom.find(".curselect").text(RoleName);
                            jQuery.PackResult("IWorkRoleManage.data?action=FindAllUserByRID", { "RID": RID }, function (result) {
                                me.usertree.frametree("SetEndLICheckBoxAll", false);
                                me.usertree.frametree("SetEndLICheckBox", result, true);
                            });
                        }
                    });
                });
                jQuery.PackResult(GetAllUserService, {}, function (data) {
                    me.usertree.frametree({
                        treesource: data
                    });
                });
            }
        };

        function RoleManage(dom) {

            dom.find("[iwftype =UserToolBar]").each(function () {
                var Btn_Fold = $(this).find("[iwftype=fold]");
                var Btn_UnFold = $(this).find("[iwftype=unfold]");
                var TREE = $(this).next("ul");
                Btn_Fold.click(function () {
                    TREE.frametree("UnExpandAllNodes");
                });
                Btn_UnFold.click(function () {
                    TREE.frametree("ExpandAllNodes");
                });
            });

            var MenuStr = '<div  style="position: absolute; left: 0px; top: 0px; background-color: #ead8d8; display: none">'
                                      + '<ul class="frametreeMenu"><li action="CreateRole">新增角色</li><li action="ReName">重命名</li><li action="Delete">删除权限</li></ul>'
                                      + '</div>';
            self.RoleManage.roletree = dom.find("[treetype=Role]");
            self.RoleManage.usertree = dom.find("[treetype=User]");

            self.RoleManage.rootdom = dom;
            if (self.RoleManage.menu == null) { self.RoleManage.menu = $(MenuStr); $('body').append(self.RoleManage.menu); }
            self.RoleManage.init();

            self.RoleManage.menu.find("[action=CreateRole]").mousedown(function () {
                var win = $('body').iwfWindow({
                    title: '新建角色组',
                    width: 300,
                    height: 300,
                    button: [{
                        text: '确定', handler: function (data) {
                            var param = new Object();

                            param.RoleName = $.trim(win.dialogdom.find("[field=RoleName]").val());

                            param.FullName = win.dialogdom.find("[field=FullName]").val();

                            if (param.RoleName == "" || param.RoleName == null) { alert("角色名是必填项"); return; }

                            //
                            jQuery.PackResult("IWorkRoleManage.data?action=CreateRole", param, function (data) {
                                alert("新建成功");
                                jQuery.PackResult("IWorkRoleManage.data?action=FindAllRoleGroup", {}, function (result) {
                                    self.RoleManage.roletree.frametree({
                                        treesource: result
                                    });
                                    //self.RoleManage.roletree.frametree("SetEndLISelectedByID", data.RID);

                                    win.close();
                                });



                            });
                            //

                        }
                    }, {
                        text: '取消', handler: function () { win.close(); }
                    }]
                });
                win.load(GetAbsolutePath("CreateRole.html"), function () {
                    //win.content().css("height", "");
                    //win.dialogdom.css("height", "");
                });
            });
            self.RoleManage.menu.find("[action=ReName]").mousedown(function () {
                var obj = self.RoleManage.roletree.frametree("GetCurSelectNode");
                var win = $('body').iwfWindow({
                    title: '重命名角色',
                    width: 300,
                    height: 300,
                    button: [{
                        text: '确定', handler: function (data) {
                            var param = new Object();
                            param.id = obj.id;
                            param.name = $.trim(win.dialogdom.find("[field=RoleName]").val());
                            if (param.name == "" || param.name == null) { alert("角色名是必填项"); return; }
                            jQuery.PackResult("IWorkRoleManage.data?action=EditRole", param, function (data) {
                                obj.name = param.name;
                                obj.value.name = param.name;
                                win.close();
                                alert("重命名成功");
                                self.RoleManage.roletree.frametree("EditThis", obj.dom, obj.value, obj.name);
                            });
                        }
                    }, {
                        text: '取消', handler: function () { win.close(); }
                    }]
                });


                win.load(GetAbsolutePath("EditRole.html"), function () {
                    win.dialogdom.find("[field=RoleName]").val(obj.name)[0].select();
                });
            });
            self.RoleManage.menu.find("[action=Delete]").mousedown(function () {
                var param = new Object();
                var obj = self.RoleManage.roletree.frametree("GetCurSelectNode");
                param.id = obj.id;
                jQuery.PackResult("IWorkRoleManage.data?action=DeleteRole", param, function (data) {
                    alert("删除成功");
                    self.RoleManage.roletree.frametree("DeleteThis", obj.dom);
                    self.RoleManage.rootdom.find(".curselect").text("").data("RID", null);
                });
            });

            self.RoleManage.rootdom.find("[action=save]").click(function () {
                self.RoleManage.rootdom.trigger("focus");
                var RID = dom.find(".curselect").data("RID");
                if (RID == null) { alert("未选择权限组"); return; }
                var arr = self.RoleManage.usertree.frametree("GetAllCheckNodes").PickByField("id");
                // jQuery.Loading.open("保存中");

                var param = new Object();
                param.ListUser = JSON.stringify(arr);
                param.RID = RID;
                jQuery.PackResult("IWorkRoleManage.data?action=SaveRole", param, function (data) {
                    //jQuery.Loading.close();
                    alert("保存成功");
                }, function () { //jQuery.Loading.close(); });
                });


            })
        }

        this.UserManage = {
            roletree: "",
            usertree: "",
            menu: null,
            rootdom: "",
            init: function () {
                var me = this;
                jQuery.PackResult("IWorkRoleManage.data?action=FindAllRoleGroup", {}, function (data) {
                    me.roletree.frametree({
                        treesource: data,
                        checkbox: true
                    });
                });
                jQuery.PackResult(GetAllUserService, {}, function (data) {
                    me.usertree.frametree({
                        checkbox: false,
                        treesource: data,
                        node_click: function (event, data) {
                            var ID = data.id;
                            var Name = data.name;
                            if (!data.IsEndLI) {
                                me.roletree.frametree("SetEndLICheckBoxAll", false);
                                me.rootdom.find(".curselect").text("").data("UserID", null);
                                return;
                            }
                            me.rootdom.find(".curselect").data("UserID", ID);
                            me.rootdom.find(".curselect").text(Name);
                            jQuery.PackResult("IWorkRoleManage.data?action=FindAllRoleByUserID", { "UserID": ID }, function (result) {
                                me.roletree.frametree("SetEndLICheckBoxAll", false);
                                me.roletree.frametree("SetEndLICheckBox", result, true);
                            });
                        }
                    });
                });

            }
        }



        function UserManage(dom) {

            dom.find("[iwftype =UserToolBar]").each(function () {
                var Btn_Fold = $(this).find("[iwftype=fold]");
                var Btn_UnFold = $(this).find("[iwftype=unfold]");
                var TREE = $(this).next("ul");
                Btn_Fold.click(function () {
                    TREE.frametree("UnExpandAllNodes");
                });
                Btn_UnFold.click(function () {
                    TREE.frametree("ExpandAllNodes");
                });
            });


            self.UserManage.roletree = dom.find("[treetype=Role]");
            self.UserManage.usertree = dom.find("[treetype=User]");

            self.UserManage.rootdom = dom;
            self.UserManage.init();

            self.UserManage.rootdom.find("[action=save]").click(function () {
                self.UserManage.rootdom.trigger("focus");
                var UserID = dom.find(".curselect").data("UserID");
                if (UserID == null) { alert("未选择用户"); return; }
                var arr = self.UserManage.roletree.frametree("GetAllCheckNodes").PickByField("id");
                //jQuery.Loading.open("保存中");

                var param = new Object();
                param.ListRID = JSON.stringify(arr);
                param.UserID = UserID;
                jQuery.PackResult("IWorkRoleManage.data?action=SaveUserRole", param, function (data) {
                    //jQuery.Loading.close();
                    alert("保存成功");
                }, function () { //jQuery.Loading.close(); });
                });
            })

        }

        this.show = function (module, root) {

            if (root.children().length == 0) {
                root.load(GetAbsolutePath("RoleList.html"), function () {
                    root.iwfTab({
                        tabchange: function (dom) {
                            var viewingangle = dom.attr("viewingangle");
                            if (dom.data("Init") == "true") return;
                            dom.data("Init", "true");

                            switch (viewingangle) {
                                case "role":
                                    RoleManage(dom);
                                    break;
                                case "user":
                                    UserManage(dom);
                                    break;
                                default:
                                    break;
                            }

                        }
                    });
                });
            }
        };
    
    }
})