﻿$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'OnDuty' };
    this.show = function (module, root) {
        $.Biz.OnDuty.show(module, root);
    }
});



$.Biz.OnDuty = new function () {
    var self = this;
    var root;
    self.data = null;
    var models = {};
    var datas = [];
    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/OA_WorkPlan/OnDuty.html", function () {

            loadData(createCalendar, {}, false);
            root.find("[data-id='AddBn']").bind("click", function () {
                showDetail(self.data.baseInfo,"新增", null);
            });
        });
    }


    // 保存数据
    function saveData(lawData, win, callback) {
        if (lawData == null || lawData == "") return;
        var content = JSON.stringify(lawData);
        var msg = "";
        if (lawData.workPlanName == null || $.trim(lawData.workPlanName) == "") msg += "\n值班名称不能空！"
        if (lawData.userName == null || $.trim(lawData.userName) == "") msg += "\n值班人不能空！"       
        if (lawData.startTime == null || $.trim(lawData.startTime) == "") msg += "\n开始时间不能空！"
        if (lawData.endTime == null || $.trim(lawData.endTime) == "") msg += "\n结束时间不能空！"
        if (msg != "") {   $.Com.showMsg(msg); return; }
        $.post('B_OA_WorkPlanSvc.data?action=SaveOnDutyData', { JsonData: content, userName: parent.$.iwf.userinfo.CnName }, function (res) {
            var json = eval('(' + res + ')')
            if (json.success) {
                  $.Com.showMsg(json.msg);
                loadData(null, {}, true);
                win.close();
            }
            else {
                  $.Com.showMsg(json.msg);
            }

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
                showDetail(self.data.baseInfo,"新增", null);
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
                }
                showDetail(item, "编辑", null);//显示弹窗
            }
        });
    }

    // 载入数据
    function loadData(callbackFunction, par, refetch) {
        $.fxPost("B_OA_WorkPlanSvc.data?action=GetOnDutyData", par, function (data) {
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
                    //color: data[i].isWc == "1" ? "#009933" : '#0066CC',// '#ff3f3f',
                    allDay: true,//是否为全天事件 
                    id: data[i].id,//事件id 
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
        $.post('B_OA_WorkPlanSvc.data?action=DeleteOnDuty', { id: da.id }, function (res) {
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
       models.detailmodel = $.Com.FormModel({});
        var dlgOpts = {
            title: titleName, width: 800, height: 500,
            button: [
                {
                    text: '删除', handler: function (data) {
                        var da = detailmodel.getData();
                        if (da == false) {
                            return;
                        }
                        deleteData(da, win);
                    }
                },
           {
               text: '保存', handler: function (data) {
                   var da = models.detailmodel.getData();
                   if(da==false){
                       return;
                   }
                   saveData(da, win, null);
               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }
            ]
        };
        //if (item.isWc == "1" || item.isFq == "1") dlgOpts.button = null;
        //数据、保存回调、模块、html模板、选项
        var win = $.Com.showFormWin(item, function () {
        }, models.detailmodel, root.find("[data-id='edit']"), dlgOpts);

    }


};





