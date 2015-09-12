//$.iwf.register(new function () {
//    var me = this;
//    this.options = { key: 'searchNotice' };
//    this.show = function (module, root) {
//        $.Biz.SearchNotice.show(module, root);
//    }
//});




//$.Biz.SearchNotice = new function () {
    
//    var self = this;
//    var root;
//    self.data = null;
//    //var wftool;
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
//        beforeBind: function (vm, root) {

//            vm._getDocumentCenterView = function (id) {
//                var callbackData = "";
//                ////查看弹窗
//                $.Biz.DocumentCenterViewWin(function (data) {
//                    if (data != null) {

//                    }
//                }, id())
//            }

//            vm._DeleteChoiceAticle = function (newsId) {
//                deleteChoiceArticle(newsId());
//            }
//        },
//        edit: function (item, callback) {
//            //点击编辑触发
//            loadChoiceArticle(item);
//        },
//        remove: function (row) {

//        },
//        elementsCount: 10
//    });



//    this.show = function (module, _root) {
//        root = _root;
//        if (root.children().length != 0) return;
//        root.load("models/OA_Notice/SearchNotice.html", function () {
//            loadData();
//        });
//    }
//    function loadData() {
//        $.fxPost("DocumentCenterSvc.data?action=GetNoticeByDocumentType", { getTypeName: 'tongzhigonggao' }, function (ret) {
//            if (!ret.success) {
//                  $.Com.showMsg(ret.msg);
//                return;
//            }
//            models.gridModel.show(root.find('[data-id="articleGrid"]'), ret.data.listNotice);
//        })
//    }
//};




