$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'myAttendance' };
    this.show = function (module, root) {
        $.Biz.myAttendance.show(module, root);
    }
});



$.Biz.myAttendance = new function () {
    var self = this;
    var root;
    self.data = null;
    var models = {};
    var datas = [];
    var planType = 0;//工作计划类型1为部门工作计划0为个人工作计划
    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/OA_Attendance/myAttendance.html", function () {

            loadData(createCalendar, {}, false);
        });
    }


    //创建日期控件
    function createCalendar() {
        root.find("[data-id='workPlanCalendar']").fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek'
            },
            events: datas,//数据源
            dayClick: function (date, allDay, jsEvent, view) {
            },
            eventClick: function (calEvent, jsEvent, view) {
                var item = {
                    PunchID: calEvent.PunchID,
                    UserID: calEvent.UserID,
                    PunchDate: calEvent.PunchDate,
                    ToWorkTime: calEvent.ToWorkTime,
                    DownWorkTime: calEvent.DownWorkTime,
                    Remark: calEvent.Remark,
                    StartTime: calEvent.StartTime,
                    EndTime: calEvent.EndTime,
                    StartTimeText: "上班 " + calEvent.StartTime,
                    EndTimeText: "下班 " + calEvent.EndTime
                }
                showDetail(item, calEvent.PunchDate + "考勤说明");//显示弹窗
            },
            allDaySlot: false
        });
    }

    // 载入数据
    function loadData(callbackFunction, par, refetch) {
        $.fxPost("B_OA_PunchSvc.data?action=SearchDate", par, function (data) {
            self.data = data.data;
            data = self.data.dataList;
            datas.splice(0, datas.length);//清空数组
            var stratTime = "";
            var endTime = "";
            for (var i = 0; i < data.length; i++) {
                stratTime = data[i].PunchDate  +" "+ data[i].ToWorkTime;
                endTime = data[i].PunchDate + " " + data[i].DownWorkTime;
                datas.push({
                    title: data[i].ToWorkTime + "~" + data[i].DownWorkTime + (data[i].Remark == null ? "" : " 备注：" + data[i].Remark),//事件标题 
                    start: stratTime,//事件开始时间 
                    end: endTime,  //结束时间 
                    PunchID: data[i].PunchID,
                    UserID: data[i].UserID,
                    PunchDate: data[i].PunchDate,
                    ToWorkTime: data[i].ToWorkTime,
                    DownWorkTime: data[i].DownWorkTime,
                    Remark: data[i].Remark,
                    StartTime: data[i].StartTime,
                    EndTime: data[i].EndTime,
                    StartTimeText: data[i].StartTimeText,
                    EndTimeText: data[i].EndTimeText
                });
            }
            if (callbackFunction) callbackFunction();
            if (refetch) {
                root.find("[data-id='workPlanCalendar']").fullCalendar('refetchEvents'); //重新获取所有事件数据
            }
        });
    }
    
    //显示弹窗
    function showDetail(item, titleName) {
        var detailmodel = $.Com.FormModel({});
        var dlgOpts = {
            title: titleName, width: 500, height: 400,
            button: [
                {
                    text: '保存', handler: function (data) {
                        var da = detailmodel.getData();
                        saveData(da,win, 3);
                    }
                },
              {
                  text: '取消', handler: function () { win.close(); }
              }
            ]
        };
        if (item.isWc == "1") dlgOpts.button = null;
        var win = $.Com.showFormWin(item, function () {
        }, detailmodel, root.find("[data-id='baseInfo']"), dlgOpts);
        
    }
    
    //function setControlShowStatus() {
    //        root.find("[data-id='ToWorkTime']").style("disabled", true);
    //        root.find("[data-id='DownWorkTime']").style("disabled", true);
    //}
    
    function saveData(data, win,optType) {
        if (data == null || data == "")
            return false;
        var json = JSON.stringify(data);
        $.fxPost("/B_OA_PunchSvc.data?action=save", { JsonData: json, optType: optType }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            if (ret) {
                  $.Com.showMsg("保存成功");
                win.close();
                loadData();
            }
        })
    }
};





