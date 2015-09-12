$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'informSee' };
    this.show = function (module, root) {
        $.Biz.informSee.show(module, root);
    }
});


$.Biz.informSee = new function () {
    var self = this;
    var root;
    self.data = null;
    //var wftool;
    var models = {};
    var tittleModel = { haveReadCount: "", unReadCount: "" };

    //已读未读 model
    models.tittleBarModel = $.Com.FormModel({});

    //已查看
    models.readGridModel = $.Com.GridModel({
        keyColumns: "NewsId",//主键字段
        beforeBind: function (vm, root) {

            vm._getDocumentCenterView = function (id) {
                var callbackData = "";
                ////查看弹窗
                $.Biz.DocumentCenterViewWin(function (data) {
                    if (data != null) {

                    }
                }, id())
            }

            vm._DeleteChoiceAticle = function (newsId) {
                deleteChoiceArticle(newsId());
            }

            vm._setNoticeAsUnSee = function (newsId) {
                setNoticeAsUnSee(newsId());
            }

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



    //已查看
    models.unReadGridModel = $.Com.GridModel({
        keyColumns: "NewsId",//主键字段
        beforeBind: function (vm, root) {

            vm._getDocumentCenterView = function (id) {
                var callbackData = "";
                ////查看弹窗
                $.Biz.DocumentCenterViewWin(function (data) {
                    if (data != null) {

                    }
                }, id())
            }

            vm._DeleteChoiceAticle = function (newsId) {
                deleteChoiceArticle(newsId());
            }

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
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/OA_Notice/InformSee.html", function () {
            loadData();
            //tab设置
            var tal = root.find("[data-id='talDiv']");
            tal.iwfTab(
                {
                    stretch: true,
                    tabchange: function (dom) {

                    }
                }
            );
        })
    }

    function setNoticeAsUnSee(newsId) {
        $.fxPost("DocumentCenterSvc.data?action=SetNoticeAsUnsee", { newsId: newsId }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            loadData();
        })
    }

    function loadData() {
        $.fxPost("DocumentCenterSvc.data?action=GetNoticeByDocumentType", { getTypeName: 'xinxifabu' }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            var obj = ret.data;
            models.unReadGridModel.show(root.find('[data-id="unReadGrid"]'), obj.listObj[0]);
            models.readGridModel.show(root.find('[data-id="haveReadGrid"]'), obj.listObj[1]);

            tittleModel.haveReadCount = obj.listObj[1].length;
            tittleModel.unReadCount = obj.listObj[0].length;
            models.tittleBarModel.show(root.find('[data-id="tittleBar"]'), tittleModel);

        })
    }
}