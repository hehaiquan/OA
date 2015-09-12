$.Biz.bizTypeItemPage = new function () {

    var root;
    var data;
    var detailmodel = $.Com.FormModel({});
    var constwidth = 992;
    var callbackforsave;// 回调
    var curData;
    var gridModel;

    this.show = function (module, _root) {
        root = _root;
        root.css("position", "relative");
        if (root.children().length != 0) return;

        root.load("models/DataBaseModel/bizTypeItemPage.html", function () {

            setUInotEdit(module);

            loadData();

            root.find("[data-id='add']").bind("click", function () {
                // 加入业务逻辑
                detailmodel.show(root.find("[data-id='detailDiv']"), data.data.sourceListEdit);
                showDetailDIV();
            });

            root.find("[data-id='back']").bind("click", function () { showListDIV(); });

            root.find("[data-id='save']").bind("click", function () {
                //加入业务逻辑
                var data = detailmodel.getData();
                if (data == undefined || data == false)
                    return;
                saveData(data, callbackforsave);

                showListDIV();
            });

            initUILayout();

        });

    };

    // 如果界面设置为选择模式或显示数据！！禁止编辑
    function setUInotEdit(module) {
        if (module.select || module.curData != undefined) {
            root.find("[data-id='add']").hide();
            root.find("[data-id='save']").hide();
            root.find("[data-id='delbtn']").remove();
            if (module.curData != undefined) {
                detailmodel.show(root.find("[data-id='detailDiv']"), module.curData);
                root.find("[data-id='detailDiv']").css("width", "100%");
                root.find("[data-id='listDiv']").hide();
                root.showDetailOnly = true;  //只显示数据
                return;
            }
        }
    }

    //左右布局显示，左边列表，右边表单，增加到resize,和界面完成初始化
    function initUILayout() {
        if (root.showDetailOnly) return;
        root.find(".leftPanel").height(root.height() - 230).css("overflow-y", "auto").css("overflow-x", "hidden");
        root.find(".rightPanel").css("max-height", (root.height() - 220) + "px").css("overflow-y", "auto").css("overflow-x", "hidden");
        if (window.innerWidth > constwidth) {
            root.find("[data-id='detailDiv']").show();
            if (root.showDetail == true) {  //是否已经为显示详细信息的状态
                root.find("[data-id='listDiv']").show();
                root.showDetail = undefined;
            }
        }
        else {
            if (root.showDetail != true) root.find("[data-id='detailDiv']").hide();
        }
    }

    //显示
    function showListDIV() {
        if (window.innerWidth > constwidth) return;
        root.showDetail = false;
        root.find("[data-id='detailDiv']").hide();
        root.find("[data-id='listDiv']").show();
    }

    function showDetailDIV() {
        if (window.innerWidth > constwidth) return;
        root.find("[data-id='listDiv']").hide();
        root.find("[data-id='detailDiv']").show();
        root.showDetail = true;
    }

    this.resize = function (s) {
        if (root) initUILayout();
    }

    this.getData = function () {
        return curData;
    };

    // 加载数据
    function loadData() {
        var content = "";
        $.fxPost("Para_BizTypeItemSvc.data?action=GetData", content, function (ret) {
            if (ret.success) {
                data = ret;
                gridModel = $.Com.GridModel({
                     elementsCount: 10
                    , edit: function (item, callback) {
                        showDetailDIV();
                        detailmodel.show(root.find("[data-id='detailDiv']"), item);// 空出模板让用户填写
                        callbackforsave = callback;// 回调
                        curData = item;   
                    }
                    , removeConfirm: function (row, callback) {
                        $.Com.confirm("确定删除吗？", function () {
                            deleteData(row.id());
                            callback();
                        });
                    }
                    , keyColumns: "id"// 改
                });

                detailmodel.show(root.find("[data-id='detailDiv']"), ret.data.sourceListEdit);
                gridModel.show(root.find("[data-id='listDiv']"), ret.data.sourceList);
            }
        });
    };

    // 保存数据
    function saveData(itemData, callbackforsave) {
        var params = JSON.stringify({ "baseInfo": itemData });
        $.fxPost('Para_BizTypeItemSvc.data?action=Save', { content: params }, function (ret) {
            if (ret.success) {
                $.Com.showMsg("保存成功！");
                detailmodel.show(root.find("[data-id='detailDiv']"), ret.data.sourceListEdit);
                //if (!callbackforsave) {
                //    gridModel.viewModel.addRow(itemData);
                //}
                //else {
                //    callbackforsave(itemData);
                //}

                gridModel.show(root.find("[data-id='listDiv']"), ret.data.sourceList);
            } else {
                $.Com.showMsg(ret.msg);
            }
        });
    };

    // 删除行数据
    function deleteData(id) {
        if (!id) return;
        var param = id;
        $.fxPost("Para_BizTypeItemSvc.data?action=DeleteData", { content: param }, function (ret) {
            if (ret.success) {
                detailmodel.show(root.find("[data-id='detailDiv']"), ret.data.sourceListEdit);
                return true;
            } else {
                $.Com.showMsg(ret.msg);
                return false;
            }
        });
    };
};

$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'bizTypeItem' };
    this.show = function (module, root) {
        $.Biz.bizTypeItemPage.show(module, root);
    };

    this.resize = function (s) {
        $.Biz.bizTypeItemPage.resize(s);
    }
});
