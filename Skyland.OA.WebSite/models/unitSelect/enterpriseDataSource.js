//选择企业的列表，就是弹出窗口的内容
$.Biz.enterpriseDataSourceList = function (fl) {

    var selectCallback;

    var gridModel = $.Com.GridModel({
        edit: function (item, callback) { selectCallback(item); }
       , keyColumns: "id"//主键字段
       , elementsCount: 10  //分页,默认5
    });
    var gridModel2 = $.Com.GridModel({
        edit: function (item, callback) { selectCallback(item); }
   , keyColumns: "id"//主键字段
   , elementsCount: 10  //分页,默认5
    });


    this.show = function (module, root) {
        if (root.children().length != 0)
            return;

        selectCallback = module.callback;  //选择单位回调
        root.load("models/unitSelect/enterpriseDataSource.html", function () {

            var par = {
                tablename: "Base_Unitinfo",
                showfield: null,
                where: fl ? fl : null
            };
            $.fxPost("Base_UnitinfoSvc.data?action=GetCompany", {}, function (data) {
                if (!data.success) {
                    alert(data.msg);
                    return;
                }

                data = eval('(' + data.data + ')')
                gridModel.show(root.find('[data-role="unitGrid1"]'), data);
            });

            //tab设置
            var tal = root.find("[data-id='talDiv']");
            tal.iwfTab(
                {
                    stretch: true,// 设置：tab滚动条无显示
                    tabchange: function (dom) {
                        if (dom != null) {
                            if (dom[0].outerHTML.indexOf("建设项目") > 0) {
                                par = {
                                    tablename: "B_CP_ExamApprovalMain",
                                    showfield: null,
                                    where: fl ? fl : null
                                };
                                $.fxPost("UsedPhraseSvc.data?action=GetData", par, function (data) {
                                    if (!data.success) {
                                        alert(data.msg);
                                        return;
                                    }

                                    data = eval('(' + data.data + ')')
                                    gridModel2.show(root.find('[data-role="unitGrid2"]'), data);
                                });
                            }
                        }
                    }
                }
            );
        });
    }
}

//加入企业列表的弹窗，选择企业
$.Biz.enterpriseDataSourceWin = function (callback, fl) {
    var model = new $.Biz.enterpriseDataSourceList(fl);
    var root = null;

    var opts = { title: '', height: 730, width: 900 };
    var win = $.iwf.showWin(opts);

    model.show({ callback: function (item) { callback(item); win.close(); } }, win.content());
}

