$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'gdzcRecord' };
    this.show = function (module, root) {
        $.Biz.gdzcRecord.show(module, root);
    }
});

$.Biz.gdzcRecord = new function () {

    var root;
    var curData;
    var models = {};
    var gridModel;

    var recordModel = $.Com.FormModel({});

    var gridBorrowModel;
    var gridChangeModel;
    var gridFixModel;
    var gridNormalModel;
    var gridQuitModel;

    models.detailmodel = $.Com.FormModel({ isValidateRequired: true, isAppendSign: true });

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/gdzcbj/gdzcRecord.html", function () {
            //tab设置
            var tal = root.find("[data-id='talDiv']");
            tal.iwfTab(
                {
                    stretch: true,
                    tabchange: function (dom) {

                    }
                }
            );
            searchData();
            //绑定借用、转移、维修、退出记录表的模型
            BindRecordModel();
            //添加固定资产
            root.find("[data-id='add']").bind("click", function () {
                //弹窗
                showAddGoodBox();
            });

            //保存数据
            root.find("[data-id='save']").bind("click", function () {
                //保存
                var da = models.detailmodel.getData();
                if (da != false) {
                    saveData(da, function a() {
                    });
                }
            });

            //刷新
            root.find("[data-id='refresh']").bind("click", function () {
                updateData();
            });

            //root.find('[data-id="zcmc"]').addClass('forceRequired');

        })
    }
    function updateData() {
        var content = "";
        $.fxPost("B_GoodsSvc.data?action=SearchGoods", content, function (ret) {
            if (ret.data) {
                gridModel.show(root.find("[data-id='list']"), ret.data.dataList);
            }
        });
    }
    // 查询数据
    function searchData() {
        var content = "";
        $.fxPost("B_GoodsSvc.data?action=SearchGoods", content, function (ret) {
            if (ret.data.dataList) {
                data = ret;
                gridModel = $.Com.GridModel({
                    elementsCount: 10
                   , edit: function (item, callback) {
                       models.detailmodel.show(root.find("[data-id='activity-tab-ProjectTab_a-content']"), item);
                       //显示记录
                       showGoodsRecord(item.id);
                       //内容
                       if (event.srcElement.id == 'borrow' || event.srcElement.id == 'change' || event.srcElement.id == 'fix' || event.srcElement.id == 'normal' || event.srcElement.id == 'quit') {
                           showRecordBox(event.srcElement.id, item);
                       }
                   }
                   , remove: function (row) {
                       //    if (!confirm("若确认删除，此物品的记录也将会删除，确定要删除此行数据吗？")) return false;
                       if (!confirm("确定要删除此行数据吗？")) return false;
                       else {
                           var id = row.id();
                           DeleteData(id);
                       }
                   }
                   , keyColumns: "id"

                });

                gridModel.show(root.find("[data-id='list']"), ret.data.dataList);
            }
        });
    }

    //删除
    function DeleteData(id) {
        if (!id) return;
        var param = { Id: id };
        $.post("/B_GoodsSvc.data?action=DeleteGoods", param, function (ret) {
            var dataInfor = eval('(' + ret + ')');
            if (!dataInfor.success) {
                  $.Com.showMsg(dataInfor.msg);
            }
            updateData();
        });
    }
    //保存数据
    function saveData(lawData, callback) {

        var content = JSON.stringify(lawData);
        $.post("B_GoodsSvc.data?action=SaveGoods", { JsonData: content, userName: parent.$.iwf.userinfo.CnName }, function (res) {
            var json = eval('(' + res + ')');
            if (json.success) {
                updateData();
                callback(true);
            } else {
                  $.Com.showMsg(json.msg);
                callback(false);

            }

        });
    }

    function showRecordBox(dataIdName, item) {

        $.fxPost("B_GoodsSvc.data?action=GetB_GoodsStatusRecordModel", "", function (ret) {
            //绑定下拉
            if (dataIdName == 'borrow') {
                ret.data[0].goodsStatus = '2';//借用
            } else if (dataIdName == 'change') {
                ret.data[0].goodsStatus = '3';//转移
            } else if (dataIdName == 'fix') {
                ret.data[0].goodsStatus = '4';//维修
                ret.data[0].protectMan = item.bgry;
                ret.data[0].protectManName = item.bgryName;
                ret.data[0].useDepartment = item.sybm;
                ret.data[0].useDepartmentName = item.sybmName;
            } else if (dataIdName == 'normal') {
                ret.data[0].goodsStatus = '1';//归还（正常）
                ret.data[0].protectMan = item.originalProtectman;//原来的保管人员
                ret.data[0].protectManName = item.originalProtectmanName;//原来的保管人员名称
                ret.data[0].useDepartment = item.originalDep;//原来的使用部门
                ret.data[0].useDepartmentName = item.originalDepName;//原来的使用部门名
            } else if (dataIdName == 'quit') {
                ret.data[0].goodsStatus = '5';//退出方式（正常）
                ret.data[0].protectMan = item.bgry;
                ret.data[0].protectManName = item.bgryName;
                ret.data[0].useDepartment = item.sybm;
                ret.data[0].useDepartmentName = item.sybmName;
            }

            // recordModel.show(root.find("[data-id='showBox']"), ret.data[0]);

            var dlgOpts = {
                title: '物品状态记录编辑', width: 800, height: 500,
                button: [
               {
                   text: '添加', handler: function (data) {
                       var detailInfor = models.detailmodel.getData();
                       var recordInfor = recordModel.getData();
                       if (recordInfor.useDepartment == null || recordInfor.useDepartment == null) {
                             $.Com.showMsg("使用部门不能为空");
                           return;
                       }
                       if (recordInfor.protectMan == null || recordInfor.protectMan == null) {
                             $.Com.showMsg("保管人员不能为空");
                           return;
                       }
                       saveRecord(detailInfor, recordInfor);
                       win.close();
                   }
               },
              {
                  text: '取消', handler: function () { win.close(); }
              }]
            };
            var win = $.Com.showFormWin(ret.data[0], function () {
            }, recordModel, root.find("[data-id='showBox']"), dlgOpts);
        });
    }
    function saveRecord(detailInfor, recordInfor) {
        if (detailInfor == null || detailInfor == "" || recordInfor == null || recordInfor == "") return;

        $.post("B_GoodsSvc.data?action=UpdateGoodsAndGoodsRecord", {
            recordInfor: JSON.stringify(recordInfor),
            detailInfor: JSON.stringify(detailInfor),
            userName: parent.$.iwf.userinfo.CnName
        }, function (res) {
            var json = eval('(' + res + ')');
              $.Com.showMsg(json.msg);
            //刷新记录表的内容（右边记录）
            showGoodsRecord(detailInfor.id);
            //刷新物品表（左边）
            updateData();
        });

    }

    //通过物品ID显示物品借用、转移、维修记录
    function showGoodsRecord(goodsId) {
        if (goodsId == null || goodsId == "" || goodsId == 0) return;
        $.post("B_GoodsSvc.data?action=GetGoodsRecordByGoodsId", {
            goodsId: JSON.stringify(goodsId)
        }, function (res) {
            var json = eval('(' + res + ')');

            gridBorrowModel.show(root.find("[data-id='activity-tab-ProjectTab_b-content']"), json.data.Table);
            gridChangeModel.show(root.find("[data-id='activity-tab-ProjectTab_c-content']"), json.data.Table1);
            gridFixModel.show(root.find("[data-id='activity-tab-ProjectTab_d-content']"), json.data.Table2);
            gridNormalModel.show(root.find("[data-id='activity-tab-ProjectTab_e-content']"), json.data.Table3);
            gridQuitModel.show(root.find("[data-id='activity-tab-ProjectTab_f-content']"), json.data.Table4);

        })
    }

    function DeleteRecord(id) {
        if (id == null || id == "" || id == 0) return;
        $.post("B_GoodsSvc.data?action=DeleteGoodsRecord", {
            id: id
        }, function (res) {
            var json = eval('(' + res + ')');
            if (!json.success) {
                  $.Com.showMsg(json.msg);
            }
            //刷新状态记录
            showGoodsRecord(models.detailmodel.getData().id);
        })
    }
    //绑定记录表实体
    function BindRecordModel() {
        //绑定记录
        $.fxPost("B_GoodsSvc.data?action=GetB_GoodsStatusRecordModel", "", function (ret) {
            ret.data = [];
            //借用
            gridBorrowModel = $.Com.GridModel({
                elementsCount: 10
                , edit: function (item, callback) {

                }
                , remove: function (row) {
                    if (!confirm("确定要删除此行数据吗？")) return false;
                    else {
                        var id = row.id();
                        DeleteRecord(id);
                    }
                }
                , keyColumns: "id"
            });

            //转移
            gridChangeModel = $.Com.GridModel({
                elementsCount: 10
           , edit: function (item, callback) {

           }
           , remove: function (row) {
               if (!confirm("确定要删除此行数据吗？")) return false;
               else {
                   var id = row.id();
                   DeleteRecord(id);
               }
           }
           , keyColumns: "id"
            });

            //维修
            gridFixModel = $.Com.GridModel({
                elementsCount: 10
      , edit: function (item, callback) {

      }
      , remove: function (row) {
          if (!confirm("确定要删除此行数据吗？")) return false;
          else {
              var id = row.id();
              DeleteRecord(id);
          }
      }
      , keyColumns: "id"
            });

            //正常
            gridNormalModel = $.Com.GridModel({
                elementsCount: 10
                , edit: function (item, callback) {

                }
                , remove: function (row) {
                    if (!confirm("确定要删除此行数据吗？")) return false;
                    else {
                        var id = row.id();
                        DeleteRecord(id);
                    }
                }
                , keyColumns: "id"
            });


            //正常
            gridQuitModel = $.Com.GridModel({
                elementsCount: 10
                , edit: function (item, callback) {

                }
                , remove: function (row) {
                    if (!confirm("确定要删除此行数据吗？")) return false;
                    else {
                        var id = row.id();
                        DeleteRecord(id);
                    }
                }
                , keyColumns: "id"
            });



            gridBorrowModel.show(root.find("[data-id='activity-tab-ProjectTab_b-content']"), ret.data);
            gridChangeModel.show(root.find("[data-id='activity-tab-ProjectTab_c-content']"), ret.data);
            gridFixModel.show(root.find("[data-id='activity-tab-ProjectTab_d-content']"), ret.data);
            gridNormalModel.show(root.find("[data-id='activity-tab-ProjectTab_e-content']"), ret.data);
            gridQuitModel.show(root.find("[data-id='activity-tab-ProjectTab_f-content']"), ret.data);
        })

    }

    function showAddGoodBox() {
        $.fxPost("B_GoodsSvc.data?action=GetGoodsModel", "", function (ret) {

            ret.data.zclb = 0;
            ret.data.bgqk = 0;
            ret.data.jldw = 0;
            ret.data.wpzt = 1;
            ret.data.dwmc = 1;
            models.adetailmodel = $.Com.FormModel({});

            var dlgOpts = {
                title: '物品添加', width: 800, height: 700,
                button: [
               {
                   text: '保存', handler: function (data) {
                       var da = models.adetailmodel.getData();
                       saveData(da, function (a) {
                           if (a == true) {
                               win.close();
                           } else {
                               updateData();
                           }
                       });
                   }
               },
              {
                  text: '取消', handler: function () { win.close(); }
              }]
            };
            var win = $.Com.showFormWin(ret.data, function () {
            }, models.adetailmodel, root.find("[data-id='addGoodBox']"), dlgOpts);
        });
    }
}
