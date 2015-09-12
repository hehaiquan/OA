//选择环评单位的列表，就是弹出窗口的内容
$.Biz.HpdwSelectList = function () {

    var selectCallback;
    var gridModel = $.Com.GridModel({
        edit: function (item, callback) { selectCallback(item); }
       ,keyColumns: "id"//主键字段
       ,elementsCount: 10  //分页,默认5
    });


    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;  //选择单位回调
        root.load("models/CommonControl/HpdwSelect.html", function () {
            $.fxPost("UsedPhraseSvc.data?action=GetHpdwSelect", {}, function (data) {
                gridModel.show(root.find('[data-role="unitGrid1"]'), data.data.dataList);
            });
        });
    }
}

//加入企业列表的弹窗，选择企业
$.Biz.HpdwSelectWin = function (callback) {
    var model = new $.Biz.HpdwSelectList();
    var opts = { title: '环评单位', height: 730, width: 750 };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
          { callback: function (item) { callback(item); win.close(); } },
          root
    );
}

