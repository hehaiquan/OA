
$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'emailoutbox' };
    this.show = function (module, root) {
        $.Biz.emailoutbox.show(module, root);
    };
});

$.Biz.emailoutbox = new function () {
    var root;
    var data;
    var curData;
    var models = {};
    var choiceData;//选中的邮件
    var choiceSingleItem;//在表中查看的对象
    var self = this;
    var emailMarkModel;
    var emailDocumentModel;

    //文件夹用于新建
    models.newDocumentModel = $.Com.FormModel({});

    //标题栏的邮件数量
    models.countModel = $.Com.FormModel({});

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
                for (var i = 0; i < data.dataList.length; i++) {
                    if (data.dataList[i].ID == emailId) {
                        data.dataList[i].markId = "";
                        data.dataList[i].markName = "";
                        data.dataList[i].markColor = "";
                        //修改后台
                        $.fxPost("B_Email_One_Svc.data?action=UpdateEmail", { JsonData: JSON.stringify(data.dataList[i]) }, function (ret) {
                        })
                        models.detailmodel.show(root.find("[data-id='detailView_Part']"), data.dataList[i]);
                        loadData();
                        break;
                    }
                }
            }
        }
    });

    models.gridModel = $.Com.GridModel({
        keyColumns: "ID",//主键字段
        beforeBind: function (vm, _root) {//表格加载前
            //设置字段
            vm.getIsSeeName = function (isSeeName, haveReply) {
                var emailImage;

                //未查看
                if (isSeeName() == "未读") {
                    emailImage = "<img src='../resources/images/colums/email/unopen.png'/>";
                } else {
                    //已查看
                    //return "<span style=\"color:#339900\">已读</span>";
                    emailImage = "<img src='../resources/images/colums/email/email_open.png'/>";

                    //已回复
                    if (haveReply() == true) {
                        emailImage = "<img src='../resources/images/colums/email/email_reply.png'/>";
                    }
                }
                return emailImage;
            }

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
                    //function(){$root.setCancelMark(ID)}
                    return r;
                }
            }

            //设置为收藏/不收藏
            vm.setIsCollection = function (id, isCollection) {
                var emailId = id();
                for (var i = 0; i < data.dataList.length; i++) {
                    if (data.dataList[i].ID == emailId) {
                        if (isCollection() == false) {
                            data.dataList[i].isCollection = true
                            //修改后台
                            $.fxPost("B_Email_One_Svc.data?action=UpdateEmail", { JsonData: JSON.stringify(data.dataList[i]) }, function (ret) {
                            })
                        } else {
                            data.dataList[i].isCollection = false;
                            //修改后台
                            $.fxPost("B_Email_One_Svc.data?action=UpdateEmail", { JsonData: JSON.stringify(data.dataList[i]) }, function (ret) {
                            })
                        }
                        models.gridModel.show(root.find('[data-id="inBoxGrid_Part"]'), data.dataList);
                        break;
                    }
                }
            }

            //删除标签
            vm.setCancelMark = function (id) {
                var emailId = id();
                for (var i = 0; i < data.dataList.length; i++) {
                    if (data.dataList[i].ID == emailId) {
                        data.dataList[i].markId = "";
                        data.dataList[i].markName = "";
                        data.dataList[i].markColor = "";
                        //修改后台
                        $.fxPost("B_Email_One_Svc.data?action=UpdateEmail", { JsonData: JSON.stringify(data.dataList[i]) }, function (ret) {
                        })
                        models.gridModel.show(root.find('[data-id="inBoxGrid_Part"]'), data.dataList);
                        break;
                    }
                }
            }

            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.Com.formatDate(date());
                return "<span >" + d + "</span>";
            }

            //通过checkbox勾选数目显示按钮
            vm.toggleAssociation = function (item) {
                item.isSelected(!(item.isSelected()));

                var deleteList = [];
                var cacheData = models.gridModel.getCacheData().data;//取出表中改变的字段.
                for (var i = 0; i < cacheData.length; i++) {
                    if (cacheData[i].isSelected == true) {
                        deleteList.push(cacheData[i]);
                    }
                }
                //隐藏转发按钮
                if (deleteList.length > 1) {
                    root.find("[data-id='changeSend']").attr("style", "display:none;");
                } else {
                    root.find("[data-id='changeSend']").attr("style", "display:display;margin-top: 5px; float: left;");
                }
                return true;
            }
        },
        elementsCount: 10,
        edit: function (item, callback) {

            for (var i = 0; i < data.dataList.length; i++) {
                if (data.dataList[i].ID == item.ID) {
                    //将所选对象存入全局
                    choiceData = data.dataList[i];
                    break;
                }
            }
            //设置为已查看
            if (item.Mail_IsSee == "0") {
                UpdateB_EmailByIdSetMail_IsSee(item.ID, '1');
            }
            //可编辑弹窗
            item.emailRecieveDate = $.Com.formatDate(item.emailRecieveDate);

            showEmailDetailPage(item, callback);
        },
        remove: function (row) {

        }
    });


    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/Email/EmailOutBox.html", function () {
            //加载数据
            loadData();
            //读取标记下拉
            loadMarkSelect();
            //读取文件下拉
            loadDocumentSelect();
            //读取标记下拉
            loadMarkSelect_Two();
            //读取查看部分的文件下拉
            loadDocumentSelect_Two();

            //表格界面的按钮绑定
            //删除 
            root.find("[data-id='deleteBtn']").bind("click", function () {
                if (!confirm("确定要删邮件吗？")) return false;
                var deleteList = [];
                var cacheData = models.gridModel.getCacheData().data;//取出表中改变的字段.
                for (var i = 0; i < cacheData.length; i++) {
                    if (cacheData[i].isSelected == true) {
                        deleteList.push(cacheData[i]);
                    }
                }
                if (deleteList.length > 0) {
                    DeleteDateList(deleteList, '0');
                }
            });

            //彻底删除
            root.find("[data-id='thoroughDeleteBtn']").bind("click", function () {
                if (!confirm("确定要删邮件吗,若删除后将无法恢复。")) return false;
                var deleteList = [];
                var cacheData = models.gridModel.getCacheData().data;//取出表中改变的字段.
                for (var i = 0; i < cacheData.length; i++) {
                    if (cacheData[i].isSelected == true) {
                        deleteList.push(cacheData[i]);
                    }
                }
                if (deleteList.length > 0) {
                    DeleteDateList(deleteList, '1');
                }
            });

            //查看见面按钮绑定
            //上一页
            root.find("[data-id='nextMail_Top']").bind("click", function () {
                var emailId = choiceData.ID;
                for (var i = 0; i < data.dataList.length; i++) {
                    if (data.dataList[i].ID == emailId) {
                        if (i == 0) {
                              $.Com.showMsg("已经是第一封邮件");
                        } else {
                            choiceData = data.dataList[i - 1];
                            showEmailDetailPage(choiceData, "");

                        }
                        //设置为已查看
                        UpdateB_EmailByIdSetMail_IsSee(choiceData.ID, '1');
                    }
                }
            });

            //下一页
            root.find("[data-id='nextMail']").bind("click", function () {
                var emailId = choiceData.ID;
                for (var i = 0; i < data.dataList.length; i++) {
                    if (data.dataList[i].ID == emailId) {
                        if (i == data.dataList.length - 1) {
                              $.Com.showMsg("已经是最后一封邮件");
                        } else {
                            choiceData = data.dataList[i + 1];
                            showEmailDetailPage(choiceData, "");
                        }
                        //设置为已查看
                        UpdateB_EmailByIdSetMail_IsSee(choiceData.ID, '1');
                    }
                }
            });

            //邮件查看界面中的返回按钮
            root.find("[data-id='backButton']").bind("click", function () {
                root.find("[data-id='inBoxGrid_Part']").attr("style", "display:display");
                root.find("[data-id='detailView_Part']").attr("style", "display:none;");
                loadData();
            });

            //再一次编辑
            root.find("[data-id='editAgain']").bind("click", function () {
                $.Biz.emailwritebox.choiceData = choiceData;
                $.Biz.emailwritebox.url = 'm2.emailoutbox:{type:"outbox"}';
                $.Biz.emailwritebox.type = 'editAgain';
                if ($.Biz.emailwritebox.isInitial) {
                    $.Biz.emailwritebox.editAgain(choiceData, 'editAgain');
                }
                $.iwf.onmodulechange('m2.emailwritebox:{type:"writebox"}');
                ;
            });

            //转发按钮
            root.find("[data-id='changeSend_Two']").bind("click", function () {
                $.Biz.emailwritebox.choiceData = choiceData;
                $.Biz.emailwritebox.type = 'zhuanfa';
                $.Biz.emailwritebox.url = 'm2.emailoutbox:{type:"outbox"}';
                if ($.Biz.emailwritebox.isInitial) {
                    $.Biz.emailwritebox.forward(choiceData, 'zhuanfa');
                }

                $.iwf.onmodulechange('m2.emailwritebox:{type:"writebox"}');
            });
            //删除 
            root.find("[data-id='deleteBtn_Two']").bind("click", function () {
                if (!confirm("确定要删邮件吗？")) return false;
                var deleteList = [];
                deleteList.push(choiceData);
                DeleteDateList(deleteList, '0');
                root.find("[data-id='inBoxGrid_Part']").attr("style", "display:display");
                root.find("[data-id='detailView_Part']").attr("style", "display:none;");
            });

            //彻底删除
            root.find("[data-id='thoroughDeleteBtn_Two']").bind("click", function () {
                if (!confirm("确定要删邮件吗，删除后将无法恢复")) return false;
                var deleteList = [];
                deleteList.push(choiceData);
                DeleteDateList(deleteList, '1');
                root.find("[data-id='inBoxGrid_Part']").attr("style", "display:display");
                root.find("[data-id='detailView_Part']").attr("style", "display:none;");
            });

            root.find("[data-id='changeSend']").bind("click", function () {
                var deleteList = [];
                var cacheData = models.gridModel.getCacheData().data;//取出表中改变的字段.
                for (var i = 0; i < cacheData.length; i++) {
                    if (cacheData[i].isSelected == true) {
                        deleteList.push(cacheData[i]);
                    }
                }
                //隐藏转发按钮
                if (deleteList.length > 0) {
                    $.Biz.emailwritebox.choiceData = deleteList[0];
                    $.Biz.emailwritebox.type = 'zhuanfa';
                    $.Biz.emailwritebox.url = 'm2.emailoutbox:{type:"outbox"}';
                    if ($.Biz.emailwritebox.isInitial) {
                        $.Biz.emailwritebox.forward(deleteList[0], 'zhuanfa');
                    }
                    $.iwf.onmodulechange('m2.emailwritebox:{type:"writebox"}');
                }
            })
        });
    }

    function loadData() {
        $.fxPost("B_Email_One_Svc.data?action=GetEmailSendInit", "", function (ret) {
            if (ret.data) {
                data = ret.data;
                models.gridModel.show(root.find("[ data-id='inBoxGrid_Part']"), data.dataList);
                models.countModel.show(root.find("[data-id='tittleInform_EmailInBox']"), data.dataCount);
            }
        });
    }

    //读取标记下拉
    function loadMarkSelect() {
        root.find("[data-id='emailMarkSelect']").empty();
        var newMark = { markName: "" };

        var events = [{ name: "已读邮件", id: "yiduyoujian" }, { name: "未读邮件", id: "weiduyoujian" }, { name: "星标邮件", id: "xingbiaoyoujian" }, { name: "取消星标", id: "quxiaoxingbiao" }];
        var isClick = false;
        //读取用户创建的标签
        $.fxPost("B_Email_One_Svc.data?action=GetEmailMarkByUserid", "", function (ret) {
            var markList = ret.data;
            for (var i = 0; i < markList.length; i++) {
                var markName = { name: markList[i].markName, id: markList[i].id.toString() };
                events.push(markName);
            }
            var newCreateMark = { name: "新建标记", id: "xinjianbiaoji" };
            events.push(newCreateMark);

            //下拉初始化
            var tools = [
           {
               type: 'menu', text: '标记为...', iconCls: '', show: function (menuelement, btnelement) {
                   var model = new function () {
                       this.show = function (root) {
                           var findEvents = events;
                           //初始化菜单项
                           var container = $("<div data-id='markList' style='margin-left:5px;'></div>");


                           //循环创建菜单
                           for (var i = 0; i < findEvents.length; i++) {
                               var divItem = $("<li><div class='eventName' style='font-size:14px;color:black;' data-id='" + findEvents[i].id + "'>" +
                                   findEvents[i].name + "</div></li>");

                               divItem.bind("click", function () {
                                   //取出表中选中的字段.
                                   var list = models.gridModel.getCacheData().data;
                                   //将选中的内容放入数组中
                                   var choiceList = [];
                                   for (var i = 0; i < list.length; i++) {
                                       if (list[i].isSelected == true) {
                                           choiceList.push(list[i]);
                                       }
                                   }

                                   //查找选中的下拉
                                   var choiceName = $(this).find('.eventName').html();
                                   var dataid = $(this).children().attr("data-id");
                                   var changeContent = [];

                                   if (choiceName == '新建标记') {
                                       showAddMarkWindow(emailMarkModel);
                                       return;
                                   }
                                   //如果选择的内容小于零则不执行
                                   if (choiceList.length <= 0) {
                                       return;
                                   }
                                   //根据选中的内容进行更改
                                   if (choiceName == '已读邮件') {

                                       for (var j = 0 ; j < choiceList.length; j++) {
                                           choiceList[j].Mail_IsSee = '1';
                                           changeContent.push(choiceList[j]);
                                       }
                                   } else if (choiceName == '未读邮件') {
                                       for (var j = 0 ; j < choiceList.length; j++) {
                                           choiceList[j].Mail_IsSee = '0';
                                           changeContent.push(choiceList[j]);
                                       }
                                   } else if (choiceName == '星标邮件') {
                                       for (var j = 0 ; j < choiceList.length; j++) {
                                           choiceList[j].isCollection = true;
                                           changeContent.push(choiceList[j]);
                                       }

                                   } else if (choiceName == '取消星标') {
                                       for (var j = 0 ; j < choiceList.length; j++) {
                                           choiceList[j].isCollection = false;
                                           changeContent.push(choiceList[j]);

                                       }
                                   } else {
                                       for (var j = 0 ; j < choiceList.length; j++) {
                                           choiceList[j].markName = choiceName;
                                           choiceList[j].markId = dataid;
                                           changeContent.push(choiceList[j]);
                                       }

                                   }
                                   //刷新
                                   var json = JSON.stringify(changeContent);
                                   $.post("/B_Email_One_Svc.data?action=UpdateEmailList", { JsonData: json }, function (ret) {
                                       var json = eval('(' + ret + ')');
                                         $.Com.showMsg(json.msg);
                                       loadData();//加载刷新数据
                                   });
                               });
                               container.append(divItem);
                           }
                           root.append(container);
                           //响应关闭下拉框事件
                           root.parent().bind("hide.bs.dropdown", function () {
                               if (isClick) {
                                   isClick = false;
                                   return false;
                               }
                               return true;
                           });
                       }
                   }
                   model.show(menuelement);
               }
           }]
            //加载下拉
            root.find("[data-id='emailMarkSelect']").append('<div style="margin:0px 0px 10px 0px"></div>').children().last().iwfToolbar({ data: tools });
        })
    }


    //读取文件下拉
    function loadDocumentSelect() {
        root.find("[data-id='emailDocumentSelect']").empty();
        var events = [{ name: "收件箱", id: "" }, { name: "已发送", id: "" }, { name: "邮件归档", id: "" }];
        var newDocument = { documentName: "", id: "" };
        var isClick = false;
        //读取用户创建的标签
        $.fxPost("B_Email_One_Svc.data?action=GetEmailDocument", "", function (ret) {

            documentList = ret.data;

            for (var i = 0; i < documentList.length; i++) {
                var documentName = { name: documentList[i].documentName, id: documentList[i].id };
                events.push(documentName);
            }

            var newCreateMark = { name: "新建文件夹" };
            events.push(newCreateMark);

            //下拉初始化
            var tools = [
           {
               type: 'menu', text: '移动到...', iconCls: '', show: function (menuelement, btnelement) {
                   var model = new function () {
                       this.show = function (root) {
                           var findEvents = events;
                           //初始化菜单项
                           var container = $("<div data-id='documentList' style='margin-left:5px;'></div>");

                           //循环创建菜单
                           for (var i = 0; i < findEvents.length; i++) {
                               var divItem = $("<li><div class='eventName' style='font-size:14px;color:black;' data-id='" + findEvents[i].id + "'>" +
                                   findEvents[i].name + "</div></li>");

                               divItem.bind("click", function () {


                                   //取出表中选中的字段.
                                   var list = models.gridModel.getCacheData().data;
                                   //将选中的内容放入数组中
                                   var choiceList = [];
                                   for (var i = 0; i < list.length; i++) {
                                       if (list[i].isSelected == true) {
                                           choiceList.push(list[i]);
                                       }
                                   }

                                   //查找选中的下拉
                                   var choiceName = $(this).find('.eventName').html();
                                   var dataid = $(this).find('.eventName').attr("data-id");
                                   var changeContent = [];

                                   if (choiceName == '新建文件夹') {
                                       showAddDocumentWindow(newDocument);
                                       return;
                                   }
                                   //如果选择的内容小于零则不执行
                                   if (choiceList.length <= 0) {
                                       return;
                                   }
                                   //根据选中的内容进行更改
                                   if (choiceName == '收件箱') {
                                       for (var j = 0 ; j < choiceList.length; j++) {
                                           choiceList[j].MailDocumentType = 'shoujian';
                                           changeContent.push(choiceList[j]);
                                       }

                                   } else if (choiceName == '已发送') {
                                       for (var j = 0 ; j < choiceList.length; j++) {
                                           choiceList[j].MailDocumentType = 'fajian';
                                           changeContent.push(choiceList[j]);
                                       }
                                   } else if (choiceName == '邮件归档') {
                                       for (var j = 0 ; j < choiceList.length; j++) {
                                           choiceList[j].MailDocumentType = 'guidang';
                                           changeContent.push(choiceList[j]);
                                       }
                                   } else {
                                       for (var j = 0 ; j < choiceList.length; j++) {
                                           choiceList[j].MailDocumentType = dataid;
                                           changeContent.push(choiceList[j]);
                                       }
                                   }

                                   //刷新
                                   var json = JSON.stringify(changeContent);
                                   $.post("/B_Email_One_Svc.data?action=UpdateEmailList", { JsonData: json }, function (ret) {
                                       var json = eval('(' + ret + ')');
                                         $.Com.showMsg(json.msg);
                                       loadData();//加载刷新数据
                                   });

                               });
                               container.append(divItem);
                           }
                           root.append(container);
                           //响应关闭下拉框事件
                           root.parent().bind("hide.bs.dropdown", function () {
                               if (isClick) {
                                   isClick = false;
                                   return false;
                               }
                               return true;
                           });
                       }
                   }
                   model.show(menuelement);
               }
           }]
            //加载下拉
            root.find("[data-id='emailDocumentSelect']").append('<div style="margin:0px 0px 10px 0px"></div>').children().last().iwfToolbar({ data: tools });

        })
    }



    //读取查看部分的文件下拉
    function loadDocumentSelect_Two() {
        root.find("[data-id='emailDocumentSelect_Two']").empty();
        var events = [{ name: "收件箱", id: "" }, { name: "已发送", id: "" }, { name: "邮件归档", id: "" }];
        var newDocument = { documentName: "", id: "" };
        var isClick = false;
        //读取用户创建的标签
        $.fxPost("B_Email_One_Svc.data?action=GetEmailDocument", "", function (ret) {

            documentList = ret.data;

            for (var i = 0; i < documentList.length; i++) {
                var documentName = { name: documentList[i].documentName, id: documentList[i].id };
                events.push(documentName);
            }

            var newCreateMark = { name: "新建文件夹" };
            events.push(newCreateMark);

            //下拉初始化
            var tools = [
           {
               type: 'menu', text: '移动到...', iconCls: '', show: function (menuelement, btnelement) {
                   var model = new function () {
                       this.show = function (root_this) {
                           var findEvents = events;
                           //初始化菜单项
                           var container = $("<div data-id='documentList_Two' style='margin-left:5px;'></div>");

                           //循环创建菜单
                           for (var i = 0; i < findEvents.length; i++) {
                               var divItem = $("<li><div class='eventName' style='font-size:14px;color:black;' data-id='" + findEvents[i].id + "'>" +
                                   findEvents[i].name + "</div></li>");

                               divItem.bind("click", function () {

                                   //查找选中的下拉
                                   var choiceName = $(this).find('.eventName').html();
                                   var dataid = $(this).find('.eventName').attr("data-id");
                                   var changeContent = [];

                                   if (choiceName == '新建文件夹') {
                                       showAddDocumentWindow(newDocument);
                                       return;
                                   }
                                   //根据选中的内容进行更改
                                   if (choiceName == '收件箱') {
                                       choiceData.MailDocumentType = 'shoujian';
                                       choiceData.Mail_Deleted = '0';


                                   } else if (choiceName == '已发送') {
                                       choiceData.MailDocumentType = 'fajian';
                                       choiceData.Mail_Deleted = '0';

                                   } else if (choiceName == '邮件归档') {
                                       choiceData.MailDocumentType = 'guidang';
                                       choiceData.Mail_Deleted = '0';
                                   } else {
                                       choiceData.MailDocumentType = dataid;
                                   }
                                   changeContent.push(choiceData);
                                   //刷新
                                   var json = JSON.stringify(changeContent);
                                   $.post("/B_Email_One_Svc.data?action=UpdateEmailList", { JsonData: json }, function (ret) {
                                       var json = eval('(' + ret + ')');
                                         $.Com.showMsg(json.msg);

                                       if (json.success) {
                                           var emailId = choiceData.ID;
                                           for (var i = 0; i < data.dataList.length; i++) {
                                               if (data.dataList[i].ID == emailId) {
                                                   if (i == data.dataList.length - 1) {
                                                       //若是最后一封 则返回到收件箱主界面
                                                       root.find("[data-id='inBoxGrid_Part']").attr("style", "display:display");
                                                       root.find("[data-id='detailView_Part']").attr("style", "display:none;");
                                                       loadData();
                                                   } else {
                                                       choiceData = data.dataList[i + 1];
                                                       showEmailDetailPage(choiceData, "");
                                                       if (choiceData.Mail_IsSee = '0') {
                                                           //设置为已查看
                                                           UpdateB_EmailByIdSetMail_IsSee(choiceData.ID, '1');
                                                       }
                                                   }
                                               }
                                           }
                                       }
                                   });

                               });
                               container.append(divItem);
                           }
                           root_this.append(container);
                           //响应关闭下拉框事件
                           root_this.parent().bind("hide.bs.dropdown", function () {
                               if (isClick) {
                                   isClick = false;
                                   return false;
                               }
                               return true;
                           });
                       }
                   }
                   model.show(menuelement);
               }
           }]
            //加载下拉
            root.find("[data-id='emailDocumentSelect_Two']").append('<div style="margin:0px 0px 10px 0px"></div>').children().last().iwfToolbar({ data: tools });

        })
    }


    //读取标记下拉
    function loadMarkSelect_Two() {
        root.find("[data-id='emailMarkSelect_Two']").empty();
        var newMark = { markName: "" };

        var events = [{ name: "已读邮件", id: "yiduyoujian" }, { name: "未读邮件", id: "weiduyoujian" }, { name: "星标邮件", id: "xingbiaoyoujian" }, { name: "取消星标", id: "quxiaoxingbiao" }];
        var isClick = false;
        //读取用户创建的标签
        $.fxPost("B_Email_One_Svc.data?action=GetEmailMarkByUserid", "", function (ret) {
            var markList = ret.data;
            for (var i = 0; i < markList.length; i++) {
                var markName = { name: markList[i].markName, id: markList[i].id.toString() };
                events.push(markName);
            }
            var newCreateMark = { name: "新建标记", id: "xinjianbiaoji" };
            events.push(newCreateMark);

            //下拉初始化
            var tools = [
           {
               type: 'menu', text: '标记为...', iconCls: '', show: function (menuelement, btnelement) {
                   var model = new function () {
                       this.show = function (root) {
                           var findEvents = events;
                           //初始化菜单项
                           var container = $("<div data-id='markList_Two' style='margin-left:5px;'></div>");


                           //循环创建菜单
                           for (var i = 0; i < findEvents.length; i++) {
                               var divItem = $("<li><div class='eventName' style='font-size:14px;color:black;' data-id='" + findEvents[i].id + "'>" +
                                   findEvents[i].name + "</div></li>");

                               divItem.bind("click", function () {
                                   //选中的下拉
                                   var choiceName = $(this).find('.eventName').html();
                                   var dataid = $(this).children().attr("data-id");
                                   var changeContent = [];

                                   if (choiceName == '新建标记') {
                                       showAddMarkWindow(emailMarkModel);
                                       return;
                                   }
                                   //根据选中的内容进行更改
                                   if (choiceName == '已读邮件') {
                                       //choiceList[j].Mail_IsSee = '1';
                                       choiceData.Mail_IsSee = '1';
                                   } else if (choiceName == '未读邮件') {
                                       //choiceList[j].Mail_IsSee = '0';
                                       choiceData.Mail_IsSee = '0';
                                   } else if (choiceName == '星标邮件') {
                                       //choiceList[j].isCollection = true;
                                       choiceData.isCollection = true;

                                   } else if (choiceName == '取消星标') {
                                       //choiceList[j].isCollection = false;
                                       choiceData.isCollection = false;
                                   } else {
                                       //choiceList[j].markName = choiceName;
                                       choiceData.markName = choiceName;
                                   }
                                   var daArray = [];
                                   daArray.push(choiceData);
                                   //刷新
                                   var json = JSON.stringify(daArray);
                                   $.post("/B_Email_One_Svc.data?action=UpdateEmailList", { JsonData: json }, function (ret) {
                                       var json = eval('(' + ret + ')');
                                         $.Com.showMsg(json.msg);
                                       loadData();//加载刷新数据
                                       models.detailmodel.show(root.find("[data-id='detailView_Part']"), choiceData);
                                   });
                               });
                               container.append(divItem);
                           }
                           root.append(container);
                           //响应关闭下拉框事件
                           root.parent().bind("hide.bs.dropdown", function () {
                               if (isClick) {
                                   isClick = false;
                                   return false;
                               }
                               return true;
                           });
                       }
                   }
                   model.show(menuelement);
               }
           }]
            //加载下拉
            root.find("[data-id='emailMarkSelect_Two']").append('<div style="margin:0px 0px 10px 0px"></div>').children().last().iwfToolbar({ data: tools });
        })
    }

    //将邮件内容设置为已查看
    function UpdateB_EmailByIdSetMail_IsSee(ID, mailIsSee) {
        //将邮件变为已读
        $.fxPost("B_Email_One_Svc.data?action=UpdateB_EmailByIdSetMail_IsSee", { id: ID, mailIsSee: mailIsSee, emailType: "fajian" }, function (ret) {
            if (ret.success) {
                for (var i = 0; i < data.dataList.length; i++) {
                    if (data.dataList[i].ID == ID) {
                        if (mailIsSee == 1) {
                            data.dataList[i].Mail_IsSee = '1';
                            data.dataList[i].isSeeName = '已读';
                            models.gridModel.show(root.find('[data-id="inBoxGrid_Part"]'), data.dataList);
                            break;
                        } else {
                            data.dataList[i].Mail_IsSee = '0';
                            data.dataList[i].isSeeName = '未读';
                            models.gridModel.show(root.find('[data-id="inBoxGrid_Part"]'), data.dataList);
                            break;
                        }
                    }
                }
            }
            //刷新未读取数量
            models.countModel.show(root.find("[data-id='tittleInform_EmailInBox']"), ret.data);
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

    //添加标签弹窗
    function showAddMarkWindow(item) {
        //标签用于新建
        models.newMarkModel = $.Com.FormModel({});
        var dlgOpts = {
            title: '新建标签', width: 600, height: 250,
            button: [
           {
               text: '确定', handler: function (data) {
                   var da = models.newMarkModel.getData();
                   if (da.markName == '' || da.markName == null) {
                         $.Com.showMsg("标签名不能为空！");
                       return;
                   }
                   var json = JSON.stringify(da);
                   //添加标记
                   $.fxPost("B_Email_One_Svc.data?action=SaveEmailMark", { JsonData: json }, function (ret) {
                       if (!ret.success) {
                             $.Com.showMsg(ret.msg);
                       }
                       //重新读取
                       loadMarkSelect();
                       loadMarkSelect_Two();
                   })
                   win.close();
               }
           },
          {
              text: '取消', handler: function () {
                  win.close();
              }
          }
            ]
        };
        var win = $.Com.showFormWin(item, function () {
        }, models.newMarkModel, root.find("[data-id='newMarkWindows']"), dlgOpts);
    }

    //添加文件夹弹窗
    function showAddDocumentWindow(item) {

        models.newDocumentModel = $.Com.FormModel({});

        var dlgOpts = {
            title: '新建文件夹', width: 600, height: 250,
            button: [
           {
               text: '确定', handler: function () {
                   var da = models.newDocumentModel.getData();
                   if (da.documentName == '' || da.documentName == null) {
                         $.Com.showMsg("文件夹名称不能为空！");
                       return;
                   } else {
                       $.post('B_Email_One_Svc.data?action=SaveEmailDocument', { documentName: da.documentName }, function (res) {
                           var json = eval('(' + res + ')')
                             $.Com.showMsg(json.msg);
                           loadDocumentSelect();
                           loadDocumentSelect_Two();
                           win.close();
                       })
                   }
               }
           },
          {
              text: '取消', handler: function () {
                  win.close();
              }
          }
            ]
        };
        var win = $.Com.showFormWin(item, function () {
        }, models.newDocumentModel, root.find("[data-id='newDocumentWindows']"), dlgOpts);
    }

    //删除数据
    function DeleteDateList(list, deleteType) {
        var newList = [];
        for (var i = 0; i < list.length; i++) {
            list[i].Mail_Deleted = '1';
            newList.push(list[i]);
        }
        var json = JSON.stringify(newList);

        if (deleteType == '0') { //删除
            //传入后台保存
            $.post("/B_Email_One_Svc.data?action=UpdateEmailList", { JsonData: json }, function (ret) {
                var json = eval('(' + ret + ')');
                  $.Com.showMsg(json.msg);
                loadData();//加载刷新数据
            });
        } else {//彻底删除
            //传入后台保存
            $.post("/B_Email_One_Svc.data?action=DeleteEmailList", { JsonData: json }, function (ret) {
                var json = eval('(' + ret + ')');
                  $.Com.showMsg(json.msg);
                loadData();//加载刷新数据
            });
        }
    }
}