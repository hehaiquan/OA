$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'gdzcStatic' };
    this.show = function (module, root) {
        $.Biz.gdzcStatic.show(module, root);
    }
});

$.Biz.gdzcStatic = new function () {
    var root;
    var models = {};
    var gridModel;

    //基本信息模
    models.searchDiv = $.Com.FormModel({

    })

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/gdzcbj/GdzcStatic.html", function () {
            models.searchDiv.show(root.find("[data-id='searchDiv']"), { datetime: null, datetime1: null });

            loadData("","");

            //查询
            root.find("[data-id='searchBn']").bind("click", function () {
                searchData($.trim(root.find("[data-id='beginText']").val()), $.trim(root.find("[data-id='endText']").val()));// 载入数据 
            });
        })
    }

    // 查询数据
    function loadData(beginDate, endDate) {
        var content = "";
        $.fxPost("B_GoodsSvc.data?action=GetGoodsStatic", { beginDate: beginDate, endDate: endDate }, function (ret) {
                gridModel = $.Com.GridModel({
                    elementsCount: 10

                });
                gridModel.show(root.find("[data-role='staticList']"), ret.data);
        })
    }
    function searchData(beginDate, endDate) {
        $.fxPost("B_GoodsSvc.data?action=GetGoodsStatic", { beginDate: beginDate, endDate: endDate }, function (ret) {
            gridModel.show(root.find("[data-role='staticList']"), ret.data);
        });
    }
}