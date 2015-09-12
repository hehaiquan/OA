define(function () {
    return new function () {
        var root;
        var doingcaseType;
        var navigation;
        var MainModuleList = {};

        this.init = function (r) {
            root = r;

        }

        this.resize = function (size) {
            //最小宽度300
            var width = size.width;
            //如果是左侧导航栏
            if ($("#MainframeRight").length < 1) {
                var hash = $.iwf.gethash();
                root.parent().height(size.height - size.topHeight);
                ////特殊处理（门户不定制高度）
                //if (hash && hash.model == "portalmodel") root.parent().height("");
                //else root.parent().height(size.height - size.topHeight);
            } else {

                root.parent().width(width).height(size.height - size.topHeight);
                root.parent().css("overflow", "auto");
                root.width(width);
                root.css("height", "100%");
            }
            if ($.iwf.curModel && $.iwf.curModel.resize) $.iwf.curModel.resize(root.width(), root.height());
        }

        //todo  使用requireJS之后，模块不再是单例模式，如果获取tab页对应的model实例，这是一个很大的问题
        //需要修改，有很大的缺陷！！！
        this.close = function (key) {
            if (MainModuleList[key]) {
                var Module = $.extend({}, true, MainModuleList[key]);
                delete MainModuleList[key];
                var div = findRootByModuleItem(root, Module)
                if (div != null) div.remove();
            }
        }

        //暴力移除某一种model的div
        this.removeDIV = function (module, model) {
            var Dom = root.children("[model=" + model + "][module=" + module + "]");
            if (Dom.length > 0) {
                Dom.each(function () {
                    $(this).remove();
                });
            }
        }

        //显示控件容器的根
        function findRootByModuleItem(parent, ModuleItem) {
            var module = ModuleItem.module;//NAV
            var model = ModuleItem.model;//KEY
            var reg = new RegExp("/", "g"); //创建正则RegExp对象  
            var newstr = model.replace(reg, "-");

            var Dom = parent.children("[model=" + newstr + "][module=" + module + "]");
            //var finalDom = null;
            //if (Dom.length > 0) {
            //    for (var i = 0; i < Dom.length; i++) {
            //        if (Dom.eq(i).data("params") == ModuleItem.params) { finalDom = Dom.eq(i); break; }
            //    }
            //}
            if (Dom.length > 0) return Dom;
            return null;
        };

        function creatRootByModuleItem(parent, ModuleItem) {
            var module = ModuleItem.module;//NAV
            var model = ModuleItem.model;//KEY
            var reg = new RegExp("/", "g"); //创建正则RegExp对象  
            var newstr = model.replace(reg, "-");

            var NEWDIV = $('<div></div>').attr("model", newstr).attr("module", module).height('100%').width('100%');
            //NEWDIV.data("params", ModuleItem.params);
            return NEWDIV;
        };


        this.show = function (moduleItem) {
            var module = moduleItem.module;//NAV

            //彭博设置特例
            if (moduleItem.model == "SysNavSkip") {
                var result = $.iwf.userinfo.UINav.Find(function (ent) { return ent.module == moduleItem.module; });
                var temp = jQuery.iwf.gethash("#" + result.children[0].url);
                moduleItem.model = temp.model;
                moduleItem.text = result.children[0].text;
                moduleItem.params = temp.params;
            }

            if (MainModuleList[module] == undefined) MainModuleList[module] = moduleItem;

            var modelDIV = findRootByModuleItem(root, moduleItem);

            if (!modelDIV) {
                modelDIV = creatRootByModuleItem(root, moduleItem);
                root.append(modelDIV);
            }

            var modelname = moduleItem.model;
            modelname = modelname.split('__')[0];

            $.iwf.getModel(modelname, function (model) {
                if (typeof model == 'function') model = new model();
                $.iwf.loadModel(module + '_' + moduleItem.model, model, modelDIV, moduleItem);
                $.iwf.onresize();
            });

            if (appConfig.beMultiModel)
                modelDIV.siblings().hide();
            else
                modelDIV.siblings().remove();

            modelDIV.show();

            $.iwf.left.show(moduleItem);
        }
    }();

})