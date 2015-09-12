$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'WorkPlanDept' };
    this.show = function (module, root) {
        $.Biz.WorkPlanDept.show(module, root);
    }
});



$.Biz.WorkPlanDept = new function () {
    var self = this;
    var root;
    self.data = null;
    var models = {};
    var datas = [];
    var planType = 1;//工作计划类型1为部门工作计划0为个人工作计划
    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/OA_WorkPlan/WorkPlanDept.html", function () {
            loadData(createCalendar, { planType: planType }, false);
            root.find("[data-id='AddBn']").bind("click", function () {
                showDetail(self.data.baseInfo, "新增", null);
            });
        });
    }


    // 保存数据
    function saveData(lawData, win, callback) {
        if (lawData == null || lawData == "") return;
        var content = JSON.stringify(lawData);
        var msg = "";
        if (lawData.workPlanName == null || $.trim(lawData.workPlanName) == "") msg += "\n工作计划名称不能空！"
        if (lawData.userName == null || $.trim(lawData.userName) == "") msg += "\n工作人不能空！"
        if (lawData.startTime == null || $.trim(lawData.startTime) == "") msg += "\n开始时间不能空！"
        if (lawData.endTime == null || $.trim(lawData.endTime) == "") msg += "\n结束时间不能空！"
        if (msg != "") {   $.Com.showMsg(msg); return; }
        $.fxPost('B_OA_WorkPlanSvc.data?action=SaveData', { JsonData: content, userName: parent.$.iwf.userinfo.CnName }, function (res) {
            if (!res.success) {
                  $.Com.showMsg(res.msg);
                return;
            }
            loadData(createCalendar, { planType: planType }, false);
            win.close();

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
            events: datas,//数据源
            dayClick: function (date, allDay, jsEvent, view) {
                //var selDate = $.fullCalendar.formatDate(date, 'yyyy-MM-dd');
                //$.fancybox({
                //    'type': 'ajax',
                //    'href': 'event.php?action=add&date=' + selDate
                //});

                //self.data.baseInfo.startTime = date;//.format("yyyy-MM-dd hh:mm:ss");
                showDetail(self.data.baseInfo, "新增", null);
            },
            eventClick: function (calEvent, jsEvent, view) {
                var item = {
                    id: calEvent.id,
                    workPlanName: calEvent.workPlanName,
                    userid: calEvent.userid,
                    userName: calEvent.userName,
                    department: calEvent.department,
                    deptName: calEvent.deptName,
                    remark: calEvent.remark,
                    startTime: calEvent.start,
                    endTime: calEvent.end == null ? calEvent.start : calEvent.end,
                    isWc: calEvent.isWc,
                    isFq: calEvent.isFq
                }
                showDetail(item, "编辑", null);//显示弹窗

                //$.fancybox({
                //    'type': 'ajax',
                //    'href': 'event.php?action=edit&id=' + calEvent.id
                //});
            }
        });
    }

    // 载入数据
    function loadData(callbackFunction, par, refetch) {
        $.fxPost("B_OA_WorkPlanSvc.data?action=GetWorkPlan", par, function (data) {
            if(!data.success){
                  $.Com.showMsg(data.msg);
                return;
            }
            self.data = data.data;
            data = self.data.Table;
            datas.splice(0, datas.length);//清空数组
            for (var i = 0; i < data.length; i++) {
                datas.push({
                    title: data[i].userName + "--" + data[i].workPlanName,//事件标题 
                    workPlanName: data[i].workPlanName,//事件标题
                    start: data[i].startTime,//事件开始时间 
                    end: data[i].endTime,  //结束时间 
                    userid: data[i].userid,
                    userName: data[i].userName,
                    department: data[i].department,
                    deptName: data[i].deptName,
                    remark: data[i].remark,
                    //fullname: data[i].workPlanName,
                    //confname: data[i].workPlanName,
                    //confshortname: data[i].workPlanName,
                    //confcolor: '#ff3f3f',
                    color: data[i].isWc == "1" ? "#009933" : '#0066CC',// '#ff3f3f',
                    //confid: data[i].id,
                    allDay: true,//是否为全天事件 
                    //topic: '每日会议',
                    //description: '每日会议',
                    id: data[i].id,//事件id 
                    isWc: data[i].isWc,
                    isFq: data[i].isFq
                });
            }
            if (self.data.baseInfo.userName == null) self.data.baseInfo.userName = parent.$.iwf.userinfo.CnName
            if (callbackFunction) callbackFunction();
            if (refetch) {
                root.find("[data-id='workPlanCalendar']").fullCalendar('refetchEvents'); //重新获取所有事件数据
            }
        });
    }


    function deleteData(da, win) {
        if (!confirm("确定要删除这条数据吗？")) return;
        //if (da.isWc == "1") {   $.Com.showMsg("工作已完成无法删除"); return;}
        //if (da.isFq == "1") {   $.Com.showMsg("工作已分配法删除"); return; }
        $.post('B_OA_WorkPlanSvc.data?action=DeletePlan', { id: da.id }, function (res) {
            var json = eval('(' + res + ')')
            if (json.success) {
                  $.Com.showMsg(json.msg);
                for (var i = 0; i < datas.length; i++) {
                    if (datas[i].id == da.id) {
                        datas.splice(i, 1);//移除数组元素
                        root.find("[data-id='workPlanCalendar']").fullCalendar('refetchEvents'); //刷新数据
                        break;
                    }
                }
                win.close();
            }
            else {
                  $.Com.showMsg(json.msg);
            }

        });
    }

    //显示弹窗
    function showDetail(item, titleName, callback) {
        var detailmodel = $.Com.FormModel({});
        var dlgOpts = {
            title: titleName, width: 800, height: 500,
            button: [
                {
                    text: '删除', handler: function (data) {
                        var da = detailmodel.getData();
                        deleteData(da, win);
                    }
                },
           {
               text: '保存', handler: function (data) {
                   var da = detailmodel.getData();
                   saveData(da, win, null);
               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }
            ]
        };
        if (item.isWc == "1" || item.isFq == "1") dlgOpts.button = null;
        //数据、保存回调、模块、html模板、选项
        var win = $.Com.showFormWin(item, function () {
            //// 确定保存数据
            //var data = detailmodel.getData();
            //saveData(data);
        }, detailmodel, root.find("[data-id='edit']"), dlgOpts);

    }


};





