$.Biz.ReceiveDocumentSelect = function () {
    var selectCallback;
    var models = {};
    models.gridModel = $.Com.GridModel({
        edit: function (item, callback) { 
            selectCallback(item); }
       ,keyColumns: "id"//主键字段
       ,elementsCount: 10  //分页,默认5
    })

    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;
        root.load("models/CommonControl/ReceiveDocumentSelect.html", function () {
            $.fxPost("B_OA_ReceiveDocSvc.data?action=GetReceiveDoc", "", function (ret) {
                models.gridModel.show(root.find('[data-role="unitGrid1"]'), ret.data);
            })
        })
    }
}

//加入放入的文件
$.Biz.ReceiveDocumentSelectWin = function (callback) {
    var model = new $.Biz.ReceiveDocumentSelect();
    var opts = { title: '收文选择', height: 730, width: 750 };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
        { callback: function (item) { callback(item); win.close(); } },
        root
  );
}