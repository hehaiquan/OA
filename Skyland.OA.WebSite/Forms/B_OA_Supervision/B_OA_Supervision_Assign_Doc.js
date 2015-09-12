$.Biz.B_OA_Supervision_Assign_Doc = function (root, wfcase) {
    var root;
    var data;
    var models = {};
    var self = this;
    var editor; //富文本

    this.options = {
        HtmlPath: "Forms/B_OA_Supervision/B_OA_Supervision_Assign_Doc.html",
        Url: "B_OA_Supervision_Assign_DocSvc.data"
    }

    this.getCacheData = function () {
        //读取富文本的内容
        var showData = editor.getData();
        models.supervisionBill.viewModel.content(showData);

        data.supervisionBaseInfo = models.supervisionBaseInfo.getCacheData();
        data.supervisionBill = models.supervisionBill.getCacheData();
        return JSON.stringify(data);
    }

    this.getData = function () {
        //读取富文本的内容
        var showData = editor.getData();
        models.supervisionBill.viewModel.content(showData);

        var d2 = models.supervisionBill.getData();
        var d1 = models.supervisionBaseInfo.getData();
        if (d1 && d1 != null)
            return JSON.stringify({ "supervisionBaseInfo": d1, "supervisionBill": d2 });
        else
            return false;
    }


    //督办通知单
    models.supervisionBill = $.Com.FormModel({
        beforeBind: function (vm, _root) {
        }
    });

    models.supervisionBaseInfo = $.Com.FormModel({
        beforeBind: function (vm, _root) {
            vm._getInforByCaseId = function (da) {
                if (da.relationCaseId() == null || da.relationCaseId() == "") {
                    $.Com.showMsg("没有相关业务！");
                    return;
                }
                var pcaseid = da.relationCaseId();
                var params = {};
                params.caseid = pcaseid;
                //params.flowid = "W000058";
                params.title = da.refferTitle();
                params.isend = true;
                params.state = "endcase";
                $.Com.Go(pcaseid + ".fx/com/wf/form:" + JSON.stringify(params));
            }
        }
    });

    models.supervisionMsg = $.Com.FormModel({});

    //办理情况表
    models.supervisionMsgGrid = $.Com.GridModel({
        beforeBind: function (vm, _root) {
            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.Com.formatDate(date());
                return d;
            }
        },
        elementsCount: 5,
        edit: function (item, callback) {
        }
      , remove: function (row) {

      }
      , keyColumns: "id"
    });

    //延期申请表
    models.relationDocGrid_Delay = $.Com.GridModel({
        beforeBind: function (vm, _root) {
            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.Com.formatDate(date());
                return d;
            }

            vm._getInforByCaseId = function (da) {
                if (da.ID() == null || da.ID() == "") {
                    $.Com.showMsg("没有相关业务！");
                    return;
                }
                var pcaseid = da.ID();
                var params = {};
                params.caseid = pcaseid;
                params.title = da.Name();
                params.isend = true;
                params.state = "endcase";
                $.Com.Go(pcaseid + ".fx/com/wf/form:" + JSON.stringify(params));
            }
        },
        elementsCount: 20,
        edit: function (item, callback) {
        }
  , remove: function (row) {

  }
  , keyColumns: "id"
    });


    //相关申请文档 催办申请表
    models.relationDocGrid = $.Com.GridModel({
        beforeBind: function (vm, _root) {
            vm._getInforByCaseId = function (da) {
                if (da.ID() == null || da.ID() == "") {
                    $.Com.showMsg("没有相关业务！");
                    return;
                }
                var pcaseid = da.ID();
                var params = {};
                params.caseid = pcaseid;
                params.title = da.Name();
                params.isend = true;
                params.state = "endcase";
                $.Com.Go(pcaseid + ".fx/com/wf/form:" + JSON.stringify(params));
            }
            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.Com.formatDate(date());
                return d;
            }

            vm.reminderAgain = function (data) {

                var count = data.reminderCount();
                count = count + 1;
                data.reminderCount(count);
                UpdateReminderData(data.ID(), count);
            }
        },
        elementsCount: 20,
        edit: function (item, callback) {
        }
      , remove: function (row) {

      }
      , keyColumns: "id"
    });

    this.show = function (formdiv, formdata, wftool) {
        if (formdiv) root = formdiv;
        data = formdata;

        //tab设置
        var tal = root.find("[data-id='talDiv']");
        tal.iwfTab(
            {
                stretch: true,
                tabchange: function (dom) {
                }
            }
        );

        var wactid = wftool.wfcase.actid;
        var guid = wftool.wfcase.guid;
        var caseid = wftool.wfcase.caseid;

        //设置督办通知单
        var divName = "";
        //加载富文本
        if (caseid == "" || caseid == undefined) {
            divName = guid;
        } else {
            divName = caseid;
        }
        if (data.supervisionBill) {
            var textarea = "<textarea class='form-control' name='supervisionNotice_" + divName + "' rows='20'></textarea>";
            var supervisionNoticeBill = root.find("[data-id='supervisionNoticeBill']");
            supervisionNoticeBill.empty(); //删除被选元素的子元素。
            supervisionNoticeBill.append(textarea);
            editor = CKEDITOR.replace("supervisionNotice_" + divName);
            editor.setData(data.supervisionBill.content);
            var suprvisionNoticeBillShow = root.find("[data-id='suprvisionNoticeBillShow']");
            suprvisionNoticeBillShow.empty();
            suprvisionNoticeBillShow.append(data.supervisionBill.content);
            models.supervisionBill.show(root.find("[data-id='supervisionNotice']"), data.supervisionBill);
        }

        if (wftool.wfcase.msgCaseId) {
            data.supervisionBaseInfo.relationCaseId = wftool.wfcase.msgCaseId;
        }

        if (wftool.wfcase.msgTitle) {
            data.supervisionBaseInfo.refferTitle = wftool.wfcase.msgTitle;
        }

        models.supervisionBaseInfo.show(root.find("[data-id='supervisionDetailModel']"), data.supervisionBaseInfo);
        models.supervisionMsgGrid.show(root.find("[data-id='msgList']"), []);

        //保存督办通知单
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
        //编辑督办通知单
        root.find("[data-id='editNotice']").bind("click", function () {
            root.find("[data-id='supervisionNoticeBill']").attr("style", "display:display");
            root.find("[data-id='suprvisionNoticeBillShow']").attr("style", "display:none");
            root.find("[data-id='saveNotice']").attr("style", "display:display");
            root.find("[data-id='editNotice']").attr("style", "display:none");
        });

        //催办
        root.find("[data-id='remindersBtn']").bind("click", function (value) {
            if (caseid != "") {
                var baseInfor = models.supervisionBaseInfo.getData();
                var guid = newGuid();
                var title = "新建：" + baseInfor.title + "--催办申请";
                var params = {
                    "flowid": "W000092", "caseid": "", actid: "A001", "guid": guid, "state": "doingcase",
                    "msgCaseId": caseid,
                    "msgTitle": baseInfor.title,
                    "title": title,
                    "msgUndertakeManName": baseInfor.undertakeManName,
                    "msgUndertakeManId": baseInfor.undertakeManId,
                    "msgIssuerManName": baseInfor.issuerManName,
                    "msgIssuerManId": baseInfor.issuerManId,
                    "msgUndertake_Department": baseInfor.undertake_Department
                };
                var jsondata = JSON.stringify(params);
                $.Com.Go(guid + '.fx/com/wf/form:' + jsondata);
            } else {
                $.Com.showMsg("请先通过点击‘发送’创建业务后才可启动催办流程！");
                return;
            }
        })


        //督办延期申请
        root.find("[data-id='supervisionApplyBtn']").click(function () {
            if (caseid != "") {
                var baseInfor = models.supervisionBaseInfo.getData();
                var guid = newGuid();
                var title = "新建：" + baseInfor.title + "--督办延期申请";
                var params = {
                    "flowid": "W000093", "caseid": "", actid: "A001", "guid": guid, "state": "doingcase",
                    "msgCaseId": caseid, "msgTitle": baseInfor.title, "title": title
                };
                var jsondata = JSON.stringify(params);
                $.Com.Go(guid + '.fx/com/wf/form:' + jsondata);
            } else {
                $.Com.showMsg("请先通过点击‘发送’创建业务后才可启动督办延期业务！");
                return;
            }
        });
        root.find("[data-id='saveMsgBtn']").bind("click", function (value) {
            SaveSupervisionMsg();
        })

        //读取办理情况
        if (wftool.wfcase.caseid) {
            GetSupervisionMsgList(wftool.wfcase.caseid);
        }
        initSetControllersStatus();
        setControlShowStatus(wftool);
    }


    function UpdateReminderData(caseId, count) {
        $.fxPost("/B_OA_Supervision_ReminderSvc.data?action=UpdateReminderCount", { caseId: caseId, count: count }, function (res) {
            if (!res.success) {
                $.Com.showMsg(res.msg);
                return;
            };

        });
    }

    //生成guid
    function newGuid() {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    }

    function initSetControllersStatus() {
        //将所有的div内的元素都置为不可用
        root.find("input").attr("disabled", true);
        root.find("textarea").attr("disabled", true);
        root.find("select").attr("disabled", true);
        root.find("button").attr("disabled", true);
        //办理情况录入
        root.find("[data-id='supervisionMsg']").attr("style", "display:none");
        //编辑督办通知单按钮
        root.find("[data-id='editNotice']").attr("style", "display:none");
        //督办同时单div
        root.find("[data-id='supervisionNoticeBill']").attr("style", "display:none");
        //办理情况
        root.find("[data-id='handlingSituation']").attr("style", "display:none");
        //浏览按钮
        root.find("[data-id='saveNotice']").attr("style", "display:none");
        //办理情况
        root.find("[data-id='handlingSituation']").attr("style", "display:display");

    }

    function setControlShowStatus(wftool) {
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
            root.find("[data-id='limiteDate']").attr("disabled", true);
            root.find("[data-id='code']").attr("disabled", true);
            root.find("[data-id='assistDepartment']").attr("disabled", true);
            root.find("[data-id='undertake_Department']").attr("disabled", true);
            //办理情况
            root.find("[data-id='handlingSituation']").attr("style", "display:none");
        } else if (wftool.wfcase.actid == "A003") {
            root.find("[data-id='supervisionApplyBtn']").attr("disabled", false);
            root.find("[data-id='remindersBtn']").attr("disabled", false);
        }
        //办理情况录入
        if (wftool.wfcase.canRecordSituation) {
            root.find("[data-id='supervisionApplyBtn']").attr("disabled", false);
            root.find("[data-id='remindersBtn']").attr("disabled", false);
            root.find("[data-id='supervisionMsg']").attr("style", "display:display");
            root.find("[data-id='saveMsgBtn']").attr("disabled", false);
            root.find("[data-id='st_content']").attr("disabled", false);
            root.find("[data-id='st_attachment']").attr("disabled", false);
        }
    }

    //读取此督办的相关信息
    function GetSupervisionMsgList(caseId) {
        $.fxPost("B_OA_Supervision_AssignSvc.data?action=GetSupervisionMsgList", { caseId: caseId }, function (res) {
            if (!res.success) {
                $.Com.showMsg(res.msg);
                return;
            }
            var daInfor = res.data;
            models.supervisionMsgGrid.show(root.find("[data-id='msgList']"), daInfor.listMsg);//所有的办理情况
            models.supervisionBaseInfo.viewModel.limiteDate(res.data.supervisionBaseInfo.limiteDate);//修改延期申请日期
            models.relationDocGrid.show(root.find("[data-id='relationDocList']"), daInfor.reminderTable); //催办表
            models.relationDocGrid_Delay.show(root.find("[data-id='relationDocList_Delay']"), daInfor.delayTable); //延期申请表
            models.supervisionMsg.show(root.find("[data-id='supervisionMsg']"), daInfor.supervisionMsg);
        })
    }

    //保存督办通知书的办理详情
    function SaveSupervisionMsg() {
        var msg = JSON.stringify(models.supervisionMsg.getData());
        $.fxPost("B_OA_Supervision_AssignSvc.data?action=SaveSupervsionMsg", { content: msg }, function (res) {
            if (!res.success) {
                $.Com.showMsg(res.msg);
                return;
            }
            var daInfor = res.data
            models.supervisionMsgGrid.show(root.find("[data-id='msgList']"), daInfor.listMsg);
            models.supervisionMsg.show(root.find("[data-id='supervisionMsg']"), daInfor.supervisionMsg);
        })
    }


    //读取办理情况model
    function GetSupervisionMsg(caseid) {
        $.fxPost("/B_OA_Supervision_Assign_DocSvc.data?action=GetSupervisionMsg", { caseId: caseid }, function (res) {
            if (!res.success) {
                $.Com.showMsg(res.msg);
                return;
            }
            var daInfor = res.data;
            models.supervisionMsg.show(root.find("[data-id='supervisionMsg']"), daInfor.supervisionMsg);
        })
    }


    function setSendMan(wftool, supervisionBaseInfo) {
        var sendArray = [];
        //协办人数组
        if (supervisionBaseInfo.assitManId != null && supervisionBaseInfo.assitManId != "") {
            var assistantManIdArray = supervisionBaseInfo.assitManId.split(';');
            for (var i = 0 ; i < assistantManIdArray.length - 1; i++) {
                if (sendArray.toString().indexOf(assistantManIdArray[i]) == -1) {
                    sendArray.push(assistantManIdArray[i]);
                }
            }
            //承办人
            var undertakeManIdArray = supervisionBaseInfo.undertakeManId.split(';');
            for (var j = 0 ; j < undertakeManIdArray.length - 1; j++) {
                if (sendArray.toString().indexOf(undertakeManIdArray[j]) == -1) {
                    sendArray.push(undertakeManIdArray[j]);
                }
            }

            wftool.SetReceivers(sendArray);//设置接收人为
        }
    }

    function SaveSupervisionNotice(supervisionNotice, win) {
        if (supervisionNotice) {
            var json = JSON.stringify(supervisionNotice);
            $.fxPost("/B_OA_Supervision_Assign_DocSvc.data?action=SaveSupervisionNotice", { content: json }, function (res) {
                if (!res.success) {
                    $.Com.showMsg(res.msg);
                    return;
                }
            })
        }
    }
}

$.Biz.B_OA_Supervision_Assign_Doc.prototype.version = "1.0";