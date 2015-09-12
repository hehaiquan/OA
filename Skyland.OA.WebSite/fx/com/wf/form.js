//新的工作流容器 //采用非单例模式了
define(function () {
    return function () {

        var me = this, caseInfo, design;
        //this.options = { key: 'WFformmodel' };
        var wfcase = {};            //工作流设置
        var draftTimerID = null;    //自动保存的计时器
        var wftool;                 //工作流工具栏
        var curFormModel;
        var wfData;  //业务工作流信息，包括办理意见列表、表单信息、当前结点业务模型和节点信息。 ///RemarkListData \curActivity \CurActivityModel \isMyCase \CurCaseStepInfo
        var DraftDemodiv, Formdiv; //草稿提示框  表单框
        var serviceUrl; //服务端
        var GetDataParams

        //初始化相应的表单
        function LoadFormModel(formName, root) {

            serviceUrl = curFormModel.options["Url"];

            root.load("fx/com/wf/toolbar/form.html", function () {

                var Tooldiv = root.find("[data-id=iwf_toolbar]")
                var preActInfodiv = root.find("[data-id=iwf_preActInfo]")
                DraftDemodiv = root.find("[data-id=iwf_DraftDemo]")
                var Attachmentdiv = root.find("[data-id=iwf_WF_Attachment]")
                Formdiv = root.find("[data-id=iwf_wf_Formpage]")
                var RemarkBoxdiv = root.find("[data-id=iwf_WF_RemarkBox]")
                var RemarkListdiv = root.find("[data-id=iwf_WF_RemarkList]")

                preActInfodiv.hide();

                GetDataParams = {
                    caseid: wfcase.caseid,
                    flowid: wfcase.flowid,
                    baid: wfcase.baid,
                    actid: wfcase.actid,
                    guid: wfcase.guid
                }

                require(["fx/com/wf/wftool", "fx/com/wf/remarklist", "fx/com/wf/remarkBox"], function (toolbar, remarklist, remarkbox) {
                    //传阅

                    if (wfcase.state == "passcase") {
                        var passbtn = $(' <div class="btn btn-success" iwftype="save" style="margin:10px;"> <span onselectstart="return false;"> <i class="fa fa-save"></i> 保存 </span> </div>').appendTo(Tooldiv);
                        passbtn.bind("click", function () {
                            GetDataParams.remark = (wftool.remarkBox) ? wftool.remarkBox.get() : "";
                            $.fxPost("engine.data?action=passRemark", GetDataParams, function (data) { });
                        });
                        wftool.remarkBox = new remarkbox();
                        wftool.remarkBox.show(RemarkBoxdiv);
                        DraftDemodiv.hide();
                    }
                    else if (wfcase.state == "doingcase") {  //待办业务 非新建
                        wftool.toolbar = new toolbar();
                        wftool.toolbar.wfcase = wfcase;
                        wftool.toolbar.show(wfData, Tooldiv);
                        wftool.toolbar.onSave = function () { saveData() };
                        wftool.toolbar.onSend = function () { send() };
                        wftool.toolbar.upload = function () { attachmentControl.upload(); };

                        if (wfData.CurActivityModel.ToolActSetting.IsDisplayRemarkBox != "0") {
                            wftool.remarkBox = new remarkbox();
                            wftool.remarkBox.show(RemarkBoxdiv);
                        }

                        if (!wfcase.guid) { //非新建业务
                            //if (wfData.CurActivityModel.ToolActSetting.IsDisplayRemarkBox != "0") {
                            //    wftool.remarkBox = new remarkbox();
                            //    wftool.remarkBox.show(RemarkBoxdiv);
                            //}
                            if (wfData.RemarkListData.length > 0) {
                                PrevActInfo = wfData.RemarkListData[wfData.RemarkListData.length - 1];
                                if (!$.trim(PrevActInfo.senderRemark)) PrevActInfo.senderRemark = "无意见";
                                PrevActInfo.remark = PrevActInfo.senderRemark.replace("<br/>", "；");
                                PrevActInfo.username = PrevActInfo.sendername.replace("<br/>", ",");
                                PrevActInfo.completedate = $.Com.formatDate(PrevActInfo.completedate);

                                var tmpl = preActInfodiv.show().html();
                                preActInfodiv.html(tmpl.replace$Object(PrevActInfo));
                            }
                            if (wfData.curActivity && wfData.curActivity.UserName != null && wfData.curActivity.UserName != "")  //协办业务
                            {
                                DraftDemodiv.text("该业务由 " + wfData.curActivity.UserName + " 主办");
                            }
                        }
                    } else if ((wfcase.baid == undefined && wfcase.caseid) || wfData.CurCaseStepInfo.ActState != "DOING")// 在办或办结
                    {
                        if (wfcase.state == "endcase") DraftDemodiv.text("业务已办结");
                        else DraftDemodiv.text("非在办业务");
                    }

                    //新建业务没有批注过程
                    if (wfcase.caseid && wfcase.caseid != "" && (!wfData.CurActivityModel || wfData.CurActivityModel.ToolActSetting.IsDisplayRemarkList != "0")) {
                        wftool.remarkList = new remarklist();
                        $.fxPost("engine.data?action=getPass", { caseid: wfcase.caseid }, function (data) {
                            wftool.remarkList.show({
                                RemarkListData: wfData.RemarkListData,
                                PassListData: data
                            }, RemarkListdiv);
                        });
                    } else {
                        Formdiv.parent().css("width", "100%");
                    }

                    //附件
                    $.fxPost("SkylandAttach.data?action=GetCaseAttach", { caseid: (wfcase.caseid) ? wfcase.caseid : wfcase.guid }, function (AttachmentList) {

                        attachmentControl = Attachmentdiv.AttachBar({
                            readOnly: (wfcase.baid == undefined),
                            Params: wfcase,
                            attachbutton: null,//Tooldiv.find("[iwftype=Attachbutton]"),
                            Attachments: AttachmentList  // data["AttachmentListData"]
                        })
                        wftool.attachmentControl = attachmentControl;
                    });

                    showForm(formName);
                })
            });
        }

        //显示表单
        function showForm(formName) {

            serviceUrl = curFormModel.options["Url"];
            var GetDataParams = {
                caseid: wfcase.caseid,
                flowid: wfcase.flowid,
                baid: wfcase.baid,
                actid: wfcase.actid,
                guid: wfcase.guid
            }
            //表单数据服务
            function getDataUrl() {
                //自动认知GetData服务地址Html服务地址
                var GetUrl;
                //如果是node.js的服务
                if (serviceUrl.substr(serviceUrl.length - 1) == "/")
                    GetUrl = serviceUrl + "get";
                else
                    GetUrl = serviceUrl + "?action=GetData";
                return GetUrl;
            }
            //页面模板
            function getHtmlPath() {
                var filePath;

                if (formName.indexOf('/'))
                    filePath = formName;
                else {
                    filePath = appConfig.models[formName];
                    filePath = filePath.substring(0, filePath.lastIndexOf("."));//后缀名 GetFileWithOutExtension(filePath);
                }

                return curFormModel.options["HtmlPath"] ? curFormModel.options["HtmlPath"] : filePath + ".html";
            }

            //表单只读
            function setFormReadonly() {
                if ($.Com.setReadOnly) {
                    var ActivityModel = wfData.CurActivityModel;
                    if (ActivityModel && ActivityModel.ToolActSetting) var ReadonlyInfo = ActivityModel.ToolActSetting.FormReadOnlySetting;
                    $.Com.setReadOnly(Formdiv, ReadonlyInfo, null, curFormModel);
                }
            }

            //加载业务表单
            Formdiv.load(getHtmlPath(), function () {

                function handlerPageHtml() {
                    var tt = Formdiv.find("[data-id=formContainer]");
                    if (tt.length == 0) return;
                    var page = tt.clone();
                    do {
                        tt = tt.parent();
                    } while (tt.parent().attr("data-id") != "iwf_wf_Formpage")

                    tt.empty().append(page);
                    page.unwrap();
                }
                handlerPageHtml();
                setFormReadonly();

                //curFormModel.options["saveData"] = saveData;
                //curFormModel.options["fixed"] = false;
                //curFormModel.options["wfcase"] = wfcase;
                //curFormModel.options["afterInit"] = function () {
                //    //调试模式下可以测试写到数据库中
                //    //if (appConfig.isDebug == true) wftool.GetDom("savetodb").show();
                //    //多人模式
                //    //自动保存草稿目前定成1分钟=60s一次,当isDebug==true也就是调试模式下将不实行自动保存草稿，假如是多人协作的步骤,不自动定时写草稿
                //    saveDraft();
                //    //表单只读
                //    if ($.Com.setReadOnly) {
                //        var obj = wfData.CurActivityModel;
                //        if (obj && obj.ToolActSetting) var ReadonlyInfo = obj.ToolActSetting.FormReadOnlySetting;
                //        $.Com.setReadOnly(Formdiv, ReadonlyInfo, null, curFormModel);
                //    }
                //    //先拿草稿，出错再拿数据库的数据
                //    jQuery.QueryResult("IWorkDraftManage.data?action=ReadCaseFromDraft", GetDataParams,
                //       function (data) {
                //           if (data.createdate)
                //               wftool.showDraftMsg("草稿保存时间：" + $.Com.formatDate(data.createdate));
                //           curFormModel.show(Formdiv, data.data, wftool);
                //       },
                //        function () {
                //            $.fxPost(GetDataUrl, GetDataParams, function (data) {
                //                curFormModel.show(Formdiv, data, wftool);
                //            });
                //        }
                //        );
                //};

                //如果是待办箱，先拿草稿，出错再拿数据库的数据
                if (wfcase.state == "doingcase") {
                    //if (wfcase.caseid) {
                        jQuery.QueryResult("IWorkDraftManage.data?action=ReadCaseFromDraft", GetDataParams,
                           function (data) {
                               if (data.createdate) DraftDemodiv.show().text("草稿保存时间：" + $.Com.formatDate(data.createdate));
                               curFormModel.show(Formdiv, data.data, wftool);
                               if (wftool.remarkBox) wftool.remarkBox.set(data.data.iwf_remark)
                           },
                            function () {
                                $.fxPost(getDataUrl(), GetDataParams, function (data) {
                                    curFormModel.show(Formdiv, data, wftool);
                                });
                            });
                    //} else {
                    //    $.fxPost(getDataUrl(), GetDataParams, function (data) {
                    //        curFormModel.show(Formdiv, data, wftool);
                    //    });
                    //}
                } else {
                    $.fxPost(getDataUrl(), GetDataParams, function (data) {
                        curFormModel.show(Formdiv, data, wftool);
                    });
                }

            });

        }

        //保存数据，如果在线就保存到服务器，离线就保存在本机；
        function saveData() {
            if ($.iwf.online == false) {
                var CacheFormData = curFormModel.getCacheData();
                var OfflineVALUE = eval("(" + CacheFormData + ")");
                jQuery.OfflineSubmit("IWorkDraftManage.data?action=ReadCaseFromDraft", GetDataParams, OfflineVALUE, function () {
                    DraftDemodiv.show().text("草稿已离线保存在本机 " + $.Com.formatDate());
                });
                return false;
            } else {
                //如果是点击了普通保存按钮且不是会签模式
                if (wfData.CurActivityModel.MultWorkType != "sign") {
                    if (!curFormModel.getCacheData) { alert("表单未实现getCacheData方法"); return false; }
                    var CacheFormData = curFormModel.getCacheData();
                    if (CacheFormData == undefined) { alert("getCacheData没有返回值"); return false; }
                    var cachedatavalue = JSON.parse(CacheFormData);
                    cachedatavalue.iwf_remark = (wftool.remarkBox) ? wftool.remarkBox.get() : "";
                    var FinalParams = $.extend({}, GetDataParams, { content: JSON.stringify(cachedatavalue) });
                    jQuery.PackResult("IWorkDraftManage.data?action=WriteCaseToDraft", FinalParams, function () {
                        //$.iwf.onsearch('doingcase');//刷新待办箱,因为只有待办箱才有草稿这回事
                        if ($.iwf.searchDoingcase) $.iwf.searchDoingcase();

                        DraftDemodiv.show().text("草稿已保存 " + $.Com.formatDate());

                        jQuery.OfflineRemove("IWorkDraftManage.data?action=ReadCaseFromDraft", GetDataParams, function () {
                            //alert("清除离线完成");
                        });
                    });

                    return false;
                }

            }
        }
        //保存草稿
        function saveDraft() {
            var IsMultiplayer = false;

            IsMultiplayer = wfData.isMyCase;// wftoolbar.GetToolProperty("ToolHelpInfo").isMyCase;
            if (appConfig.isDebug == false && wfcase.state == "doingcase" && IsMultiplayer == false) {
                draftTimerID = setInterval(function () {
                    // 只有当前模块才有自动保存的功能
                    if ($.iwf.curModel == undefined) return;
                    if ($.iwf.curModel.wfcase == undefined) return;
                    if ($.iwf.curModel.wfcase.caseid != wfcase.caseid) return;
                    //退出办理
                    if (wfData.isMyCase == false) return;
                    var CacheFormData = curFormModel.getCacheData();
                    var cachedatavalue = JSON.parse(CacheFormData);
                    cachedatavalue.iwf_remark = (wftool.remarkBox) ? wftool.remarkBox.get() : "";
                    var FinalParams = $.extend({}, GetDataParams, { content: JSON.stringify(cachedatavalue) });
                    jQuery.PackResult("IWorkDraftManage.data?action=WriteCaseToDraft", FinalParams, function () {
                        //$.iwf.onsearch('doingcase');//刷新待办箱,因为只有待办箱才有草稿这回事
                        if ($.iwf.searchDoingcase) $.iwf.searchDoingcase();

                        DraftDemodiv.show().text("草稿已自动保存 " + $.Com.formatDate());
                        //alert("清除离线完成");
                        jQuery.OfflineRemove("IWorkDraftManage.data?action=ReadCaseFromDraft", GetDataParams, function () { });

                    });
                }, 60000);
            }
        }
        //发送
        function send() {

            var Params = wftool.toolbar.getBizParams();

            /// 办理意见
            Params.remark = (wftool.remarkBox) ? wftool.remarkBox.get() : "";
            /// 附件
            Params.attachkeys = (wftool.attachmentControl) ? wftool.attachmentControl.GetAllAttachKeys() : [];


            if (Params.recivers.length < 1 && Params.Opera != "end") { $.Com.showMsg("请至少选中1个发送人"); return; }

            if (!curFormModel.getData) { $.Com.showMsg("缺少重写函数"); return; }

            var sendParams = {
                BizParams: JSON.stringify(Params),
                content: curFormModel.getData()
            }

            if ((sendParams.content) == false) return;

            var sendurl;
            if (serviceUrl.substr(serviceUrl.length - 1) == "/")
                sendurl = serviceUrl + "send";
            else
                sendurl = serviceUrl + "?action=send";

            $.fxPost(sendurl, sendParams, function (data) {


                $.Com.showMsg(data.msg, "提示", null, function () {
                    if ($.iwf.searchDoingcase) $.iwf.searchDoingcase();
                    if ($.iwf.searchDonecase) $.iwf.searchDonecase();

                    var hash = $.iwf.gethash();
                    setTimeout(function () { $.Com.Close(hash.module) }, 10);
                });


                // self.NavClose();
                // if (self.aftersend) self.aftersend();//触发发送完毕事件
                // if (callback) callback();
            });
        }


        function getFormModel(curCaseStepInfo, callback) {

            //新FPath动态加载模式
            if (curCaseStepInfo.FPath) {
                $.iwf.getModel(curCaseStepInfo.FPath, function (formModel) {

                    //LIMS的方式
                    if (!(curCaseStepInfo.FPath.indexOf('/')) && !formModel.prototype.version) {
                        //formModel(root, wfcase);
                        //return;
                        alert("已经过时了！！");
                    }

                    var newModel = new formModel();

                    //动态获取当前表单业务函数，对于有些特殊的情况，由指定的model根据getModel返回值确定实际要加载的表单
                    if (newModel.getModel) {
                        newModel.getModel(wfcase, function (formName) {
                            if (formName && formName != "") {
                                $.iwf.getModel(formName, function (formModel) {
                                    callback(new formModel(), formName);

                                });
                            } else
                                alert('没有获得对应的函数！请检查工作流制定模块的getModel()');
                        });
                    }
                    else {
                        curFormModel = newModel;
                        callback(newModel, curCaseStepInfo.FPath);
                    }

                });
            }
            else {
                $.Com.showMsg("请配置表单", "提示", null, function () { $.iwf.onmoduleclose(module.module); });
            }
        };


        //关闭Tab页的回调  //清除定期保存
        this.close = function () { if (draftTimerID) clearInterval(draftTimerID); };

        this.resize = function (w, h) {
            var Tool_H = 80; //Tooldiv.outerHeight();
            if (Formdiv) Formdiv.css("max-height", (h - Tool_H) + 'px');// height(root_H - Tool_H);
        }

        this.show = function (module, root) {

            function closeMe() { $.iwf.onmoduleclose(module.module); }

            var json = module.params.replace(/"/g, "'");
            wfcase = eval('({' + json + '})');
            wftool = { wfcase: wfcase };
            if (root.children().length == 0) {

                //构造离线需要的Params
                //var params = {
                //    caseid: wfcase.caseid,
                //    flowid: wfcase.flowid,
                //    guid: wfcase.guid
                //}

                $.fxPost("engine.data?action=GetToolHelpInfo", wfcase, function (data) {
                    wfData = data;
                    if (wfcase.baid) {
                        if (data.CurCaseStepInfo.ActState == "DONE") {
                            $.Com.showMsg("此步已过期", "提示", null, function () {
                                $.iwf.onmoduleclose(module.module);
                            });
                            return;
                        }
                        if (data.CurCaseStepInfo.ActState == "STOP") {
                            $.Com.showMsg("该业务停办");
                        }
                        if (data.CurCaseStepInfo.ActState == "WAITING") {
                            $.Com.showMsg("该业务正在等待可以办理");
                        }
                    }

                    getFormModel(data.CurCaseStepInfo, function (model, formName) {
                        curFormModel = model;
                        //如果是非表单模块
                        if (model.options["Url"] == undefined)
                            model.show(module, root);
                        else if (wfcase.isFormOnly) {
                            Formdiv = root;
                            showForm(formName);
                        }
                        else LoadFormModel(formName, root);
                    })
                });
            }
        };
    }
});