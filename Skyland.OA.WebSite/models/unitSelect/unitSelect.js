//选择企业的列表，就是弹出窗口的内容
$.Biz.unitSelList = function (fl) {

    var selectCallback;

    var gridModel = $.Com.GridModel({
        edit: function (item, callback) { selectCallback(item); }
       ,keyColumns: "id"//主键字段
       ,elementsCount: 10  //分页,默认5
    });


    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;  //选择单位回调
        root.load("models/unitSelect/unitSelect.html", function () {

            //var par = {
            //    tablename: "Base_Unitinfo",
            //    showfield: null,
            //    where: fl?fl:null
            //};
            $.fxPost("Base_UnitinfoSvc.data?action=GetCompany", {}, function (data) {
                if (!data.success) {
                    alert(data.msg);
                    return;
                }

                data = eval('(' + data.data + ')')
                gridModel.show(root.find('[data-role="unitGrid1"]'), data);
            });
        });
    }
}

//加入企业列表的弹窗，选择企业
$.Biz.unitselectWin = function (callback,fl) {
    var model = new $.Biz.unitSelList(fl);
    var root = null;

    var opts = { title: '企业列表', height: 700, width: 900 };
    var win = $.iwf.showWin(opts);

    model.show({ callback: function (item) { callback(item); win.close(); } }, win.content());
}


//运输企业
$.Biz.transportUnitselectWin = function (callback, fl) {
    var model = new $.Biz.transportUnitSelList(fl);
    var root = null;

    var opts = { title: '企业列表', height: 730, width: 750 };
    var win = $.iwf.showWin(opts);

    model.show({ callback: function (item) { callback(item); win.close(); } }, win.content());
}

$.Biz.transportUnitSelList = function (fl) {

    var selectCallback;

    var gridModel = $.Com.GridModel({
        edit: function (item, callback) { selectCallback(item); }
       , keyColumns: "id"//主键字段
       , elementsCount: 10  //分页,默认5
    });


    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;  //选择单位回调
        root.load("models/unitSelect/wasteUnitSelect.html", function () {
            $.fxPost("UnitManagerService.data?action=GetCompanyByType", { cType: fl }, function (data) {
                if (!data.success) {
                    alert(data.msg);
                    return;
                }

                data = eval('(' + data.data + ')')
                gridModel.show(root.find('[data-role="unitGrid1"]'), data);
            });
        });
    }
}

