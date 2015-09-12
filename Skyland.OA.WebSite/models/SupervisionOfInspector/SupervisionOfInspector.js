$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'supervisionOfInspector' };
    this.show = function (module, root) {
        $.Biz.supervisionOfInspector.show(module, root);
    };
});


$.Biz.supervisionOfInspector = new function () {
    var root;
    var self = this;
    var models = {};

    models.detailmodel = $.Com.FormModel({

    });

    this.show = function (module, _root) {
        root = _root;
        root.load("models/supervisionOfInspector/supervisionOfInspector.html", function () {
            $.fxPost("SupervisionOfInspectorSvc.data?action=GetDataById", {id:""}, function (ret) {
                if(!ret.success){
                      $.Com.showMsg(ret.msg);
                    return;
                }
                var da = ret.data;
                models.detailmodel.show(root.find("[data-id='supervisionDetailModel']"), da.supervision); // 空出模板让用户填写
            })
        })
    }
}