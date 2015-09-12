///新的工具栏，尽量和form.js配合
//控制显示和传递功能调用，包括：保存、发送、设置主办、退出主办、显示办理流程、设置协同、附件 ，下一步提供会签、传阅的支持，
define(function () {
    return function () {
        var root;
        var self = this;
        var toolbarUrl = "fx/com/wf/toolbar/toolbar.html";
        var OperaType = '';
        //事件
        this.onInit = null;
        this.onSave = null;
        this.onSend = null;

        //根据业务节点及工作流配置，设置按钮可见性
        function setBtnShow(Activity, ActivityModel) {
            //显示调试节点
            if (top.appConfig.isDebug == true) self.designActBtn.show();
            self.chartbutton.hide();

            //新建业务没有退件
            if (self.wfcase.caseid == undefined || self.wfcase.caseid == "") {
                self.backbutton.hide();
                ActivityModel.ToolActSetting.IsDisplayBackBtn = "0"
                self.chartbutton.hide();
                self.unlockbutton.hide();
                self.lockbutton.hide();
            }

            //多人办理
            if (Activity && Activity.UIDS && Activity.UIDS.length > 0) {
                //设为主办！！ 
                self.lockbutton.bind("click", function () {
                    $.fxPost("engine.data?action=setgestor", { caseid: self.wfcase.caseid, baid: self.wfcase.baid }, function (resText) {
                        root.find("[iwftype=MainGroup]").show();
                        self.unlockbutton.show();
                        self.lockbutton.hide();
                        self.ToolHelpInfo.isMyCase = true;
                    });
                });


                if (!Activity.UserID || Activity.UserID == "") {
                    self.lockbutton.show();
                    root.find("[iwftype=MainGroup]").hide();
                    self.ToolHelpInfo.isMyCase = false;
                    //return;
                }
                //退出办理
                self.unlockbutton.bind("click", function () {
                    $.fxPost("engine.data?action=exitgestor", { caseid: self.wfcase.caseid, baid: self.wfcase.baid }, function (resText) {
                        root.find("[iwftype=MainGroup]").hide();
                        self.lockbutton.show();
                        self.ToolHelpInfo.isMyCase = false;
                    });
                });

                if (self.ToolHelpInfo.isMyCase && Activity.UIDS && Activity.UIDS.length > 0) {
                    self.unlockbutton.show();
                    self.lockbutton.hide();

                }
            }
            else {
                self.unlockbutton.hide();
                self.lockbutton.hide();
            }


            if (ActivityModel.ToolActSetting.IsDisplayBackBtn == "0") self.backbutton.hide();
            if (ActivityModel.ToolActSetting.IsDisplayEndBtn == "0") self.endbutton.hide();
            if (ActivityModel.ToolActSetting.IsDisplaySendBtn == "1") {
                self.sendbtn2.show();
                self.sendbutton.hide();
            }

            //o.showBackBtn = resetFlag(o.showBackBtn, ActivityModel.ToolActSetting.IsDisplayBackBtn);
            //o.showEndBtn = resetFlag(o.showEndBtn, ActivityModel.ToolActSetting.IsDisplayEndBtn);
            //o.showAttachbutton = resetFlag(o.showAttachbutton, ActivityModel.ToolActSetting.IsDisplayAttachBtn);
            ////o.showRemarkBox = resetFlag(o.showRemarkBox, ActivityModel.ToolActSetting.IsDisplayRemarkBox);
            ////o.showRemarkList = resetFlag(o.showRemarkList, ActivityModel.ToolActSetting.IsDisplayRemarkList);
            //o.showSendBtn = resetFlag(o.showSendBtn, ActivityModel.ToolActSetting.IsDisplaySendBtn);

        }

        //选择后，显示按钮
        function UpdateChoseBtnText() {
            var DisplayPersonText = "请选择";
            if (self.NextReceiveInfo.ReceivePersons) {
                var Persons = self.NextReceiveInfo.ReceivePersons.PickByField("name");
                DisplayPersonText = Persons.join(",") == "" ? "请选择" : Persons.join(",");
            }

            var ActName = self.NextReceiveInfo.ActInfo.name;
            var FinalText = ActName + "(" + DisplayPersonText + ")";

            root.find("[iwftype=listchoseContent]").first().text(FinalText);
        }

        //获取参数
        this.getBizParams = function () {
            return {
                /// 业务新建时的临时编号
                guid: self.wfcase.guid,
                /// 下一步接收节点I
                receActid: self.NextReceiveInfo ? self.NextReceiveInfo.ActInfo.id : "",
                /// 业务接收者
                recivers: self.NextReceiveInfo ? self.NextReceiveInfo.ReceivePersons.PickByField("id") : [],
                /// 业务id
                caseid: self.wfcase.caseid,
                /// 办理节点id
                baid: self.wfcase.baid,
                /// 业务流程id
                flowid: self.wfcase.flowid,
                /// 业务流程节点id
                actid: self.wfcase.actid,
                /// 业务名称
                caseName: self.wfcase.caseName,
                /// 办理时限，工作日
                limit: 0,
                /// 到期时间
                ExpireDate: '',
                /// 操作
                Opera: OperaType
            };
        }

        this.show = function (wfData, div) {
            root = $(div);

            root.load(toolbarUrl, function () {

                self.lockbutton = root.find("[iwftype=Lock]");  //设为主办
                self.unlockbutton = root.find("[iwftype=Unlockbutton]").hide();  //退出主办
                self.endbutton = root.find("[iwftype=end]");  //办结
                self.backbutton = root.find("[iwftype=backbutton]");  //退件
                self.chartbutton = root.find("[iwftype=chartbutton]");  //办理流程
                self.sendbtn2 = root.find("[iwftype=sendbtn2]");  //办理流程
                self.sendbutton = root.find("[iwftype=send]");  //办理流程
                self.designActBtn = root.find("[iwftype=DesignNode]");//设计按钮
                self.Attachbutton = root.find("[iwftype=Attachbutton]");//设计按钮

                root.find("[iwftype=preActInfo]").hide();
                root.find("[iwftype=DraftDemo]").hide();

                self.ToolHelpInfo = wfData;


                //可选步骤及可提交人
                $.fxPost("engine.data?action=GetNeedActAndReceivers", { "flowid": self.wfcase.flowid, "actid": self.wfcase.actid, "caseid": self.wfcase.caseid }, function (data) {

                    if (data.DefaultNextInfo.lstDefaultPersons && data.DefaultNextInfo.lstDefaultPersons.length > 0) {
                        //
                    } else {
                        wfData.CurActivityModel.ToolActSetting.IsDisplaySendBtn = "0";//没有默认接受人不能显示单独的发送按钮
                    }

                    setBtnShow(wfData.curActivity, wfData.CurActivityModel);

                    //办结节点，不显示发送
                    if (wfData.CurActivityModel.Type == 2 || data.DefaultNextInfo.ID == "END") {
                        wfData.CurActivityModel.ToolActSetting.IsDisplaySendBtn = "1";
                        self.sendbtn2.hide()
                        self.sendbutton.hide();
                    }


                    if (wfData.CurActivityModel.ToolActSetting.IsDisplaySendBtn == "1") {
                        //如果单独显示发送
                        if (data.DefaultNextInfo.lstDefaultPersons) {
                            self.sendbtn2.find("span").text("发送：" + data.DefaultNextInfo.lstDefaultPersons.PickByField("name"))

                            self.sendbtn2.bind("click", function () {
                                OperaType = 'send';
                                self.NextReceiveInfo = {
                                    ActInfo: {
                                        id: data.DefaultNextInfo.ID,
                                        name: data.DefaultNextInfo.Name
                                    },
                                    ReceivePersons: data.DefaultNextInfo.lstDefaultPersons
                                };

                                var btn = this;
                                self.onSend();
                                var btn = $(this);
                                btn.attr("disabled", true);
                                setTimeout(function () { btn.attr("disabled", false); }, 1000);
                            });
                        }
                        if (self.onInit) self.onInit();
                    }
                    else {
                        //初始化下拉列表
                        $.iwf.getModel("fx/com/wf/selectRecv", function (modelc) {
                            var model = new modelc();
                            self.listchosebtn = root.find("[iwftype=sendlistchose]");
                            data.wfcase = self.wfcase;
                            model.onSelected = function (NextReceiveInfo) {
                                self.NextReceiveInfo = NextReceiveInfo;
                                UpdateChoseBtnText();
                            };

                            //强制设置步骤和接受人
                            self.SetActAndReceivers = function (arr, actid, callback) {
                                model.set(arr, actid);
                                if (callback) {
                                    callback();
                                }
                            }

                            var dropDiv = root.find("[iwftype=dropDiv]");
                            $(document).bind("mousedown", function (e) {
                                if (e.target == self.listchosebtn[0]) return;
                                if ($.contains(self.listchosebtn[0], e.target)) return;
                                if (e.target == dropDiv[0]) return;
                                if ($.contains(dropDiv[0], e.target)) return;
                                if (dropDiv.is(":visible")) {
                                    dropDiv.hide();
                                }
                            });
                            self.listchosebtn.bind("click", function () {
                                if (dropDiv.is(":visible")) {
                                    dropDiv.hide();
                                } else {
                                    function locationByButton(btn) {
                                        var $btn = $(btn);
                                        var y = $btn.offset().top + $btn.outerHeight();
                                        //if (o.fixed) y = $btn.outerHeight() + 5;
                                        var x = 5;
                                        if (window.screen.width >= 800) x = $btn.offset().left;
                                        dropDiv.css({
                                            left: x,
                                            top: y,
                                            width: (window.screen.width < 650) ? window.screen.width - 10 : 640,
                                            height: (window.screen.height < 800) ? window.screen.height - 100 : 700
                                        });

                                        var persontree = root.find("[iwftype=persontree]");
                                        persontree.height(dropDiv.height() - 10);

                                    }

                                    locationByButton(this);
                                    dropDiv.show();
                                }
                            });
                            model.show(data, dropDiv);

                            //} else {
                            //    self.listchosebtn.bind("click", function () {
                            //        var win = $.iwf.showWin({ width: 800, height: 900, title: '选择步骤及接收人' });
                            //        win.content().html(root.find("[iwftype=dropDiv]").html());

                            //        model.show(data, win.content());
                            //    });
                            //}

                            if (self.onInit) self.onInit();
                        })
                    }
                });

                root.find("[iwftype=save]").bind("click", function () {
                    self.onSave();
                });


                //初始化下拉列表
                $.iwf.getModel("fx/com/control/users", function (model) {
                    self.passlistchose = root.find("[iwftype=passlistchose]");

                    model.onselect = function (userlist) {
                        var DisplayPersonText = "请选择";
                        if (userlist.length > 0) {
                            var Persons = userlist.PickByField("name");
                            DisplayPersonText = Persons.join(",") == "" ? "请选择" : Persons.join(",");
                        }

                        self.passlist = userlist;

                        self.passlistchose.find("[iwftype=listchoseContent]").first().text(DisplayPersonText);
                    };



                    var dropDiv2 = root.find("[iwftype=dropDiv2]");
                    $(document).bind("mousedown", function (e) {
                        if (e.target == self.passlistchose[0]) return;
                        if ($.contains(self.passlistchose[0], e.target)) return;
                        if (e.target == dropDiv2[0]) return;
                        if ($.contains(dropDiv2[0], e.target)) return;
                        if (dropDiv2.is(":visible")) {
                            dropDiv2.hide();
                        }
                    });
                    self.passlistchose.bind("click", function () {
                        if (dropDiv2.is(":visible")) {
                            dropDiv2.hide();
                        } else {
                            function locationByButton(btn) {
                                var $btn = $(btn);
                                var y = $btn.offset().top + $btn.outerHeight();
                                var x = 5;
                                if (window.screen.width >= 800) x = $btn.offset().left;
                                dropDiv2.css({
                                    left: x,
                                    top: y,
                                    width: (window.screen.width < 650) ? window.screen.width - 10 : 640,
                                    height: (window.screen.height < 800) ? window.screen.height - 100 : 700
                                });

                                var persontree = root.find("[iwftype=persontree]");
                                persontree.height(dropDiv2.height() - 10);

                            }

                            locationByButton(this);
                            dropDiv2.show();
                        }
                    });
                    model.show({ multi: true }, dropDiv2.find("[iwftype=persontree]"));

                    if (self.onInit) self.onInit();
                })

                root.find("[iwftype=passbtn]").bind("click", function () {
                    var useridlist = self.passlist.PickByField("id");
                    $.fxPost("engine.data?action=setPass", { "baid": self.wfcase.baid, "caseid": self.wfcase.caseid, "casename": self.wfcase.title, "recelist": useridlist.join(";") }, function (data) {
                        $.Com.showMsg(data.msg);
                    })
                });

                root.find("[iwftype=Attachbutton]").bind("click", function () {
                    if (self.upload) self.upload();
                });

                root.find("[iwftype=sendbtn]").bind("click", function () {
                    var btn = this;
                    OperaType = 'send';
                    self.onSend();
                    var btn = $(this);
                    btn.attr("disabled", true);
                    setTimeout(function () { btn.attr("disabled", false); }, 1000);
                    //if (btn.EventIng) return;

                    //btn.EventIng = true;
                    //jQuery.proxy(Save, this)("save", function () {
                    //    btn.EventIng = false;
                    //});
                });

                root.find("[iwftype=end]").bind("click", function () {
                    $.Com.confirm("是否将业务办结？", function () {
                        OperaType = 'end';
                        self.onSend();
                        var btn = $(this);
                        btn.attr("disabled", true);
                        setTimeout(function () { btn.attr("disabled", false); }, 1000);
                    }, "提示");


                    //jQuery.proxy(Save, this)("save", function () {
                    //    btn.EventIng = false;
                    //});
                });
                //回退
                if (wfData.CurActivityModel.ToolActSetting.IsDisplayBackBtn != "0" && wfData.curActivity) {
                    self.backbutton.find("span").text("退回：" + wfData.curActivity.SenderName)


                    self.backbutton.bind("click", function () {
                        $.Com.confirm("是否将业务回退？", function () {
                            OperaType = 'back';
                            self.NextReceiveInfo = {
                                ActInfo: {
                                    id: wfData.curActivity.SendActID,
                                    name: wfData.curActivity.SendActName
                                },
                                ReceivePersons: [{
                                    id: wfData.curActivity.Sender,
                                    name: wfData.curActivity.SenderName
                                }]
                            };

                            var btn = this;
                            self.onSend();
                            var btn = $(this);
                            btn.attr("disabled", true);
                            setTimeout(function () { btn.attr("disabled", false); }, 1000);
                        }, "提示");
                    });
                }

                self.designActBtn.click(function () {
                    var params = {
                        flowid: self.wfcase.flowid,
                        actid: self.wfcase.actid
                    }
                    $.iwf.onmodulechange(params["flowid"] + ".fx/sys/wfdesign:" + JSON.stringify(params));
                });


            });
        }

        //this.showDraftMsg = function (msg) {
        //    root.find("[iwftype=DraftDemo]").show().text(msg);
        //}

        //强制设置接收人
        this.SetReceivers = function (arr) {
            // self.frametoolbar("ForceSetReceivers", arr);
        }

        //强制设置步骤和接受人
        this.SetActAndReceivers = function (actid, arr, callback) {
            //self.frametoolbar("ForceSetActAndReceivers", actid, arr, callback);
        }

        //获取选中要发送的下一步信息
        this.GetSelectActInfo = function () {
            //  return self.frametoolbar("GetSelfProperty", "NextReceiveInfo");
        }

        //获取当前节点信息
        this.GetCurActInfo = function () {
            //var obj = self.frametoolbar("GetSelfProperty", "ToolHelpInfo");
            //var result =
            //    {
            //        "CurrentActInfo": obj.CurrentActInfo,
            //        "BaseParams": self.baseParams,
            //        "UrlParams": ExternalWfcase
            //    };
            //return result;
        }

    }
}
);