define(new function () {
    var root;
    var self = this;
    var models = {};
    var catelog = [];//用于导航显示
    var catelog_Seleted = [];
    self.tree = null;
    var allModel;
    var noticeModel;
    var selectedValue;
    var choiceAticelData;
    var haveChoiceTreeData;//用来存储已经选择的信息
    var listFileType;//右框表数据


    //树状图初始化
    self.setting = {
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false,
            nameIsHTML: true
        },
        callback: {
            beforeCheck: zTreeBeforeCheck
        },
        //check: {
        //    enable: true
        //},
        data: {
            simpleData: {
                enable: true,
                idKey: "FileTypeId",
                pIdKey: "ParentId",
                rootPId: "0"
                , nameCol: "name"           //设置 zTree 显示节点名称的属性名称,此处默认为name 
            }
        },
        callback: {//回调涵数
            beforeClick: function (treeId, treeNode) {//单击

                var zTree = $.fn.zTree.getZTreeObj("DocumentClassNewTree");
                if (treeNode.isParent) {
                    zTree.expandNode(treeNode);
                }
                haveChoiceTreeData = treeNode;
                loadDataGridById(haveChoiceTreeData);
            }
        }
    };

    function zTreeBeforeCheck(treeId, treeNode) {
        return false;
    };



    models.orderModel = $.Com.FormModel({});


    //显示选择的文章信息
    function loadChoiceArticle(item) {
        //$.Biz.documentUpdate.editData = item;
        //$.Biz.documentUpdate.url = 'm2.documentClassNew:{title:"文档管理"}';
        //$.Biz.documentUpdate.type = 'edit';
        //if ($.Biz.documentUpdate.isInitial) {
        //    $.Biz.documentUpdate.editAticle(item, 'edit');
        //}
        //$.iwf.onmodulechange('m2.documentUpdate:{type:"documentUpdate"}');
        $.Com.Go("#m2.nnepb/oa/DocumentCenter/DucumentUpdate:{title:'文章修改',type:'文章修改'}");
    }

    function arr_del(data, d) {
        return data.slice(0, d - 1).concat(data.slice(d));
    }

    this.resize = function (s) {
        if (root) initUILayout();
    }

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/oa/DocumentCenter/DocumentClassNew.html", function () {

            //读取树状图
            loadDataTree("1");
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
            })
            //订阅
            root.find("[data-id='orderBtn']").bind("click", function () {
                showAddDocumentWindow();
            })

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

            //检索
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

            initUILayout();

        })
    }
    //左右布局显示，左边列表，右边表单，增加到resize,和界面完成初始化
    function initUILayout() {
        root.find(".leftPanel").height(root.height() - 100).css("overflow-y", "auto").css("overflow-x", "hidden");
        root.find(".rightPanel").height(root.height() - 150).css("overflow-y", "auto").css("overflow-x", "hidden");
        //root.find(".rightPanel").css("max-height", (root.height() - 120) + "px").css("overflow-y", "auto").css("overflow-x", "hidden");
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

    //读取树状图
    function loadDataTree(loadMethod) {
        var documentTree = root.find("[data-id='DocumentClassNewTree']");
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

    //通过柱状图ID查找文章表
    function loadDataGridById(treeNode) {
        //面包屑导航栏的click事件
        FindArticleByBread = function (fileTypeId) {
            var node = self.ztr.getNodeByParam("FileTypeId", fileTypeId);
            loadDataGridById(node)
        }

        //导航显示处理
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
        loadFileTyoeId(treeNode);
    }

    //根据所选的内容读取表
    function loadFileTyoeId(treeNode) {
        var modelDIV = root.find("[data-id='articleGrid']");
        var url = "";
        var fileTypeId = "";
        //业务类型
        if (treeNode.sourceType == '1'&& treeNode.linkUrl!=null) {
            url = treeNode.linkUrl;
            if (treeNode.isParent == true) {
                fileTypeId = "";
            } else {
                fileTypeId = treeNode.FileTypeId;
            }
        } else {
            fileTypeId = treeNode.FileTypeId;
            url = "nnepb/oa/DocumentCenter/DocViewByFId";
        }
        var moduleItem = { module: 'm2', model: url, fileType: fileTypeId }
        $.iwf.getModel(moduleItem.model, function (model) {
            if (typeof model == 'function') model = new model();
            modelDIV.empty();
            ko.cleanNode(modelDIV[0]);
            modelDIV.css("overflow", "auto");
            model.viewModel = undefined;
            if (!model.show) return;
            model.show(moduleItem, modelDIV);

            //if ($.iwf.curModel) {
            //    if ($.iwf.curModel.close) $.iwf.curModel.close();
            //    delete $.iwf.curModel;
            //}
            //$.iwf.curModel = model;
            //if (!model.show) return;            
            //model.show(moduleItem, modelDIV);
            //$.iwf.curModel = model;
        });

    }

    //查找父类递归函数
    function checkAllParents(treeNode) {
        if (treeNode == null || treeNode.ParentId == '0') {
            return;
        }
        else {
            catelog.push({ name: treeNode.getParentNode().name, FileTypeId: treeNode.getParentNode().FileTypeId });
            checkAllParents(treeNode.getParentNode());
        }
    }

    //通过表主键查找文章
    function loadAtistByNewsId(noticeId, callback) {
        $.fxPost("/DocumentCenterSvc.data?action=GetNoticeByNoticeId", { noticeId: noticeId }, function (ret) {
            callback(ret.notice);
        })
    }

    //查找选中文件类型的父类递归函数
    function checkAllParent_Seleted(treeNode) {
        if (treeNode == null || treeNode.ParentId == '0') {
            return;
        }
        else {
            catelog_Seleted.push({ name: treeNode.getParentNode().name, FileTypeId: treeNode.getParentNode().FileTypeId });
            checkAllParent_Seleted(treeNode.getParentNode());
        }
    }

    //新增订阅 弹窗
    function showAddDocumentWindow() {
        var orderModel = allModel.orderModel;
        orderModel.orderDocumentName = haveChoiceTreeData.FileTypeName;
        orderModel.orderDocumentId = haveChoiceTreeData.FileTypeId;
        var dlgOpts = {
            title: "新增订阅", width: 600, height: 400,
            button: [
           {
               text: '确定', handler: function () {
                   var da = models.orderModel.getData();
                   var json = JSON.stringify(da);
                   $.fxPost("/DocumentCenterSvc.data?action=SaveDocumentOrder", { JsonData: json }, function (ret) {
                       $.Com.showMsg(ret.msg);
                       win.close();
                   })
               }
           },
          {
              text: '取消', handler: function () {
                  win.close();
              }
          }
            ]
        };
        var win = $.Com.showFormWin(orderModel, function () {
        }, models.orderModel, root.find("[data-id='addOrderWindow']"), dlgOpts);
    }
});