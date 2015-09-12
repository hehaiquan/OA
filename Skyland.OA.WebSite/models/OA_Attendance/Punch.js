$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'Punch' };
    this.show = function (module, root) {
        $.Biz.Punch.show(module, root);

    };
});

$.Biz.Punch = new function () {
    var root;
    var models = {};
    models.baseInfoModel = $.Com.FormModel({});
    
    function loadData() {
        $.fxPost("/B_OA_PunchSvc.data?action=GetData", {}, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            ret.data.baseInfo.StartTimeText = "上班 " + ret.data.baseInfo.StartTime;
            ret.data.baseInfo.EndTimeText = "下班 " + ret.data.baseInfo.EndTime;
            models.baseInfoModel.show(root.find("[data-id='baseInfo']"), ret.data.baseInfo);
            setControlShowStatus(ret.data.baseInfo);
        })
    }

    this.show = function (module, _root) {
        $.Biz.Punch.isInitial = true;
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/OA_Attendance/Punch.html", function () {
            loadData();

            //签到
            root.find("[data-id='signlBtn']").bind("click", function () {
                
                var cacheData = models.baseInfoModel.getCacheData();
                saveData(cacheData,1);
            });
            
            //签退
            root.find("[data-id='signOutlBtn']").bind("click", function () {
                var cacheData = models.baseInfoModel.getCacheData();
                
                var dateTime = new Date();
                var date = dateTime.getFullYear() + "-";
                date = date + (dateTime.getMonth() + 1) + "-";
                date = date + dateTime.getDate();
                
                var sTime = date + " " + cacheData.EndTime + ":00";
                var eTime = date + " " + dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
                if (compTime(sTime, eTime, 2)) {
                    if (confirm("现在签退属于早退，继续？")) {
                        saveData(cacheData, 2);
                    }
                }
            });
            
            //保存备注
            root.find("[data-id='saveBtn']").bind("click", function () {
                var cacheData = models.baseInfoModel.getCacheData();
                saveData(cacheData, 3);
            });
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
    
    function saveData(data, optType) {
        if (data == null || data == "")
            return false;
        var json = JSON.stringify(data);
        $.fxPost("/B_OA_PunchSvc.data?action=save", { JsonData: json, optType: optType }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            if (ret) {
                if (optType == 1)
                      $.Com.showMsg("签到成功");
                if (optType == 2)
                      $.Com.showMsg("签退成功");
                if (optType == 3)
                      $.Com.showMsg("保存成功");
                loadData();
            }
        })
    }

    function setControlShowStatus(data) {
        
        if (data.ToWorkTime != "" && data.ToWorkTime != null) {
            root.find("[data-id='ToWorkTime']").attr("disabled", true);
            root.find("[data-id='signlBtn']").hide();
            root.find("[data-id='DownWorkTime']").attr("disabled", false);
            root.find("[data-id='signOutlBtn']").show();
        } else {
            root.find("[data-id='DownWorkTime']").attr("disabled", true);
            root.find("[data-id='signOutlBtn']").hide();
        }
        
        if (data.DownWorkTime != "" && data.DownWorkTime != null) {
            root.find("[data-id='DownWorkTime']").attr("disabled", true);
            root.find("[data-id='signOutlBtn']").hide();
        }
    }
}