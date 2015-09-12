define(new function () {
    var root;
    var self = this;
    var models = {};
    self.tree = null;
    var fileTypeModel;
    var choiceAticelData;
    var noticeModel;
    var haveChoiceTreeData;//用来存储已经选择的信息
    var catelog = [];
    var listFileType;//又框表数据
    var cutData;

    //文章分类表
    models.gridModel = $.Com.GridModel({
        keyColumns: "FileTypeId",//主键字段
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.ComFun.DateTimeToChange(date(), 'yyyy年MM月dd日');
                return d;
            }

            vm.editName = function (da) {
                var node = self.ztr.getNodeByParam("FileTypeId", da.FileTypeId());
                self.ztr.selectNode(node);
                $.fxPost("/DocumentCenterSvc.data?action=GetFileTypeByFileTypeId", { fileTypeId: da.FileTypeId() }, function (ret) {
                    showEditDocumentWind(ret.fileType, function (callback) {
                        //更新表中数据
                        for (var i = 0; i < listFileType.length; i++) {
                            if (listFileType[i].FileTypeId == da.FileTypeId()) {
                                listFileType[i].name = callback.FileTypeName;
                                listFileType[i].sourceType = callback.sourceType;
                                listFileType[i].linkName = callback.linkName;
                                listFileType[i].linkUrl = callback.linkUrl;
                                listFileType[i].remark = callback.remark;
                                listFileType[i].isEffective = callback.isEffective;
                                listFileType[i].isEffectiveName = callback.isEffectiveName;
                                break;
                            }
                        }
                        models.gridModel.show(root.find('[data-id="documentManage"]'), listFileType);
                    });
                });
            };

            vm.deleteData = function (da) {
                var node = self.ztr.getNodeByParam("FileTypeId", da.FileTypeId());
                self.ztr.selectNode(node);
                deleteData(function (callback) {
                    if (callback == true) {
                        //更新表中数据
                        for (var i = 0; i < listFileType.length; i++) {
                            if (listFileType[i].FileTypeId == da.FileTypeId()) {
                                listFileType.splice(i, 1);
                                break;
                            }
                        }
                        models.gridModel.show(root.find('[data-id="documentManage"]'), listFileType);
                    }
                });
            }
        },
        edit: function (item, callback) {
            //var treeNode = self.ztr.getNodeByParam("FileTypeId", item.FileTypeId);
            //haveChoiceTreeData = treeNode;
            //loadDataGridById(haveChoiceTreeData);
        },
        remove: function (row) {
        },
        elementsCount: 10 //分页,默认5
    });

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

                ////var zTree = $.fn.zTree.getZTreeObj("SharefileDeptTree");
                //if (treeNode.isParent) {
                //    //searchfile(null);
                //    return false; //这里反回真被选中的结点才有对象值,false则没对象值
                //} else {
                //    //searchfile(treeNode.deptid.replace(idname, ""), isShare);
                //    // searchfile(treeNode.id, isShare);
                //} 
                var zTree = $.fn.zTree.getZTreeObj("DocumentClassTree");
                if (treeNode.isParent) {
                    zTree.expandNode(treeNode);
                }
                haveChoiceTreeData = treeNode;
                loadDataGridById(haveChoiceTreeData);
            },
            //onRightClick: zTreeOnRightClick
        }
    };

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/DocumentCenter/DocumentClassManage.html", function () {

            loadDataTree("1");

            initUILayout();

            models.gridModel.show(root.find('[data-id="documentManage"]'), []);
            listFileType = [];

            //添加子菜单
            root.find("[data-id='addSon']").bind("click", function () {
                showAddDocumentWindow(fileTypeModel, "add");
            });

            //修改
            root.find("[data-id='editSon']").bind("click", function () {
                var fileType = self.ztr.getSelectedNodes()[0];
                if (fileType == null) {
                    $.Com.showMsg("请选择节点");
                    return;
                } else {
                    $.fxPost("/DocumentCenterSvc.data?action=GetFileTypeByFileTypeId", { fileTypeId: fileType.FileTypeId }, function (ret) {
                        showEditDocumentWind(ret.fileType, function () {

                        });
                    });
                }

            });

            //增加父节点
            root.find("[data-id='m_addFather']").bind("click", function () {
                showAddDocumentWindow(fileTypeModel, "addFather");
            });

            //删除节点
            root.find("[data-id='deleteBtn']").bind("click", function () {
                deleteData(function (callback) {
                });
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
                    loadDataTree("1");
                });
            });

            //展开
            root.find("[data-id='spreadTree']").bind("click", function () {
                root.find("[data-id='spreadTree']").attr("style", "display:none");
                root.find("[data-id='foldTree']").attr("style", "display:display");
                self.ztr.expandAll(true);
            });

            //折叠
            root.find("[data-id='foldTree']").bind("click", function () {
                root.find("[data-id='spreadTree']").attr("style", "display:display");
                root.find("[data-id='foldTree']").attr("style", "display:none");
                self.ztr.expandAll(false);
            });

            //搜索节点按钮
            root.find("[data-id='dataValue']").bind("keyup", function () {
                var a = root.find("[data-id='dataValue']")[0].value;

                //取出所有的元素
                var choiceNodes = self.ztr.getNodesByParamFuzzy("name", a, null);
                //隐藏所有节点
                for (var i = 0; i < self.ztr.getNodes().length; i++) {
                    setTreeVisible(self.ztr.getNodes()[i]);
                }
                var nodes = self.ztr.getNodesByParam("visible", false);
                self.ztr.hideNodes(nodes);

                //显示相关节点
                for (var j = 0; j < choiceNodes.length; j++) {
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

            //发布文章按钮
            root.find("[data-id='updateAticleBtn']").bind("click", function () {
                $.Biz.documentUpdate.editData = noticeModel;
                $.Biz.documentUpdate.type = 'new';
                if ($.Biz.documentUpdate.isInitial) {
                    $.Biz.documentUpdate.newArticle(noticeModel, 'new');
                }
                $.iwf.onmodulechange('m2.documentUpdate:{type:"documentUpdate"}');

            });
            //上一级按钮
            root.find("[data-id='lastLevel']").bind("click", function () {
                if (haveChoiceTreeData != undefined) {
                    if (haveChoiceTreeData.ParentId != '0') {
                        var treeNode = self.ztr.getNodeByParam("FileTypeId", haveChoiceTreeData.ParentId);
                        haveChoiceTreeData = treeNode;
                        loadDataGridById(treeNode);
                    }
                }
            });
        });
    }

    //左右布局显示，左边列表，右边表单，增加到resize,和界面完成初始化
    function initUILayout() {
        root.find(".leftPanel").height(root.height() - 100).css("overflow-y", "auto").css("overflow-x", "hidden");
        root.find(".rightPanel").height(root.height() - 150).css("overflow-y", "auto").css("overflow-x", "hidden");
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

    // 设置当前节点及其所有上级节点为“可见”状态
    function setTreeVisible_HigherLevel(tree) {
        tree.visible = true;
        if (tree.getParentNode() != null) {
            setTreeVisible_HigherLevel(tree.getParentNode());
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

    function arr_del(data, d) {
        return data.slice(0, d - 1).concat(data.slice(d))
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

    //添加文件夹弹窗
    function showAddDocumentWindow(newData, type) {
        var parentData = self.ztr.getSelectedNodes()[0];
        if (parentData == null || parentData == undefined || parentData == "") {
            $.Com.showMsg("请选择节点");
            return;
        }
        initModel();
        var title = "";
        title = "新增子类目录";
        newData.ParentId = parentData.FileTypeId;
        //代码目录
        newData.CodePath = parentData.CodePath;

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
                       } else if (type == "addFather") {
                           loadDataTree("0");
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

    //编辑文件夹弹窗
    function showEditDocumentWind(editData, callback) {

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
                   $.fxPost("/DocumentCenterSvc.data?action=SaveFileType", { JSONData: json }, function (ret) {
                       var da = ret.dataTable[0];
                       self.ztr.getSelectedNodes()[0].name = da.name;
                       self.ztr.getSelectedNodes()[0].FileTypeName = da.FileTypeName;
                       self.ztr.getSelectedNodes()[0].sourceType = da.sourceType;
                       self.ztr.getSelectedNodes()[0].linkName = da.linkName;
                       self.ztr.getSelectedNodes()[0].linkUrl = da.linkUrl;
                       self.ztr.getSelectedNodes()[0].remark = da.remark;
                       self.ztr.getSelectedNodes()[0].isEffective = da.isEffective;
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
        var win = $.Com.showFormWin(editData, function () {
        }, models.newDocumentModel, root.find("[data-id='addDocumentClassWindow']"), dlgOpts);
    }

    //初始化树状图
    function loadDataTree(loadMethod) {
        var documentTree = root.find("[data-id='DocumentClassTree']");
        documentTree.empty();
        $.fxPost("/DocumentCenterSvc.data?action=GetAllFileType", { id: "",type:"union" }, function (ret) {
            if (!ret.success) {
                $.Com.showMsg(ret.msg);
                return;
            }
            var listData = [];
            self.tree = ret.data.listFileTypeModel;
            //用于新增文件夹分类的model
            fileTypeModel = ret.data.fileTypeModel;
            noticeModel = ret.data.notice;
            require(["script/ztree/jquery.ztree.exhide-3.5"], function () {
                self.ztr = $.fn.zTree.init(documentTree, self.setting, ret.data.listFileTypeModel); //初始化树型菜单
                //页面首次加载
                if (loadMethod == "1") {
                    haveChoiceTreeData = self.ztr.getNodes()[0];
                    loadDataGridById(haveChoiceTreeData);
                }
            });
        });
    }

    //通过文件夹了性读取信息
    function loadDataGridById(treeNode) {
        //面包屑导航栏
        FindArticleByBread = function (fileTypeId) {
            var node = self.ztr.getNodeByParam("FileTypeId", fileTypeId);
            loadDataGridById(node);
        }

        catelog = [];
        checkAllParents(treeNode);
        var breadCrumbDiv = root.find("[data-id='breadCrumb']");
        breadCrumbDiv.empty();
        var breadHtml = "";
        for (var k = catelog.length - 1; k >= 0; k--) {
            breadHtml += "<li><span class='btn-link' onclick=FindArticleByBread('" + catelog[k].FileTypeId + "')>" + catelog[k].name + "</span></li>";
        }
        breadHtml += "<li  class='active'>" + treeNode.FileTypeName + "</li>";
        breadCrumbDiv.append(breadHtml);
        //根据所选的内容读取表
        loadFileTyoeId(treeNode);
    }

    //通过类别查找文类
    function loadFileTyoeId(treeNode) {
        $.fxPost("DocumentCenterSvc.data?action=GetAllFileType", { id: treeNode.FileTypeId,type:"notUnion" }, function (ret) {
            listFileType = ret.data.listFileTypeModel;
            models.gridModel.show(root.find('[data-id="documentManage"]'), listFileType);
        });
    }

    //查找父类递归函数
    function checkAllParents(treeNode) {
        if (treeNode == null || treeNode.ParentId == '1') {
            return;
        }
        else {
            catelog.push({ name: treeNode.getParentNode().name, FileTypeId: treeNode.getParentNode().FileTypeId });
            checkAllParents(treeNode.getParentNode());
        }
    }

    //批量保存文章
    function updateAticleList(dataList) {
        var json = JSON.stringify(dataList);
        $.post("DocumentCenterSvc.data?action=UpdateArticleList", { JsonData: json }, function (ret) {
            var json = JSON.parse(ret);
            $.Com.showMsg(json.msg);
        })
    }


    function deleteData(callback) {
        var node = self.ztr.getSelectedNodes()[0];
        if (node == null || node == undefined || node == "")
            return;
        var msg = "确定要删除此节点吗？";
        if (confirm(msg) == true) {
            var json = JSON.stringify(self.ztr.getSelectedNodes()[0]);
            $.fxPost("DocumentCenterSvc.data?action=DeleteFileType", { JSONData: json }, function (ret) {
                if (!ret.success) {
                    alert(ret.msg);
                    return;
                }
                self.ztr.removeNode(node);
                callback(true);
            });
        }
    }

    function expandAll(expandSign) {
        zTree1.expandAll(expandSign);
    }

    var addCount = 1;

    function removeTreeNode() {
        var node = zTree1.getSelectedNodes();
        if (node) {
            if (node.nodes && node.nodes.length > 0) {
                var msg = "要删除的节点是父节点，如果删除将连同子节点一起删掉。\n\n请确认！";
                if (confirm(msg) == true) {
                    zTree1.removeNode(node);
                }
            } else {
                zTree1.removeNode(node);
            }
        }
    }

    function checkTreeNode(checked) {
        var node = zTree1.getSelectedNodes();
        if (node) {
            node.checked = checked;
            zTree1.updateNode(node, true);
        }
    }

    function reloadTree() {
        zTree1 = $("#treeDemo").zTree(setting, clone(zNodes));
    }
});