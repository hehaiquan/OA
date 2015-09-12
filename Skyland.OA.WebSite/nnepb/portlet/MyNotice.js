define(new function () {
    var me = this;
    this.options = { key: 'MyNotice' };
    var models = {};
    var fileType;
    //String.prototype.overHide = function (length) {
    //    var tmp = 0;
    //    var len = 0;
    //    var okLen = 0;
    //    var okStr = "";
    //    for (var i = 0; i < length; i++) {
    //        if (this.charCodeAt(i) > 255) tmp += 2; //大于255表示汉字，一个汉字为2个字符
    //        else len += 1;//小于等于255表示字符或者数字，为1个字符
    //        okLen += 1;   //计数器，等于length
    //        if (tmp + len == length) {
    //            okStr = this.substring(0, okLen);
    //            break;
    //        }
    //        if (tmp + len > length) {
    //            okStr = this.substring(0, okLen - 1);
    //            break;
    //        }
    //    }
    //    if (okStr < this) return okStr + "...";
    //    else return this + "";
    //}

   

    this.show = function (module, root) {
        if (root.children().length == 0) {
            var typeId = "tzgg";
            root.load("nnepb/portlet/MyNotice.html", function () {
                root.css({ 'paddingTop': '5px' });
                $.fxPost('DocumentCenterSvc.data?action=GetUserGateForType', { top: 5, documentType: "通知公告" }, function (res) {
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

                    //ViewMorelOnclick_MyNotice = function () {
                    //    $.Biz.documentCenter.fileType = fileType;
                    //    $.Biz.documentCenter.type = 'view';
                    //    if ($.Biz.documentCenter.isInitial) {
                    //        $.Biz.documentCenter.viewData();
                    //    }
                    //    $.iwf.onmodulechange('dc.documentCenter:{title:"文档中心"}');
                    //}

                    var data =  res;
                    data = data.data;
                    dataTable = data.dataTable;
                    fileType = data.fileTypeModel;
                    //var url_dbx = 'index.html#m2.noticeSee:{title:"通知公告查看"}'; //公告查询
                    var DataListDiv = root.find("[data-id='myNoticeDataList']");
                    var divHtml = "";
                    //divHtml += "<tr >";
                    //divHtml += "<td><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a onclick=ViewMorelOnclick_MyNotice('')><span class='more'>更多>></span></a></td>";
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