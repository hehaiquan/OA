$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'emailSearch' };
    this.show = function (module, root) {
        $.Biz.emailSearch.show(module, root);
    };
});


$.Biz.emailSearch = new function () {
    var root;
    var data;
    var self = this;
    var models = {};
    var cleanModel;//清空的model
    var choiceData;//选中的邮件
    var choiceSingleItem;//在表中查看的对象

    models.gridModel = $.Com.GridModel({
        keyColumns: "ID",//主键字段
        beforeBind: function (vm, _root) {//表格加载前
            //设置字段
            vm.getIsSeeName = function (isSeeName, haveReply, hasChangeEmail) {
                var emailImage;

                //未查看
                if (isSeeName() == "未读") {
                    emailImage = "<img src='../resources/images/colums/email/unopen.png' data-toggle='tooltip' title='未读'/>";
                } else {
                    //已查看
                    //return "<span style=\"color:#339900\">已读</span>";
                    emailImage = "<img src='../resources/images/colums/email/email_open.png' data-toggle='tooltip' title='已读'/>";

                    //已回复
                    if (haveReply() == true) {
                        emailImage = "<img src='../resources/images/colums/email/email_reply.png' data-toggle='tooltip' title='已回复'/>";
                    }
                    if (hasChangeEmail() == true) {
                        emailImage = "<img src='../resources/images/colums/email/change_send.png' data-toggle='tooltip' title='已转发'/>";
                    }
                }
                return emailImage;
            }

            //vm.setIsSeeName = function (e_id) {

            //    //将邮件变为未读
            //    $.fxPost("B_Email_One_Svc.data?action=UpdateB_EmailByIdSetMail_IsSee", { id: emialId, mailIsSee: 0 }, function (ret) {
            //        if (ret.success) {
            //            for (var i = 0; i < data.dataList.length; i++) {
            //                if (data.dataList[i].ID == e_id()) {
            //                    data.dataList[i].isSeeName = '未读';
            //                    models.gridModel.show(root.find('[data-role="emailTableGrid"]'), data.dataList);
            //                    break;
            //                }
            //            }
            //            //刷新未读取数量
            //            models.countModel.show(root.find("[data-id='tittleInform']"), ret.data);
            //        }
            //    })
            //}
            vm.fileterMailConten = function (mailTile) {
                if (mailTile() == null) {
                    return "（无主题）";
                }
                var totoalContent = mailTile();
                var substring = '';
                if (totoalContent.length > 40) {
                    substring = totoalContent.substr(0, 40) + '...';
                } else {
                    substring = totoalContent;
                }

                return substring;
                //var mailText = mailText().replace(/<[^>]+>/g, "");
                var totoalContent = mailTile();
                var substring = '';
                if (totoalContent.length > 40) {
                    substring = totoalContent.substr(0, 40) + '...';
                } else {
                    substring = totoalContent;
                }

                return substring;
            }

            //设置收藏
            vm.getIsCollection = function (isCollection) {
                if (isCollection() == false) {
                    //return "<span style=\"color:red\">未读</span>";
                    return "<img src='../resources/images/colums/email/unblind_start.png'/>";
                } else {
                    //return "<span style=\"color:#339900\">已读</span>";
                    return "<img src='../resources/images/colums/email/start.png'/>";
                }
            }

            //标记处理
            vm.getIsMark = function (markId, markName) {
                if (markName() != null && markName() != "") {
                    var length = markName().length * 12;
                    var r = "<div style='color: white;float:right;' data-id='" + markId() + "'><span style='font-size: 12px;'>" + markName() + "</span></div>";
                    return r;
                }
            }

            //设置为收藏/不收藏
            vm.setIsCollection = function (id, isCollection) {
                var emailId = id();
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID == emailId) {
                        if (isCollection() == false) {
                            data[i].isCollection = true
                            //修改后台
                            $.fxPost("B_Email_One_Svc.data?action=UpdateEmail", { JsonData: JSON.stringify(data[i]) }, function (ret) {
                            })
                        } else {
                            data[i].isCollection = false;
                            //修改后台
                            $.fxPost("B_Email_One_Svc.data?action=UpdateEmail", { JsonData: JSON.stringify(data[i]) }, function (ret) {
                            })
                        }
                        models.gridModel.show(root.find('[data-role="emailTableGrid"]'), data);
                        break;
                    }
                }
            }

            //删除标签
            vm.setCancelMark = function (id) {
                var emailId = id();
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID == emailId) {
                        data[i].markId = "";
                        data[i].markName = "";
                        data[i].markColor = "";
                        //修改后台
                        $.fxPost("B_Email_One_Svc.data?action=UpdateEmail", { JsonData: JSON.stringify(data[i]) }, function (ret) {
                        })
                        models.gridModel.show(root.find('[data-role="emailTableGrid"]'), data);
                        break;
                    }
                }
            }

            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.Com.formatDate(date());
                return "<span >" + d + "</span>";
            }
        },
        elementsCount: 10,
        edit: function (item, callback) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].ID == item.ID) {
                    //将所选对象存入全局
                    choiceData = data[i];
                    break;
                }
            }
            if (item.Mail_IsSee = '0') {
                //设置为已查看
                UpdateB_EmailByIdSetMail_IsSee(item.ID, '1');
            }

            //可编辑弹窗
            item.emailRecieveDate = $.Com.formatDate(item.emailRecieveDate);

            showEmailDetailPage(item, callback);
        }
    });

    models.searchModel = $.Com.FormModel({});

    //邮件查看model
    models.detailmodel = $.Com.FormModel({
        beforeBind: function (vm, _root) {
            //邮件的标记
            vm.getIsMark = function (markId, markName) {
                if (markName() != null && markName() != "") {
                    var length = markName().length * 12;
                    var r = "<div style='color: white;float:right;' data-id='" + markId() + "'><span style='font-size: 12px;'>" + markName() + "</span></div>";
                    return r;
                }
            }

            //设置为不收藏
            vm.setCollection = function () {
                choiceData.isCollection = false;
                $.fxPost("B_Email_One_Svc.data?action=UpdateEmail", { JsonData: JSON.stringify(choiceData) }, function (ret) {
                })
                models.detailmodel.show(root.find("[data-id='detailView_Part']"), choiceData);

            }

            //设置为收藏
            vm.setUnCollection = function () {
                choiceData.isCollection = true;
                $.fxPost("B_Email_One_Svc.data?action=UpdateEmail", { JsonData: JSON.stringify(choiceData) }, function (ret) {
                })
                models.detailmodel.show(root.find("[data-id='detailView_Part']"), choiceData);
            }

            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.Com.formatDate(date());
                return d;
            }

            //删除标签
            vm.setCancelMark = function (id) {
                var emailId = id();
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID == emailId) {
                        data[i].markId = "";
                        data[i].markName = "";
                        data[i].markColor = "";
                        //修改后台
                        $.fxPost("B_Email_One_Svc.data?action=UpdateEmail", { JsonData: JSON.stringify(data[i]) }, function (ret) {
                        })
                        models.detailmodel.show(root.find("[data-id='detailView_Part']"), data[i]);
                        loadData();
                        break;
                    }
                }
            }
        }
    });

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/Email/EmailSearch.html", function() {
            loadData();

            //表格界面的按钮绑定
            //删除 
            root.find("[data-id='btnCleanUp']").bind("click", function() {
                models.searchModel.show(root.find('[data-id="searchForm"]'), cleanModel);
            });

            //搜索 
            root.find("[data-id='btnSearch']").bind("click", function() {
                var model = models.searchModel.getData();
                if (!model && model == null) {
                    return false;
                }
                SearchData(model);
            });

            //上一页
            root.find("[data-id='nextMail_Top']").bind("click", function() {
                var emailId = choiceData.ID;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID == emailId) {
                        if (i == 0) {
                              $.Com.showMsg("已经是第一封邮件");
                        } else {
                            choiceData = data[i - 1];
                            showEmailDetailPage(choiceData, "");

                        }
                        //设置为已查看
                        UpdateB_EmailByIdSetMail_IsSee(choiceData.ID, '1');
                    }
                }
            });

            //下一页
            root.find("[data-id='nextMail']").bind("click", function() {
                var emailId = choiceData.ID;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID == emailId) {
                        if (i == data.length - 1) {
                              $.Com.showMsg("已经是最后一封邮件");
                        } else {
                            choiceData = data[i + 1];
                            showEmailDetailPage(choiceData, "");
                        }
                        //设置为已查看
                        UpdateB_EmailByIdSetMail_IsSee(choiceData.ID, '1');
                    }
                }
            });

            //邮件查看界面中的返回按钮
            root.find("[data-id='backButton']").bind("click", function() {
                root.find("[data-id='inBoxGrid_Part']").attr("style", "display:display");
                root.find("[data-id='detailView_Part']").attr("style", "display:none;");
            });

            //回复按钮
            root.find("[data-id='replyEmail']").bind("click", function() {
                //$.iwf.onmodulechange("m2.emailwritebox:{type:'writebox',receiver:'" + 'xxx' + "'}");
                $.Biz.emailwritebox.choiceData = choiceData;
                $.Biz.emailwritebox.type = 'huifu';
                if ($.Biz.emailwritebox.isInitial) {
                    $.Biz.emailwritebox.reply(choiceData, 'huifu');
                }
                $.iwf.onmodulechange('m2.emailwritebox:{type:"writebox"}');
                // $.Biz.emailwritebox.reply(choiceData, 'huifu');

            });

            //转发按钮
            root.find("[data-id='changeSend_Two']").bind("click", function() {

                $.Biz.emailwritebox.choiceData = choiceData;
                $.Biz.emailwritebox.type = 'zhuanfa';
                if ($.Biz.emailwritebox.isInitial) {
                    $.Biz.emailwritebox.forward(choiceData, 'zhuanfa');
                }
                $.iwf.onmodulechange('m2.emailwritebox:{type:"writebox"}');
                // $.Biz.emailwritebox.reply(choiceData, 'huifu');
            });
            //删除 
            root.find("[data-id='deleteBtn_Two']").bind("click", function() {
                if (!confirm("确定要删邮件吗？")) return false;
                var deleteList = [];
                deleteList.push(choiceData);
                DeleteDateList(deleteList, '0');
                root.find("[data-id='inBoxGrid_Part']").attr("style", "display:display");
                root.find("[data-id='detailView_Part']").attr("style", "display:none;");
            });

            //彻底删除
            root.find("[data-id='thoroughDeleteBtn_Two']").bind("click", function() {
                if (!confirm("确定要删邮件吗，删除后将无法恢复")) return false;
                var deleteList = [];
                deleteList.push(choiceData);
                DeleteDateList(deleteList, '1');
                root.find("[data-id='inBoxGrid_Part']").attr("style", "display:display");
                root.find("[data-id='detailView_Part']").attr("style", "display:none;");
            });

            root.find("[data-id='advanceSearch']").bind("click", function() {
                root.find("[data-id='searchForm']").slideToggle("fast");
            });
        });
    }

    function loadData() {
        $.fxPost("B_Email_One_Svc.data?action=GetAllEmailList", {}, function (ret) {
            cleanModel = ret.model;
            ret.model.sCheckText = true;
            ret.model.sCheckTittle = true;
            data = ret.emailList;
            models.searchModel.show(root.find('[data-id="searchForm"]'), ret.model);
            models.gridModel.show(root.find('[data-role="emailTableGrid"]'), ret.emailList);

        });
    }

    function SearchData(model) {
        $.fxPost("B_Email_One_Svc.data?action=SearchEmailByConditon", { JsonData: JSON.stringify(model) }, function(ret) {
            data = ret.data.dataList;
            models.gridModel.show(root.find('[data-id="emailTableGrid"]'), ret.data.dataList);
        });
    }

    //将邮件内容设置为已查看
    function UpdateB_EmailByIdSetMail_IsSee(ID, mailIsSee) {
        //将邮件变为已读
        $.fxPost("B_Email_One_Svc.data?action=UpdateB_EmailByIdSetMail_IsSee", { id: ID, mailIsSee: mailIsSee }, function (ret) {
            if (ret.success) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].ID == ID) {
                        if (mailIsSee == 1) {
                            data[i].Mail_IsSee = '1';
                            data[i].isSeeName = '已读';
                            models.gridModel.show(root.find('[data-role="emailTableGrid"]'), data);
                            break;
                        } else {
                            data[i].Mail_IsSee = '0';
                            data[i].isSeeName = '未读';
                            models.gridModel.show(root.find('[data-role="emailTableGrid"]'), data);
                            break;
                        }
                    }
                }
            }
        })
    }

    //邮件详细查看
    function showEmailDetailPage(item, callback) {
        root.find("[data-id='dataContent']").empty();
        root.find("[data-id='dataContent']").append(item.Mail_SendText);
        root.find("[data-id='inBoxGrid_Part']").attr("style", "display:none");
        root.find("[data-id='detailView_Part']").attr("style", "display:display;height:100%");

        root.find("[data-id='haveAttachment']").attr("style", "display:none");
        if (item.haveAttachment == true) {
            root.find("[data-id='haveAttachment']").attr("style", "display:display");
        }

        root.find("[data-id='isHaveCC']").attr("style", "display:none");
        if (item.isHaveCC == true) {
            root.find("[data-id='isHaveCC']").attr("style", "display:display");
        }

        root.find("[data-id='isHaveSecretCC']").attr("style", "display:none");
        if (item.isHaveSecretCC == true) {
            root.find("[data-id='isHaveSecretCC']").attr("style", "display:display");
        }


        models.detailmodel.show(root.find("[data-id='detailView_Part']"), item);
    }
}