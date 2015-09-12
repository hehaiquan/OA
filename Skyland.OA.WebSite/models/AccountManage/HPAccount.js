$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'HPAccount' };// 建设项目
    this.show = function (moduel, root) {
        $.Biz.HPAccount.show(moduel, root);
    };
});


$.Biz.HPAccount = new function () {
    
    var self = this;
    var root;
    self.data = null;
    var models = {};

    models.gridModel = $.Com.GridModel({
        keyColumns: "ID",//主键字段
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
            vm.showYw = function (ID) {
                var hostUrl = window.location.host;
                //台帐
                $.Biz.BrowseAccountWin(ID, function (item) { })
            }
        },
        edit: function (item, callback) { },
        remove: function (row) { },
        elementsCount: 10  //分页,默认5
    });



    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/BusinessSearchManage/B_EIA_DocumentEvaluationMainSearchPage.html", function () {
            var where = "";
            loadData(where) // 载入数据 

        });
    }


    // 载入数据
    function loadData(where) {
        var par = {
            tablename: "V_B_EIA_DocumentEvaluationMain",
            showfield: "",
            //where: where
            order: "isEnd asc,CreateDate desc"
        }
        $.fxPost("UsedPhraseSvc.data?action=GetData", par, function (data) {
            data = eval('(' + data.data + ')')
            models.gridModel.show(root.find('[data-role="listGrid"]'), data);
        });
    }
    

};

