define(function () {
    return function () {
        var me = this;
        var root;
        var data;
        var models = {};
        var carData = [];
        var dateTime = new Date(); //日期对象
        var date = "";
        date = dateTime.getFullYear() + "-";
        date = date + (dateTime.getMonth() + 1) + "-1 ";
        var startMonthTime = date + " 00:00";

        var monthStartDate = new Date(dateTime.getFullYear(), dateTime.getMonth(), 1);
        var monthEndDate = new Date(dateTime.getFullYear(), dateTime.getMonth() + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);

        var endMonthTime = dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + days + " 23:59";

        this.options = {
            HtmlPath: "nnepb/oa/CarManage/B_OA_Car.html",
            Url: "B_OA_CarSvc.data"
        };

        //基本信息模
        models.baseInfo = $.Com.FormModel({
            beforeBind: function (vm, root) {
                vm._carInfoList = function () {
                    ////查看弹窗
                    $.Biz.carInfoSelect(function (data) {
                        if (data != null) {
                            models.baseInfo.viewModel.carId(data.id);
                            models.baseInfo.viewModel.carName(data.cph);
                        }
                    });
                }

                vm._getCarInfor = function (carId) {
                    if (carId == null || carId == "") {
                        $.Com.showMsg("请选择车辆！");
                        return;
                    }
                    showCarWind(carId);
                }
            }
        });

        function showCarWind(carId) {
            var dlgOpts = {
                title: '车辆相信信息查看',
                width: 600,
                height: 500,
                button: [
                    {
                        text: '关闭',
                        handler: function () {
                            win.close();
                        }
                    }
                ]
            };
            var moduleItem = { carId: carId }

            var win = $.iwf.showWin(dlgOpts);
            $.iwf.getModel("nnepb/OA/CarManage/CarInforView", function (model) {
                // model = model();
                model.show(moduleItem, win.content());
            });
        }

        models.lw = function (wftool) {
            var parameters = { caseid: wftool.wfcase.caseid };
            $.fxPost("/B_OA_CarSvc.data?action=Print", parameters, function (res) {
                var jsonData = eval('(' + res + ')');
                if (!jsonData.success) {
                    $.Com.showMsg(jsonData.msg);
                    return false;
                }

                var path = eval('(' + jsonData.content + ')').wordPath
                var data = {
                    Logo: "用车申请",
                    Title: "用车申请",
                    IsWarnSave: true,
                    Callback: function (result) { },
                    ToolPrivilege: {
                        Save: false, //保存按钮
                        Open: false //显示打开按钮
                    },
                    HttpParams: { severFilePath: path, saveFilePath: path }

                }
                ShowWordWin(data);

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

        this.show = function (formdiv, formdata, wftool) {
            if (formdiv) root = formdiv;
            data = formdata;
            var caseid = wftool.wfcase.caseid;
            var wactid = wftool.wfcase.actid;
            if (formdata.baseInfo.sqr == "" || formdata.baseInfo.sqr == null) {
                var dateTime = new Date(); //日期对象
                var date = "";
                date = dateTime.getFullYear() + "-";
                date = date + (dateTime.getMonth() + 1) + "-";
                date = date + dateTime.getDate();

                formdata.baseInfo.ycsj = date + " " + (dateTime.getHours() + 2) + ":00";;
                formdata.baseInfo.fhsj = date + " " + (dateTime.getHours() + 4) + ":00";;
            }

            //tab设置
            var tal = root.find("[data-id='talDiv']");
            if (createCalendar) createCalendar();
            tal.iwfTab(
                {
                    stretch: true, // 设置：tab滚动条无显示
                    tabchange: function (dom) {
                        if (dom != null) {
                            if (dom[0].outerHTML.indexOf("预订情况") > 0)
                                loadData({ sqr: "", cph: "", startTime: startMonthTime, endTime: endMonthTime }, true);
                        }
                    }
                }
            );

            models.baseInfo.show(root.find("[data-id='baseInfo']"), formdata.baseInfo);

            // 打印
            root.find("[data-id='printDocBtn']").click(function () {
                printDoc(caseid);
            });

            //按钮控件初始化
            //initSetControllersStatus();
            setControlShowStatus(wftool); //设置控件显示状态
        }

        function printDoc(caseid) {
            $.fxPost("B_OA_CarSvc.data?action=PrintDoc", { caseid: caseid }, function (ret) {
                var path = ret.targetpath; // 获取服务器端返回的文件路径
                var data = {
                    Logo: "打印发文",
                    Title: "打印发文",
                    Callback: function (result) { },
                    ToolPrivilege: {
                        Save: false, // 隐藏保存按钮
                        Open: true // 显示保存按钮
                    },
                    HttpParams: { severFilePath: path }
                    //IsWarnSave: true//是否弹出提示保存按钮
                }
                ShowWordWin(data);
            });
        }

        //创建日期控件
        function createCalendar() {
            root.find("[data-id='workPlanCalendar']").fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                events: carData, //数据源
                dayClick: function (date, allDay, jsEvent, view) {
                },
                eventClick: function (calEvent, jsEvent, view) {
                },
                defaultView: 'agendaWeek',
                minTime: 7,
                maxTime: 24,
                allDaySlot: false,
                axisFormat: 'H(:mm)tt',
                timeFormat: { agenda: 'H:mm{ - H:mm}' }
            });
        }

        // 载入数据
        function loadData(par, refetch) {
            $.fxPost("B_OA_CarSvc.data?action=SearchDate", par, function (data) {
                data = data.dataTable;
                carData.splice(0, carData.length); //清空数组
                for (var i = 0; i < data.length; i++) {
                    carData.push({
                        title: data[i].carName + " " + "--" + data[i].useMan,
                        workPlanName: data[i].carName,
                        start: data[i].strartTime,
                        end: data[i].endTime,
                        color: data[i].endTime < dateTime ? "#009933" : '#0066CC',
                        allDay: false
                    });
                }

                if (refetch) {
                    root.find("[data-id='workPlanCalendar']").fullCalendar('refetchEvents'); //重新获取所有事件数据
                }
            });
        }

        this.getCacheData = function () {
            data.baseInfo = models.baseInfo.getCacheData();
            return JSON.stringify(data);
        };
        this.cacheData = data;
        this.getData = function () {
            var baseInfo = models.baseInfo.getData();
            if (baseInfo != false)
                return JSON.stringify({
                    "baseInfo": baseInfo
                });
            else
                return false;
        };

        function initSetControllersStatus() {
            //将所有的div内的元素都置为不可用
            root.find("input").attr("disabled", true);
            root.find("textarea").attr("disabled", true);
            root.find("select").attr("disabled", true);
            root.find("button").attr("disabled", true);
            root.find("[data-id='carDetailBtn']").attr("disabled", false);

        };

        //设置控件显示状态
        function setControlShowStatus(wftool) {
            if (wftool.wfcase.actid == "A001") {
                root.find("input").attr("disabled", false);
                root.find("textarea").attr("disabled", false);
                root.find("select").attr("disabled", false);
                root.find("button").attr("disabled", false);
                root.find("[data-id='applyDepartment']").attr("disabled", true);
                root.find("[data-id='useMan']").attr("disabled", true);
                root.find("[data-id='carName']").attr("style", "display:none");
                root.find("[data-id='diverMan']").attr("style", "display:none");

            } else if (wftool.wfcase.actid == "A002") {
                root.find("[data-id='diverManBtn']").attr("disabled", false);

            }
        }
    }
}
);


