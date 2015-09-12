////新闻公告浏览内容
//$.Biz.BrowseNoticeContent = function (NewsId) {

//    var selectCallback;
//    var models = {};
//    //var gridModel = $.Com.GridModel({
//    //    edit: function (item, callback) { selectCallback(item); }
//    //   ,keyColumns: "id"//主键字段
//    //   ,elementsCount: 10  //分页,默认5
//    //});

//    //基本信息模
//    models.baseInfo = $.Com.FormModel({
//        //绑定前触发，在这里可以做绑定前的处理
//        beforeBind: function (vm, root) { },
//        //数据合法性验证，返回false则不会提交
//        beforeSave: function (vm, root) { return true; },
//        afterBind: function (vm, root) { }
//    });


//    this.show = function (module, root) {
//        if (root.children().length != 0) return;
//        selectCallback = module.callback;  //选择单位回调
//        root.load("models/OA_Notice/BrowseNotice.html", function () {
//            $.fxPost("B_OA_NoticeSvc.data?action=GetBrowseData", { NewsId: NewsId }, function (data) {
                
//                if (data.success) {
//                    //var data = eval('(' + data.data + ')');
//                    models.baseInfo.show(root.find("[data-id='baseInfo']"), data.data[0]);
//                    root.find("[data-id='NewsText']").append(data.data[0].NewsText);
                    
//                }
//                else {
//                      $.Com.showMsg(data.msg);
//                }
//            });
//        });
//    }
//}


////新闻公告浏览窗口
//$.Biz.BrowseNoticeWin = function (NewsId,callback) {
//    var model = new $.Biz.BrowseNoticeContent(NewsId);
//    var opts = { title: '浏览',mask:true, height: 1500, width: 1000 };
//    var win = $.iwf.showWin(opts);
//    var root = win.content();
//    model.show(
//          { callback: function (item) { callback(item); win.close(); } },
//          root
//    );
//}

