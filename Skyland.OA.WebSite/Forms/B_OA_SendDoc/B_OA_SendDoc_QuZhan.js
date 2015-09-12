$.Biz.B_OA_SendDoc_QuZhan = function (root, wfcase) {
    var root;
    var data;
    var models = {};

    models.sendDocBaseInfo = $.Com.FormModel({
        beforeBind: function (vm, root) {
            vm._getOrganization_zs = function (item) {
                showCC("zs");
            }

            vm._getOrganization_cb = function (item) {
                showCC("cb");
            }

            vm._getOrganization_cs = function (item) {
                showCC("cs");
            }
        },
        isAppendSign: false
    });

    this.options = {
        HtmlPath: "Forms/B_OA_SendDoc/B_OA_SendDoc_QuZhan.html",
        Url: "B_OA_SendDoc_QuZhanSvc.data"
    }

    this.getCacheData = function () {
        data.sendDocBaseInfo = models.sendDocBaseInfo.getCacheData();
        return JSON.stringify(data);
    }

    this.getData = function () {
        var d1 = models.sendDocBaseInfo.getData();
        if (d1 != false) {
            if (d1.sendCheckType == null) {
                $.Com.showMsg("请勾选发文类型");
                return false;
            }
        }
        if (d1 && d1 != null)
            return JSON.stringify({ "sendDocBaseInfo": d1 });
        else
            return false;
    }

    this.show = function (formdiv, formdata, wftool) {
        if (formdiv) root = formdiv;
        data = formdata;
        var caseid = wftool.wfcase.caseid;
        var title = formdata.sendDocBaseInfo.wjbt;
        var wactid = wftool.wfcase.actid;

        //桂环站
        root.find("[data-id='guiHuanZhan']").change(function () {
            if (root.find("[data-id='guiHuanZhan']")[0].checked == false) {
                models.sendDocBaseInfo.viewModel.sendCheckType("");
            } else {
                models.sendDocBaseInfo.viewModel.sendCheckType("1");
            }
        });

        //代厅拟文
        root.find("[data-id='daiTingNiWen']").change(function () {
            if (root.find("[data-id='daiTingNiWen']")[0].checked == false) {
                models.sendDocBaseInfo.viewModel.sendCheckType("");
            } else {
                models.sendDocBaseInfo.viewModel.sendCheckType("2");
            }
        });

        //内部发文
        root.find("[data-id='neiBuShiXiang']").change(function () {
            if (root.find("[data-id='neiBuShiXiang']")[0].checked == false) {
                models.sendDocBaseInfo.viewModel.sendCheckType("");
            } else {
                models.sendDocBaseInfo.viewModel.sendCheckType("3");
            }
        });

        //其他
        root.find("[data-id='qiTa']").change(function () {
            if (root.find("[data-id='qiTa']")[0].checked == false) {
                models.sendDocBaseInfo.viewModel.sendCheckType("");
            } else {
                models.sendDocBaseInfo.viewModel.sendCheckType("4");
            }
        });

        //正文按钮
        root.find("[data-id='mainBody']").bind("click", function (value) {

            var guid = wftool.wfcase.guid;
            var caseid = wftool.wfcase.caseid;

            var baseInform = models.sendDocBaseInfo.getData();
            if (baseInform == false) {
                $.Com.showMsg("请按照提示正确输入信息");
                return;
            }
            var baseInfor = JSON.stringify(baseInform);
            $.fxPost("/B_OA_SendDoc_QuZhanSvc.data?action=CreateMainBody", { content: baseInfor, guid: guid, caseid: caseid, type: "SendDocQuZhan", actId: wactid }, function (res) {

                var mainBodyPath = res.path;

                var data = {
                    Logo: "发文正文",
                    Title: "发文正文",
                    Callback: function (result) { },
                    ToolPrivilege: {
                        Save: true, // 隐藏保存按钮
                        Open: false // 显示保存按钮
                    },
                    IsWarnSave: true, //是否弹出提示保存按钮
                    HttpParams: { severFilePath: mainBodyPath }
                }
                ShowWordWin(data);

            });
        });


        //选择模版
        root.find("[data-id='choiceModel']").bind("click", function () {
            root.find("[data-id='modelDiv']").find('input').attr('disabled', false);
            showDocModel();
        });

        //正文按钮
        root.find("[data-id='mainBodyText']").bind("click", function (value) {
            loadMainBodyWind();
        });

        //自动排版
        root.find("[data-id='autoTypesetting']").bind("click", function (value) {
            autoType(caseid);
        });

        //打印处理笺
        root.find("[data-id='printSendDoc']").bind("click", function (value) {
            printDoc(caseid);
        });

        models.sendDocBaseInfo.show(root.find("[data-id='sendDocBaseInfo']"), data.sendDocBaseInfo);

        if (wactid != "A001") {
            setCheckSuggetion(wftool.wfcase.caseid);
        }
        //初始化控件
        initSetControllersStatus();
        setControllersStatus(wactid);
    }

    function initSetControllersStatus() {
        //将所有的div内的元素都置为不可用
        root.find("input").attr("disabled", true);
        root.find("textarea").attr("disabled", true);
        root.find("select").attr("disabled", true);
        root.find("button").attr("disabled", true);
        root.find("input:checkbox").attr("disabled", true);
    };

    function setControllersStatus(wactid) {
        root.find("[data-id='mainBodyText']").attr("disabled", false);
        if (wactid == "A001") {
            //将所有的div内的元素都置为不可用
            root.find("input").attr("disabled", false);
            root.find("textarea").attr("disabled", false);
            root.find("select").attr("disabled", false);
            root.find("button").attr("disabled", false);
            root.find("input:checkbox").attr("disabled", false);
            root.find("[data-id='printSendDoc']").attr("disabled", true);
            root.find("[data-id='autoTypesetting']").attr("disabled", true);
        }
        else if (wactid == "A008") {//排版编号
            $(root.find("[data-id='checkBox']")[0]).find("input").attr("disabled", false);
            $(root.find("[data-id='checkBox']")[0]).find("input:checkbox").attr("disabled", true);
        }
        else if (wactid == "A010") {  //排版打印
            //打印发文笺
            root.find("[data-id='printSendDoc']").attr("disabled", false);
            //自动排版
            root.find("[data-id='autoTypesetting']").attr("disabled", false);
        }
        else if (wactid == "A011") {//盖章发文
            //打印发文笺
            root.find("[data-id='printSendDoc']").attr("disabled", false);
            //自动排版
            root.find("[data-id='autoTypesetting']").attr("disabled", false);
        }
    }

    //打印处理笺
    function printDoc(caseid) {
        $.fxPost("B_OA_SendDoc_QuZhanSvc.data?action=PrintDoc", { caseid: caseid }, function (ret) {
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
        $.fxPost("CommonFunctionSvc.data?action=GetWorkFlowCaseByCaseId", { caseid: caseid }, function (ret) {
            var listWork = ret.listWork;
            var dir = ret.dir;
            var listArray = [];
            //承办科室拟稿人div
            var cbksngr = root.find("[data-id='cbksngr']");
            //承办科室负责人div
            var cbksfzr = root.find("[data-id='cbksfzr']");
            //办公室核稿意见div
            var bgshgyj = root.find("[data-id='bgshgyj']");
            //签发人div
            var qfr = root.find("[data-id='qfr']");
            //校对人div
            var jdr = root.find("[data-id='jdr']");

            //将审批意见格式化后送入相应的表格字段中
            listArray = $.ComFun.ChangeListToMatch(listWork, dir);
            for (var j = 0; j < listArray.length; j++) {
                //审批意见
                if (listArray[j].actID == 'A001') {
                    //局办公室负责任审核
                    $.ComFun.AppendDataToDiv(cbksngr, listArray[j]);
                } else if (listArray[j].actID == 'A002') {
                    $.ComFun.AppendDataToDiv(cbksfzr, listArray[j]);
                } else if ((listArray[j].actID == 'A003') || (listArray[j].actID == 'A004')) {
                    $.ComFun.AppendDataToDiv(bgshgyj, listArray[j]);
                } else if (listArray[j].actID == 'A005') {
                    $.ComFun.AppendDataToDiv(qfr, listArray[j]);
                } else if (listArray[j].actID == 'A009') {
                    $.ComFun.AppendDataToDiv(jdr, listArray[j]);
                }
            }
        });
    }

    function loadMainBodyWind() {
        var dataModel;
        var dlgOpts = {
            title: '正文',
            width: 600,
            height: 550,
            button: [
                {
                    text: '确定',
                    handler: function () {
                        var content = dataModel.getData().content;
                        models.sendDocBaseInfo.viewModel.mainBody(content);
                        win.close();
                    }
                }, {
                    text: '关闭',
                    handler: function () {
                        win.close();
                    }
                }
            ]
        };
        var win = $.iwf.showWin(dlgOpts);
        $.iwf.getModel("nnepb/OA/SendDoc/MainBody", function (model) {
            var mainBody = models.sendDocBaseInfo.viewModel.mainBody();
            var moduleItem = { content: mainBody };
            dataModel = model;
            model.show(moduleItem, win.content());
        });

    }

    //抄送抄报弹窗
    function showCC(type) {
        var master;
        var dlgOpts = {
            title: '组织机构', width: 600, height: 500,
            button: [
             {
                 text: '确认', handler: function () {
                     var choiceContent = master.getData();
                     if (type == 'zs') {
                         models.sendDocBaseInfo.viewModel.zs(choiceContent);
                     } else if (type == 'cb') {
                         models.sendDocBaseInfo.viewModel.cb(choiceContent);
                     } else if (type == 'cs') {
                         models.sendDocBaseInfo.viewModel.cs(choiceContent);
                     }
                     win.close();
                 }
             },
             {
                 text: '关闭', handler: function () {
                     win.close();
                 }
             }
            ]
        };
        var win = $.iwf.showWin(dlgOpts);
        $.iwf.getModel("nnepb/OA/CommonControl/OrganizationSelect", function (model) {
            master = model;
            model.show(null, win.content());
        });

    }

    //自动排版打印
    function autoType(caseid) {
        if (caseid == null) {
            alert("未生成业务，无法打印");
            return;
        }
        $.fxPost("B_OA_SendDoc_QuZhanSvc.data?action=AutoTypesetting", { caseid: caseid }, function (ret) {
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

    // 显示弹窗
    function showDocModel() {
        var caseid = models.sendDocBaseInfo.viewModel.caseid();
        if (caseid == "" || caseid == null) {
            $.Com.showMsg("此文为草稿状态，因此不可选择模版。");
            return;
        }

        var choice;
        //选择模版表格
        models.choiceModelGrid = $.Com.GridModel({
            keyColumns: "id",//主键字段
            beforeBind: function (vm, _root) {//表格加载前

            },
            elementsCount: 20,
            edit: function (item, callback) {

            },
            remove: function (row) {

            }
        });

        var win;
        var dlgOpts = {
            title: '选择正文模板',
            width: 600, height: 800,
            button: [
               {
                   text: '确定', handler: function () {
                       choice = models.choiceModelGrid.getCacheData().data;
                       for (var i = 0 ; i < choice.length; i++) {
                           if (choice[i].check == "on") {
                               printCommonDoc(models.sendDocBaseInfo.viewModel.fwrq(), choice[i].id, caseid);
                               break;
                           };
                       }
                       win.close();
                   }
               }
               , {
                   text: '取消', handler: function () {
                       win.close();
                   }
               }
            ]
        };
        //读取模版列
        $.getJSON("/Forms/B_OA_SendDoc/SendDocChoiceModelConfig.txt", {}, function (data) {
            var listData = data;
            win = $.Com.showFormWin(listData, function () {
            }, models.choiceModelGrid, root.find("[data-id='modelDiv']"), dlgOpts);

        });
    }

    // 选择模版生成正文
    function printCommonDoc(fwrqString, printType, caseid) {
        var content = JSON.stringify({ fwrqString: fwrqString, printType: printType, caseid: caseid });
        $.fxPost("B_OA_SendDoc_QuZhanSvc.data?action=PrintSendDocContent", { "content": content }, function (ret) {
            if (!ret.success) {
                $.Com.showMsg(data.msg);
                return false;
            }
            //var fileName = eval('(' + data.content + ')').fileName;


            //models.sendDocBaseInfo.viewModel.articlePath(fileName)
            //var path = eval('(' + data.content + ')').wordPath;// 获取服务器端返回的文件路径
            var mainBodyPath = encodeURI(ret.data.mainBodyPath);

            var redCoverPath = ret.data.redCoverPath;
            var data = {
                Logo: "发文正文",
                Title: "发文正文",
                Callback: function (result) { },
                ToolPrivilege: {
                    Save: true, // 隐藏保存按钮
                    Open: true // 显示保存按钮
                },
                HttpParams: { severFilePath: redCoverPath },
                IsWarnSave: true,//是否弹出提示保存按钮
                MarkName: "mainBody",
                MainBodyPath: mainBodyPath
            }
            ShowWordWin(data);
        });
    }
}

$.Biz.B_OA_SendDoc_QuZhan.prototype.version = "1.0";
