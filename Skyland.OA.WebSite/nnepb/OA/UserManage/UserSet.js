define(new function () {
    var root;
    var self = this;
    var models = {};
    var cutData;
    models.detailmodel = $.Com.FormModel({ isAppendSign: false });



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
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "parentId",
                rootPId: "1"
                , nameCol: "name"           //设置 zTree 显示节点名称的属性名称,此处默认为name 
            }
        },
        callback: {//回调涵数
            beforeClick: function (treeId, treeNode) {//单击
                if (treeNode.isParent) {
                    self.ztr.expandNode(treeNode);
                }
                if (treeNode.flag == "1") {
                    root.find("[data-id='baseInfor']").attr("style", "display:display");
                    loadUserInfor(treeNode.id);
                } else {
                    root.find("[data-id='baseInfor']").attr("style", "display:none");
                }
            }
        }
    };

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/UserManage/UserSet.html", function () {
            loadTree();
            initUILayout();
            //添加子节点
            root.find("[data-id='addSon']").bind("click", function () {
                var parentData = self.ztr.getSelectedNodes()[0];
                if (parentData == null || parentData == undefined || parentData == "") {
                    $.Com.showMsg("请选择节点");
                    return;
                }
                if (parentData.flag == '1') {
                    $.Com.showMsg("请选择部门");
                    return;
                }
                $.fxPost("FX_UserInforAddSvc.data?action=GetModel", { flid: parentData.id }, function (ret) {
                    showDepEditWind(ret.userInforAdd);
                });
            });

            // 保存
            root.find("[data-id='saveBtn']").bind("click", function () {
                var da = models.detailmodel.getData();
                if (da == false) {
                    return;
                }
                var json = JSON.stringify(da);
                $.fxPost("FX_UserInforAddSvc.data?action=SaveData", { json: json }, function (ret) {
                    if (ret.b) {
                        alert("保存成功！");
                        loadTree();
                        win.close();
                    }
                });
            });

            //删除
            root.find("[data-id='deleteBtn']").bind("click", function () {
                var choiceData = self.ztr.getSelectedNodes()[0];
                if (choiceData == null || choiceData == undefined || choiceData == "") {
                    $.Com.showMsg("请选择节点");
                    return;
                }
                if (choiceData.flag == '0') {
                    $.Com.showMsg("请选择用户");
                    return;
                }
                $.fxPost("FX_UserInforAddSvc.data?action=DeleteData", { uid: choiceData.id }, function (ret) {
                    $.Com.showMsg("删除成功！");
                    loadTree();
                });
            });

            //查找节点
            root.find("[data-id='dataValue']").bind("keyup", function () {
                searchData();
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

            //剪切
            root.find("[data-id='cutBtn']").bind("click", function () {
                var node = self.ztr.getSelectedNodes()[0];
                if (node == null || node == undefined || node == "") {
                    $.Com.showMsg("请选择节点");
                    return;
                }
                if (node.flag != "1") {
                    $.Com.showMsg("请选择人员");
                    return;
                }
                cutData = node;
                $.Com.showMsg("剪切成功！请选择相应的部门后点击粘贴。");
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
                if (node.flag != "0") {
                    $.Com.showMsg("请选择部门");
                    return;
                }

                $.fxPost("FX_UserInforAddSvc.data?action=EdtiParent", { id: cutData.id, parentId: node.id }, function (ret) {
                    loadTree();
                });
            });

            //上移动
            root.find("[data-id='upBtn']").bind("click", function () {
                var node = self.ztr.getSelectedNodes()[0];
                if (node == null) {
                    return;
                }
                var preNode = node.getPreNode();
                if (preNode == null) {
                    return;
                }
                var update = self.ztr.moveNode(preNode, node, "prev");
                self.ztr.updateNode(update);
                var parent = node.getParentNode();
                if (parent == null) {
                    UpdateDpRank(null);

                } else {
                    if (node.flag == '0') {
                        UpdateDpRank(parent);
                    } else {
                        UpdateUserRank(parent);
                    }
                }
            });

            //下移动
            root.find("[data-id='downBtn']").bind("click", function () {
                var node = self.ztr.getSelectedNodes()[0];
                if (node == null) {
                    return;
                }
                var nextNode = node.getNextNode();
                if (nextNode == null) {
                    return;
                }
                var update = self.ztr.moveNode(nextNode, node, "next");
                self.ztr.updateNode(update);
                var parent = node.getParentNode();
                if (parent == null) {
                    UpdateDpRank(null);

                } else {
                    if (node.flag == '0') {
                        UpdateDpRank(parent);
                    } else {
                        UpdateUserRank(parent);
                    }
                }
            });

        });
    }

    function UpdateDpRank(parent) {
        if (parent == null) {
            var children = self.ztr.getNodes();
            var array = [];
            for (var i = 0 ; i < children.length; i++) {
                var child = { id: "", rankId: "" };
                child.id = children[i].id;
                child.rankId = self.ztr.getNodeIndex(children[i]);
                array.push(child);
            }
            var jasonData = JSON.stringify(array);
            $.fxPost("FX_UserInforAddSvc.data?action=UpdateDpRank", { JsonData: jasonData }, function (ret) {
            });
        }
    }

    function UpdateUserRank(parent) {
        var children = parent.children;
        var array = [];
        for (var i = 0 ; i < children.length; i++) {
            var child = { id: "", rankId: "" };
            child.id = children[i].id;
            child.rankId = self.ztr.getNodeIndex(children[i]);
            array.push(child);
        }
        var jasonData = JSON.stringify(array);
        $.fxPost("FX_UserInforAddSvc.data?action=UpdateRank", { JsonData: jasonData }, function (ret) {

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


    //左右布局显示，左边列表，右边表单，增加到resize,和界面完成初始化
    function initUILayout() {
        root.find(".leftPanel").height(root.height() - 100).css("overflow-y", "auto").css("overflow-x", "hidden");
        root.find(".rightPanel").height(root.height() - 150).css("overflow-y", "auto").css("overflow-x", "hidden");
        //root.find(".rightPanel").css("max-height", (root.height() - 120) + "px").css("overflow-y", "auto").css("overflow-x", "hidden");
    }

    function showDepEditWind(baseInfor) {
        models.newBaseInfor = $.Com.FormModel({ isAppendSign: false });
        var dlgOpts = {
            title: "新增用户", width: 500, height: 650,
            button: [
           {
               text: '确定', handler: function () {
                   var da = models.newBaseInfor.getData();
                   var json = JSON.stringify(da);
                   $.fxPost("FX_UserInforAddSvc.data?action=SaveData", { json: json }, function (ret) {
                       if (ret.b) {
                           alert("保存成功！");
                           loadTree();
                           win.close();
                       }
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
        var win = $.Com.showFormWin(baseInfor, function () {
        }, models.newBaseInfor, root.find("[data-id='userSetWind']"), dlgOpts);

    }

    function loadUserInfor(id) {
        $.fxPost("FX_UserInforAddSvc.data?action=GetDataByUserId", { uid: id }, function (ret) {
            models.detailmodel.show(root.find("[data-id='baseInfor']"), ret.userInforAdd);// 
        });
    }

    //加载树状图
    function loadTree() {
        var userTree = root.find("[data-id='userTree']");
        userTree.empty();
        $.fxPost("B_OA_UserSvc.data?action=GetUserTree", {}, function (ret) {
            require(["script/ztree/jquery.ztree.exhide-3.5"], function () {
                self.ztr = $.fn.zTree.init(userTree, self.setting, ret.treeSource); //初始化树型菜单

            });
        });
    }
})