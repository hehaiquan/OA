$.Biz.B_OA_AddressBookPage = new function () {
    var root;
    var data;
    var detailmodel = $.Com.FormModel({});
    var constwidth = 992;
    var callbackforsave;// 回调
    var curData;
    var sourceListEdit;
    var models = {};


    models.gridmodel = $.Com.GridModel({
        beforeBind: function (vm, _root) {
            vm.copyRow = function (id) {
                copyRowToPersonalAddressBook(id());
            }
        }
             , edit: function (item, callback) {
                 showDetail(item, "修改个人通讯录信息", 2, callback);
             }
             , remove: function (row) {
                 if (confirm("确定要删除此行通讯录数据吗？")) {
                     var id = row.id();
                     deleteData(id);
                     return true;
                 }
             }
             , elementsCount: 5
             , keyColumns: "id"
             , cssClass: " table table-bordered table-condensed table-striped "
    });

    models.detailmodel = $.Com.FormModel({
        beforeBind: function (vm, root) {
        },
        isValidateRequired: true
    });

    this.show = function (module, _root) {
        root = _root;
        root.css("position", "relative");
        if (root.children().length != 0) return;
        root.load("models/B_OA_AddressBook/B_OA_AddressBookPage.html", function () {
            loadData();

            root.find("[data-id='add']").bind("click", function () {
                showDetail(sourceListEdit, "新增通讯录信息", 1);
            });

            root.find("[data-id='importexcel']").bind("click", function () {
                $.Com.showMsg("导入通讯录");
            });
            root.find("[data-id='exportexcel']").bind("click", function () {
                $.Com.showMsg("导出通讯录");
            });

        });
    };

    function showDetail(item, winName, operatetype, callback) {
        detailmodel = $.Com.FormModel({});
        var dlgOpts = {
            title: winName, width: window.innerWidth * 0.5, height: window.innerHeight * 0.8,
            button: [
               {
                   text: '保存', handler: function (data) {// when save
                       var baseInfo = detailmodel.getData();// get detail's data for save
                       saveData(baseInfo, win);
                   }
               },
               {
                   text: '取消', handler: function (data) {// when cancel
                       win.close();
                   }
               }
            ]
        };
        var win = $.Com.showFormWin(item, callback, detailmodel, root.find("[data-id='detailDiv']"), dlgOpts);
    };

    // 保存数据
    function saveData(targetData, win) {
        var params = JSON.stringify({ "baseInfo": targetData });
        $.fxPost('B_OA_AddressBookSvc.data?action=Save', { content: params }, function (json) {
            loadData();
            win.close();
        });
    }

    // 加载数据
    function loadData() {
        var params = JSON.stringify({ content: '' });
        $.fxPost("B_OA_AddressBookSvc.data?action=GetData", params, function (ret) {
            models.gridmodel.show(root.find("[data-id='listDiv']"), ret.dataTable);
            sourceListEdit = ret.sourceListEdit;
        });
    };

    // 删除行数据
    function deleteData(id) {
        if (!id) return;
        var params = id;
        $.post("B_OA_AddressBookSvc.data?action=DeleteData", { content: params }, function (json) {
            var Obj = eval('(' + json + ')');
            if (Obj.success) {
                $.Com.showMsg(Obj.msg);
            } else {
                $.Com.showMsg(Obj.msg);
            }
        });
    };

    // 复制行数据并保存到个人通讯录
    function copyRowToPersonalAddressBook(id) {
        var params = new Object();
        params = id;
        $.fxPost("B_OA_AddressBookSvc.data?action=CopyAndSaveData", { content: params }, function (json) {
          
        });
    };

};

$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'boaaddressbook' };
    this.show = function (module, root) {
        $.Biz.B_OA_AddressBookPage.show(module, root);
    };
});