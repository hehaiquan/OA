//$.iwf.register(new function () {
//    var me = this;
//    this.options = { key: 'documentCheck' };
//    this.show = function (module, root) {
//        $.Biz.documentCheck.show(module, root);
//    }
//});



//$.Biz.documentCheck = new function () {
//    var self = this;
//    var root;
//    self.data = null;
//    var NewsType = "wdwj";
//    var models = {};

//    models.gridModel = $.Com.GridModel({
//        keyColumns: "NewsId",//主键字段
//        //绑定前触发，在这里可以做绑定前的处理
//        beforeBind: function (vm, root) {
//            vm._BrowseNotice = function (NewsId) {
//                $.Biz.BrowseNoticeWin(
//                    NewsId, function (data) { }
//                );
//            }
//            vm.getChk = function (Chk) {
//                if (Chk() == "0") {
//                    return "<span style=\"color:red\">×</span>";
//                } else {
//                    return "<span style=\"color:#339900\">√</span>";
//                }
//            }
//        },
//        edit: function (item, callback) {
//            $.post("/B_OA_NoticeSvc.data?action=Chk", { id: item.NewsId, Chk: item.Chk }, function (res) {
//                var data = eval('(' + res + ')');
//                if (data.success) {
//                      $.Com.showMsg(data.msg);
//                    var content = eval('(' + data.data + ')');
//                    for (var i = 0; i < self.data.length; i++) {
//                        if (self.data[i].NewsId == item.NewsId) {
//                            self.data[i].Chk = content.Chk;
//                            self.data[i].ChkM = content.ChkM;
//                            self.data[i].Chkdate = content.Chkdate;
//                            models.gridModel.show(root.find('[data-role="noticeGrid"]'), self.data);
//                            break;
//                        }
//                    }
//                    return true;
//                } else {
//                      $.Com.showMsg(data.msg);
//                    return false;
//                }
//            });

//        },
//        remove: function (row) { },
//        elementsCount: 10  //分页,默认5
//    });



//    this.show = function (module, _root) {
//        root = _root;
//        if (root.children().length != 0) return;
//        root.load("models/OA_Notice/DocumentCheck.html", function () {
//            // 载入数据
//            $.fxPost("B_OA_NoticeSvc.data?action=SearchChkData", { NewsTypeId: NewsType }, function (data) {
//                self.data = data.data;
//                models.gridModel.show(root.find('[data-role="noticeGrid"]'), self.data);

//            });

//        });
//    }

//};





