$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'emailManage' };
    this.show = function (module, root) {
        $.Biz.emailManage.show(module, root);
    };
});

$.Biz.emailManage = new function () {
    var root;
    var data;
    var self = this;
    var models = {};
    var newDocumentModel;
    var newMarkModel;
    var url = "";
    var emailMarkModel;
    var emailDocumentModel;

    this.editEmailManage = function () {
        this.editEmailManageInit();
    };
    this.editEmailManageInit = function () {
        root.find("[data-id='backBtn']").attr("style", "float: right; margin-top: 5px; margin-left: 5px;display:display");
        url = $.Biz.emailManage.url;
    }

    models.gridModel = $.Com.GridModel({
        keyColumns: "ID",//主键字段
        beforeBind: function (vm, _root) {//表格加载前

            //清空文件夹
            vm.truncateDocument = function (id) {
                if (!confirm("是否要清空此文件夹？清空后文件将无法恢复")) return false;
                truncateDocument(id);
            }

            vm.deleteDocumentWindow = function (id, documentName) {
                var item = { id: id(), documentName: documentName(), isDeleteDocument: false };
                showDeleteDocumentWindow(item);
            };

        },
        elementsCount: 10,
        edit: function (item, callback) {
            showAddDocumentWindow(item);
        },
        remove: function (row) {

        }
    });

    models.gridMarkModel = $.Com.GridModel({
        keyColumns: "ID",//主键字段
        beforeBind: function (vm, _root) {//表格加载前
            vm.deleteEmailMark = function (id) {
                if (!confirm("确定要删除此标签吗？")) return false;
                deleteDocumentMark(id());
            }
        },
        elementsCount: 10,
        edit: function (item, callback) {
            showAddMarkWindow(item);
        },
        remove: function (row) {

        }
    });

    this.show = function (module, _root) {
        $.Biz.emailManage.isInitial = true;
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/Email/EmailManage.html", function () {

            //tab设置
            var tal = root.find("[data-id='talDiv']");
            tal.iwfTab(
                {
                    stretch: true,
                    tabchange: function (dom) {

                    }
                }
            );

            if ($.Biz.emailManage.type == 'edit') {
                url = $.Biz.emailManage.url;
                $.Biz.emailManage.editEmailManageInit();
            }

            loadData_Document();

            //新建文件夹
            root.find("[data-id='btnNewDocument']").bind("click", function () {
                showAddDocumentWindow(newDocumentModel);
            });

            //新建标签
            root.find("[data-id='btnNewMark']").bind("click", function () {
                showAddMarkWindow(newMarkModel);
            });

            root.find("[data-id='backBtn']").bind("click", function () {
                root.find("[data-id='backBtn']").attr("style", "display:none");
                $.iwf.onmodulechange(url);
            });

        })
    }

    function showAddMarkWindow(item) {
        models.newMarkNameModel = $.Com.FormModel({});
        var title = "";
        if (item.documentName != '') {
            title = "重命名标签";
        } else {
            title = "新建标签";
        }
        var dlgOpts = {
            title: title, width: 600, height: 250,
            button: [
           {
               text: '确定', handler: function () {
                   var da = models.newMarkNameModel.getData();
                   if (da.markName == '' || da.markName == null) {
                         $.Com.showMsg("文件夹名称不能为空！");
                       return;
                   } else {
                       var json = JSON.stringify(da);
                       $.post('B_Email_One_Svc.data?action=SaveEmailMark', { JsonData: json }, function (res) {

                           var json = eval('(' + res + ')');
                           if (!json.success) {
                                 $.Com.showMsg(json.msg);
                               return;
                           }
                           loadData_Document();
                           win.close();
                       })
                   }
               }
           },
          {
              text: '取消', handler: function () {
                  win.close();
              }
          }
            ]
        };
        var win = $.Com.showFormWin(item, function () {
        }, models.newMarkNameModel, root.find("[data-id='newMarkWindows']"), dlgOpts);
    }

    function loadData_Document() {
        $.fxPost("B_Email_One_Svc.data?action=GetEmialDocumentNameAndCount_Two", "", function (ret) {
            if (ret.success) {
                var list = ret.data.listObj;
                if (list[0].length > 0) {
                    models.gridModel.show(root.find("[ data-role='emailMyDocumentGrid']"), list[0]);
                } else {
                    models.gridModel.show(root.find("[ data-role='emailMyDocumentGrid']"), []);
                }
                if (list[1].length > 0) {
                    models.gridMarkModel.show(root.find("[ data-role='emailMyMarkGrid']"), list[1]);
                } else {
                    models.gridMarkModel.show(root.find("[ data-role='emailMyMarkGrid']"), []);
                }
                newDocumentModel = ret.data.emailDocumentModel;
                newMarkModel = ret.data.emailMarkModel;
            }
        })
    }


    //添加文件夹弹窗
    function showAddDocumentWindow(item) {

        models.newDocumentModel = $.Com.FormModel({});
        var title = "";
        if (item.documentName != '') {
            title = "重命名文件夹";
        } else {
            title = "新建文件夹";
        }
        var dlgOpts = {
            title: title, width: 600, height: 250,
            button: [
           {
               text: '确定', handler: function () {
                   var da = models.newDocumentModel.getData();
                   if (da.documentName == '' || da.documentName == null) {
                         $.Com.showMsg("文件夹名称不能为空！");
                       return;
                   } else {
                       var json = JSON.stringify(da);
                       $.post('B_Email_One_Svc.data?action=SaveEmailDocument_Two', { JsonData: json }, function (res) {

                           var json = eval('(' + res + ')');
                           if (!json.success) {
                                 $.Com.showMsg(json.msg);
                               return;
                           }
                           loadData_Document();
                           win.close();
                       })
                   }
               }
           },
          {
              text: '取消', handler: function () {
                  win.close();
              }
          }
            ]
        };
        var win = $.Com.showFormWin(item, function () {
        }, models.newDocumentModel, root.find("[data-id='newDocumentWindows']"), dlgOpts);
    }

    //清除文件夹
    function truncateDocument(id) {
        $.fxPost("B_Email_One_Svc.data?action=TruncateDocument", { documentId: id }, function (ret) {
              $.Com.showMsg(ret.msg);
            loadData_Document();
        })
    }

    //删除文件夹
    function showDeleteDocumentWindow(item) {
        models.deleteDocumentModel = $.Com.FormModel({});

        var dlgOpts = {
            title: "删除文件夹", width: 600, height: 250,
            button: [
           {
               text: '确定', handler: function () {
                   var da = models.deleteDocumentModel.getData();
                   var json = JSON.stringify(da);
                   $.post('B_Email_One_Svc.data?action=DeleteDocument', { JsonData: json }, function (res) {
                       var json = JSON.parse(res);
                       if (json) {
                             $.Com.showMsg(json.msg);
                           loadData_Document();
                           win.close();
                       }
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
        var win = $.Com.showFormWin(item, function () {
        }, models.deleteDocumentModel, root.find("[data-id='deleteDocumentWindow']"), dlgOpts);
    }

    //删除标签
    function deleteDocumentMark(id) {
        $.post('B_Email_One_Svc.data?action=DeleteEmailMark', { id: id }, function (res) {
            var json = JSON.parse(res);
            if (json) {
                  $.Com.showMsg(json.msg);
                loadData_Document();
            }
        })
    }
}