define(function () {
    return new function () {
        var self = this;
        this.options = { key: 'MaxDbManage' };

        this.XmlStructure = {
            tree: "",
            menu: ""





        };

        this.show = function (module, root) {
            if (root.children().length == 0) {
                root.load("fx/sys/DbManage.html", function () {
                    var WorkMenuStr = '<div  style="position: absolute; left: 0px; top: 0px; background-color: #ead8d8; display: none">'
                                             + '<ul class="frametreeMenu"><li action="createdir">添加分类</li><li action="create">添加新表</li><li action="edit">编辑类名</li><li action="rename">重命名</li><li action="deletedir">删除分类</li><li action="delete">删除</li></ul>'
                                             + '</div>';
                    var contextMenu = $(WorkMenuStr).appendTo('body');
                    self.XmlStructure.menu = contextMenu;
                    self.XmlStructure.tree = root.find("[treetype=Db]");

                    $.PackResult("IWorkDbManage.data?action=GetTableGroup", {}, function (data) {
                        var NewTable = data.newTreeTable;
                        var AllTable = data.lstAllTable;
                        //初始化树
                        self.XmlStructure.tree.frametree({
                            IshasContextmenu: true,
                            contextmenu: contextMenu,
                            treesource: data.havebeenGroup,
                            checkbox: false,
                            drag: true,
                            IsPreventOutSide: true,
                            commonnodedrag: false,
                            node_rightclick: function (event, data) {
                                contextMenu.find("li").hide();
                                if (data.name == "未分类表") return;
                                if (data.level == 0) contextMenu.find("[action=createdir]").show();
                                if (data.level == 1) { contextMenu.find("[action=edit]").show(); contextMenu.find("[action=create]").show(); contextMenu.find("[action=deletedir]").show(); }
                                if (data.level == 2) { contextMenu.find("[action=rename]").show(); contextMenu.find("[action=delete]").show(); }
                            },
                            node_click: function (event, data) {
                                root.find("[formtype=content]").data("tablename", null);
                                root.find("[formtype=content]").data("tablezhname", null);
                                if (data.level == 2) {
                                    var tablename = data.value.tablename;
                                    var tablezhname = data.value.zhname;
                                    //GetAllFieldInfo
                                    $.PackResult("IWorkDbManage.data?action=GetAllFieldInfo", { "tablename": tablename }, function (resobj) {
                                        if (resobj.length == 0) { root.find("span.tablename").text("未找到该表字段"); root.find(".realtr").empty(); return; }
                                        root.find("[formtype=content]").data("tablename", tablename);
                                        root.find("[formtype=content]").data("tablezhname", tablezhname);
                                        root.find("span.tablename").text(tablename);
                                        var arr = new Array();

                                        $.each(resobj, function (index, ent) {
                                            var obj = new Object();
                                            obj.fieldname = ent.name;
                                            if (ent.type.toLowerCase().indexOf("varchar") == -1) obj.fieldtype = ent.type;
                                            else obj.fieldtype = ent.type + "(" + ent.len + ")";
                                            obj.fieldzhname = ent.zhname;
                                            arr.push(obj);
                                        });

                                        var cloneTmpl = root.find(".template").clone().show();
                                        var Tbody = root.find(".realtr").empty();

                                        $.each(arr, function (index, ent) {
                                            var dom = $(cloneTmpl[0].innerHTML);
                                            dom.find("[field=fieldname]").text(ent["fieldname"]);
                                            dom.find("[field=fieldtype]").text(ent["fieldtype"]);
                                            dom.find("[field=fieldzhname]").val(ent["fieldzhname"]);
                                            dom.find("[action = del]").click(function () {
                                                if (confirm("你决定删除[ " + ent["fieldname"] + " ]字段吗？一旦删除则数据库也会删除(请谨慎)")) {
                                                    $.PackResult("IWorkDbManage.data?action=DeleteField", { "tablename": tablename, fieldname: ent["fieldname"] }, function () {
                                                        dom.remove();
                                                    });
                                                }
                                            });
                                            Tbody.append(dom);
                                        });
                                    });
                                }
                            }
                        });
                        //添加分类
                        self.XmlStructure.menu.find("[action=createdir]").mousedown(function () {
                            var obj = self.XmlStructure.tree.frametree("GetCurSelectNode");
                            var win = $('body').iwfWindow({
                                title: '添加分类',
                                width: 300,
                                height: 230,
                                button: [{
                                    text: '确定', handler: function (data) {
                                        var zhname = $.trim(win.dialogdom.find("[field=TYPE]").val());
                                        var Value = $.extend({}, true, NewTable);
                                        Value.children = new Array();
                                        Value.id = "";
                                        Value.name = zhname;
                                        Value.zhname = "";
                                        self.XmlStructure.tree.frametree("AppendDirCreate", obj.dom, Value, zhname);
                                        win.close();
                                    }
                                }, {
                                    text: '取消', handler: function () { win.close(); }
                                }]
                            });
                            win.load("fx/sys/CreateDir.html", function () {




                            });
                        });
                        //编辑类名
                        self.XmlStructure.menu.find("[action=edit]").mousedown(function () {
                            var obj = self.XmlStructure.tree.frametree("GetCurSelectNode");
                            var win = $('body').iwfWindow({
                                title: '编辑类名',
                                width: 300,
                                height: 230,
                                button: [{
                                    text: '确定', handler: function (data) {
                                        var zhname = $.trim(win.dialogdom.find("[field=TYPE]").val());
                                        var Value = $.extend({}, true, NewTable);
                                        Value.children = new Array();
                                        Value.id = "";
                                        Value.name = zhname;
                                        Value.zhname = "";
                                        self.XmlStructure.tree.frametree("EditThis", obj.dom, Value, zhname);
                                        win.close();
                                    }
                                }, {
                                    text: '取消', handler: function () { win.close(); }
                                }]
                            });
                            win.load("fx/sys/CreateDir.html", function () {

                                win.dialogdom.find("[field=TYPE]").val(obj.name);


                            });
                        });
                        //添加新表
                        self.XmlStructure.menu.find("[action=create]").mousedown(function () {
                            var obj = self.XmlStructure.tree.frametree("GetCurSelectNode");
                            var win = $('body').iwfWindow({
                                title: '添加表',
                                width: 600,
                                height: 230,
                                button: [{
                                    text: '确定', handler: function (data) {
                                        var Value = $.extend({}, true, NewTable);
                                        Value.zhname = $.trim(win.dialogdom.find("[field=zhname]").val());
                                        Value.tablename = $.trim(win.dialogdom.find("[field=tablename]").val());
                                        Value.name = Value.tablename + "(" + Value.zhname + ")";
                                        self.XmlStructure.tree.frametree("AppendCreate", obj.dom, Value, Value.name);
                                        win.close();
                                    }
                                }, {
                                    text: '取消', handler: function () { win.close(); }
                                }]
                            });
                            win.load("fx/sys/Create.html", function () {
                                //AllTable
                                win.dialogdom.find("[field=zhname]").val("未命名");
                                //
                                $.each(AllTable, function (index, ent) {
                                    win.dialogdom.find("[field=tablename]").append("<option value=" + ent + ">" + ent + "</option>");
                                });
                                //win.dialogdom.find("[field=tablename]").val("未命名");
                            });
                        });
                        //重名名
                        self.XmlStructure.menu.find("[action=rename]").mousedown(function () {
                            var obj = self.XmlStructure.tree.frametree("GetCurSelectNode");
                            var win = $('body').iwfWindow({
                                title: '编辑表',
                                width: 300,
                                height: 230,
                                button: [{
                                    text: '确定', handler: function (data) {
                                        var Value = $.extend({}, true, NewTable);
                                        Value.zhname = $.trim(win.dialogdom.find("[field=zhname]").val());
                                        Value.tablename = $.trim(win.dialogdom.find("[field=tablename]").text());
                                        Value.name = Value.tablename + "(" + Value.zhname + ")";
                                        self.XmlStructure.tree.frametree("EditThis", obj.dom, Value, Value.name);
                                        win.close();
                                    }
                                }, {
                                    text: '取消', handler: function () { win.close(); }
                                }]
                            });
                            win.load("fx/sys/Edit.html", function () {

                                win.dialogdom.find("[field=zhname]").val(obj.value.zhname);
                                win.dialogdom.find("[field=tablename]").text(obj.value.tablename);
                            });
                        });
                        //删除
                        self.XmlStructure.menu.find("[action=deletedir],[action=delete]").mousedown(function () {
                            var obj = self.XmlStructure.tree.frametree("GetCurSelectNode");
                            self.XmlStructure.tree.frametree("DeleteThis", obj.dom);
                        });
                        //保存所有配置情况
                        root.find(".save").click(function () {
                            var Schema = self.XmlStructure.tree.frametree("GetSchemaObject");
                            var GetSchema = function (dom) {
                                var arr = new Array();
                                $.each(dom, function (index, ent) {
                                    var obj = new Object();
                                    obj = $.extend({}, true, ent.value);
                                    if (ent.children.length == 0) {
                                        obj.children = [];
                                    }
                                    else {
                                        obj.children = GetSchema(ent.children);
                                    }
                                    arr.push(obj);
                                });
                                return arr;
                            };
                            var result = GetSchema(Schema);
                            var json = JSON.stringify(result);
                            $.PackResult("IWorkDbManage.data?action=SaveUIXml", { "UIJson": json }, function (data) {
                                alert("保存成功");
                            });



                        });
                        //同步字段注释到XML
                        root.find(".savefield").click(function () {
                            var tablename = root.find("[formtype=content]").data("tablename");
                            var tablezhname = root.find("[formtype=content]").data("tablezhname");
                            if (tablename) {
                                var ALlRowNode = root.find(".realtr");
                                var obj = new Object();
                                //
                                ALlRowNode.children("tr").each(function () {
                                    var dom = $(this);
                                    var field = dom.find("[field=fieldname]").text();
                                    var zhname = dom.find("[field=fieldzhname]").val();
                                    obj[field] = zhname;
                                });
                                //
                                $.PackResult("IWorkDbManage.data?action=SaveFieldXml", { fieldJson: JSON.stringify(obj), "tablename": tablename, "zhname": tablezhname }, function (data) {

                                    alert("同步完成");

                                });
                            } else {
                                alert("未选择同步表");
                            }
                        });

                    });
                });
            }
        }
    }
});