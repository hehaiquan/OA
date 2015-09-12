$.Biz.B_OA_SendDoc_Inner_QuZhan = function () {
    var self = this;
    var root;
    var models = {};

    models.sendDocBaseInfo = $.Com.FormModel({
        beforeBind: function (vm, root) {
        }
    });

    this.getCacheData = function () {
        data.sendDocBaseInfo = models.sendDocBaseInfo.getCacheData();
        return JSON.stringify(data);
    }

    this.getData = function () {
        var d1 = models.sendDocBaseInfo.getData();
        if (d1 && d1 != null)
            return JSON.stringify({ "sendDocBaseInfo": d1 });
        else
            return false;
    }

    this.options = {
        HtmlPath: "nnepb/oa/SendDoc/B_OA_SendDoc_Inner_QuZhan.html",
        Url: "B_OA_SendDoc_Inner_QuZhanSvc.data"
    };

    this.show = function (formdiv, formdata, wftool) {
        if (formdiv) root = formdiv;
        var data = formdata;
        var caseid = wftool.wfcase.caseid;
        var wactid = wftool.wfcase.actid;


        //打印处理笺
        root.find("[data-id='printSendDoc']").bind("click", function (value) {
            printDoc(caseid);
        });

        models.sendDocBaseInfo.show(root.find("[data-id='baseInfo']"), data.sendDocBaseInfo);

        if (wactid != "A001") {
            setCheckSuggetion(wftool.wfcase.caseid);
        }
    }

    function printDoc(caseid) {
        $.fxPost("B_OA_SendDoc_Inner_QuZhanSvc.data?action=PrintDoc", { caseid: caseid }, function (ret) {
            var path = ret.targetpath;// 获取服务器端返回的文件路径
            var data = {
                Logo: "打印发文",
                Title: "打印发文",
                Callback: function (result) { },
                ToolPrivilege: {
                    Save: false, // 隐藏保存按钮
                    Open: true // 显示保存按钮
                },
                HttpParams: { severFilePath: path }
                //IsWarnSave: true//是否弹出提示保存按钮
            }
            ShowWordWin(data);
        });
    }

    function setCheckSuggetion(caseid) {
        $.fxPost("CommonFunctionSvc.data?action=GetWorkFlowCaseByCaseId", { caseid: caseid }, function(ret) {
            var listWork = ret.listWork;
            var dir = ret.dir;
            var listArray = [];
            //承办科室负责人意见div
            var cbksfzryj = root.find("[data-id='cbksfzryj']");
            //会办单位意见
            var hbdwyj = root.find("[data-id='hbdwyj']");
            //站领导批示
            var zldps = root.find("[data-id='zldps']");
            
            //将审批意见格式化后送入相应的表格字段中
            listArray = $.ComFun.ChangeListToMatch(listWork, dir);
            for (var j = 0; j < listArray.length; j++) {
                //审批意见
                if (listArray[j].actID == 'A002') {
                    $.ComFun.AppendDataToDiv(cbksfzryj, listArray[j]);
                }else if (listArray[j].actID == 'A003') {
                    $.ComFun.AppendDataToDiv(hbdwyj, listArray[j]);
                } else if (listArray[j].actID == 'A004') {
                    $.ComFun.AppendDataToDiv(zldps, listArray[j]);
                }
            }
        });
    }
}