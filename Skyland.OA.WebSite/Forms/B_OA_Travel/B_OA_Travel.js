
$.Biz.B_OA_Travel = function (wftool) {

    var me = this;
    var root;
    var data;
    var models = {};

    this.options = {
        HtmlPath: "Forms/B_OA_Travel/B_OA_Travel.html",
        Url: "B_OA_TravelSvc.data"
    };

    //基本信息模
    models.baseInfo = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {

        },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) {
            var msg = "";
            if (vm.travelAddress() == null || $.trim(vm.travelAddress()) == "")
                msg += "\n出差地点不能为空！";
            if (vm.travelStartTime() == null || $.trim(vm.travelStartTime()) == "")
                msg += "\n开始时间不能为空！";
            if (vm.travelEndTime() == null || $.trim(vm.travelEndTime()) == "")
                msg += "\n开始时间不能为空！";
            
            if (vm.travelStartTime() != null && $.trim(vm.travelStartTime()) != "" && vm.travelEndTime() != null && $.trim(vm.travelEndTime()) != "") {
                if (compTime($.trim(vm.travelStartTime()) + ":00:00", $.trim(vm.travelEndTime()) + ":00:00", 2))
                    msg += "\n预计结束时间不能早于开始时间";
            }
            return true;
        },
        afterBind: function (vm, root) { }
    });

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

    this.show = function (formdiv, formdata, wftool) {
        if (formdiv) root = formdiv;
        data = formdata;
        if (data.baseInfo.travelStartTime != null && data.baseInfo.travelStartTime != "")
            data.baseInfo.travelStartTime = data.baseInfo.travelStartTime.substring(0, 10);
        if (data.baseInfo.travelEndTime != null && data.baseInfo.travelEndTime != "")
            data.baseInfo.travelEndTime = data.baseInfo.travelEndTime.substring(0, 10);

        models.baseInfo.show(root.find("[data-id='baseInfo']"), formdata.baseInfo);
        setControlShowStatus(wftool);//设置控件显示状态

        // 打印
        root.find("[data-id='PrintDoc']").click(function () {
            $.post("B_OA_TravelSvc.data?action=PrintDoc", { caseid: wftool.wfcase.caseid }, function (ret) {
                var data = eval('(' + ret + ')');
                if (!data.success) {
                      $.Com.showMsg(data.msg);
                    return false;
                }

                var path = eval('(' + data.content + ')').wordPath;// 获取服务器端返回的文件路径
                var data = {
                    Logo: "打印",
                    Title: "打印",
                    Callback: function (result) { },
                    ToolPrivilege: {
                        Save: false, // 隐藏保存按钮
                        Open: true // 显示保存按钮
                    },
                    HttpParams: { severFilePath: path }
                }
                ShowWordWin(data);
            });
        });
    }

    this.getCacheData = function () {
        data.baseInfo = models.baseInfo.getCacheData();
        //data.list = models.listGrid.getCacheData();
        return JSON.stringify(data);
    };
    this.cacheData = data;
    this.getData = function () {
        var baseInfo = models.baseInfo.getData();
        //var list = models.listGrid.getData();
        if (baseInfo != false)
            return JSON.stringify({
                "baseInfo": baseInfo
            });
        else
            return false;
    };

    //设置控件显示状态
    function setControlShowStatus(wftool) {
    
    }
};

$.Biz.B_OA_Travel.prototype.version = "1.0";



