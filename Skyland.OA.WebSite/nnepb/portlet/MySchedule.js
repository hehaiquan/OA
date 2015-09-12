define(new function () {
    var me = this;
    me.data = null;
    this.options = { key: 'MySchedule' };
    var models = {}
    var ScheduleType = "领导";
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
            root.load("nnepb/portlet/MyNotice.html", function () {
                root.css({ 'paddingTop': '5px' });
                $.fxPost('B_OA_ScheduleSvc.data?action=GetGatewayData', { top: 5, ScheduleType: ScheduleType }, function (res) {

                    if (!res.success) {
                          $.Com.showMsg(res.msg);
                        return;
                    }
                    me.data = res.data;
                    ScheduleRowclick = function (i) {
                        $.Biz.BrowseScheduleWin(me.data[i], function (data) { });
                    };

                    var url_dbx = "";
                    if (me.data.length > 0) {
                        if (me.data[0].ScheduleType == "领导") {
                            url_dbx = 'index.html#m2.Schedulesearch:{title:"领导日程查询"}'; //领导日程查询
                        } else {
                            url_dbx = 'index.html#m2.Schedulesearch_gr:{title:"个人日程查询"}'; //个人日程查询
                        }
                    }

                    var DataListDiv = root.find("[data-id='myNoticeDataList']");
                    var divHtml = "";
                    divHtml += "<tr >";
                    divHtml += "<td><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a href='" + url_dbx + "'><span class='more'>更多>></span></a></td>";
                    divHtml += "</tr>";
                    for (var i = 0; i < me.data.length; i++) {
                        divHtml += "<tr style='cursor: pointer' onclick=ScheduleRowclick(" + i + ")>";
                        divHtml += "<td><a style='line-height: 30px; color: #000000;'>" + me.data[i].ScheduleName.overHide(52) + "</a><span style='line-height: 30px;float: right; color: gray'>" + me.data[i].Leader+"--"+me.data[i].ScheduleTime + "</span></td>";
                        divHtml += "</tr>";
                    }
                    divHtml = "<table width='100%' border='0' cellspacing='0' class=' table-hover table-condensed'>" + divHtml + "</table>";
                    DataListDiv.append(divHtml);

                });
            });
        }
    }

}());