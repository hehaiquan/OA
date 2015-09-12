$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'DICT_ElementsValueType' };
    this.show = function (module, root) {
        $.Biz.DICT_ElementsValueType.show(module, root);
    };

    this.resize = function (s) {
        $.Biz.DICT_ElementsValueType.resize(s);
    }
});

$.Biz.DICT_ElementsValueType = new function () {
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
                    , remove: function (row) {// 删除功能实现
                        $.Com.confirm("确定删除吗？", function () {
                            deleteData(row.EVT_ID());
                        })
                    }
                    , keyColumns: "EVT_ID"
    });


    this.show = function (module, _root) {
        root = _root;
        root.css("position", "relative");
        if (root.children().length != 0) return;

        root.load("models/DictModel/DICT_ElementsValueType.html", function () {
            setUInotEdit(module);
            loadData();
            root.find("[data-id='add']").bind("click", function () {
                detailmodel.show(root.find("[data-id='detailDiv']"), dataS.baseInfo);// 空出模板让用户填写
                showDetailDIV();
            });

            root.find("[data-id='back']").bind("click", function () { showListDIV(); });

            root.find("[data-id='save']").bind("click", function () {
                //加入业务逻辑
                var data = detailmodel.getData();
                if (data == undefined) return;
                var msg = "";
                if (data.EVTType == null || $.trim(data.EVTType) == "") msg += "\n字典类型！"
                if (data.EVTName == null || $.trim(data.EVTName) == "") msg += "\n元素值域名称！"
                if (data.EVTCode == null || $.trim(data.EVTCode) == "") msg += "\n元素值域标识！"

                if (msg != "") { $.Com.showMsg(msg); return; }
                saveData(data);
                
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
        $.fxPost("DICT_ElementsValueTypeSvc.data?action=GetData", {iDictType:"0"}, function (ret) {
            if (ret) {
                dataS = ret.data;
                gridModel.show(root.find("[data-id='listDiv']"), dataS.dataList);
                detailmodel.show(root.find("[data-id='detailDiv']"), dataS.baseInfo);// 空出模板让用户填写
            }
        });
    };

    // 保存数据 
    function saveData(rylxData) {
        if (rylxData == null || rylxData == "") return;
        var params = JSON.stringify(rylxData );
        $.fxPost('DICT_ElementsValueTypeSvc.data?action=Save', { JsonData: params }, function (data) {
            if (data.success) {
                $.Com.showMsg(data.msg);
                if (rylxData.id==0) {
                    gridModel.viewModel.addRow(rylxData);
                }
                else {
                    callbackforsave(rylxData);
                }
                
                showListDIV();
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
        $.fxPost("DICT_ElementsValueTypeSvc.data?action=DeleteData", { id: keyId }, function (res) {
            if (res.success) {
                detailmodel.show(root.find("[data-id='detailDiv']"), dataS.baseInfo);// 空出模板让用户填写
                return true;
            } else {
                $.Com.showMsg(res.msg);
                return false;
            }
        });
    };
}


