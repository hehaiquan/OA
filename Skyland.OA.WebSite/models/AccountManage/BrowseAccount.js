////日程安排浏览内容
$.Biz.BrowseAccount = function (caseid) {

    var selectCallback;
    var models = {};

    //环评信息模
    models.hpInfo = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) { },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) { return true; },
        afterBind: function (vm, root) { }
    });
    //建设项目信息模
    models.jsxmInfo = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) { },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) { return true; },
        afterBind: function (vm, root) { }
    });


    this.show = function (module, root) {
        if (root.children().length != 0) return;
        selectCallback = module.callback;  //选择单位回调
        root.load("models/AccountManage/BrowseAccount.html", function () {
            $.fxPost("AccountSvc.data?action=AccountData", { caseid: caseid }, function (data) {

                if (data.success) {
                    //var data = eval('(' + data.data + ')');
                    models.hpInfo.show(root.find("[data-id='phInfo']"), data.data.hp[0]);
                    //models.jsxmInfo.show(root.find("[data-id='jsxmInfo']"), data.data.jsxm[0]);


                }
                else {
                    alert(data.msg);
                }
            });


        });
    }
}

//台帐
$.Biz.BrowseAccountWin = function (caseid, callback) {
    var model = new $.Biz.BrowseAccount(caseid);
    var opts = { title: '台帐查看', height: 2000, width: 20000 };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
          { callback: function (item) { callback(item); win.close(); } },
          root
    );
}

