//浏览内容
$.Biz.InitiateTaskBrowseContent = function (id) {

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
        root.load("models/OA_WorkPlan/InitiateTaskBrowse.html", function () {

            var par = {
                tablename: "B_OA_TaskList",
                showfield: "id,TaskName,userName,CONVERT(varchar(30),startTime,120) startTime,CONVERT(varchar(30),endTime,120) endTime,deptName,WorkContent,remark",
                where: "id=" + id
                //order: "department,userName,startTime desc"
            }
            $.fxPost("UsedPhraseSvc.data?action=GetData", par, function (data) {
                
                if (data.success) {
                    data = eval('(' + data.data + ')')
                    models.baseInfo.show(root.find("[data-id='baseInfo']"), data[0]);
                }
                else {
                      $.Com.showMsg(data.msg);
                }
            });


        });
    }
}


//新闻公告浏览窗口
$.Biz.InitiateTaskBrowseWin = function (id, callback) {
    var model = new $.Biz.InitiateTaskBrowseContent(id);
    var opts = { title: '工作安排浏览',mask:true, height: 500, width: 600 };
    var win = $.iwf.showWin(opts);
    var root = win.content();
    model.show(
          { callback: function (item) { callback(item); win.close(); } },
          root
    );
}

