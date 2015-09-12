$.Biz.PersonalAddressBookPage = new function () {
    var root;
    var data;
    var detailmodel = $.Com.FormModel({});
    var curData;
    var models = {};
    var sourceListEdit;

    models.gridmodel = $.Com.GridModel({
        beforeBind: function (vm, _root) {
            //var params = new Object();
            //$.post("B_OA_AddressBookSvc.data?action=GetDeptInfoAndUserInfo", function (res) {
            //    if (Obj.data) {
            //        root.find("[data-id='dpid']").val(Obj.data.deptinfo.DPName);
            //        root.find("[data-id='userId']").val(Obj.data.userinfo.UserID);
            //    }
            //});
            //root.find("[data-id='personal']").val(1);
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
        root.load("models/B_OA_AddressBook/PersonalAddressBookPage.html", function () {
            loadData();

            // 新增功能
            root.find("[data-id='add']").bind("click", function () {
                //   $.Com.showMsg("新增功能");
                showDetail(sourceListEdit, "新增个人通讯录信息", 1);
            });

        });
    };

    this.getData = function () {
        return curData;
    };

    function loadData() {
        var params = new Object();
        params = { content: JSON.stringify({ personal: '1' }) };
        $.fxPost("B_OA_AddressBookSvc.data?action=GetDatas", params, function (json) {
            models.gridmodel.show(root.find("[data-id='listDiv']"), json.dataTable);
            sourceListEdit = json.sourceListEdit;
        });

    };

    function getDepartment() {
        var params = new Object();
        //params = JSON.stringify({ userid: parent.$.iwf.userInfo.userid });
        $.post("B_OA_AddressBookSvc.data?action=GetDepartment", function (res) {
            var obj = eval('(' + res + ')');
            if (obj) {
                return obj;
            }
        });
    };

    function showDetail(item, winName, operatetype, callback) {
        detailmodel = $.Com.FormModel({});
        var dlgOpts = {
            title: winName, width: window.innerWidth * 0.5, height: window.innerHeight * 0.8,
            button: [
                {
                    text: '保存', handler: function (data) {
                        var baseInfo = detailmodel.getData();
                        baseInfo.personal = 1;
                        saveData(baseInfo, win, function (Obj) {
                           
                        });

                    }
                },
                {
                    text: '取消', handler: function (data) {
                        win.close();
                    }
                }
            ]
        };

        var win = $.Com.showFormWin(item, callback, detailmodel, root.find("[data-id='detailDiv']"), dlgOpts);
    };

    // 保存数据
    function saveData(targetData, win, callback) {
        // when it is empty 
        var parms = JSON.stringify({ "baseInfo": targetData });
        $.fxPost("B_OA_AddressBookSvc.data?action=Save", { content: parms }, function (json) {
            loadData();
            win.close();
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

};

$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'personaladdressbook' };
    this.show = function (module, root) {
        $.Biz.PersonalAddressBookPage.show(module, root);
    };
});

