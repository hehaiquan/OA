//开发者:黄欢
define(new function () {
    var me = this;
    this.options = { key: 'MySharingCenter' };
    var models = {}

    String.prototype.overHide = function (length) {
        var tmp = 0;
        var len = 0;
        var okLen = 0;
        var okStr = "";
        for (var i = 0; i < length; i++) {
            if (this.charCodeAt(i) > 255) tmp += 2; //大于255表示汉字，一个汉字为2个字符
            else len += 1;//小于等于255表示字符或者数字，为1个字符
            okLen += 1;   //计数器，等于length
            if (tmp + len == length) {
                okStr = this.substring(0, okLen);
                break;
            }
            if (tmp + len > length) {
                okStr = this.substring(0, okLen - 1);
                break;
            }
        }
        if (okStr < this) return okStr + "...";
        else return this + "";
    }

   

    this.show = function (module, root) {
        if (root.children().length == 0) {
            root.load("nnepb/portlet/MySharingCenter.html", function () {
                root.css({ 'paddingTop': '5px' });
                $.fxPost('B_OA_NoticeSvc.data?action=GetSharingFileData', { top: 5 }, function (res) {

                    if (!res.success) {
                          $.Com.showMsg(ret.msg);
                        return;
                    }

                    SharingCenterRowclick = function (RelativePath) {
                        var hostUrl = window.location.host;
                        window.open("http://" + hostUrl + "/" + RelativePath, 'newwindow');
                    };
                    data = res.data;
                    var hostUrl = window.location.host;
                    hostUrl="http://" + hostUrl + "/";
                    var url_dbx = 'index.html#m2.sharefile:{title:"文档共享"}'; //文档共享
                    var DataListDiv = root.find("[data-id='myNoticeDataList']");
                    var divHtml = "";
                    divHtml += "<tr >";
                    divHtml += "<td><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a href='" + url_dbx + "'><span class='more'>更多>></span></a></td>";
                    divHtml += "</tr>";
                    for (var i = 0; i < data.length; i++) {
                        divHtml += "<tr >";
                        divHtml += "<td><a href='" + hostUrl + data[i].RelativePath + "' target='_blank' style='line-height: 30px; color: #000000;'>" + data[i].BeforeFileName.overHide(52) + "</a><span style='line-height: 30px;float: right; color: gray'>" + data[i].CreateTime + "</span></td>";
                        divHtml += "</tr>";
                    }
                    divHtml = "<table width='100%' border='0' cellspacing='0' class=' table-hover table-condensed'>" + divHtml + "</table>";
                    DataListDiv.append(divHtml);
                  
                });
            });
        }
    }

}());