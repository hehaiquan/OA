$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'bbsTopic' };
    this.show = function (module, root) {
        $.Biz.bbsTopic.show(module, root);
    }
});


$.Biz.bbsTopic = new function () {
    var root;
    var dataTopic;
    var sectionID;
    var dataReply;
    var models = {};
    var editgridTopic;//主贴表中选中的全局
    var editgridSection;//模块表选中全局
    var textarea = "<textarea class='form-control' name='bbsSectionText' data-bind='value:tContents' rows='16'></textarea>";

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

            }
        });

        //模块表初始化
        models.sectionGridModel = $.Com.GridModel({
            beforeBind: function (vm, _root) {

            },
            elementsCount: 10,
            edit: function (item, callback) {
                editgridSection = item;
                sectionID = item.sid;
                getBBSTopicBySectionId(item.sid);
                root.find("[data-id='listSection']").attr("style", "display:none");
                root.find("[data-id='editBBSTopic']").attr("style", "display:none");
                root.find("[data-id='listTopic']").attr("style", "display:display");
                root.find("[data-id='topicView']").attr("style", "display:none");
            }
          , remove: function (row) {

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

          }
          , keyColumns: "tid"
        });

        //评论表初始化
        models.replyGridModel = $.Com.GridModel({
            elementsCount: 10,
            edit: function (item, callback) {
            }
             , remove: function (row) {

             }
             , keyColumns: "rid"
        })

        root.load("models/B_BBS/BBSTopic.html", function () {
            //载入模块表数据
            loadSectionData();

            root.find("[data-id='listSection']").attr("style", "display:display");
            root.find("[data-id='listTopic']").attr("style", "display:none");
            root.find("[data-id='editBBSTopic']").attr("style", "display:none");
            root.find("[data-id='topicView']").attr("style", "display:none");

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
                CKEDITOR.replace('bbsSectionText');//初始化在线编辑器
                dataTopic.data.baseInform.tCreateTime = new Date();
                dataTopic.data.baseInform.tsid = sectionID;
                models.detailmodel.show(root.find("[data-id='editBBSTopic']"), dataTopic.data.baseInform);// 空出模板让用户填写
            });

            //发帖保存
            root.find("[data-id='saveData']").bind("click", function () {
                var dModel = models.detailmodel.getData();
                dModel.tContents = CKEDITOR.instances.bbsSectionText.getData();//读取富文本
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
                    getBBSTopicBySectionId(editgridSection.sid);
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
}