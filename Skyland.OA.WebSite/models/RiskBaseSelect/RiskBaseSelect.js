// 选择风险源的列表，就是弹出窗口的内容
$.Biz.riskBaseSelectList = function (fl) {

    var selectCallback;

    var gridModel = $.Com.GridModel({
        edit: function (item, callback) { selectCallback(item); }
       , keyColumns: "id"// 主键字段
       , elementsCount: 10  // 分页,默认5
    });

    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;  // 选择风险源回调
        root.load("models/RiskBaseSelect/RiskBaseSelect.html", function () {

            var par = {
                tablename: "P_Risk_BaseInfo",
                showfield: null,
                where: fl ? fl : null
            };
            $.fxPost("UsedPhraseSvc.data?action=GetData", par, function (data) {
                data = eval('(' + data.data + ')')
                gridModel.show(root.find('[data-role="unitGrid1"]'), data);
            });
        });
    }
}

// 加入风险源列表的弹窗，选择风险源
$.Biz.riskBaseSelectWin = function (callback, fl) {
    var model = new $.Biz.riskBaseSelectList(fl);
    var root = null;

    var opts = { title: '风险源列表', height: 730, width: 750 };
    var win = $.iwf.showWin(opts);

    model.show({ callback: function (item) { callback(item); win.close(); } }, win.content());
}

