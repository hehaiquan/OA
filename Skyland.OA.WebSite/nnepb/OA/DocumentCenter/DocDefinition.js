define(new function () {
    var root;
    var self = this;
    var models = {};
    var defindLink_A;

    models.definiteGrid = $.Com.GridModel({
        keyColumns: "id",//主键字段
        beforeBind: function (vm, root) {
            vm.deleteData = function (id) {
                deletData(id());
            }
        },
        edit: function (item, callback) {
            showEditWind(item);
        },
        remove: function (row) {

        },
        elementsCount: 10
    });

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/DocumentCenter/DocDefinition.html", function () {
            loadData();

            root.find("[data-id='addBtn']").bind("click", function () {
                showEditWind(defindLink_A);
            });
        })

    }

    function loadData() {
        $.fxPost("/DocumentCenterSvc.data?action=GetDocDefinition", "", function (ret) {
            models.definiteGrid.show(root.find('[data-id="dataGrid"]'), ret.dt);
            defindLink_A = ret.defindLink;
        })
    }

    function deletData(id) {
        $.Com.confirm("您确定要删除此数据吗？", function () {
            $.fxPost("/DocumentCenterSvc.data?action=DeleteDefinfLink", { id: id }, function (ret) {
                loadData();
            })
        });
    }

    //修改弹窗
    function showEditWind(editData) {
        models.editModel = $.Com.FormModel({});
        var title = "";
        if (editData.id == "" || editData.id == null) {
            title = "新增";
        } else {
            title = "修改";
        }
        var dlgOpts = {
            title: title, width: 600, height: 450,
            button: [
           {
               text: '确定', handler: function () {
                   var da = models.editModel.getData();
                   saveData(da);
                   win.close();
               }
           },
          {
              text: '取消', handler: function () {
                  win.close();
              }
          }
            ]
        };
        var win = $.Com.showFormWin(editData, function () {
        }, models.editModel, root.find("[data-id='addWindDow']"), dlgOpts);
    }

    function saveData(da) {
        var content = JSON.stringify(da);
        $.fxPost("/DocumentCenterSvc.data?action=SaveDefindLink", { content: content }, function (ret) {
            loadData();
        })
    }
})