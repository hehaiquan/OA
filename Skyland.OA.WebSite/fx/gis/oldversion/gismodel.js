define(function () {
    return new function () {
        var me = this;
        this.options = { key: 'gismodel' };
        function cloneJSON(jsondata) {
            var rePara = "";
            for (var x in jsondata) {
                if (x != 'url' && x != 'title') rePara = rePara + x + "=" + escape(jsondata[x]);
            }
            return rePara;
        }

        this.show = function (module, root) {
            if (root.children().length > 0) return;
            var json = module.params.replace(/"/g, "'");
            if (module.state) var json2 = module.state.replace(/"/g, "'");
            var params = eval('({' + json + '})');
            var params2 = eval('(' + json2 + ')');
            root.css('position', 'relative');

            $.Gis.init(root, params, params2);

            return;
        };

        this.refresh = function (params) {
            var json = params.replace(/"/g, "'");
            var params = eval('(' + json + ')');

            $.Gis.refresh(params);
        }
    }
});