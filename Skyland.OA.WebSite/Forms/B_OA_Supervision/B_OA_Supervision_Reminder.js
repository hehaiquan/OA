$.Biz.B_OA_Supervision_Reminder = function (root, wfcase) {
    var root;
    var data;
    var models = {};
    var self = this;
    var editor;
    this.options = {
        HtmlPath: "Forms/B_OA_Supervision/B_OA_Supervision_Reminder.html",
        Url: "B_OA_Supervision_ReminderSvc.data"
    }

    models.reminderBaseInfor = $.Com.FormModel({
        beforeBind: function (vm, root) {

            vm._getSupervisionByCaseId = function () {
                if (vm.relationCaseId() == null || vm.relationCaseId() == "") {
                    $.Com.showMsg("没有相关业务！");
                    return;
                };
                var pcaseid = vm.relationCaseId();
                var params = {};
                params.caseid = pcaseid;
                params.flowid = "W000091";
                params.title = vm.msgCaseTitle() + "-公文督办";
                params.isend = true;
                params.state = "endcase";
                $.Com.Go(pcaseid + ".fx/com/wf/form:" + JSON.stringify(params));
            }
        }
    });

    //督办通知单
    models.supervisionBill = $.Com.FormModel({
        beforeBind: function (vm, _root) {
        }
    });

    this.getCacheData = function () {
        //读取富文本的内容
        var showData = editor.getData();
        models.supervisionBill.viewModel.content(showData);
        data.reminderBaseInfor = models.reminderBaseInfor.getCacheData();
        data.supervisionBill = models.supervisionBill.getCacheData();
        return JSON.stringify(data);
    }

    this.getData = function () {
        //读取富文本的内容
        var showData = editor.getData();
        models.supervisionBill.viewModel.content(showData);
        var d1 = models.reminderBaseInfor.getData();
        var d2 = models.supervisionBill.getData();

        if (d1 && d1 != null)
        return JSON.stringify({ "reminderBaseInfor": d1, "supervisionBill": d2 });
        else
            return false;
    }

    this.show = function (formdiv, formdata, wftool) {
        if (formdiv) root = formdiv;
        data = formdata;
        var wactid = wftool.wfcase.actid;
        var guid = wftool.wfcase.guid;
        var caseid = wftool.wfcase.caseid;

        var divName = "";
        //加载富文本
        if (caseid == "" || caseid == undefined) {
            divName = guid;
        } else {
            divName = caseid;
        }
        //加载富文本
        var textarea = "<textarea class='form-control' name='supervisionNotice_" + divName + "' rows='20'></textarea>";
        var supervisionNoticeBill = root.find("[data-id='supervisionNoticeBill']");
        supervisionNoticeBill.empty(); //删除被选元素的子元素。
        supervisionNoticeBill.append(textarea);
        editor = CKEDITOR.replace("supervisionNotice_" + divName);
        editor.setData(data.supervisionBill.content);
        //将文本信息加载如div中
        var suprvisionNoticeBillShow = root.find("[data-id='suprvisionNoticeBillShow']");
        suprvisionNoticeBillShow.empty();
        suprvisionNoticeBillShow.append(data.supervisionBill.content);
        models.supervisionBill.show(root.find("[data-id='supervisionNotice']"), data.supervisionBill);


        if (wftool.wfcase.msgCaseId) {
            var msgCaseId = wftool.wfcase.msgCaseId;
            data.reminderBaseInfor.relationCaseId = msgCaseId;
        }

        if (wftool.wfcase.msgTitle) {
            var msgTitle = wftool.wfcase.msgTitle;
            data.reminderBaseInfor.title = msgTitle;
            data.reminderBaseInfor.msgCaseTitle = msgTitle;
        }

        if (wftool.wfcase.msgUndertakeManName) {
            var msgUndertakeManName = wftool.wfcase.msgUndertakeManName;
            var msgUndertakeManId = wftool.wfcase.msgUndertakeManId;
            data.reminderBaseInfor.undertakeManName = msgUndertakeManName;
            data.reminderBaseInfor.undertakeManId = msgUndertakeManId;
        }

        if (wftool.wfcase.msgIssuerManName) {
            var msgIssuerManName = wftool.wfcase.msgIssuerManName;
            var msgIssuerManId = wftool.wfcase.msgIssuerManId;
            data.reminderBaseInfor.issuerManName = msgUndertakeManName;
            data.reminderBaseInfor.issuerManId = msgIssuerManId;
        }

        if (wftool.wfcase.msgUndertake_Department) {
            var msgUndertake_Department = wftool.wfcase.msgUndertake_Department;
            data.reminderBaseInfor.undertake_Department = msgUndertake_Department;
        }


        models.reminderBaseInfor.show(root.find("[data-id='supervisionDetailModel']"), data.reminderBaseInfor);

        //非只读状态设置
        if (wftool.wfcase.toolbarState == "Normal") {
            if (wactid == 'A002') {
                setSendMan(wftool, data.reminderBaseInfor);
            }
        }

        //催办
        root.find("[data-id='remindersBtn']").bind("click", function (value) {
            var keyId;

            //对事件首次生成的处理
            if (wactid == 'A001') {
                keyId = guid;
            } else {
                keyId = caseid;
            }
            GetReminderWindNotice(keyId);
        });

        //保存催办通知单
        root.find("[data-id='saveNotice']").bind("click", function () {
            var showData = editor.getData();
            var suprvisionNoticeBillShow = root.find("[data-id='suprvisionNoticeBillShow']");
            suprvisionNoticeBillShow.empty(); //删除被选元素的子元素。
            suprvisionNoticeBillShow.append(showData);
            models.supervisionBill.viewModel.content(showData);
            root.find("[data-id='supervisionNoticeBill']").attr("style", "display:none");
            root.find("[data-id='suprvisionNoticeBillShow']").attr("style", "display:display");
            root.find("[data-id='saveNotice']").attr("style", "display:none");
            root.find("[data-id='editNotice']").attr("style", "display:display");
        });

        //编辑催办通知单
        root.find("[data-id='editNotice']").bind("click", function () {
            root.find("[data-id='supervisionNoticeBill']").attr("style", "display:display");
            root.find("[data-id='suprvisionNoticeBillShow']").attr("style", "display:none");
            root.find("[data-id='saveNotice']").attr("style", "display:display");
            root.find("[data-id='editNotice']").attr("style", "display:none");
        });


        initSetControllersStatus();
        setControlShowStatus_Circulation(wftool);
    }

    function initSetControllersStatus() {
        //将所有的div内的元素都置为不可用
        root.find("input").attr("disabled", true);
        root.find("textarea").attr("disabled", true);
        root.find("select").attr("disabled", true);
        root.find("button").attr("disabled", true);
        //编辑督办通知单按钮
        root.find("[data-id='editNotice']").attr("style", "display:none");
        //浏览按钮
        root.find("[data-id='saveNotice']").attr("style", "display:none");
        //催办通知单富文本
        root.find("[data-id='supervisionNoticeBill']").attr("style", "display:none");
    };

    function setControlShowStatus_Circulation(wftool) {
        //拟文
        if (wftool.wfcase.actid == "A001") {
            //督办通知书浏览按钮
            root.find("[data-id='saveNotice']").attr("disabled", false);
            //督办通知书浏览按钮
            root.find("[data-id='editNotice']").attr("disabled", false);
            //督办通知书浏览按钮
            root.find("[data-id='saveNotice']").attr("style", "display:display");
            //编辑督办通知单按钮
            root.find("[data-id='editNotice']").attr("style", "display:none");
            //浏览督办通知单
            root.find("[data-id='supervisionNoticeBill']").attr("style", "display:display");
            root.find("[data-id='suprvisionNoticeBillShow']").attr("style", "display:none");
            root.find("button").attr("disabled", false);
            root.find("input").attr("disabled", false);
            root.find("textarea").attr("disabled", false);
            root.find("select").attr("disabled", false);
            //承办科室
            root.find("[data-id='undertakeManName']").attr("disabled", true);
            //承办部门
            root.find("[data-id='undertake_Department']").attr("disabled", true);
            //催办编号
            root.find("[data-id='code']").attr("disabled", true);
            //签发人
            root.find("[data-id='issuerManName']").attr("disabled", true);            
        }
    }

    function setSendMan(wftool, supervisionBaseInfo) {
        var sendArray = [];
        //协办人数组
        if (supervisionBaseInfo.reminderManId != null && supervisionBaseInfo.reminderManId != "") {
            var assistantManIdArray = supervisionBaseInfo.reminderManId.split(';');
            for (var i = 0 ; i < assistantManIdArray.length - 1; i++) {
                if (sendArray.toString().indexOf(assistantManIdArray[i]) == -1) {
                    sendArray.push(assistantManIdArray[i]);
                }
            }

            wftool.SetReceivers(sendArray);//设置接收人为
        }
    }


    function SaveSupervisionReminderNotice(reminderNotice) {
        var json = JSON.stringify(reminderNotice);
        $.fxPost("/B_OA_Supervision_ReminderSvc.data?action=SaveSupervisionReminderNotice", { content: json }, function (res) {
            if (!res.success) {
                $.Com.showMsg(res.msg);
                return;
            }
        });
    }

    function showReminderWind(reminderNoticeBaseInfor) {
        models.showReminderModel = $.Com.FormModel({});
        var win;
        var dlgOpts = {
            title: '催办通知单',
            width: 600,
            height: 800,
            button: [
                {
                    text: '保存',
                    handler: function () {
                        var reminderNotice = models.showReminderModel.getData();
                        SaveSupervisionReminderNotice(reminderNotice);
                        win.close();
                    }
                }, {
                    text: '取消',
                    handler: function () {
                        win.close();
                    }
                }
            ]
        };

        win = $.Com.showFormWin(reminderNoticeBaseInfor, function () {
        }, models.showReminderModel, root.find("[data-id='supervisionNoticeReminderWind']"), dlgOpts);

    }
}

$.Biz.B_OA_Supervision_Reminder.prototype.version = "1.0";