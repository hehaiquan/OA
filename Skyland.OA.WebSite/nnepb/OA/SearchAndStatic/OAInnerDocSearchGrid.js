define(new function() {
    var root;
    var self = this;
    var models = {};
    var mFileType;
    this.show = function(module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/SearchAndStatic/OAInnerDocSearchGrid.html", function () {
            root.find("[data-id='handler']").attr("style", "display:none");
            if (module.pageSet) {
                root.find("[data-id='handler']").attr("style", "display:display");
            }
            loadData();
        });
    }

    function loadData() {
        $.fxPost("OAInnerDocSearchSvc.data?action=GetData", {}, function (ret) {
            initGrid();
            models.innerGridModel.show(root.find("[data-id='dataGrid']"), ret.dataList);
        });
    }

    function notInitGrid() {
        $.fxPost("OAInnerDocSearchSvc.data?action=GetData", {}, function (ret) {
            models.innerGridModel.show(root.find("[data-id='dataGrid']"), ret.dataList);
        });
    }

    function initGrid() {
        models.innerGridModel = $.Com.GridModel({
            beforeBind: function (vm, root) {
                vm.formatCurDate = function (sourceDate) {
                    if (sourceDate() != null && sourceDate() != "") {
                        var date = $.ComFun.DateTimeToChange(sourceDate(), "yyyy年MM月dd日");
                        return date;
                    }
                }
                vm._deleteRow = function (caseId) {
                    if (confirm("您确定要删除此项信息吗？")) {
                        $.fxPost("OAInnerDocSearchSvc.data?action=DeleteDoc", { caseId: caseId }, function (ret) {
                            notInitGrid();
                        });
                    }
                }
            },
            elementsCount: 20
               , keyColumns: 'id'
              , edit: function (da, callback) {
                  if (da.caseId == null || da.caseId == "") {
                      $.Com.showMsg("没有相关业务！");
                      return;
                  };
                  var pcaseid = da.caseId;
                  var params = {};
                  params.caseid = pcaseid;
                  params.title = da.wjbt;
                  $.Com.Go(pcaseid + ".fx/com/wf/form:" + JSON.stringify(params));
              }
        });
    }
})