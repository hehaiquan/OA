//$.iwf.register(new function () {
//    var me = this;
//    this.options = { key: 'documentOrder' };
//    this.show = function (module, root) {
//        $.Biz.documentOrder.show(module, root);
//    }
//});

//$.Biz.documentOrder = new function () {
//    var self = this;
//    var root;
//    var models = {};

//    //定义表格
//    models.OrderGridModel = $.Com.GridModel({
//        keyColumns: "NewsId",
//        beforeBind: function (vm, root) {
//            //查看
//            vm._BrowseNotice = function (NewsId) {
//                $.Biz.BrowseNoticeWin(
//                    NewsId, function (data) { }
//                );
//            }
//        },
//        edit: function (item, callback) {

//        }
//        , remove: function (row) { }
//        , elementsCount: 10  //分页,默认5
//    })

//    this.show = function (module, _root) {
//        root = _root;
//        if (root.children().length != 0) return;
//        root.load("models/OA_Notice/DocumentOrder.html", function () {
//            //读取树状菜单
//            loadTreeData();
//            models.OrderGridModel.show(root.find("[data-id='listDiv']"), []);
//        })
//    };
  

//    //通过文档类别ID查找已公开并审核通过的文章(查找B_OA_Notice)
//    function getOrderDocumentDataByFileTypeId(id) {
//        $.fxPost("DocumentCenterSvc.data?action=GetOrderDocumentDataByFileTypeId", { fileTypeId: id }, function (ret) {
//            self.data = ret.data;
//            models.OrderGridModel.show(root.find("[data-id='listDiv']"), ret.data);
//        })
//    }
//}