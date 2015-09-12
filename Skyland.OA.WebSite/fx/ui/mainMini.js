//一次只加载一个模块
define(function () {
    return new function () {
        var root;

        this.init = function (r) {
            root = r;

        }

        this.show = function (moduleItem) {

            root.empty();
            var modelDIV = $('<div style="width:100%;height:100%"></div>').appendTo(root);

            $.iwf.getModel(moduleItem.model, function (model) {
                if (typeof model == 'function') model = new model();
                if ($.iwf.curModel) {
                    if ($.iwf.curModel.close) $.iwf.curModel.close();
                    delete $.iwf.curModel;
                }
                $.iwf.curModel = model;
                if (!model.show) return;

                modelDIV.css("overflow", "auto");
                model.show(moduleItem, modelDIV);
                $.iwf.curModel = model;
            });
        }

        this.resize = function (size) {
            if (root) {
                root.height(size.height - size.topHeight);

                if ($.iwf.curModel && $.iwf.curModel.resize) $.iwf.curModel.resize(root.width(), root.height());
            }
        }
    };


})