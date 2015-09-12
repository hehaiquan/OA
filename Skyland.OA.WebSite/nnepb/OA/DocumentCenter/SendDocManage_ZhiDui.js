define(new function () {
    var root;
    var self = this;
    var models = {};
    var addModel;
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
                rootPId: "0"
                , nameCol: "name"           //设置 zTree 显示节点名称的属性名称,此处默认为name 
            }
        },
        callback: {//回调涵数
            beforeClick: function (treeId, treeNode) {//单击

            },
            //onRightClick: zTreeOnRightClick
        }
    };


    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/DocumentCenter/SendDocManage_ZhiDui.html", function () {
            loadTree();

            //添加
            root.find("[data-id='addBtn']").bind("click", function () {
                showAddWindow(addModel);
            });

            //修改
            root.find("[data-id='editBtn']").bind("click", function () {
                var editData = self.ztr.getSelectedNodes()[0];
                if (editData == null) {
                    $.Com.showMsg("请选择节点");
                    return;
                }
                showAddWindow(editData);
            });

            //删除
            root.find("[data-id='deleteBtn']").bind("click", function () {
                deleteData();
            });

            //加载
            root.find("[data-id='loadBtn']").bind("click", function () {
                var modelDIV = root.find("[data-id='loadPage']");
                moduleItem = { module: 'm2', model: 'nnepb/oa/DocumentCenter/main', params: 'title:"文档中心"' }

                $.iwf.getModel(moduleItem.model, function (model) {
                    if (typeof model == 'function') model = new model();
                    if ($.iwf.curModel) {
                        if ($.iwf.curModel.close) $.iwf.curModel.close();
                        delete $.iwf.curModel;
                    }
                    $.iwf.curModel = model;
                    if (!model.show) return;

                    modelDIV.css("overflow", "auto");
                    model.show(moduleItem, modelDIV);
                    $.iwf.curModel = model;
                });

            });

            
        });

        //读取数据
        function loadTree() {
            var documentTree = root.find("[data-id='ZhiDuiSendTree']");
            documentTree.empty();
            $.fxPost("/B_OA_SendDoc_ZhiDuiSvc.data?action=GetSendDocTree", {}, function (ret) {
                require(["script/ztree/jquery.ztree.exhide-3.5"], function () {
                    self.ztr = $.fn.zTree.init(documentTree, self.setting, ret.dataTable); //初始化树型菜单
                    addModel = ret.fileType;
                })
            })
        };

        function deleteData() {
            var node = self.ztr.getSelectedNodes()[0];
            if (node == null || node == undefined || node == "")
                return;

            $.Com.confirm("您确定要删除此目录类别吗？", function () {
                var json = JSON.stringify(self.ztr.getSelectedNodes()[0]);
                $.fxPost("/B_OA_SendDoc_ZhiDuiSvc.data?action=DeleteFileType", { content: json }, function () {
                    loadTree();
                })
            });

        }

        //添加文件夹弹窗
        function showAddWindow(editData) {
            models.newDocumentModel = $.Com.FormModel({});
            var title = "";
            if (editData.FileTypeId == "" && editData.FileTypeId == null) {
                title = "新增目录类别";
            } else {
                editData.FileTypeName = editData.name;
                title = "编辑目录类别";
            }
            var dlgOpts = {
                title: title, width: 600, height: 250,
                button: [
               {
                   text: '确定', handler: function () {
                       var da = models.newDocumentModel.getData();
                       if (da.FileTypeName == '' || da.FileTypeName == null) {
                           $.Com.showMsg("文件夹名称不能为空！");
                           return;
                       }
                       var json = JSON.stringify(da);
                       $.post("/B_OA_SendDoc_ZhiDuiSvc.data?action=SaveFileType", { content: json }, function (ret) {
                           loadTree();
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
            var win = $.Com.showFormWin(editData, function () {
            }, models.newDocumentModel, root.find("[data-id='editDocumentClass']"), dlgOpts);
        }

    }
})