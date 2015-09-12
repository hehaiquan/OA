$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'emailwritebox' };
    this.show = function (module, root) {
        $.Biz.emailwritebox.show(module, root);

    };
});

$.Biz.emailwritebox = new function () {
    var root;
    var data;
    var wftool;
    var emailState = "newEmail";
    var models = {};
    var emailType;//邮件是回复类型还是普通的发送类型 reply是回复类型
    var replyParamData;//回复的邮件
    var replyContent;
    var editor; //富文本
    var changeSendData;
    var url = "";
    var emailModel;

    //邮件回复发件
    this.reply = function (param, type) {
        emailType = "reply";
        this.replyInit(param, type);
    };

    this.replyInit = function (param, type) {
        url = $.Biz.emailwritebox.url;
        replyParamData = param;
        $.fxPost("B_Email_One_Svc.data?action=GetEmailModel", "", function (ret) {
            //取消抄送送显示
            root.find("[data-id='CCMan']").attr("style", "display:none");
            root.find("[data-id='cancelAddCC']").attr("style", "display:none");
            root.find("[data-id='addCC']").attr("style", "display:display");
            //取消密送显示
            root.find("[data-id='CCSecretMan']").attr("style", "display:none");
            root.find("[data-id='cancelAddSecretCC']").attr("style", "display:none");
            root.find("[data-id='addSecretCC']").attr("style", "display:display");
            //返回按钮显示
            root.find("[data-id='backBtn']").attr("style", "display:display,float:right");

            var emailModel = ret.data;
            //var emailModel = $.extend({}, param);//models.detailmodel.viewModel;
            //cleanEntity(emailModel);
            if (param) {
                // emailModel.Mail_SendText = param.Mail_SendText;//内容

                emailModel.Mail_Title = "回复：" + param.Mail_Title; //主题
                emailModel.Mail_ReceivePersonId = param.Mail_SendPersonId + ";"; //接受人ID
                emailModel.Mail_ReceivePersonName = param.Mail_SendPersonName + ";"; //接收人
                replyParamData.haveReply = true;//原邮件标记--已回复
                emailModel.isSaveSendBox = true;//原邮件标记--保存已发送
                //editor.setData(param.Mail_SendText);

                replyContent = "<div>&nbsp;</div>" +
                    "<div><br></div>" +
                    "<div><br></div>" +
                    "<div>------------------&nbsp;原始邮件&nbsp;------------------</div>" +
                    "<div>" +
                    "<div><strong>发 件 人:</strong> " + param.Mail_SendPersonName + "</div>" +
                    "<div><strong>发送时间:</strong>" + param.Mail_SendDate +
                    "<div><strong>收 件 人:</strong> &quot;" + param.Mail_ReceivePersonName +
                    "<div><strong>主&nbsp;&nbsp;&nbsp;&nbsp题:</strong> " + param.Mail_Title + "</div>" +
                    "</div>" +
                    "<div>&nbsp;</div>" +
                    "<div>" + param.Mail_SendText + "</div>";

                if (!root) {
                    return;
                }

                editor.setData(replyContent);

                models.detailmodel.show(root.find("[data-id='editent']"), emailModel); // 空出模板让用户填写

            }
        });
    };

    //转发
    this.forward = function (param, type) {
        emailType = "zhuanfa";
        this.forwardInit(param, type);
    }
    //转发初始化
    this.forwardInit = function (param, type) {
        url = $.Biz.emailwritebox.url;
        replyParamData = param;
        $.fxPost("B_Email_One_Svc.data?action=GetEmailModel", "", function (ret) {
            //取消抄送送显示
            root.find("[data-id='CCMan']").attr("style", "display:none");
            root.find("[data-id='cancelAddCC']").attr("style", "display:none");
            root.find("[data-id='addCC']").attr("style", "display:display");
            //取消密送显示
            root.find("[data-id='CCSecretMan']").attr("style", "display:none");
            root.find("[data-id='cancelAddSecretCC']").attr("style", "display:none");
            root.find("[data-id='addSecretCC']").attr("style", "display:display");
            //返回按钮显示
            root.find("[data-id='backBtn']").attr("style", "display:display,float:right");

            var emailModel = ret.data;

            if (param) {
                emailModel.haveAttachment = param.haveAttachment;
                emailModel.Mail_SendAttachment = param.Mail_SendAttachment;
                emailModel.Mail_Title = "转发：" + param.Mail_Title; //主题
                //设置原数据
                replyParamData.hasChangeEmail = true;
                emailModel.isSaveSendBox = true;
                //editor.setData(param.Mail_SendText);

                replyContent = "<div>&nbsp;</div>" +
                    "<div><br></div>" +
                    "<div><br></div>" +
                    "<div>------------------&nbsp;原始邮件&nbsp;------------------</div>" +
                    "<div>" +
                    "<div><strong>发 件 人:</strong> " + param.Mail_SendPersonName + "</div>" +
                    "<div><strong>发送时间:</strong>" + param.Mail_SendDate +
                    "<div><strong>收 件 人:</strong> &quot;" + param.Mail_ReceivePersonName +
                    "<div><strong>主&nbsp;&nbsp;&nbsp;&nbsp题:</strong> " + param.Mail_Title + "</div>" +
                    "</div>" +
                    "<div>&nbsp;</div>" +
                    "<div>" + param.Mail_SendText + "</div>";

                if (!root) {
                    return;
                }

                editor.setData(replyContent);
                models.detailmodel.show(root.find("[data-id='editent']"), emailModel); // 空出模板让用户填写
            }
        });
    }

    //草稿箱编辑
    this.draft = function (param) {
        emailType = "chaogao";
        this.draftInit(param);
    }
    //草稿箱初始化
    this.draftInit = function (param) {
        url = $.Biz.emailwritebox.url;
        //返回按钮显示
        root.find("[data-id='backBtn']").attr("style", "display:display,float:right");

        $.fxPost("B_Email_One_Svc.data?action=GetEmailModel", "", function (ret) {
            if (param.isHaveCC == true) {
                root.find("[data-id='CCMan']").attr("style", "display:display");
                root.find("[data-id='cancelAddCC']").attr("style", "display:display");
                root.find("[data-id='addCC']").attr("style", "display:none");
            } else {
                root.find("[data-id='CCMan']").attr("style", "display:none");
                root.find("[data-id='cancelAddCC']").attr("style", "display:none");
                root.find("[data-id='addCC']").attr("style", "display:displayt");
            }

            if (param.isHaveSecretCC == true) {
                root.find("[data-id='CCSecretMan']").attr("style", "display:display");
                root.find("[data-id='cancelAddSecretCC']").attr("style", "display:display");
                root.find("[data-id='addSecretCC']").attr("style", "display:none");
            } else {
                root.find("[data-id='CCSecretMan']").attr("style", "display:none");
                root.find("[data-id='cancelAddSecretCC']").attr("style", "display:none");
                root.find("[data-id='addSecretCC']").attr("style", "display:display");
            }

            //var emailModel = $.extend({}, param);//models.detailmodel.viewModel;
            editor.setData(param.Mail_SendText);
            models.detailmodel.show(root.find("[data-id='editent']"), param);
        })
    }

    //再一次编辑
    this.editAgain = function (param) {
        emailType = "editAgain";
        this.editAgainInit(param);
    }
    //再编一次初始化
    this.editAgainInit = function (param) {
        url = $.Biz.emailwritebox.url;
        //返回按钮显示
        root.find("[data-id='backBtn']").attr("style", "display:display,float:right");
        $.fxPost("B_Email_One_Svc.data?action=GetEmailModel", "", function (ret) {
            var emailModel = ret.data;
            emailModel.Mail_ReceivePersonId = param.Mail_ReceivePersonId;
            emailModel.Mail_ReceivePersonName = param.Mail_ReceivePersonName;
            emailModel.haveAttachment = param.haveAttachment;
            emailModel.Mail_SendAttachment = param.Mail_SendAttachment;
            emailModel.Mail_Title = param.Mail_Title;
            emailModel.isHaveCC = param.isHaveCC;
            emailModel.CCName = param.CCName;
            emailModel.CCId = param.CCId;
            emailModel.isHaveSecretCC = param.isHaveSecretCC;
            emailModel.CCSecretId = param.CCSecretId;
            emailModel.CCSecretIdName = param.CCSecretIdName;
            var replyContent = param.Mail_SendText;
            editor.setData(replyContent);

            if (param.isHaveCC == true) {
                root.find("[data-id='CCMan']").attr("style", "display:display");
                root.find("[data-id='cancelAddCC']").attr("style", "display:display");
                root.find("[data-id='addCC']").attr("style", "display:none");
            } else {
                root.find("[data-id='CCMan']").attr("style", "display:none");
                root.find("[data-id='cancelAddCC']").attr("style", "display:none");
                root.find("[data-id='addCC']").attr("style", "display:displayt");
            }

            if (param.isHaveSecretCC == true) {
                root.find("[data-id='CCSecretMan']").attr("style", "display:display");
                root.find("[data-id='cancelAddSecretCC']").attr("style", "display:display");
                root.find("[data-id='addSecretCC']").attr("style", "display:none");
            } else {
                root.find("[data-id='CCSecretMan']").attr("style", "display:none");
                root.find("[data-id='cancelAddSecretCC']").attr("style", "display:none");
                root.find("[data-id='addSecretCC']").attr("style", "display:display");
            }

            if (!root) {
                return;
            }

            emailModel.isSaveSendBox = true;
            models.detailmodel.show(root.find("[data-id='editent']"), emailModel); // 空出模板让用户填写
        })
    }

    models.detailmodel = $.Com.FormModel({
        beforeBind: function (vm, root) {
            vm.isHaveCCFunction = function (isHaveCC) {
                //  $.Com.showMsg("isHaveSecretCC=" + isHaveCC());
                if (isHaveCC()) {
                      $.Com.showMsg(isHaveCC());
                    root.find("[data-id='CCMan']").attr('display', 'display');
                }
            }
        },
        isValidateRequired: true
    });


    this.show = function (module, _root) {
        $.Biz.emailwritebox.isInitial = true;
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/Email/EmailWriteBox.html", function () {
            //var href = document.loaction.href;
            //  $.Com.showMsg(href);
            root.find("[data-toggle='tooltip']").tooltip();

            $.fxPost("B_Email_One_Svc.data?action=GetEmailModel", "", function (ret) {
                ret.data.isSaveSendBox = true;

                if (!editor) {
                    editor = CKEDITOR.replace('editor1');
                    //editor.setData('<p>This is the editor data.</p>');
                    //editor.updateElement();
                }
                //if (emailType == "reply") {
                //    ret.data.Mail_Title = "回复：" + replyParamData.Mail_Title; //主题
                //    ret.data.Mail_ReceivePersonId = replyParamData.Mail_SendPersonId + ";"; //接受人ID
                //    ret.data.Mail_ReceivePersonName = replyParamData.Mail_SendPersonName + ";"; //接收人
                //    editor.on("loaded", function () {
                //        editor.setData(replyContent);
                //    });
                //}

                //$('#summernote').summernote({
                //    height: 400,                 // set editor height

                //    minHeight: null,             // set minimum height of editor
                //    maxHeight: null,             // set maximum height of editor
                //    lang: 'zh-CN', // default: 'en-US'
                //    focus: true,                 // set focus to editable area after initializing summernote});
                //});
                if ($.Biz.emailwritebox.type == 'huifu') {
                    $.Biz.emailwritebox.replyInit($.Biz.emailwritebox.choiceData, 'huifu');
                } else if ($.Biz.emailwritebox.type == 'zhuanfa') {
                    $.Biz.emailwritebox.forwardInit($.Biz.emailwritebox.choiceData, 'zhuanfa');
                } else if ($.Biz.emailwritebox.type == 'chaogao') {
                    $.Biz.emailwritebox.draftInit($.Biz.emailwritebox.choiceData, 'chaogao');
                } else if ($.Biz.emailwritebox.type == 'editAgain') {
                    $.Biz.emailwritebox.editAgainInit($.Biz.emailwritebox.choiceData, 'editAgain');
                }
                else {
                    emailModel = ret.data;
                    models.detailmodel.show(root.find("[data-id='editent']"), ret.data); // 空出模板让用户填写
                }
            });

            //保存邮件绑定事件
            root.find("[data-id='saveEmail']").bind("click", function () {
                var da = models.detailmodel.getData();
                saveData(da, "0");
            });
            //发送邮箱绑定事件
            root.find("[data-id='sendEmail']").bind("click", function () {
                var da = models.detailmodel.getData();
                saveData(da, "1");
            });

            //暂时放到show，如果还是要调用ko.cleanNode($(root)[0]);则需要放到afterbind或beforebind
            //取消事件绑定事件
            root.find("[data-id='cancel']").bind("click", function () {
                cleanUpModel();
            });

            //添加抄送
            root.find("[data-id='addCC']").bind("click", function () {
                root.find("[data-id='CCMan']").attr("style", "display:display");
                root.find("[data-id='cancelAddCC']").attr("style", "display:display");
                root.find("[data-id='addCC']").attr("style", "display:none");
                models.detailmodel.viewModel.isHaveCC(true);
            });

            //添加密送
            root.find("[data-id='addSecretCC']").bind("click", function () {
                root.find("[data-id='CCSecretMan']").attr("style", "display:display");
                root.find("[data-id='cancelAddSecretCC']").attr("style", "display:display");
                root.find("[data-id='addSecretCC']").attr("style", "display:none");
                models.detailmodel.viewModel.isHaveSecretCC(true);
            });

            //取消抄送
            root.find("[data-id='cancelAddCC']").bind("click", function () {
                root.find("[data-id='CCMan']").attr("style", "display:none");
                root.find("[data-id='cancelAddCC']").attr("style", "display:none");
                root.find("[data-id='addCC']").attr("style", "display:display");
                models.detailmodel.viewModel.isHaveCC(false);
            });

            //取消密送
            root.find("[data-id='cancelAddSecretCC']").bind("click", function () {
                root.find("[data-id='CCSecretMan']").attr("style", "display:none");
                root.find("[data-id='cancelAddSecretCC']").attr("style", "display:none");
                root.find("[data-id='addSecretCC']").attr("style", "display:display");
                models.detailmodel.viewModel.isHaveSecretCC(false);
            });

            //返回
            root.find("[data-id='backBtn']").bind("click", function () {
                cleanUpModel();
                root.find("[data-id='backBtn']").attr("style", "display:none");
                $.iwf.onmodulechange(url);
            });
        });
    };

    function cleanUpModel() {
        $.fxPost("B_Email_One_Svc.data?action=GetEmailModel", "", function (ret) {
            ret.data.isSaveSendBox = true;
            models.detailmodel.show(root.find("[data-id='editent']"), ret.data);// 空出模板让用户填写
            editor.setData("");
        });
    }

    // 保存为草稿
    function saveData(lawData, IsSend, callback) {
        lawData.Mail_SendText = editor.getData();
        //  $.Com.showMsg('数据保存成功！'); return;
        if (lawData == null || lawData == "") return;
        //var content = JSON.stringify({ "savedate": lawData });
        var content = JSON.stringify(lawData);
        var ParamData = JSON.stringify(replyParamData);
        $.post('B_Email_One_Svc.data?action=SaveMail', { JsonData: content, IsSend: IsSend, ReplyParamData: ParamData }, function (res) {
            var json = eval('(' + res + ')');
            if (json.success) {
                  $.Com.showMsg(json.msg);
                json.data.isSaveSendBox = true;
                models.detailmodel.show(root.find("[data-id='editent']"), json.data);// 空出模板让用户填写
                if (IsSend == 1) {
                    editor.setData("");
                    root.find("[data-id='cancelAddCC']").attr("style", "display:none");
                    root.find("[data-id='addCC']").attr("style", "display:display");
                    root.find("[data-id='cancelAddSecretCC']").attr("style", "display:none");
                    root.find("[data-id='addSecretCC']").attr("style", "display:display");
                    root.find("[data-id='CCSecretMan']").attr("style", "display:none");
                    root.find("[data-id='CCMan']").attr("style", "display:none");
                }
            }
            else {
                  $.Com.showMsg(json.msg);
            }

        });
    }
}