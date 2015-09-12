$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'SearchCar' };
    this.show = function (module, root) {
        $.Biz.SearchCar.show(module, root);

    };
});

$.Biz.SearchCar = new function () {
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
    });
    function loadData(sqr, cph, startTime, endTime) {
        var con = {
            sqr: sqr,
            cph: cph,
            startTime: startTime,
            endTime: endTime
        };
        $.fxPost("/B_OA_CarSvc.data?action=SearchDate", con, function (ret) {
            models.gridModel.show(root.find("[data-id='deviceTableGrid']"), ret.dataTable);
        });
    }

    this.show = function (module, _root) {
        $.Biz.SearchCar.isInitial = true;
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/CarInfo/SearchCar.html", function () {
            //默认今天时间
            var dateTime = new Date(); //日期对象
            var date = "";
            date = dateTime.getFullYear() + "-";
            date = date + (dateTime.getMonth() + 1) + "-";
            date = date + dateTime.getDate();
            var sqr = "";
            var cph = "";
            var startTime = date + " 00:00:00";
            var endTime = date + " 23:59:59";

            //查询
            root.find("[data-id='searchBtn']").click(function () {
                sqr = root.find("[data-id='sqr']").val();
                cph = root.find("[data-id='cph']").val();
                var curdata = models.baseModel.getCacheData();
                startTime = curdata.ycsj;
                endTime = curdata.fhsj;
                loadData(sqr, cph, startTime, endTime);
            });

            //今天
            root.find("[data-id='todayBtn']").click(function () {
                sqr = root.find("[data-id='sqr']").val();
                cph = root.find("[data-id='cph']").val();
                date = dateTime.getFullYear() + "-";
                date = date + (dateTime.getMonth() + 1) + "-";
                date = date + dateTime.getDate();
                startTime = date + " 00:00:00";
                endTime = date + " 23:59:59";
                loadData(sqr, cph, startTime, endTime);
            });

            //明天
            root.find("[data-id='tomorrowBtn']").click(function () {
                sqr = root.find("[data-id='sqr']").val();
                cph = root.find("[data-id='cph']").val();
                date = dateTime.getFullYear() + "-";
                date = date + (dateTime.getMonth() + 1) + "-";
                date = date + (dateTime.getDate() + 1);
                startTime = date + " 00:00:00";
                endTime = date + " 23:59:59";
                loadData(sqr, cph, startTime, endTime);
            });

            //本周
            root.find("[data-id='weekBtn']").click(function () {
                sqr = root.find("[data-id='sqr']").val();
                cph = root.find("[data-id='cph']").val();
                var newDateTime = new Date(dateTime.valueOf() - ((dateTime.getDay() - 1) * 24 * 60 * 60 * 1000));
                date = newDateTime.getFullYear() + "-";
                date = date + (newDateTime.getMonth() + 1) + "-";
                date = date + newDateTime.getDate();
                startTime = date + " 00:00:00";
                endTime = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + (dateTime.getDate() + 7 - dateTime.getDay()) + " 23:59:59";
                loadData(sqr, cph, startTime, endTime);
            });

            //本月
            root.find("[data-id='monthBtn']").click(function () {
                sqr = root.find("[data-id='sqr']").val();
                cph = root.find("[data-id='cph']").val();
                date = dateTime.getFullYear() + "-";
                date = date + (dateTime.getMonth() + 1) + "-1 ";
                startTime = date + " 00:00:00";

                var monthStartDate = new Date(dateTime.getFullYear(), dateTime.getMonth(), 1);
                var monthEndDate = new Date(dateTime.getFullYear(), dateTime.getMonth() + 1, 1);
                var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);

                endTime = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + days + " 23:59:59";
                loadData(sqr, cph, startTime, endTime);
            });

            loadData(sqr, cph, startTime, endTime);
        });
    }
}