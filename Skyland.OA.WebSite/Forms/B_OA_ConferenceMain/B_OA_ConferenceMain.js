
// Author : zhoushining 
// time: 2014
// Created By Stephen Zhou 

////afterSend: function () { },     //  $.Com.showMsg("触发发送完毕事件");  
////beforeBack: function () { },    //  $.Com.showMsg("退件之前事件触发");       
////showRemarkList: true,   //是否显示评阅意见<div iwftype="RemarkList"></div>
////showRemarkBox: true,    //是否出现意见框<div iwftype="RemarkBox"></div>
////showAttachment: true,   //是否出现附件<div iwftype="Attachment"></div>
////showSaveBtn: true,      //是否出现保存按钮
////showBackBtn: true,      //是否出现回退按钮
////showFlowChart: true,    //是否出现流程图
////showActionAndReceiverSelect: true   //是否出现选步骤和人按钮
////getCaseName: function () { return "关于“" + root.find("[data-id='unitname']").val() + "”的信访"; },
////afterSave: function (e, data) { }


$.Biz.B_OA_ConferenceMain = function (root, wfcase) {

    var root;
    var data;
    var models = {};

    this.options = {
        HtmlPath: "Forms/B_OA_ConferenceMain/B_OA_ConferenceMain.html",
        Url: "B_OA_ConferenceMainSvc.data"
    };

    models.baseModel = $.Com.FormModel({
        beforeBind: function (vm, root) {
            // If I wanna get userid I should write the sentence like this: $.iwf.userinfo.userid
            // If I wanna get username I should write the sentence like this : $.iwf.userinfo.username
            // If I wanna get cnName I should write the sentence like this: $.iwf.userinfo.CnName
            vm.sqr($.iwf.userinfo.CnName);
        }
        //数据合法性验证，返回false则不会提交
       , beforeSave: function (vm, root) {
           return true;
       }
    });

    var detailmodel = $.Com.FormModel({});

    //agendaGridModel  
    models.agendaGridModel = $.Com.GridModel({
        beforeBind: function (vm, root) {
            ////自定义增加新数据列
            //$.each(vm.allElements(), function (key, value) {
            //    value.datenum = ko.observable();
            //    if (value.urltest == undefined) value.urltest = ko.computed(function () {
            //        var ttt = value.SourceDate_TEXT();
            //        if (ttt != null && ttt != '')
            //            return "扩展字段演示" + ttt.substr(0,4);
            //        else
            //            return 0;
            //    });
            //});
        }
        , edit: function (item, callback) {
            showDetail(item, callback);
        }
        , keyColumns: "id"//主键字段
        , columns: [
                    { title: "议程开始时间", key: "kssj", width: "10%", content: "<span class=\"btn btn-link\" data-bind=\"text:kssj,click: $root.editRow\"></span>" },
                    { title: "议程结束时间", key: "jssj", width: "10%", content: "<span class=\"btn btn-link\" data-bind=\"text:jssj,click: $root.editRow\"></span>" },
                    { title: "发言人", key: "fyr", width: "10%", content: "<span class=\"btn btn-link\" data-bind=\"text:fyr,click: $root.editRow\"></span>" },
                    { title: "议程内容", key: "ycnr", width: "50%", content: "<span class=\"btn btn-link\" data-bind=\"text:ycnr,click: $root.editRow\"></span>" },
                { title: "操作", key: "action", sortable: false, content: "<span enable_actid='A001' enable_status='hide' class=\"btn\" class=\"btn btn-link\" data-bind='click: $root.removeRow,enable_set:null'><i  class=\"fa fa-times\"></i></span>", width: "10%", enable: "enable_status='hide' enable_actid='A001'" }
        ]
        , filters: {
            //"Source": { type: "select", data: $.Com.getDict('xfly') },
            //"SourcePhone": { placeholder: "按名称模糊查询" },
        }
        , cssClass: " table table-striped table-bordered"
    });

    //显示弹窗
    function showDetail(item, callback) {
        var dlgOpts = { title: '议程-详细', width: window.innerWidth * 0.5, height: window.innerHeight * 0.5 };
        //数据、保存回调、模块、html模板、选项
        var win = $.Com.showFormWin(item, callback, detailmodel, root.find("[data-id='agendaListEdit']"), dlgOpts);
    }

    this.show = function (formdiv, formdata, wftool) {
        if (formdiv) root = formdiv;
        data = formdata;

        //基础表单
        models.baseModel.show(root.find("[data-id='baseInfo']"), formdata.baseInfo);
        models.agendaGridModel.show(root.find('[data-id="agendaList"]'), formdata.agendaList);// 列表显示
        //添加一个对象
        root.find("[data-id='addSource']").click(function () {
            // models.agendaGridModel.viewModel.addRow(formdata.agendaListDetail);
            showDetail(formdata.agendaListDetail, function (data) { models.agendaGridModel.viewModel.addRow(data); });
        });
        // 打印会议室申请表
        root.find("[data-id='printConferenceMain']").click(function () {
            $.post("B_OA_ConferenceMainSvc.data?action=PrintConferenceMainDoc", { caseid: wftool.wfcase.caseid }, function (ret) {
                var data = eval('(' + ret + ')');
                if (!data.success) {
                    $.Com.showMsg(data.msg);
                    return false;
                }

                var path = eval('(' + data.content + ')').wordPath;// 获取服务器端返回的文件路径
                var data = {
                    Logo: "会议室申请表",
                    Title: "会议室申请表",
                    Callback: function (result) { },
                    ToolPrivilege: {
                        Save: false, // 隐藏保存按钮
                        Open: true // 显示保存按钮
                    },
                    HttpParams: { severFilePath: path }
                }
                ShowWordWin(data);
            });
        });

    }

    this.getCacheData = function () {
        data.baseInfo = models.baseModel.getCacheData();
        data.agendaList = models.agendaGridModel.getCacheData();
        return JSON.stringify(data);

    }

    this.getData = function () {
        var d1 = models.baseModel.getData();
        var d2 = models.agendaGridModel.getData();

        if (d1 != false && d2 != false)
            return JSON.stringify({ "baseInfo": d1, "agendaList": d2 });
        else
            return false;
    };

}

$.Biz.B_OA_ConferenceMain.prototype.version = "1.0";