//$.iwf.register(new function () {
//    var me = this;
//    this.options = { key: 'documentCenterManage' };
//    this.show = function (module, root) {
//        $.Biz.documentCenterManage.show(module, root);
//    };
//});

//$.Biz.documentCenterManage = new function () {
//    var models = {};
//    models.documentModel = { fileTypeId: "", parentId: "", fileTypeName: "", codePath: "" };//右边input绑定实体
//    models.newDocumentModel = { fileTypeName: "", parentId: "", codePath: "" }//弹窗绑定实体
//    models.adetailmodel = $.Com.FormModel({});//添加弹窗的实体

//    this.show = function (module, _root) {
//        root = _root;
//        if (root.children().length != 0) return;

//        root.load("models/OA_Notice/DocumentCenterManage.html", function () {
//            loadData();


//            //子级菜单添加
//            root.find("[data-id='addChildrenLevel']").bind("click", function () {
//                models.newDocumentModel.fileTypeName = "";//文件名称清空
//                models.newDocumentModel.parentId = "";//文件名称清空
//                models.newDocumentModel.codePath = "";//编号路径清空（下拉）
//                models.newDocumentModel.parentId = models.documentModel.fileTypeId;//父类文件类型
//                models.newDocumentModel.codePath = models.documentModel.codePath;//父类编号路径
//                showDocumentWindows(models.newDocumentModel, '1');
//            });

//            //修改保存
//            root.find("[data-id='saveData']").bind("click", function () {
//                //var da = { parentId: "", fileTypeId: "", fileTypeName: "",codePath:"" };
//                //da.parentId = models.documentModel.parentId;
//                //da.fileTypeId = models.documentModel.fileTypeId;
//                //da.fileTypeName = root.find("[data-id='inputDocument']").val();
//                //da.codePath = models.documentModel.codePath;
//                models.documentModel.fileTypeName = root.find("[data-id='inputDocument']").val()//取文件夹名称
//                var content = JSON.stringify(models.documentModel);
//                $.post("DocumentCenterSvc.data?action=SaveData", { JsonData: content }, function (res) {
//                    var json = eval('(' + res + ')');
//                    if (!json.success) {
//                          $.Com.showMsg(json.msg);
//                        return;
//                    }
//                    var NewsTextDiv = root.find("[data-id='documentCenterManageTreeMenu']");
//                    NewsTextDiv.empty(); //删除被选元素的子元素。
//                    loadData();//刷新
//                });
//            });

//            //删除
//            root.find("[data-id='deleteData']").bind("click", function () {
//                var id = models.documentModel.fileTypeId;
//                if (id == "" || id == null) {
//                      $.Com.showMsg("请选择相应目录");
//                    return;
//                }
//                $.post("DocumentCenterSvc.data?action=DeleteData", { id: id }, function (res) {
//                    var json = eval('(' + res + ')');
//                    if (!json.success) {
//                          $.Com.showMsg(json.msg);
//                        return;
//                    }
//                    var NewsTextDiv = root.find("[data-id='documentCenterManageTreeMenu']");
//                    NewsTextDiv.empty(); //删除被选元素的子元素。
//                    models.documentModel.parentId = "";
//                    models.documentModel.fileTypeId = "";
//                    models.documentModel.fileTypeName = "";
//                    models.documentModel.codePath = "";
//                    root.find("[data-id='inputDocument']").val("");
//                    loadData();//刷新
//                });
//            });
//        });
//    }
//    //加载数据
//    function loadData() {
//        $.fxPost("DocumentCenterSvc.data?action=GetData", "", function (ret) {

//            models.options = {
//                expandbyClick: true,  	//是否点击父节点展开子节点
//                //flowlayout: 100,	//叶子节点宽度
//                expandable: true, 	//是否可展开
//                data: [],
//                itemclick: function (item, element) {
//                    root.find("[data-id='inputDocument']").val(item.text);
//                    models.documentModel.fileTypeId = item.id;
//                    models.documentModel.parentId = item.title;
//                    models.documentModel.fileTypeName = item.text;
//                    models.documentModel.codePath = item.codePath;
//                }
//            };
//            //加载根节点
//            if (ret.data.length > 0) {
//                for (var i = 0; i < ret.data.length; i++) {
//                    if (ret.data[i].ParentId == "0") {
//                        var singleData = ret.data[i];
//                        models.options.data.push({
//                            type: 'group',
//                            title: singleData.ParentId,
//                            text: singleData.FileTypeName,
//                            id: singleData.FileTypeId,
//                            codePath: singleData.CodePath,
//                            children: recursion(ret.data, singleData)
//                        });
//                    }
//                }
//            }

//            var height = window.innerHeight;
//            root.find("[data-id='listDiv']").attr("style", "height:" + height + "px;");
//            var tmHeight = root.find("[data-id='listDiv']").height();
//            root.find('[data-id="documentCenterManageTreeMenu"]').attr("style", "overflow-y: auto;height: " + tmHeight + "px");
//            $('[data-id="documentCenterManageTreeMenu"]').listView2(models.options);

//            //var height = window.innerHeight;
//            //root.find("[data-id='dataDocumentName']").attr("style", "height:" + height * 0.82 + "px;");
//            //var tmHeight = root.find("[data-id='dataDocumentName']").height();
//            //root.find('[data-id="treeMenu"]').attr("style", "overflow-y: auto;height: " + tmHeight + "px");
//            //$('[data-id="treeMenu"]').listView2(models.options);
//        });
//    }

//    //迭代函数
//    function recursion(data, parentItem) {
//        var childrenData = $(data).filter(function (index, item) {
//            if (item.ParentId == parentItem.FileTypeId)
//                return true;
//        });
//        if (!childrenData || childrenData.length == 0) { //递归出口
//            return [];
//        }
//        var childrenItems = [];
//        for (var a = 0; a < childrenData.length; a++) {
//            //循环迭代子节点
//            childrenItems.push({
//                id: childrenData[a].FileTypeId,
//                title: childrenData[a].ParentId,
//                text: childrenData[a].FileTypeName,
//                codePath: childrenData[a].CodePath,
//                children: recursion(data, childrenData[a])//递归子节点
//            });
//        }
//        return childrenItems;
//    }


//    //添加文件夹弹窗，0是添加同级菜单1是添加子菜单
//    function showDocumentWindows(item, type) {
//        if (item.parentId == "") {
//              $.Com.showMsg("请选择文件夹后操作！");
//            return;
//        }

//        if (type == "0") {
//            var titleName = "添加同级文件夹";
//        } else {
//            var titleName = "添加子级文件夹";
//        }
//        var dlgOpts = {
//            title: titleName, width: 500, height: 400,
//            button: [
//                {
//                    text: '保存', handler: function (data) {
//                        var da = models.adetailmodel.getData();
//                        var content = JSON.stringify(da);
//                        $.post("DocumentCenterSvc.data?action=SaveData", { JsonData: content }, function (res) {
//                            var json = eval('(' + res + ')');
//                            if (!json.success) {
//                                  $.Com.showMsg(json.msg);
//                                return;
//                            }
//                            win.close();
//                            var NewsTextDiv = root.find("[data-id='documentCenterManageTreeMenu']");
//                            NewsTextDiv.empty(); //删除被选元素的子元素。
//                            loadData();//刷新
//                        })
//                    }
//                },
//          {
//              text: '取消', handler: function () { win.close(); }
//          }
//            ]
//        }
//        var win = $.Com.showFormWin(item, function () {
//        }, models.adetailmodel, root.find("[data-id='documentWindows']"), dlgOpts);
//    }
//};
