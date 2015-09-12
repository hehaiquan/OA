define(new function () {
    var me = this;
    this.options = { key: 'PublishInFormGateWay' };
    var fileType;
    var models = {};
    var fileType;
    this.show = function (module, root) {
        if (root.children().length == 0) {

            root.load("nnepb/portlet/PublishInFormGateWay.html", function () {

                root.css({ 'paddingTop': '5px' });
                $.fxPost('DocumentCenterSvc.data?action=GetUserGateForType', { top: 5, documentType: "信息发布" }, function (ret) {
                    if (!ret.success) {
                          $.Com.showMsg(ret.msg);
                        return;
                    }

                    NoticeRowclick = function (NewsId) {
                        var callbackData = "";
                        var data = null;
                        ////查看弹窗
                        $.Biz.DocumentCenterViewWin(function (data) {
                            if (data != null) {

                            }
                        }, NewsId)
                    };

                    ViewMorelOnclick_PublishInForm = function () {
                        $.Biz.documentCenter.fileType = fileType;
                        $.Biz.documentCenter.type = 'view';
                        if ($.Biz.documentCenter.isInitial) {
                            $.Biz.documentCenter.viewData();
                        }
                        $.iwf.onmodulechange('dc.documentCenter:{title:"文档中心"}');
                    }
                    data = ret.data;
                    dataTable = data.dataTable;
                    fileType = data.fileTypeModel;
                    var url_dbx = 'index.html#m2.informSee:{title:"信息查看"}'; //公告查询
                    var DataListDiv = root.find("[data-id='publishInformGateWay']");
                    var divHtml = "";
                    divHtml += "<tr >";
                    divHtml += "<td><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a onclick=ViewMorelOnclick_PublishInForm('')><span class='more'>更多>></span></a></td>";
                    divHtml += "</tr>";
                    for (var i = 0; i < dataTable.length; i++) {
                        divHtml += "<tr style='cursor: pointer' onclick=NoticeRowclick('" + dataTable[i].NewsId + "')>";
                        divHtml += "<td><a style='line-height: 30px; color: #000000;'>" + dataTable[i].NewsTitle.overHide(52) + "</a><span style='line-height: 30px;float: right; color: gray'>" + dataTable[i].CreateTime + "</span></td>";
                        divHtml += "</tr>";
                    }
                    divHtml = "<table width='100%' border='0' cellspacing='0' class=' table-hover table-condensed'>" + divHtml + "</table>";
                    DataListDiv.append(divHtml);

                });
            })
        }
    }

}());