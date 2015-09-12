define(new function () {
    var me = this;
    this.options = { key: 'Dynamemic' };
    var models = {};
    var fileType;

    this.show = function (module, root) {
        if (root.children().length == 0) {
            root.load("nnepb/portlet/Dynamemic.html", function () {
                root.css({ 'paddingTop': '5px' });
                $.fxPost('DocumentCenterSvc.data?action=GetUserGateForType', { top: 5, documentType: "工作动态" }, function (res) {
                    if (!res.success) {
                          $.Com.showMsg(res.msg);
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

                    ViewMorelOnclick_EnvironmentalNews = function () {
                        $.Biz.documentCenter.fileType = fileType;
                        $.Biz.documentCenter.type = 'view';
                        if ($.Biz.documentCenter.isInitial) {
                            $.Biz.documentCenter.viewData();
                        }
                        $.iwf.onmodulechange('dc.documentCenter:{title:"文档中心"}');
                    }

                    var data = res;
                    data = data.data;
                    dataTable = data.dataTable;
                    fileType = data.fileTypeModel;
                    var DataListDiv = root.find("[data-id='dynamemicList']");
                    var divHtml = "";
                    //divHtml += "<tr >";
                    //divHtml += "<td><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a onclick=ViewMorelOnclick_Dynamemic('')><span class='more'>更多>></span></a></td>";
                    //divHtml += "</tr>";
                    for (var i = 0; i < dataTable.length; i++) {
                        divHtml += "<tr style='cursor: pointer' onclick=NoticeRowclick('" + dataTable[i].NewsId + "')>";
                        divHtml += "<td><a style='line-height: 30px; color: #000000;'>" + dataTable[i].NewsTitle.overHide(52) + "</a><span style='line-height: 30px;float: right; color: gray'>" + dataTable[i].CreateTime + "</span></td>";
                        divHtml += "</tr>";
                    }
                    divHtml = "<table width='100%' border='0' cellspacing='0' class=' table-hover table-condensed'>" + divHtml + "</table>";
                    DataListDiv.append(divHtml);

                });
            });
        }
    }

}());