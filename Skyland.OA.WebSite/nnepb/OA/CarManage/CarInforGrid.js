define(new function () {
    var root;
    var self = this;
    var models = {};
    var mFileType;
    models.gridModel = $.Com.GridModel({
        beforeBind: function (vm, _root) {
            vm.formatCurDate = function(sourceDate) {
                if (sourceDate() != null && sourceDate() != "") {
                    var date = $.ComFun.DateTimeToChange(sourceDate(), "yyyy年MM月dd日");
                    return date;
                }
            };
            vm.editInfor = function (caseid) {
                $.fxPost("B_OA_CarSvc.data?action=GetCarByCaseId", { caseid: caseid }, function(ret) {
                    showEditDocumentWind(ret.baseInfor);
                });
            }
            vm._deleteRow = function (caseId) {
                if (confirm("您确定要删除此项信息吗？")) {
                    $.fxPost("B_OA_CarSvc.data?action=DeleteData", { caseId: caseId }, function (ret) {
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
        root.load("nnepb/OA/CarManage/CarInforGrid.html", function () {
            loadData();
        });
    }

    function loadData() {
        $.fxPost("B_OA_CarSvc.data?action=GetCarRecordGrid", {}, function (ret) {
            models.gridModel.show(root.find("[data-id='dataGrid']"), ret.dataTable);
        });
    }

    function initModel()
    {
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
            title: '修改节点', width: 700, height: 500,
            button: [
           {
               text: '确定', handler: function () {
                   var da = models.baseInfo.getData();
                   if (da) {
                       var json = JSON.stringify(da);
                       $.fxPost("B_OA_CarSvc.data?action=SaveData", { jsonData: json }, function (ret) {
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
})