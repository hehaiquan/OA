//选择企业的列表，就是弹出窗口的内容
$.Biz.projectDataSourceList = function (fl) {

    var selectCallback;

    var gridModel = $.Com.GridModel({
        edit: function (item, callback) { selectCallback(item); }
       , keyColumns: "id"//主键字段
       , elementsCount: 10  //分页,默认5
    });

    this.show = function (module, root) {
        if (root.children().length != 0)
            return;

        selectCallback = module.callback;  //选择单位回调
        root.load("models/unitSelect/projectDataSource.html", function () {

            var par = {
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
                gridModel.show(root.find('[data-role="unitGrid1"]'), data);
            });

        });
    }
}

//加入企业列表的弹窗，建设项目列表
$.Biz.projectDataSourceWin = function (callback, fl) {
    var model = new $.Biz.projectDataSourceList(fl);
    var root = null;

    var opts = { title: '项目列表', height: 730, width: 900 };
    var win = $.iwf.showWin(opts);

    model.show({ callback: function (item) { callback(item); win.close(); } }, win.content());
}

//加入企业列表的弹窗，建设项目列表
$.Biz.AssessDataSourceWin = function (callback) {
    var model = new $.Biz.AssessDataSourceList();
    var root = null;

    var opts = { title: '项目列表', height: 730, width: 900 };
    var win = $.iwf.showWin(opts);

    model.show({ callback: function (item) { callback(item); win.close(); } }, win.content());
}

//选择企业的列表，就是弹出窗口的内容
$.Biz.AssessDataSourceList = function () {

    var selectCallback;

    var gridModel = $.Com.GridModel({
        edit: function (item, callback) { selectCallback(item); }
       , keyColumns: "workflowcaseid"//主键字段
       , elementsCount: 10  //分页,默认5
    });

    this.show = function (module, root) {
        if (root.children().length != 0)
            return;

        selectCallback = module.callback;  //选择单位回调
        root.load("models/unitSelect/projectDataSource.html", function () {

            $.fxPost("UsedPhraseSvc.data?action=GetAssessData", {}, function (data) {
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
