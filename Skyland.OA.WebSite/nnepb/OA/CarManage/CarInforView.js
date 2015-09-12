define(new function() {
    var root;
    var models = {};


    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/CarManage/CarInforView.html", function () {
            loadData(module.carId);
        });
    }

    function loadData(carId) {
        models.detailmodel = $.Com.FormModel({});
        $.fxPost('Para_OA_CarInfoSvc.data?action=GetCarById', { carid: carId }, function (ret) {
            models.detailmodel.show(root.find("[data-id='baseInfor']"), ret.carInfor);
        });
    }
})