$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'device' };
    this.show = function (module, root) {
        $.Biz.device.show(module, root);

    };
});

$.Biz.device = new function () {
    var root;
    var models = {};
    var deviceModel;//会议空model，用于添加
    //表格Model
    models.gridModel = $.Com.GridModel({
        beforeBind: function (vm, _root) {
        },
        elementsCount: 10,
        edit: function (item, callback) {
            editDeviceform(item);
        }
        , remove: function (row) {
        }
        , keyColumns: "DeviceID"
    });
    function loadData() {
        $.fxPost("/B_OA_DeviceSvc.data?action=GetData", {}, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            if (ret.data.dataList) {
                data = ret.data;
                deviceModel = data.editData;
                models.gridModel.show(root.find("[data-id='deviceTableGrid']"), data.dataList);
            }
        })
    }
    function editDeviceform(item) {
        //会议Model
        models.DeviceFormModel = $.Com.FormModel({});

        var dlgOpts = {
            title: '会议添加', width: 800, height: 700,
            button: [
           {
               text: '保存', handler: function (data) {
                   var da = models.DeviceFormModel.getData();
                   saveData(da, win);
               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }]
        };
        var win = $.Com.showFormWin(item, function () {
        }, models.DeviceFormModel, root.find("[data-id='editDevice']"), dlgOpts);
    }

    function saveData(data, win) {
        var msg = "";
        if (data == null || data == "")
            return false;
        if (parseInt(data.MeetingRoomID) <= 0)
            msg += "\n会议室不能为空";
        if (data.DeviceName == null || data.DeviceName == "")
            msg += "\n设备名称不能为空";
        if (msg != "") {
              $.Com.showMsg(msg);
            return false;
        }
        var json = JSON.stringify(data);
        $.fxPost("/B_OA_DeviceSvc.data?action=Save", { JsonData: json }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            if (ret) {
                  $.Com.showMsg(ret.msg);
                win.close();
                loadData();
            }
        })
    }

    //删除数据
    function DeleteDateList(list) {
        var json = JSON.stringify(list);

        //传入后台保存
        $.fxPost("/B_OA_DeviceSvc.data?action=DeleteData", { JsonData: json }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            loadData();//加载刷新数据
        });
    }
    
    this.show = function (module, _root) {
        $.Biz.device.isInitial = true;
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/MeetingManage/Device.html", function () {
            loadData();

            //删除
            root.find("[data-id='deleteBtn']").bind("click", function () {
                var deleteList = [];
                var cacheData = models.gridModel.getCacheData().data;//取出表中改变的字段.
                for (var i = 0; i < cacheData.length; i++) {
                    if (cacheData[i].isCheck == true) {
                        deleteList.push(cacheData[i]);
                    }
                }
                if (deleteList.length > 0) {
                    if (!confirm("确定要删除吗？")) {
                        return false;
                    }
                    DeleteDateList(deleteList);
                } else {
                      $.Com.showMsg("没有选中数据行");
                    return false;
                }
            });

            //新增
            root.find("[data-id='addNewBtn']").bind("click", function () {
                editDeviceform(deviceModel);
            });
        });
    }
}