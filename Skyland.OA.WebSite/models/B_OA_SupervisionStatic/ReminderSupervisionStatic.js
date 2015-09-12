$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'reminderSupervisionStatic' };
    this.show = function (module, root) {
        $.Biz.reminderSupervisionStatic.show(module, root);
    }
});


$.Biz.reminderSupervisionStatic = new function () {
    var root;
    var models = {};
    models.searchModel = { year: "", quarter: "" };

    models.gridModel = $.Com.GridModel({
        keyColumns: "code", //主键字段
        beforeBind: function (vm, _root) { //表格加载前
            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.ComFun.DateTimeToChange(date(), "yyyy年MM月dd日");
                return d;
            }
        },
        elementsCount: 10,
        edit: function (da, callback) {
            if (da.caseId == null || da.caseId == "") {
                $.Com.showMsg("没有相关业务！");
                return;
            };
            var pcaseid = da.caseId;
            var params = {};
            params.caseid = pcaseid;
            params.title = da.title;
            params.isend = true;
            params.state = "endcase";
            $.Com.Go(pcaseid + ".fx/com/wf/form:" + JSON.stringify(params));
        }
    });
    models.searCondictionModel = $.Com.FormModel({});

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/B_OA_SupervisionStatic/ReminderSupervisionStatic.html", function () {
            loadData("", "");

            //查询
            root.find("[data-id='searchBtn']").bind("click", function () {
                var model = models.searCondictionModel.getData();
                var year = model.year;
                var quarter = model.quarter;
                loadData(year, quarter);
            });

            models.searCondictionModel.show(root.find('[data-id="searchCondition"]'), models.searchModel);
        });
    }

    function loadData(year, quarter) {
        $.fxPost("/B_OA_SupervisionStaticSvc.data?action=GetReminderSupervisionStatic", { year: year, quarter: quarter }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            var da = ret.data;
            models.gridModel.show(root.find('[data-id="supervisionReminderStaticGrid"]'), da.dt);
         
        });
    }
}