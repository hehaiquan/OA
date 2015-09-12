define(new function () {
    var root;
    var models = {};



    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/Leave/LeaveInforView.html", function () {
            initGrid();
            loadData(module.userId);
        });
    }

    function initGrid() {
        //表格Model
        models.gridModel = $.Com.GridModel({
            beforeBind: function (vm, _root) {
                vm.formatCurDate = function (sourceDate) {
                    if (sourceDate() != null && sourceDate() != "") {
                        var date = $.ComFun.DateTimeToChange(sourceDate(), "yyyy年MM月dd日 hh:mm");
                        return date.replace('&nbsp;', ' ');
                    }
                }
            },
            elementsCount: 10,
            edit: function (item, callback) {

            }
        });
        models.baseInfor = $.Com.FormModel({});
    }

    function loadData(userId) {
        $.fxPost("/B_OA_LeaveSvc.data?action=GetLeveListByUser", { uid: userId }, function (ret) {
            
            models.baseInfor.show(root.find("[data-id='baseInfor']"), ret.model);
            models.gridModel.show(root.find("[data-id='dataGrid']"), ret.dataTable);
        });
    }
})