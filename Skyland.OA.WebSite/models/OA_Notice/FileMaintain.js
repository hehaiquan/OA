$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'fileMaintain' };
    this.show = function (module, root) {
        $.Biz.FileMaintain.show(module, root);
    }
});



$.Biz.FileMaintain = new function () {
    var self = this;
    var root;
    self.data = null;
    var departmentId = ""//部门ID
    //var wftool;
    var NewsType = "wdwj";
    var models = {};
    var textarea = "<textarea class='form-control' name='NewsTextwdwj' data-bind='value:NewsText' rows='16'></textarea>";

    //基本信息模
    models.baseInfo = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
            vm._getDocumentSelect = function () {
                $.Biz.DocumentSelectWin(
                    function (data) {
                        if (data != null) {
                            vm.AttachmentType(data.id);
                            vm.AttachmentTypeName(data.text);
                        }
                    }, departmentId
                    );
            }
        },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) { return true; },
        afterBind: function (vm, root) { }
    });

    models.gridModel = $.Com.GridModel({
        keyColumns: "NewsId",//主键字段
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
            vm._BrowseNotice = function (NewsId) {
                $.Biz.BrowseNoticeWin(
                    NewsId, function (data) { }
                );
            }
        },
        edit: function (item, callback) {
            departmentId = item.NewsFromDept;
            var div = root.find("[data-id='newsEdit']");
            div.empty(); //删除被选元素的子元素。
            div.load("models/OA_Notice/editNotice.html", function () {
                var NewsTextDiv = root.find("[data-id='NewsText']");
                NewsTextDiv.empty(); //删除被选元素的子元素。
                NewsTextDiv.append(textarea);
                root.find("[data-id='noticeList']").hide();
                root.find("[data-id='newsEdit']").show();
                div.find("[data-id='closeBn']").bind("click", function () {
                    root.find("[data-id='noticeList']").show();
                    root.find("[data-id='newsEdit']").hide();
                });
                //保存
                div.find("[data-id='saveNews']").bind("click", function () {
                    var da = models.baseInfo.getData();
                    var msg = "";
                    if (da.NewsTitle == null || $.trim(da.NewsTitle) == "") msg += "\n标题不能为空！"
                    if (da.NewsFromDept == null || $.trim(da.NewsFromDept) == "") msg += "\n部门不能为空！"
                    if (da.NewsTypeId == null || $.trim(da.NewsTypeId) == "") msg += "\n类型不能为空！"
                    if (msg != "") {   $.Com.showMsg(msg); return; }

                    da.NewsText = CKEDITOR.instances.NewsTextwdwj.getData();
                    da.Creater = parent.$.iwf.userinfo.CnName;
                    var content = JSON.stringify(da);
                    $.post('B_OA_NoticeSvc.data?action=SaveData', { JsonData: content, userName: parent.$.iwf.userinfo.CnName }, function (res) {
                        var json = eval('(' + res + ')')
                        if (json.success) {
                              $.Com.showMsg(json.msg);
                            for (var i = 0; i < self.data.length; i++) {
                                if (self.data[i].NewsId == item.NewsId) {
                                    self.data.splice(i, 1);//移除数组元素
                                    break;
                                }
                            }
                            self.data.splice(0, 0, json.data); //在第一位插入对象
                            models.gridModel.show(root.find('[data-role="noticeGrid"]'), self.data);
                            root.find("[data-id='noticeList']").show();
                            root.find("[data-id='newsEdit']").hide();
                        }
                        else {
                              $.Com.showMsg(json.msg);
                        }

                    });
                });

                CKEDITOR.replace('NewsTextwdwj');//初始化在线编辑器
                models.baseInfo.show(div.find("[data-id='baseInfo']"), item);

            });
        },
        remove: function (row) {
            if (!confirm("确定要删除这条数据吗？")) return false;
            $.post("/B_OA_NoticeSvc.data?action=DeleteData&id=" + row.NewsId(), {}, function (res) {
                var data = eval('(' + res + ')');
                if (data.success) {
                      $.Com.showMsg(data.msg);
                    for (var i = 0; i < self.data.length; i++) {
                        if (self.data[i].NewsId == row.NewsId()) {
                            self.data.splice(i, 1);//移除数组元素
                            break;
                        }
                    }
                    return true;
                } else {
                      $.Com.showMsg(data.msg);
                    return false;
                }
            });

        },
        elementsCount: 10  //分页,默认5
    });



    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/OA_Notice/FileMaintain.html", function () {

            //CKEDITOR.replace('NewsText');//初始化在线编辑器
            // 载入数据
            //var params = { emailState: emailState };
            $.fxPost("B_OA_NoticeSvc.data?action=GetData", { NewsTypeId: NewsType }, function (data) {
                departmentId = data.data.baseInfo.NewsFromDept;
                self.data = data.data.noticeList;
                models.gridModel.show(root.find('[data-role="noticeGrid"]'), self.data);
                root.find("[data-id='AddBn']").bind("click", function () {
                    var div = root.find("[data-id='newsEdit']");
                    div.empty(); //删除被选元素的子元素。
                    div.load("models/OA_Notice/editNotice.html", function () {

                        var NewsTextDiv = root.find("[data-id='NewsText']");
                        NewsTextDiv.empty(); //删除被选元素的子元素。
                        NewsTextDiv.append(textarea);

                        root.find("[data-id='noticeList']").hide();
                        root.find("[data-id='newsEdit']").show();
                        div.find("[data-id='closeBn']").bind("click", function () {
                            root.find("[data-id='noticeList']").show();
                            root.find("[data-id='newsEdit']").hide();
                        });

                        //保存
                        div.find("[data-id='saveNews']").bind("click", function () {
                            var da = models.baseInfo.getData();
                            var msg = "";
                            if (da.NewsTitle == null || $.trim(da.NewsTitle) == "") msg += "\n标题不能为空！"
                            if (da.NewsFromDept == null || $.trim(da.NewsFromDept) == "") msg += "\n部门不能为空！"
                            if (da.NewsTypeId == null || $.trim(da.NewsTypeId) == "") msg += "\n类型不能为空！"
                            if (msg != "") {   $.Com.showMsg(msg); return; }

                            da.NewsText = CKEDITOR.instances.NewsTextwdwj.getData();
                            da.Creater = parent.$.iwf.userinfo.CnName;
                            var content = JSON.stringify(da);
                            $.post('B_OA_NoticeSvc.data?action=SaveData', { JsonData: content, userName: parent.$.iwf.userinfo.CnName }, function (res) {
                                var json = eval('(' + res + ')');
                                if (json.success) {
                                      $.Com.showMsg(json.msg);
                                    self.data.splice(0, 0, json.data); //在第一位插入对象
                                    models.gridModel.show(root.find('[data-role="noticeGrid"]'), self.data);
                                    root.find("[data-id='noticeList']").show();
                                    root.find("[data-id='newsEdit']").hide();
                                }
                                else {
                                      $.Com.showMsg(json.msg);
                                }

                            });
                        });

                        CKEDITOR.replace('NewsTextwdwj');//初始化在线编辑器
                        data.data.baseInfo.NewsTypeId = NewsType;
                        models.baseInfo.show(div.find("[data-id='baseInfo']"), data.data.baseInfo);

                    });
                });
            });
        });
    }
};





