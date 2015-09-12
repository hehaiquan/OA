
////afterSend: function () { },     //alert("触发发送完毕事件");  
////beforeBack: function () { },    //alert("退件之前事件触发");       
////showRemarkList: true,   //是否显示评阅意见<div iwftype="RemarkList"></div>
////showRemarkBox: true,    //是否出现意见框<div iwftype="RemarkBox"></div>
////showAttachment: true,   //是否出现附件<div iwftype="Attachment"></div>
////showSaveBtn: true,      //是否出现保存按钮
////showBackBtn: true,      //是否出现回退按钮
////showFlowChart: true,    //是否出现流程图
////showActionAndReceiverSelect: true   //是否出现选步骤和人按钮
////getCaseName: function () { return "关于“" + root.find("[data-id='unitname']").val() + "”的信访"; },
////afterSave: function (e, data) { }



$.Biz.B_Complaint = function () {

    var root;
    var wftool;
    var data;
    var models = {};
    var self = this;

    this.options = {
        HtmlPath: "Forms/B_Complaint/B_Complaint.html",
        Url: "B_ComplaintSvc.data",
        //saveData: function (obj) { return self.getData(); }
    };

    //beforeBind,beforeSave,afterBind 参数都是 vm、root
    models.basemodel = $.Com.FormModel({
        beforeBind: function (vm, root) {
            ////代码创建的属性用‘_’开头；避免作为变量变成实体
            //vm._unitSel = function () {
            //    $.Biz.unitseleWin(function (data) {
            //        if (data != null) {
            //            vm.UnitId(data.PK);
            //            vm.UnitName(data.UnitName);
            //            vm.UnitAdd(data.UnitAdd);
            //        }
            //    });
            //};
            vm.unitselect = function () {
                $.Biz.unitselectWin(function (data) {
                    if (data != null) {
                        //vm.id(data.id);
                        vm.UnitName(data.qymc);
                        vm.UnitAdd(data.qydz);
                    }
                });
            }
        }
        //数据合法性验证，返回false则不会提交
       , beforeSave: function (vm, root) {
           var unitName = vm.UnitName();
           if (unitName == null || $.trim(unitName) == "") {
               // alert("单位名称不能为空！");
               root.find("[data-id='unitname']").testRemind("单位名称不能为空!");
               return false;
           }
           return true;
       }
    });

    var detailmodel = $.Com.FormModel({});

    models.gridmode = $.Com.GridModel({
        beforeBind: function (vm, root) {

            //自定义增加新数据列
            $.each(vm.allElements(), function (key, value) {
                value.datenum = ko.observable();
                if (value.urltest == undefined) value.urltest = ko.computed(function () {
                    var ttt = value.SourceDate_TEXT();
                    if (ttt != null && ttt != '')
                        return "扩展字段演示" + ttt.substr(0,4);
                    else
                        return 0;
                });
            });
        }
        , edit: function (item, callback) {
            showDetail(item, callback);
        }, keyColumns: "PK"//主键字段
            , columns: [
                //{ title: "Email", key: "email", data_bind: "text: email", width: "20%", sortable: true }, title默认为key，data_bind默认为key，sortable默认为true
                { title: "#", key: "number", width: "10%" },
                { title: "来源", key: "Source", width: "20%", content: "<span class=\"btn btn-link\" data-bind=\"text: $.Com.getDict('xfly')[ Source()],click: $root.editRow\"></span>" },
                { title: "来源编号", key: "SourceNo", width: "20%" },
                { title: "来源电话", key: "SourcePhone", width: "20%" },
                { title: "来源时间", key: "SourceDate", content: "<span data-bind=\" text:SourceDate_TEXT\"></span>", width: "20%" },//formatDate(SourceDate())
                { title: "来源时间", key: "SourceDate", content: "<span data-bind=\" text:datenum\"></span>", width: "20%" },//formatDate(SourceDate())
                { title: "操作", key: "action", sortable: false, content: "<span enable_actid='A001' enable_status='hide' class=\"btn\" class=\"btn btn-link\" data-bind='click: $root.removeRow,enable_set:null'><i  class=\"fa fa-times\"></i></span>", width: "10%", enable: "enable_status='hide' enable_actid='A001'" }
            ]
            , filters: {
                "Source": { type: "select", data: $.Com.getDict('xfly') },
                "SourcePhone": { placeholder: "按名称模糊查询" },
            }
            , cssClass: " table table-striped table-bordered"
    });


    //显示弹窗
    function showDetail(item, callback) {
        var dlgOpts = { title: '信访来源-详细', width: 600, height: 300 };
        //数据、保存回调、模块、html模板、选项
        var win = $.Com.showFormWin(item, callback, detailmodel, root.find("[data-id='sourceListEdit2']"), dlgOpts);
    }

    this.show = function (formdiv, formdata,toolbj) {
        wftool = toolbj;
        if (formdiv) root = formdiv;
        data = formdata;

        models.basemodel.show(root.find("[data-id='baseInfo']"), formdata.baseInfo);
        models.gridmode.show(root.find("[data-id='sourceList2']"), formdata.sourceList);

        root.find("[data-id='addSource']").click(function () {
            showDetail(formdata.sourceListEdit, function (data) { models.gridmode.viewModel.addRow(data); });
        });
    }


    this.getCacheData = function ()
    {
        data.baseInfo = models.basemodel.getCacheData();
        data.sourceList = models.gridmode.getCacheData();
        return JSON.stringify(data);
    }

    this.getData = function () {
        var d1 = models.basemodel.getData();
        var d2 = models.gridmode.getData();
       
        if (d1 != false && d2 != false)
            return JSON.stringify( { "baseInfo": d1, sourceList: d2 });
        else
            return false;
    };
}

$.Biz.B_Complaint.prototype.version = "1.0";


