
$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'emaildraftbox' };
    this.show = function (module, root) {
        $.Biz.emaildraftbox.show(module, root);
    };
});

$.Biz.emaildraftbox = new function () {
    var root;
    var data;
    var curData;
    var self = this;
    var models = {};
    models.detailmodel = $.Com.FormModel({});
    var emailMarkModel;
    var emailDocumentModel;

    //标题栏的邮件数量
    models.countModel = $.Com.FormModel({});

    models.gridModel = $.Com.GridModel({
        keyColumns: "ID",//主键字段
        beforeBind: function (vm, _root) {//表格加载前

            //邮件内容过滤HTML
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
                                if (!ret.success) {
                                      $.Com.showMsg(ret.msg);
                                    return;
                                }
                            })
                        } else {
                            data.dataList[i].isCollection = false;
                            //修改后台
                            $.fxPost("B_Email_One_Svc.data?action=UpdateEmail", { JsonData: JSON.stringify(data.dataList[i]) }, function (ret) {
                                if (!ret.success) {
                                      $.Com.showMsg(ret.msg);
                                    return;
                                }
                            })
                        }
                        models.gridModel.show(root.find('[data-role="emailTableGrid"]'), data.dataList);
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
                            if (!ret.success) {
                                  $.Com.showMsg(ret.msg);
                                return;
                            }
                        })
                        models.gridModel.show(root.find('[data-role="emailTableGrid"]'), data.dataList);
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
            $.Biz.emailwritebox.choiceData = item;
            $.Biz.emailwritebox.type = 'chaogao';
            $.Biz.emailwritebox.url = 'm2.emaildraftbox:{type:"draftbox"}';
            if ($.Biz.emailwritebox.isInitial) {
                $.Biz.emailwritebox.draft(item, 'chaogao');
            }
            $.iwf.onmodulechange('m2.emailwritebox:{type:"writebox"}');

        },
        remove: function (row) {

        }
    });

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/Email/EmailDraftBox.html", function () {
            root.find("[data-toggle='tooltip']").tooltip();
            //加载数据
            loadData();
            //读取标记下拉
            loadMarkSelect();
            //读取文件下拉
            loadDocumentSelect();

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

            //转发按钮
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
                    $.Biz.emailwritebox.url = 'm2.emailinbox:{type:"inbox"}';
                    if ($.Biz.emailwritebox.isInitial) {
                        $.Biz.emailwritebox.forward(deleteList[0], 'zhuanfa');
                    }
                    $.iwf.onmodulechange('m2.emailwritebox:{type:"writebox"}');
                }
            })
        });
    };

    // 加载数据
    function loadData() {
        $.fxPost("B_Email_One_Svc.data?action=GetEmailDraftInit", "", function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            data = ret.data;
            models.gridModel.show(root.find("[ data-role='emailDraftTableGrid']"), data.dataList);
            models.countModel.show(root.find("[data-id='tittleInform_Draft']"), data.dataCount);
        });
    };

    //读取文件下拉
    function loadDocumentSelect() {
        root.find("[data-id='emailDocumentSelect']").empty();
        var events = [{ name: "收件箱", id: "" }, { name: "已发送", id: "" }, { name: "邮件归档", id: "" }];
        var newDocument = { documentName: "", id: "" };
        var isClick = false;
        //读取用户创建的标签
        $.fxPost("B_Email_One_Svc.data?action=GetEmailDocument", "", function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
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
                                           choiceList[j].Mail_SendDate = $.ComFun.GetNowDate('yyyy-mm-dd hh:mm');
                                           choiceList[j].emailRecieveDate = $.ComFun.GetNowDate("yyyy-mm-dd hh:mm");
                                           changeContent.push(choiceList[j]);

                                       }

                                   } else if (choiceName == '已发送') {
                                       for (var j = 0 ; j < choiceList.length; j++) {
                                           choiceList[j].MailDocumentType = 'fajian';
                                           choiceList[j].Mail_SendDate = $.ComFun.GetNowDate("yyyy-mm-dd hh:mm");
                                           choiceList[j].emailRecieveDate = $.ComFun.GetNowDate("yyyy-mm-dd hh:mm");
                                           changeContent.push(choiceList[j]);
                                       }
                                   } else if (choiceName == '邮件归档') {
                                       for (var j = 0 ; j < choiceList.length; j++) {
                                           choiceList[j].MailDocumentType = 'guidang';
                                           choiceList[j].Mail_SendDate = $.ComFun.GetNowDate("yyyy-mm-dd hh:mm");
                                           choiceList[j].emailRecieveDate = $.ComFun.GetNowDate("yyyy-mm-dd hh:mm");
                                           changeContent.push(choiceList[j]);
                                       }
                                   } else {
                                       for (var j = 0 ; j < choiceList.length; j++) {
                                           choiceList[j].MailDocumentType = dataid;
                                           choiceList[j].Mail_SendDate = $.ComFun.GetNowDate("yyyy-mm-dd hh:mm");
                                           choiceList[j].emailRecieveDate = $.ComFun.GetNowDate("yyyy-mm-dd hh:mm");
                                           changeContent.push(choiceList[j]);
                                       }
                                   }

                                   //刷新
                                   var json = JSON.stringify(changeContent);
                                   $.fxPost("/B_Email_One_Svc.data?action=UpdateEmailList", { JsonData: json }, function (ret) {
                                       if (!ret.success) {
                                             $.Com.showMsg(ret.msg);
                                           return;
                                       }
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
            $.fxPost("/B_Email_One_Svc.data?action=UpdateEmailList", { JsonData: json }, function (ret) {
                if (!ret.success) {
                      $.Com.showMsg(ret.msg);
                    return;
                }
                  $.Com.showMsg(ret.msg);
                loadData();//加载刷新数据
            });
        } else {//彻底删除
            //传入后台保存
            $.fxPost("/B_Email_One_Svc.data?action=DeleteEmailList", { JsonData: json }, function (ret) {
                if (!ret.success) {
                      $.Com.showMsg(ret.msg);
                    return;
                }
                  $.Com.showMsg(ret.msg);
                loadData();//加载刷新数据
            });
        }
    }

    //读取标记下拉
    function loadMarkSelect() {
        root.find("[data-id='emailMarkSelect']").empty();
        var newMark = { markName: "" };

        var events = [{ name: "已读邮件", id: "yiduyoujian" }, { name: "未读邮件", id: "weiduyoujian" }, { name: "星标邮件", id: "xingbiaoyoujian" }, { name: "取消星标", id: "quxiaoxingbiao" }];
        var isClick = false;
        //读取用户创建的标签
        $.fxPost("B_Email_One_Svc.data?action=GetEmailMarkByUserid", "", function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
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
                                   $.fxPost("/B_Email_One_Svc.data?action=UpdateEmailList", { JsonData: json }, function (ret) {
                                       if (!ret.success) {
                                             $.Com.showMsg(ret.msg);
                                           return;
                                       }
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
                   $.fxPost("B_Email_One_Svc.data?action=SaveEmailMark", { JosonData: json }, function (ret) {
                       if (!ret.success) {
                             $.Com.showMsg(ret.msg);
                       }
                       //重新读取
                       loadMarkSelect();
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
                       $.fxPost('B_Email_One_Svc.data?action=SaveEmailDocument', { documentName: da.documentName }, function (res) {
                           if (!ret.success) {
                                 $.Com.showMsg(ret.msg);
                               return;
                           }
                           loadDocumentSelect();
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

};
