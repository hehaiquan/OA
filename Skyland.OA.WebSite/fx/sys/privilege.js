define(function () {
    return new function () {
        var self = this;
        this.options = { key: 'MaxPrivilege', modelName: "权限管理" };

        var GetAllUserService = "IWorkUserManage.data?action=FindAllTheStaff";

        //组视角
        this.Workangle = {
            grouptree: "",//权限组树形
            privilegetree: "",//权限树形
            usertree: "",//用户树形
            rootdom: "",//上下文DOM
            contextmenu: "",//右键菜单
            curselectdom: null,//忘了
            AllPrivilegeSource: "",//所有权限资源--tree
            AllUserSource: "",//所有用户资源--tree
            init: function () {
                var me = this;
                me.curselectdom.text("").data("GID", null);
                jQuery.PackResult("IWorkPrivilegeManage.data?action=FindAllGroup", {}, function (data) {
                    me.grouptree.frametree({
                        treesource: data,
                        checkbox: false,
                        IshasContextmenu: true,
                        contextmenu: me.contextmenu,
                        node_click: function (event, data) {
                            var GID = data.id;
                            var GroupName = data.name;
                            if (data.level == 0) {
                                me.curselectdom.text("").data("GID", null);
                                me.privilegetree.frametree({ treesource: me.AllPrivilegeSource });
                                me.usertree.frametree({ treesource: me.AllUserSource });
                                return;
                            }
                            me.curselectdom.data("GID", GID);
                            me.curselectdom.text(GroupName);
                            jQuery.PackResult("IWorkPrivilegeManage.data?action=FindPrivilegeByGID", { "GID": GID }, function (result) {
                                me.privilegetree.frametree({ treesource: result });
                            });
                            jQuery.PackResult("IWorkPrivilegeManage.data?action=FindUserByGID", { "GID": GID }, function (result) {
                                me.usertree.frametree({ treesource: result });
                            });
                        },
                        node_rightclick: function (event, data) {
                            if (data.level == 0) me.contextmenu.find("li").hide();
                            else me.contextmenu.find("li").show();
                        }
                    });
                });
                jQuery.PackResult("IWorkPrivilegeManage.data?action=FindAllPrivilege", {}, function (data) {
                    me.AllPrivilegeSource = data;
                    me.privilegetree.frametree({
                        treesource: data,
                        checkbox: true
                    });
                });
                jQuery.PackResult(GetAllUserService, {}, function (data) {
                    me.AllUserSource = data;
                    me.usertree.frametree({
                        treesource: data,
                        checkbox: true
                    });
                });
            }
        };
        function Workangle(dom) {
            if (dom[0].InitOnce) { self.Workangle.init(); return; }
            else dom[0].InitOnce = true;
            var WorkMenuStr = '<div  style="position: absolute; left: 0px; top: 0px; background-color: #ead8d8; display: none">'
                                             + '<ul class="frametreeMenu"><li action="create">新建权限组</li><li action="edit">编辑权限组</li><li action="delete">删除权限组</li></ul>'
                                             + '</div>';

            self.Workangle.rootdom = dom;
            self.Workangle.curselectdom = dom.find("[iwftype=curselect]");//当前选中
            self.Workangle.grouptree = dom.find("[treetype=group]");//组
            self.Workangle.privilegetree = dom.find("[treetype=privilege]");//权限
            self.Workangle.usertree = dom.find("[treetype=user]");//用户

            var contextMenu = self.Workangle.contextmenu = $(WorkMenuStr);

            self.Workangle.rootdom.find("[iwftype=save]").click(function () {
                self.Workangle.rootdom.trigger("focus");
                var GID = self.Workangle.curselectdom.data("GID");
                if (GID == null) { alert("未选择权限组"); return; }
                var privilegearr = self.Workangle.privilegetree.frametree("GetAllCheckNodes").PickByField("id");
                var usertreearr = self.Workangle.usertree.frametree("GetAllCheckNodes").PickByField("id");
                var param = new Object();
                param.ListPrivilege = JSON.stringify(privilegearr);
                param.ListUser = JSON.stringify(usertreearr);
                param.GID = GID;
                //  jQuery.Loading.open("保存中");
                jQuery.PackResult("IWorkPrivilegeManage.data?action=SaveGroup", param, function (data) {
                    //jQuery.Loading.close();
                    RefreshTab(dom);//(组视角<保存完毕>后刷新Tab)
                    alert("保存成功");
                }, function () {
                    //jQuery.Loading.close();
                });
            });
            $('body').append(contextMenu);
            //新建权限组
            contextMenu.find("[action=create]").mousedown(function () {
                var win = $('body').iwfWindow({
                    title: '新建权限组',
                    width: 300,
                    height: 230,
                    button: [{
                        text: '确定', handler: function (data) {
                            //post到服务端新建权限组
                            var obj = self.Workangle.grouptree.frametree("GetCurSelectNode");
                            var param = new Object();
                            param.GroupName = $.trim(win.dialogdom.find("[field=GroupName]").val());
                            param.Descript = win.dialogdom.find("[field=Descript]").val();
                            jQuery.PackResult("IWorkPrivilegeManage.data?action=CreateGroup", param, function (data) {
                                var binddata = new Object();
                                binddata.id = data.GID;
                                binddata.Name = data.GroupName;
                                self.Workangle.grouptree.frametree("CreateSiblings", obj.dom, binddata, data.GroupName);
                                win.close();
                                RefreshTab(dom);//(组视角<新建完毕>后刷新Tab)
                                alert("新建成功")
                            });
                        }
                    }, {
                        text: '取消', handler: function () { win.close(); }
                    }]
                });
                win.load("fx/sys/CreateGroup.html", function () {
                    win.dialogdom.find("[field=GroupName]").val("未命名")[0].select();
                });
            });
            //编辑权限组
            contextMenu.find("[action=edit]").mousedown(function () {
                var win = $('body').iwfWindow({
                    title: '编辑权限组',
                    width: 300,
                    height: 230,
                    button: [{
                        text: '确定', handler: function (data) {
                            var obj = self.Workangle.grouptree.frametree("GetCurSelectNode");
                            var param = new Object();
                            param.GID = obj.id;
                            param.GroupName = $.trim(win.dialogdom.find("[field=GroupName]").val());
                            param.Descript = win.dialogdom.find("[field=Descript]").val();
                            jQuery.PackResult("IWorkPrivilegeManage.data?action=EditGroup", param, function (data) {
                                self.Workangle.grouptree.frametree("EditThis", obj.dom, data, data.name);
                                win.close();
                                RefreshTab(dom);//(组视角<编辑完毕>后刷新Tab)
                                alert("编辑成功")
                            });
                        }
                    }, {
                        text: '取消', handler: function () { win.close(); }
                    }]
                });
                win.load("fx/sys/EditGroup.html", function () {
                    var obj = self.Workangle.grouptree.frametree("GetCurSelectNode");
                    jQuery.PackResult("IWorkPrivilegeManage.data?action=QueryGroup", { GID: obj.id }, function (data) {
                        win.dialogdom.find("[field=GID]").text(data.GID);
                        win.dialogdom.find("[field=GroupName]").val(data.GroupName);
                        win.dialogdom.find("[field=Descript]").val(data.Descript);

                    });
                    //$("#CreateGroup-GroupName").val("未命名")[0].select();
                });
            });
            //删除权限组
            contextMenu.find("[action=delete]").mousedown(function () {
                if (!confirm("是否确定删除")) return;
                var obj = self.Workangle.grouptree.frametree("GetCurSelectNode");
                var param = new Object();
                param.GID = obj.id;
                jQuery.PackResult("IWorkPrivilegeManage.data?action=DeleteGroup", param, function (data) {
                    self.Workangle.grouptree.frametree("DeleteThis", obj.dom);
                    RefreshTab(dom);//(组视角<删除完毕>后刷新Tab)
                    alert("删除成功");
                    self.Workangle.curselectdom.text("");
                    self.Workangle.curselectdom.data("GID", null);
                    self.Workangle.privilegetree.frametree({ treesource: self.Workangle.AllPrivilegeSource });
                    self.Workangle.usertree.frametree({ treesource: self.Workangle.AllUserSource });
                });
            });
            self.Workangle.init();
        }
        //用户视角
        this.Userangle = {
            grouptree: "",
            privilegetree: "",
            usertree: "",
            rootdom: "",
            curselectdom: null,
            AllPrivilegeSource: "",
            AllUserSource: "",
            AllGroupSource: "",
            contextmenu: "",
            init: function () {
                var me = this;
                me.curselectdom.text("").data("UserID", null);
                jQuery.PackResult(GetAllUserService, {}, function (data) {
                    me.AllUserSource = data;
                    me.usertree.frametree({
                        treesource: data,
                        checkbox: false,
                        //IshasContextmenu: true,
                        node_click: function (event, data) {
                            var UserID = data.id;
                            var UserName = data.name;
                            if (data.level == 0) {
                                me.curselectdom.text("").data("UserID", null);
                                me.privilegetree.frametree({ treesource: me.AllPrivilegeSource });
                                me.grouptree.frametree({ treesource: me.AllGroupSource });
                                return;
                            }
                            me.curselectdom.data("UserID", UserID);
                            me.curselectdom.text(UserName);
                            jQuery.PackResult("IWorkPrivilegeManage.data?action=FindPrivilegeByUserID", { "UserID": UserID }, function (result) {
                                me.privilegetree.frametree({ treesource: result });
                            });
                            jQuery.PackResult("IWorkPrivilegeManage.data?action=FindGroupByUserID", { "UserID": UserID }, function (result) {
                                me.grouptree.frametree({ treesource: result });
                            });
                        }
                    });
                });
                jQuery.PackResult("IWorkPrivilegeManage.data?action=FindAllPrivilege", {}, function (data) {
                    me.AllPrivilegeSource = data;
                    me.privilegetree.frametree({
                        treesource: data,
                        checkbox: true,
                        abortcheck: true,
                        IshasContextmenu: true,
                        contextmenu: me.contextmenu,
                        node_rightclick: function (event, data) {
                            var UserID = me.curselectdom.data("UserID");
                            if (UserID == null) me.contextmenu.children().hide();
                            else me.contextmenu.children().show();
                        },
                        node_checkchange: function (event, data) {

                        }
                    });
                });
                jQuery.PackResult("IWorkPrivilegeManage.data?action=FindAllGroup", {}, function (data) {
                    me.AllGroupSource = data;
                    me.grouptree.frametree({
                        treesource: data,
                        node_checkchange: function (event, data) {
                            var UserID = me.curselectdom.data("UserID");
                            if (UserID == null) { return; }
                            var grouparr = me.grouptree.frametree("GetAllCheckNodes").PickByField("id");
                            var param = { ListGID: JSON.stringify(grouparr) };
                            jQuery.PackResult("IWorkPrivilegeManage.data?action=FindPrivilegeByListGID", param, function (lst) {
                                var GetSchemaObject = self.Userangle.privilegetree.frametree("GetSchemaEndNodes");
                                //根据组的变化来控制（P,G）值显示
                                $.each(GetSchemaObject, function (index, ent) {
                                    var PID_flag = lst.Contains(ent.id);
                                    if (ent.value.lstType.Contains("G") == true) ent.value.lstType.RemoveItem("G");
                                    if (PID_flag == true) ent.value.lstType.push("G");
                                    if (ent.value.lstType.length > 0) {
                                        ent.value.name = ent.value.primevalName + "(" + ent.value.lstType.join(",") + ")";
                                        ent.value.check = true;
                                    }
                                    else {
                                        ent.value.name = ent.value.primevalName;
                                        ent.value.check = false;
                                    }
                                    self.Userangle.privilegetree.frametree("EditThis", ent.dom, ent.value, ent.value.name);
                                    self.Userangle.privilegetree.frametree("SetDisabledCheckBox", ent.dom, ent.value.check)
                                });
                                //
                            });
                        }
                    });
                });
            }
        };
        function Userangle(dom) {
            if (dom[0].InitOnce) { self.Userangle.init(); return; }
            else dom[0].InitOnce = true;
            var UserMenuStr = '<div style="position: absolute; left: 0px; top: 0px; background-color: #ead8d8; display: none">'
                                             + '<ul class="frametreeMenu"><li action="abort">强制禁止</li><li action="open">强制开放</li><li action="remove">取消强制</li></ul>'
                                             + '</div>';
            var contextMenu = self.Userangle.contextmenu = $(UserMenuStr);
            $('body').append(contextMenu);

            self.Userangle.rootdom = dom;
            self.Userangle.curselectdom = dom.find("[iwftype=curselect]");//当前选中
            self.Userangle.grouptree = dom.find("[treetype=group]");//组
            self.Userangle.privilegetree = dom.find("[treetype=privilege]");//权限
            self.Userangle.usertree = dom.find("[treetype=user]");//用户

            self.Userangle.rootdom.find("[iwftype=save]").click(function () {
                self.Userangle.rootdom.trigger("focus");
                var UserID = self.Userangle.curselectdom.data("UserID");
                if (UserID == null) { alert("未选择任何人"); return; }
                var Privilegearr = self.Userangle.privilegetree.frametree("GetSchemaEndNodes").PickByField("value");
                var Grouparr = self.Userangle.grouptree.frametree("GetAllCheckNodes").PickByField("id");
                var param = new Object();
                param.UserID = UserID;
                param.ListPrivilege = JSON.stringify(Privilegearr);
                param.ListGID = JSON.stringify(Grouparr);
                //jQuery.Loading.open("保存中");
                jQuery.PackResult("IWorkPrivilegeManage.data?action=SaveUserSetting", param, function () {
                    //jQuery.Loading.close();
                    RefreshTab(dom);//(用户视角<保存完毕>后刷新Tab)
                    alert("保存成功");
                }, function () {
                    //jQuery.Loading.close();
                });
            });
            contextMenu.find("[action=abort]").mousedown(function () {
                var obj = self.Userangle.privilegetree.frametree("GetCurSelectNode");
                var flag = obj.value.lstType.Contains("P");
                if (flag == false) {
                    obj.value.lstType.unshift("P");
                }
                obj.value.name = obj.value.primevalName + "(" + obj.value.lstType.join(",") + ")";
                obj.value.check = false;
                self.Userangle.privilegetree.frametree("EditThis", obj.dom, obj.value, obj.value.name);
                self.Userangle.privilegetree.frametree("SetDisabledCheckBox", obj.dom, obj.value.check)
            });
            contextMenu.find("[action=open]").mousedown(function () {
                var obj = self.Userangle.privilegetree.frametree("GetCurSelectNode");
                var flag = obj.value.lstType.Contains("P");
                if (flag == false) {
                    obj.value.lstType.unshift("P");
                }
                obj.value.name = obj.value.primevalName + "(" + obj.value.lstType.join(",") + ")";
                obj.value.check = true;
                self.Userangle.privilegetree.frametree("EditThis", obj.dom, obj.value, obj.value.name);
                self.Userangle.privilegetree.frametree("SetDisabledCheckBox", obj.dom, obj.value.check)
            });
            contextMenu.find("[action=remove]").mousedown(function () {
                var obj = self.Userangle.privilegetree.frametree("GetCurSelectNode");
                var flag = obj.value.lstType.Contains("P");
                if (flag == true) {
                    obj.value.lstType.RemoveItem("P");
                }
                if (obj.value.lstType.length > 0) {
                    obj.value.name = obj.value.primevalName + "(" + obj.value.lstType.join(",") + ")";
                    obj.value.check = true;
                }
                else {
                    obj.value.name = obj.value.primevalName;
                    obj.value.check = false;
                }

                self.Userangle.privilegetree.frametree("EditThis", obj.dom, obj.value, obj.value.name);
                self.Userangle.privilegetree.frametree("SetDisabledCheckBox", obj.dom, obj.value.check)
            });
            self.Userangle.init();
        }



        this.PrivilegePtype = [
            { id: "UI", des: "页面排版类" },
            { id: "portal", des: "门户排版类" }
        ];
        //权限视角
        this.Privilegeangle = {
            grouptree: "",
            privilegetree: "",
            usertree: "",
            rootdom: "",
            AllPrivilegeSource: "",
            AllUserSource: "",
            AllGroupSource: "",
            UserMenu: null,
            PrivilegeMenu: null,
            curselectdom: null,
            privilegeKindArray: self.PrivilegePtype.PickByField("id"),
            init: function () {
                var me = this;
                me.curselectdom.text("").data("PID", null);
                jQuery.PackResult(GetAllUserService, {}, function (data) {
                    me.AllUserSource = data;
                    me.usertree.frametree({
                        treesource: data,
                        checkbox: true,
                        abortcheck: true,
                        IshasContextmenu: true,
                        contextmenu: me.UserMenu,
                        node_rightclick: function (event, data) {
                            var PID = me.curselectdom.data("PID");
                            if (PID == null || data.level == 0) me.UserMenu.children().hide();
                            else me.UserMenu.children().show();
                        }
                    });
                });
                jQuery.PackResult("IWorkPrivilegeManage.data?action=FindAllPrivilege", {}, function (data) {
                    me.AllPrivilegeSource = data;
                    me.privilegetree.frametree({
                        treesource: data,
                        checkbox: false,
                        IshasContextmenu: true,
                        contextmenu: me.PrivilegeMenu,
                        node_rightclick: function (event, data) {
                            me.PrivilegeMenu.find("li").hide();
                            if (data.level == 1) { me.PrivilegeMenu.find("[action=EditDir]").show(); me.PrivilegeMenu.find("[action=CreateDir]").show(); me.PrivilegeMenu.find("[action=Create]").show(); me.PrivilegeMenu.find("[action=removeDir]").show(); }
                            if (data.level == 2) { me.PrivilegeMenu.find("[action=remove]").show(); me.PrivilegeMenu.find("[action=Edit]").show(); }
                        },
                        node_click: function (event, data) {
                            var PID = data.id;
                            var PName = data.name;
                            if (data.level == 0 || data.level == 1) {
                                me.curselectdom.text("").data("PID", null);
                                me.usertree.frametree({ treesource: me.AllUserSource });
                                me.grouptree.frametree({ treesource: me.AllGroupSource });
                                return;
                            }
                            me.curselectdom.data("PID", PID);
                            me.curselectdom.text(PName);
                            //FindUserByPID
                            jQuery.PackResult("IWorkPrivilegeManage.data?action=FindGroupByPID", { "PID": PID }, function (result) {
                                me.grouptree.frametree({ treesource: result });
                            });
                            jQuery.PackResult("IWorkPrivilegeManage.data?action=FindUserByPID", { "PID": PID }, function (result) {
                                me.usertree.frametree({
                                    treesource: result
                                });
                            });
                        }
                    });
                });
                jQuery.PackResult("IWorkPrivilegeManage.data?action=FindAllGroup", {}, function (data) {
                    me.AllGroupSource = data;
                    me.grouptree.frametree({
                        treesource: data,
                        node_checkchange: function () {
                            var PID = me.curselectdom.data("PID");
                            if (PID == null) { return; }
                            var grouparr = me.grouptree.frametree("GetAllCheckNodes").PickByField("id");
                            var param = { ListGID: JSON.stringify(grouparr) };
                            jQuery.PackResult("IWorkPrivilegeManage.data?action=FindUserByListGID", param, function (lst) {
                                var GetSchemaObject = me.usertree.frametree("GetSchemaEndNodes");
                                //根据组的变化来控制（P,G）值显示
                                $.each(GetSchemaObject, function (index, ent) {
                                    var PID_flag = lst.Contains(ent.id);
                                    if (ent.value.lstType.Contains("G") == true) ent.value.lstType.RemoveItem("G");
                                    if (PID_flag == true) ent.value.lstType.push("G");
                                    if (ent.value.lstType.length > 0) {
                                        ent.value.name = ent.value.primevalName + "(" + ent.value.lstType.join(",") + ")";
                                        ent.value.check = true;
                                    }
                                    else {
                                        ent.value.name = ent.value.primevalName;
                                        ent.value.check = false;
                                    }
                                    me.usertree.frametree("EditThis", ent.dom, ent.value, ent.value.name);
                                    me.usertree.frametree("SetDisabledCheckBox", ent.dom, ent.value.check)
                                });
                            });
                        }
                    });
                });
            }
        };
        function Privilegeangle(dom) {
            if (dom[0].InitOnce) { self.Privilegeangle.init(); return; }
            else dom[0].InitOnce = true;


            var UserMenuStr = '<div  style="position: absolute; left: 0px; top: 0px; background-color: #ead8d8; display: none">'
                                          + '<ul class="frametreeMenu"><li action="abort">强制禁止</li><li action="open">强制开放</li><li action="remove">取消强制</li></ul>'
                                          + '</div>';
            var PrivilegeMenuStr = '<div  style="position: absolute; left: 0px; top: 0px; background-color: #ead8d8; display: none">'
                                      + '<ul class="frametreeMenu"><li action="CreateDir">新建权限目录</li><li action="Create">添加权限</li><li action="EditDir">重命名</li><li action="removeDir">删除权限目录</li><li action="Edit">编辑权限</li><li action="remove">删除权限</li></ul>'
                                      + '</div>';
            if (self.Privilegeangle.UserMenu == null) { self.Privilegeangle.UserMenu = $(UserMenuStr); $('body').append(self.Privilegeangle.UserMenu); }
            if (self.Privilegeangle.PrivilegeMenu == null) { self.Privilegeangle.PrivilegeMenu = $(PrivilegeMenuStr); $('body').append(self.Privilegeangle.PrivilegeMenu); }

            self.Privilegeangle.PrivilegeMenu.find("[action=CreateDir]").mousedown(function () {
                var win = $('body').iwfWindow({
                    title: '新建权限目录',
                    width: 400,
                    height: 300,
                    button: [{
                        text: '确定', handler: function (data) {
                            var param = new Object();
                            param.Type = $.trim(win.dialogdom.find("[field=Type]").val());
                            param.Name = win.dialogdom.find("[field=Name]").val();
                            param.Key = $.trim(win.dialogdom.find("[field=Key]").val());
                            param.PType = $.trim(win.dialogdom.find("[field=PType]").val());
                            //param.UrlValue = $.trim(win.dialogdom.find("[field=Url]").val());
                            if (param.Key == "" || param.Key == null) { alert("权限键值是必填項"); return; }
                            if (param.PType == "" || param.PType == null) { alert("权限类型是必填項"); return; }
                            jQuery.PackResult("IWorkPrivilegeManage.data?action=CreatePrivilegeDir", param, function (res) {
                                RefreshTab(dom);//(权限视角<创建权限目录>后刷新Tab)
                                jQuery.PackResult("IWorkPrivilegeManage.data?action=FindAllPrivilege", {}, function (data) { win.close(); self.Privilegeangle.privilegetree.frametree({ treesource: data }); alert("新建成功"); });
                            });
                        }
                    }, {
                        text: '取消', handler: function () { win.close(); }
                    }]
                });
                win.load("fx/sys/CreatePrivilegeDir.html", function () {
                    win.dialogdom.find("[field=PType]").frameAutoinput({ textArray: self.Privilegeangle.privilegeKindArray });
                    win.dialogdom.find("[field=Type]").val("未命名")[0].select();
                    win.dialogdom.find("[field=Name]").val("未命名")[0];
                });
            });
            self.Privilegeangle.PrivilegeMenu.find("[action=EditDir]").mousedown(function () {
                var obj = self.Privilegeangle.privilegetree.frametree("GetCurSelectNode");
                var win = $('body').iwfWindow({
                    title: '重命名',
                    width: 400,
                    height: 260,
                    button: [{
                        text: '确定', handler: function (data) {
                            var param = new Object();
                            //param.TypeEn = obj.id;
                            param.Type = win.dialogdom.find("[field=Type]").val();
                            jQuery.PackResult("IWorkPrivilegeManage.data?action=EditPrivilegeDir", param, function (res) {
                                RefreshTab(dom);//(权限视角<编辑权限目录>后刷新Tab)
                                obj.name = param.Type;
                                obj.value.name = param.Type;
                                self.Privilegeangle.privilegetree.frametree("EditThis", obj.dom, obj.value, obj.name);
                                win.close();
                                alert("重命名成功");
                            });
                        }
                    }, {
                        text: '取消', handler: function () {
                            win.close();
                        }
                    }]
                });
                win.load("fx/sys/EditPrivilegeDir.html", function () {
                    var obj = self.Privilegeangle.privilegetree.frametree("GetCurSelectNode");
                    win.dialogdom.find("[field=Type]").val(obj.name)[0].select();
                });
            });
            self.Privilegeangle.PrivilegeMenu.find("[action=Edit]").mousedown(function () {
                var obj = self.Privilegeangle.privilegetree.frametree("GetCurSelectNode");
                jQuery.PackResult("IWorkPrivilegeManage.data?action=QueryPrivilege", { PID: obj.id }, function (data) {
                    var win = $('body').iwfWindow({
                        title: '权限编辑(' + obj.id + ')',
                        width: 400,
                        height: 260,
                        button: [{
                            text: '确定', handler: function () {
                                var param = new Object();
                                param.PID = obj.id;
                                param.Name = win.dialogdom.find("[field=Name]").val();
                                //param.UrlValue = win.dialogdom.find("[field=Url]").val();
                                param.PType = $.trim(win.dialogdom.find("[field=PType]").val());
                                param.Key = win.dialogdom.find("[field=Key]").val();
                                if (param.Key == "" || param.Key == null) { alert("权限键值是必填項"); return; }
                                if (param.PType == "" || param.PType == null) { alert("权限类型是必填項"); return; }
                                jQuery.PackResult("IWorkPrivilegeManage.data?action=EditPrivilege", param, function (res) {
                                    RefreshTab(dom);//(权限视角<编辑权限>后刷新Tab)
                                    obj.name = param.Name;
                                    obj.value.name = param.Name;
                                    self.Privilegeangle.privilegetree.frametree("EditThis", obj.dom, obj.value, obj.name);
                                    win.close();
                                    alert("编辑成功");
                                });
                            }
                        }, {
                            text: '取消', handler: function () { win.close(); }
                        }]
                    });
                    win.load("fx/sys/EditPrivilege.html", function () {
                        win.dialogdom.find("[field=PType]").frameAutoinput({ textArray: self.Privilegeangle.privilegeKindArray });
                        win.dialogdom.find("[field=PType]").val(data.PType);
                        win.dialogdom.find("[field=Name]").val(data.Name);
                        win.dialogdom.find("[field=Key]").val(data.ModelKey);
                    });
                });
            });

            self.Privilegeangle.PrivilegeMenu.find("[action=Create]").mousedown(function () {
                var win = $('body').iwfWindow({
                    title: '新建权限',
                    width: 400,
                    height: 260,
                    button: [{
                        text: '确定', handler: function (data) {
                            var obj = self.Privilegeangle.privilegetree.frametree("GetCurSelectNode");
                            var Type = obj.name;
                            var param = new Object();

                            param.Type = Type;
                            param.Name = win.dialogdom.find("[field=Name]").val();
                            param.Key = $.trim(win.dialogdom.find("[field=Key]").val());
                            param.PType = $.trim(win.dialogdom.find("[field=PType]").val());
                            //param.UrlValue = $.trim(win.dialogdom.find("[field=Url]").val());
                            if (param.Key == "" || param.Key == null) { alert("权限键值是必填項"); return; }
                            if (param.PType == "" || param.PType == null) { alert("权限类型是必填項"); return; }
                            jQuery.PackResult("IWorkPrivilegeManage.data?action=CreatePrivilege", param, function (res) {
                                RefreshTab(dom);//(权限视角<创建权限>后刷新Tab)
                                jQuery.PackResult("IWorkPrivilegeManage.data?action=FindAllPrivilege", {}, function (data) { win.close(); self.Privilegeangle.privilegetree.frametree({ treesource: data }); alert("新建成功"); });
                            });
                        }
                    }, {
                        text: '取消', handler: function () { win.close(); }
                    }]
                });
                win.load("fx/sys/CreatePrivilege.html", function () {
                    win.dialogdom.find("[field=Name]").val("未命名")[0].select();
                    win.dialogdom.find("[field=PType]").frameAutoinput({ textArray: self.Privilegeangle.privilegeKindArray });
                });
            });
            self.Privilegeangle.PrivilegeMenu.find("[action=removeDir]").mousedown(function () {
                if (!confirm("是否确定删除")) return;
                var obj = self.Privilegeangle.privilegetree.frametree("GetCurSelectNode");
                var param = new Object();
                param.Type = obj.name;
                jQuery.PackResult("IWorkPrivilegeManage.data?action=DeletePrivilegeDir", param, function (data) {
                    self.Privilegeangle.privilegetree.frametree("DeleteThis", obj.dom);
                    RefreshTab(dom);//(权限视角<删除权限目录>后刷新Tab)
                    self.Privilegeangle.curselectdom.text("");
                    self.Privilegeangle.curselectdom.data("PID", null);
                    self.Privilegeangle.grouptree.frametree({ treesource: self.Privilegeangle.AllGroupSource });
                    self.Privilegeangle.usertree.frametree({ treesource: self.Privilegeangle.AllUserSource });
                    alert("删除成功");
                });
            });
            self.Privilegeangle.PrivilegeMenu.find("[action=remove]").mousedown(function () {
                if (!confirm("是否确定删除")) return;
                var obj = self.Privilegeangle.privilegetree.frametree("GetCurSelectNode");
                var param = new Object();
                param.PID = obj.id;
                jQuery.PackResult("IWorkPrivilegeManage.data?action=DeletePrivilege", param, function (data) {
                    self.Privilegeangle.privilegetree.frametree("DeleteThis", obj.dom);
                    RefreshTab(dom);//(权限视角<删除权限>后刷新Tab)
                    self.Privilegeangle.curselectdom.text("");
                    self.Privilegeangle.curselectdom.data("PID", null);
                    jQuery.PackResult("IWorkPrivilegeManage.data?action=FindAllPrivilege", {}, function (data) { self.Privilegeangle.privilegetree.frametree({ treesource: data }); alert("删除成功"); });
                    self.Privilegeangle.grouptree.frametree({ treesource: self.Privilegeangle.AllGroupSource });
                    self.Privilegeangle.usertree.frametree({ treesource: self.Privilegeangle.AllUserSource });
                });
            });

            self.Privilegeangle.rootdom = dom;
            self.Privilegeangle.curselectdom = dom.find("[iwftype=curselect]");
            self.Privilegeangle.grouptree = dom.find("[treetype=group]");//组
            self.Privilegeangle.privilegetree = dom.find("[treetype=privilege]");//权限
            self.Privilegeangle.usertree = dom.find("[treetype=user]");//用户
            self.Privilegeangle.UserMenu.find("[action=abort]").mousedown(function () {
                var frametreeObj = self.Privilegeangle.usertree;
                var obj = frametreeObj.frametree("GetCurSelectNode");
                var flag = obj.value.lstType.Contains("P");
                if (flag == false) {
                    obj.value.lstType.unshift("P");
                }
                obj.value.name = obj.value.primevalName + "(" + obj.value.lstType.join(",") + ")";
                obj.value.check = false;
                frametreeObj.frametree("EditThis", obj.dom, obj.value, obj.value.name);
                frametreeObj.frametree("SetDisabledCheckBox", obj.dom, obj.value.check)
            });
            self.Privilegeangle.UserMenu.find("[action=open]").mousedown(function () {
                var frametreeObj = self.Privilegeangle.usertree;
                var obj = frametreeObj.frametree("GetCurSelectNode");
                var flag = obj.value.lstType.Contains("P");
                if (flag == false) {
                    obj.value.lstType.unshift("P");
                }
                obj.value.name = obj.value.primevalName + "(" + obj.value.lstType.join(",") + ")";
                obj.value.check = true;
                frametreeObj.frametree("EditThis", obj.dom, obj.value, obj.value.name);
                frametreeObj.frametree("SetDisabledCheckBox", obj.dom, obj.value.check)
            });
            self.Privilegeangle.UserMenu.find("[action=remove]").mousedown(function () {
                var frametreeObj = self.Privilegeangle.usertree;
                var obj = frametreeObj.frametree("GetCurSelectNode");
                var flag = obj.value.lstType.Contains("P");
                if (flag == true) {
                    obj.value.lstType.RemoveItem("P");
                }
                if (obj.value.lstType.length > 0) {
                    obj.value.name = obj.value.primevalName + "(" + obj.value.lstType.join(",") + ")";
                    obj.value.check = true;
                }
                else {
                    obj.value.name = obj.value.primevalName;
                    obj.value.check = false;
                }
                frametreeObj.frametree("EditThis", obj.dom, obj.value, obj.value.name);
                frametreeObj.frametree("SetDisabledCheckBox", obj.dom, obj.value.check)
            });
            self.Privilegeangle.rootdom.find("[iwftype=save]").click(function () {
                self.Privilegeangle.rootdom.trigger("focus");
                var PID = self.Privilegeangle.curselectdom.data("PID");
                if (PID == null) { alert("未选择任何人"); return; }
                //
                var Userarr = self.Privilegeangle.usertree.frametree("GetSchemaEndNodes").PickByField("value");
                var Grouparr = self.Privilegeangle.grouptree.frametree("GetAllCheckNodes").PickByField("id");
                var param = new Object();

                param.PID = PID;
                param.ListGID = JSON.stringify(Grouparr);
                param.ListUserTree = JSON.stringify(Userarr);
                jQuery.PackResult("IWorkPrivilegeManage.data?action=SavePrivilegeSetting", param, function (data) {
                    RefreshTab(dom);//(权限视角<保存完毕>后刷新Tab)
                    alert("保存成功");
                });
            });


            self.Privilegeangle.init();
        }
        //刷新
        this.Refresh = function () {
            root.children().remove();
        };

        //给某个视角置位，让他下次切换回来后可以重新初始化
        function RefreshTab(dom) {
            dom.siblings("div").removeData("Init");
        };

        this.show = function (module, root) {
            if (root.children().length == 0) {
                root.load("fx/sys/tab.html", function () {
                    var Tabdom = root.find("[data-id=tabmodel-MaxPrivilege]");
                    //对一些按钮浮动布局
                    root.find("[divtype=fixbar]").each(function () {
                        var EmptyDiv = $(this).outerHeight();
                        $("<div></div>").height($(this).outerHeight()).insertAfter($(this));
                        $(this).css("position", "fixed");
                    });
                    //视角切换
                    root.iwfTab({
                        tabchange: function (dom) {
                            //防止重复初始化，默认显示权限组
                            var viewingangle = dom.attr("viewingangle");
                            if (dom.data("Init") == "true") return;
                            dom.data("Init", "true");
                            switch (viewingangle) {
                                case "Work":
                                    Workangle(dom);//权限组
                                    break;
                                case "User":
                                    Userangle(dom);//用户
                                    break;
                                case "Privilege":
                                    Privilegeangle(dom);//权限
                                    break;
                                default:
                                    break;
                            }
                        }
                    });

                    //
                    root.find("[iwftype =UserToolBar]").each(function () {

                        var Btn_Fold = $(this).find("[iwftype=fold]");
                        var Btn_UnFold = $(this).find("[iwftype=unfold]");
                        var TREE = $(this).parent().find("ul");
                        Btn_Fold.click(function () {
                            TREE.frametree("UnExpandAllNodes");
                        });
                        Btn_UnFold.click(function () {
                            TREE.frametree("ExpandAllNodes");
                        });
                    });
                    //


                });
            } else {



            }
        };
    }
});