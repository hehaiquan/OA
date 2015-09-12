define(new function() {
    var root;
    var models = {};

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/ComMge/SendMange.html", function () {
            initGrid();
            loadData();
        });
    }

    function initGrid() {
        models.sendDocGridModel = $.Com.GridModel({
            beforeBind: function (vm, root) {
                vm.formatCurDate = function (sourceDate) {
                    if (sourceDate() != null) {
                        var date = $.ComFun.DateTimeToChange(sourceDate(), "yyyy年MM月dd日");
                        return date;
                    }
                };
                vm._deleteRow = function (caseId) {
                    if (confirm("您确定要删除此项信息吗？")) {
                        $.fxPost("OASendDocSearchSvc.data?action=DeleteDoc", { caseId: caseId }, function (ret) {
                            loadData();
                        });
                    }
                }
            },
            elementsCount: 20
                     , keyColumns: "id"
                     , edit: function (da, callback) {
                         if (da.caseid == null || da.caseid == "") {
                             $.Com.showMsg("没有相关业务！");
                             return;
                         };
                         var pcaseid = da.caseid;
                         var params = {};
                         params.caseid = pcaseid;
                         params.title = da.wjbt;
                         params.isend = true;
                         params.state = "endcase";
                         $.Com.Go(pcaseid + ".fx/com/wf/form:" + JSON.stringify(params));
                     }
        });
    }
  
    function loadData() {
        $.fxPost("OASendDocSearchSvc.data?action=GetData", { FileTypeId: "" }, function (ret) {
            models.sendDocGridModel.show(root.find("[data-id='dataGrid']"), ret.dataList);
        });
    }
})