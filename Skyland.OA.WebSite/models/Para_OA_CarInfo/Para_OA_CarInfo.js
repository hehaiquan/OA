$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'Para_OA_CarInfo' };
    this.show = function (module, root) {
        $.Biz.Para_OA_CarInfo.show(module, root);
    }
});



$.Biz.Para_OA_CarInfo = new function () {
    var root;
    var data;
    var baseInfo;

    var gridModel = $.Com.GridModel({
        beforeBind: function (vm, _root) {
        },
        elementsCount: 10,
        edit: function (item, callback)
        { editModel(item); }
        , remove: function (row) {
            if (!confirm("确定要删除这条数据吗？")) return false;
            else {
                var id = row.id();
                deleteData(id);

            }
        }
        , keyColumns: "id"
    });

    //显示弹窗
    function editModel(item) {
        var detailmodel = $.Com.FormModel({});
        var dlgOpts = {
            title: '车辆信息',
            width: 820, height: 700,
            button: [
           {
               text: '保存', handler: function (data) {
                   var data = detailmodel.getData();
                   saveData(data, win);
               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }]
        };
        var win = $.Com.showFormWin(item, function () {
        }, detailmodel, root.find("[data-id='editData']"), dlgOpts);
    }

    // 保存数据
    function saveData(data, win) {
        var msg = "";
        if (data == null || data == "")
            return false;
        if (data.cph == null || $.trim(data.cph) == "")
            msg += "\n车牌号不能为空";
        if (data.carBrand == null || $.trim(data.carBrand) == "")
            msg += "\n品牌不能为空";
        if (data.proDate != null && $.trim(data.proDate) != "" && data.buyDate != null && $.trim(data.buyDate) != "") {
            if (compTime($.trim(data.proDate) + " 00:00:00", $.trim(data.buyDate) + " 00:00:00", 2))
                msg += "\n生产日期不能晚于买购日期";
        }
        if (msg != "") {
              $.Com.showMsg(msg);
            return false;
        }

        if (data.price == null || $.trim(data.price) == "")
            data.price = 0;
        var content = JSON.stringify(data);
        $.fxPost('Para_OA_CarInfoSvc.data?action=Save', { JsonData: content }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
              $.Com.showMsg(ret.msg);
            win.close();
            loadData();
        });
    }

    function compTime(stime, etime, classType) {
        if (classType == 1) {
            var arr = stime.split("-");
            var starttime = new Date(arr[0], arr[1], arr[2]);
            var starttimes = starttime.getTime();


            var arrs = etime.split("-");
            var lktime = new Date(arrs[0], arrs[1], arrs[2]);
            var lktimes = lktime.getTime();

            if (starttimes > lktimes)
                return true;
            else {
                return false;
            }
        } else {
            var beginTimes = stime.substring(0, 10).split('-');
            var endTimes = etime.substring(0, 10).split('-');

            var beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + stime.substring(10, 19);
            var endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + etime.substring(10, 19);
            var result = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
            if (result < 0)
                return true;
            else
                return false;
        }
    }

    // 载入数据
    function loadData() {
        // 载入数据
        $.fxPost("Para_OA_CarInfoSvc.data?action=GetData", {}, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            if (ret.data.dataList) {
                data = ret;
                baseInfo = ret.data.editData;
                gridModel.show(root.find("[data-id='OA_CarInfoGrid']"), ret.data.dataList);
            }
        });
    }

    // 删除行数据
    function DeleteDateList(list) {
        var json = JSON.stringify(list);
        $.fxPost("/Para_OA_CarInfoSvc.data?action=DeleteData", { JsonData: json }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            loadData();
        });
    }

    this.getCacheData = function () {
        data.baseInfo = models.baseInfo.getCacheData();
        return JSON.stringify(data);
    };
    this.cacheData = data;
    this.getData = function () {
        baseInfo = models.baseInfo.getData();
        if (baseInfo != false)
            return JSON.stringify({
                "baseInfo": baseInfo
            });
        else
            return false;
    };

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/Para_OA_CarInfo/Para_OA_CarInfo.html", function () {
            loadData();
            root.find("[data-id='addNewBtn']").bind("click", function () {
                editModel(baseInfo);
            });

            //删除
            root.find("[data-id='deleteBtn']").bind("click", function () {
                var deleteList = [];
                var cacheData = gridModel.getCacheData().data;//取出表中改变的字段.
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
        });
    }
};
