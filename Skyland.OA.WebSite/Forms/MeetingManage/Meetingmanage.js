
$.Biz.Meetingmanage = function (wftool) {

    var me = this;
    var root;
    var data;
    var meetingData = [];
    var models = {};

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
        HtmlPath: "Forms/Meetingmanage/Meetingmanage.html",
        Url: "B_OA_MeetingSvc.data"
    };

    //基本信息模
    models.baseInfo = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {

        },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) {
            var msg = "";
            var newDate = new Date();
            if (vm.MeetingName() == null || $.trim(vm.MeetingName()) == "")
                msg += "\n会议主题不能为空";

            if (parseInt(vm.MeetingRoomID()) <= 0)
                msg += "\n会议室不能为空";

            if (vm.StartTime() == null || $.trim(vm.StartTime()) == "")
                msg += "\n开始时间不能为空";
            if (vm.EndTime() == null || $.trim(vm.EndTime()) == "")
                msg += "\n结束时间不能为空";
            if (vm.StartTime() != null && $.trim(vm.StartTime()) != "" && vm.EndTime() != null && $.trim(vm.EndTime()) != "") {
                if (compTime($.trim(vm.StartTime()) + ":00", $.trim(vm.EndTime()) + ":00", 2))
                    msg += "\n结束时间不能早于开始时间";
            }

            if (parseInt($.trim(vm.Number())) > parseInt(data.baseInfo.MaxNumber)) {
                if (!confirm("参会人数大于会议室容纳人数，继续发送？"))
                    return false;
            }

            if (parseInt(vm.Status()) == 1) {
                alert("会议已审批不能再修改！");
                return false;
            }

            if (msg != "") {
                alert(msg);
                return false;
            }
            return true;
        }
       , isAppendSign: false
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

    //会议列表
    models.meetingTableGrid = $.Com.GridModel({
        beforeBind: function (vm, root) { },
        beforeSave: function (vm, root) {
            return true;
        },
        remove: function (item, callback) {
        },
        keyColumns: "MeetingID",//主键字段
    });

    this.show = function (formdiv, formdata, wftool) {
        if (formdiv) root = formdiv;
        data = formdata.data;
        var caseid = wftool.wfcase.caseid;
        var wactid = wftool.wfcase.actid;
        //tab设置
        var tal = root.find("[data-id='talDiv']");
        if (createCalendar) createCalendar();
        tal.iwfTab(
            {
                stretch: true,// 设置：tab滚动条无显示
                tabchange: function (dom) {
                    if (dom != null) {
                        if (dom[0].outerHTML.indexOf("预订情况") > 0)
                            loadData({ startTime: startMonthTime, endTime: endMonthTime }, true);
                    }
                }
            }
        );

        models.baseInfo.show(root.find("[data-id='baseInfo']"), data.baseInfo);
        // 打印
        root.find("[data-id='PrintDoc']").click(function () {
            printDoc(caseid);
        });
    };

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

    function printDoc(caseid) {
        $.fxPost("B_OA_MeetingSvc.data?action=PrintDoc", { caseid: caseid }, function (ret) {
            var path = ret.targetpath;// 获取服务器端返回的文件路径
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


    //设置控件显示状态
    function setControlShowStatus(wftool) {

        if (wftool.wfcase.actid == "A001") {
            root.find("[data-id='WF_RemarkBox']").hide();//隐藏评阅意见控件
        }
        //有权限时才显示确定按钮
        if (wftool.wfcase.actid != "A001") {
            root.find("[data-id='MeetingName']").attr("disabled", true);
            var sTime = root.find("[data-id='StartTime']");
            sTime.attr("disabled", true);
            sTime.unbind("click");
            var eTime = root.find("[data-id='EndTime']");
            eTime.attr("disabled", true);
            eTime.unbind("click");

            root.find("[data-id='ParticipantName']").attr("disabled", true);
            root.find("[data-id='Organizer']").attr("disabled", true);
            root.find("[data-id='Phone']").attr("disabled", true);
            root.find("[data-id='Presenter']").attr("disabled", true);
            root.find("[data-id='NeedDevice']").attr("disabled", true);
            root.find("[data-id='Purpose']").attr("disabled", true);
            root.find("[data-id='Number']").attr("disabled", true);
            root.find("[data-id='Remark']").attr("disabled", true);
        }

        if (wftool.wfcase.actid != "A003")
            root.find("[data-id='PrintDoc']").attr("disabled", true);
        if (wftool.wfcase.actid == "A003")
            root.find("[data-id='meetingRoomName']").attr("disabled", true);
    }

    //创建日期控件
    function createCalendar() {
        root.find("[data-id='workPlanCalendar']").fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            events: meetingData,//数据源
            dayClick: function (date, allDay, jsEvent, view) {
            },
            eventClick: function (calEvent, jsEvent, view) {
            },
            defaultView: 'agendaWeek',
            minTime: 8,
            maxTime: 19,
            allDaySlot: false,
            axisFormat: 'H(:mm)tt',
            timeFormat: { agenda: 'H:mm{ - H:mm}' }
        });
    }

    // 载入数据
    function loadData(par, refetch) {
        $.fxPost("B_OA_MeetingSvc.data?action=SearchDate", par, function (data) {
            if (!data.success) {
                alert(data.msg);
                return;
            }
            self.data = data.data;
            data = self.data.dataList;
            meetingData.splice(0, meetingData.length);//清空数组
            for (var i = 0; i < data.length; i++) {
                meetingData.push({
                    title: data[i].MeetingRoomName + " " + data[i].MeetingName + "--" + data[i].ParticipantNames,
                    workPlanName: data[i].MeetingName,
                    start: data[i].StartTime,
                    end: data[i].EndTime,
                    color: data[i].sEndTime < dateTime ? "#009933" : '#0066CC',
                    allDay: false
                });
            }

            if (refetch) {
                root.find("[data-id='workPlanCalendar']").fullCalendar('refetchEvents'); //重新获取所有事件数据
            }
        });
    }
};

$.Biz.Meetingmanage.prototype.version = "1.0";



