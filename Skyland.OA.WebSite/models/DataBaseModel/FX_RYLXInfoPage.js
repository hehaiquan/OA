$.Biz.FX_RYLXInfoPage = new function () {
    var root;
    var data;
    var constwidth = 992;
    var callbackforsave;// 回调
    var curData;
    var gridModel;

    var detailmodel = $.Com.FormModel({
        beforeBind: function (vm, root) {
        }
    });


    this.show = function (module, _root) {
        root = _root;
        root.css("position", "relative");
        if (root.children().length != 0) return;

        root.load("models/DataBaseModel/FX_RYLXInfoPage.html", function () {
            setUInotEdit(module);
            loadData();
            //}
            initUILayout();

            root.find("[data-id='add']").click(function () {
                // 实例化实体
                InitialEnt();
                showDetailDIV();

                //// 加入业务逻辑
                detailmodel.show(root.find("[data-id='detailDiv']"), data.data.sourceListEdit);
                curData = data.data.sourceListEdit;
            });

            root.find("[data-id='back']").click(function () { showListDIV(); });

            root.find("[data-id='save']").click(function () {
                //加入业务逻辑
                var newData = detailmodel.getData();
                if (newData == undefined || newData == false)
                    return;

                saveData(newData);

                //if (!callbackforsave) {
                //    gridModel.viewModel.addRow(newData);
                //}
                //else {
                //    callbackforsave(newData);
                //}
                showListDIV();

            });

        });

        //detailmodel.UserIDchanger = ko.dependentObservable(function () {
        //    $.Com.showMsg("OK");
        //});
        //detailmodel.UserNamechanger = ko.dependentObservable(function () {
        //    $.Com.showMsg("OK");
        //});
    };

    // 如果界面设置为选择模式或显示数据！！禁止编辑
    function setUInotEdit(module) {
        if (module.select || module.curData != undefined) {
            root.find("[data-id='add']").hide();
            root.find("[data-id='save']").hide();
            root.find("[data-id='delbtn']").remove();
            if (module.curData != undefined) {
                // 如果界面设置显示数据！！不出现列表

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
        $.fxPost("FX_RYLXInfoSvc.data?action=GetData", content, function (ret) {
            if (ret) {
                data = ret;
                gridModel = $.Com.GridModel({
                    elementsCount: 10
                    , edit: function (item, callback) {
                        showDetailDIV();
                        detailmodel.show(root.find("[data-id='detailDiv']"), item);// 空出模板让用户填写
                        callbackforsave = callback;// 回调
                        curData = item;

                        // 其他操作实现
                    }
                    , removeConfirm: function (row, callback) {
                        $.Com.confirm("确定删除吗？", function () {
                            deleteData(row.ryid());
                            callback();
                        });
                    }
                    , keyColumns: "ryid"// 改
                });

                gridModel.show(root.find("[data-id='listDiv']"), ret.data.sourceList);
                detailmodel.show(root.find("[data-id='detailDiv']"), ret.data.sourceListEdit);// 空出模板让用户填写

            }
        });
    };

    // 保存数据 
    function saveData(rylxData) {
        if (rylxData == null || rylxData == "") return;
        var params = JSON.stringify({ "baseInfo": rylxData });
        $.fxPost('FX_RYLXInfoSvc.data?action=Save', { content: params }, function (ret) {
            if (ret.success) {
                $.Com.showMsg("保存成功！");
                detailmodel.show(root.find("[data-id='detailDiv']"), ret.data.sourceListEdit);
                gridModel.show(root.find("[data-id='listDiv']"), ret.data.sourceList);
                return true;
            } else {
                $.Com.showMsg(ret.msg);
                return false;
            }
        });
    };

    // 删除行数据
    function deleteData(keyId) {
        if (!keyId) return;
        var params = keyId;
        $.fxPost("FX_RYLXInfoSvc.data?action=DeleteData", { content: params }, function (ret) {
            if (ret.success) {
                detailmodel.show(root.find("[data-id='detailDiv']"), ret.data.sourceListEdit);
                return true;
            } else {
                $.Com.showMsg(ret.msg);
                return false;
            }
        });
    };

    // 初始化实体
    function InitialEnt() {
        var content = "";
        $.fxPost("FX_RYLXInfoSvc.data?action=GetData", { content: content }, function (ret) {
            detailmodel.show(root.find("[data-id='detailDiv']"), ret.data.sourceListEdit);
        });
    };

}

$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'YrlxInfoPage' };
    this.show = function (module, root) {
        $.Biz.FX_RYLXInfoPage.show(module, root);
    };

    this.resize = function (s) {
        $.Biz.FX_RYLXInfoPage.resize(s);
    }
});
