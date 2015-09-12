define(new function () {
    var root;
    var self = this;
    var models = {};
    var cutData = null;
    var fileTypeModel;//用于添加
    var listFileType;//又框表数据

    //树状图初始化
    self.setting = {
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false,
            nameIsHTML: true
            //addHoverDom: addHoverDom,
            //removeHoverDom: removeHoverDom
        },
        //check: {
        //    enable: true
        //},
        data: {
            simpleData: {
                enable: true,
                idKey: "FileTypeId",
                pIdKey: "ParentId",
                rootPId: "1"
                , nameCol: "name"           //设置 zTree 显示节点名称的属性名称,此处默认为name 
            }
        },
        callback: {//回调涵数
            beforeClick: function (treeId, treeNode) {//单击
                if (treeNode.isParent) {
                    self.ztr.expandNode(treeNode);
                }
            },
            //onRightClick: zTreeOnRightClick
        }
    };

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/OASet/DocSet.html", function () {
            //添加节点
            root.find("[data-id='addSon']").bind("click", function () {
                showAddDocumentWindow(fileTypeModel, "add");
            });
            //删除节点
            root.find("[data-id='deleteBtn']").bind("click", function () {
                deleteData(function (callback) {
                });
            });
            //修改节点
            root.find("[data-id='editSon']").bind("click", function () {
                var node = self.ztr.getSelectedNodes()[0];
                if (node == null) {
                    $.Com.showMsg("请选择节点");
                    return;
                }
                var fileTypeId = node.FileTypeId;
                $.fxPost("DocumentCenterSvc.data?action=GetFileTypeByFileTypeId", { fileTypeId: fileTypeId }, function(ret) {
                    showEditDocumentWind(ret.fileType, function() {
                        
                    });
                });
            });

            //搜索节点按钮
            root.find("[data-id='dataValue']").bind("keyup", function () {
                var a = root.find("[data-id='dataValue']")[0].value;

                //取出所有的元素
                var choiceNodes = self.ztr.getNodesByParamFuzzy("name", a, null);
                //隐藏所有节点
                for (var i = 0 ; i < self.ztr.getNodes().length; i++) {
                    setTreeVisible(self.ztr.getNodes()[i]);
                }
                var nodes = self.ztr.getNodesByParam("visible", false);
                self.ztr.hideNodes(nodes);

                //显示相关节点
                for (var j = 0 ; j < choiceNodes.length; j++) {
                    if (a != "") {
                        choiceNodes[j].name = "<font color='red'>" + choiceNodes[j].name + "</font>";
                    }
                    //跟新name的样式
                    self.ztr.updateNode(choiceNodes[j]);
                    //那么它的所有上级节点和所有下级节点都设置为“可见”【先序遍历法】
                    setTreeVisible_LowerLevel(choiceNodes[j]);
                    setTreeVisible_HigherLevel(choiceNodes[j]);
                }
                var showNodes = self.ztr.getNodesByParam("visible", true);
                self.ztr.showNodes(showNodes);
                //self.ztr.reAsyncChildNodes(null, "refresh");
                self.ztr.expandAll(true);
            });

            //剪切
            root.find("[data-id='cutBtn']").bind("click", function () {
                var node = self.ztr.getSelectedNodes()[0];
                if (node == null || node == undefined || node == "") {
                    $.Com.showMsg("请选择节点");
                    return;
                }
                cutData = node;
            });

            //粘贴
            root.find("[data-id='attachBtn']").bind("click", function () {
                var node = self.ztr.getSelectedNodes()[0];
                if (node == null || node == undefined || node == "") {
                    $.Com.showMsg("请选择节点");
                    return;
                }
                if (cutData == null || cutData == undefined || cutData == "") {
                    $.Com.showMsg("请选择要剪切的节点");
                    return;
                }
                $.fxPost("DocumentCenterSvc.data?action=EdtiParent", { id: cutData.FileTypeId, parentId: node.FileTypeId }, function (ret) {
                    loadData();
                });
            });
            loadData();
            initUILayout();
        });
    }

    //左右布局显示，左边列表，右边表单，增加到resize,和界面完成初始化
    function initUILayout() {
        root.find(".leftPanel").height(root.height() - 100).css("overflow-y", "auto").css("overflow-x", "hidden");
    }

    // 设置树节点为“不可见”状态【先序遍历法】
    function setTreeVisible(allNodes) {
        //取出name的样式
        allNodes.name = allNodes.name.replace(/<[^>]+>/g, "");
        allNodes.visible = false;
        self.ztr.updateNode(allNodes);
        if (allNodes.children && allNodes.children.length != 0) {
            for (var i = 0; i < allNodes.children.length; i++) {
                setTreeVisible((allNodes.children)[i]);
            }
        }
    }


    // 设置树节点为“可见”状态【先序遍历法】
    function setTreeVisible_LowerLevel(tree) {
        tree.visible = true;
        if (tree.children && tree.children.length != 0) {
            for (var i = 0; i < tree.children.length; i++) {
                setTreeVisible_LowerLevel((tree.children)[i]);
            }
        }
    }

    // 设置当前节点及其所有上级节点为“可见”状态
    function setTreeVisible_HigherLevel(tree) {
        tree.visible = true;
        if (tree.getParentNode() != null) {
            setTreeVisible_HigherLevel(tree.getParentNode());
        }
    }


    //编辑文件夹弹窗
    function showEditDocumentWind(fileType,callback) {
        initModel();
        var dlgOpts = {
            title: '修改节点', width: 600, height: 500,
            button: [
           {
               text: '确定', handler: function () {
                   var da = models.newDocumentModel.getData();
                   if (da.FileTypeName == '' || da.FileTypeName == null) {
                       $.Com.showMsg("文件夹名称不能为空！");
                       return;
                   }
                   var json = JSON.stringify(da);
                   var parent = JSON.stringify(fileType);
                   $.fxPost("/DocumentCenterSvc.data?action=SaveFileType", { JSONData: json, Parent: parent }, function (ret) {
                       var da = ret.dataTable[0];
                       self.ztr.getSelectedNodes()[0].name = da.name;
                       self.ztr.getSelectedNodes()[0].FileTypeName = da.FileTypeName;
                       self.ztr.updateNode(self.ztr.getSelectedNodes()[0]);
                       callback(da);
                       win.close();
                   });
               }
           },
          {
              text: '取消', handler: function () {
                  win.close();
              }
          }
            ]
        };
        var win = $.Com.showFormWin(fileType, function () {
        }, models.newDocumentModel, root.find("[data-id='addDocumentClassWindow']"), dlgOpts);
    }

    function deleteData(callback) {
        var node = self.ztr.getSelectedNodes()[0];
        if (node == null || node == undefined || node == "")
            return;
        var msg = "是否要删除此节点？";
        if (confirm(msg) == true) {
            var json = JSON.stringify(self.ztr.getSelectedNodes()[0]);
            $.fxPost("/DocumentCenterSvc.data?action=DeleteFileType", { JSONData: json }, function (ret) {
                if (!ret.success) {
                    alert(ret.msg);
                    return;
                }
                self.ztr.removeNode(node);
                callback(true);
            });
        }
    }

    //添加文件夹弹窗
    function showAddDocumentWindow(newData, type) {
        var parentData = self.ztr.getSelectedNodes()[0];
        if (parentData == null || parentData == undefined || parentData == "") {
            $.Com.showMsg("请选择节点");
            return;
        }
        initModel();
        var title = "";
        if (type == "add") {
            title = "新增子类文件夹";
            newData.ParentId = parentData.FileTypeId;
            //代码目录
            newData.CodePath = parentData.CodePath;
        }
        var dlgOpts = {
            title: title, width: 600, height: 500,
            button: [
           {
               text: '确定', handler: function () {
                   var da = models.newDocumentModel.getData();
                   if (da.FileTypeName == '' || da.FileTypeName == null) {
                       $.Com.showMsg("文件夹名称不能为空！");
                       return;
                   }
                   var json = JSON.stringify(da);
                   var parent = JSON.stringify(parentData);
                   $.fxPost("/DocumentCenterSvc.data?action=SaveFileType", { JSONData: json, Parent: parent }, function (ret) {
                       if (type == "add") {
                           var dataNew = ret.dataTable[0];
                           self.ztr.addNodes(self.ztr.getSelectedNodes()[0], dataNew);
                       }
                       win.close();
                   });
               }
           },
          {
              text: '取消', handler: function () {
                  win.close();
              }
          }
            ]
        };
        var win = $.Com.showFormWin(newData, function () {
        }, models.newDocumentModel, root.find("[data-id='addDocumentClassWindow']"), dlgOpts);
    }

    function initModel() {
        models.newDocumentModel = $.Com.FormModel({
            beforeBind: function (vm, root) {
                vm.choiceDefUrl = function () {
                    $.Biz.DefinitionViewWin(function (data) {
                        if (data != null) {
                            models.newDocumentModel.viewModel.linkId(data.id());
                            models.newDocumentModel.viewModel.linkName(data.name());
                            models.newDocumentModel.viewModel.linkUrl(data.linkName());
                        }
                    })
                }
            }
        });
    }

    function loadData() {
        var docTree = root.find("[data-id='docTree']");
        docTree.empty();
        $.fxPost("B_OA_DocSetSvc.data?action=GetData", {}, function (ret) {
            require(["script/ztree/jquery.ztree.exhide-3.5"], function () {
                self.ztr = $.fn.zTree.init(docTree, self.setting, ret.dataTable); //初始化树型菜单
            });
            fileTypeModel = ret.fileModel;
        });
    }
});