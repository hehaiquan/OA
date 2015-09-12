define(new function () {
    var root;
    var self = this;
    var models = {};
    var mFileType;
    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/SearchAndStatic/OAReceiveDocSearchGrid.html", function () {

            //隐藏操作
            root.find("[data-id='handler']").attr("style", "display:none");
            if (module.pageSet) {
                //显示操作
                root.find("[data-id='handler']").attr("style", "display:display");
            }

            mFileType = module.fileType;
            loadPage(module.fileType);
        });
    }

    function loadPage(fileTypeId) {
        $.fxPost("OAReceiveDocSearchSvc.data?action=GetData", { FileTypeId: fileTypeId }, function(ret) {
            initGrid();
            models.receiveGridModel.show(root.find("[data-id='dataGrid']"), ret.dataList);
        });
    }


    function loadPageNotIni(fileTypeId) {
        $.fxPost("OAReceiveDocSearchSvc.data?action=GetData", { FileTypeId: fileTypeId }, function (ret) {
            models.receiveGridModel.show(root.find("[data-id='dataGrid']"), ret.dataList);
        });
    }

    function initGrid() {
        models.receiveGridModel = $.Com.GridModel({
            beforeBind: function (vm, root) {
                vm.formatCurDate = function (sourceDate) {
                    if (sourceDate() != null && sourceDate() != "") {
                        var date = $.ComFun.DateTimeToChange(sourceDate(), "yyyy年MM月dd日");
                        return date;
                    }
                }
                vm._deleteRow = function (caseId) {
                    if (confirm("您确定要删除此项信息吗？")) {
                        $.fxPost("OAReceiveDocSearchSvc.data?action=DeleteDoc", { caseId: caseId }, function (ret) {
                            loadPageNotIni(mFileType);
                        });
                    }
                }
            },
            elementsCount: 20
               , keyColumns: 'id'
              , edit: function (da, callback) {
                  if (da.caseid == null || da.caseid == "") {
                      $.Com.showMsg("没有相关业务！");
                      return;
                  };
                  var pcaseid = da.caseid;
                  var params = {};
                  params.caseid = pcaseid;
                  params.title = da.wjbt;
                  $.Com.Go(pcaseid + ".fx/com/wf/form:" + JSON.stringify(params));
              }
        });
    }
})