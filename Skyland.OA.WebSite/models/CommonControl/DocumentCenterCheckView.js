$.Biz.DocumentCenterCheckView = function (id) {
    var models = {};
    var self = this;
    var ztr_Seleted;
    var root;
    var newId = id;

    //基本信息模
    models.noticeModel= $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) { },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) { return true; },
        afterBind: function (vm, root) { }
    });


    //审核结果表
    models.checkResultGrid = $.Com.GridModel({
        keyColumns: "NewsId",//主键字段
        beforeBind: function (vm, root) {

        },
        edit: function (item, callback) {

        },
        remove: function (row) {

        },
        elementsCount: 10
    });


    this.show = function (module, _root) {
        if (_root.children().length != 0) return;
        //selectCallback = module.callback; 
        root = _root;
        root.load("models/CommonControl/DocumentCenterCheckView.html", function () {
            $.fxPost("DocumentCenterSvc.data?action=GetCheckNoticeById", { id: newId }, function (ret) {
                if (ret.success) {
                    //var data = eval('(' + data.data + ')');
                    models.noticeModel.show(root.find("[data-id='baseInfo']"), ret.data.notice);
                    models.checkResultGrid.show(root.find("[data-id='addviceGrid']"), ret.data.listAddvice);
                    root.find("[data-id='newTextContent']").append(ret.data.notice.NewsText);
                }
                else {
                      $.Com.showMsg(data.msg);
                }
            })
        });

    }
}


//加入放入的文件
$.Biz.DocumentCenterCheckWind = function (callback, id) {
    var model = new $.Biz.DocumentCenterCheckView(id);
    var root = null;
    var catelog = [];
    var opts = {
        title: '文档审核结果查看', height: 730, width: 750,
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