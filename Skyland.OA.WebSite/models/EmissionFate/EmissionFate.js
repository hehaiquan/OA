//选择用户常用语的model，就是弹出窗口的内容
$.Biz.EmissionFate = function (lx) {
    var selectCallback;
    var gridModel = $.Com.GridModel({
        keyColumns: "dm",//主键字段
        edit: function (item, callback) {
            selectCallback(item);
        },
        remove: function (row) {
            $.fxPost("/EmissionFateSvc.data?action=DeleteData&id=" + row.dm(), {}, function (ret) {
                if (ret.success) {
                    alert(ret.msg);
                    return true;
                } else {
                    alert(ret.msg);
                    return false;
                    
                }
            });

        },
        elementsCount: 10  //分页,默认5
    });

    //保存常用语
    var svaeNr = function(nr) {
        if (nr == null) return;
        $.fxPost("/EmissionFateSvc.data?action=SaveData&lx=" + lx, nr, function(ret) {
            if (ret.success) {
                alert(ret.msg);
                return true;
            } else {
                alert(ret.msg);
                return false;
            }
        });
    };

    this.show = function(module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback; //选择单位回调
        root.load("models/EmissionFate/EmissionFate.html", function() {
            $.fxPost("EmissionFateSvc.data?action=GetData&lx=" + lx, {}, function(ret) {
                gridModel.show(root.find('[data-role="EmissionFateGrid"]'), ret.dataList);
            });

            root.find("[data-id='EmissionFateAddBn']").click(function() {
                var dm = root.find("[data-id='dmFilterInput']").val();
                var mc = root.find("[data-id='mcFilterInput']").val();
                if (dm == null || dm == "" || mc == null || mc == "") return;
                //selectCallback({ dm:dm, mc:mc });
                svaeNr({ dm: dm, mc: mc });
                //$.fxPost("EmissionFateSvc.data?action=GetData&lx=" + lx, {}, function (data) {
                //    gridModel.show(root.find('[data-role="EmissionFateGrid"]'), data.data.dataList)

                //});
            });
        });
    };
};

//排放去向
$.Biz.EmissionFateSelect = function (lx, callback) {

    var model = new $.Biz.EmissionFate(lx);
    var root = null;
    var opts = { title: '选择排放去向', height: 730, width: 750 };
    var win = $.iwf.showWin(opts);
    model.show(
        {
            callback: function (item) { callback(item); win.close(); }
        },
        win.content()
     );
};

