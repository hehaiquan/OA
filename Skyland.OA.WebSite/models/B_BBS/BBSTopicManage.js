$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'bbsTopicManage' };
    this.show = function (module, root) {
        $.Biz.bbsTopicManage.show(module, root);
    }
});


$.Biz.bbsTopicManage = new function () {
    var root;
    var dataTopic;
    var sectionID;
    var dataReply;
    var models = {};
    var editgridTopic;//主贴表中选中的全局
    var dataSection;
    var textarea = "<textarea class='form-control' name='bbsSectionText2' data-bind='value:tContents' rows='16'></textarea>";

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        //发帖模版
        models.detailmodel = $.Com.FormModel({
            beforeBind: function (vm, root) {

            }
        });

        //看帖模版
        models.viewModel = $.Com.FormModel({
            beforeBind: function (vm, root) {

            }
        });

        //评论模版
        models.replyModel = $.Com.FormModel({
            beforeBind: function (vm, root) {
                vm.GetTopicBySectionId = function (sid) {

                }
            }
        });

        //模块表初始化
        models.sectionGridModel = $.Com.GridModel({
            beforeBind: function (vm, _root) {
                vm.editSectionShow = function (sid) {
                    sectionID = sid;
                    getBBSTopicBySectionId(sid);
                    root.find("[data-id='listSection']").attr("style", "display:none");
                    root.find("[data-id='editBBSTopic']").attr("style", "display:none");
                    root.find("[data-id='listTopic']").attr("style", "display:display");
                    root.find("[data-id='topicView']").attr("style", "display:none");
                }
            },
            elementsCount: 10,
            edit: function (item, callback) {
                showEditSectionBox(item);
            }
          , remove: function (row) {
              if (!confirm("确定要删除此模块吗？")) return false;
              deleteSectionById(row.sid());
          }
          , keyColumns: "sid"
        });

        //发帖表初始化
        models.topicGridModel = $.Com.GridModel({
            beforeBind: function (vm, _root) {

            },
            elementsCount: 10,
            edit: function (item, callback) {
                root.find("[data-id='listSection']").attr("style", "display:none");
                root.find("[data-id='editBBSTopic']").attr("style", "display:none");
                root.find("[data-id='listTopic']").attr("style", "display:none");
                root.find("[data-id='topicView']").attr("style", "display:display");
                root.find("[data-id='topicTile']").empty();
                root.find("[data-id='topicTile']").append(item.tTopic);
                root.find("[data-id='contents']").empty();
                root.find("[data-id='contents']").append(item.tContents);
                models.viewModel.show(root.find("[data-id='topicContents']"), item);// 空出模板让用户填写

                //查找评论内容
                editgridTopic = item
                getBBSReplyByTopicId(item);
            }
          , remove: function (row) {
              if (!confirm("确定要删除此行数据吗？")) return false;
              deleteTopicById(row.tid());
          }
          , keyColumns: "tid"
        });

        //评论表初始化
        models.replyGridModel = $.Com.GridModel({
            elementsCount: 10,
            edit: function (item, callback) {
            }
             , remove: function (row) {
                 if (!confirm("确定要删除此行数据吗？")) return false;
                 deleteReplyByRid(row.rid);
             }
             , keyColumns: "rid"
        })

        root.load("models/B_BBS/BBSTopicManage.html", function () {
            //载入模块表数据
            loadSectionData();

            root.find("[data-id='listSection']").attr("style", "display:display");
            root.find("[data-id='listTopic']").attr("style", "display:none");
            root.find("[data-id='editBBSTopic']").attr("style", "display:none");
            root.find("[data-id='topicView']").attr("style", "display:none");


            //  按钮：添加模块
            root.find("[data-id='addSectionClick']").bind("click", function () {
                //弹窗
                showAddSectionBox();
            });
            //  按钮：返回模块界面
            root.find("[data-id='rebackToSection']").bind("click", function () {
                root.find("[data-id='listSection']").attr("style", "display:display");
                root.find("[data-id='listTopic']").attr("style", "display:none");
                root.find("[data-id='editBBSTopic']").attr("style", "display:none");
                root.find("[data-id='topicView']").attr("style", "display:none");

            });
            //按钮：返回主贴模块
            root.find("[data-id='rebackToTopic']").bind("click", function () {
                root.find("[data-id='listTopic']").attr("style", "display:display");//主贴表
                root.find("[data-id='listSection']").attr("style", "display:none");//主贴表
                root.find("[data-id='topicView']").attr("style", "display:none");
                root.find("[data-id='editBBSTopic']").attr("style", "display:none");//主贴表
            });
            //按钮：主贴模块中的发帖模块保存
            root.find("[data-id='add']").bind("click", function () {
                root.find("[data-id='editBBSTopic']").attr("style", "display:display");
                root.find("[data-id='listTopic']").attr("style", "display:none");//主贴表
                root.find("[data-id='topicView']").attr("style", "display:none");
                root.find("[data-id='listSection']").attr("style", "display:none");//主贴表
                //富文本
                var NewsTextDiv = root.find("[data-id='tContents']");
                NewsTextDiv.empty(); //删除被选元素的子元素。
                NewsTextDiv.append(textarea);
                CKEDITOR.replace('bbsSectionText2');//初始化在线编辑器
                dataTopic.data.baseInform.tCreateTime = new Date();
                dataTopic.data.baseInform.tsid = sectionID;
                models.detailmodel.show(root.find("[data-id='editBBSTopic']"), dataTopic.data.baseInform);// 空出模板让用户填写
            });

            //发帖保存
            root.find("[data-id='saveData']").bind("click", function () {
                var dModel = models.detailmodel.getData();
                dModel.tContents = CKEDITOR.instances.bbsSectionText2.getData();//读取富文本
                var da = JSON.stringify(dModel);
                $.fxPost("BBSSectionSvc.data?action=SaveTopic", { JsonData: da }, function (ret) {
                    if (ret.sucess) {
                          $.Com.showMsg(ret.msg);
                        return;
                    }
                      $.Com.showMsg(ret.msg);
                    root.find("[data-id='editBBSTopic']").attr("style", "display:none");
                    root.find("[data-id='listTopic']").attr("style", "display:none");//主贴表
                    root.find("[data-id='topicView']").attr("style", "display:display");
                    root.find("[data-id='listSection']").attr("style", "display:none");//主贴表
                    //刷新主贴表 
                    getBBSTopicBySectionId(sectionID);
                });

            })

            //评论保存
            root.find("[data-id='replyAdd']").bind("click", function () {
                var rModel = models.replyModel.getData();
                var da = JSON.stringify(rModel);
                $.fxPost("BBSSectionSvc.data?action=SaveReply", { JsonData: da }, function (ret) {
                    if (ret.sucess) {
                          $.Com.showMsg(ret.msg);
                    }
                    //刷新
                    getBBSReplyByTopicId(editgridTopic);
                });
            });
        })
    }

    // 载入模块表数据
    function loadSectionData() {
        var params = Object();
        $.fxPost("BBSSectionSvc.data?action=GetData", params, function (ret) {
            if (ret.data.dataList) {
                dataSection = ret;
                models.sectionGridModel.show(root.find("[data-id='listSection']"), ret.data.dataList);
            }
        });
    }

    //通过模块ID查找主贴
    function getBBSTopicBySectionId(id) {
        if (!id) return;
        $.fxPost("BBSSectionSvc.data?action=GetBBSTopicByTsid", { tsid: id }, function (ret) {
            if (ret.data.dataList) {
                dataTopic = ret;
                root.find("[data-id='editBBSTopic']").attr("style", "display:none");//发帖界面
                root.find("[data-id='listTopic']").attr("style", "display:display");//主贴界面
                root.find("[data-id='topicView']").attr("style", "display:none");//主贴查看界面
                root.find("[data-id='listSection']").attr("style", "display:none");//模块表
                models.topicGridModel.show(root.find("[data-id='listTopic']"), ret.data.dataList);
            }
        });
    }

    //通过主贴ID查找评论表
    function getBBSReplyByTopicId(item) {
        //评论表
        $.fxPost("BBSSectionSvc.data?action=GetBBSReplyByTopicId", { topicId: item.tid, sectionId: item.tsid }, function (ret) {
            dataReply = ret;
            models.replyGridModel.show(root.find("[data-id='replyList']"), ret.data.dataList);
            models.replyModel.show(root.find("[data-id='replayContents']"), ret.data.baseInform);// 评论表初始化
        });
    }

    //删除评论
    function deleteReplyByRid(id) {
        $.fxPost("BBSSectionSvc.data?action=DeleteReply", { replyId: id }, function (ret) {
            if (ret.sucess) {
                  $.Com.showMsg(ret.msg);
            }
            //刷新
            getBBSReplyByTopicId(editgridTopic);
        })
    }

    //删除主贴
    function deleteTopicById(id) {
        $.fxPost("BBSSectionSvc.data?action=DeleteTopic", { topicId: id }, function (ret) {
            if (ret.sucess) {
                  $.Com.showMsg(ret.msg);
                //刷新
                getBBSTopicBySectionId(sectionID);
            }
        })
    }

    //删除模块
    function deleteSectionById(id) {
        $.fxPost("BBSSectionSvc.data?action=DeleteSectionBySectionId", { sectionId: id }, function (ret) {
            if (ret.sucess) {
                  $.Com.showMsg(ret.msg);
                //刷新
                loadSectionData();
            }
        })
    }

    //添加弹窗
    function showAddSectionBox() {

        var item = dataSection.data.baseInform;

        models.aSectionModel = $.Com.FormModel({});
        var dlgOpts = {
            title: '模块添加', width: 500, height: 400,
            button: [
           {
               text: '保存', handler: function (data) {
                   var da = models.aSectionModel.getData();
                   saveSectionData(da, function (a) {
                       if (a == true) {
                           win.close();
                       }
                   });
               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }]
        };
        var win = $.Com.showFormWin(item, function () {
        }, models.aSectionModel, root.find("[data-id='showBox']"), dlgOpts);
    }

    //编辑弹窗
    function showEditSectionBox(item) {
        models.aSectionModel = $.Com.FormModel({});
        var dlgOpts = {
            title: '模块添加', width: 500, height: 400,
            button: [
           {
               text: '保存', handler: function (data) {
                   var da = models.aSectionModel.getData();
                   saveSectionData(da, function (a) {
                       if (a == true) {
                           win.close();
                       }
                   });
               }
           },
          {
              text: '取消', handler: function () { win.close(); }
          }]
        };
        var win = $.Com.showFormWin(item, function () {
        }, models.aSectionModel, root.find("[data-id='showBox']"), dlgOpts);
    }

    function saveSectionData(da, callback) {
        var content = JSON.stringify(da);
        $.fxPost("BBSSectionSvc.data?action=SaveData", { JsonData: content }, function (res) {
            if (res) {
                  $.Com.showMsg(res.msg);
                if (res.success) {
                    callback(true);
                } else {
                    callback(false);
                }
            }
            //刷新
            loadSectionData();
        })
    }
}