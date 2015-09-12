define(new function () {
    var root;
    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/ComMge/NoticeMge.html", function () {
            $.fxPost("DocumentCenterSvc.data?action=GetFileTypeByFlayType", { flagType: "4" }, function (ret) {
                loadData(ret.fileType.FileTypeId);
            });
        });
    }

    function loadData(fileTypeId) {
        var modelDIV = root.find("[data-id='dataGrid']");
        var url = "nnepb/oa/DocumentCenter/DocViewByFId";
        var moduleItem = { module: 'm2', model: url, fileType: fileTypeId, pageSet: "handler" }
        $.iwf.getModel(moduleItem.model, function (model) {
            if (typeof model == 'function') model = new model();
            modelDIV.empty();
            ko.cleanNode(modelDIV[0]);
            modelDIV.css("overflow", "auto");
            model.viewModel = undefined;
            if (!model.show) return;
            model.show(moduleItem, modelDIV);
        });
    };
})