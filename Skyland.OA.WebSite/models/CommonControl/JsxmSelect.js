//选择建设项目列表，就是弹出窗口的内容
$.Biz.JsxmSelectList = function (qydm) {

    var selectCallback;
    var gridModel = $.Com.GridModel({
        edit: function (item, callback) { selectCallback(item); }
       , keyColumns: "jsxmbh"//主键字段
       ,elementsCount: 10  //分页,默认5
    });


    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;  //选择单位回调
        root.load("models/CommonControl/JsxmSelect.html", function () {
            $.fxPost("UsedPhraseSvc.data?action=GetJsxmSelect", {}, function (data) {
                data = eval('(' + data.data + ')')
                gridModel.show(root.find('[data-role="unitGrid1"]'), data);
            });
        });
    }
}

//加入建设项目弹窗
$.Biz.JsxmSelectWin = function (callback, qydm) {
    //if (qydm==null||qydm==""){  $.Com.showMsg("企业不能空");return;}
    var model = new $.Biz.JsxmSelectList(qydm);
    var opts = { title: '建设项目', height: 730, width: 750 };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
          { callback: function (item) { callback(item); win.close(); } },
          root
    );
}

