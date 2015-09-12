// afterSend: function(){}, // alert("触发发送完毕事件");
// beforeBack: function(){}, // alert("退件之前事件触发");
// showRemarkList: true, // 是否显示评阅意见
// showRemarkBox: true, // 是否出现意见框
// showAttachment: true, // 是否出现附件
// showSaveBtn: true, // 是否出现保存按钮
// showBackBtn: true, // 是否出现回退按钮
// showFlowChart: true, // 是否出现流程图
// showActionAndReceiverSelect: true, // 是否出现选步骤和人按钮
// getCaseName: function(){return "关于“" + root.find("[data-id='unitname']").val() + "”的信访"; }
// afterSave: function (e, data) { }


$.Biz.B_ComplaintTest = function (wftool) {
    var currentroot;
    var currentdata;
    var models = {};

    this.options = {
        HtmlPath: "Forms/B_ComplaintTest/B_ComplaintTest.html",
        Url: "B_ComplaintTestSvc.data"
    };

    models.basemodel = $.Com.FormModel({
        beforeBind: function (vm, root) {
            // 代码创建的属性用'_'开头， 以免作为变量变成实体
            vm._unitSel = function () {
                $.Biz.unitseleWin(function (data) {
                    if (data != null) {
                       
                        vm.UnitId(data.PK);
                        vm.UnitName(data.UnitName);
                        vm.UnitAdd(data.UnitAdd);
                    }
                });
            }
        }
        // 数据合法性验证，返回false则不会提交
        , beforeSave: function (vm, root) {
            var unitName = vm.UnitName();
            if (unitName == null || unitName == "") {
                // alert('单位不能为空！');
                root.find("[data-id='unitname']").testRemind("单位不能为空！");
                return false;
            }
            return true;
        }
    });

    var detailmodel = $.Com.FormModel({});

    models.gridmodel = $.Com.GridModel({
        beforeBind: function (vm, root) {

        }
        , edit: function (item, callback) {
            showDetail(item, callback);
        }
        , keyColumns: "PK" // 主键
        , columns: [
                    { title: '#', key: 'number', width: '10%' },
                    { title: '来源', key: 'Source', width: '20%', content: "<span class=\"btn btn-link\" data-bind=\"text: $.Com.getDict('xfly')[Source()], click: $root.editRow\"></span>" },
                    { title: '来源编号', key: 'SourceNo', width: '20%' },
                    { title: '来源电话', key: 'SourcePhone', width: '20%' },
                    { title: '来源时间', key: 'SourceDate', width: '20%', content: "<span data-bind=\"text:SourceDate_TEXT\"></span>" },
                    { title: '操作', key: '', width: '20%', content: "<span emable_actid='A001' enable_status='hide' class=\"btn\" class=\"btn btn-link\" data-bind='click: $root.removeRow, enable_set: null'><i class=\"fa fa-times\"></i></span>", enable: "enable_status='hide' enable_actid='A001'" }

        ]
            , filters: {
                "Source": { type: "select", data: $.Com.getDict('xfly') },
                "SourcePhone": { placeholder: "按名称模糊查询" }
            }
            , cssClass: "table table-striped table-bordered"
    });

    // 显示弹窗
    function showDetail(item, callback) {
        var dlgOpts = { title: "信访来源-详细", width: 600, height: 300 };
        // 数据、保存回调、模块、html模板、选项
        var win = $.Com.showFormWin(item, callback, detailmodel, currentroot.find("[data-id='sourceListEdit2']"), dlgOpts);
    }

    this.show = function (formdiv, formdata) {
        if (formdiv) currentroot = formdiv;
        data = formdata;
        
        //// tab设置
        //var tal = root.find("[data-id='talDiv']");
        //tal.iwfTab({ tabchange: function (dom) { } });

        models.basemodel.show(root.find("[data-id='baseInfo']"), formdata.baseInfo);// 显示baseInfo数据
        models.gridmodel.show(root.find("[data-id='sourceList2']"), formdata.sourceList);// 显示sourceList2数据

        currentroot.find("[data-id='addSource']").click(function () {
            showDetail(formdata.sourceListEdit, function (data) {
                models.gridmodel.viewModel.addRow(data);
            });
        });
    }

    this.cacheData = data;

    this.getData = function () {
        var d1 = models.basemodel.getData();
        var d2 = models.gridmodel.getData();
        if (d1 && d2 && d1 != false && d2 != false)
            return JSON.stringify({ "baseInfo": d1, sourceList: d2 });
        else
            return false;
    }
}

$.Biz.B_ComplaintTest.prototype.version = "1.0";



























/*
$.Biz.B_ComplaintTest = function (root, wfcase) {
    var wftool = null;
    var _koPage = null;
    root.load("Forms/B_ComplaintTest/B_ComplaintTest.html", function () {
        // initial the workflow controller
        var wftoolOpts = {
            wfcase: wfcase,
            Url: "B_ComplaintTestSvc.data",
            saveData: function (obj) { return _koPage.getPageData(); },
            getClassName: function () { return "关于“" + root.find("[data-id='unitname']").val() + "”的信访"; },
            // 保存后重新初始化页面
            afterSave: function (e, data) {
                if (data.success) {
                    var content = JSON.parse(data.content);
                    if (content.success) {
                        _koPage.reload(content.data);
                    }
                    else {
                        alert(content.msg);
                    }
                }
            },
            // koPage页面初始化
            afterInit: function () {
                var options = {
                    forms: {
                        "baseInfo": new baseInfo(), "sourceList": new sourceGrid(), "sourceListEdit": new sourceDetail()
                    },
                    dataProxy: {
                        url: "B_ComplaintTest.data?action=GetData" // 获取数据
                    }
                };
                _koPage = new koPage(options);
                _koPage.init(wfcase);// .convertToReadonly(); // 不自动初始化
            },
            afterSend: function () { },// 发送完毕后事件
            beforeBack: function () { },// 退送之前事件触发
            showRemarkList: true,// 是否显示评阅意见
            showRemarkBox: true,// 是否出现意见框
            showAttachment: true,// 是否出现附件
            showSaveBtn: true,// 是否出现保存按钮
            showFlowChart: true,// 是否出现回退按钮
            showActionAndReceiverSelect: true // 是否出现选步骤和人按钮

        };
        //alert(root.find("[data-id='unitname']").val());
        // 工作流控件加载完毕后触发的事件
        // wftoolOpts
        // 自动初始化工作流
        wftool = root.find("[data-id='toolbar']").WFToolBar(wftoolOpts);
    });

    // 基础表单
    function baseInfo() {
        var opts = {
            // 绑定前触发，在这里可以做绑定前的处理
            beforeBind: function (vm, member, root) {
                vm.unitSel = function () {
                    $.Biz.unitselect(function (data) {
                        if (data != null) {
                            vm.UnitId(data.PK);
                            vm.UnitName(data.UnitName);
                            vm.UnitAdd(data.UnitAdd);
                        }
                    });
                }
            }
            // 数据合法性验证，返回false则为不合法，不会提交
            , checkData: function (vm) {
                var unitName = vm.UnitName();
                if (unitName == null || $.trim(unitName) == "") {
                    return false;
                }
                return true;
            }
        };

        return root.find("[data-id='baseInfo']").koForm(opts);
    };

    function sourceGrid() {
        var opts = {
            beforeBind: function () { }
            , keyColumns: "PK"
            , columns: [
                { title: '#', key: 'number', width: '10%' },
                { title: '来源', key: 'Source', width: '20%', content: "<span class=\"btn btn-link\" data-bind=\"text: $.Com.getDict('xfly')[Source()], click: $root.editRow\"></span>" },
                { title: '来源编号', key: 'SourceNo', width: '20%' },
                { title: '来源电话', key: 'SourcePhone', width: '20%' },
                { title: '来源时间', key: 'SourceDate', width: '20%', content: "<span data-bind=\"text:SourceDate_TEXT\"></span>" },
                { title: '操作', key: '', width: '20%', content: "<span emable_actid='A001' enable_status='hide' class=\"btn\" class=\"btn btn-link\" data-bind='click: $root.removeRow, enable_set: null'><i class=\"fa fa-times\"></i></span>", enable: "enable_status='hide' enable_actid='A001'" }

            ]
            , filters: {
                "Source": { type: "select", data: $.Com.getDict('xfly') },
                "SourcePhone": { placeholder: "按名称模糊查询" }
            }
            , cssClass: ""
        };

        function showDetail(item, callback) {
            var frmDetail = _koPage.forms.sourceListEdit;
            if (item == null) item = frmDetail.getItemTpl();
            var win;
            var dlgOpts = {
                title: '信访来源-详细', width: 600, height: 300,
                button: [{
                    text: '确定', handler: function () {
                        var data = frmDetail.getSaveData();//
                        callback(data);
                        win.close();
                    }
                }]
            };
            if (!$.Com.checkFlowPrivilege('A001', null, wfcase.flowid, wfcase.actid))
                dlgOpts.button = null;
            win = $.Com.showSubformWin(frmDetail, dlgOpts);
            frmDetail.reBind(item);
        }

        opts.edit = function (item, callback) {
            showDetail(item, callback);
        };

        var myGrid = root.find("[data-id='sourceList2']").KOGrid(opts);
        root.find("[data-id='addSource']").click(function () {
            showDetail(null, function (data) { myGrid.viewModel.addRow(data); });
        });

        return myGrid;
    };

    // 编辑子表单
    function sourceDetail() {
        var opts = {
            isSaveData: false,
            checkData: function (vm) {
                var source = vm.Source();
                if (source == null || $.trim() == "") {
                    alert("信访来源不能为空！");
                    return false;
                }
                return true;
            }
        };
        var myform = root.find("[data-id='sourceListEdit2']").koForm(opts);
        return myform;
    }
}
*/