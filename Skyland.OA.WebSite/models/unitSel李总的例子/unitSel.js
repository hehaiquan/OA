//选择企业的列表，就是弹出窗口的内容
$.Biz.unitList = function () {

    var selectCallback;

    var gridModel = $.Com.GridModel({
        edit: function (item, callback) { selectCallback(item); }
       ,keyColumns: "PK"//主键字段
       ,elementsCount: 10  //分页,默认5
    });


    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;  //选择单位回调
        root.load("models/unitSel/UnitSel.html", function () {
            $.fxPost("B_ComSvc.data?action=UnitSelQuery2", {},function (data) {
                gridModel.show(root.find('[data-role="unitGrid"]'), data.data.unitList)

            });
        });
    }
}

//加入企业列表的弹窗，选择企业
$.Biz.unitseleWin = function (callback) {
    var model = new $.Biz.unitList();
    var root = null;

    var opts = { title: '选择企业', height: 730, width: 750 };
    var win = $.iwf.showWin(opts);

    model.show({ callback: function (item) { callback(item); win.close(); } }, win.content());
}

