$.Biz.DefinitionView = function (win,callback) {
    var models = {};
    var self = this;

    models.gridModel = $.Com.GridModel({
        keyColumns: "id",//主键字段
        beforeBind: function (vm, root) {
            vm._choice = function (da) {
                callback(da)
                win.close();
            }
        },
        edit: function (item, callback) {
        },
        remove: function (row) {

        },
        elementsCount: 10
    });

    this.show = function (module, _root) {
        if (_root.children().length != 0) return;
        root = _root;
        root.load("models/CommonControl/DefinitionViewWind.html", function () {
            loadData();
        })
    }

    function loadData() {
        $.fxPost("/DocumentCenterSvc.data?action=GetDefinitionData", {}, function (ret) {
            models.gridModel.show(root.find('[data-id="dataGrid"]'), ret.dataTable);
        })
    }
}

//加载程序定义表
$.Biz.DefinitionViewWin = function (callback) {
    var root = null;
    var catelog = [];
    var opts = {
        title: '程序定义选择', height: 730, width: 900,
        button: [
                  { text: '关闭', handler: function () { win.close(); } }
        ]
    };
    var win = $.iwf.showWin(opts);
    var model = new $.Biz.DefinitionView(win, callback);

    var root = win.content();
    model.show(
        { callback: function (item) { callback(item); win.close(); } },
        root
  );

}