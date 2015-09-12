define(new function () {

    var root;
    var self = this;
    var models = {};

    var tittleModel = { allCount: "", throughCheckCount: "", unThroughCheckCount: "", waitCheckCount: "", countersignCount: "" };

    models.disPlayGridModel = $.Com.GridModel({
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

            vm._getDocumentCenterCheckView = function (id) {
                var callbackData = "";
                ////查看弹窗
                $.Biz.DocumentCenterCheckWind(function (data) {
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
        },
        edit: function (item, callback) {
            //点击编辑触发
            loadChoiceArticle(item);
        },
        remove: function (row) {

        },
        elementsCount: 10
    });


 



    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/oa/DocumentCenter/DocumentOfMy.html", function () {
            loadData();
        });
    }


    //显示选择的文章信息
    function loadChoiceArticle(item) {
        $.Biz.documentUpdate.editData = item;
        $.Biz.documentUpdate.url = 'm2.documentOfMy:{type:"mydocument"}';
        $.Biz.documentUpdate.type = 'edit';
        if ($.Biz.documentUpdate.isInitial) {
            $.Biz.documentUpdate.editAticle(item, 'edit');
        }
        $.iwf.onmodulechange('m2.documentUpdate:{type:"documentUpdate"}');
    }


    function deleteChoiceArticle(newId) {
        if (!confirm("确定要删除此文章吗，若删除此文章在所属栏目中将无法查看到！")) return false;
        $.post("/DocumentCenterSvc.data?action=DeleteAticle", { NewsId: newId }, function (ret) {
            var json = JSON.parse(ret);
            if (!json.success) {
                $.Com.showMsg(json.msg);
            }
            //刷新
            loadData();
        })
    }

    function loadData() {
        $.fxPost("/DocumentCenterSvc.data?action=GetAticleByUserId", "", function (ret) {
            models.disPlayGridModel.show(root.find('[data-id="articleGrid"]'), ret.data.listObj[0]);
        })
    }
});