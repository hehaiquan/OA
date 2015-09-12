$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'completeSupervisionStatic' };
    this.show = function (module, root) {
        $.Biz.completeSupervisionStatic.show(module, root);
    }
});

$.Biz.completeSupervisionStatic = new function () {
    var root;
    var models = {};
    models.searchModel = { year: "", quarter: "" };

    models.gridModel = $.Com.GridModel({
        keyColumns: "ID", //主键字段
        beforeBind: function (vm, _root) { //表格加载前
            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.ComFun.DateTimeToChange(date(), "yyyy年MM月dd日");
                return d;
            }
        },
        elementsCount: 10,
        edit: function (da, callback) {
            if (da.ID == null || da.ID == "") {
                $.Com.showMsg("没有相关业务！");
                return;
            };
            var pcaseid = da.ID;
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
        root.load("models/B_OA_SupervisionStatic/CompleteSupervisionStatic.html", function () {
            loadData("","");


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
       
        $.fxPost("/B_OA_SupervisionStaticSvc.data?action=GetCompleteSupervisionStatic", { year: year, quarter: quarter }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            var da = ret.data;
            models.gridModel.show(root.find('[data-id="supervisionCompleteStaticGrid"]'), da.dt);
        });
    }
}