define(new function () {
    var root;
    var self = this;
    var models = {};

    this.viewData = function () {
        this.viewDataInit(self.fileType);
    }

    this.viewDataInit = function (fileType) {
        // var fileType = $.Biz.documentCenter.fileType;
        if (fileType.isParent == true) {
            loadData(fileType.FileTypeId);
        } else {
            loadSingleData(fileType.FileTypeId);
        }
    }

    this.show = function (module, _root) {
        //$.Biz.documentCenter.isInitial = true;
        root = _root;
        if (root.children().length != 0) root.empty();

        root.load("nnepb/oa/DocumentCenter/main.html", function () {
            //if ($.Biz.documentCenter.type == 'view') {
            //    $.Biz.documentCenter.viewDataInit();
            //} else {
            //    loadData("0");
            //}

            var params = eval('({' + module.params.replace(/"/g, "'") + '})');
            if (params.type) {
                $.fxPost('DocumentCenterSvc.data?action=GetFiletypeByFileTypeName', { documentType: params.type }, function (res) {
                    self.fileType = res.data.fileTypeModel;
                    self.type = 'view';
                    self.viewDataInit(self.fileType);
                });
            } else
                loadData();
        });
    }

    function loadData(fileTypeId) {
        //$.fxPost('DocumentCenterSvc.data?action=GetFiletypeByFileTypeName', { documentType: "局领导传阅" }, function (res) {

        if (fileTypeId == undefined)            fileTypeId = "0";
        

        $.fxPost("/DocumentCenterSvc.data?action=GetDocumentCenterByFileTypeId", { fileTypeId: fileTypeId }, function (ret) {
            var data = ret.data;

            //点击文章查看弹窗
            NoticeRowclick = function (NewsId) {
                var callbackData = "";
                var data = null;
                ////查看弹窗
                $.Biz.DocumentCenterViewWin(function (data) {
                    if (data != null) {

                    }
                }, NewsId)
            };

            //面包屑导航栏
            FindArticleByBread = function (fileTypeId) {
                loadData(fileTypeId);
            }

            //查看更多
            ViewModel = function (clickData) {
                var array = clickData.split('/');
                if (array[1] == "true") {
                    loadData(array[0]);
                } else {
                    loadSingleData(array[0]);
                }
            }

            //遍历面包屑导航
            var breadList = data.listBread;
            var breadCrumbDiv = root.find("[data-id='breadCrumb']");
            breadCrumbDiv.empty();
            var breadHtml = "";
            for (var k = 0 ; k < breadList.length; k++) {
                if (k == breadList.length - 1) {
                    breadHtml += "<li  class='active'>" + breadList[k].FileTypeName + "</li>";
                } else {
                    breadHtml += "<li><a onclick=FindArticleByBread('" + breadList[k].FileTypeId + "')>" + breadList[k].FileTypeName + "</a></li>";
                }
            }
            breadCrumbDiv.append(breadHtml);

            var url_dbx = "";
            var listObj = data.listObj;
            var DataListDiv = root.find("[data-id='documentCenterPanel']");
            DataListDiv.empty();
            for (var i = 0 ; i < listObj.length; i++) {
                var fileType = listObj[i].fileType;
                var listNotice = listObj[i].listNotice;
                var divHtml = "";
                var tbHtml = "";
                divHtml += "<div class='col-md-6'>";
                divHtml += "<div class='panel panel-success'>";
                divHtml += "<div class='panel-heading'>";
                divHtml += "<span class='panel-title'>" + fileType.FileTypeName + "</span>";
                divHtml += "</div>";
                divHtml += "<div class='panel-body' style='padding-top: 5px;height: 265px;'>";
                divHtml += "<div class='row' style='margin: 5px; '>";
                divHtml += "<table width='100%' border='0' cellspacing='0' class=''>"
                divHtml += "<tr><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a onclick=ViewModel('" + fileType.FileTypeId + "/" + fileType.isParent + "')><span class='more'>更多>></span></a><div style='HEIGHT: 1px; OVERFLOW: hidden; BORDER-TOP: #cccccc 1px dashed'></tr>";

                if (listNotice.length > 0) {
                    for (var j = 0 ; j < listNotice.length; j++) {
                        tbHtml += "<tr style='cursor: pointer' onclick=NoticeRowclick('" + listNotice[j].NewsId + "')>";
                        tbHtml += "<td><a style='line-height: 30px; color: #000000;'>" + listNotice[j].NewsTitle + "</a><span style='line-height: 30px;float: right; color: gray'>"
                            + $.Com.formatDate(listNotice[j].CreateTime) + "</span><div style='HEIGHT: 1px; OVERFLOW: hidden; BORDER-TOP: #cccccc 1px dashed'></td>";
                        tbHtml += "</tr>";
                    }
                } else {
                    tbHtml += "<tr>暂无内容</tr>";
                }

                divHtml += tbHtml;
                divHtml += "</table>";
                divHtml += "</div>";
                divHtml += "</div>";
                divHtml += "</div>";
                divHtml += "</div>";
                DataListDiv.append(divHtml);

            }
        })
    }

    //若此文章类别没有父类就单读此文章
    function loadSingleData(fileTypeId) {

        models.gridModel = $.Com.GridModel({
            keyColumns: "NewsId",//主键字段
            beforeBind: function (vm, _root) {//表格加载前
                //格式化时间
                vm.setDateTime = function (date) {
                    var d = $.Com.formatDate(date());
                    return "<span >" + d + "</span>";
                }

                vm._getDocumentCenterView = function (id) {
                    var callbackData = "";
                    ////查看弹窗
                    $.Biz.DocumentCenterViewWin(function (data) {
                        if (data != null) {

                        }
                    }, id())
                }
            },
            elementsCount: 10,
            edit: function (item, callback) {
            },
            remove: function (row) {

            }
        });

        $.fxPost("/DocumentCenterSvc.data?action=GetDocumentCenterByFileTypeId", { fileTypeId: fileTypeId }, function (ret) {
            var data = ret.data;

            //点击文章查看弹窗
            NoticeRowclick = function (NewsId) {
                var callbackData = "";
                var data = null;
                ////查看弹窗
                $.Biz.DocumentCenterViewWin(function (data) {
                    if (data != null) {

                    }
                }, NewsId)
            };

            //面包屑导航栏
            FindArticleByBread = function (fileTypeId) {
                loadData(fileTypeId);
            }

            //查看更多
            ViewModel = function (clickData) {
                var array = clickData.split('/');
                if (array[1] == "true") {
                    loadData(array[0]);
                } else {

                }
            }

            //便利面包屑导航
            var breadList = data.listBread;
            var breadCrumbDiv = root.find("[data-id='breadCrumb']");
            breadCrumbDiv.empty();
            var breadHtml = "";
            for (var k = 0 ; k < breadList.length; k++) {
                if (k == breadList.length - 1) {
                    breadHtml += "<li  class='active'>" + breadList[k].FileTypeName + "</li>";
                } else {
                    breadHtml += "<li><a onclick=FindArticleByBread('" + breadList[k].FileTypeId + "')>" + breadList[k].FileTypeName + "</a></li>";
                }
            }
            breadCrumbDiv.append(breadHtml);

            //加载文章
            var DataListDiv = root.find("[data-id='documentCenterPanel']");
            DataListDiv.empty();
            var divHtml = "";
            divHtml += "<!--文章表-->";
            divHtml += "<div data-id='articleGrid'>";
            divHtml += "<table class=' table table-striped table-bordered'>";
            divHtml += " <thead>";
            divHtml += "<tr class='sort'>";
            divHtml += "<th style='width: 500px; text-align: center; background: white'><a href='NewsTitle' data-sortkey='NewsTitle'>名称（点击可查看浏览记录与评论）</a></th>";
            divHtml += "<th style='width: 100px; text-align: center; background: white'><a href='CreateTime' data-sortkey='CreateTime'>上传时间</a></th>";
            divHtml += "</tr>";
            divHtml += "<tr>";
            divHtml += "<!--名称-->";
            divHtml += "<th>";
            divHtml += "<input class='form-control' data-filterkey='NewsTitle' />";
            divHtml += "</th>";
            divHtml += " <!--上传时间-->";
            divHtml += " <th>";
            divHtml += " <input class='form-control' data-filterkey='CreateTime' />";
            divHtml += "</th>";
            divHtml += " </thead>";
            divHtml += "<tbody data-bind='foreach: elementsShow, visible: currentElements().length > 0'>";
            divHtml += "<tr>";
            divHtml += "<td>";
            divHtml += "<span data-bind='text:NewsTitle,click:function(){$root._getDocumentCenterView(NewsId)}' style='color: black' class='btn btn-link'></span>";
            divHtml += "</td>";
            divHtml += "<td style='text-align: center' data-bind='html:$root.setDateTime(CreateTime)'>";
            divHtml += "<!--<span class='' data-bind='text:CreateTime'></span>-->";
            divHtml += "</td>";
            divHtml += "</tr>";
            divHtml += "</tbody>";
            divHtml += " </table>";
            divHtml += "<!--页数显示-->";
            divHtml += " <div>";
            divHtml += "<div style='float: left;' data-bind='visible: paginator().length > 1'>";
            divHtml += " <ul class='pagination' data-bind='foreach: paginator'>";
            divHtml += "<li data-bind='css: { active:  name == $root.currentPaginatorPage() }'>";
            divHtml += "<!-- ko if: name != '...' -->";
            divHtml += "<a data-bind='text: name, click: $root.setPage'></a>";
            divHtml += " <!-- /ko -->";
            divHtml += "<!-- ko if: name == '...' -->";
            divHtml += "<span>...</span><!-- /ko -->";
            divHtml += "</li>";
            divHtml += "</ul>";
            divHtml += "</div>";
            divHtml += "<div style='float: right;'>";
            divHtml += "<ul class='pagination pagination-right'>";
            divHtml += " <li data-bind='css: { active:  $root.elementsCount() == 5 }'><a data-pagecount='5'>5</a></li>";
            divHtml += "<li data-bind='css: { active:  $root.elementsCount() == 10 }'><a data-pagecount='10'>10</a></li>";
            divHtml += "<li data-bind='css: { active:  $root.elementsCount() == 20 }'><a data-pagecount='20'>20</a></li>";
            divHtml += "</ul>";
            divHtml += "</div>";
            divHtml += "</div>";
            divHtml += "</div>";
            DataListDiv.append(divHtml);
            models.gridModel.show(root.find('[data-id="articleGrid"]'), data.listObj[0].listNotice);
        })
    }
})