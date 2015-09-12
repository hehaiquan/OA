// 选择审批项目列表
$.Biz.itemSelList = function (fl) {
    var selectCallback;

    var gridModel = $.Com.GridModel({
        edit: function (item, callback) { selectCallback(item); }
        , keyColumns: "id"//主键字段
        , elementsCount: 10  //分页,默认5
    });

    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;//选择审批项目回调
        root.load("models/itemSelect/itemSelect.html", function () {
            var par = {
                tablename: "B_CP_ExamApprovalMain",
                showfield: null,
                where: fl ? fl : null
            };
            $.fxPost("UsedPhraseSvc.data?action=GetData", par, function (data) {
                data = eval('(' + data.data + ')')
                gridModel.show(root.find('[data-role="itemGrid"]'), data);
            });
        });
    };
};

$.Biz.itemSelectWin = function (callback, fl) {
    var model = new $.Biz.itemSelList(fl);
    var root = null;

    var opts = { title: '审批项目列表', height: 730, width: 750 };
    var win = $.iwf.showWin(opts);

    model.show({ callback: function (item) { callback(item); win.close(); } }, win.content());
}
