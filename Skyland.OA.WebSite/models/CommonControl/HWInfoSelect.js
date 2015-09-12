//选择废物信息的列表，就是弹出窗口的内容
$.Biz.HWInfoSelectList = function () {

    var selectCallback;
    var gridModel = $.Com.GridModel({
        edit: function (item, callback) { selectCallback(item); }
       , keyColumns: "HWInfoID"//主键字段
       , elementsCount: 10  //分页,默认5
    });


    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;  //选择单位回调
        root.load("models/CommonControl/HWInfoSelect.html", function () {
            $.fxPost("UsedPhraseSvc.data?action=GetHWInfoSelect", {}, function (data) {
                gridModel.show(root.find('[data-role="HWInfoGrid"]'), data.data);
            });
        });
    }
}

//加入企业列表的弹窗，选择企业
$.Biz.HWInfoSelectWin = function (callback) {
    var model = new $.Biz.HWInfoSelectList();
    var opts = { title: '选择废物信息', height: 730, width: 750 };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
          { callback: function (item) { callback(item); win.close(); } },
          root
    );
}

