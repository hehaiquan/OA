$.Biz.B_OA_TrafficFlow_NoticeVerify = function (wftool) {
    var self = this;
    var textarea = "";
    var editor;
    var models = {};

    this.options = {
        HtmlPath: "nnepb/oa/NoticePublic/B_OA_TrafficFlow_NoticeVerify.html",
        Url: "B_OA_TrafficFlow_NoticeVerifySvc.data"
    };

    models.baseInfor_Notice = $.Com.FormModel({
        beforeBind: function (vm, root) {

        }
         , beforeSave: function (vm, root) {
         },
           isAppendSign: false
        });

    this.show = function (formdiv, formdata, wftool) {
        if (formdiv) root = formdiv;
        data = formdata;

        var wactid = wftool.wfcase.actid;

        textarea = "<textarea class='form-control' name='aticleText_"+data.baseInfor_Notice.NewsId+"' data-bind='value:NewsText' rows='20'></textarea>";

    
        var aticleText_Update = root.find("[data-id='aticleText_Update']");
        aticleText_Update.empty(); //删除被选元素的子元素。
        aticleText_Update.append(textarea);
        editor = CKEDITOR.replace("aticleText_" + data.baseInfor_Notice.NewsId);
        models.baseInfor_Notice.show(root.find("[data-id='baseInfo']"), data.baseInfor_Notice);
        editor.setData(models.baseInfor_Notice.NewsText);
    }

    this.getCacheData = function () {
        data.baseInfor_Notice = models.baseInfor_Notice.getCacheData();
        data.baseInfor_Notice.NewsText = editor.getData();
        return JSON.stringify(data);
    }

    this.getData = function () {
        var d1 = models.baseInfor_Notice.getData();
        d1.NewsText = editor.getData();
        if (d1 && d1 != null)
            return JSON.stringify({ "baseInfor_Notice": d1 });
        else
            return false;
    }
}
$.Biz.B_OA_TrafficFlow_NoticeVerify.prototype.version = "1.0";
