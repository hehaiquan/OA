$.Biz.EmailShowWinContent = function (mailid) {

    var selectCallback;
    var models = {};

    //基本信息模
    models.baseInfo = $.Com.FormModel({
        beforeBind: function (vm, root) { },
        beforeSave: function (vm, root) { return true; },
        afterBind: function (vm, root) { }
    });


    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;  //选择单位回调
        root.load("nnepb/portlet/EmailWinPage.html", function () {
            //var parms = new Object();
            $.fxPost("B_EmailSvc.data?action=GetReceiveMailList", { top: '', mailid: mailid }, function (ret) {

                if (!ret.success) {
                      $.Com.showMsg(ret.msg);
                    return;
                }
                models.baseInfo.show(root.find("[data-id='baseInfo']"), Obj.data[0]);
            });


        });
    }
}


$.Biz.EmailShowWin = function (mailid, callback) {
    var model = new $.Biz.EmailShowWinContent(mailid);
    var opts = { title: '收件箱', mask: true, height: 500, width: 600 };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
          { callback: function (item) { callback(item); win.close(); } },
          root
    );
}

