$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'Attendance' };
    this.show = function (module, root) {
        $.Biz.Attendance.show(module, root);
    }
});

$.Biz.Attendance = new function () {
    var self = this;
    var root;
    self.data = null;
    var models = {};
    models.searchDiv = $.Com.FormModel({
        beforeBind: function (vm, root) {
        },
        beforeSave: function (vm, root) {
            return true;
        },
        afterBind: function (vm, root) { }
    });

    models.gridModel = $.Com.GridModel({
        keyColumns: "id",
        beforeBind: function (vm, root) {
        },
        edit: function (item, callback) { },
        remove: function (row) {
        },
        elementsCount: 10
    });

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;

        root.load("models/OA_Attendance/Attendance.html", function () {
            //默认时间本月
            var dateTime = new Date(); //日期对象
            var date = "";
            date = dateTime.getFullYear() + "-";
            date = date + (dateTime.getMonth() + 1) + "-1 ";
            var startTime = date + " 00:00:00";

            var monthStartDate = new Date(dateTime.getFullYear(), dateTime.getMonth(), 1);
            var monthEndDate = new Date(dateTime.getFullYear(), dateTime.getMonth() + 1, 1);
            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);

            var endTime = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + days + " 23:59:59";
            var countType = "";
            var userName = "";
            var dpname = "";
            
            //查询
            root.find("[data-id='searchBtn']").click(function () {
                var curdata = models.searchDiv.getCacheData();
                startTime = (curdata.yearAttendance == null || curdata.yearAttendance == "") ? dateTime.getFullYear() + "-" + curdata.monthAttendance + "-01 00:00:00" : curdata.yearAttendance + "-" + curdata.monthAttendance + "-01 00:00:00";
                endTime = (curdata.yearAttendance == null || curdata.yearAttendance == "") ?
                    (parseInt(curdata.monthAttendance) == 12 ? (parseInt(dateTime.getFullYear()) + 1) + "-01-01 00:00:00" : dateTime.getFullYear() + "-" + (parseInt(curdata.monthAttendance) + 1) + "-01 00:00:00") :
                    (parseInt(curdata.monthAttendance) == 12 ? (parseInt(curdata.yearAttendance) + 1)+ "-01-01 00:00:00" : curdata.yearAttendance + "-" + (parseInt(curdata.monthAttendance) + 1) + "-01 00:00:00");
                countType = curdata.countType;
                userName = curdata.userName;
                dpname = curdata.dpname;
                loadData(startTime, endTime, countType, userName, dpname);
            });

            //今天
            root.find("[data-id='todayBtn']").click(function () {
                var curdata = models.searchDiv.getCacheData();
                countType = curdata.countType;
                userName = curdata.userName;
                dpname = curdata.dpname;
                date = dateTime.getFullYear() + "-";
                date = date + (dateTime.getMonth() + 1) + "-";
                date = date + dateTime.getDate();
                startTime = date + " 00:00:00";
                endTime = date + " 23:59:59";
                loadData(startTime, endTime, countType, userName, dpname);
            });

            //本周
            root.find("[data-id='weekBtn']").click(function () {
                var curdata = models.searchDiv.getCacheData();
                countType = curdata.countType;
                userName = curdata.userName;
                var newDateTime = new Date(dateTime.valueOf() - ((dateTime.getDay() - 1) * 24 * 60 * 60 * 1000));
                date = newDateTime.getFullYear() + "-";
                date = date + (newDateTime.getMonth() + 1) + "-";
                date = date + newDateTime.getDate();
                startTime = date + " 00:00:00";
                endTime = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + (dateTime.getDate() + 7 - dateTime.getDay()) + " 23:59:59";
                loadData(startTime, endTime, countType, userName, dpname);
            });

            //本月
            root.find("[data-id='monthBtn']").click(function () {
                var curdata = models.searchDiv.getCacheData();
                countType = curdata.countType;
                userName = curdata.userName;
                date = dateTime.getFullYear() + "-";
                date = date + (dateTime.getMonth() + 1) + "-1 ";
                startTime = date + " 00:00:00";

                 monthStartDate = new Date(dateTime.getFullYear(), dateTime.getMonth(), 1);
                 monthEndDate = new Date(dateTime.getFullYear(), dateTime.getMonth() + 1, 1);
                 days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);

                endTime = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + days + " 23:59:59";
                loadData(startTime, endTime, countType, userName, dpname);
            });
            
            loadData(startTime, endTime, countType, userName, dpname);
        });
    }

    // 载入数据
    function loadData(startTime, endTime, countType, userName, dpname) {
        var con = {
            startTime: startTime,
            endTime: endTime,
            countType: countType,
            userName: userName,
            dpname: dpname
        };
        $.fxPost("B_OA_PunchSvc.data?action=SearchReport", con, function (data) {
            if (!data.success) {
                  $.Com.showMsg(data.msg);
                return;
            }

            data.data.baseInfo.yearAttendance = startTime.split('-')[0];
            data.data.baseInfo.monthAttendance = startTime.split('-')[1];
            data.data.baseInfo.userName = userName;
            data.data.baseInfo.dpname = dpname;
            models.searchDiv.show(root.find("[data-id='search']"), data.data.baseInfo);
            if (data.data.dataList) {
                models.gridModel.show(root.find('[data-role="AttendanceGrid"]'), data.data.dataList);
            }
        });
    }

};





