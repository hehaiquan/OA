﻿
$.Biz.B_OA_ReceiveDoc = function (wftool) {

    var me = this;
    var root;
    var data;
    var models = {};
    var SendOut;
    var tittleModel = { supervisionCount: "" };

    this.options = {
        HtmlPath: "Forms/B_OA_ReceiveDoc/B_OA_ReceiveDoc.html",
        Url: "B_OA_ReceiveDocSvc.data"
    };

    //督办申请表
    models.supervisionGrid = $.Com.GridModel({
        beforeBind: function (vm, _root) {
            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.Com.formatDate(date());
                return d;
            }

            //删除标签
            vm.getInforByCaseId = function (caseId) {
                if (caseId() == null || caseId() == "") {
                    $.Com.showMsg("没有相关业务！");
                    return;
                }
                $.iwf.getModel("formmodel").opencase({ 'caseid': caseId() });
            }
        },
        elementsCount: 20,
        edit: function (item, callback) {
        }
  , remove: function (row) {

  }
  , keyColumns: "id"
    });

    //督办信息model（显示督办数量的model）
    models.supervisionCount = $.Com.FormModel({});

    //基本信息模
    models.baseInfo = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
            //来文单位
            vm._getLwdw = function () {
                $.Biz.ZfUnitiSelectWin(
                    //回调涵数,更新单位ID、单位名称、单位地址
                    function (data) {
                        if (data != null) {
                            vm.lwdw(data.dwmc);//更新单位名称
                        }
                    }
                );
            };
        },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) {
            return true;
        },
        afterBind: function (vm, root) {

        },
        isAppendSign: false
    });



    models.printReceive = function (wftool) {
        var caseid = wftool.wfcase.caseid;
        if (caseid == null || caseid == "") {
            $.Com.showMsg("业务为空，不能打印");
            return
        };
        $.fxPost("/B_OA_ReceiveDocSvc.data?action=Print", { caseid: caseid }, function (res) {
            if (!res.success) {
                $.Com.showMsg(res.msg);
                return false;
            }
            var path = eval('(' + res.data + ')').wordPath//获取服务器端返回的文件路径
            var open;
            var save;
            var IsWarnSave;
            save = false;
            open = false;
            IsWarnSave = false;
            var data = {
                Logo: "南宁市环境保护局文件处理笺",
                Title: "南宁市环境保护局文件处理笺",
                IsWarnSave: IsWarnSave,//是否弹出提示保存按钮
                Callback: function (result) { },
                ToolPrivilege: {
                    Save: save,//保存按钮
                    Open: open//显示打开按钮
                },
                HttpParams: { severFilePath: path, saveFilePath: path }

            }
            ShowWordWin(data);

        });
    }

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

        models.baseInfo.show(root.find("[data-id='baseInfo']"), data.baseInfo);
        var caseid = wftool.wfcase.caseid;
        var title = formdata.baseInfo.wjbt;

        //读取审核信息，并放入相应的表格中
        setCheckSuggetion(wftool.wfcase.caseid);
        //时间格式化
        models.baseInfo.viewModel.manageDate.subscribe(
            function (newValue) {
                var newDate = new Date(newValue.replace(' ', 'T'));
                var time = newDate.setDate(newDate.getDate() - 2);
                var month = newDate.getMonth() + 1;
                var date = newDate.getDate();
                var year = newDate.getFullYear();
                var pin = year.toString() + "-" + month.toString() + "-" + date.toString() + " 00:00";
                models.baseInfo.viewModel.overTimeRemindDate(pin);
            });



        root.find("[data-id='lookWordFile']").click(function () {
            models.lw(wftool, "doc");
        });
        root.find("[data-id='printLw']").click(function () {
            models.printReceive(wftool, "lw");
        });

        root.find("[data-id='filePlace']").click(function () {
            $.fxPost("/B_OA_ReceiveDocSvc.data?action=FilePlaceR", { caseid: wftool.wfcase.caseid, title: wftool.wfcase.title, documentType: "收文归档" }, function (res) {
                if (res != null) {
                    var json = JSON.stringify(res);
                    $.Com.showMsg(res.msg);
                }
            });
        });


        //督办按钮
        root.find("[data-id='supervisionBtn']").click(function () {

            if (caseid != "") {
                var baseInfor = models.baseInfo.getData();
                var guid = newGuid();
                var title = baseInfor.wjbt + "--来文处理笺";
                var params = {
                    "flowid": "W000091", "caseid": "", actid: "A001", "guid": guid, "state": "doingcase",
                    "msgCaseId": caseid, "msgTitle": title, "title": "新建：" + title
                };
                var jsondata = JSON.stringify(params);
                $.Com.Go(guid + '.fx/com/wf/form:' + jsondata);
            } else {
                $.Com.showMsg("请先通过点击‘发送’创建业务后才可启动催办流程！");
                return;
            }
        });

        initSetControllersStatus();
        if (wftool.wfcase.flowid == "W000066") {
            //传阅设置
            setControlShowStatus_Circulation(wftool);
        } else if (wftool.wfcase.flowid == "W000067") {
            //处理件设置
            setControlShowStatus_Handle(wftool);
        }

        //审批意见手写设置
        if (wftool.remarkBox) {
            var paramsData = { flowid: wftool.wfcase.flowid, caseid: wftool.wfcase.caseid, actid: wftool.wfcase.actid };
            var para = JSON.stringify(paramsData);
            wftool.remarkBox.setParams(para);
        }
    }

    this.getCacheData = function () {
        data.baseInfo = models.baseInfo.getCacheData();
        return JSON.stringify(data);
    };
    this.cacheData = data;
    this.getData = function () {
        var baseInfo = models.baseInfo.getData();
        if (baseInfo != false)
            return JSON.stringify({
                "baseInfo": baseInfo
            });
        else
            return false;
    };

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


    // zhoushining create this method 20140926
    // this method was created by zhoushining on Sep. 26th, 2014
    function initSetControllersStatus() {
        //将所有的div内的元素都置为不可用
        root.find("input").attr("disabled", true);
        root.find("textarea").attr("disabled", true);
        root.find("select").attr("disabled", true);
        root.find("button").attr("disabled", true);
        root.find("[iwftype='remark_opinionbox']").attr("disabled", false);
    };

    //处理签设置
    function setControlShowStatus_Handle(wftool) {
        root.find("[data-id='printLw']").attr("disabled", false);

        root.find("[data-id='suchAsFitting']").attr("disabled", false);
        root.find("[data-id='saveSighture']").attr("disabled", false);

        root.find("[data-id='supervisionBtn']").attr("disabled", false)//将元素设置为disabled,禁用控件
        root.find("[data-id='supervisionChoiceManBtn']").attr("disabled", false)//将元素设置为disabled,禁用控件
        root.find("[data-id='supervision_title']").attr("disabled", false)//将元素设置为disabled,禁用控件
        root.find("[data-id='supervision_refferTitle']").attr("disabled", false)//将元素设置为disabled,禁用控件

        //有权限时才显示确定按钮
        if (wftool.wfcase.actid == "A001") {
            root.find("[data-id='swrq']").attr("disabled", false);
            root.find("[data-id='lwdw']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='lwdwBtn']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='wjbt']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='nbyj']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='lwyq']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='lwbh']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='lwbhBtn']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='mj']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='manageDate']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='publicRange']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='lwlx']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='overTimeRemindDate']").attr("disabled", false)//将元素设置为disabled,禁用控件
        } else if (wftool.wfcase.actid == "A005") {
            root.find("[data-id='printLw']").attr("disabled", false);
        } else if (wftool.wfcase.actid == "A009") {
            root.find("[data-id='printLw']").attr("disabled", false);
        }
    }

    //传阅签设置
    function setControlShowStatus_Circulation(wftool) {
        //有权限时才显示确定按钮
        if (wftool.wfcase.actid == "A001") {
            root.find("[data-id='lwdw']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='lwdwBtn']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='wjbt']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='nbyj']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='lwyq']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='lwbh']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='lwbhBtn']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='mj']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='manageDate']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='publicRange']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='lwlx']").attr("disabled", false)//将元素设置为disabled,禁用控件
            root.find("[data-id='overTimeRemindDate']").attr("disabled", false)//将元素设置为disabled,禁用控件
        }
        else if (wftool.wfcase.actid == "A003") {
            root.find("[data-id='printLw']").attr("disabled", false);
        }
    }

    function saveLDPS() {
        SendOut.SaveSignature();
    }

    function setCheckSuggetion(caseId) {
        $.fxPost("CommonFunctionSvc.data?action=GetWorkFlowCaseByCaseId", { caseid: caseId }, function (ret) {
            var listArray = [];
            var listAttachment = ret.listAttachment;
            var listSupervision = ret.listSupervision;
            var listWork = ret.listWork;
            var ldpsDiv = root.find("[data-id='ldps']");
            var dir = ret.dir;

            //将审批意见格式化后送入相应的表格字段中
            listArray = $.ComFun.ChangeListToMatch(listWork, dir);
                for (var j = 0 ; j < listArray.length; j++) {
                    //领导批示
                    if (listArray[j].actID == 'A004' || listArray[j].actID == 'A003') {
                        $.ComFun.AppendDataToDiv(ldpsDiv, listArray[j]);
                    }
                }
           
            //附件信息
            var attachmentDiv = root.find("[data-id='attachments']");
            if (listAttachment.length > 0) {
                attachmentDiv.show();
                attachmentDiv.empty();
                var wjbtDiv = root.find("[data-id='wjbt']");
                wjbtDiv.hide();
                for (var i = 0; i < listAttachment.length; i++) {
                    var attach = $("<a target='_black' class='btn btn-link' href='" + "/" + dir + "/" + listAttachment[i].FilePath + "'>" + data.baseInfo.wjbt + "</a>");
                    attachmentDiv.append(attach);
                }
            }

            //设置督办信息
            if (listSupervision.length > 0) {
                tittleModel.supervisionCount = '共(' + listSupervision.length + ')条';
            } else {
                tittleModel.supervisionCount = '暂无';
            }
            models.supervisionCount.show(root.find("[data-id='tittleBar']"), tittleModel);
            models.supervisionGrid.show(root.find("[data-id='supervisionList']"), listSupervision); //延期申请表


        });
    }
};

$.Biz.B_OA_ReceiveDoc.prototype.version = "1.0";



