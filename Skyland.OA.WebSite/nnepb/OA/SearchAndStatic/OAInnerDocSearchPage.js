define(new function() {
    var root;
    this.show = function(model, _root) {
        root = _root;
        if (root.children().length != 0) return;

        root.load("nnepb/OA/SearchAndStatic/OAInnerDocSearchPage.html", function () {
            loadData();
        });
    }

    function loadData(condition) {
        var modelDIV = root.find("[data-id='dataGrid']");
        var url = "";
        url = "nnepb/OA/SearchAndStatic/OAInnerDocSearchGrid";
        var moduleItem = { module: 'm2', model: url, fileType: condition }
        $.iwf.getModel(moduleItem.model, function (model) {
            if (typeof model == 'function') model = new model();
            modelDIV.empty();
            ko.cleanNode(modelDIV[0]);
            modelDIV.css("overflow", "auto");
            model.viewModel = undefined;
            if (!model.show) return;
            model.show(moduleItem, modelDIV);
        })
    };
})