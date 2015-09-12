$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'hjfxy' };
    this.show = function (module, root) {
        $.Biz.P_Risk_BaseInfo.show(module, root);
    };

    this.resize = function (s) {
        $.Biz.P_Risk_BaseInfo.resize(s);
    }
});

$.Biz.P_Risk_BaseInfo = new function () {
    var root;
    var dataS;
    var detailmodel = $.Com.FormModel({});
    var constwidth = 992;
    var callbackforsave;// 回调
    var curData;
    var gridModel= $.Com.GridModel({
        elementsCount: 10
                    , edit: function (item, callback) {
                        showDetailDIV();
                        detailmodel.show(root.find("[data-id='detailDiv']"), item);// 空出模板让用户填写
                        callbackforsave = callback;// 回调
                        curData = item;

                        // 其他操作实现
                    } 
                    , 
                    removeConfirm: function (row, callback) {
                        $.Com.confirm("确定删除吗？",function () {
                            deleteData(row.id());
                            callback();
                        });
                    }
                    , keyColumns: "id"
    });


    this.show = function (module, _root) {
        root = _root;
        root.css("position", "relative");
        if (root.children().length != 0) return;

        root.load("models/DataBaseModel/P_Risk_BaseInfo.html", function () {
            setUInotEdit(module);
            loadData();
            root.find("[data-id='add']").bind("click", function () {
                // 实例化实体
                //InitialEnt();
                detailmodel.show(root.find("[data-id='detailDiv']"), dataS.editData);// 空出模板让用户填写
                showDetailDIV();
            });

            root.find("[data-id='back']").bind("click", function () { showListDIV(); });

            root.find("[data-id='save']").bind("click", function () {
                //加入业务逻辑
                var data = detailmodel.getData();
                if (data == undefined) return;
                saveData(data);
      
               // clearEnt();
                
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
        $.fxPost("P_Risk_BaseInfoSvc.data?action=GetData", content, function (ret) {
            if (ret) {
                dataS = ret.data;
                gridModel.show(root.find("[data-id='listDiv']"), dataS.dataList);
                detailmodel.show(root.find("[data-id='detailDiv']"), dataS.editData);// 清理数据
            }
        });
    };

    // 保存数据 
    function saveData(rylxData) {
        if (rylxData == null || rylxData == "") return;
        var params = JSON.stringify(rylxData );
        $.fxPost('P_Risk_BaseInfoSvc.data?action=Save', { content: params }, function (ret) {
            if (ret.success) {
                $.Com.showMsg("保存成功");
                gridModel.show(root.find("[data-id='listDiv']"), ret.data.dataList);
                detailmodel.show(root.find("[data-id='detailDiv']"), ret.data.editData);// 清理数据
                //if (rylxData.id == 0) {
                //    gridModel.viewModel.addRow(rylxData);
                //}
                //else {
                //    callbackforsave(rylxData);
                //}
                return true;
            } else {
                $.Com.showMsg(data.msg);
                return false;
            }
        });
    };

    // 删除行数据
    function deleteData(keyId) {
        if (!keyId) return;
        $.fxPost("P_Risk_BaseInfoSvc.data?action=DeleteData", { id: keyId }, function (ret) {
            if (ret.success) {
                $.Com.showMsg(ret.msg);
                detailmodel.show(root.find("[data-id='detailDiv']"), ret.data.editData);// 空出模板让用户填写
                return true;
            } else {
                $.Com.showMsg(ret.msg);
                return false;
            }
        });
    };


}


