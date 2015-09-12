$.Biz.SightureWindView = function (id) {
    var models = {};
    var self = this;
    var root;

    this.show = function (module, _root) {
        if (_root.children().length != 0) return;
        root = _root;
        root.load("nnepb/commonControl/SightureWind.html", function () {

        })
    };
};

//加入放入的文件
$.Biz.SightureWind = function (callback, id) {
    var model = new $.Biz.SightureWindView(id);
    var root = null;
    var catelog = [];
    var opts = {
        title: '手写签批', height: 730, width: 900,
        button: [
                  { text: '关闭', handler: function () { win.close(); } }
        ]
    };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
        { callback: function (item) { callback(item); win.close(); } },
        root
  );

}