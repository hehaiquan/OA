$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'fileManage' };
    this.show = function (module, root) {
        $.Biz.fileManage.show(module, root);
    }
});



$.Biz.fileManage = new function () {
    var root;
    var models = {};

    models.gridModel = $.Com.GridModel({
        keyColumns: "UserID",//主键字段
        beforeBind: function (vm, _root) {//表格加载前
            vm.getSingleManage = function (UserID) {
                //  $.Com.showMsg(UserID());
                root.find("[data-id='humanDetailInfor']").attr("style", "display:display;");
                root.find("[data-id='humanGrid']").attr("style", "display:none;");
            }
        },
        elementsCount: 10,
    })

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;

        root.load("models/B_OA_HumanManage/FileManage.html", function () {
            loadData();
            root.find("[data-id='goBack']").bind("click", function () {
                root.find("[data-id='humanDetailInfor']").attr("style", "display:none;");
                root.find("[data-id='humanGrid']").attr("style", "display:display;");
            })
            
        });
    }

    function loadData() {
        $.fxPost("FX_UserInfoSvc.data?action=GetUserInforList", {}, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            var da = ret.data;
            models.gridModel.show(root.find("[data-id='humanGrid']"), da.dt);
        })
    }
}