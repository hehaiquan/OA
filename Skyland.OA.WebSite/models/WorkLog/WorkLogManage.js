

//$.iwf.register(new function () {
//    var me = this;
//    this.options = { key: 'workLogManage' };
//    this.show = function (module, root) {
//        $.Biz.workLogManage.show(module, root);
//    }
//});

//$.Biz.workLogManage = new function () {
//    var root;
//    var data;
//    var wftool;
//    var gridModel;
  
//    this.show = function (module, _root) {
//        root = _root;
//        if (root.children().length != 0) return;
//        root.load("models/WorkLog/WorkLogManage.html", function () {
//            loadData();
//        })
//    }

//    // 查询数据
//    function loadData() {
//        var content = "";
//        $.fxPost("B_WorkLogSvc.data?action=GetData", content, function (ret) {
//            if (ret.data) {
//                gridModel = $.Com.GridModel({
//                    elementsCount: 10
//                     , edit: function (item, callback) {

//                     }
//                      , remove: function (row) {
//                          if (!confirm("确定要删除此行数据吗？")) return false;
//                          else {
//                              var id = row.id();
//                          }
//                      }
//                   , keyColumns: "id"

//                })
//                gridModel.show(root.find("[data-id='list']"), ret.data);

//            }
//        })
//    }
   
//}