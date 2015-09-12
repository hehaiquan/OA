$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'unitinfomodule' };
    this.show = function (module, root) {
        $.Biz.Base_Unitinfo.show(module, root);
    }
});



$.Biz.Base_Unitinfo = new function () {
    var root;
    var data;
    var wftool;

    var gridModel = $.Com.GridModel({
        beforeBind: function (vm, _root) {

        },
        elementsCount: 10,
        edit: function (item, callback) { showDetail(item, callback); },
         remove: function (row) {
            if (!confirm("确定要删除这条数据吗？")) return false;
            else {
                var id = row.qydm();
                deleteData(id);

            }
        }
        , keyColumns: "qydm",
        // columns: [
        //    { title: "单位名称", key: "qymc", sortable: true, content: "<span class=\"btn btn-link\" data-bind=\"text:qymc,click: $root.editRow\"></span>" },
        //    { title: "单位地址", key: "qydz", sortable: true },
        //    { title: "企业状态", key: "qyzt", sortable: true },
        //    { title: "编辑", key: "action", sortable: true, width: "50px", content: "<span class=\"btn\" data-bind='click: $root.editRow'><i  class=\"fa fa-times\"></i></span>" },
        //    { title: "删除", key: "action", sortable: true, width: "50px", content: "<span class=\"btn\" data-bind='click: $root.removeRow'><i  class=\"fa fa-times\"></i></span>" }

        //],
         cssClass: "table table-striped table-bordered  table-condensed"
    });

    //显示弹窗
    function showDetail(item, callback) {
        var detailmodel = $.Com.FormModel({});
        var divroot = root;
        var dlgOpts = { title: '企业信息', width: 1500, height: 1200 };
        //数据、保存回调、模块、html模板、选项
        var win = $.Com.showFormWin(item, function () {
            // 确定保存数据
            var data = detailmodel.getData();
            saveData(data);
        }, detailmodel, root.find("[data-id='editData']"), dlgOpts);
    }

    function searchData(conditions) {
        var content = conditions;
        $.fxPost("Base_UnitinfoSvc.data?action=loadData", content, function (ret) {
            if (ret.data.dataList) {
                data = ret;
                gridModel.show(root.find("[data-id='Base_UnitinfoGrid']"), ret.data.dataList);
            }
        });
    };

    // 保存数据
    function saveData(lawData) {
        //alert('数据保存成功！'); return;
        if (lawData == null || lawData == "") return;
        var content = JSON.stringify(lawData);
        $.post('Base_UnitinfoSvc.data?action=Save', { JsonData: content }, function (res) {
            loadData();
            alert("保存成功。");
        });
    }

    // 载入数据
    function loadData() {
        // 载入数据
        var params = Object();
        $.fxPost("Base_UnitinfoSvc.data?action=loadData", params, function (ret) {
            if (ret.data.dataList) {
                data = ret;
                //gridModel.show(root.find("[data-id='Base_UnitinfoGrid']"), [{ qymc: "sdsds", qydz: null, qyzt: "正常" }, { qymc: "ffffff", qydz: "ffffffff", qyzt: "正常" }]);
                gridModel.show(root.find("[data-id='Base_UnitinfoGrid']"), ret.data.dataList);
            }
        });
    }

    // 删除行数据
    function deleteData(id) {
        if (!id) return;
        $.post("/Base_UnitinfoSvc.data?action=DeleteData", { qydm: id }, function (data) {
            var json = eval('(' + data + ')')
            if (json.success) {
                return true;
            } else {
                alert(json.msg);
                return false;
            }
            loadData();
        });

    }

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/Base_Unitinfo/Base_Unitinfo.html", function () {
            loadData();
            root.find("[data-id='search']").bind("click", function () {
                var qymc = root.find("[data-id='qymc']").val();
                var qyzt = root.find("[data-id='qyzt']").val();
                var con = {
                    qymc: qymc,
                    qyzt: qyzt
                };
                searchData(con);
            });
            root.find("[data-id='new']").bind("click", function () {
                showDetail(data.data.editData, function (data) {
                    gridModel.viewModel.addRow(data);
                });
            });

        });
    }
};
