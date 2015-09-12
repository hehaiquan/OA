$.Biz.B_OA_ReceiveDoc_QuZhan = function (root, wfcase) {
    var root;
    var data;
    var models = {};

    this.options = {
        HtmlPath: "Forms/B_OA_ReceiveDoc/B_OA_ReceiveDoc_QuZhan.html",
        Url: "B_OA_ReceiveDoc_QuZhanSvc.data"
    }
    //基本信息模
    models.baseInfo = $.Com.FormModel({
        //绑定前触发，在这里可以做绑定前的处理
        beforeBind: function (vm, root) {
            vm._getLwdw = function () {
                $.Biz.ZfUnitiSelectWin(
                    //回调涵数,更新单位ID、单位名称、单位地址
                    function (data) {
                        if (data != null) {
                            vm.lwdw(data.dwmc);//更新单位名称
                        }
                    }
                );
            };
        },
        //数据合法性验证，返回false则不会提交
        beforeSave: function (vm, root) {
            return true;
        },
        afterBind: function (vm, root) {

        },
        isAppendSign: false
    });

    this.getCacheData = function () {
        data.baseInfo = models.baseInfo.getCacheData();
        return JSON.stringify(data);
    };

    this.cacheData = data;
    this.getData = function () {
        var baseInfo = models.baseInfo.getData();
        if (baseInfo != false)
            return JSON.stringify({
                "baseInfo": baseInfo
            });
        else
            return false;
    };

    this.show = function (formdiv, formdata, wftool) {
        if (formdiv) root = formdiv;
        data = formdata;
        var caseid = wftool.wfcase.caseid;
        var wactid = wftool.wfcase.actid;
 
        models.baseInfo.show(root.find("[data-id='baseInfo']"), data.baseInfo);

        root.find("[data-id='printLw']").bind("click", function() {
            printDoc(caseid);
        });
        if (wactid != "A001") {
            setCheckSuggetion(caseid);
        }
    }

    function printDoc(caseid) {
        $.fxPost("B_OA_ReceiveDoc_QuZhanSvc.data?action=PrintDoc", { caseid: caseid }, function (ret) {
            var path = ret.targetpath;// 获取服务器端返回的文件路径
            var data = {
                Logo: "打印发文",
                Title: "打印发文",
                Callback: function (result) { },
                ToolPrivilege: {
                    Save: false, // 隐藏保存按钮
                    Open: true // 显示保存按钮
                },
                HttpParams: { severFilePath: path }
                //IsWarnSave: true//是否弹出提示保存按钮
            }
            ShowWordWin(data);
        });
    }

    function setCheckSuggetion(caseid) {
        $.fxPost("CommonFunctionSvc.data?action=GetWorkFlowCaseByCaseId", { caseid: caseid }, function (ret) {
            var listWork = ret.listWork;
            var dir = ret.dir;
            var listArray = [];
            var zldps = root.find("[data-id='zldps']");
            listArray = $.ComFun.ChangeListToMatch(listWork, dir);
            for (var j = 0; j < listArray.length; j++) {
                //站领导批示
                if (listArray[j].actID == 'A005') {
                    //局办公室负责任审核
                    $.ComFun.AppendDataToDiv(zldps, listArray[j]);
                }
            }
        });
    }
}
$.Biz.B_OA_ReceiveDoc_QuZhan.prototype.version = "1.0";

