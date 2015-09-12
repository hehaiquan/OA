//选择车辆的model，就是弹出窗口的内容
$.Biz.carInfo = function () {
    var selectCallback;
    var gridModel = $.Com.GridModel({
        keyColumns: "id",//主键字段
        edit: function (item, callback) {
            selectCallback(item);
            //svaeNr(item.cph);
        },
        elementsCount: 10  //分页,默认5
    });

    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;  //选择单位回调
        root.load("models/CarInfo/CarInfo.html", function () {
            $.fxPost("Para_OA_CarInfoSvc.data?action=GetData", {}, function (data) {
                gridModel.show(root.find('[data-role="carInfoGrid"]'), data.data.dataList);
            });
        });
    }
}


//选择车辆
$.Biz.carInfoSelect = function (callback) {

    var model = new $.Biz.carInfo();
    var root = null;
    var opts = { title: '选择车辆', height: 730, width: 750 };
    var win = $.iwf.showWin(opts);
    model.show(
        {
            callback: function (item) { callback(item); win.close(); }
        },
        win.content()
     );
}

