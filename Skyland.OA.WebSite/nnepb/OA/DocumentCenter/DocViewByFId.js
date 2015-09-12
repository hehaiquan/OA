define(new function () {
    var root;
    var self = this;
    var models = {};




    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/OA/DocumentCenter/DocViewByFId.html", function () {

            root.find("[data-id='handler']").attr("style", "display:none");
            if (module.pageSet) {
                root.find("[data-id='handler']").attr("style", "display:display");
            }
            loadPage(module.fileType);
        });
    }


    function loadPage(fileTypeId) {
        $.fxPost("DocumentCenterSvc.data?action=GetArticleByFileTypeId", { FileTypeId: fileTypeId }, function (ret) {
            initGrid();
            models.aticleGirdModel.show(root.find('[data-id="documentDiv"]'), ret.dataTable);
        })
    }

    function initGrid() {
        //文章表
        models.aticleGirdModel = $.Com.GridModel({
            keyColumns: "NewsId", //主键字段
            beforeBind: function (vm, root) {

                vm._getDocumentCenterView = function (id) {
                    var callbackData = "";
                    ////查看弹窗
                    $.Biz.DocumentCenterViewWin(function (data) {
                        if (data != null) {

                        }
                    }, id())
                }

                //格式化时间
                vm.setDateTime = function (date) {
                    var d = $.Com.formatDate(date());
                    return d;
                }

                vm.editNotice = function (notice) {
                    ////查看弹窗
                    $.Biz.DocumentUpdateWin(notice.NewsId()
                    , function (data) {

                    });
                }

                vm.deleteNotice = function (newsId) {
                    if (confirm("您确定要删除此项信息吗？")) {

                        $.fxPost("/DocumentCenterSvc.data?action=DeleteAticle", { NewsId: newsId }, function (ret) {
                            //刷新
                            var list = allModel.listObj[0];
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].NewsId == newsId) {
                                    list.splice(i, 1);
                                }
                            }
                            allModel.listObj[0] = list;
                            models.aticleGirdModel.show(root.find('[data-id="documentDiv"]'), allModel.listObj[0]);
                        });
                    }
                }
            },
            edit: function (item, callback) {
            },
            elementsCount: 10
        });
    }
})