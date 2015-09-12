$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'ChkBigEvents' };
    this.show = function (module, root) {
        $.Biz.ChkBigEvents.show(module, root);
    }
});



$.Biz.ChkBigEvents = new function () {
    var self = this;
    var root;
    self.data = null;
    var addvice;
    var checkViewModel;
    //var wftool;
    var models = {};
    var tittleModel = { throughCheckCount: "", unThroughCheckCount: "", waitCheckCount: "", countersignCount: "" };

    //审核数量栏
    models.tittleBarModel = $.Com.FormModel({});


    //等待审核表
    models.waitCheckModel = $.Com.GridModel({
        keyColumns: "NewsId",//主键字段
        beforeBind: function (vm, root) {

            vm._getDocumentCenterCheckView = function (id) {
                var callbackData = "";
                ////查看弹窗
                $.Biz.DocumentCenterCheckWind(function (data) {
                    if (data != null) {

                    }
                }, id())
            }

            vm._DeleteChoiceAticle = function (newsId) {
                deleteChoiceArticle(newsId());
            }

            //设置不通过
            vm._setChkResultUnthrough = function (newsId) {
                var id = newsId();
                editAddvice = addvice;
                editAddvice.noticeId = id;
                editAddvice.statuType = "checkUnthrough";
                editAddvice.statusName = "未通过";
                CheckAddviceWindow(addvice, "checkUnthrough");
            }

            //设置审核通过
            vm._setChkResultThrough = function (newsId) {
                var id = newsId();
                editAddvice = addvice;
                editAddvice.noticeId = id;
                editAddvice.statuType = "checkThrough";
                editAddvice.statusName = "通过";
                CheckAddviceWindow(addvice, "checkThrough");
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

    //审核通过表
    models.throughCheckModel = $.Com.GridModel({
        keyColumns: "NewsId",//主键字段
        beforeBind: function (vm, root) {


            vm._getDocumentCenterCheckView = function (id) {
                var callbackData = "";
                ////查看弹窗
                $.Biz.DocumentCenterCheckWind(function (data) {
                    if (data != null) {

                    }
                }, id())
            }

            vm._DeleteChoiceAticle = function (newsId) {
                deleteChoiceArticle(newsId());
            }

            //设置重新审核
            vm._checkAgain = function (newsId) {
                var id = newsId();
                editAddvice = addvice;
                editAddvice.noticeId = id;
                editAddvice.statuType = "waitCheck";
                editAddvice.statusName = "待审核";
                //CheckAddviceWindow(addvice, "waitCheck");
                CheckAgain(addvice);

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

    //审核未通过表
    models.unThroughCheckModel = $.Com.GridModel({
        keyColumns: "NewsId",//主键字段
        beforeBind: function (vm, root) {

            vm._getDocumentCenterCheckView = function (id) {
                var callbackData = "";
                ////查看弹窗
                $.Biz.DocumentCenterCheckWind(function (data) {
                    if (data != null) {

                    }
                }, id())
            }

            vm._DeleteChoiceAticle = function (newsId) {
                deleteChoiceArticle(newsId());
            }


            //设置重新审核
            vm._checkAgain = function (newsId) {
                var id = newsId();
                editAddvice = addvice;
                editAddvice.noticeId = id;
                editAddvice.statuType = "waitCheck";
                editAddvice.statusName = "待审核";
                //CheckAddviceWindow(addvice, "waitCheck");
                CheckAgain(addvice);

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
    models.countersignModel = $.Com.GridModel({
        keyColumns: "NewsId",//主键字段
        beforeBind: function (vm, root) {

            vm._getDocumentCenterCheckView = function (id) {
                var callbackData = "";
                ////查看弹窗
                $.Biz.DocumentCenterCheckWind(function (data) {
                    if (data != null) {

                    }
                }, id())
            }

            vm._DeleteChoiceAticle = function (newsId) {
                deleteChoiceArticle(newsId());
            }


            //设置重新审核
            vm._checkAgain = function (newsId) {
                var id = newsId();
                editAddvice = addvice;
                editAddvice.noticeId = id;
                editAddvice.statuType = "waitCheck";
                editAddvice.statusName = "待审核";
                //CheckAddviceWindow(addvice, "waitCheck");
                CheckAgain(addvice);

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
        root.load("models/OA_Notice/ChkBigEvents.html", function () {
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

        });
    }

    function loadData() {
        $.fxPost("DocumentCenterSvc.data?action=GetCheckNoticeList", { getTypeName: 'bigEvents' }, function (ret) {
            var list = ret.data.listObj;
            models.waitCheckModel.show(root.find('[data-id="waitCheckGrid"]'), list[0]);
            models.throughCheckModel.show(root.find('[data-id="throughCheckGrid"]'), list[1]);
            models.unThroughCheckModel.show(root.find('[data-id="unThroughCheckGrid"]'), list[2]);
            models.countersignModel.show(root.find('[data-id="countersignGrid"]'), list[3]);
            addvice = ret.data.addvice;

            tittleModel.waitCheckCount = list[0].length;
            tittleModel.throughCheckCount = list[1].length;
            tittleModel.unThroughCheckCount = list[2].length;
            tittleModel.countersignCount = list[3].length;
            models.tittleBarModel.show(root.find('[data-id="tittleBar"]'), tittleModel);

        })
    }

    //重新审核
    function CheckAgain(addvice) {
        var jsonData = JSON.stringify(addvice);
        $.fxPost("/DocumentCenterSvc.data?action=CheckAgain", { JsonData: jsonData }, function (ret) {
            if (!ret.success) {
                  $.Com.showMsg(ret.msg);
            }
            //刷新
            loadData();
        })
    }

    //审核意见窗口
    function CheckAddviceWindow(item, noticeStatu) {

        //审核意见model
        models.chkAddviceModel = $.Com.FormModel({
        });

        var dlgOpts = {
            title: '审核意见', width: 600, height: 250,
            button: [
           {
               text: '确定', handler: function () {
                   var updateData = models.chkAddviceModel.getData();
                   var json = JSON.stringify(updateData);
                   $.fxPost("DocumentCenterSvc.data?action=SaveCheckAdvice", { JsonData: json, noticeStatu: noticeStatu }, function (ret) {
                       if (!ret.success) {
                             $.Com.showMsg(ret.msg);
                           return;
                       }
                       loadData();
                       win.close();
                   })

               }
           },
          {
              text: '不填写', handler: function () {
                  var updateData = models.chkAddviceModel.getData();
                  var json = JSON.stringify(updateData);
                  $.fxPost("DocumentCenterSvc.data?action=SaveCheckAdvice", { JsonData: json, noticeStatu: noticeStatu }, function (ret) {
                      if (!ret.success) {
                            $.Com.showMsg(ret.msg);
                          return;
                      }
                      loadData();
                      win.close();
                  })
              }
          }
            ]
        }
        var win = $.Com.showFormWin(item, function () {
        }, models.chkAddviceModel, root.find("[data-id='CheckAddvice']"), dlgOpts);
    }
};





