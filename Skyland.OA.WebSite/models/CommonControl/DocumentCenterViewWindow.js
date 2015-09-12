$.Biz.DocumentCenterView = function (id) {
    var models = {};
    var self = this;
    var ztr_Seleted;
    var root;
    var newId = id;
    var overall;
    //基本信息模
    models.noticeModel = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) { },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) { return true; },
        afterBind: function (vm, root) { }
    });


    //评论的model
    models.commentModel = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) { },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) { return true; },
        afterBind: function (vm, root) { }
    });


    //查看已阅读人表
    models.readRecordGridModel = $.Com.GridModel({
        keyColumns: "id",//主键字段
        beforeBind: function (vm, root) {

        },
        edit: function (item, callback) {
            //点击编辑触发
            loadChoiceArticle(item);
        },
        remove: function (row) {

        },
        elementsCount: 10
    });

    //未阅读人表
    models.UnReadManGrid = $.Com.GridModel({
        keyColumns: "id",//主键字段
        beforeBind: function (vm, root) {

        },
        edit: function (item, callback) {
            //点击编辑触发
            loadChoiceArticle(item);
        },
        remove: function (row) {

        },
        elementsCount: 10
    });


    //评论表
    models.commentsGridModel = $.Com.GridModel({
        keyColumns: "id",//主键字段
        beforeBind: function (vm, root) {

            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.Com.formatDate(date());
                return d;
            }
        },
        edit: function (item, callback) {

        },
        remove: function (row) {

        },
        elementsCount: 10
    });


    //审核表
    models.checkResultGrid = $.Com.GridModel({
        keyColumns: "id",//主键字段
        beforeBind: function (vm, root) {

            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.Com.formatDate(date());
                return d;
            }
        },
        edit: function (item, callback) {

        },
        remove: function (row) {

        },
        elementsCount: 10
    });

    this.show = function (module, _root) {
        if (_root.children().length != 0) return;
        //selectCallback = module.callback; 
        root = _root;
        root.load("models/CommonControl/DocumentCenterViewWindow.html", function () {

            //tab设置
            var tal = root.find("[data-id='talDiv']");
            tal.iwfTab(
                {
                    stretch: true,
                    tabchange: function (dom) {

                    }
                }
            );

            loadData();

            root.find("[data-id='publiceCommentsButton']").bind("click", function () {
                var model = models.commentModel.getData();
                var json = JSON.stringify(model);
                $.fxPost("DocumentCenterSvc.data?action=SaveComments", { JsonData: json }, function (ret) {
                    if (ret.success) {
                        models.commentsGridModel.show(root.find("[data-id='commentsGrid']"), ret.data);
                        root.find("[data-id='contentCount']").html(ret.data.length);
                        //清空数据
                        models.commentModel.show(root.find("[data-id='publiceComment']"), overall.commentsModel);
                    }
                })
            });

            root.find("[data-id='viewDetail']").bind("click", function () {
                //if(){

                //}
            });

        });
    }
    function loadData() {
        $.fxPost("DocumentCenterSvc.data?action=GetNoticeById", { id: newId }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(data.msg);
                return;
            }
            var allData = ret.data;
            overall = allData;
            models.noticeModel.show(root.find("[data-id='baseInfo']"), allData.notice);//文章内容
            root.find("[data-id='newTextContent']").append(ret.data.notice.NewsText);//
            models.readRecordGridModel.show(root.find("[data-id='viewRecordGrid']"), allData.listRecord);//已读人员表
            models.commentsGridModel.show(root.find("[data-id='commentsGrid']"), allData.listComments);//评论表
            root.find("[data-id='contentCount']").html(allData.listComments.length)//评论的数量
            models.commentModel.show(root.find("[data-id='publiceComment']"), allData.commentsModel);//评论的model
            models.checkResultGrid.show(root.find("[data-id='addviceGrid']"), allData.checkSuggestTable);//审批表
            models.UnReadManGrid.show(root.find("[data-id='unReadGrid']"), allData.dataTable_unreadMan);//未读人员表

            var listAttachment = allData.listAttachment;

            var attachmentDiv =$("[data-id='attachments']");
            if (listAttachment.length > 0) {
                attachmentDiv.show();
                //attachmentDiv.empty();
                for (var i = 0 ; i < listAttachment.length; i++) {
                    var attach = $("<a target='_black' style='font-size:16px' class='btn btn-link' href='" + listAttachment[i].FilePath + "'>附件: "+ listAttachment[i].FileName + "</a><br>");
                    attachmentDiv.append(attach);
                }
            }
        })
    }
}

//加入放入的文件
$.Biz.DocumentCenterViewWin = function (callback, id) {
    var model = new $.Biz.DocumentCenterView(id);
    var root = null;
    var catelog = [];
    var opts = {
        title: '文档中心查看', height: 730, width: 900,
        button: [
                  { text: '关闭', handler: function () { win.close(); } }
        ]
    };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
        { callback: function (item) { callback(item); win.close(); } },
        root
  );

}