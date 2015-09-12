//意见框
define(function () {
    return function () {
        var root;
        var self;
        var RemarkBoxUrl = "fx/com/wf/toolbar/RemarkBox.html";
        var RemarkBox_DOM;
        var param;//保存手写签批的路径

        this.show = function (div) {

            var RemarkContainer_DOM = $(div);

            RemarkContainer_DOM.load(RemarkBoxUrl, function () {
                RemarkBox_DOM = RemarkContainer_DOM.find("[iwftype=remark_opinionbox]");
                //快捷
                RemarkContainer_DOM.find("[iwftype=remark_shortcut]").children("a").bind("click", function () {
                    var remark = $(this).attr("title");
                    RemarkBox_DOM.val(remark);
                });

                //手写签批
                RemarkContainer_DOM.find("[data-id='sightureBtn']").bind("click", function () {
                    //获取用户ID，顺便注册手写签批的key
                    $.fxPost("/B_Common_CreateDocSvc.data?action=GetSightureSetting", {}, function (ret) {
                        var fxSighture = ret.fxSighture;
                        //var op = JSON.parse(param);
                        //var recordId = op.flowid + "_" + op.caseid + "_" + op.actid + "_" + $.ComFun.GetNowDate("yyyymmddhhmmss");
                        var recordId = $.ComFun.GetNowDate("yyyymmddhhmmssmmm");
                        fxSighture.savePath = fxSighture.saveImageDir + "\\" + recordId + ".jpg";

                        RemarkContainer_DOM.find("[data-id='sightrueDiv']").attr("style", "display:display");
                        RemarkContainer_DOM.find("[data-id='inputDiv']").attr("style", "display:none");
                        RemarkContainer_DOM.find("[data-id='sightureBtn']").attr("style", "display:none");
                        RemarkContainer_DOM.find("[data-id='cancelSightureBtn']").attr("style", "display:display");
                        var options = {
                            WebUrl: fxSighture.webUrl,
                            RecordID: recordId,
                            UserName: fxSighture.userid,
                            FieldName: fxSighture.savePath,
                            imageDiv: RemarkContainer_DOM.find("[data-id='sightureImage']"),
                            width: "550px",
                            height: "200px",
                            showPath: "",
                            RemarkBox_DOM: RemarkBox_DOM,
                            documentName: fxSighture.documentName
                        };
                        var sighture_qf = RemarkContainer_DOM.find("[data-id='sighture']");
                        sighture_qf.empty();
                        sighture_qf.SightureContorl(options);
                    });
                });

                //取消手写签批
                RemarkContainer_DOM.find("[data-id='cancelSightureBtn']").bind("click", function () {
                    RemarkContainer_DOM.find("[data-id='sightrueDiv']").attr("style", "display:none");
                    RemarkContainer_DOM.find("[data-id='inputDiv']").attr("style", "display:display");
                    RemarkContainer_DOM.find("[data-id='sightureBtn']").attr("style", "display:display");
                    RemarkContainer_DOM.find("[data-id='cancelSightureBtn']").attr("style", "display:none");
                });
            });
        };

        function GetUserId(userId) {
            $.fxPost("/FX_UserInfoSvc.data?action=GetUserId", {}, function (res) {
                if (!res.success) {
                    $.Com.showMsg(res.msg);
                    return;
                }
                userId(res.data);
            });
        }

        this.setParams = function (para) {
            param = para;
        }

        this.get = function () {
            return RemarkBox_DOM.val();
        };

        this.set = function (remark) {
            RemarkBox_DOM.val(remark);
        };
    }
}
);