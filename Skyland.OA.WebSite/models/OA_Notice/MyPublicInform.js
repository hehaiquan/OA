﻿$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'myPublicInform' };
    this.show = function (module, root) {
        $.Biz.myPublicInform.show(module, root);
    }
});

$.Biz.myPublicInform = new function () {

    var self = this;
    var root;
    self.data = null;
    //var wftool;
    var models = {};
    var tittleModel = { allCount: "", throughCheckCount: "", unThroughCheckCount: "", waitCheckCount: "", countersignCount: "" };

    //审核数量栏
    models.tittleBarModel = $.Com.FormModel({});

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

            vm.setStatus = function (setStatus) {
                var statue = setStatus();
                //待审核
                if (statue == "待审核") {
                    return "<span style='color:black'>待审核</span>";
                    //审核通过
                } else if (statue == "通过") {
                    return "<span style='color:green'>通过</span>";
                    //审核不通过
                } else if (statue == "未通过") {
                    return "<span style='color:red'>未通过</span>";
                } else if (statue == "会签") {
                    return "<span style='color:green'>会签</span>";
                }
            }

            vm.setLineColor = function () {
                var a = ko.observable("danger")
                return a;
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
        },
        edit: function (item, callback) {
            //点击编辑触发
            loadChoiceArticle(item);
        },
        remove: function (row) {

        },
        elementsCount: 10
    });

    //已通过审核表
    models.throughCheckGridModel = $.Com.GridModel({
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

            vm.setStatus = function (setStatus) {
                var statue = setStatus();
                //待审核
                if (statue == "待审核") {
                    return "<span style='color:black'>待审核</span>";
                    //审核通过
                } else if (statue == "通过") {
                    return "<span style='color:green'>通过</span>";
                    //审核不通过
                } else if (statue == "未通过") {
                    return "<span style='color:red'>未通过</span>";
                } else if (statue == "会签") {
                    return "<span style='color:green'>会签</span>";
                }
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
        },
        edit: function (item, callback) {
            //点击编辑触发
            loadChoiceArticle(item);
        },
        remove: function (row) {

        },
        elementsCount: 10
    });

    //未通过审核表
    models.unThroughCheckGridModel = $.Com.GridModel({
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

            vm.setStatus = function (setStatus) {
                var statue = setStatus();
                //待审核
                if (statue == "待审核") {
                    return "<span style='color:black'>待审核</span>";
                    //审核通过
                } else if (statue == "通过") {
                    return "<span style='color:green'>通过</span>";
                    //审核不通过
                } else if (statue == "未通过") {
                    return "<span style='color:red'>未通过</span>";
                } else if (statue == "会签") {
                    return "<span style='color:red'>未通过</span>";
                }
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
        },
        edit: function (item, callback) {
            //点击编辑触发
            loadChoiceArticle(item);
        },
        remove: function (row) {

        },
        elementsCount: 10
    });

    //待审核表
    models.waitCheckGridModel = $.Com.GridModel({
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

            vm.setStatus = function (setStatus) {
                var statue = setStatus();
                //待审核
                if (statue == "待审核") {
                    return "<span style='color:black'>待审核</span>";
                    //审核通过
                } else if (statue == "通过") {
                    return "<span style='color:green'>通过</span>";
                    //审核不通过
                } else if (statue == "未通过") {
                    return "<span style='color:red'>未通过</span>";
                } else if (statue == "会签") {
                    return "<span style='color:green'>会签</span>";
                }
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
        },
        edit: function (item, callback) {
            //点击编辑触发
            loadChoiceArticle(item);
        },
        remove: function (row) {

        },
        elementsCount: 10
    });

    //会签表
    models.countersignGridModel = $.Com.GridModel({
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

            vm.setStatus = function (setStatus) {
                var statue = setStatus();
                //待审核
                if (statue == "待审核") {
                    return "<span style='color:black'>待审核</span>";
                    //审核通过
                } else if (statue == "通过") {
                    return "<span style='color:green'>通过</span>";
                    //审核不通过
                } else if (statue == "未通过") {
                    return "<span style='color:red'>未通过</span>";
                } else if (statue == "会签") {
                    return "<span style='color:green'>会签</span>";
                }
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
        root.load("models/OA_Notice/MyPublicInForm.html", function () {
            //tab设置
            var tal = root.find("[data-id='talDiv']");
            tal.iwfTab(
                {
                    stretch: true,
                    tabchange: function (dom) {

                    }
                }
            );
            loadDisplayData("getAll");

            //取出全部内容
            root.find("[data-id='getAllContent']").bind("click", function () {
                loadDisplayData("getAll");
            });

            //通知公告
            root.find("[data-id='getNotice']").bind("click", function () {
                loadDisplayData("tongzhigonggao");
            });

            //环评大事记
            root.find("[data-id='getBigEvents']").bind("click", function () {
                loadDisplayData("bigEvents");
            });
        })
    }

    function loadDisplayData(condition) {
        $.fxPost("DocumentCenterSvc.data?action=GetMyNoticeByDocumentType", { getTypeName: condition }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
                return;
            }
            var obj = ret.data.listObj;
            models.disPlayGridModel.show(root.find('[data-id="articleGrid"]'), obj[0]);
            models.throughCheckGridModel.show(root.find('[data-id="throughCheckGrid"]'), obj[1]);
            models.unThroughCheckGridModel.show(root.find('[data-id="unThroughCheckGrid"]'), obj[2]);
            models.waitCheckGridModel.show(root.find('[data-id="waitThroughCheckGrid"]'), obj[3]);
            models.countersignGridModel.show(root.find('[data-id="countersignGrid"]'), obj[4]);

            tittleModel.allCount = obj[0].length;
            tittleModel.throughCheckCount = obj[1].length;
            tittleModel.unThroughCheckCount = obj[2].length;
            tittleModel.waitCheckCount = obj[3].length;
            tittleModel.countersignCount = obj[4].length;
            models.tittleBarModel.show(root.find('[data-id="tittleBar"]'), tittleModel);

        })
    }
    function loadChoiceArticle(item) {
        $.Biz.addnotice.editData = item;
        $.Biz.addnotice.url = 'm2.myPublicInform:{title:"我的发布"}';
        $.Biz.addnotice.type = 'edit';
        if ($.Biz.addnotice.isInitial) {
            $.Biz.addnotice.editAticle(item, 'edit');
        }
        $.iwf.onmodulechange('m2.addnotice:{title:"通知公告发布"}');
    }
}