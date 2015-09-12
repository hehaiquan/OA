define(function () {
    return new function () {
        {
            var self = this;
            this.options = { key: 'MaxUserManage' };
            this.modifytime = new Date().getTime();

            var GetAllUserService = "IWorkUserManage.data?action=FindAllTheStaff";
            var RootDir = "fx/sys/";

            //获取本目录文件路径，带时间戳
            function GetAbsolutePath(path) {
                return RootDir + path + "?ver=" + self.modifytime;
            }


            this.UserMange = {
                tree: "",
                menu: null,
                formUserInfo: "",
                formUserSaveBtn: "",
                init: function () {
                    var me = this;
                    jQuery.PackResult(GetAllUserService, {}, function (data) {
                        me.tree.frametree({
                            treesource: data,
                            checkbox: false,
                            drag: true,
                            IsBanDrag_NotSiblings: true,
                            IshasContextmenu: true,
                            contextmenu: me.menu,
                            changedomEvent: function (event, data) {
                                if (data.Target.IsEndLI) {
                                    var ID = data.Target.parentvalue.id;
                                    if (!lstChangeDepartment.Contains(ID)) lstChangeDepartment.push(ID);
                                }
                                if (!Btn_SaveRank.is(":visible")) Btn_SaveRank.show();
                            },
                            node_rightclick: function (event, data) {
                                me.menu.find("li").hide();
                                if (data.level == 0) {
                                    me.menu.find("[action=CreateDir]").show();
                                }
                                if (data.level == 1) {
                                    me.menu.find("[action=EditDir],[action=Create],[action=removeDir]").show();
                                }
                                if (data.level == 2) {
                                    me.menu.find("[action=remove]").show();
                                    //如果不要就不理下面的话，注释掉即可注释停用用户功能
                                    if (data.value.IcoClass != "ico_abort") me.menu.find("[action=pause]").show();
                                    if (data.value.IcoClass == "ico_abort") me.menu.find("[action=resume]").show();
                                }
                            }, node_click: function (event, data) {
                                me.formUserInfo.hide();
                                if (data.level == 2) dealUserInfo(me.formUserInfo, data.id);
                            }
                        });
                        me.tree.frametree("UnExpandAllNodes", 1);
                    });
                }
            }
            var vm_user;

            //展示用户详细信息
            function dealUserInfo(dom, id) {
                dom.show();
                jQuery.PackResult("IWorkUserManage.data?action=GetUserInfobyid", { "id": id }, function (data) {
                    var userinfo = data._userinfo
                    var lstDepartment = data._lst_department;
                    dom.find("[field=UserID]").text(userinfo.UserID);
                    dom.find("[field=EnName]").val(userinfo.EnName);
                    dom.find("[field=CnName]").val(userinfo.CnName);
                    dom.find("[field=DPID]").text("");
                    $.each(lstDepartment, function (index, ent) {
                        var opt = $("<option></option>").val(ent.DPID).text(ent.DPName);
                        dom.find("[field=DPID]").append(opt);
                    });
                    dom.find("[field=DPID]").val(userinfo.DPID);
                    dom.find("[field=PWD]").val(userinfo.PWD);
                    dom.find("[field=Phone]").val(userinfo.Phone);
                    self.UserMange.formUserSaveBtn.unbind("click");
                    self.UserMange.formUserSaveBtn.bind("click", function () {
                        var update = new Object();
                        update.UserID = userinfo.UserID;
                        update.EnName = $.trim(dom.find("[field=EnName]").val());
                        update.CnName = $.trim(dom.find("[field=CnName]").val());
                        update.DPID = $.trim(dom.find("[field=DPID]").val());
                        update.PWD = $.trim(dom.find("[field=PWD]").val());
                        update.Phone = $.trim(dom.find("[field=Phone]").val());
                        jQuery.PackResult("IWorkUserManage.data?action=SaveUserInfo", update, function (data) {
                            jQuery.PackResult(GetAllUserService, {}, function (data) {
                                self.UserMange.tree.frametree({ treesource: data });
                                self.UserMange.tree.frametree("UnExpandAllNodes", 1);
                            });
                            alert("保存成功");
                        });
                    });
                });
            }

            //初始化整个场景
            function UserMange(dom) {
                //菜单
                var UserMenuStr = '<div  style="position: absolute; left: 0px; top: 0px; background-color: #ead8d8; display: none">'
                                             + '<ul class="frametreeMenu"><li action="CreateDir">新建部门</li><li action="EditDir">重命名部门</li><li action="Create">添加用户</li><li action="pause">停用用户</li><li action="resume">启用用户</li><li action="remove">删除用户</li><li action="removeDir">删除部门</li></ul>'
                                             + '</div>';
                self.UserMange.tree = dom.find("[treetype=User]");
                self.UserMange.formUserInfo = dom.find("[formtype=KOUserInfo]").hide();
                self.UserMange.formUserSaveBtn = self.UserMange.formUserInfo.find("[action=save]");
                if (self.UserMange.menu == null) { self.UserMange.menu = $(UserMenuStr); $('body').append(self.UserMange.menu); }

                //新建部门
                self.UserMange.menu.find("[action=CreateDir]").mousedown(function () {
                    var obj = self.UserMange.tree.frametree("GetCurSelectNode");
                    var win = $('body').iwfWindow({
                        title: '新建部门',
                        width: 400,
                        height: 230,
                        button: [{
                            text: '确定', handler: function (data) {
                                var param = new Object();
                                param.DPName = $.trim(win.dialogdom.find("[field=DPName]").val());
                                if (param.DPName == "" || param.DPName == null) { alert("部门名是必填项"); return; }
                                jQuery.PackResult("IWorkUserManage.data?action=CreateDepartment", param, function (data) {
                                    win.close();
                                    var value = new Object();
                                    value["id"] = data["DPID"];
                                    value["name"] = data["DPName"];
                                    self.UserMange.tree.frametree("AppendDirCreate", obj.dom, value);
                                    alert("创建成功");
                                });
                            }
                        }, {
                            text: '取消', handler: function () { win.close(); }
                        }]
                    });
                    win.load(GetAbsolutePath("CreateDir2.html"), function () {
                        win.dialogdom.find("[field=DPName]").val("未命名");
                    });
                });
                //编辑部门
                self.UserMange.menu.find("[action=EditDir]").mousedown(function () {
                    var obj = self.UserMange.tree.frametree("GetCurSelectNode");
                    var win = $('body').iwfWindow({
                        title: '重命名部门',
                        width: 300,
                        height: 200,
                        button: [{
                            text: '确定', handler: function (data) {
                                var param = new Object();
                                param.DPID = obj.id;
                                param.DPName = $.trim(win.dialogdom.find("[field=DPName]").val());
                                if (param.DPName == "" || param.DPName == null) { alert("部门名是必填项"); return; }
                                jQuery.PackResult("IWorkUserManage.data?action=EditDepartment", param, function (data) {
                                    obj.name = param.DPName;
                                    obj.value.name = param.DPName;
                                    win.close();
                                    self.UserMange.tree.frametree("EditThis", obj.dom, obj.value);
                                    alert("重命名成功");
                                });
                            }
                        }, {
                            text: '取消', handler: function () { win.close(); }
                        }]
                    });
                    win.load(GetAbsolutePath("EditDir2.html"), function () {
                        win.dialogdom.find("[field=DPName]").val(obj.name)[0].select();
                    });
                });
                //添加用户
                self.UserMange.menu.find("[action=Create]").mousedown(function () {
                    var obj = self.UserMange.tree.frametree("GetCurSelectNode");
                    var win = $('body').iwfWindow({
                        title: '添加人员',
                        width: 400,
                        height: 230,
                        button: [{
                            text: '确定', handler: function (data) {
                                var param = new Object();
                                param.DPID = obj.id;
                                param.EnName = $.trim(win.dialogdom.find("[field=EnName]").val());
                                param.PWD = $.trim(win.dialogdom.find("[field=PWD]").val());
                                param.CnName = $.trim(win.dialogdom.find("[field=CnName]").val());
                                jQuery.PackResult("IWorkUserManage.data?action=AppendUser", param, function (data) {
                                    win.close();
                                    var value = new Object();
                                    value["id"] = data["UserID"];
                                    value["name"] = data["CnName"];
                                    self.UserMange.tree.frametree("AppendCreate", obj.dom, value);
                                    alert("添加成功");
                                });
                            }
                        }, {
                            text: '取消', handler: function () { win.close(); }
                        }]
                    });
                    win.load(GetAbsolutePath("AppendUser2.html"), function () {
                        win.dialogdom.find("[field=EnName]").val("未命名");
                        win.dialogdom.find("[field=PWD]").val("1");
                        win.dialogdom.find("[field=CnName]").val("未命名");
                    });

                });
                //移除用户
                self.UserMange.menu.find("[action=remove]").mousedown(function () {
                    if (!confirm("是否确定删除,一旦删除该人则删除对应角色和权限对应表,且无法恢复")) return;
                    self.UserMange.formUserInfo.hide();
                    var obj = self.UserMange.tree.frametree("GetCurSelectNode");
                    var param = new Object();
                    param.ID = obj.id;
                    jQuery.PackResult("IWorkUserManage.data?action=DeleteUser", param, function (data) {
                        self.UserMange.tree.frametree("DeleteThis", obj.dom);
                        alert("删除成功");
                    });
                });
                //停用用户
                self.UserMange.menu.find("[action=pause]").mousedown(function () {
                    self.UserMange.formUserInfo.hide();
                    var obj = self.UserMange.tree.frametree("GetCurSelectNode");

                    var param = new Object();
                    param.ID = obj.id;
                    jQuery.PackResult("IWorkUserManage.data?action=PauseUser", param, function (data) {
                        obj.value["IcoClass"] = "ico_abort";
                        self.UserMange.tree.frametree("UpdateThisAll", obj.dom, obj.value);
                        //alert("完成")
                    });
                });
                //启用用户
                self.UserMange.menu.find("[action=resume]").mousedown(function () {
                    self.UserMange.formUserInfo.hide();
                    var obj = self.UserMange.tree.frametree("GetCurSelectNode");
                    var param = new Object();
                    param.ID = obj.id;
                    jQuery.PackResult("IWorkUserManage.data?action=ResumeUser", param, function (data) {
                        obj.value["IcoClass"] = "";
                        self.UserMange.tree.frametree("UpdateThisAll", obj.dom, obj.value);
                        //alert("完成")
                    });
                });
                //移除部门
                self.UserMange.menu.find("[action=removeDir]").mousedown(function () {
                    var obj = self.UserMange.tree.frametree("GetCurSelectNode");
                    var param = new Object();
                    param.DPID = obj.id;
                    jQuery.PackResult("IWorkUserManage.data?action=DeleteDepartment", param, function (data) {
                        self.UserMange.tree.frametree("DeleteThis", obj.dom);
                        alert("删除成功");
                    });
                });


                self.UserMange.init();
            }


            var Btn_SaveRank;
            var lstChangeDepartment = [];
            this.show = function (module, root) {
                if (root.children().length == 0) {
                    root.load(GetAbsolutePath("UserList2.html"), function () {
                        UserMange(root.children());


                        var Btn_Fold = root.find("[iwftype=fold]");
                        var Btn_UnFold = root.find("[iwftype=unfold]");
                        Btn_SaveRank = root.find("[iwftype=SaveRank]");
                        var TREE = $(this).find("[treetype=User]");
                        //保存排序
                        Btn_SaveRank.click(function () {
                            var obj = TREE.frametree("GetSchemaObject");
                            var lst = obj[0].children;

                            //jQuery.Loading.open("保存中");
                            $.PackResult("IWorkUserManage.data?action=SaveAllRank", {
                                Content: JSON.stringify(lst),
                                DPIDList: JSON.stringify(lstChangeDepartment)
                            }, function () {
                                //jQuery.Loading.close();
                                lstChangeDepartment = [];
                                Btn_SaveRank.hide();
                                alert("保存成功");
                            });

                        });
                    });
                }
            };

        }
    }
});