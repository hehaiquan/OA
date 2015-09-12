define(new function () {
    var root;
    var models = {};
    var self = this;
    var text = { content: "" };

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/SendDoc/MainBody.html", function () {
            text.content = module.content;
            loadData(text);
        });
    }

    this.getData = function () {
        var dataContent = models.detailmodel.getData();
        return dataContent;
    }

    function loadData(text) {
        models.detailmodel = $.Com.FormModel({});
        models.detailmodel.show(root.find("[data-id='baseInfor']"), text);
    }
})