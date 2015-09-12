$.Biz.B_OA_SendDoc_ZhiDui = function (root, wfcase) {
    var root;
    var data;
    var models = {};
    var detailmodel = $.Com.FormModel({ isAppendSign: false });
    var self = this;
    var SendOut;
    var tittleModel = { supervisionCount: "" };

    this.options = {
        HtmlPath: "Forms/B_OA_SendDoc/B_OA_SendDoc_ZhiDui.html",
        Url: "B_OA_SendDoc_ZhiDuiSvc.data"
    }

    //督办申请表
    models.supervisionGrid = $.Com.GridModel({
        beforeBind: function (vm, _root) {
            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.Com.formatDate(date());
                return d;
            }

            //查看相关业务
            vm._getInforByCaseId = function (da) {
                if (da.caseId() == null || da.caseId() == "") {
                    $.Com.showMsg("没有相关业务！");
                    return;
                }
                var pcaseid = da.caseId();
                var params = {};
                params.caseid = pcaseid;
                params.title = da.title();
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

    //督办信息model（显示督办数量的model）
    models.supervisionCount = $.Com.FormModel({});

    models.sendDocBaseInfo = $.Com.FormModel({
        beforeBind: function (vm, root) {
            root.find("[data-id='ztc']").bind("keyup", function () {
                // 改变就把值给变量
                var temp = root.find("[data-id='ztc']").val();
                vm.ztc(temp);
                root.find("[data-id='ztc']").val(temp);
            });

            vm._getReceiveSelect = function () {
                $.Biz.ReceiveDocumentSelectWin(
                    function (data) {
                        vm.receiveCaseId(data.caseid);
                        vm.receiveTittleName(data.wjbt);
                    }
                    );
            }

            vm._getReceiveByCaseId = function (da) {
                if (da.receiveCaseId() == null || da.receiveCaseId() == "") {
                    $.Com.showMsg("没有相关业务！");
                    return;
                };
                var pcaseid = da.receiveCaseId();
                var params = {};
                params.caseid = pcaseid;
                params.title = da.receiveTittleName();
                params.isend = true;
                params.state = "endcase";
                $.Com.Go(pcaseid + ".fx/com/wf/form:" + JSON.stringify(params));
            }

            vm._getOrganization_zs = function (item) {
                var callback;
                showOrganizationWind(item, "zs", function (callback) {
                    var da = callback;
                    item.zs(da);
                });
            }

            vm._getOrganization_cs = function (item) {
                var callback;
                showOrganizationWind(item, "cs", function (callback) {
                    var da = callback;
                    item.cs(da);
                });
            }

            vm._getOrganization_cb = function (item) {
                var callback;
                showOrganizationWind(item, "cb", function (callback) {
                    var da = callback;
                    item.cb(da);
                });
            }


            // 处理主题词，当按下空格键时，自动补上"；"号
            root.find("[data-id='ztc']").keypress(function (e) {
                if (e.keyCode == 32) {
                    //   $.Com.showMsg("空格");
                    var temp = $.trim(vm.ztc());
                    if (temp) {
                        var strValue = temp;
                        strValue = addChar(strValue);
                        strValue = deleteSpace(strValue);
                        vm.ztc(strValue);
                        root.find("[data-id='ztc']").val(strValue);
                    }
                }

            });

        }
        , beforeSave: function (vm, root) {
            return true;
        },
        isAppendSign: false
    });


    this.show = function (formdiv, formdata, wftool) {
        if (formdiv) root = formdiv;
        data = formdata;

        var caseid = wftool.wfcase.caseid;
        var title = formdata.sendDocBaseInfo.wjbt;
        var wactid = wftool.wfcase.actid;
        //tab设置
        var tal = root.find("[data-id='talDiv']");
        tal.iwfTab(
            {
                stretch: true,
                tabchange: function (dom) {
                }
            }
        );

        models.sendDocBaseInfo.show(root.find("[data-id='sendDocBaseInfo']"), data.sendDocBaseInfo);

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
            $.fxPost("/B_OA_SendDocSvc.data?action=CreateMainBody", { content: baseInfor, guid: guid, caseid: caseid, type: "SendDocZhiDui" }, function (res) {
                if (!res.success) {
                    $.Com.showMsg(res.msg);
                    return;
                }
                //var da = JSON.parse(res.bizParams);
                var conten = res.data;

                var data = {
                    Logo: "监察支队发文正文",
                    Title: "监察支队发文正文",
                    Callback: function (result) { },
                    ToolPrivilege: {
                        Save: true, // 隐藏保存按钮
                        Open: false // 显示保存按钮
                    },
                    IsWarnSave: true, //是否弹出提示保存按钮
                    HttpParams: { severFilePath: conten.mainBodyPath }
                }
                ShowWordWin(data);

            });
        });

        // 当用户点击加号按钮时，加1
        root.find("[data-id='add']").bind("click", function (value) {
            var numb = Number(models.sendDocBaseInfo._number()) + 1;
            models.sendDocBaseInfo._number(numb);
            root.find("[data-id='ys']").val(numb);

        });

        // 当用户点击减号按钮时， 减1
        root.find("[data-id='minus']").bind("click", function (value) {
            if (Number(models.sendDocBaseInfo._number()) - 1 < 0) return;
            var num = Number(models.sendDocBaseInfo._number()) - 1;
            models.sendDocBaseInfo._number(num);
            root.find("[data-id='ys']").val(num);
        });

        //选择模版
        root.find("[data-id='choiceModel']").bind("click", function () {
            root.find("[data-id='modelDiv']").find('input').attr('disabled', false);
            showDocModel();
        });

        root.find("[data-id='filePlace']").click(function () {
            $.fxPost("/B_OA_SendDocSvc.data?action=FilePlaceS", { caseid: data.sendDocBaseInfo.caseid, title: data.sendDocBaseInfo.wjbt }, function (res) {
                if (res != null) {
                    var json = JSON.stringify(res);
                    $.Com.showMsg(res.msg);
                }
            });
        });


        // 生成文号
        root.find("[data-id='createSendNoBtn']").bind("click", function () {
            $.fxPost("B_OA_SendDocSvc.data?action=CreateSendNo", { codeType: 'sendCode' }, function (ret) {
                if (!ret.success) {
                    $.Com.showMsg(ret.msg);
                    return;
                }
                var fxlx = root.find("[data-id='fwlx']").val();
                if (fxlx == "") {
                    $.Com.showMsg("请先选择发文类型");
                    return;
                }
                var name = root.find("[data-id='fwlx']").find('option[value=' + fxlx + ']').text();
                models.sendDocBaseInfo.viewModel.fwzh(name + ret.data);

            });
        });

        //督办按钮
        root.find("[data-id='supervisionBtn']").click(function () {
            if (caseid != "") {
                var baseInfor = models.sendDocBaseInfo.getData();
                var guid = $.ComFun.newGuid();
                var title = baseInfor.wjbt + "--支队发文";
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

        //主动公开
        root.find("[data-id='initiativeOpenCheck']").change(function () {
            if (root.find("[data-id='initiativeOpenCheck']")[0].checked == false) {
                models.sendDocBaseInfo.viewModel.gklx("");
            } else {
                models.sendDocBaseInfo.viewModel.gklx("1");
            }
        })
        //一审公开
        root.find("[data-id='checkOpenCheck']").change(function () {
            if (root.find("[data-id='checkOpenCheck']")[0].checked == false) {
                models.sendDocBaseInfo.viewModel.gklx("")
            } else {
                models.sendDocBaseInfo.viewModel.gklx("2")
            }
        })

        //不予公开
        root.find("[data-id='unOpenCheck']").change(function () {
            if (root.find("[data-id='unOpenCheck']")[0].checked == false) {
                models.sendDocBaseInfo.viewModel.gklx("")
            } else {
                models.sendDocBaseInfo.viewModel.gklx("3")
            }
        });


        root.find("[data-id='SendOutOpenSignature']").click(function () {
            SendOut.ShowDate("", 2);
            if (SendOut.OpenSignature()) {
                SendOutStatusMsg("签章、签批成功。");
            } else {
                SendOutStatusMsg(SendOut.Status);
            }
        });

        // 打印发文笺
        root.find("[data-id='printSendDoc']").click(function () {
            var fwzh = root.find("[data-id='createSendNo']")[0].value;
            $.fxPost("B_OA_SendDoc_ZhiDuiSvc.data?action=PrintSendDoc", { caseid: wftool.wfcase.caseid, fwzh: fwzh }, function (ret) {

                if (!ret.success) {
                    $.Com.showMsg(data.msg);
                    return false;
                }
                var content = eval('(' + ret.data + ')');

                var path = content.wordPath;// 获取服务器端返回的文件路径
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
        });

        //发文初始化
        initSetControllersStatus();
        setControllersStatus(wactid);

        //读取审批意见，并放入相应的表格中
        if (wactid != "A001") {
            setCheckSuggetion(wftool.wfcase.caseid);
        }
    }

    function initSetControllersStatus() {
        //将所有的div内的元素都置为不可用
        root.find("input").attr("disabled", true);
        root.find("textarea").attr("disabled", true);
        root.find("select").attr("disabled", true);
        root.find("button").attr("disabled", true);
        root.find("[data-id='showSighture']").attr("style", "display:none");
        root.find("[data-id='viewReceive']").attr("disabled", false);	// 查看依据
        root.find("[data-id='mainBody']").attr("disabled", false);	// 正文按钮
        root.find("[data-id='choiceModel']").attr("disabled", false);
    };


    // 显示权限函数
    function setControllersStatus(caseId) {
        root.find("[data-id='supervisionBtn']").attr("disabled", false);
        // 控件显隐
        if (caseId == "A001") {
            root.find("[data-id='fwzh']").attr("disabled", false);	// 发文号
            //root.find("[data-id='createSendNo']").attr("disabled", false);	// 发文号
            root.find("[data-id='mj']").attr("disabled", false);	// 密级
            root.find("[data-id='ys']").attr("disabled", false);	// 印数
            root.find("[data-id='initiativeOpenCheck']").attr("disabled", false);	// 主动公开
            root.find("[data-id='checkOpenCheck']").attr("disabled", false);	// 依审公开
            root.find("[data-id='unOpenCheck']").attr("disabled", false);	// 印数
            root.find("[data-id='topCpde']").attr("disabled", false);	// 不予公开
            root.find("[data-id='cs']").attr("disabled", false);	// 发文号
            root.find("[data-id='dzy']").attr("disabled", false);	// 发文号
            root.find("[data-id='fwrq']").attr("disabled", false);	// 发文日期
            root.find("[data-id='yx']").attr("disabled", false);	// 一校
            root.find("[data-id='ex']").attr("disabled", false);	// 二校
            root.find("[data-id='fwlx']").attr("disabled", false);	// 二校
            root.find("[data-id='cb']").attr("disabled", false);	// 抄报
            root.find("[data-id='zs']").attr("disabled", false);	// 主送
            root.find("[data-id='wjbt']").attr("disabled", false);	// 标题
            root.find("[data-id='receiveDocument']").attr("disabled", false);	// 来文依据
            root.find("[data-id='ztc']").attr("disabled", false);	// 主题词
            root.find("[data-id='bz']").attr("disabled", false);	// 备注
            root.find("[data-id='fwrq']").attr("disabled", false);	// 备注

        } else if (caseId == "A005") {
            root.find("[data-id='showSighture']").attr("style", "display:true");
        } else if (caseId == "A006") {
            //办公室编文号 
            root.find("[data-id='createSendNo']").attr("disabled", false);
            root.find("[data-id='createSendNoBtn']").attr("disabled", false);
            root.find("[data-id='printSendDoc']").attr("disabled", false);
            root.find("[data-id='choiceModel']").attr("disabled", false);
        }
    }

    function showOrganizationWind(data, type, callback) {
        var beforChoiceData;
        var afterChoiceData;
        $.Biz.OrganizationSelectWin(
                   function (data) {
                       if (data != null) {
                           afterChoiceData = data;
                           //var zsDiv = root.find("[data-id='" + type + "']");
                           //zsDiv.empty();
                           var name = "";
                           var saveName = "";
                           for (var i = 0 ; i < afterChoiceData.length; i++) {
                               //name = name + "<span>" + afterChoiceData[i].fullName + "&nbsp;&nbsp;</span>";
                               if (i == afterChoiceData.length - 1) {
                                   saveName += afterChoiceData[i].fullName;
                               } else {
                                   saveName += afterChoiceData[i].fullName + ' ';
                               }
                           }
                           //zsDiv.append(name);
                           callback(saveName);
                       }
                   }, beforChoiceData);
    }



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

    //审核意见
    function setCheckSuggetion(caseId) {
        $.fxPost("CommonFunctionSvc.data?action=GetWorkFlowCaseByCaseId", { caseid: caseId, actid: "A002" }, function (ret) {
            var listSupervision = ret.listSupervision;
            var listWork = ret.listWork;
            var dir = ret.dir;
            var listArray = [];

            //分局领导审核
            var fjldsh = root.find("[data-id='fjldsh']");
            //办公室领导审核
            var bgsldsh = root.find("[data-id='bgsldsh']");
            //拟稿部门负责人审核
            var ngbmfzrng = root.find("[data-id='ngbmfzrng']");
            //拟稿部门负责人
            var ngbmfzr = root.find("[data-id='ngbmfzr']");
            //签发
            var qf = root.find("[data-id='qf']");
            //会办单位意见
            var hbdwyj = root.find("[data-id='hbdwyj']");

            if (ret.ngbm.length > 0) {
                var ngbmfzrDiv = "<div>" + ret.ngbm[0].DPName + " " + ret.ngbm[0].CnName + "</div>&nbsp;";
                 ngbmfzr.append(ngbmfzrDiv);
            }

            //将审批意见格式化后送入相应的表格字段中
            listArray = $.ComFun.ChangeListToMatch(listWork, dir);
            for (var j = 0; j < listArray.length; j++) {
                //拟稿部门负责人拟稿
                if (listArray[j].actID == 'A002') {
                    $.ComFun.AppendDataToDiv(ngbmfzrng, listArray[j]);
                    //拟稿部门负责人
                    //if (ngbmfzr[0].innerHTML.indexOf(listArray[j].username) <= 0) {
                    //    var ngbmfzrDiv = "<div>" + listArray[j].username + "</div>&nbsp;";
                    //    ngbmfzr.append(ngbmfzrDiv);
                    //}
                } else if (listArray[j].actID == 'A003') {
                    $.ComFun.AppendDataToDiv(fjldsh, listArray[j]);
                } else if (listArray[j].actID == 'A004') {
                    $.ComFun.AppendDataToDiv(bgsldsh, listArray[j]);
                } else if (listArray[j].actID == 'A005') {
                    $.ComFun.AppendDataToDiv(qf, listArray[j]);
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
        $.getJSON("/Forms/B_OA_SendDoc/SendDocChoiceModelConfig_ZhiDui.txt", {}, function (data) {
            listData = data;
            win = $.Com.showFormWin(listData, function () {
            }, models.choiceModelGrid, root.find("[data-id='modelDiv']"), dlgOpts);

        });
    }

    // 选择模版生成正文
    function printCommonDoc(fwrqString, printType, caseid) {
        //发文字号
        var fwzh = root.find("[data-id='createSendNo']")[0].value;
        var content = JSON.stringify({ fwrqString: fwrqString, printType: printType, caseid: caseid, fwzh: fwzh });
        $.fxPost("B_OA_SendDoc_ZhiDuiSvc.data?action=PrintSendDocContent", { "content": content }, function (ret) {
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

$.Biz.B_OA_SendDoc_ZhiDui.prototype.version = "1.0";
