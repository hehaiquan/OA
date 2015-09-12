define(new function () {

    var root;
    var self = this;
    var models = {};
    var tittleModel = { haveReadCount: "", unReadCount: "" };
    var allAlow_FileTypeId = "";
    var firstData;
    //已读未读 model
    models.tittleBarModel = $.Com.FormModel({});

    //文章分类表
    models.gridModel = $.Com.GridModel({
        keyColumns: "FileTypeId",//主键字段
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
            vm._deleteOrder = function (id) {
                DeleteOrder(id());
            }

            //格式化时间
            vm.setDateTime = function (date) {
                var d = $.Com.formatDate(date());
                return d;
            }
        },
        edit: function (item, callback) {
            allAlow_FileTypeId = item.orderDocumentId;
            GetArticleByFileTypeId(item.orderDocumentId);
        },
        remove: function (row) {
        },
        elementsCount: 10  //分页,默认5
    });

    //已查看
    models.readGridModel = $.Com.GridModel({
        keyColumns: "NewsId",//主键字段
        beforeBind: function (vm, root) {

            //查看详细
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
            //设置为未读
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

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("nnepb/oa/DocumentCenter/MyDocumentOrder.html", function () {
            //读取订阅信息
            loadDataOrderGrid();
            models.readGridModel.show(root.find('[data-id="dataGrid"]'), []);
        })
    }

    function setNoticeAsUnSee(newsId) {
        $.fxPost("DocumentCenterSvc.data?action=SetNoticeAsUnsee", { newsId: newsId }, function (ret) {
            if (!ret.success) {
                $.Com.showMsg(ret.msg);
                return;
            }
            GetArticleByFileTypeId(allAlow_FileTypeId);
        })
    }

    //页面首次加载
    function firstLoad() {
        allAlow_FileTypeId = firstData.orderDocumentId;
        GetArticleByFileTypeId(allAlow_FileTypeId);
    }
    //读取订阅菜单
    function loadDataOrderGrid() {
        $.fxPost("/DocumentCenterSvc.data?action=GetDocumentOrderByUserId", "", function (ret) {
            var events = [];
            var innderMolels = {};


            var isClick = false;
            //下拉初始化
            var tools = [
           {
               type: 'menu', text: '<b>请选择所订阅文件</b>', iconCls: '', show: function (menuelement, btnelement) {
                   var model = new function () {
                       //文章分类表
                       innderMolels.gridModel = $.Com.GridModel({
                           keyColumns: "id",//主键字段
                           //绑定前触发，在这里可以做绑定前的处理
                           beforeBind: function (vm, root) {
                               vm._deleteOrder = function (id) {
                                   DeleteOrder(id());
                               }

                               //格式化时间
                               vm.setDateTime = function (date) {
                                   var d = $.Com.formatDate(date());
                                   return d;
                               }
                           },
                           edit: function (item, callback) {
                               allAlow_FileTypeId = item.orderDocumentId;
                               GetArticleByFileTypeId(item.orderDocumentId);
                           },
                           remove: function (row) {
                           },
                           elementsCount: 10  //分页,默认5
                       });

                       this.show = function (root_two) {
                           //初始化菜单项
                           var container = $("<div data-id='myOrederDataList' style='margin-left:5px;width: 300px;'></div>");
                           var divItem = "<table class='table table-striped table-bordered'>"
                               + " <tbody data-id='tbodyList' data-bind='foreach: elementsShow, visible: currentElements().length > 0'>"
                               + "<tr>"
                               + "<td>"
                               + " <a data-bind='click: $root.editRow' class='btn-link'><span style='font-weight: bold;' data-bind='text:orderDocumentName' id='content'></span></a>"
                               + "<a class='btn-link id='delete' style='float: right;' data-bind='click:function(){$root._deleteOrder(id)}'>取消订阅</a>"
                               + " </td>"
                               + " </tr>"
                               + " </tbody>"
                               + "</table>";
                           container.append(divItem);
                           root_two.append(container);
                           innderMolels.gridModel.show(root_two.find('[data-id="myOrederDataList"]'), ret.dt);
                           //响应关闭下拉框事件
                           root_two.parent().bind("hide.bs.dropdown", function () {
                               if (isClick) {
                                   isClick = false;
                                   return false;
                               }
                               return true;
                           });
                       }
                   }
                   model.show(menuelement);
               }
           }];
            //加载下拉
            root.find("[data-id='myOrderSelect']").append('<div style="margin:0px 0px 10px 0px"></div>').children().last().iwfToolbar({ data: tools });

        });
    }
    //通过类型查找文章
    function GetArticleByFileTypeId(fileTypeId) {
        $.fxPost("/DocumentCenterSvc.data?action=GetArticleByFileTypeId", { fileTypeId: fileTypeId }, function (ret) {
            models.readGridModel.show(root.find('[data-id="dataGrid"]'), ret.dataTable);
        });
    }

    function DeleteOrder(id) {
        if (!confirm("确定要取消此订阅吗？")) return false;
        $.fxPost("/DocumentCenterSvc.data?action=DeleteOrder", { id: id }, function (ret) {
            $.Com.showMsg(ret.msg);
            //刷新
            loadDataOrderGrid();
        })
    }
});