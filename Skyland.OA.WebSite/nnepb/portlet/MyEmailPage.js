define(new function () {
    var me = this;
    this.options = { key: 'myEmailDataList' };
    var models = {};
    var curData;


    var gvm = {
        htmlUrl: "nnepb/portlet/MyEmailPage.html",
        rowclick: function (sender, data) {
            $.Biz.emailinbox.choiceData = data;
            $.Biz.emailinbox.type = "view";
            if ($.Biz.emailinbox.isInitial) {
                $.Biz.emailinbox.fromGateView(data, 'view');
            }
            $.iwf.onmodulechange('m2.emailinbox:{type:"inbox"}');
        },
        fn: {
            changeyyyyMMdd: $.Com.formatDate
        },
        css: {
            //  root: uimodelcss,
            row: 'mcm-grid-row',
            rowSelected: 'mcm-gird-active',
            rowSplit: 'treeview-bar'
        },
    };
    var gridRoot;

    String.prototype.overHide = function (length) {
        var tmp = 0;
        var len = 0;
        var okLen = 0;
        var okStr = "";
        for (var i = 0; i < length; i++) {
            if (this.charCodeAt(i) > 255) tmp += 2; //大于255表示汉字，一个汉字为2个字符
            else len += 1;//小于等于255表示字符或者数字，为1个字符
            okLen += 1;   //计数器，等于length
            if (tmp + len == length) {
                okStr = this.substring(0, okLen);
                break;
            }
            if (tmp + len > length) {
                okStr = this.substring(0, okLen - 1);
                break;
            }
        }
        if (okStr < this) return okStr + "...";
        else return this + "";
    };


    this.show = function (module, root) {
        if (root.children().length > 0) {
            root.children().remove();
        }
        if (root.children().length == 0) {
            $.fxPost('B_Email_One_Svc.data?action=GetEmailGate', { top: '5', mailid: '' }, function (data) {
                root.css({ 'paddingTop': '5px' });


                //var url_dbx = 'index.html#m2.emailinbox:{title:"inbox"}'; // 收件箱
                //root.append(" <a href='" + url_dbx + "' class='btn btn-link'><span class='more'>更多>></span></a>");

                gridRoot = root.append('<div id="querymycaseroot" style="margin-top: 10px;"></div>').children().last();

                gvm.data = data.data;
                gridRoot.iwfGrid(gvm);
            },
            function (err) {
                root.text(err.msg);
            });
        }
    };

});



