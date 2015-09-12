
$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'phoneRecordManage' };

    this.show = function (module, root) {
        $.Biz.phoneRecordManage.show(module, root);
    }

});


$.Biz.phoneRecordManage = new function () {
    var root;
    var data;
    var models = {};
    models.detailmodel = $.Com.FormModel({});

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/PhoneRecord/PhoneRecordManage.html", function () {
            //加载数据
            loadData();

            //保存数据
            root.find("[data-id='save']").bind("click", function () {
                //保存
                var da = models.detailmodel.getData();
                if(da==false){
                    return;
                }
                saveData(da, function (a) { });
            });
            //添加电话记录
            root.find("[data-id='add']").bind("click", function () {
                //弹窗
                showAddBox();
            });
            //刷新
            root.find("[data-id='refresh']").bind("click", function () {
                updateData();
            });
        })
    }

    // 查询数据
    function loadData() {
        var content = "";
        $.fxPost("B_PhoneRecordSvc.data?action=GetData", content, function (ret) {
            if (ret.data.dataList) {
                data = ret;
                models.gridModel = $.Com.GridModel({
                    elementsCount: 10
                 , edit: function (item, callback) {
                     models.detailmodel.show(root.find("[data-id='detailent']"), item);
                 }
                 , remove: function (row) {
                     if (!confirm("确定要删除此行数据吗？")) return false;
                     else {
                         var id = row.id();
                           deleteData(id);
                     }
                 }
                 , keyColumns: "id"

                });
                models.gridModel.show(root.find("[data-id='list']"), ret.data.dataList);
            }
        });
    }

    //保存数据
    function saveData(da, callback) {
  
        var content = JSON.stringify(da);
        $.fxPost("B_PhoneRecordSvc.data?action=SaveData", { JsonData: content }, function (res) {
            if (!res.success) {
                  $.Com.showMsg(res.msg);
                callback(true);
                return;
            }
            updateData();
        })
    }

    function updateData() {
        var content = "";
        $.fxPost("B_PhoneRecordSvc.data?action=GetData", content, function (ret) {
            if (ret.data) {
                models.gridModel.show(root.find("[data-id='list']"), ret.data.dataList);
            }
        });
    }
    function showAddBox() {
        var item = data.data.baseInform;
        models.aDetailmodel = $.Com.FormModel({});
        var dlgOpts = {
            title: '接待信息添加', width: 820, height: 700,
            button: [
           {
               text: '保存', handler: function (data) {
                   var da = models.aDetailmodel.getData();
                   if(da==false){
                       return;
                   }
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
    function deleteData(id) {
        if (!id) return;
        $.fxPost("B_PhoneRecordSvc.data?action=DeleteData", { id: id }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                updateData();
            }
        })
    }
}
