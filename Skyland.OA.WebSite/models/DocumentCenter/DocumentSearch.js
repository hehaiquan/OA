$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'documentSearch' };
    this.show = function (module, root) {
        $.Biz.documentSearch.show(module, root);
    };
});



$.Biz.documentSearch = new function () {
    var root;
    var self = this;
    var models = {};
    var cleanModel;
    models.searchModel = $.Com.FormModel({});


    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/DocumentCenter/DocumentSearch.html", function () {
            loadData();
        })
    }
    function loadData() {
        $.fxPost("DocumentCenterSvc.data?action=B_OA_NoticeModel", "", function (ret) {
            //cleanModel = ret.data
            models.searchModel.show(root.find('[data-id="searchForm"]'), ret.data);
        })
    }
}