$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'bbsSection' };
    this.show = function (module, root) {
        $.Biz.bbsSection.show(module, root);
    }
});


$.Biz.bbsSection = new function () {
    var root;
    var data;
    var wftool;
    var models = {};

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;

        models.gridModel = $.Com.GridModel({
            beforeBind: function (vm, _root) {
                //vm.editSectionName= function(item,callback) {
                //      $.Com.showMsg(item);
                //}
            },
            elementsCount: 10,
            edit: function (item, callback) { showDetail(item); }
      , remove: function (row) {
          if (!confirm("确定要删除这条数据吗？")) return false;
          else {
              var id = row.sid();
              deleteData(id);
          }
      }
      , keyColumns: "sid"
        });

        root.load("models/B_BBS/BBSSectionManage.html", function () {

            loadData();

            //添加
            root.find("[data-id='add']").bind("click", function () {
                showAddBox();
            });

        })
    }
    function showDetail(item) {

        models.aDetailmodel = $.Com.FormModel({});
        var dlgOpts = {
            title: '模块添加', width: 500, height: 400,
            button: [
           {
               text: '保存', handler: function (data) {
                   var da = models.aDetailmodel.getData();
                   saveData(da, function (a) {
                       if (a == true) {
                           win.close();
                       }
                   });
               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }]
        };
        var win = $.Com.showFormWin(item, function () {
        }, models.aDetailmodel, root.find("[data-id='showBox']"), dlgOpts);
    }
    // 载入数据
    function loadData() {
        // 载入数据
        var params = Object();
        $.fxPost("BBSSectionSvc.data?action=GetData", params, function (ret) {
            if (ret.data.dataList) {
                data = ret;
                models.gridModel.show(root.find("[data-id='listDiv']"), ret.data.dataList);
            }
        });
    }

    function saveData(da, callback) {
        var content = JSON.stringify(da);
        $.fxPost("BBSSectionSvc.data?action=SaveData", { JsonData: content }, function (res) {
            if (res) {
                  $.Com.showMsg(res.msg);
                if (res.success) {
                    callback(true);
                } else {
                    callback(false);
                }
            }
            //刷新
            loadData();
        })
    }

    function deleteData(id) {
        if (!id) { return }
        $.fxPost("BBSSectionSvc.data?action=DeleteSectionData", { id: id }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                loadData();
            }
        })
    }

    //弹窗
    function showAddBox() {

        var item = data.data.baseInform;

        models.aDetailmodel = $.Com.FormModel({});
        var dlgOpts = {
            title: '模块添加', width: 500, height: 400,
            button: [
           {
               text: '保存', handler: function (data) {
                   var da = models.aDetailmodel.getData();
                   saveData(da, function (a) {
                       if (a == true) {
                           win.close();
                       }
                   });
               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }]
        };
        var win = $.Com.showFormWin(item, function () {
        }, models.aDetailmodel, root.find("[data-id='showBox']"), dlgOpts);
    }
}