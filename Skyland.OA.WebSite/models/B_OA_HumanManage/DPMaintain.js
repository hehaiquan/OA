$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'DPMaintain' };
    this.show = function (module, root) {
        $.Biz.DPMaintain.show(module, root);
    }
});



$.Biz.DPMaintain = new function () {
    var root;
    var models = {};
    var orList;
    var orDp;
    models.gridModel = $.Com.GridModel({
        keyColumns: "DPID",//主键字段
        beforeBind: function (vm, _root) {//表格加载前
            vm._DeleteData = function (dpId) {
                if (!confirm("确定要删除此部门吗？")) return false;
                deleteData(dpId())
            }
        },
        edit: function (item, callback) {

            showDetailWind(item);
        },
        elementsCount: 10,
    })

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;

        root.load("models/B_OA_HumanManage/DPMaintain.html", function () {
            loadData();

            root.find("[data-id='addNewBtn']").bind("click", function () {
                showAddWind(orDp);
            });
        })
    }

    function loadData() {
        $.fxPost("FX_DepartmentSvc.data?action=GetAllList", {}, function (ret) {
            orList = ret.list;
            orDp = ret.dp;
            models.gridModel.show(root.find("[data-id='dpGrid']"), orList);
        })
    }
    function deleteData(dpId) {
        $.fxPost("FX_DepartmentSvc.data?action=DeleteDp", { dpId: dpId }, function (ret) {
            if (ret.success == false) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            loadData();
        })
    }
    function showDetailWind(item) {
        models.baseInforModel = $.Com.FormModel({});

        var dlgOpts = {
            title: '部门编辑', width: 600, height: 250,
            button: [
           {
               text: '确定', handler: function (data) {
                   var da = models.baseInforModel.getData();
                   saveData(da);
                   for (var i = 0 ; i < orList.length; i++) {
                       if (da.DPID == orList[i].DPID) {
                           orList[i].DPName = da.DPName;
                           orList[i].FullName = da.FullName;
                           break;
                       }
                   }
                   models.gridModel.show(root.find("[data-id='dpGrid']"), orList);
               }
           },
          {
              text: '取消', handler: function () {
                  win.close();
              }
          }
            ]
        };
        var win = $.Com.showFormWin(item, function () {
        }, models.baseInforModel, root.find("[data-id='showEditWind']"), dlgOpts);
    }

    function showAddWind(item) {
        models.addBaseInfor = $.Com.FormModel({});
        var dlgOpts = {
            title: '新建部门', width: 600, height: 250,
            button: [
           {
               text: '确定', handler: function (data) {
                   var da = models.addBaseInfor.getData();
                   addData(da,win);
               }
           },
          {
              text: '取消', handler: function () {
                  win.close();
              }
          }
            ]
        };
        var win = $.Com.showFormWin(item, function () {
        }, models.addBaseInfor, root.find("[data-id='showAddWind']"), dlgOpts);
    }

    function addData(item,win) {
        var DPName = item.DPName;
        var FullName = item.FullName;
        $.fxPost("FX_DepartmentSvc.data?action=CreateDepartment", { DPName: DPName, FullName: FullName }, function (ret) {
            if (ret.success == true) {
                win.close();
                loadData();
            }

        })
    }

    function saveData(item,win) {
        var DPID = item.DPID;
        var DPName = item.DPName;
        var FullName = item.FullName;
        $.fxPost("FX_DepartmentSvc.data?action=UpdateDPName", { DPID: DPID, DPName: DPName, FullName: FullName }, function (ret) {
            if(ret.success==true){
                win.close();
            }
        })
    }
}