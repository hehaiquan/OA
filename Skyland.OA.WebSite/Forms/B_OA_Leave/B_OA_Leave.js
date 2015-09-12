
$.Biz.B_OA_Leave = function (wftool) {

    var me = this;
    var root;
    var data;
    var models = {};
    this.options = {
        HtmlPath: "Forms/B_OA_Leave/B_OA_Leave.html",
        Url: "B_OA_LeaveSvc.data"
    };

    //基本信息模
    models.baseInfo = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
          
            vm.autoCalculation = function (sTime, eTime) {
                if (sTime == "" && eTime == "") {
                    return;
                }
                if (sTime.indexOf('.') != -1) {
                    sTime = sTime.substring(0, str.indexOf('.'));
                };
                sTime = new Date(Date.parse(sTime.replace(/-/g, "/").replace("T", " ")));

                if (eTime.indexOf('.') != -1) {
                    eTime = sTime.substring(0, str.indexOf('.'));
                };
                eTime = new Date(Date.parse(eTime.replace(/-/g, "/").replace("T", " ")));
                var date3 = eTime.getTime() - sTime.getTime();
                var days = Math.floor(date3 / (24 * 3600 * 1000));
                models.baseInfo.viewModel.totalDays(days);
            }
            vm.GetLeveViewByUserId = function (leaveer) {
                if (leaveer == null || leaveer == "") {
                    $.Com.showMsg("用户ID为空，无法查看");
                    return;
                }
               
                showLeaveConditionWin(leaveer);
            }
        },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) {
            var msg = "";
            if (parseInt(vm.leaveType()) <= 0)
                msg += "\n请假类型不能为空！";
            if (vm.leaveReason() == null || $.trim(vm.leaveReason()) == "")
                msg += "\n请假事由不能为空！";

            if (vm.leaveStartTime() == null || $.trim(vm.leaveStartTime()) == "")
                msg += "\n开始时间不能为空！";
            if (vm.leaveEndTime() == null || $.trim(vm.leaveEndTime()) == "")
                msg += "\n开始时间不能为空！";

            if (vm.leaveStartTime() != null && $.trim(vm.leaveStartTime()) != "" && vm.leaveEndTime() != null && $.trim(vm.leaveEndTime()) != "") {
                if (compTime($.trim(vm.leaveStartTime()) + ":00", $.trim(vm.leaveEndTime()) + ":00", 2))
                    msg += "\n结束时间不能早于开始时间";
            }
            if (msg != "") {
                $.Com.showMsg(msg);
                return false;
            }
            return true;
        },
        afterBind: function (vm, root) { },
        isAppendSign: false
    });

    function showLeaveConditionWin(leaveer) {
        var dlgOpts = {
            title: '请假情况查看', width: 600, height: 500,
            button: [
          {
              text: '关闭', handler: function () {
                  win.close();
              }
          }
            ]
        };
        var moduleItem = { userId: leaveer }
        var win = $.iwf.showWin(dlgOpts);
        $.iwf.getModel("nnepb/OA/Leave/LeaveInforView", function (model) {
            // model = model();
            model.show(moduleItem, win.content());
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

    //请假列表
    models.listGrid = $.Com.GridModel({
        beforeBind: function (vm, root) { },
        beforeSave: function (vm, root) {
            return true;
        },
        remove: function (item, callback) {
        },
        keyColumns: "id",//主键字段
    });

    this.show = function (formdiv, formdata, wftool) {
        if (formdiv) root = formdiv;
        data = formdata;
        var caseid = wftool.wfcase.caseid;

        models.baseInfo.show(root.find("[data-id='baseInfo']"), data.baseInfo);
        setControlShowStatus(wftool);

        // 打印
        root.find("[data-id='printDocBtn']").click(function () {
            //查找请假类型
            var type = $(root.find("[data-id='leaveType']")[0]).children('option:selected').text();//.selectedOptions[0].innerText;
            printDoc(caseid,type);
        });
    }

    function printDoc(caseid, type) {
       $.fxPost("B_OA_LeaveSvc.data?action=PrintDoc", { caseid: caseid, type: type }, function (ret) {
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

    //设置控件显示状态
    function setControlShowStatus(wftool) {

    }
};

$.Biz.B_OA_Leave.prototype.version = "1.0";



