$.Biz.B_OA_Supervision_Delay_Apply = function (root, wfcase) {
    var root;
    var data;
    var models = {};
    var self = this;
    var LeaderSendOut;
    var AssitanSendOut;
    var userName;

    this.options = {
        HtmlPath: "Forms/B_OA_Supervision/B_OA_Supervision_Delay_Apply.html",
        Url: "B_OA_Supervision_Delay_ApplySvc.data"
    }
    this.getCacheData = function () {
        data.delayApplyBaseInfor = models.supervisionDelayApplyBaseInfo.getCacheData();
        return JSON.stringify(data);
    }

    this.getData = function () {
        var d1 = models.supervisionDelayApplyBaseInfo.getData();
        if (d1 && d1 != null)
            return JSON.stringify({ "delayApplyBaseInfor": d1 });
        else
            return false;
    }

    //延期申请单
    models.supervisionDelayApplyBaseInfo = $.Com.FormModel({
        beforeBind: function (vm, root) {
            vm._getSupervisionByCaseId = function () {
                if (vm.relationCaseId() == null || vm.relationCaseId() == "") {
                    $.Com.showMsg("没有相关业务！");
                    return;
                }
                var pcaseid = vm.relationCaseId();
                var params = {};
                params.caseid = pcaseid;
                params.flowid = "W000091";
                params.title = vm.relationTitle() + "-公文督办";
                params.isend = true;
                params.state = "endcase";
                $.Com.Go(pcaseid + ".fx/com/wf/form:" + JSON.stringify(params));
                //$.iwf.getModel("formmodel").opencase({ 'caseid': vm.relationCaseId() });
            }

        }
        , isAppendSign: false
    });

    this.show = function (formdiv, formdata, wftool) {
        if (formdiv) root = formdiv;
        data = formdata;
        var wactid = wftool.wfcase.actid;
        var guid = wftool.wfcase.guid;
        var caseid = wftool.wfcase.caseid;

        if (wftool.wfcase.msgCaseId) {
            var msgCaseId = wftool.wfcase.msgCaseId;
            data.delayApplyBaseInfor.relationCaseId = msgCaseId;
        }

        if (wftool.wfcase.msgTitle) {
            var msgTitle = wftool.wfcase.msgTitle;
            data.delayApplyBaseInfor.relationTitle = msgTitle;
        }

        if (wftool.wfcase.msgTitle) {
            var msgTitle = wftool.wfcase.msgTitle;
            data.delayApplyBaseInfor.title = msgTitle;
        }

        models.supervisionDelayApplyBaseInfo.show(root.find("[data-id='delayApplyModel']"), data.delayApplyBaseInfor);

        //手写签批设置
        GetUserId(function (userId) {
            var options_a = {
                WebUrl: formdata.delayApplyBaseInfor.webUrl,
                FieldName: 'B_OA_Supervision_Delay_Apply/learderApproval',
                RecordID: wftool.wfcase.caseid,
                UserName: userId,
                imageDiv: root.find("[data-id='leaderApprovalImage']"),
                width: "450px",
                height: "200px"
            }
            var sighture_leaderApproval = root.find("[data-id='sighture_leaderApproval']");
            sighture_leaderApproval.SightureContorl(options_a);

            var options_b = {
                WebUrl: formdata.delayApplyBaseInfor.webUrl,
                FieldName: 'B_OA_Supervision_Delay_Apply/assitanLeaderSighture',
                RecordID: wftool.wfcase.caseid,
                UserName: userId,
                imageDiv: root.find("[data-id='assitantApprovalImage']"),
                width: "450px",
                height: "200px"
            }
            var sighture_AssitanLeader = root.find("[data-id='sighture_AssitanLeader']");
            sighture_AssitanLeader.SightureContorl(options_b);
        })

        //读取审核意见和签名
        SetSuggestion(caseid);

        //显示领导批示的手写签批
        root.find("[data-id='showLeaderSighture']").click(function () {
            root.find("[data-id='sighture_leaderApproval']").slideToggle("slow");
        });

        //承办科室负责人签字
        root.find("[data-id='showAssistantSightureClick']").click(function () {
            root.find("[data-id='sighture_AssitanLeader']").slideToggle("slow");
        })
        //保存领导签批
        root.find("[data-id='saveSighture_Leader']").click(function () {
            //保存签名
            saveLeaderSighture();
            //刷新
            SetSuggestion(caseid);
        });

        //保存承办科室主任签名
        root.find("[data-id='saveSighture_Assistant']").click(function () {
            //保存签名
            saveAssistantSighture();
            //刷新
            SetSuggestion(caseid);
        });

        //承办科室负责人签批
        root.find("[data-id='suchAsFitting_Assistant']").click(function () {
            //JS调用代码：
            var mData = "<?xml version='1.0' encoding='utf-8' standalone='yes'?> ";
            mData = mData + "<Text_Data> ";
            mData = mData + "<Line_1> ";
            mData = mData + "<Context>[如拟]</Context> ";
            mData = mData + "<FontName>宋体</FontName>";
            mData = mData + "<FontSize>10</FontSize>";
            mData = mData + "<FontColor>#000000</FontColor> ";
            mData = mData + "<FontBold>True</FontBold >";
            mData = mData + "<TextPos>0,0</TextPos>";
            mData = mData + "<FontCss>";
            mData = mData + "<Font_2>";
            mData = mData + "<Context>[如拟]</Context>";
            mData = mData + "<FontName>宋体</FontName>";
            mData = mData + "<FontSize>12</FontSize>";
            mData = mData + "<FontColor>#000000</FontColor> ";
            mData = mData + "<FontBold>False</FontBold >";
            mData = mData + "</Font_2>";
            mData = mData + "</FontCss>";
            mData = mData + "</Line_1>";
            mData = mData + "</Text_Data>";
            var mResult = AssitanSendOut.RunTextSignature(mData);
            if (mResult == 1) {

            } else if (mResult == -1) {
                $.Com.showMsg("未设置特殊字符串");
            } else if (mResult == -2) {
                $.Com.showMsg("特殊字符串设置错误，必须以“[”开始，“]”结束");
            } else if (mResult == -3) {
                $.Com.showMsg("特殊字符串在总的字符串信息中未找到");
            }
        });

        //打印按钮
        root.find("[data-id='printBtn']").click(function () {
            printDelay(caseid);
        });

        initSetControllersStatus();
        setControlShowStatus(wftool);
    }

    function initSetControllersStatus() {
        //将所有的div内的元素都置为不可用
        root.find("input").attr("disabled", true);
        root.find("textarea").attr("disabled", true);
        root.find("select").attr("disabled", true);
        root.find("button").attr("disabled", true);
        root.find("[data-id='showLeaderSighture']").attr("style", "display:none");
        root.find("[data-id='showAssistantSightureClick']").attr("style", "display:none");
    }

    function setControlShowStatus(wftool) {
        if (wftool.wfcase.actid != "A001") {
            root.find("[data-id='printBtn']").attr("disabled", false);
        }
        if (wftool.wfcase.actid == "A001") {
            root.find("[data-id='title']").attr("disabled", false);
            root.find("[data-id='applyReason']").attr("disabled", false);
            root.find("[data-id='delayDate']").attr("disabled", false);
        } else if (wftool.wfcase.actid == "A002") {
            //局领导签批
            root.find("[data-id='showLeaderSighture']").attr("style", "display:display");
        } else if (wftool.wfcase.actid == "A005") {
            //承办科室负责人签字
            root.find("[data-id='showAssistantSightureClick']").attr("style", "display:display");
        }
    }

    //打印
    function printDelay(caseid) {
        $.fxPost("B_OA_Supervision_Delay_ApplySvc.data?action=Print", { caseid: caseid }, function (res) {
            if (!res.success) {
                $.Com.showMsg(res.msg);
                return;
            }

            var path = res.data; //获取服务器端返回的文件路径
            save = false;
            open = false;
            IsWarnSave = false;

            var data = {
                Logo: "督办事项延期办理申请单",
                Title: "督办事项延期办理申请单",
                IsWarnSave: IsWarnSave, //是否弹出提示保存按钮
                Callback: function (result) { },
                ToolPrivilege: {
                    Save: save, //保存按钮
                    Open: open //显示打开按钮
                },
                HttpParams: { severFilePath: path, saveFilePath: path }

            }
            ShowWordWin(data);

        });
    }


    //取出用户名
    function GetUserId(userId) {
        $.fxPost("/FX_UserInfoSvc.data?action=GetUserId", {}, function (res) {
            if (!res.success) {
                $.Com.showMsg(res.msg);
                return;
            }
            userId(res.data);
        });
    }

    function SetSuggestion(caseId) {
        $.fxPost("B_OA_Supervision_Delay_ApplySvc.data?action=GetWorkFlowCaseByCaseId", { caseid: caseId }, function (ret) {
            if (!ret.success) {
                $.Com.showMsg(ret.msg);
                return;
            }

            var officeSuggestionDic = root.find("[data-id='officeSuggestion']");
            officeSuggestionDic.empty();
            var workFlowList = ret.data.listWorkFlow;
            for (var i = 0 ; i < workFlowList.length; i++) {
                if (workFlowList[i].ActID == 'A004' && workFlowList[i].Remark != null && workFlowList[i].Remark != '') {
                    var officeDic = "<span>" + workFlowList[i].Remark + "</span><br/>";
                    officeSuggestionDic.append(officeDic);
                    var createDate = $.ComFun.DateTimeToChange(workFlowList[i].ReceDate, "yyyy年MM月dd日 hh:mm");
                    var name = "<span  style='float: right;'>" + workFlowList[i].UserName + "&nbsp;" + createDate + "</span><br/>";
                    officeSuggestionDic.append(name);

                }
            }

            var sightureList = ret.data.listSighture;
            var leaderSightureDiv = root.find("[data-id='leaderApprovalImage']");
            leaderSightureDiv.empty();
            var AssitantApprovalImage = root.find("[data-id='assitantApprovalImage']");
            AssitantApprovalImage.empty();
            for (var s = 0; s < sightureList.length; s++) {
                var createDate = $.ComFun.DateTimeToChange(sightureList[s].createtime, "yyyy年MM月dd日 hh:mm");
                if (sightureList[s].columnName == 'learderApproval') {
                    var img = $("<div><img src='../../" + sightureList[s].path + "' /><br><span style='float:right;'>" + sightureList[s].CnName + "&nbsp;" + createDate + "</span></div>");
                    leaderSightureDiv.append(img);
                } else if (sightureList[s].columnName == 'assitanLeaderSighture') {
                    var img = $("<div><img src='../../" + sightureList[s].path + "' /><br><span style='float:right;'>" + sightureList[s].CnName + "&nbsp;" + createDate + "</span></div>");
                    AssitantApprovalImage.append(img);
                }
            }


        });
    }
}



$.Biz.B_OA_Supervision_Delay_Apply.prototype.version = "1.0";