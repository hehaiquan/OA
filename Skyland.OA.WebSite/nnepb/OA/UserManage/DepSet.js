define(new function () {
    var root;
    var self = this;
    var models = {};
    var cutData = null;
    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/UserManage/DepSet.html", function () {
            //添加子节点
            root.find("[data-id='addSon']").bind("click", function () {
                var depEditModel = { name: "", parentId: "", id: "", parentName: "" };
                showDepEditWind(depEditModel);
            });
            //删除节点
            root.find("[data-id='deleteBtn']").bind("click", function () {
                deleteData();
            });
            //修改节点
            root.find("[data-id='editSon']").bind("click", function () {
                showEdit();
            });

            //查找节点
            root.find("[data-id='dataValue']").bind("keyup", function () {
                searchData();
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
                $.fxPost("/B_OA_UserSvc.data?action=EdtiParent", { id: cutData.id, parentId: node.id }, function (ret) {
                    loadTree();
                });
            });

            loadTree();
        });
    }

    function searchData() {
        var inputValue = root.find("[data-id='dataValue']")[0].value;
        //取出所有的元素
        var choiceNodes = self.ztr.getNodesByParamFuzzy("name", inputValue, null);
        //隐藏所有节点
        for (var i = 0 ; i < self.ztr.getNodes().length; i++) {
            setTreeVisible(self.ztr.getNodes()[i]);
        }
        var nodes = self.ztr.getNodesByParam("visible", false);
        self.ztr.hideNodes(nodes);
        //显示相关节点
        for (var j = 0 ; j < choiceNodes.length; j++) {
            if (inputValue != "") {
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

    function deleteData() {
        var node = self.ztr.getSelectedNodes()[0];
        if (node == null || node == undefined || node == "") {
            $.Com.showMsg("请选择节点");
            return;
        }
        var msg = "确定要删除此节点吗？";
        if (confirm(msg) == true) {
            $.fxPost("/B_OA_UserSvc.data?action=DeleteDp", { dpId: node.id }, function (ret) {
                if (!ret.success) {
                    alert(ret.msg);
                    return;
                }
                self.ztr.removeNode(node);
            });
        }
    }

    function showEdit() {
        var node = self.ztr.getSelectedNodes()[0];
        models.depModel = $.Com.FormModel({});
        if (node == null || node == undefined || node == "") {
            $.Com.showMsg("请选择节点");
            return;
        }
        var dlgOpts = {
            title: "修改部门", width: 500, height: 300,
            button: [
           {
               text: '确定', handler: function () {
                   var dpData = models.depModel.getData();
                   $.fxPost("/B_OA_UserSvc.data?action=EditDepartment", { DPID: dpData.id, DPName: dpData.name }, function (ret) {
                       self.ztr.getSelectedNodes()[0].id = dpData.id;
                       self.ztr.getSelectedNodes()[0].parentId = dpData.parentId;
                       self.ztr.getSelectedNodes()[0].name = dpData.name;
                       self.ztr.updateNode(self.ztr.getSelectedNodes()[0]);
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
        var win = $.Com.showFormWin(node, function () {
        }, models.depModel, root.find("[data-id='editSetWind']"), dlgOpts);

    }


    function showDepEditWind(newData) {
        var parentData = self.ztr.getSelectedNodes()[0];
        if (parentData == null || parentData == undefined || parentData == "") {
            $.Com.showMsg("请选择节点");
            return;
        }
        newData.parentId = parentData.id;
        newData.parentName = parentData.name;
        models.depModel = $.Com.FormModel({});
        var dlgOpts = {
            title: "新增部门", width: 500, height: 300,
            button: [
           {
               text: '确定', handler: function () {
                   var dpData = models.depModel.getData();
                   $.fxPost("/B_OA_UserSvc.data?action=CreateDepartment", { DPName: dpData.name, ParentId: dpData.parentId }, function (ret) {
                       var dataNew = ret.insert_obj;
                       var depModel = { name: "", parentId: "", id: "" };
                       depModel.id = dataNew.DPID;
                       depModel.parentId = dataNew.PDPID;
                       depModel.name = dataNew.DPName;
                       self.ztr.addNodes(self.ztr.getSelectedNodes()[0], depModel);
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
        }, models.depModel, root.find("[data-id='userSetWind']"), dlgOpts);

    }

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
                idKey: "id",
                pIdKey: "parentId",
                rootPId: "0"
                , nameCol: "name"           //设置 zTree 显示节点名称的属性名称,此处默认为name 
            }
        },
        callback: {//回调涵数
            beforeClick: function (treeId, treeNode) {//单击
                if (treeNode.isParent) {
                    self.ztr.expandNode(treeNode);
                }
            },
        }
    };

    //加载树状图
    function loadTree() {
        var userTree = root.find("[data-id='dpTree']");
        userTree.empty();
        $.fxPost("/B_OA_UserSvc.data?action=GetDepTree", {}, function (ret) {
            depEditModel = ret.depEditModel;
            require(["script/ztree/jquery.ztree.exhide-3.5"], function () {
                self.ztr = $.fn.zTree.init(userTree, self.setting, ret.treeSource); //初始化树型菜单
            });
        });
    }
})