$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'WorkPlanSearch_1' };
    this.show = function (module, root) {
        $.Biz.WorkPlanSearch_1.show(module, root);
    }
});



$.Biz.WorkPlanSearch_1 = new function () {
    var self = this;
    var root;
    self.data = null;
    var models = {};
    var datas = [];

    //基本信息模
    models.searchDiv = $.Com.FormModel({});

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/OA_WorkPlan/WorkPlanSearch.html", function () {
            models.searchDiv.show(root.find("[data-id='searchDiv']"), { datetime: null, datetime1: null });
            //查询
            root.find("[data-id='searchBn']").bind("click", function () {
                var par = {
                    name: null,
                    startTime: null,
                    endTime: null
                }
                var name = $.trim(root.find("[data-id='name']").val());
                if (name != "") par.name = name;
                var startTime = $.trim(root.find("[data-id='beginText']").val());
                var endTime = $.trim(root.find("[data-id='endText']").val());
                if (startTime != "") par.startTime=  startTime ;
                if (endTime != "") par.endTime=  endTime ;
                loadData(null, par,true);
            });

            loadData(createCalendar, {}, false);
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

            },
            eventClick: function (calEvent, jsEvent, view) {
                var item = {
                    id: calEvent.id,
                    workPlanName: calEvent.title,
                    userid: calEvent.userid,
                    userName: calEvent.userName,
                    remark: calEvent.remark,
                    startTime: calEvent.start,
                    endTime: calEvent.end == null ? calEvent.start : calEvent.end
                }
                showDetail(item, null);//显示弹窗
            }
        });
    }

    // 载入数据
    function loadData(callbackFunction, par, refetch) {
        $.fxPost("B_OA_WorkPlanSvc.data?action=GetData", par, function (data) {
            self.data = data.data;
            data = self.data.Table;
            datas.splice(0, datas.length);//清空数组
            for (var i = 0; i < data.length; i++) {
                datas.push({
                    title: data[i].workPlanName,//事件标题 
                    start: data[i].startTime,//事件开始时间 
                    end: data[i].endTime,  //结束时间 
                    userid: data[i].userid,
                    userName: data[i].userName,
                    remark: data[i].remark,
                    confcolor: '#ff3f3f',
                    allDay: false,//是否为全天事件 
                    id: data[i].id//事件id 
                });
            }
            if (callbackFunction) callbackFunction();
            if (refetch) {       
                root.find("[data-id='workPlanCalendar']").fullCalendar('refetchEvents'); //重新获取所有事件数据
            }
        });
    }

    //显示弹窗
    function showDetail(item, callback) {
        var detailmodel = $.Com.FormModel({});
        var dlgOpts = {
            title: '预览', width: 800, height: 700,
            button: [
            {
              text: '取消', handler: function () { win.close(); }
            }
            ]
        };

        //数据、保存回调、模块、html模板、选项
        var win = $.Com.showFormWin(item, function () {
        }, detailmodel, root.find("[data-id='edit']"), dlgOpts);
    }


};





