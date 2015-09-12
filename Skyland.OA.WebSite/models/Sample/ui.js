$.Biz.splitui = new function () {

    var root;
    var detailmodel = $.Com.FormModel({});
    var constwidth = 992;
    var callbackforsave;// 回调
    var curData;
    var gridModel;

    this.show = function (module, _root) {
        root = _root;
        root.css("position", "relative");
        if (root.children().length != 0) return;

        root.load("models/splitui/ui.html", function () {

            // 如果界面设置为选择模式或显示数据！！禁止编辑
            setUInotEdit(module);

            loadData();

            root.find("[data-id='add']").bind("click", function () {
                // 加入业务逻辑
                showDetailDIV();
            });

            root.find("[data-id='back']").bind("click", function () { showListDIV(); });

            root.find("[data-id='save']").bind("click", function () {
                //加入业务逻辑
                showListDIV();
            });

            initUILayout();
        });

    };

    function setUInotEdit(module) {
        if (module.select || module.curData != undefined) {
            root.find("[data-id='add']").hide();
            root.find("[data-id='save']").hide();
            root.find("[data-id='delbtn']").remove();
            if (module.curData != undefined) {
                detailmodel.show(root.find("[data-id='editent']"), module.curData);
                root.find("[data-id='editent']").css("width", "100%");
                root.find("[data-id='list']").hide();
                root.showDetailOnly = true;
                return;
            }
        }
    }

    function initUILayout() {
        if (root.showDetailOnly) return;
        root.find("[data-id='listtable']").height(root.height() - 230).css("overflow-y", "auto").css("overflow-x", "hidden");
        root.find(".pageContainer").css("max-height", (root.height() - 180) + "px").css("overflow-y", "auto");
        if (window.innerWidth > constwidth ) {
            root.find("[data-id='editent']").show();
            if (root.showDetail == true) {
                root.find("[data-id='list']").show();
                root.showDetail = undefined;
            }
        }
        else {
            if (root.showDetail != true)
                root.find("[data-id='editent']").hide();
            
        }
    }
    function showListDIV() {
        if (window.innerWidth > constwidth) return;
        root.showDetail = false;
        root.find("[data-id='editent']").hide();
        root.find("[data-id='list']").show();
    }
    function showDetailDIV() {
        if (window.innerWidth > constwidth) return;
        root.find("[data-id='list']").hide();
        root.find("[data-id='editent']").show();
        root.showDetail = true;
    }

    this.resize = function (s) {
        if (root) initUILayout();
    }

    this.getData = function () {
        return curData;
    };

    // 加载数据
    function loadData()  {
        $.fxPost("org.data?action=getuserlist", {}, function (ret) {
            if (ret) {
                data = ret;
                gridModel = $.Com.GridModel({
                    elementsCount: 5
                    , edit: function (item, callback) {
                        showDetailDIV();

                        detailmodel.show( root.find("[data-id='editent']"), item);// 空出模板让用户填写

                        callbackforsave = callback;// 回调
                        curData = item;
                     
                    }
                    , remove: function (row) {
                        if (!confirm("确定要删除此行吗？"))
                            return false;
                        else {
                            var id = row.id();
                            alert('删除成功！');
                        }
                    }
                    , keyColumns: "id"
                });

                gridModel.show(root.find("[data-id='list']"), ret);

            }
        });
    };


};

$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'splitui' };
    this.show = function (module, root) {
        $.Biz.splitui.show(module, root);
    };

    this.resize = function (s) {
        $.Biz.splitui.resize(s);
    }
});

