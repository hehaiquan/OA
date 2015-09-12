$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'carManage' };
    this.show = function (module, root) {
        $.Biz.carManage.show(module, root);
    };
});


$.Biz.carManage = new function () {
    var root;
    var self = this;
    var models = {};
    var carModel;//车辆空model，用于添加

    //表格Model
    models.gridModel = $.Com.GridModel({
        beforeBind: function (vm, _root) {
        },
        elementsCount: 10,
        edit: function (item, callback) {
            editCarInform(item);
        }
        , remove: function (row) {
        }
        , keyColumns: "id"
    });
    function loadData() {
        $.fxPost("/Para_OA_CarInfoSvc.data?action=GetData", {}, function (ret) {
            if (ret.data.dataList) {
                data = ret.data;
                carModel = data.editData;
                models.gridModel.show(root.find("[data-id='carTableGrid']"), data.dataList);
            }
        })
    }

    function saveData(data, win) {
        var json = JSON.stringify(data);
        $.fxPost("/Para_OA_CarInfoSvc.data?action=Save", { JsonData: json }, function (ret) {
            if (ret) {
                  $.Com.showMsg(ret.msg);
                win.close();
                loadData();
            }
        })
    }

    function editCarInform(item) {
        //车辆Model
        models.CarFormModel = $.Com.FormModel({});

        var dlgOpts = {
            title: '车辆添加', width: 800, height: 700,
            button: [
           {
               text: '保存', handler: function (data) {
                   var da = models.CarFormModel.getData();
                   saveData(da, win);

               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }]
        };
        var win = $.Com.showFormWin(item, function () {
        }, models.CarFormModel, root.find("[data-id='editCar']"), dlgOpts);
    }

    this.show = function (module, _root) {
        $.Biz.carManage.isInitial = true;
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/CarInforManage/CarManage.html", function () {
            loadData();

            //删除
            root.find("[data-id='deleteBtn']").bind("click", function () {
                if (!confirm("确定要删除此车吗？")) return false;

            });

            //新增
            root.find("[data-id='addNewCarBtn']").bind("click", function () {
                editCarInform(carModel);
            });
        })
    }
}