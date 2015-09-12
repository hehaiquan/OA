$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'SearchLeave' };
    this.show = function (module, root) {
        $.Biz.SearchLeave.show(module, root);

    };
});

$.Biz.SearchLeave = new function () {
    var root;
    var models = {};

    models.baseModel = $.Com.FormModel({
        beforeBind: function (vm, _root) {

        },
        beforeSave: function (vm, _root) {

        }
    });
    //表格Model
    models.gridModel = $.Com.GridModel({
        beforeBind: function (vm, _root) {
        },
        elementsCount: 10,
        edit: function (item, callback) {
        }
        , remove: function (row) {
        }
        , keyColumns: "id"
    });
    function loadData(startTime, endTime, leaveType, leaveName, dpname) {
        var con = {
            startTime: startTime,
            endTime: endTime,
            leaveType: leaveType,
            leaveName: leaveName,
            dpname: dpname
        };
        $.fxPost("/B_OA_LeaveSvc.data?action=SearchDate", con, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            var data = ret.data;
            data.baseInfo.leaveStartTime = startTime;
            data.baseInfo.leaveEndTime = endTime;
            data.baseInfo.leaveType = leaveType;
            data.baseInfo.leaveName = leaveName;
            data.baseInfo.dpname = dpname;
            models.baseModel.show(root.find("[data-id='search']"), data.baseInfo);
            if (ret.data.list) {
                models.gridModel.show(root.find("[data-id='listGrid']"), data.list);
            }
        })
    }

    this.show = function (module, _root) {
        $.Biz.SearchLeave.isInitial = true;
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/OA_Search/SearchLeave.html", function () {
            //默认今天时间
            var dateTime = new Date(); //日期对象
            var date = "";
            date = dateTime.getFullYear() + "-";
            date = date + (dateTime.getMonth() + 1) + "-";
            date = date + dateTime.getDate();
            var startTime = date + " 00:00:00";
            var endTime = date + " 23:59:59";
            var leaveType = "";
            var leaveName = "";
            var dpname = "";
            //查询
            root.find("[data-id='searchBtn']").click(function () {
                var curdata = models.baseModel.getCacheData();
                startTime = curdata.leaveStartTime;
                endTime = curdata.leaveEndTime;
                leaveType = curdata.leaveType;
                leaveName = curdata.leaveName;
                dpname = curdata.dpname;
                loadData(startTime, endTime, leaveType, leaveName, dpname);
            });

            //今天
            root.find("[data-id='todayBtn']").click(function () {
                var curdata = models.baseModel.getCacheData();
                leaveType = curdata.leaveType;
                leaveName = curdata.leaveName;
                dpname = curdata.dpname;
                date = dateTime.getFullYear() + "-";
                date = date + (dateTime.getMonth() + 1) + "-";
                date = date + dateTime.getDate();
                startTime = date + " 00:00:00";
                endTime = date + " 23:59:59";
                loadData(startTime, endTime, leaveType, leaveName, dpname);
            });

            //明天
            root.find("[data-id='tomorrowBtn']").click(function () {
                var curdata = models.baseModel.getCacheData();
                leaveType = curdata.leaveType;
                leaveName = curdata.leaveName;
                date = dateTime.getFullYear() + "-";
                date = date + (dateTime.getMonth() + 1) + "-";
                date = date + (dateTime.getDate() + 1);
                startTime = date + " 00:00:00";
                endTime = date + " 23:59:59";
                loadData(startTime, endTime, leaveType, leaveName, dpname);
            });

            //本周
            root.find("[data-id='weekBtn']").click(function () {
                var curdata = models.baseModel.getCacheData();
                leaveType = curdata.leaveType;
                leaveName = curdata.leaveName;
                var newDateTime = new Date(dateTime.valueOf() - ((dateTime.getDay() - 1) * 24 * 60 * 60 * 1000));
                date = newDateTime.getFullYear() + "-";
                date = date + (newDateTime.getMonth() + 1) + "-";
                date = date + newDateTime.getDate();
                startTime = date + " 00:00:00";
                endTime = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + (dateTime.getDate() + 7 - dateTime.getDay()) + " 23:59:59";
                loadData(startTime, endTime, leaveType, leaveName, dpname);
            });

            //本月
            root.find("[data-id='monthBtn']").click(function () {
                var curdata = models.baseModel.getCacheData();
                leaveType = curdata.leaveType;
                leaveName = curdata.leaveName;
                date = dateTime.getFullYear() + "-";
                date = date + (dateTime.getMonth() + 1) + "-1 ";
                startTime = date + " 00:00:00";

                var monthStartDate = new Date(dateTime.getFullYear(), dateTime.getMonth(), 1);
                var monthEndDate = new Date(dateTime.getFullYear(), dateTime.getMonth() + 1, 1);
                var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);

                endTime = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + days + " 23:59:59";
                loadData(startTime, endTime, leaveType, leaveName, dpname);
            });

            loadData(startTime, endTime, leaveType, leaveName, dpname);
        });
    }
}