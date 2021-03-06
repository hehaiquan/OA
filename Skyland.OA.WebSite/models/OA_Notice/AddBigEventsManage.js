﻿$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'addBigEventsManage' };
    this.show = function (module, root) {
        $.Biz.addBigEventsManage.show(module, root);
    };
});



$.Biz.addBigEventsManage = new function () {
    var root;
    var self = this;
    var models = {};
    var editor;
    var choiceAticelData;
    var noticeModel;
    var textarea = "<textarea class='form-control' name='aticleText_AddBigEvents' data-bind='value:NewsText' rows='16'></textarea>";
    var editType;
    var editData;
    //返回按钮的连接地址
    var url = "";


    //编辑
    this.editAticle = function (param, type) {

        editType = "edit";
        this.editAticleInit(param, type);
    };

    //编辑初始化
    this.editAticleInit = function (param, type) {
        url = $.Biz.addnotice.url;
        editData = param;
        //富文本
        editor.setData(param.NewsText);
        var dataArray = [];
        var documentNameArray = param.documentTypeName.split('/');
        var documentIdArray = param.documentTypeId.split('/');
        for (var i = 0 ; i < documentIdArray.length; i++) {
            var documentTypeModel = { id: "", name: "" };
            documentTypeModel.id = documentIdArray[i]
            documentTypeModel.name = documentNameArray[i];
            dataArray.push(documentTypeModel);
        }
        loadSelect(dataArray);
        root.find("[data-id='backBtn']").attr("style", "float: right; margin-top: 5px; margin-left: 5px;display:display");
        models.publishAticleModel.show(root.find("[data-id='articleUpdate']"), editData);
    }

    //上传新文章
    this.newArticle = function (param, type) {
        editType = "new";
        this.newArticleInit(param, type);
    };

    //上传新文章初始化
    this.newArticleInit = function (param, type) {
        editData = param;
        clearUpAndAgain();
    }

    //文章发布model
    models.publishAticleModel = $.Com.FormModel({
        beforeBind: function (vm, root) {
            //vm._getDocumentSelect = function () {
            //    $.Biz.DocumentSelectTwoWin(
            //        function (data) {
            //            if (data != null) {
            //                //显示选择的文章类型
            //                loadSelect(data);
            //            }
            //        }, choiceAticelData)
            //}

        }
    });


    //读取所选树状图显示
    function loadSelect(data) {
        choiceAticelData = data;
        root.find("[data-id='haveChoiceContent']").empty();
        var haveChoiceContent = root.find("[data-id='haveChoiceContent']");
        //循环创建菜单
        for (var i = 0; i < data.length; i++) {
            var divItem = $("<div title='' style='float: left' data-id='" + data[i].id + "'> <b>" + data[i].name + "</b><img data-id='up" + i + "' src='../../resources/images/docCenter/delete.png' /></div>");

            haveChoiceContent.append(divItem);
            haveChoiceContent.find("[data-id='up" + i + "']").bind("click", function () {
                var dataid = $(this).eq(0).parent().attr("data-id");
                for (var i = 0 ; i < data.length; i++) {
                    if (data[i].id == dataid) {
                        var data_ad = arr_del(data, i + 1);
                        loadSelect(data_ad);
                    }
                }
            });
        }
    }

    function arr_del(data, d) {
        return data.slice(0, d - 1).concat(data.slice(d))
    }

    //读取所选树状图显示
    function loadSelect(data) {
        choiceAticelData = data;
        root.find("[data-id='haveChoiceContent']").empty();
        var haveChoiceContent = root.find("[data-id='haveChoiceContent']");
        //循环创建菜单
        for (var i = 0; i < data.length; i++) {
            var divItem = $("<div title='' style='float: left;margin-top:5px' data-id='" + data[i].id + "'> <b>" + data[i].name + "</b></div>");

            haveChoiceContent.append(divItem);
            //haveChoiceContent.find("[data-id='im" + i + "']").bind("click", function () {
            //    var dataid = $(this).eq(0).parent().attr("data-id");
            //    for (var i = 0 ; i < data.length; i++) {
            //        if (data[i].id == dataid) {
            //            var data_ad = arr_del(data, i + 1);
            //            loadSelect(data_ad);
            //        }
            //    }
            //});
        }
    }

    this.show = function (module, _root) {
        $.Biz.addBigEventsManage.isInitial = true;
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/OA_Notice/AddBigEventsManage.html", function () {
            $.fxPost("DocumentCenterSvc.data?action=GetPubliceModel", { getTypeName: "bigEvents" }, function (ret) {

                if (!editor) {
                    var aticleText_AddBigEvents = root.find("[data-id='aticleText_Update']");
                    aticleText_AddBigEvents.empty(); //删除被选元素的子元素。
                    aticleText_AddBigEvents.append(textarea);
                    editor = CKEDITOR.replace('aticleText_AddBigEvents');
                }

                root.find("[data-id='backBtn']").bind("click", function () {
                    clearUpAndAgain();
                    root.find("[data-id='backBtn']").attr("style", "display:none");
                    $.iwf.onmodulechange(url);
                });

                if ($.Biz.addnotice.type == 'edit') {
                    url = $.Biz.addnotice.url;
                    $.Biz.addnotice.editAticleInit($.Biz.addnotice.editData, 'edit');
                } else if ($.Biz.addnotice.type == 'new') {
                    $.Biz.addnotice.editAticleInit($.Biz.addnotice.editData, 'new');
                } else {
                    noticeModel = ret.data;
                    var dataArray = [];
                    var documentNameArray = noticeModel.documentTypeName.split('/');
                    var documentIdArray = noticeModel.documentTypeId.split('/');
                    for (var i = 0 ; i < documentIdArray.length; i++) {
                        var documentTypeModel = { id: "", name: "" };
                        documentTypeModel.id = documentIdArray[i]
                        documentTypeModel.name = documentNameArray[i];
                        dataArray.push(documentTypeModel);
                    }
                    loadSelect(dataArray);
                    models.publishAticleModel.show(root.find("[data-id='baseInfo']"), noticeModel);
                }

                //文档选择初始化
                var dataArray = [];
                var documentTypeModel = { id: "", name: "" };
                documentTypeModel.id = ret.data.documentTypeId;
                documentTypeModel.name = ret.data.documentTypeName;
                dataArray.push(documentTypeModel);
                loadSelect(dataArray);
            });
            //是否公布到外网
            root.find("[data-id='publicRange']").bind("change", function () {
                var c = $(this).val();
                if (c == "0") {
                    root.find("[data-id='rangePeoleView']").attr("style", "display:none");
                } else {
                    root.find("[data-id='rangePeoleView']").attr("style", "display:display");
                }
                models.publishAticleModel.getData().publicRange = c;
            });
            //是否有邮件送达
            root.find("[data-id='isSendEmail']").bind("change", function () {
                var bo = this.checked;
                if (bo == true) {
                    root.find("[data-id='sendEmailToMan']").attr("style", "display:display");
                } else {
                    root.find("[data-id='sendEmailToMan']").attr("style", "display:none");
                }
            });
            //会议通知显示
            root.find("[data-id='isConferenceInform']").bind("change", function () {
                var bo = this.checked;
                if (bo == true) {
                    root.find("[data-id='conferenceEndDate']").attr("style", "display:display");
                } else {
                    root.find("[data-id='conferenceEndDate']").attr("style", "display:none");
                }
            });
            //重新编辑
            root.find("[data-id='editAgain']").bind("click", function () {
                clearUpAndAgain();
            });
            //保存按钮
            root.find("[data-id='saveBtn']").bind("click", function () {
                if (choiceAticelData == "" || choiceAticelData == undefined || choiceAticelData == null) {
                      $.Com.showMsg("文件类型不能为空");
                    return;
                }
                var choiceData = choiceAticelData;
                var documentTypeName = "";
                var documentTypeId = "";
                for (var i = 0 ; i < choiceData.length; i++) {
                    if (i != choiceData.length - 1) {
                        documentTypeName += choiceData[i].name + "/";
                        documentTypeId += choiceData[i].id + "/";
                    } else {
                        documentTypeName += choiceData[i].name;
                        documentTypeId += choiceData[i].id;
                    }
                }
                var publiceAticle = models.publishAticleModel.getData();
                publiceAticle.documentTypeName = documentTypeName;
                publiceAticle.documentTypeId = documentTypeId;
                publiceAticle.NewsText = editor.getData();
                //if (publiceAticle.status == '通过') {
                //    publiceAticle.status = 'checkThrough';
                //} else {
                //    publiceAticle.status = 'waitCheck';
                //}
                publiceAticle.status = 'waitCheck';
                var jsonData = JSON.stringify(publiceAticle);
                $.post("/DocumentCenterSvc.data?action=SaveAricle", { JsonData: jsonData }, function (ret) {
                    if (ret) {
                        var json = JSON.parse(ret);
                        if (!json.success) {
                              $.Com.showMsg(json.msg);
                            return;
                        }
                          $.Com.showMsg(json.msg);
                        clearUpAndAgain();
                    }
                });
            });

        })

    }
    //重新编辑
    function clearUpAndAgain() {
        $.fxPost("DocumentCenterSvc.data?action=GetPubliceModel", { getTypeName: "bigEvents" }, function (ret) {
            noticeModel = ret.data;
            //清空信息
            models.publishAticleModel.show(root.find("[data-id='articleUpdate']"), noticeModel);
            //清空富文本
            var aticleText_AddBigEvents = root.find("[data-id='aticleText_Update']");
            aticleText_AddBigEvents.empty(); //删除被选元素的子元素。
            aticleText_AddBigEvents.append(textarea);
            editor = CKEDITOR.replace('aticleText_AddBigEvents');
            editor.setData("");
            //清空文章类型
            choiceAticelData = null;
            //清除显示的文章类型
            root.find("[data-id='haveChoiceContent']").empty();

            //文档选择初始化
            var dataArray = [];
            var documentTypeModel = { id: "", name: "" };
            documentTypeModel.id = noticeModel.documentTypeId;
            documentTypeModel.name = noticeModel.documentTypeName;
            dataArray.push(documentTypeModel);
            loadSelect(dataArray);
        })

    }

    //读取数据
    function loadData() {
        $.fxPost("DocumentCenterSvc.data?action=GetPubliceModel", { getTypeName: "bigEvents" }, function (ret) {
            noticeModel = ret.data;
            models.publishAticleModel.show(root.find("[data-id='articleUpdate']"), noticeModel);

        })
    }
};


