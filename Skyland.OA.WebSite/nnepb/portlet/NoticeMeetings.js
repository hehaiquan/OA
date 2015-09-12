define(new function () {
    var me = this;
    this.options = { key: 'NoticeMeetings' };

    this.show = function (module, root) {
        if (root.children().length == 0) {
            root.load("nnepb/portlet/NoticeMeetings.html", function () {
                root.css({ 'paddingTop': '5px' });

                //$.fxPost('B_OA_MeetingSvc.data?action=QueryMyMeetings', {}, function (ret) {
                //    if (!ret.success) {
                //          $.Com.showMsg(ret.msg);
                //        return;
                //    }

                //    NoticeMeetingRowclick = function (MeetingID) {
                //        $.Biz.BrowseNoticeMeetingWin(MeetingID, function (data) { });
                //    };
                //    data = ret.data.dataList;

                //    var url_dbx = 'index.html#casemodule.doingcase:{key:001}';
                //    var DataListDiv = root.find("[data-id='myMeetingDataList']");

                //    var divHtml = "";
                //    divHtml += "<tr >";
                //    divHtml += "<td><span style='line-height: 30px; color: #000000;'>&nbsp;&nbsp;</span><a href='" + url_dbx + "'><span class='more'>更多>></span></a><div style='HEIGHT: 1px; OVERFLOW: hidden; BORDER-TOP: #cccccc 1px dashed'></td>";
                //    divHtml += "</tr>";
                //    if (data != null) {
                //        for (var i = 0; i < data.length; i++) {
                //            divHtml += "<tr style='cursor: pointer' onclick=NoticeMeetingRowclick(" + data[i].MeetingID + ")>";
                //            divHtml += "<td><a style='line-height: 30px; color: #000000;'>" + data[i].MeetingName.overHide(52) + "</a><span style='line-height: 30px;float: right; color: gray'>" + data[i].ApprovalTime + "</span><div style='HEIGHT: 1px; OVERFLOW: hidden; BORDER-TOP: #cccccc 1px dashed'></td>";
                //            divHtml += "</tr>";
                //        }
                //    }
                //    divHtml = "<table width='100%' border='0' cellspacing='0' class='iwf-grid table-striped'>" + divHtml + "</table>";
                //    DataListDiv.append(divHtml);
                //});


            });
        }
    }
}());



