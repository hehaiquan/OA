
//$.iwf.register(new function () {
//    var me = this;
//    this.options = { key: 'SearchPublish' };
//    this.show = function (module, root) {
//        $.Biz.SearchPublish.show(module, root);
//    }
//});



//$.Biz.SearchPublish = new function () {

//    var self = this;
//    var root;
//    self.data = null;
//    //var wftool;
//    var NewsType = "xw";
//    var models = {};

//    //基本信息模
//    models.baseInfo = $.Com.FormModel({
//        //绑定前触发，在这里可以做绑定前的处理
//        beforeBind: function (vm, root) { },
//        //数据合法性验证，返回false则不会提交
//        beforeSave: function (vm, root) { return true; },
//        afterBind: function (vm, root) { }
//    });

//    models.gridModel = $.Com.GridModel({
//        keyColumns: "NewsId",//主键字段
//        //绑定前触发，在这里可以做绑定前的处理
//        beforeBind: function (vm, root) {
//            vm._BrowseNotice = function (NewsId) {
//                $.Biz.BrowseNoticeWin(
//                    NewsId, function (data) { }
//                );
//            }
//        },
//        edit: function (item, callback) {

//        },
//        remove: function (row) {

//        },
//        elementsCount: 10  //分页,默认5
//    });



//    this.show = function (module, _root) {
//        root = _root;
//        if (root.children().length != 0) return;
//        root.load("models/OA_Notice/SearchNotice.html", function () {
//            $.fxPost("B_OA_NoticeSvc.data?action=SearchData", { NewsTypeId: NewsType }, function (data) {
//                self.data = data.data;
//                models.gridModel.show(root.find('[data-role="noticeGrid"]'), self.data);
//            });
//        });
//    }

//};

