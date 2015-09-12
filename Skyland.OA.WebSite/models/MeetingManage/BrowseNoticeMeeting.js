$.Biz.BrowseNoticeMeeting = function (MeetingID) {
    var models = {};
    var root;
    //基本信息模
    models.noticeModel = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) { },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) { return true; },
        afterBind: function (vm, root) { }
    });


    this.show = function (module, _root) {
        if (_root.children().length != 0) return;
        root = _root;
        root.load("models/MeetingManage/BrowseNoticeMeeting.html", function () {
            $.fxPost("B_OA_MeetingSvc.data?action=QueryMeetingByMeetingID", { MeetingID: MeetingID }, function (ret) {
                if (ret.success) {
                    var data = ret.data;
                    models.noticeModel.show(root.find("[data-id='baseInfo']"), data.baseInfo);
                    root.find("[data-id='newTextContent']").append(data.baseInfo.Purpose);
                    root.find("[data-id='StartTime']").append("会议时间：\n" + data.baseInfo.MeetingDate + " " + data.baseInfo.sStartTime + "~" + data.baseInfo.sEndTime);
                    root.find("[data-id='meetingRoomName']").append("会议地点：" + data.baseInfo.MeetingRoomName);
                    root.find("[data-id='personName']").append("参会人员：" + data.baseInfo.ParticipantNames);
                    root.find("[data-id='Remark']").append((data.baseInfo.Remark == "" || data.baseInfo.Remark == null) ? data.baseInfo.Remark : "备注：" + data.baseInfo.Remark);
                    root.find("[data-id='Presenter']").append("联系人：" + data.baseInfo.Presenter + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;电话：" + data.baseInfo.Phone);
                    root.find("[data-id='ApprovalTime']").append(data.baseInfo.ApprovalTime);
                }
                else {
                      $.Com.showMsg(data.msg);
                }
            })
        });
    }
}

//日程安排
$.Biz.BrowseNoticeMeetingWin = function (id, callback) {
    var model = new $.Biz.BrowseNoticeMeeting(id);
    var opts = {
        title: '会议通知', height: 800, width: 700,
        button: [
                      { text: '关闭', handler: function () { win.close(); } }
        ]
    };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
          { callback: function (item) { callback(item); win.close(); } },
          root
    );
}

