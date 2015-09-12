$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'SearchTravel' };
    this.show = function (module, root) {
        $.Biz.SearchTravel.show(module, root);

    };
});

$.Biz.SearchTravel = new function () {
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
    function loadData(startTime, endTime, travelStatus, travelerName, dpname) {
        var con = {
            startTime: startTime,
            endTime: endTime,
            travelStatus:travelStatus,
            travelerName:travelerName,
            dpname:dpname
        };
        $.fxPost("/B_OA_TravelSvc.data?action=SearchDate", con, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            var data = ret.data;
            data.baseInfo.StartTime = startTime;
            data.baseInfo.EndTime = endTime;
            data.baseInfo.travelStatus = travelStatus;
            data.baseInfo.travelerName = travelerName;
            data.baseInfo.dpname = dpname;
            models.baseModel.show(root.find("[data-id='search']"), data.baseInfo);
            if (ret.data.list) {
                models.gridModel.show(root.find("[data-id='listGrid']"), data.list);
            }
        })
    }

    this.show = function (module, _root) {
        $.Biz.SearchTravel.isInitial = true;
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/OA_Search/SearchTravel.html", function () {
            //默认今天时间
            var dateTime = new Date(); //日期对象
            var date = "";
            date = dateTime.getFullYear() + "-";
            date = date + (dateTime.getMonth() + 1) + "-";
            date = date + dateTime.getDate();
            var startTime = date + " 00:00:00";
            var endTime = date + " 23:59:59";
            var travelStatus = "";
            var travelerName = "";
            var dpname = "";
            //查询
            root.find("[data-id='searchBtn']").click(function () {
                var curdata = models.baseModel.getCacheData();
                startTime = curdata.StartTime;
                endTime = curdata.EndTime;
                travelStatus = curdata.travelStatus;
                travelerName = curdata.travelerName;
                dpname = curdata.dpname;
                loadData(startTime, endTime, travelStatus, travelerName, dpname);
            });

            //今天
            root.find("[data-id='todayBtn']").click(function () {
                var curdata = models.baseModel.getCacheData();
                travelStatus = curdata.travelStatus;
                travelerName = curdata.travelerName;
                dpname = curdata.dpname;
                date = dateTime.getFullYear() + "-";
                date = date + (dateTime.getMonth() + 1) + "-";
                date = date + dateTime.getDate();
                startTime = date + " 00:00:00";
                endTime = date + " 23:59:59";
                loadData(startTime, endTime, travelStatus, travelerName, dpname);
            });

            //明天
            root.find("[data-id='tomorrowBtn']").click(function () {
                var curdata = models.baseModel.getCacheData();
                travelStatus = curdata.travelStatus;
                travelerName = curdata.travelerName;
                date = dateTime.getFullYear() + "-";
                date = date + (dateTime.getMonth() + 1) + "-";
                date = date + (dateTime.getDate() + 1);
                startTime = date + " 00:00:00";
                endTime = date + " 23:59:59";
                loadData(startTime, endTime, travelStatus, travelerName, dpname);
            });

            //本周
            root.find("[data-id='weekBtn']").click(function () {
                var curdata = models.baseModel.getCacheData();
                travelStatus = curdata.travelStatus;
                travelerName = curdata.travelerName;
                var newDateTime = new Date(dateTime.valueOf() - ((dateTime.getDay() - 1) * 24 * 60 * 60 * 1000));
                date = newDateTime.getFullYear() + "-";
                date = date + (newDateTime.getMonth() + 1) + "-";
                date = date + newDateTime.getDate();
                startTime = date + " 00:00:00";
                endTime = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + (dateTime.getDate() + 7 - dateTime.getDay()) + " 23:59:59";
                loadData(startTime, endTime, travelStatus, travelerName, dpname);
            });

            //本月
            root.find("[data-id='monthBtn']").click(function () {
                var curdata = models.baseModel.getCacheData();
                travelStatus = curdata.travelStatus;
                travelerName = curdata.travelerName;
                date = dateTime.getFullYear() + "-";
                date = date + (dateTime.getMonth() + 1) + "-1 ";
                startTime = date + " 00:00:00";

                var monthStartDate = new Date(dateTime.getFullYear(), dateTime.getMonth(), 1);
                var monthEndDate = new Date(dateTime.getFullYear(), dateTime.getMonth() + 1, 1);
                var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);

                endTime = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + days + " 23:59:59";
                loadData(startTime, endTime, travelStatus, travelerName, dpname);
            });

            loadData(startTime, endTime, travelStatus, travelerName, dpname);
        });
    }
}