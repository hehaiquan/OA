//$.iwf.register(new function () {
//    var me = this;
//    this.options = { key: 'documentClass' };
//    this.show = function (module, root) {
//        $.Biz.documentClass.show(module, root);
//    };

//    $.Biz.documentClass = new function () {
//        var self = this;
//        var models = {};
//        self.data = null;
//        var textarea = "<textarea class='form-control' name='NewsText1' data-bind='value:NewsText' rows='16'></textarea>";

//        //基本信息模
//        models.baseInfo = $.Com.FormModel({
//            //绑定前触发，在这里可以做绑定前的处理
//            beforeBind: function (vm, root) {
//                vm._getDocumentSelect = function () {
//                    $.Biz.DocumentSelectWin(
//                        function (data) {
//                            if (data != null) {
//                                vm.AttachmentType(data.id);
//                                vm.AttachmentTypeName(data.text);
//                            }
//                        }, departmentId
//                        );
//                }
//            },
//            //数据合法性验证，返回false则不会提交
//            beforeSave: function (vm, root) { return true; },
//            afterBind: function (vm, root) { }
//        });

//        models.gridModel = $.Com.GridModel({
//            keyColumns: "NewsId",
//            beforeBind: function (vm, root) {
//                vm._BrowseNotice = function (NewsId) {
//                    $.Biz.BrowseNoticeWin(
//                        //NewsId, function (data) { }
//                    );
//                }
//            },
//            edit: function (item, callback) {
//                var div = root.find("[data-id='newsEdit']");
//                div.empty(); //删除被选元素的子元素。
//                div.load("models/OA_Notice/editNotice.html", function () {

//                    var NewsTextDiv = root.find("[data-id='NewsText']");
//                    NewsTextDiv.empty(); //删除被选元素的子元素。
//                    NewsTextDiv.append(textarea);

//                    root.find("[data-id='noticeList']").hide();
//                    root.find("[data-id='newsEdit']").show();
//                    div.find("[data-id='closeBn']").bind("click", function () {
//                        root.find("[data-id='noticeList']").show();
//                        root.find("[data-id='newsEdit']").hide();
//                    });

//                    //保存
//                    div.find("[data-id='saveNews']").bind("click", function () {
//                        var da = models.baseInfo.getData();
//                        var msg = "";
//                        if (da.NewsTitle == null || $.trim(da.NewsTitle) == "") msg += "\n标题不能为空！"
//                        if (da.NewsFromDept == null || $.trim(da.NewsFromDept) == "") msg += "\n部门不能为空！"
//                        if (da.NewsTypeId == null || $.trim(da.NewsTypeId) == "") msg += "\n类型不能为空！"
//                        if (msg != "") {   $.Com.showMsg(msg); return; }

//                        da.NewsText = CKEDITOR.instances.NewsText1.getData();
//                        da.Creater = parent.$.iwf.userinfo.CnName;
//                        var content = JSON.stringify(da);
//                        $.post('B_OA_NoticeSvc.data?action=SaveData', { JsonData: content, userName: parent.$.iwf.userinfo.CnName }, function (res) {
//                            var json = eval('(' + res + ')')
//                            if (json.success) {
//                                  $.Com.showMsg(json.msg);
//                                for (var i = 0; i < self.data.length; i++) {
//                                    if (self.data[i].NewsId == item.NewsId) {
//                                        self.data.splice(i, 1);//移除数组元素
//                                        break;
//                                    }
//                                }
//                                self.data.splice(0, 0, json.data); //在第一位插入对象
//                                models.gridModel.show(root.find('[data-role="noticeGrid"]'), self.data);
//                                root.find("[data-id='noticeList']").show();
//                                root.find("[data-id='newsEdit']").hide();
//                            }
//                            else {
//                                  $.Com.showMsg(json.msg);
//                            }

//                        });
//                    });

//                    CKEDITOR.replace('NewsText1');//初始化在线编辑器
//                    models.baseInfo.show(div.find("[data-id='baseInfo']"), item);

//                });
//            },
//            remove: function (row) {
//                if (!confirm("确定要删除这条数据吗？")) return false;
//                $.post("/B_OA_NoticeSvc.data?action=DeleteData&id=" + row.NewsId(), {}, function (res) {
//                    var data = eval('(' + res + ')');
//                    if (data.success) {
//                          $.Com.showMsg(data.msg);
//                        for (var i = 0; i < self.data.length; i++) {
//                            if (self.data[i].NewsId == row.NewsId()) {
//                                self.data.splice(i, 1);//移除数组元素
//                                break;
//                            }
//                        }
//                        return true;
//                    } else {
//                          $.Com.showMsg(data.msg);
//                        return false;
//                    }
//                });
//            },
//            elementsCount: 10  //分页,默认5
//        });



//        this.show = function (module, _root) {
//            root = _root;
//            if (root.children().length != 0) return;
//            root.load("models/OA_Notice/DocumentClass.html", function () {
//                //  $.Com.showMsg(document.documentElement.clientHeight);
//                loadData();
//            })

//            //加载数据
//            function loadData() {
//                $.fxPost("DocumentCenterSvc.data?action=GetData", "", function (ret) {
//                    models.options = {
//                        expandbyClick: true,  	//是否点击父节点展开子节点
//                        //flowlayout: 100,	//叶子节点宽度
//                        expandable: true, 	//是否可展开
//                        data: [],
//                        itemclick: function (item, element) {
//                            getArticleList(item);
//                        }
//                    };
//                    //加载根节点
//                    if (ret.data.length > 0) {
//                        for (var i = 0; i < ret.data.length; i++) {
//                            if (ret.data[i].ParentId == "0") {
//                                var singleData = ret.data[i];
//                                models.options.data.push({
//                                    type: 'group',
//                                    title: singleData.ParentId,
//                                    text: singleData.FileTypeName,
//                                    id: singleData.FileTypeId,
//                                    codePath: singleData.CodePath,
//                                    children: recursion(ret.data, singleData)
//                                });
//                            }
//                        }
//                    }
//                    var height = window.innerHeight;
//                    root.find("[data-id='listDiv']").attr("style", "height:" + height + "px;");
//                    var tmHeight = root.find("[data-id='listDiv']").height();
//                    root.find('[data-id="treeMenu"]').attr("style", "overflow-y: auto;height: " + tmHeight + "px");
//                    $('[data-id="treeMenu"]').listView2(models.options);
//                });
//                models.gridModel.show(root.find("[data-id='detailList']"), []);
//            }

//            //迭代函数
//            function recursion(data, parentItem) {
//                var childrenData = $(data).filter(function (index, item) {
//                    if (item.ParentId == parentItem.FileTypeId)
//                        return true;
//                });
//                if (!childrenData || childrenData.length == 0) { //递归出口
//                    return [];
//                }
//                var childrenItems = [];
//                for (var a = 0; a < childrenData.length; a++) {
//                    //循环迭代子节点
//                    childrenItems.push({
//                        id: childrenData[a].FileTypeId,
//                        title: childrenData[a].ParentId,
//                        text: childrenData[a].FileTypeName,
//                        codePath: childrenData[a].CodePath,
//                        children: recursion(data, childrenData[a])//递归子节点
//                    });
//                }
//                return childrenItems;
//            }

//            //通过分类目录取出文档
//            function getArticleList(item) {

//                $.fxPost("DocumentCenterSvc.data?action=GetArtistByFileTypeId", { fileTypeId: item.id }, function (ret) {
//                    self.data = ret.data;
//                    models.gridModel.show(root.find("[data-id='detailList']"), ret.data);
//                })
//            }

//            //新闻公告浏览窗口
//            $.Biz.BrowseNoticeWin = function (NewsId, callback) {
//                var model = new $.Biz.BrowseNoticeContent(NewsId);
//                var opts = { title: '新闻公告浏览', mask: true, height: 1500, width: 1000 };
//                var win = $.iwf.showWin(opts);
//                var root = win.content();
//                model.show(
//                      { callback: function (item) { callback(item); win.close(); } },
//                      root
//                );
//            }
//        }
//    }
//});