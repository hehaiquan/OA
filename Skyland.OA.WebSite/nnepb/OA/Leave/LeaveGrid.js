define(new function () {
    var root;
    var self = this;
    var models = {};
    var mFileType;
    models.gridModel = $.Com.GridModel({
        beforeBind: function (vm, _root) {
            vm.formatCurDate = function (sourceDate) {
                if (sourceDate() != null && sourceDate() != "") {
                    var date = $.ComFun.DateTimeToChange(sourceDate(), "yyyy年MM月dd日");
                    return date;
                }
            };
            vm.editInfor = function (caseid) {
                $.fxPost("B_OA_LeaveSvc.data?action=GetLeaveByCaseId", { caseid: caseid }, function (ret) {
                    showEditDocumentWind(ret.baseInfor);
                });
            }
            vm._deleteRow = function (caseId) {
                if (confirm("您确定要删除此项信息吗？")) {
                    $.fxPost("B_OA_LeaveSvc.data?action=DeleteData", { caseId: caseId }, function (ret) {
                        loadData();
                    });
                }
            }
        },
        elementsCount: 10,
        edit: function (item, callback) {
        }
    , remove: function (row) {
    }
    });

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/Leave/LeaveGrid.html", function () {
            loadData();
        });
    }

    function loadData() {
        $.fxPost("B_OA_LeaveSvc.data?action=GetLeaveApplyGrid", {}, function (ret) {
            models.gridModel.show(root.find("[data-id='dataGrid']"), ret.dataTable);
        });
    }

    function initModel() {
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
    }

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

    function showCarWind(carId) {
        var dlgOpts = {
            title: '车辆相信信息查看', width: 600, height: 500,
            button: [
          {
              text: '关闭', handler: function () {
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

    //编辑文件夹弹窗
    function showEditDocumentWind(baseInfor) {
        initModel();
        var dlgOpts = {
            title: '修改', width: 700, height: 500,
            button: [
           {
               text: '确定', handler: function () {
                   var da = models.baseInfo.getData();
                   if (da) {
                       var json = JSON.stringify(da);
                       $.fxPost("B_OA_LeaveSvc.data?action=SaveData", { jsonData: json }, function (ret) {
                           loadData();
                           win.close();

                       });
                   }

               }
           },
          {
              text: '取消', handler: function () {
                  win.close();
              }
          }
            ]
        };
        var win = $.Com.showFormWin(baseInfor, function () {
        }, models.baseInfo, root.find("[data-id='editWind']"), dlgOpts);
    }

});