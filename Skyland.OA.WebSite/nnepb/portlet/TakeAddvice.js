define(new function () {
    var me = this;
    this.options = { key: 'takeAddvice' };
    var models = {};
    var fileType;


    this.show = function (module, root) {
        if (root.children().length == 0) {
            var typeId = "tzgg";
            root.load("nnepb/portlet/TakeAddvice.html", function () {
                root.css({ 'paddingTop': '5px' });
                $.fxPost('DocumentCenterSvc.data?action=GetUserGateForType', { top: 5, documentType: "征求意见" }, function (res) {
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

                    ViewMorelOnclick_TakeAddvice = function () {
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
                    var url_dbx = 'index.html#m2.noticeSee:{title:"通知公告查看"}'; //公告查询
                    var DataListDiv = root.find("[data-id='takeAddviceList']");
                    var divHtml = "";
                    //divHtml += "<tr >";
                    //divHtml += "<td><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a onclick=ViewMorelOnclick_TakeAddvice('')><span class='more'>更多>></span></a></td>";
                    //divHtml += "</tr>";
                    for (var i = 0; i < dataTable.length; i++) {
                        divHtml += "<tr style='cursor: pointer' onclick=NoticeRowclick('" + dataTable[i].NewsId + "')>";
                        divHtml += "<td><a style='line-height: 30px; color: #000000;'>" + dataTable[i].NewsTitle.overHide(52) + "</a><span style='line-height: 30px;float: right; color: gray'>" + dataTable[i].CreateTime + "</span></td>";
                        divHtml += "</tr>";
                    }
                    divHtml = "<table width='100%' border='0' cellspacing='0' class=' table-hover table-condensed'>" + divHtml + "</table>";
                    DataListDiv.append(divHtml);

                },
                function (err) {
                    root.text(err.msg);
                });
            });
        }
    }
})