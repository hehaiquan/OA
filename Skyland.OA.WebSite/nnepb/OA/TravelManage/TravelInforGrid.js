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
                $.fxPost("B_OA_TravelSvc.data?action=GetTravelByCaseId", { caseid: caseid }, function (ret) {
                    showEditDocumentWind(ret.baseInfor);
                });
            }
            vm._deleteRow = function (caseId) {
                if (confirm("您确定要删除此项信息吗？")) {
                    $.fxPost("B_OA_TravelSvc.data?action=DeleteData", { caseId: caseId }, function (ret) {
                        loadData();
                    });
                }
            }
        },
        elementsCount: 10,
        edit: function (item, callback) {
        },
        remove: function (row) {
        }
    });

    function initModel() {
        models.baseInfo = $.Com.FormModel({
            beforeBind: function (vm, _root) {

            },
            beforeSave: function (vm, _root) {

            }
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
                       $.fxPost("B_OA_TravelSvc.data?action=SaveData", { jsonData: json }, function (ret) {
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

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/TravelManage/TravelInforGrid.html", function () {
            loadData();
        });
    }

    function loadData() {
        $.fxPost("B_OA_TravelSvc.data?action=GetTravelGrid", {}, function (ret) {
            models.gridModel.show(root.find("[data-id='dataGrid']"), ret.dataTable);
        });
    }
});