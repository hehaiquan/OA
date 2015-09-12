$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'WorkingDay' };
    this.show = function (module, root) {
        $.Biz.WorkingDay.show(module, root);

    };
});

$.Biz.WorkingDay = new function () {
    var root;
    var models = {};
    var baseModel;
    
    //表格Model
    models.gridModel = $.Com.GridModel({
        beforeBind: function (vm, _root) {
        },
        elementsCount: 10,
        edit: function (item, callback) {
            editForm(item);
        }
        , remove: function (row) {
        }
        , keyColumns: "WorkingDayID"
    });
    function loadData() {
        $.fxPost("/B_OA_WorkingDaySvc.data?action=GetData", {}, function (ret) {
            if (!ret.success) {
                $.Com.showMsg(ret.msg);
                return;
            }
            if (ret.data.dataList) {
                data = ret.data;
                baseModel = data.baseInfo;
                models.gridModel.show(root.find("[data-id='tableGrid']"), data.dataList);
                if (ret.data.dataList.length > 0)
                    root.find("[data-id='addNewBtn']").hide();
            }
        })
    }
    function editForm(item) {
        models.dayFormModel = $.Com.FormModel({});
        var dlgOpts = {
            title: '考勤时间', width: 800, height: 700,
            button: [
           {
               text: '保存', handler: function (data) {
                   var da = models.dayFormModel.getData();
                   if (da == false)
                       return;
                   saveData(da, win);
               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }]
        };
        if (item.BeginExecuteDay == "" || item.BeginExecuteDay == null) {
            var dateTime = new Date(); //日期对象
            var date = "";
            date = dateTime.getFullYear() + "-";
            date = date + (dateTime.getMonth() + 1) + "-";
            date = date + (dateTime.getDate() + 1);
            item.BeginExecuteDay = date;
        }
        var win = $.Com.showFormWin(item, function () {},
            models.dayFormModel,
            root.find("[data-id='editModel']"),
            dlgOpts);
    }

    function saveData(data, win) {
        var msg = "";
        if (!data.Monday && !data.Tuesday && !data.Wednesday && !data.Thursday && !data.Friday && !data.Saturday && !data.Sunday)
            msg += "\n请选择工作日！";
        
        if (data.BeginExecuteDay != null && data.BeginExecuteDay != "") {
            var dateTime = new Date(); //日期对象
            var date = "";
            date = dateTime.getFullYear() + "-";
            date = date + (dateTime.getMonth() + 1) + "-";
            date = date + dateTime.getDate();
            date = date + " 23:59:59";
            if (!compTime($.trim(data.BeginExecuteDay) + " 00:00:00", date, 2))
                msg += "\n开始执行日期不能早于当前时间！";
        }
        
        if (msg != "") {
            $.Com.showMsg(msg);
            return false;
        }
        var json = JSON.stringify(data);
        $.fxPost("/B_OA_WorkingDaySvc.data?action=Save", { JsonData: json }, function (ret) {
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
    
    this.show = function (module, _root) {
        $.Biz.WorkingDay.isInitial = true;
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/FunctionSet/WorkingDay.html", function () {
            loadData();

            //新增
            root.find("[data-id='addNewBtn']").bind("click", function () {
                editForm(baseModel);
            });
        });
    }
}