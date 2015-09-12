
$.Biz.B_OA_SendDoc_Science = function (root, wfcase) {
    var root;
    var data;
    var models = {};
    var CheckManSendOut;
    this.options = {
        HtmlPath: "Forms/B_OA_SendDoc/B_OA_SendDoc_Science.html",
        Url: "B_OA_SendDoc_ScienceSvc.data"
    }

    //基本信息模
    models.sendDocBaseInfo = $.Com.FormModel({
        beforeBind: function (vm, root) {
            vm._gotobasecase = function () {
                if (!vm.sendBaseCaseId()) {
                    $.Com.showMsg("没有相关业务！");
                    return;
                }
                var pcaseid = vm.sendBaseCaseId();
                var params = {};
                params.caseid = pcaseid;
                params.baid = vm.triggerBAID();
                params.flowid = "W000072";
                params.title = vm.sendBasisTitle() + "-环评业务";
                //params.isend = true;
                //params.userid = parent.$.iwf.userinfo.userid;
                params.actid = vm.triggerActId();
                params.guid = null;
                params.state = "doingcase";
                $.Com.Go(pcaseid + ".fx/com/wf/form:" + JSON.stringify(params));
                //$.iwf.getModel("formmodel").opencase({ 'caseid': vm.sendBaseCaseId() });
            };
        }
    });

    this.show = function (formdiv, formdata, wftool) {
        if (formdiv) root = formdiv;
        data = formdata;

        //业务关联
        models.sendRelation = { caseId: "", actId: "", filePath: "", wId: "", triggerActId: "", relationCaseId: "" };

        var caseid = wftool.wfcase.caseid;
        var wactid = wftool.wfcase.actid;
        if (wftool.wfcase.msgCaseId) {
            //关联业务ID
            models.sendRelation.relationCaseId = wftool.wfcase.msgCaseId;
            //关联业务的步骤ID
            models.sendRelation.actId = wftool.wfcase.msgActid;
            //文档路径
            models.sendRelation.filePath = wftool.wfcase.baseDocPath;
            //业务流程ID
            models.sendRelation.wId = wftool.wfcase.msgFlowid;
            //回调步骤ID
            models.sendRelation.triggerActId = wftool.wfcase.triggerActId;
            //发文依据业务ID
            data.sendDocBaseInfo.sendBaseCaseId = wftool.wfcase.msgCaseId;
            //发文依据的baid
            data.sendDocBaseInfo.triggerBAID = wftool.wfcase.msgBaId;
            //发文依据的actid
            data.sendDocBaseInfo.triggerActId = wftool.wfcase.triggerActId;
        }

        if (wftool.wfcase.sendBasisTitle)
            data.sendDocBaseInfo.sendBasisTitle = wftool.wfcase.sendBasisTitle + "-环评业务";

        //正文路径赋值
        if (wftool.wfcase.baseDocPath)
            data.sendDocBaseInfo.baseDocPath = wftool.wfcase.baseDocPath;

        models.sendDocBaseInfo.show(root.find("[data-id='sendDocBaseInfo']"), data.sendDocBaseInfo);

        root.find("[data-id='printSendDoc']").click(function () {
            printSendDoc(wftool);
        });

        root.find("[data-id='mainBody']").click(function () {
            var path = data.sendDocBaseInfo.baseDocPath; //获取服务器端返回的文件路径
            var open = false;
            var save = false;
            var IsWarnSave = save;

            var wdata = {
                Logo: "发文内容",
                Title: "发文内容",
                IsWarnSave: IsWarnSave,//是否弹出提示保存按钮
                Callback: function (result) { },
                ToolPrivilege: {
                    Save: save,//保存按钮
                    Open: open//显示打开按钮
                },
                HttpParams: { severFilePath: path, saveFilePath: path }
            };
            ShowWordWin(wdata);
        });

        if (wactid != "A001") {
            setCheckSuggetion(wftool.wfcase.caseid,data.sendDocBaseInfo);
        }
    }

    function printSendDoc(wftool) {
        $.fxPost("B_OA_SendDoc_ScienceSvc.data?action=PrintSendDoc", { caseid: wftool.wfcase.caseid }, function (ret) {

            if (!ret.success) {
                $.Com.showMsg(ret.msg);
                return false;
            }
            var path = ret.data;// 获取服务器端返回的文件路径
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

    function setCheckSuggetion(caseId, sendDocBaseInfo) {
        $.fxPost("CommonFunctionSvc.data?action=GetWorkFlowCaseByCaseId", { caseid: caseId }, function (ret) {
            var listWork = ret.listWork;
            var dir = ret.dir;
            var listArray = [];
            var hgr = root.find("[data-id='hgr']");
            var ngr = root.find("[data-id='ngr']");
            var qf = root.find("[data-id='qf']");
            //拟稿人
            var ngrDiv = "<div style='color:black'>" + sendDocBaseInfo.createManName + "</div>&nbsp;";
            ngr.append(ngrDiv);

            //将审批意见格式化后送入相应的表格字段中
            listArray = $.ComFun.ChangeListToMatch(listWork, dir);
            for (var j = 0 ; j < listArray.length; j++) {
                //审批意见
                if (listArray[j].actID == 'A002') {
                    //局办公室负责任审核
                    $.ComFun.AppendDataToDiv(hgr, listArray[j]);
                } else if (listArray[j].actID == 'A003') {
                    //分局领导意见
                    $.ComFun.AppendDataToDiv(qf, listArray[j]);
                }
            }
        });
    }

    this.getCacheData = function () {
        data.sendDocBaseInfo = models.sendDocBaseInfo.getCacheData();
        data.sendRelation = models.sendRelation;
        return JSON.stringify(data);
    };
    this.cacheData = data;
    this.getData = function () {
        var sendDocBaseInfo = models.sendDocBaseInfo.getData();
        var sendRelation = models.sendRelation;
        if (sendDocBaseInfo != false)
            return JSON.stringify({
                "sendDocBaseInfo": sendDocBaseInfo,
                "sendRelation": sendRelation
            });
        else
            return false;
    };
}


$.Biz.B_OA_SendDoc_Science.prototype.version = "1.0";
