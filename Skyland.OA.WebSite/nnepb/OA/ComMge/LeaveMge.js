define(new function() {
    var root;
    var models = {};

    this.show = function(module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/ComMge/LeaveMge.html", function () {
            loadData();
        });
    }
    function loadData() {
        var modelDIV = root.find("[data-id='dataGrid']");
        var url = "";
        url = "nnepb/OA/Leave/LeaveGrid";
        var moduleItem = { module: 'm2', model: url, pageSet: "handler" }
        $.iwf.getModel(moduleItem.model, function (model) {
            if (typeof model == 'function') model = new model();
            modelDIV.empty();
            ko.cleanNode(modelDIV[0]);
            modelDIV.css("overflow", "auto");
            model.viewModel = undefined;
            if (!model.show) return;
            model.show(moduleItem, modelDIV);
        });
    }
})