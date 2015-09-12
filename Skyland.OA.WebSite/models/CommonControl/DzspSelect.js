//选择电子沙盘的列表，就是弹出窗口的内容
$.Biz.DzspSelectList = function () {
    self = this;
    var selectCallback;
    var rootDiv;
    var detailmodel = $.Com.FormModel({});
    var gridModel = $.Com.GridModel({
        edit: function (item, callback) {             
            selectCallback(item); 
        },
        remove: function (row) {
            if (!confirm("确定删除吗?")) return false;
            $.fxPost('GetGisDataSvc.data?action=operateDZSP', { mode: 'delete', id: row.id() }, function (res) { });
        },
       keyColumns: "id"//主键字段
       ,elementsCount: 10  //分页,默认5
    });

    this.show = function (module, root) {
        if (root.children().length != 0) return;
        rootDiv=root;
        selectCallback = module.callback;  //选择单位回调
        var par = {
            tablename: "GIG_Dzsp",
            showfield: "",
            where: null
        }
        //root.load("models/CommonControl/DzspSelect.html", function () {         
        //    $.fxPost("UsedPhraseSvc.data?action=GetData", par, function (data) {
        //        data = eval('(' + data.data + ')')
        //        gridModel.show(root.find('[data-role="unitGrid1"]'), data);
        //    });
        //});
        root.load("models/CommonControl/DzspSelect.html", function () {
            $.fxPost('GetGisDataSvc.data?action=operateDZSP', { mode: 'all' }, function (res) {
                var data = [];
                $.each(res.data, function (i, item) {
                    var obj = JSON.parse(item);
                    data.push(obj);
                });
                gridModel.show(root.find('[data-role="unitGrid1"]'), data);
            });
        });
    }
}

//电子沙盘的列表的弹窗
$.Biz.DzspSelectWin = function (callback) {
    var model = new $.Biz.DzspSelectList();
    var opts = {
        title: '电子沙盘列表', height: 730, width: 800,
        // button: [
        //           {
        //               text: '确定', handler: function (data) {
        //                   callback(model.selectData);
        //                   win.close();
        //               }
        //           },
        //           { text: '取消', handler: function () { win.close(); } }
        //]
    };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
          { callback: function (item) { callback(item); win.close(); } },
          root
    );
}

