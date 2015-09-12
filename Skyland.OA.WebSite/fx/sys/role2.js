define(function () {
    return new function () {
        var self = this;
        var root;
        this.options = { key: 'MaxRoleManage' };

        var userModel, roleModel;

        function call() { }

        function addRole() {
            var win = $('body').iwfWindow({
                title: '新建角色组',
                width: 400,
                height: 300,
                button: [{
                    text: '确定', handler: function (data) {
                        var param = new Object();

                        param.PRID = $.trim(win.dialogdom.find("[field=PRID]").val());
                        param.RoleName = $.trim(win.dialogdom.find("[field=RoleName]").val());

                        param.FullName = win.dialogdom.find("[field=FullName]").val();

                        if (param.RoleName == "" || param.RoleName == null) { alert("角色名是必填项"); return; }

                        //
                        jQuery.PackResult("IWorkRoleManage.data?action=CreateRole", param, function (data) {
                            userModel.refresh();

                            $.Com.showMsg("角色添加成功！", '提示', null, function () {
                                win.close();
                            })

                        });
                        //

                    }
                }, {
                    text: '取消', handler: function () { win.close(); }
                }]
            });
            win.load("fx/sys/CreateRole.html");
        }

        function editRole() {
            var curRole = roleModel.get();

            if (curRole == null) return;

            var win = $('body').iwfWindow({
                title: '新建角色组',
                width: 400,
                height: 300,
                button: [{
                    text: '确定', handler: function (data) {
                        var param = new Object();

                        param.PRID = $.trim(win.dialogdom.find("[field=PRID]").val());
                        param.RoleName = $.trim(win.dialogdom.find("[field=RoleName]").val());

                        param.FullName = win.dialogdom.find("[field=FullName]").val();

                        if (param.RoleName == "" || param.RoleName == null) { alert("角色名是必填项"); return; }

                        //
                        jQuery.PackResult("IWorkRoleManage.data?action=EditRole", param, function (data) {
                            userModel.refresh();

                            $.Com.showMsg("角色编辑成功！", '提示', null, function () {
                                win.close();
                            })

                        });
                        //

                    }
                }, {
                    text: '取消', handler: function () { win.close(); }
                }]
            });
            win.load("fx/sys/CreateRole.html", function () {
                win.content().find("[field=RoleName]").val(curRole.name);
            });
        }


        function save() {
            var curRole = roleModel.get();
            var curUser = userModel.get();

            if (curRole == null || curUser == null) return;
            var param = {
                ListUser: JSON.stringify(curUser.PickByField("id")),
                RID: curRole.id
            }
            jQuery.PackResult("IWorkRoleManage.data?action=SaveRole", param, function (data) {
                $.Com.showMsg("保存成功！", '提示');
            });
        }

        function delRole() {
            var curRole = roleModel.get();

            if (curRole == null) return;
            $.Com.confirm("是否删除角色: " + curRole.name, function () {
                jQuery.PackResult("IWorkRoleManage.data?action=DeleteRole", { id: curRole.id }, function (data) {
                    roleModel.refresh();
                    $.Com.showMsg("删除成功");
                });
            });
        }

        this.show = function (module, r) {
            root = r;
            var toolData = [
             { text: '角色视图', handler: call, iconCls: 'fa fa-save', css: 'btn-info' },
             { text: '用户视图', handler: call },
             { text: '保存', handler: save },
             { text: '删除角色', handler: delRole },
             { text: '新增角色', handler: addRole },
             { text: '重命名', handler: call }

            ];

            var toolDiv = $('<div data-id="toolbar" class="pageTitle iwf-toolbar"> </div>').appendTo(root);

            toolDiv.iwfToolbar({ data: toolData });

            root.append('<div style="margin:0;"><div style="float: left;width: 34%;height:100%;overflow-y:auto;padding:10px;"></div><div style="float: left;width: 66%;height:100%;overflow-y:auto;padding:10px;"></div></div>');
            var leftDiv = root.children().last().children().first();
            var rightDiv = root.children().last().children().last();

            $.iwf.getModel("fx/control/users", function (model) {
                userModel = model;
                model.show({ multi: true }, rightDiv);
            })
            $.iwf.getModel("fx/control/roles", function (model) {
                roleModel = model;
                model.show({
                    onClick: function (r) {
                        jQuery.PackResult("IWorkRoleManage.data?action=FindAllUserByRID", { "RID": r.id }, function (result) {
                            userModel.set(result);
                        });
                    }
                }, leftDiv);
            })
            root.children().last().height(root.height() - 70);
        }

        this.resize = function (w, h) {
            root.children().last().height(h - 70);
        }
    }
});