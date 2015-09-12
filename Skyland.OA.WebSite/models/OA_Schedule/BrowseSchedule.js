////日程安排浏览内容
$.Biz.BrowseSchedule = function (item) {

    var selectCallback;
    var models = {};

    //基本信息模
    models.baseInfo = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) { },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) { return true; },
        afterBind: function (vm, root) { }
    });


    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;  //选择单位回调
        root.load("models/OA_Schedule/BrowseSchedule.html", function () {
            //$.fxPost("B_OA_NoticeSvc.data?action=GetBrowseData", { NewsId: NewsId }, function (data) {
                
            //    if (data.success) {
            //        //var data = eval('(' + data.data + ')');
            models.baseInfo.show(root.find("[data-id='baseInfo']"), item);
            //        //root.find("[data-id='NewsText']").append(data.data[0].NewsText);
                    
            //    }
            //    else {
            //          $.Com.showMsg(data.msg);
            //    }
            //});


        });
    }
}

//日程安排
$.Biz.BrowseScheduleWin = function (item, callback) {
    var model = new $.Biz.BrowseSchedule(item);
    var opts = { title: '日程安排', height: 1500, width: 1000 };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
          { callback: function (item) { callback(item); win.close(); } },
          root
    );
}

