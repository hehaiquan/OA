$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'mySupervision' };
    this.show = function (module, root) {
        $.Biz.mySupervision.show(module, root);
    }
});

$.Biz.mySupervision = new function () {
    var root;
    var models = {};

    models.gridmodel = $.Com.GridModel({
        beforeBind: function (vm, _root) {
            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.ComFun.DateTimeToChange(date(), 'yyyy年MM月dd日');
                return d;
            }

            vm._getInforByCaseId = function (da) {
                if (da.caseId() == null || da.caseId() == "") {
                    $.Com.showMsg("没有相关业务！");
                    return;
                }
                var pcaseid = da.caseId();
                var params = {};
                params.caseid = pcaseid;
                params.title = da.Name();
                params.isend = false;
                params.state = "endcase";
                //录入办理情况
                params.canRecordSituation = 'true';
                $.Com.Go(pcaseid + ".fx/com/wf/form:" + JSON.stringify(params));
            }
           
        }
            , edit: function (item, callback) {

            }
            , remove: function (row) {

            }
            , elementsCount: 20
            , keyColumns: "caseId"
    });

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/B_OA_Supervision/MySupervision.html", function () {
            loadData();
        });
    }

    //督办查询
    function loadData() {
        $.fxPost("B_OA_Supervision_AssignSvc.data?action=GetMySupervision", {}, function (ret) {
            models.gridmodel.show(root.find("[data-id='listSupervision']"), ret.dataTable);
        });
    }
}